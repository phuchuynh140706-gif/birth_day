"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { playGlitch } from "@/lib/sound";

interface FreezeScreenProps {
  onDone: () => void;
}

// Các dòng chữ "giả lập đang tải" hiện lần lượt
const MESSAGES = [
  "Đang mở khóa phần quà...",
  "Loading... 99%",
  "Hmm... sao lâu vậy ta 🤔",
  "Oops! Màn hình hình như bị đơ rồi 😵‍💫",
];

export default function FreezeScreen({ onDone }: FreezeScreenProps) {
  const [msgIndex, setMsgIndex] = useState(0);
  const [shake, setShake] = useState(false);

  // Lần lượt đổi dòng chữ
  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIndex((i) => Math.min(i + 1, MESSAGES.length - 1));
    }, 1100);
    return () => clearInterval(interval);
  }, []);

  // Sau ~4.5s: rung nhẹ rồi chuyển sang reveal
  useEffect(() => {
    // Vài tiếng "lỗi" rải rác cho ra chất glitch
    const g1 = setTimeout(playGlitch, 800);
    const g2 = setTimeout(playGlitch, 2200);
    const shakeTimer = setTimeout(() => {
      setShake(true);
      playGlitch();
    }, 4000);
    const doneTimer = setTimeout(onDone, 4800);
    return () => {
      clearTimeout(g1);
      clearTimeout(g2);
      clearTimeout(shakeTimer);
      clearTimeout(doneTimer);
    };
  }, [onDone]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`scanlines fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden bg-[#15151c] text-gray-200 ${
        shake ? "animate-shake" : ""
      }`}
    >
      {/* Hiệu ứng glitch */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <span className="animate-glitch text-6xl opacity-30 select-none">
          ⚙️
        </span>
      </div>

      <motion.div
        animate={{ rotate: [0, 360] }}
        transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
        className="mb-6 text-5xl"
      >
        ⏳
      </motion.div>

      <p className="px-8 text-center text-lg font-semibold tracking-wide">
        {MESSAGES[msgIndex]}
      </p>

      {/* Loading bar đứng ở 99% */}
      <div className="mt-6 h-2 w-56 overflow-hidden rounded-full bg-gray-700">
        <motion.div
          className="h-full bg-gradient-to-r from-pink-400 to-purple-400"
          initial={{ width: "10%" }}
          animate={{ width: "99%" }}
          transition={{ duration: 3.5, ease: "easeOut" }}
        />
      </div>

      <p className="mt-3 text-xs text-gray-500">Đừng tắt máy nha 😉</p>
    </motion.div>
  );
}
