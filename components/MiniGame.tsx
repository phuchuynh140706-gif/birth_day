"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { playCatch, playWin, playLose } from "@/lib/sound";

interface MiniGameProps {
  onWin: () => void;
}

// ====== CẤU HÌNH GAME (chỉnh ở đây cho dễ) ======
const TARGET_SCORE = 10; // Số điểm cần đạt để thắng
const GAME_TIME = 20; // Thời gian chơi (giây)
const SPAWN_EVERY = 700; // Bao lâu sinh 1 item mới (ms)
const FALL_DURATION = 3.2; // Item rơi trong bao lâu (giây)
const ITEMS = ["🎁", "🎂", "🎈"]; // Các item rơi xuống
// ================================================

interface FallingItem {
  id: number;
  emoji: string;
  left: number; // vị trí ngang theo %
}

export default function MiniGame({ onWin }: MiniGameProps) {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_TIME);
  const [items, setItems] = useState<FallingItem[]>([]);
  const [status, setStatus] = useState<"playing" | "lose">("playing");

  const nextId = useRef(0);
  const wonRef = useRef(false);

  // Reset toàn bộ về trạng thái ban đầu (dùng cho nút "Chơi lại")
  const resetGame = useCallback(() => {
    setScore(0);
    setTimeLeft(GAME_TIME);
    setItems([]);
    setStatus("playing");
    wonRef.current = false;
  }, []);

  // Đếm ngược thời gian
  useEffect(() => {
    if (status !== "playing") return;

    const timer = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timer);
          // Hết giờ: nếu chưa thắng thì thua
          if (!wonRef.current) {
            setStatus("lose");
            playLose();
          }
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [status]);

  // Sinh item rơi liên tục
  useEffect(() => {
    if (status !== "playing") return;

    const spawner = setInterval(() => {
      setItems((prev) => [
        ...prev,
        {
          id: nextId.current++,
          emoji: ITEMS[Math.floor(Math.random() * ITEMS.length)],
          left: Math.random() * 80 + 5, // từ 5% đến 85%
        },
      ]);
    }, SPAWN_EVERY);

    return () => clearInterval(spawner);
  }, [status]);

  // Khi đủ điểm -> thắng
  useEffect(() => {
    if (score >= TARGET_SCORE && !wonRef.current) {
      wonRef.current = true;
      setStatus("playing");
      playWin();
      // Chờ một nhịp nhỏ cho cảm giác "bắt được" rồi chuyển màn
      const t = setTimeout(onWin, 400);
      return () => clearTimeout(t);
    }
  }, [score, onWin]);

  // Người chơi chạm vào 1 item
  const catchItem = (id: number) => {
    if (status !== "playing" || wonRef.current) return;
    setItems((prev) => prev.filter((it) => it.id !== id));
    setScore((s) => Math.min(s + 1, TARGET_SCORE));
    playCatch();
  };

  // Item rơi tới đáy mà không bắt được -> tự xóa
  const removeItem = (id: number) => {
    setItems((prev) => prev.filter((it) => it.id !== id));
  };

  const progress = Math.min((score / TARGET_SCORE) * 100, 100);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="relative flex h-[80vh] max-h-[720px] w-full max-w-[420px] flex-col overflow-hidden rounded-3xl bg-white/70 shadow-2xl backdrop-blur-md"
    >
      {/* Thanh thông tin trên cùng */}
      <div className="z-20 flex items-center justify-between gap-3 px-4 pt-4">
        <div className="rounded-full bg-purple-500 px-3 py-1 text-sm font-bold text-white">
          ⏱️ {timeLeft}s
        </div>
        <div className="rounded-full bg-pink-500 px-3 py-1 text-sm font-bold text-white">
          Điểm: {score}/{TARGET_SCORE}
        </div>
      </div>

      {/* Thanh tiến trình */}
      <div className="z-20 mx-4 mt-2 h-3 overflow-hidden rounded-full bg-white/70">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-pink-400 to-purple-500"
          animate={{ width: `${progress}%` }}
          transition={{ type: "spring", stiffness: 120, damping: 18 }}
        />
      </div>

      <p className="z-20 mt-2 text-center text-xs font-medium text-gray-500">
        Chạm vào quà 🎁 bánh 🎂 bóng 🎈 để ghi điểm!
      </p>

      {/* Khu vực chơi game */}
      <div className="relative flex-1 overflow-hidden">
        {items.map((item) => (
          <motion.button
            key={item.id}
            initial={{ y: -60 }}
            animate={{ y: "85vh" }}
            transition={{ duration: FALL_DURATION, ease: "linear" }}
            onAnimationComplete={() => removeItem(item.id)}
            onTap={() => catchItem(item.id)}
            onClick={() => catchItem(item.id)}
            whileTap={{ scale: 1.4 }}
            style={{ left: `${item.left}%` }}
            className="absolute top-0 select-none text-4xl"
          >
            {item.emoji}
          </motion.button>
        ))}

        {/* Màn hình thua */}
        {status === "lose" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 z-30 flex flex-col items-center justify-center gap-4 bg-white/85 p-6 text-center backdrop-blur-sm"
          >
            <div className="text-5xl">😅</div>
            <h2 className="text-xl font-extrabold text-purple-700">
              Hết giờ rồi!
            </h2>
            <p className="text-gray-600">
              Bạn được {score}/{TARGET_SCORE} điểm. Thử lại nhé, gần được rồi!
            </p>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={resetGame}
              className="rounded-2xl bg-gradient-to-r from-pink-500 to-purple-500 px-6 py-3 font-bold text-white shadow-lg"
            >
              Chơi lại 🔁
            </motion.button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
