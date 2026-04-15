import { useEffect, useRef } from "react";

interface AROverlayProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  mode: "nail" | "eye" | "fingerprint";
  width: number;
  height: number;
}

export default function AROverlay({ videoRef, mode, width, height }: AROverlayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let pulse = 0;

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      pulse = (pulse + 0.03) % (Math.PI * 2);
      const alpha = 0.4 + Math.sin(pulse) * 0.3;

      if (mode === "nail") {
        drawNailGuide(ctx, width, height, alpha);
      } else if (mode === "eye") {
        drawEyeGuide(ctx, width, height, alpha);
      }

      animRef.current = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(animRef.current);
  }, [mode, width, height]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className="pointer-events-none absolute inset-0"
      style={{ width, height }}
    />
  );
}

function drawNailGuide(ctx: CanvasRenderingContext2D, w: number, h: number, alpha: number) {
  const cx = w / 2;
  const cy = h / 2;

  // Draw 5 nail outlines (finger tips)
  const nailW = w * 0.08;
  const nailH = h * 0.14;
  const spacing = nailW * 2.2;
  const startX = cx - spacing * 2;

  ctx.strokeStyle = `rgba(220, 20, 60, ${alpha})`;
  ctx.lineWidth = 2;
  ctx.setLineDash([6, 4]);

  for (let i = 0; i < 5; i++) {
    const nx = startX + i * spacing;
    const ny = cy - nailH / 2;

    // Rounded rectangle for nail shape
    ctx.beginPath();
    const r = nailW * 0.4;
    ctx.moveTo(nx + r, ny);
    ctx.lineTo(nx + nailW - r, ny);
    ctx.arcTo(nx + nailW, ny, nx + nailW, ny + r, r);
    ctx.lineTo(nx + nailW, ny + nailH - r);
    ctx.arcTo(nx + nailW, ny + nailH, nx + nailW - r, ny + nailH, r);
    ctx.lineTo(nx + r, ny + nailH);
    ctx.arcTo(nx, ny + nailH, nx, ny + nailH - r, r);
    ctx.lineTo(nx, ny + r);
    ctx.arcTo(nx, ny, nx + r, ny, r);
    ctx.closePath();
    ctx.stroke();
  }

  ctx.setLineDash([]);

  // Label
  ctx.fillStyle = `rgba(220, 20, 60, ${Math.min(alpha + 0.3, 1)})`;
  ctx.font = "bold 14px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("Align fingernails within guides", cx, h - 20);

  // Corner brackets
  drawCorners(ctx, w * 0.1, h * 0.15, w * 0.8, h * 0.7, alpha);
}

function drawEyeGuide(ctx: CanvasRenderingContext2D, w: number, h: number, alpha: number) {
  const cx = w / 2;
  const cy = h / 2;

  // Draw two eye shapes
  const eyeW = w * 0.18;
  const eyeH = h * 0.12;
  const gap = w * 0.08;

  ctx.strokeStyle = `rgba(220, 20, 60, ${alpha})`;
  ctx.lineWidth = 2;
  ctx.setLineDash([6, 4]);

  // Left eye
  drawEyeShape(ctx, cx - gap - eyeW / 2, cy, eyeW, eyeH);
  // Right eye
  drawEyeShape(ctx, cx + gap + eyeW / 2, cy, eyeW, eyeH);

  ctx.setLineDash([]);

  // Conjunctiva indicators - small circles inside eyes
  ctx.strokeStyle = `rgba(220, 20, 60, ${alpha * 0.7})`;
  ctx.lineWidth = 1.5;

  // Left eye inner
  ctx.beginPath();
  ctx.arc(cx - gap - eyeW * 0.15, cy, eyeH * 0.25, 0, Math.PI * 2);
  ctx.stroke();

  // Right eye inner
  ctx.beginPath();
  ctx.arc(cx + gap + eyeW * 0.15, cy, eyeH * 0.25, 0, Math.PI * 2);
  ctx.stroke();

  // Label
  ctx.fillStyle = `rgba(220, 20, 60, ${Math.min(alpha + 0.3, 1)})`;
  ctx.font = "bold 14px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("Position eyes within guides — look up slightly", cx, h - 20);

  // Corner brackets
  drawCorners(ctx, w * 0.15, h * 0.2, w * 0.7, h * 0.6, alpha);
}

function drawEyeShape(ctx: CanvasRenderingContext2D, cx: number, cy: number, w: number, h: number) {
  ctx.beginPath();
  ctx.moveTo(cx - w / 2, cy);
  ctx.quadraticCurveTo(cx, cy - h, cx + w / 2, cy);
  ctx.quadraticCurveTo(cx, cy + h, cx - w / 2, cy);
  ctx.closePath();
  ctx.stroke();
}

function drawCorners(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, alpha: number) {
  const len = 20;
  ctx.strokeStyle = `rgba(220, 20, 60, ${alpha})`;
  ctx.lineWidth = 3;
  ctx.setLineDash([]);

  // Top-left
  ctx.beginPath();
  ctx.moveTo(x, y + len); ctx.lineTo(x, y); ctx.lineTo(x + len, y);
  ctx.stroke();
  // Top-right
  ctx.beginPath();
  ctx.moveTo(x + w - len, y); ctx.lineTo(x + w, y); ctx.lineTo(x + w, y + len);
  ctx.stroke();
  // Bottom-left
  ctx.beginPath();
  ctx.moveTo(x, y + h - len); ctx.lineTo(x, y + h); ctx.lineTo(x + len, y + h);
  ctx.stroke();
  // Bottom-right
  ctx.beginPath();
  ctx.moveTo(x + w - len, y + h); ctx.lineTo(x + w, y + h); ctx.lineTo(x + w, y + h - len);
  ctx.stroke();
}
