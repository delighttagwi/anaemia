import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Droplets, ScanLine, Activity, Shield } from "lucide-react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";

const features = [
  { icon: ScanLine, title: "Multi-Modal Scanning", desc: "Analyze nail beds, fingerprints, and eye conjunctiva for comprehensive detection." },
  { icon: Activity, title: "Real-Time Analysis", desc: "AI-powered feature extraction estimates hemoglobin levels in seconds." },
  { icon: Shield, title: "Non-Invasive", desc: "No needles, no blood draws — just image-based analysis using optical sensing." },
  { icon: Droplets, title: "Hardware Integration", desc: "Connect MAX30102 + ESP32 sensors for enhanced SpO2 and heart rate readings." },
];

export default function Index() {
  return (
    <Layout>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-crimson-soft" />
        <div className="container relative mx-auto px-4 py-24 md:py-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="mx-auto max-w-3xl text-center"
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-1.5 text-sm font-medium text-secondary-foreground">
              <Droplets className="h-4 w-4" />
              Smart Healthcare Technology
            </div>
            <h1 className="mb-6 font-heading text-4xl font-extrabold leading-tight text-foreground md:text-6xl">
              Non-Invasive{" "}
              <span className="text-gradient-crimson">Anemia Detection</span>{" "}
              System
            </h1>
            <p className="mb-8 text-lg text-muted-foreground md:text-xl">
              Estimate hemoglobin levels instantly through image analysis of nail beds, 
              fingerprints, and eye conjunctiva — no blood samples required.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button asChild size="lg" className="gradient-crimson text-primary-foreground shadow-crimson hover:opacity-90 px-8">
                <Link to="/scan">Start Scan</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-primary text-primary hover:bg-secondary">
                <Link to="/about">Learn More</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Problem + Objectives */}
      <section className="container mx-auto px-4 py-20">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-4 font-heading text-3xl font-bold text-foreground">The Problem</h2>
          <p className="mb-12 text-muted-foreground">
            Anemia affects over 1.6 billion people globally. Traditional diagnosis requires invasive blood tests 
            that are costly, time-consuming, and inaccessible in remote areas. Our system provides a rapid, 
            affordable, and non-invasive alternative using image processing and optical sensing.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="rounded-xl border border-border bg-card p-6 transition-shadow hover:shadow-crimson"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-secondary">
                <f.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 font-heading text-lg font-semibold text-foreground">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </Layout>
  );
}
