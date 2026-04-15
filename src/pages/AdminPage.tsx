import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Upload, Trash2, Image, ShieldCheck } from "lucide-react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Navigate } from "react-router-dom";

const categories = [
  { value: "eye_healthy", label: "Eye Conjunctiva - Healthy" },
  { value: "eye_sick", label: "Eye Conjunctiva - Anemic" },
  { value: "nail_healthy", label: "Nail Bed - Healthy" },
  { value: "nail_sick", label: "Nail Bed - Anemic" },
];

interface RefImage {
  id: string;
  category: string;
  image_url: string;
  label: string | null;
  created_at: string;
}

export default function AdminPage() {
  const { user, isAdmin, loading } = useAuth();
  const [category, setCategory] = useState("eye_healthy");
  const [label, setLabel] = useState("");
  const [images, setImages] = useState<RefImage[]>([]);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    const { data } = await supabase.from("reference_images").select("*").order("created_at", { ascending: false });
    if (data) setImages(data);
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    setUploading(true);

    const ext = file.name.split(".").pop();
    const path = `${category}/${crypto.randomUUID()}.${ext}`;

    const { error: uploadError } = await supabase.storage.from("reference-images").upload(path, file);
    if (uploadError) {
      toast({ title: "Upload failed", description: uploadError.message, variant: "destructive" });
      setUploading(false);
      return;
    }

    const { data: { publicUrl } } = supabase.storage.from("reference-images").getPublicUrl(path);

    const { error: insertError } = await supabase.from("reference_images").insert({
      category,
      image_url: publicUrl,
      label: label || null,
      uploaded_by: user.id,
    });

    if (insertError) {
      toast({ title: "Error saving", description: insertError.message, variant: "destructive" });
    } else {
      toast({ title: "Image uploaded successfully" });
      setLabel("");
      fetchImages();
    }
    setUploading(false);
  };

  const deleteImage = async (img: RefImage) => {
    const pathMatch = img.image_url.match(/reference-images\/(.+)$/);
    if (pathMatch) {
      await supabase.storage.from("reference-images").remove([pathMatch[1]]);
    }
    await supabase.from("reference_images").delete().eq("id", img.id);
    fetchImages();
    toast({ title: "Image deleted" });
  };

  if (loading) return <Layout><div className="container mx-auto px-4 py-12 text-center text-muted-foreground">Loading...</div></Layout>;
  if (!user || !isAdmin) return <Navigate to="/auth" replace />;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8 flex items-center gap-3">
          <ShieldCheck className="h-8 w-8 text-primary" />
          <h1 className="font-heading text-3xl font-bold text-foreground">Admin Panel</h1>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Upload Section */}
          <div className="space-y-4">
            <h2 className="font-heading text-lg font-semibold text-foreground">Upload Reference Images</h2>
            <div className="rounded-xl border border-border bg-card p-6 space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">Category</label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => (
                      <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">Label (optional)</label>
                <Input value={label} onChange={(e) => setLabel(e.target.value)} placeholder="e.g., Normal hemoglobin level" />
              </div>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleUpload} />
              <button
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
                className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-primary/30 bg-secondary/50 p-8 text-sm font-medium text-muted-foreground hover:border-primary disabled:opacity-50"
              >
                <Upload className="h-5 w-5 text-primary" />
                {uploading ? "Uploading..." : "Click to upload image"}
              </button>
            </div>
          </div>

          {/* Images List */}
          <div className="space-y-4">
            <h2 className="font-heading text-lg font-semibold text-foreground">Uploaded Reference Images</h2>
            {categories.map((cat) => {
              const catImages = images.filter((i) => i.category === cat.value);
              if (catImages.length === 0) return null;
              return (
                <div key={cat.value} className="space-y-2">
                  <h3 className="text-sm font-medium text-primary">{cat.label}</h3>
                  {catImages.map((img) => (
                    <motion.div
                      key={img.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex items-center gap-3 rounded-lg border border-border bg-card p-3"
                    >
                      <img src={img.image_url} alt={img.label || ""} className="h-12 w-12 rounded object-cover" />
                      <div className="flex-1 min-w-0">
                        <p className="truncate text-sm text-foreground">{img.label || "No label"}</p>
                        <p className="text-xs text-muted-foreground">{new Date(img.created_at).toLocaleDateString()}</p>
                      </div>
                      <button onClick={() => deleteImage(img)} className="text-muted-foreground hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </motion.div>
                  ))}
                </div>
              );
            })}
            {images.length === 0 && (
              <div className="rounded-xl border border-border bg-card p-8 text-center text-sm text-muted-foreground">
                No reference images uploaded yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
