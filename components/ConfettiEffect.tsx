"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";

// Confetti thuần CSS/Framer Motion, không cần thư viện ngoài.
const PIECES = 36;
const COLORS = ["#f472b6", "#a78bfa", "#38bdf8", "#fbbf24", "#34d399"];
const SHAPES = ["🎉", "🎊", "✨", "💖", "🎈"];

export default function ConfettiEffect() {
  // Sinh ngẫu nhiên 1 lần để tránh nhảy lung tung mỗi lần render
  const pieces = useMemo(
    () =>
      Array.from({ length: PIECES }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 0.6,
        duration: 2.5 + Math.random() * 2,
        emoji: SHAPES[i % SHAPES.length],
        color: COLORS[i % COLORS.length],
        useEmoji: Math.random() > 0.5,
      })),
    []
  );

  return (
    <div className="pointer-events-none fixed inset-0 z-40 overflow-hidden">
      {pieces.map((p) => (
        <motion.div
          key={p.id}
          initial={{ y: -40, opacity: 0, rotate: 0 }}
          animate={{ y: "110vh", opacity: [0, 1, 1, 0.8], rotate: 360 }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{ left: `${p.left}%` }}
          className="absolute top-0 text-xl"
        >
          {p.useEmoji ? (
            p.emoji
          ) : (
            <span
              className="inline-block h-3 w-3 rounded-sm"
              style={{ backgroundColor: p.color }}
            />
          )}
        </motion.div>
      ))}
    </div>
  );
}
