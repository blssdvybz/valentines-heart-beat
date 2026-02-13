import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import workerImg from "@assets/worker-image_1770900515921.png";
import { vibrate, HAPTIC } from "@/lib/utils";

interface GameScreenProps {
  playerName: string;
  onFinish: (score: number) => void;
}

// Game Constants
const GOAL_SCORE = 25;
const GRAVITY = 2.5; // Falling speed
const SPAWN_RATE = 0.03; // Chance per frame
const HOOK_WIDTH = 80;
const HOOK_HEIGHT = 80;
const ITEM_SIZE = 50;

// Asset URLs
const HEART_URL = "https://i.pinimg.com/736x/13/81/12/1381121eb5905fdc7802b86321f52e33.jpg";
const HAMMER_URL = "https://www.clipartmax.com/png/middle/242-2423709_hammer-clipart-cartoon-cartoon-image-of-hammer.png";
const HOOK_URL = "https://w1.pngwing.com/pngs/177/207/png-transparent-crane-yellow-construction-lifting-hook-text-line-angle.png";

type GameObject = {
  id: number;
  x: number;
  y: number;
  type: "heart" | "tool";
  caught: boolean;
};

export default function GameScreen({ playerName, onFinish }: GameScreenProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);

  // Refs for game state to avoid closure staleness in loop
  const gameState = useRef({
    score: 0,
    hookX: window.innerWidth / 2,
    items: [] as GameObject[],
    lastSpawn: 0,
    isPlaying: true,
    assets: {
      hook: new Image(),
      heart: new Image(),
      tool: new Image(),
    }
  });

  // Preload Images
  useEffect(() => {
    gameState.current.assets.hook.src = HOOK_URL;
    gameState.current.assets.heart.src = HEART_URL;
    gameState.current.assets.tool.src = HAMMER_URL;
  }, []);

  // Controls
  useEffect(() => {
    const handleMove = (x: number) => {
      if (!canvasRef.current) return;
      const rect = canvasRef.current.getBoundingClientRect();
      const relativeX = x - rect.left;
      gameState.current.hookX = Math.max(HOOK_WIDTH / 2, Math.min(canvasRef.current.width - HOOK_WIDTH / 2, relativeX));
    };

    const handleTouch = (e: TouchEvent) => handleMove(e.touches[0].clientX);
    const handleMouse = (e: MouseEvent) => handleMove(e.clientX);

    window.addEventListener("touchmove", handleTouch, { passive: false });
    window.addEventListener("mousemove", handleMouse);

    return () => {
      window.removeEventListener("touchmove", handleTouch);
      window.removeEventListener("mousemove", handleMouse);
    };
  }, []);

  // Game Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    let animationFrameId: number;

    const loop = () => {
      if (!gameState.current.isPlaying) return;

      const state = gameState.current;

      // Clear
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Spawn items
      if (Math.random() < SPAWN_RATE) {
        state.items.push({
          id: Date.now() + Math.random(),
          x: Math.random() * (canvas.width - ITEM_SIZE),
          y: -ITEM_SIZE,
          type: Math.random() > 0.3 ? "heart" : "tool", // 70% hearts
          caught: false
        });
      }

      // Update and Draw Items
      state.items.forEach(item => {
        if (item.caught) return;

        item.y += GRAVITY;

        // Draw item
        const img = item.type === "heart" ? state.assets.heart : state.assets.tool;
        // Circular clipping for neatness
        ctx.save();
        ctx.beginPath();
        ctx.arc(item.x + ITEM_SIZE / 2, item.y + ITEM_SIZE / 2, ITEM_SIZE / 2, 0, Math.PI * 2);
        ctx.clip();
        ctx.drawImage(img, item.x, item.y, ITEM_SIZE, ITEM_SIZE);
        ctx.restore();

        // Collision Logic
        const hookY = canvas.height - HOOK_HEIGHT - 20;
        const distX = Math.abs((item.x + ITEM_SIZE / 2) - state.hookX);
        const distY = Math.abs((item.y + ITEM_SIZE / 2) - (hookY + HOOK_HEIGHT / 2));

        if (distX < (HOOK_WIDTH / 2 + ITEM_SIZE / 2 - 10) && distY < (HOOK_HEIGHT / 2 + ITEM_SIZE / 2 - 10)) {
          item.caught = true;

          if (item.type === "heart") {
            state.score += 1;
            setScore(state.score);
            vibrate(HAPTIC.SUCCESS);

            if (state.score >= GOAL_SCORE) {
              state.isPlaying = false;
              onFinish(state.score);
            }
          } else {
            // Decrease score but min 0
            state.score = Math.max(0, state.score - 1);
            setScore(state.score);

            setFeedback("Oops, that's a tool! 🔨 (-1 ❤️)");
            vibrate(HAPTIC.FAILURE);
            setTimeout(() => setFeedback(null), 1500);
          }
        }
      });

      // Cleanup off-screen items
      state.items = state.items.filter(item => item.y < canvas.height && !item.caught);

      // Draw Hook
      const hookY = canvas.height - HOOK_HEIGHT - 20;
      ctx.drawImage(state.assets.hook, state.hookX - HOOK_WIDTH / 2, hookY, HOOK_WIDTH, HOOK_HEIGHT);

      animationFrameId = requestAnimationFrame(loop);
    };

    loop();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [onFinish]);

  return (
    <div className="fixed inset-0 overflow-hidden bg-gradient-to-b from-sky-100 to-white game-container cursor-none">
      <canvas ref={canvasRef} className="block w-full h-full" />

      {/* HUD */}
      <div className="absolute top-4 left-0 right-0 px-4 flex justify-between items-start pointer-events-none">
        <div className="flex items-center gap-3">
          <div className="w-16 h-16 bg-white rounded-full border-4 border-primary overflow-hidden shadow-lg p-1">
            <img src={workerImg} className="w-full h-full object-contain" />
          </div>
          <div className="bg-white/90 backdrop-blur px-4 py-2 rounded-xl shadow-lg border-2 border-primary/20">
            <p className="font-bold text-lg text-primary">Target: {GOAL_SCORE} ❤️</p>
            <p className="text-sm text-muted-foreground">Catch hearts, dodge tools!</p>
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur px-6 py-3 rounded-2xl shadow-xl border-4 border-secondary text-3xl font-bold text-secondary">
          {score} / {GOAL_SCORE}
        </div>
      </div>

      {/* Feedback Toast */}
      {feedback && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-red-500 text-white px-6 py-3 rounded-full font-bold text-xl shadow-2xl pointer-events-none"
        >
          {feedback}
        </motion.div>
      )}

      {/* Helper Text for controls */}
      <div className="absolute bottom-4 left-0 right-0 text-center text-muted-foreground/50 text-sm pointer-events-none">
        Move your mouse or drag your finger to control the hook
      </div>
    </div>
  );
}
