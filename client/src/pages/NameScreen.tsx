import { useState } from "react";
import { motion } from "framer-motion";
import { PlayfulButton } from "@/components/PlayfulButton";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Heart, Hammer } from "lucide-react";
import workerImg from "@assets/worker-image_1770900515921.png";

interface NameScreenProps {
  onNext: (name: string) => void;
}

export default function NameScreen({ onNext }: NameScreenProps) {
  const [name, setName] = useState("Enter your name");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onNext(name);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", bounce: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="glass-panel p-8 md:p-10 rounded-[2rem] shadow-[0_0_40px_rgba(255,0,255,0.3)] relative overflow-visible border border-white/10">

          {/* Decorative floating icons */}
          <motion.div
            animate={{ y: [0, -10, 0], rotate: 12 }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="absolute -top-6 -right-6 text-secondary drop-shadow-[0_0_10px_rgba(204,255,0,0.5)]"
          >
            <Hammer size={48} />
          </motion.div>
          <motion.div
            animate={{ y: [0, -10, 0], rotate: -12 }}
            transition={{ repeat: Infinity, duration: 2.5, delay: 0.5 }}
            className="absolute -top-6 -left-6 text-primary drop-shadow-[0_0_10px_rgba(255,0,255,0.5)]"
          >
            <Heart size={48} fill="currentColor" />
          </motion.div>

          <div className="text-center space-y-8">
            <div className="relative inline-block">
              <img
                src={workerImg}
                alt="Construction Worker"
                className="w-40 h-40 mx-auto object-contain drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]"
              />
            </div>

            <h1 className="text-4xl md:text-5xl font-bold mb-2 leading-tight tracking-tighter text-glow">
              <span className="text-white">Valentine's</span>
              <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-500">Heart Beat</span>
              <span className="text-secondary ml-2">💪❤️</span>
            </h1>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-3">
                <label htmlFor="name" className="text-xl font-bold block text-muted-foreground uppercase tracking-widest font-display">
                  Who's playing?
                </label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="text-center text-2xl h-16 rounded-xl border-2 border-primary/50 focus:border-primary focus:ring-primary/20 bg-black/50 text-white font-display placeholder:text-white/20"
                  placeholder="ENTER NAME"
                  autoFocus
                />
              </div>

              <PlayfulButton type="submit" size="lg" className="w-full shadow-[0_0_30px_rgba(255,0,255,0.4)] hover:shadow-[0_0_50px_rgba(255,0,255,0.6)] text-xl py-6">
                START GAME 💖
              </PlayfulButton>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
