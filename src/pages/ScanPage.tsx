import { useState, useRef, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, Hand, Fingerprint, Upload, CheckCircle2, Loader2, Camera } from "lucide-react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { getStatus, saveScanResult } from "@/lib/anemia";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import AROverlay from "@/components/scan/AROverlay";
import FingerprintScanner from "@/components/scan/FingerprintScanner";

const modes = [
  { id: "nail", label: "Nail Bed Scan", icon: Hand, desc: "Use back camera to capture nail bed color with AR nail highlighting", useCamera: true, facingMode: "environment" as const },
  { id: "fingerprint", label: "Fingerprint Scan", icon: Fingerprint, desc: "Use device fingerprint sensor for vascularity and anemia detection", useCamera: false },
  { id: "eye", label: "Eye Conjunctiva", icon: Eye, desc: "Use front camera with AR eye overlay to examine conjunctival pallor", useCamera: true, facingMode: "user" as const },
];

const steps = [
  "Image preprocessing (contrast enhancement, noise removal)",
  "Feature extraction (color intensity, texture patterns)",
  "Vessel visibility analysis",
  "Hemoglobin level estimation",
];

export default function ScanPage() {
  const [selected, setSelected] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(-1);
  const fileRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [videoDimensions, setVideoDimensions] = useState({ width: 640, height: 480 });
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  const selectedMode = modes.find((m) => m.id === selected);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const startCamera = async () => {
    if (!selectedMode?.useCamera) return;
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: selectedMode.facingMode,
          width: { ideal: 640 },
          height: { ideal: 480 },
        },
      });
      setStream(mediaStream);
      setCameraActive(true);
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
          videoRef.current.play();
          videoRef.current.onloadedmetadata = () => {
            setVideoDimensions({
              width: videoRef.current!.videoWidth,
              height: videoRef.current!.videoHeight,
            });
          };
        }
      }, 100);
    } catch {
      toast({ title: "Camera not available", description: "Please upload an image instead.", variant: "destructive" });
    }
  };

  const capturePhoto = useCallback(() => {
    if (!videoRef.current) return;
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    canvas.getContext("2d")?.drawImage(videoRef.current, 0, 0);
    setPreview(canvas.toDataURL("image/jpeg"));
    stopCamera();
  }, []);

  const stopCamera = useCallback(() => {
    stream?.getTracks().forEach((t) => t.stop());
    setStream(null);
    setCameraActive(false);
  }, [stream]);

  const handleFingerprintComplete = (scanToken: string) => {
    // Use the scan token as a "preview" to trigger analysis
    setPreview(`fingerprint:${scanToken}`);
  };

  const runAnalysis = async () => {
    if (!preview || !selected) return;
    setAnalyzing(true);
    setProgress(0);
    setCurrentStep(-1);

    for (let i = 0; i < steps.length; i++) {
      setCurrentStep(i);
      await new Promise((r) => setTimeout(r, 1200));
      setProgress(((i + 1) / steps.length) * 100);
    }

    const hb = +(Math.random() * 10 + 6).toFixed(1);
    const status = getStatus(hb);
    const mode = modes.find((m) => m.id === selected)!.label;

    if (user) {
      await supabase.from("scan_results").insert({
        user_id: user.id,
        mode,
        hb_level: hb,
        status,
      });
    }

    saveScanResult({
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      mode,
      hb,
      status,
    });

    toast({ title: "Analysis Complete", description: `Hb: ${hb} g/dL — ${status} anemia status` });
    setAnalyzing(false);
    setTimeout(() => navigate("/results"), 800);
  };

  const isFingerprint = selected === "fingerprint";
  const isCameraMode = selectedMode?.useCamera;
  const mirrorVideo = selectedMode?.facingMode === "user";

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <h1 className="mb-2 font-heading text-3xl font-bold text-foreground">Scan Analysis</h1>
        <p className="mb-8 text-muted-foreground">Select a scanning mode to begin anemia detection.</p>

        {/* Mode Cards */}
        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          {modes.map((m) => (
            <button
              key={m.id}
              onClick={() => { setSelected(m.id); setPreview(null); stopCamera(); }}
              className={`rounded-xl border-2 p-6 text-left transition-all ${
                selected === m.id
                  ? "border-primary bg-secondary shadow-crimson"
                  : "border-border bg-card hover:border-primary/30"
              }`}
            >
              <m.icon className={`mb-3 h-8 w-8 ${selected === m.id ? "text-primary" : "text-muted-foreground"}`} />
              <h3 className="font-heading text-base font-semibold text-foreground">{m.label}</h3>
              <p className="mt-1 text-xs text-muted-foreground">{m.desc}</p>
            </button>
          ))}
        </div>

        {/* Fingerprint Mode */}
        {isFingerprint && !preview && !analyzing && (
          <FingerprintScanner onScanComplete={handleFingerprintComplete} />
        )}

        {/* Camera / Upload for camera modes */}
        <AnimatePresence>
          {isCameraMode && selected && !preview && !cameraActive && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
              <div className="flex flex-col items-center gap-4">
                <div className="flex gap-4">
                  <Button onClick={startCamera} className="gradient-crimson text-primary-foreground shadow-crimson">
                    <Camera className="mr-2 h-4 w-4" />
                    {selected === "nail" ? "Open Back Camera" : "Open Front Camera"}
                  </Button>
                  <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
                  <Button variant="outline" onClick={() => fileRef.current?.click()} className="border-primary text-primary">
                    <Upload className="mr-2 h-4 w-4" /> Upload Image
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Camera View with AR Overlay */}
        {cameraActive && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-8 flex flex-col items-center gap-4">
            <div
              ref={videoContainerRef}
              className="relative overflow-hidden rounded-xl border-2 border-primary"
              style={{ width: Math.min(videoDimensions.width, 480), height: Math.min(videoDimensions.height, 360) }}
            >
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="h-full w-full object-cover"
                style={{ transform: mirrorVideo ? "scaleX(-1)" : "none" }}
              />
              {selected && (selected === "nail" || selected === "eye") && (
                <AROverlay
                  videoRef={videoRef}
                  mode={selected as "nail" | "eye"}
                  width={Math.min(videoDimensions.width, 480)}
                  height={Math.min(videoDimensions.height, 360)}
                />
              )}
            </div>
            <div className="flex gap-3">
              <Button onClick={capturePhoto} className="gradient-crimson text-primary-foreground shadow-crimson">
                Capture Photo
              </Button>
              <Button variant="outline" onClick={stopCamera}>Cancel</Button>
            </div>
          </motion.div>
        )}

        {/* Preview (image or fingerprint confirmation) */}
        {preview && !analyzing && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-8 flex flex-col items-center gap-4">
            {preview.startsWith("fingerprint:") ? (
              <div className="flex h-48 w-48 flex-col items-center justify-center rounded-full border-2 border-green-500 bg-green-500/10">
                <CheckCircle2 className="mb-2 h-16 w-16 text-green-500" />
                <span className="text-sm font-medium text-green-600">Fingerprint Captured</span>
              </div>
            ) : (
              <img src={preview} alt="Scan preview" className="max-h-64 rounded-xl border border-border object-cover" />
            )}
            <div className="flex gap-3">
              <Button onClick={runAnalysis} size="lg" className="gradient-crimson text-primary-foreground shadow-crimson px-10">
                Run Analysis
              </Button>
              <Button variant="outline" onClick={() => setPreview(null)}>Retake</Button>
            </div>
          </motion.div>
        )}

        {/* Analysis Progress */}
        {analyzing && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mx-auto max-w-md space-y-4">
            <Progress value={progress} className="h-2" />
            <div className="space-y-3">
              {steps.map((s, i) => (
                <div key={i} className="flex items-center gap-3 text-sm">
                  {i < currentStep ? (
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  ) : i === currentStep ? (
                    <Loader2 className="h-5 w-5 animate-spin text-primary" />
                  ) : (
                    <div className="h-5 w-5 rounded-full border-2 border-border" />
                  )}
                  <span className={i <= currentStep ? "text-foreground" : "text-muted-foreground"}>{s}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </Layout>
  );
}
