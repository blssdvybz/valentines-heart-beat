import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PlayfulButton } from "@/components/PlayfulButton";
import { Card } from "@/components/ui/card";
import workerImg from "@assets/worker-image_1770900515921.png";

interface ProposalScreenProps {
  playerName: string;
  onAccept: () => void;
}

const REJECTIONS = [
  "Don't leave me hanging like scaffolding! 🏗️",
  "Our foundation is too strong! 💪",
  "Are you sure? It might collapse! 🏚️",
  "I'm wearing a hard hat for this heartbreak! ⛑️",
  "But we're the perfect blueprint! 📝",
  "Safety First: Don't break my heart! 💔",
];

export default function ProposalScreen({ playerName, onAccept }: ProposalScreenProps) {
  const [noCount, setNoCount] = useState(0);
  const [noPosition, setNoPosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleNoInteraction = () => {
    if (noCount >= 6) {
      onAccept(); // Force accept after too many rejections
      return;
    }

    setNoCount((prev) => prev + 1);

    // Calculate random position within container bounds
    if (containerRef.current) {
      const container = containerRef.current.getBoundingClientRect();
      // Keep it somewhat centered but erratic
      const x = (Math.random() - 0.5) * (container.width * 0.6);
      const y = (Math.random() - 0.5) * (container.height * 0.6);
      setNoPosition({ x, y });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 overflow-hidden relative" ref={containerRef}>
      {/* Chaos Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-10 left-10 w-64 h-64 bg-primary/20 rounded-full blur-3xl animate-pulse-fast text-glow"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-float"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-4xl text-center z-10"
      >
        <div className="glass-panel p-12 md:p-16 rounded-[2rem] shadow-[0_0_50px_rgba(255,0,255,0.3)] border border-white/10 relative overflow-hidden group hover:shadow-[0_0_80px_rgba(0,255,255,0.4)] transition-shadow duration-500">

          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-50"
            animate={{ backgroundPosition: ["0% 0%", "100% 100%"] }}
            transition={{ duration: 10, repeat: Infinity, repeatType: "mirror" }}
          />

          <motion.img
            src={workerImg}
            alt="Worker asking"
            className="w-48 h-48 mx-auto mb-8 object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]"
            animate={{
              y: [0, -20, 0],
              rotate: [0, 5, -5, 0],
            }}
            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
          />

          <h2 className="text-5xl md:text-7xl font-bold mb-12 leading-tight tracking-tighter mix-blend-screen">
            <span className="text-primary block mb-2 text-glow">{playerName}</span>
            <span className="text-white">BE MY VALENTINE?</span>
            <span className="text-2xl md:text-3xl text-secondary block mt-6 font-body tracking-normal uppercase letter-spacing-2">
              ⚠️ Construction of Love in Progress ⚠️
            </span>
          </h2>

          <div className="relative h-40 flex items-center justify-center gap-12">
            <motion.div
              whileHover={{ scale: 1.15, rotate: -2 }}
              whileTap={{ scale: 0.9 }}
            >
              <PlayfulButton
                onClick={onAccept}
                className="text-3xl px-12 py-8 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/80 hover:to-purple-500 border-none shadow-[0_0_30px_rgba(255,0,255,0.6)] animate-pulse-fast"
              >
                YES <span className="text-4xl ml-2">🔥</span>
              </PlayfulButton>
            </motion.div>

            <AnimatePresence>
              <motion.div
                animate={{
                  x: noPosition.x,
                  y: noPosition.y,
                  rotate: noCount * 15,
                  opacity: Math.max(0, 1 - noCount * 0.15)
                }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
                className="absolute"
                style={{ left: "60%" }}
              >
                {noCount < 6 && (
                  <PlayfulButton
                    variant="secondary"
                    className="text-xl px-8 py-4 bg-muted/20 hover:bg-muted/40 text-muted-foreground border border-white/5 backdrop-blur-sm shadow-none"
                    onMouseEnter={handleNoInteraction}
                    onClick={handleNoInteraction}
                  >
                    NO <span className="text-2xl ml-2">💀</span>
                  </PlayfulButton>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          <AnimatePresence mode="wait">
            {noCount > 0 && (
              <motion.div
                key={noCount}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="mt-8 text-2xl font-bold text-accent font-display uppercase tracking-widest text-glow"
              >
                {REJECTIONS[(noCount - 1) % REJECTIONS.length]}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
