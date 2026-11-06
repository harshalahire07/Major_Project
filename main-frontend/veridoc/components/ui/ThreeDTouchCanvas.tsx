"use client";

import React, { useEffect, useRef } from "react";

interface Point3D {
  x: number;
  y: number;
  z: number;
  baseX: number;
  baseY: number;
  baseZ: number;
  size: number;
  color: string;
  speed: number;
}

export default function ThreeDTouchCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 600);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      height = canvas.height = canvas.parentElement?.clientHeight || 600;
    };
    window.addEventListener("resize", handleResize);

    // Mouse tracking with inertia
    let mouseX = 0;
    let mouseY = 0;
    let targetRotX = 0;
    let targetRotY = 0;
    let currentRotX = 0;
    let currentRotY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const clientX = e.clientX - rect.left;
      const clientY = e.clientY - rect.top;
      mouseX = clientX - width / 2;
      mouseY = clientY - height / 2;
      targetRotY = (mouseX / (width / 2)) * 0.45;
      targetRotX = -(mouseY / (height / 2)) * 0.45;
    };

    window.addEventListener("mousemove", handleMouseMove);

    // Generate 3D Points in zero-gravity space
    const count = 75;
    const points: Point3D[] = [];
    const colors = [
      "rgba(16, 185, 129, ", // Emerald
      "rgba(59, 130, 246, ", // Sky Blue
      "rgba(168, 85, 247, ", // Violet
      "rgba(148, 163, 184, ", // Slate
    ];

    for (let i = 0; i < count; i++) {
      const radius = 240 + Math.random() * 260;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);

      points.push({
        x,
        y,
        z,
        baseX: x,
        baseY: y,
        baseZ: z,
        size: 1.5 + Math.random() * 2.5,
        color: colors[Math.floor(Math.random() * colors.length)],
        speed: 0.0008 + Math.random() * 0.0015,
      });
    }

    const focalLength = 400;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Smooth camera rotation inertia
      currentRotX += (targetRotX - currentRotX) * 0.05;
      currentRotY += (targetRotY - currentRotY) * 0.05;

      const cosY = Math.cos(currentRotY);
      const sinY = Math.sin(currentRotY);
      const cosX = Math.cos(currentRotX);
      const sinX = Math.sin(currentRotX);

      // Projected points collection for depth sorting
      const projected: { x2d: number; y2d: number; z: number; size: number; color: string }[] = [];

      for (let i = 0; i < points.length; i++) {
        const p = points[i];

        // Orbit drift
        const baseAngle = p.speed;
        const tempX = p.baseX * Math.cos(baseAngle) - p.baseZ * Math.sin(baseAngle);
        const tempZ = p.baseX * Math.sin(baseAngle) + p.baseZ * Math.cos(baseAngle);
        p.baseX = tempX;
        p.baseZ = tempZ;

        // Apply mouse rotation around Y axis then X axis
        let x1 = tempX * cosY - tempZ * sinY;
        let z1 = tempX * sinY + tempZ * cosY;

        let y2 = p.baseY * cosX - z1 * sinX;
        let z2 = p.baseY * sinX + z1 * cosX;

        // Translate in Z to keep in front of camera
        const zCamera = z2 + 550;
        if (zCamera > 20) {
          const scale = focalLength / zCamera;
          const x2d = width / 2 + x1 * scale;
          const y2d = height / 2 + y2 * scale;
          projected.push({
            x2d,
            y2d,
            z: zCamera,
            size: p.size * scale,
            color: p.color,
          });
        }
      }

      // Sort points by distance (back to front)
      projected.sort((a, b) => b.z - a.z);

      // Draw connective lines between close 3D nodes
      ctx.lineWidth = 0.5;
      for (let i = 0; i < projected.length; i++) {
        for (let j = i + 1; j < projected.length; j++) {
          const dx = projected[i].x2d - projected[j].x2d;
          const dy = projected[i].y2d - projected[j].y2d;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 85) {
            const alpha = (1 - dist / 85) * 0.15;
            ctx.strokeStyle = `rgba(100, 116, 139, ${alpha})`;
            ctx.beginPath();
            ctx.moveTo(projected[i].x2d, projected[i].y2d);
            ctx.lineTo(projected[j].x2d, projected[j].y2d);
            ctx.stroke();
          }
        }
      }

      // Draw projected nodes
      for (let i = 0; i < projected.length; i++) {
        const pt = projected[i];
        const alpha = Math.min(1, Math.max(0.15, (800 - pt.z) / 600));

        ctx.fillStyle = `${pt.color}${alpha})`;
        ctx.beginPath();
        ctx.arc(pt.x2d, pt.y2d, Math.max(0.8, pt.size), 0, Math.PI * 2);
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none opacity-40 dark:opacity-30 -z-10"
    />
  );
}
