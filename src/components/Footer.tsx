import { Droplets } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-crimson">
              <Droplets className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-heading text-base font-bold text-foreground">AnemiaDetect</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Smart Non-Invasive Anemia Detection System
          </p>
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
            <span>Tashinga P Ganya</span>
            <span>•</span>
            <span>Claret N Magutshwa</span>
          </div>
          <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
