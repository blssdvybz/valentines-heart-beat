import { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Switch, Route, Router } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";

// Import Screens
import NameScreen from "@/pages/NameScreen";
import ProposalScreen from "@/pages/ProposalScreen";
import GameScreen from "@/pages/GameScreen";
import EndScreen from "@/pages/EndScreen";

import { useCreateGameSession } from "@/hooks/use-game-session";

type Screen = 'name' | 'proposal' | 'game' | 'end';

function GameApp() {
  const [screen, setScreen] = useState<Screen>('name');
  const [playerName, setPlayerName] = useState("");
  const createSession = useCreateGameSession();

  const handleNameSubmit = (name: string) => {
    setPlayerName(name);
    setScreen('proposal');
  };

  const handleProposalAccept = () => {
    setScreen('game');
  };

  const handleGameFinish = (score: number) => {
    // Record the session in the background
    createSession.mutate({
      playerName,
      score,
    });
    setScreen('end');
  };

  // Background music effect
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Initialize audio object once
    if (!audioRef.current) {
      audioRef.current = new Audio(import.meta.env.BASE_URL + "audio/My Love By Westlife.mp3");
      audioRef.current.loop = true;
      audioRef.current.volume = 0.5;
    }
  }, []);

  useEffect(() => {
    if (screen !== 'name' && audioRef.current) {
      const audio = audioRef.current;
      if (audio.paused) {
        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise.catch(error => {
            console.log("Audio playback failed:", error);
          });
        }
      }
    }
  }, [screen]);


  return (
    <div className="w-full h-screen overflow-hidden bg-background font-body text-foreground">
      <AnimatePresence mode="wait">
        {screen === 'name' && (
          <motion.div
            key="name"
            className="w-full h-full absolute inset-0"
            exit={{ x: -1000, opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <NameScreen onNext={handleNameSubmit} />
          </motion.div>
        )}

        {screen === 'proposal' && (
          <motion.div
            key="proposal"
            className="w-full h-full absolute inset-0"
            initial={{ x: 1000, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ scale: 1.5, opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <ProposalScreen playerName={playerName} onAccept={handleProposalAccept} />
          </motion.div>
        )}

        {screen === 'game' && (
          <motion.div
            key="game"
            className="w-full h-full absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
          >
            <GameScreen playerName={playerName} onFinish={handleGameFinish} />
          </motion.div>
        )}

        {screen === 'end' && (
          <motion.div
            key="end"
            className="w-full h-full absolute inset-0"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring" }}
          >
            <EndScreen playerName={playerName} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster />
      <Router base={import.meta.env.BASE_URL}>
        <Switch>
          <Route path="/" component={GameApp} />
          <Route component={NotFound} />
        </Switch>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
