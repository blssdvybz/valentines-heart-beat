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
    <div className="min-h-screen flex items-center justify-center p-4 overflow-hidden" ref={containerRef}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl text-center z-10"
      >
        <Card className="p-8 border-4 border-secondary/20 bg-white/90 backdrop-blur-md shadow-2xl rounded-3xl">
          <motion.img 
            src={workerImg} 
            alt="Worker asking"
            className="w-40 h-40 mx-auto mb-6 object-contain"
            animate={{ 
              rotate: [0, 5, 0, -5, 0],
              scale: [1, 1.05, 1]
            }}
            transition={{ repeat: Infinity, duration: 4 }}
          />

          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8 leading-relaxed">
            <span className="text-primary">{playerName}!</span> Will you build hearts with me this Valentine's? 💖
            <br />
            <span className="text-xl md:text-2xl text-muted-foreground block mt-2 font-body">
              We build better together 💪❤️
            </span>
          </h2>

          <div className="relative h-32 flex items-center justify-center gap-8">
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <PlayfulButton 
                onClick={onAccept} 
                size="lg" 
                className="min-w-[140px] text-2xl"
              >
                YES 💪
              </PlayfulButton>
            </motion.div>

            <AnimatePresence>
              <motion.div
                animate={{ 
                  x: noPosition.x, 
                  y: noPosition.y,
                  scale: Math.max(0.5, 1 - noCount * 0.1) // Shrink with each click
                }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="absolute"
                style={{ left: "50%", marginLeft: "20px" }} // Initial offset to right of YES button
              >
                <PlayfulButton 
                  variant="secondary"
                  size="lg"
                  className="min-w-[140px]"
                  onMouseEnter={handleNoInteraction}
                  onClick={handleNoInteraction} // For touch devices
                >
                  NO 🙅‍♀️
                </PlayfulButton>
              </motion.div>
            </AnimatePresence>
          </div>

          <AnimatePresence mode="wait">
            {noCount > 0 && (
              <motion.p
                key={noCount}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-6 text-xl font-bold text-secondary"
              >
                {REJECTIONS[(noCount - 1) % REJECTIONS.length]}
              </motion.p>
            )}
          </AnimatePresence>
        </Card>
      </motion.div>
    </div>
  );
}
