"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import StartScreen from "@/components/StartScreen";
import MiniGame from "@/components/MiniGame";
import FreezeScreen from "@/components/FreezeScreen";
import BirthdayReveal from "@/components/BirthdayReveal";

// Các trạng thái (màn hình) của ứng dụng
type Screen = "start" | "game" | "freeze" | "reveal";

export default function Home() {
  const [screen, setScreen] = useState<Screen>("start");

  return (
    <main className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-gradient-to-br from-pink-200 via-purple-200 to-sky-200 p-4">
      <AnimatePresence mode="wait">
        {screen === "start" && (
          <StartScreen key="start" onStart={() => setScreen("game")} />
        )}

        {screen === "game" && (
          <MiniGame key="game" onWin={() => setScreen("freeze")} />
        )}

        {screen === "freeze" && (
          <FreezeScreen key="freeze" onDone={() => setScreen("reveal")} />
        )}

        {screen === "reveal" && (
          <BirthdayReveal
            key="reveal"
            onReplay={() => setScreen("game")}
            onReveal={() => setScreen("freeze")}
          />
        )}
      </AnimatePresence>
    </main>
  );
}
