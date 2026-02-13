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
        <Card className="p-8 border-4 border-primary/20 bg-white/80 backdrop-blur-sm shadow-xl rounded-3xl overflow-visible relative">

          {/* Decorative floating icons */}
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="absolute -top-6 -right-6 text-secondary transform rotate-12"
          >
            <Hammer size={48} fill="currentColor" />
          </motion.div>
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 2.5, delay: 0.5 }}
            className="absolute -top-6 -left-6 text-primary transform -rotate-12"
          >
            <Heart size={48} fill="currentColor" />
          </motion.div>

          <div className="text-center space-y-6">
            <div className="relative inline-block">
              <img
                src={workerImg}
                alt="Construction Worker"
                className="w-32 h-32 mx-auto object-contain drop-shadow-lg"
              />
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-primary leading-tight">
              Valentine's Heart Beat <span className="text-secondary">💪❤️</span>
            </h1>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="name" className="text-xl text-foreground/80 font-bold block">
                  Who's playing?
                </label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="text-center text-2xl h-14 rounded-xl border-2 border-primary/30 focus:border-primary focus:ring-primary/20 bg-white font-display"
                  placeholder="Enter your name"
                  autoFocus
                />
              </div>

              <PlayfulButton type="submit" size="lg" className="w-full shadow-primary/25">
                Play 💖
              </PlayfulButton>
            </form>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
