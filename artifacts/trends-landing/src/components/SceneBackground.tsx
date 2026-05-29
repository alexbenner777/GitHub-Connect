import { useEffect, useMemo, useState } from "react";
import { motion, useSpring, useTransform, useMotionValue } from "framer-motion";

const SPRING = { stiffness: 40, damping: 20, mass: 1 };

function sr(seed: number) {
  const x = Math.sin(seed + 1) * 10000;
  return x - Math.floor(x);
}

export function SceneBackground() {
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const springX = useSpring(rawX, SPRING);
  const springY = useSpring(rawY, SPRING);

  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      rawX.set((e.clientX / window.innerWidth - 0.5) * 2);
      rawY.set((e.clientY / window.innerHeight - 0.5) * 2);
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [rawX, rawY]);

  const x0 = useTransform(springX, v => v * 8);
  const y0 = useTransform(springY, v => v * 6);
  const x1 = useTransform(springX, v => v * 20);
  const y1 = useTransform(springY, v => v * 14);

  // Reduced from 16 to 7 blobs — large blurs are expensive, fewer elements
  const blobs = useMemo(() => [
    { id: 0, left: 10, top: 15, size: 480, color: "rgba(0,212,255,0.18)", blur: 90, dur: 18, dx: 30, dy: 20, layer: 0 },
    { id: 1, left: 80, top: 5, size: 560, color: "rgba(123,94,255,0.20)", blur: 80, dur: 22, dx: -25, dy: 30, layer: 0 },
    { id: 2, left: 50, top: 70, size: 400, color: "rgba(123,94,255,0.16)", blur: 75, dur: 20, dx: 20, dy: -20, layer: 0 },
    { id: 3, left: 15, top: 60, size: 300, color: "rgba(0,212,255,0.15)", blur: 60, dur: 16, dx: -20, dy: 15, layer: 1 },
    { id: 4, left: 75, top: 50, size: 260, color: "rgba(123,94,255,0.18)", blur: 55, dur: 14, dx: 18, dy: -18, layer: 1 },
    { id: 5, left: 35, top: 30, size: 220, color: "rgba(0,212,255,0.14)", blur: 45, dur: 12, dx: -15, dy: 22, layer: 1 },
    { id: 6, left: 60, top: 85, size: 360, color: "rgba(0,180,255,0.14)", blur: 70, dur: 24, dx: 22, dy: -12, layer: 0 },
  ], []);

  // Reduced from 50 to 18 particles
  const particles = useMemo(() => Array.from({ length: 18 }, (_, i) => ({
    id: i,
    left: sr(i * 41) * 100,
    size: 1.5 + sr(i * 43) * 1.5,
    opacity: 0.3 + sr(i * 47) * 0.4,
    dur: 16 + sr(i * 47) * 14,
    dly: sr(i * 53) * -25,
    sway: sr(i * 59) * 50 - 25,
    isCyan: sr(i * 3) > 0.5,
  })), []);

  return (
    <div
      className="fixed inset-0 overflow-hidden pointer-events-none"
      style={{ zIndex: 0, willChange: "transform" }}
      aria-hidden
    >
      {/* Base radial gradient — static, no animation */}
      <div
        className="absolute inset-0"
        style={{
          background: [
            "radial-gradient(ellipse 90% 55% at 20% 10%, rgba(0,212,255,0.08) 0%, transparent 65%)",
            "radial-gradient(ellipse 70% 55% at 85% 5%, rgba(123,94,255,0.10) 0%, transparent 60%)",
            "radial-gradient(ellipse 60% 45% at 75% 95%, rgba(123,94,255,0.09) 0%, transparent 60%)",
            "radial-gradient(ellipse 50% 40% at 10% 90%, rgba(0,212,255,0.07) 0%, transparent 55%)",
            "hsl(220,40%,20%)",
          ].join(", "),
        }}
      />

      {/* Perspective grid — rendered only after mount */}
      {mounted && (
        <>
          <div
            className="absolute inset-x-0 bottom-0 pointer-events-none"
            style={{
              height: "72%",
              backgroundImage: [
                "linear-gradient(rgba(0,212,255,0.18) 1px, transparent 1px)",
                "linear-gradient(90deg, rgba(0,212,255,0.10) 1px, transparent 1px)",
              ].join(", "),
              backgroundSize: "70px 70px",
              transform: "perspective(500px) rotateX(60deg)",
              transformOrigin: "50% 100%",
              maskImage: "linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.6) 30%, transparent 65%)",
              WebkitMaskImage: "linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.6) 30%, transparent 65%)",
            }}
          />
          <div
            className="absolute inset-x-0 bottom-0"
            style={{
              height: "28%",
              backgroundImage: [
                "linear-gradient(rgba(0,212,255,0.32) 1px, transparent 1px)",
                "linear-gradient(90deg, rgba(0,212,255,0.16) 1px, transparent 1px)",
              ].join(", "),
              backgroundSize: "70px 70px",
              transform: "perspective(500px) rotateX(60deg)",
              transformOrigin: "50% 100%",
              maskImage: "linear-gradient(to top, rgba(0,0,0,1) 0%, transparent 70%)",
              WebkitMaskImage: "linear-gradient(to top, rgba(0,0,0,1) 0%, transparent 70%)",
            }}
          />
        </>
      )}

      {/* Blob layer 0 — slow parallax */}
      <motion.div
        className="absolute inset-0"
        style={{ x: x0, y: y0, willChange: "transform" }}
      >
        {blobs.filter(b => b.layer === 0).map(b => (
          <motion.div
            key={b.id}
            className="absolute rounded-full"
            style={{
              left: `${b.left}%`,
              top: `${b.top}%`,
              width: b.size,
              height: b.size,
              background: b.color,
              filter: `blur(${b.blur}px)`,
              transform: "translate(-50%,-50%)",
              willChange: "transform",
            }}
            animate={{ x: [0, b.dx, 0], y: [0, b.dy, 0] }}
            transition={{ duration: b.dur, repeat: Infinity, ease: "easeInOut", repeatType: "mirror" }}
          />
        ))}
      </motion.div>

      {/* Blob layer 1 — faster parallax */}
      <motion.div
        className="absolute inset-0"
        style={{ x: x1, y: y1, willChange: "transform" }}
      >
        {blobs.filter(b => b.layer === 1).map(b => (
          <motion.div
            key={b.id}
            className="absolute rounded-full"
            style={{
              left: `${b.left}%`,
              top: `${b.top}%`,
              width: b.size,
              height: b.size,
              background: b.color,
              filter: `blur(${b.blur}px)`,
              transform: "translate(-50%,-50%)",
              willChange: "transform",
            }}
            animate={{ x: [0, b.dx, 0], y: [0, b.dy, 0] }}
            transition={{ duration: b.dur, repeat: Infinity, ease: "easeInOut", repeatType: "mirror" }}
          />
        ))}
      </motion.div>

      {/* Particles — CSS animation only, no Framer Motion per-particle */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map(p => (
          <div
            key={p.id}
            className="absolute rounded-full"
            style={{
              left: `${p.left}%`,
              bottom: "-4px",
              width: p.size,
              height: p.size,
              background: p.isCyan
                ? `rgba(0,212,255,${p.opacity})`
                : `rgba(180,150,255,${p.opacity})`,
              animation: `particleRise ${p.dur}s ${p.dly}s linear infinite`,
              "--sway": `${p.sway}px`,
            } as React.CSSProperties}
          />
        ))}
      </div>

      {/* 2 aurora bands (down from 4) */}
      {[
        { top: "20%", color: "rgba(0,212,255,0.11)", dur: 16 },
        { top: "58%", color: "rgba(123,94,255,0.10)", dur: 20 },
      ].map((band, i) => (
        <motion.div
          key={`aurora-${i}`}
          className="absolute left-1/2 pointer-events-none"
          style={{
            top: band.top,
            width: "150%",
            height: "100px",
            x: "-50%",
            background: `radial-gradient(ellipse 100% 50% at 50% 50%, ${band.color} 0%, transparent 70%)`,
            filter: "blur(24px)",
            mixBlendMode: "screen",
            willChange: "transform, opacity",
          }}
          animate={{
            scaleX: [1, 0.88, 1.08, 1],
            opacity: [0.6, 1, 0.65, 0.6],
          }}
          transition={{ duration: band.dur, delay: i * -6, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}

      {/* Slow ambient color wash — single animation instead of background interpolation */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ zIndex: 0 }}
        animate={{ opacity: [0.5, 0.85, 0.5] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      >
        <div
          className="absolute inset-0"
          style={{
            background: "radial-gradient(ellipse 120% 60% at 0% 50%, rgba(0,212,255,0.06) 0%, transparent 60%), radial-gradient(ellipse 80% 80% at 100% 20%, rgba(123,94,255,0.08) 0%, transparent 55%)",
          }}
        />
      </motion.div>
    </div>
  );
}
