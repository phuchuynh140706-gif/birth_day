"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { playGlitch } from "@/lib/sound";

interface FreezeScreenProps {
  onDone: () => void;
}

// Tổng thời gian "giả vờ đơ" trước khi hiện bất ngờ (ms) — troll 15 giây
const FREEZE_DURATION = 15000;

// Các dòng chữ "giả lập đang tải" hiện lần lượt rồi ĐỨNG HẲN ở dòng cuối
const MESSAGES = [
  "Đang mở khóa phần quà...",
  "Loading... 97%",
  "Loading... 98%",
  "Loading... 99%",
  "Hmm... sao lâu vậy ta 🤔",
  "Chắc mạng lag rồi 😬",
  "Oops! Màn hình hình như bị đơ rồi 😵‍💫",
  "Đứng hình luôn rồi 🥶",
];

export default function FreezeScreen({ onDone }: FreezeScreenProps) {
  const [msgIndex, setMsgIndex] = useState(0);
  const [shake, setShake] = useState(false);

  // Lần lượt đổi dòng chữ rồi dừng hẳn ở dòng cuối (giả vờ treo máy)
  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIndex((i) => {
        if (i >= MESSAGES.length - 1) {
          clearInterval(interval);
          return i;
        }
        return i + 1;
      });
    }, 1400);
    return () => clearInterval(interval);
  }, []);

  // Sau đúng 15s mới rung nhẹ rồi chuyển sang reveal
  useEffect(() => {
    // Vài tiếng "lỗi" rải rác cho ra chất glitch trong lúc "đơ"
    const glitches = [1000, 3000, 6000, 9000, 12000].map((t) =>
      setTimeout(playGlitch, t)
    );
    const shakeTimer = setTimeout(() => {
      setShake(true);
      playGlitch();
    }, FREEZE_DURATION - 700);
    const doneTimer = setTimeout(onDone, FREEZE_DURATION);
    return () => {
      glitches.forEach(clearTimeout);
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
