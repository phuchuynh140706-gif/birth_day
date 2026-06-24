"use client";

import { motion } from "framer-motion";
import { unlockAudio } from "@/lib/sound";

interface StartScreenProps {
  onStart: () => void;
}

export default function StartScreen({ onStart }: StartScreenProps) {
  // Mở khóa âm thanh ngay khi người dùng tương tác lần đầu
  const handleStart = () => {
    unlockAudio();
    onStart();
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: -20 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="w-full max-w-[420px] rounded-3xl bg-white/80 p-7 text-center shadow-2xl backdrop-blur-md"
    >
      {/* Icon trang trí bay nhẹ */}
      <div className="mb-4 flex justify-center gap-3 text-4xl">
        <span className="animate-floaty">🎂</span>
        <span className="animate-floaty [animation-delay:0.3s]">🎁</span>
        <span className="animate-floaty [animation-delay:0.6s]">💖</span>
      </div>

      <h1 className="mb-3 text-2xl font-extrabold leading-snug text-purple-700">
        Có một nhiệm vụ bí mật dành cho bạn 🎂
      </h1>

      <p className="mb-7 text-base text-gray-600">
        Hoàn thành thử thách nhỏ này để mở khóa điều bất ngờ.
      </p>

      <motion.button
        whileTap={{ scale: 0.95 }}
        whileHover={{ scale: 1.03 }}
        onClick={handleStart}
        className="w-full rounded-2xl bg-gradient-to-r from-pink-500 to-purple-500 px-6 py-4 text-lg font-bold text-white shadow-lg shadow-pink-300/50"
      >
        Bắt đầu nhiệm vụ ✨
      </motion.button>
    </motion.div>
  );
}
