"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { playCatch, playWin, playLose } from "@/lib/sound";

interface MiniGameProps {
  onWin: () => void;
}

// ====== CẤU HÌNH GAME (chỉnh ở đây cho dễ) ======
const TARGET_SCORE = 15; // Số điểm cần đạt để thắng
const GAME_TIME = 35; // Thời gian chơi (giây)
const START_SPAWN = 620; // Lúc đầu bao lâu sinh 1 item (ms)
const MIN_SPAWN = 330; // Tốc độ sinh nhanh nhất (ms)
const START_FALL = 4.2; // Lúc đầu item rơi trong bao lâu (giây)
const MIN_FALL = 2.4; // Item rơi nhanh nhất (giây)
const MAX_LIVES = 3; // Số mạng (bấm trúng bom là mất 1 mạng)

const GOOD_ITEMS = ["🎁", "🎂", "🎈", "🍰", "⭐"]; // bấm được +1
const BAD_ITEMS = ["💣", "💩"]; // bấm trúng = mất mạng
const BAD_CHANCE = 0.25; // 25% item là "đồ xấu"
// ================================================

interface FallingItem {
  id: number;
  emoji: string;
  left: number; // vị trí ngang theo %
  bad: boolean;
  fall: number; // thời gian rơi của riêng item này
}

export default function MiniGame({ onWin }: MiniGameProps) {
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(MAX_LIVES);
  const [combo, setCombo] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_TIME);
  const [items, setItems] = useState<FallingItem[]>([]);
  const [status, setStatus] = useState<"playing" | "lose">("playing");
  const [loseReason, setLoseReason] = useState("");

  const nextId = useRef(0);
  const wonRef = useRef(false);
  const overRef = useRef(false); // game đã kết thúc (thắng/thua) chưa
  const spawnGapRef = useRef(START_SPAWN);
  const fallTimeRef = useRef(START_FALL);

  // Reset toàn bộ về trạng thái ban đầu (dùng cho nút "Chơi lại")
  const resetGame = useCallback(() => {
    setScore(0);
    setLives(MAX_LIVES);
    setCombo(0);
    setTimeLeft(GAME_TIME);
    setItems([]);
    setStatus("playing");
    setLoseReason("");
    wonRef.current = false;
    overRef.current = false;
  }, []);

  // Độ khó tăng dần theo thời gian đã trôi qua (0 -> 1)
  const difficulty = 1 - timeLeft / GAME_TIME;
  const spawnGap = START_SPAWN - (START_SPAWN - MIN_SPAWN) * difficulty;
  const fallTime = START_FALL - (START_FALL - MIN_FALL) * difficulty;

  useEffect(() => {
    spawnGapRef.current = spawnGap;
    fallTimeRef.current = fallTime;
  }, [spawnGap, fallTime]);

  const endLose = useCallback((reason: string) => {
    if (overRef.current) return;
    overRef.current = true;
    setStatus("lose");
    setLoseReason(reason);
    playLose();
  }, []);

  // Đếm ngược thời gian
  useEffect(() => {
    if (status !== "playing") return;
    const timer = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timer);
          if (!wonRef.current) endLose("Hết giờ rồi!");
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [status, endLose]);

  // Sinh item rơi liên tục. Dùng timeout loop để không bị khựng khi timeLeft cập nhật mỗi giây.
  useEffect(() => {
    if (status !== "playing") return;
    let spawner: ReturnType<typeof setTimeout>;

    const spawnItem = () => {
      if (overRef.current) return;
      const bad = Math.random() < BAD_CHANCE;
      setItems((prev) => [
        ...prev,
        {
          id: nextId.current++,
          bad,
          emoji: bad
            ? BAD_ITEMS[Math.floor(Math.random() * BAD_ITEMS.length)]
            : GOOD_ITEMS[Math.floor(Math.random() * GOOD_ITEMS.length)],
          left: Math.random() * 80 + 5,
          fall: fallTimeRef.current,
        },
      ]);
      spawner = setTimeout(spawnItem, spawnGapRef.current);
    };

    spawner = setTimeout(spawnItem, 250);
    return () => clearTimeout(spawner);
  }, [status]);

  // Khi đủ điểm -> thắng
  useEffect(() => {
    if (score >= TARGET_SCORE && !wonRef.current) {
      wonRef.current = true;
      overRef.current = true;
      playWin();
      const t = setTimeout(onWin, 450);
      return () => clearTimeout(t);
    }
  }, [score, onWin]);

  // Người chơi chạm vào 1 item
  const tapItem = (item: FallingItem) => {
    if (status !== "playing" || overRef.current) return;
    setItems((prev) => prev.filter((it) => it.id !== item.id));

    if (item.bad) {
      // Bấm trúng bom: mất mạng + reset combo
      setCombo(0);
      setLives((l) => {
        const left = l - 1;
        if (left <= 0) endLose("Bùm 💥 Bạn bấm trúng bom hết mạng rồi!");
        return left;
      });
      playLose();
    } else {
      setScore((s) => Math.min(s + 1, TARGET_SCORE));
      setCombo((c) => c + 1);
      playCatch();
    }
  };

  // Item rơi tới đáy mà không bấm -> tự xóa. Nếu là đồ tốt thì mất combo.
  const dropItem = (item: FallingItem) => {
    setItems((prev) => prev.filter((it) => it.id !== item.id));
    if (!item.bad) setCombo(0);
  };

  const progress = Math.min((score / TARGET_SCORE) * 100, 100);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="relative flex h-[82vh] max-h-[760px] w-full max-w-[420px] flex-col overflow-hidden rounded-3xl bg-white/70 shadow-2xl backdrop-blur-md"
    >
      {/* Thanh thông tin trên cùng */}
      <div className="z-20 flex items-center justify-between gap-2 px-4 pt-4">
        <div className="rounded-full bg-purple-500 px-3 py-1 text-sm font-bold text-white">
          ⏱️ {timeLeft}s
        </div>
        <div className="text-base">
          {Array.from({ length: MAX_LIVES }).map((_, i) => (
            <span key={i}>{i < lives ? "❤️" : "🤍"}</span>
          ))}
        </div>
        <div className="rounded-full bg-pink-500 px-3 py-1 text-sm font-bold text-white">
          {score}/{TARGET_SCORE}
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
        Bắt đồ ngọt 🎁🎂⭐ — tránh bom 💣💩 nha!
        {combo >= 3 && (
          <span className="ml-1 font-bold text-pink-600">Combo x{combo}🔥</span>
        )}
      </p>

      {/* Khu vực chơi game */}
      <div className="relative flex-1 overflow-hidden">
        {items.map((item) => (
          <motion.button
            key={item.id}
            initial={{ y: -60 }}
            animate={{ y: "85vh" }}
            transition={{ duration: item.fall, ease: "linear" }}
            onAnimationComplete={() => dropItem(item)}
            onTap={() => tapItem(item)}
            onClick={() => tapItem(item)}
            whileTap={{ scale: 1.5 }}
            style={{ left: `${item.left}%` }}
            className={`absolute top-0 select-none text-4xl ${
              item.bad ? "animate-wiggle" : ""
            }`}
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
              {loseReason}
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
