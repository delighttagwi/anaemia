import { motion } from "framer-motion";
import { Bluetooth, Heart, Activity, Sun, Zap } from "lucide-react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const sensorSpecs = [
  { icon: Heart, label: "Heart Rate Monitoring", desc: "Real-time BPM tracking via photoplethysmography" },
  { icon: Activity, label: "SpO2 Measurement", desc: "Blood oxygen saturation estimation" },
  { icon: Sun, label: "Red Light Absorption", desc: "660nm wavelength for deoxyhemoglobin detection" },
  { icon: Zap, label: "IR Absorption", desc: "940nm infrared for oxyhemoglobin measurement" },
];

export default function HardwarePage() {
  const { toast } = useToast();

  const handleConnect = () => {
    toast({
      title: "Hardware Not Connected",
      description: "MAX30102 + ESP32 hardware integration coming soon. This is a placeholder for future Bluetooth/WiFi connectivity.",
    });
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <h1 className="mb-2 font-heading text-3xl font-bold text-foreground">Hardware Sensor Data</h1>
        <p className="mb-8 text-muted-foreground">MAX30102 + ESP32 optical sensor integration (coming soon).</p>

        <div className="mb-8">
          <Button onClick={handleConnect} className="gradient-crimson text-primary-foreground shadow-crimson">
            <Bluetooth className="mr-2 h-4 w-4" /> Connect Device
          </Button>
          <p className="mt-2 text-xs text-muted-foreground">Hardware connection is not yet available. This button is a placeholder.</p>
        </div>

        <h2 className="mb-4 font-heading text-xl font-semibold text-foreground">Sensor Capabilities</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {sensorSpecs.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="rounded-xl border border-border bg-card p-6 text-center"
            >
              <s.icon className="mx-auto mb-3 h-8 w-8 text-primary" />
              <h3 className="font-heading text-sm font-semibold text-foreground">{s.label}</h3>
              <p className="mt-1 text-xs text-muted-foreground">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
