"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import ConfettiEffect from "./ConfettiEffect";
import QRGift from "./QRGift";
import { playFanfare, toggleMute, isMuted } from "@/lib/sound";

interface BirthdayRevealProps {
  onReplay: () => void; // Chơi lại mini game
  onReveal: () => void; // Xem lại bất ngờ (chạy lại freeze -> reveal)
}

// ====== LỜI CHÚC (chỉnh ở đây cho dễ) ======
const TITLE = "Bất ngờ chưa 🎉";
const MAIN_LINE = "Chúc mừng sinh nhật nhaaa!";
const WISH =
  "Chúc bạn tuổi mới thật nhiều niềm vui, luôn xinh đẹp, may mắn, học tốt/làm tốt và lúc nào cũng cười thật tươi. Hôm nay là ngày của bạn nên phải thật vui đó nha 🎂✨";
const TROLL = "Lúc nãy không phải máy đơ đâu, là bất ngờ đang load đó 😆";
// ===========================================

export default function BirthdayReveal({
  onReplay,
  onReveal,
}: BirthdayRevealProps) {
  // Nếu không có ảnh thật thì dùng placeholder emoji
  const [imgError, setImgError] = useState(false);
  const [mute, setMute] = useState(isMuted());

  // Phát nhạc chúc mừng khi màn reveal hiện ra
  useEffect(() => {
    playFanfare();
  }, []);

  const handleMute = () => setMute(toggleMute());

  return (
    <>
      <ConfettiEffect />

      {/* Bóng bay / trái tim bay nhẹ phía nền */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        {["🎈", "💖", "🎈", "💜", "🎈"].map((e, i) => (
          <motion.span
            key={i}
            className="absolute bottom-0 text-3xl"
            style={{ left: `${10 + i * 20}%` }}
            initial={{ y: 0, opacity: 0 }}
            animate={{ y: "-110vh", opacity: [0, 1, 1, 0] }}
            transition={{
              duration: 6 + i,
              delay: i * 0.5,
              repeat: Infinity,
              ease: "easeIn",
            }}
          >
            {e}
          </motion.span>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ type: "spring", stiffness: 120, damping: 14 }}
        className="relative z-10 w-full max-w-[420px] rounded-3xl bg-white/85 p-6 text-center shadow-2xl backdrop-blur-md"
      >
        {/* Nút tắt/bật tiếng */}
        <button
          onClick={handleMute}
          aria-label={mute ? "Bật tiếng" : "Tắt tiếng"}
          className="absolute right-4 top-4 rounded-full bg-white/80 px-2 py-1 text-lg shadow ring-1 ring-purple-200"
        >
          {mute ? "🔇" : "🔊"}
        </button>

        <h1 className="mb-1 text-2xl font-extrabold text-purple-700">{TITLE}</h1>
        <p className="mb-4 text-lg font-bold text-pink-600">{MAIN_LINE}</p>

        {/* Khung ảnh sinh nhật */}
        <div className="relative mx-auto mb-4 aspect-square w-full overflow-hidden rounded-2xl border-4 border-pink-200 shadow-lg">
          {!imgError ? (
            <Image
              src="/birthday-photo.jpg"
              alt="Ảnh sinh nhật"
              fill
              sizes="(max-width: 420px) 100vw, 420px"
              className="object-cover"
              onError={() => setImgError(true)}
              priority
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-pink-100 to-purple-100 text-center">
              <span className="text-6xl">🎂</span>
              <p className="mt-2 px-4 text-xs text-gray-500">
                Thêm ảnh <code>birthday-photo.jpg</code> vào thư mục{" "}
                <code>public</code> để hiện ở đây
              </p>
            </div>
          )}
        </div>

        <p className="mb-3 text-sm leading-relaxed text-gray-700">{WISH}</p>
        <p className="mb-5 text-xs italic text-purple-500">{TROLL}</p>

        <div className="flex flex-col gap-3">
          <QRGift />
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={onReveal}
            className="w-full rounded-2xl bg-gradient-to-r from-pink-500 to-purple-500 px-6 py-3 font-bold text-white shadow-lg"
          >
            Xem lại bất ngờ 🎁
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={onReplay}
            className="w-full rounded-2xl bg-white px-6 py-3 font-bold text-purple-600 shadow-md ring-1 ring-purple-200"
          >
            Chơi lại mini game 🔁
          </motion.button>
        </div>
      </motion.div>
    </>
  );
}
