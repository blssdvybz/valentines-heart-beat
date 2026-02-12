import { useEffect } from "react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { PlayfulButton } from "@/components/PlayfulButton";
import { Card } from "@/components/ui/card";
import { Share2 } from "lucide-react";
import workerImg from "@assets/worker-image_1770900515921.png";

// External Asset for BG
const BG_URL = "https://thumbs.dreamstime.com/b/pink-gold-glitter-heart-confetti-transparent-background-bright-falling-star-dust-romantic-design-elements-wedding-136311884.jpg";

interface EndScreenProps {
  playerName: string;
}

export default function EndScreen({ playerName }: EndScreenProps) {
  
  useEffect(() => {
    // Fire confetti repeatedly for celebration effect
    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#e91e63', '#ff9800', '#ffffff']
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#e91e63', '#ff9800', '#ffffff']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  }, []);

  const shareText = `I just built hearts with ${playerName}! 💖 We build better together 💪 Check it out!`;
  const shareUrl = window.location.href;

  const handleWhatsAppShare = () => {
    const url = `https://wa.me/?text=${encodeURIComponent(shareText + " " + shareUrl)}`;
    window.open(url, '_blank');
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Build Hearts Together',
          text: shareText,
          url: shareUrl,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      // Fallback: Copy to clipboard
      navigator.clipboard.writeText(shareText + " " + shareUrl);
      alert("Link copied to clipboard! 📋");
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 bg-cover bg-center"
      style={{ backgroundImage: `url(${BG_URL})` }}
    >
      <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px]" />
      
      <motion.div 
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", bounce: 0.6 }}
        className="w-full max-w-md z-10"
      >
        <Card className="p-8 border-4 border-primary bg-white/95 shadow-2xl rounded-3xl text-center">
          <motion.div
            animate={{ 
              y: [0, -20, 0],
              rotate: [0, 5, -5, 0] 
            }}
            transition={{ repeat: Infinity, duration: 3 }}
          >
            <img 
              src={workerImg} 
              alt="Winner Worker"
              className="w-48 h-48 mx-auto -mt-24 mb-6 object-contain drop-shadow-2xl"
            />
          </motion.div>

          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4 leading-tight">
            You did it! 🎉
          </h2>
          
          <p className="text-2xl font-body text-foreground mb-8">
            <span className="font-bold text-secondary">{playerName}</span>,<br/> 
            we build better together! 💪❤️
          </p>

          <div className="space-y-4">
            <PlayfulButton 
              onClick={handleWhatsAppShare}
              className="w-full bg-[#25D366] hover:bg-[#128C7E] border-[#075E54] text-white flex items-center justify-center gap-2"
            >
              Share on WhatsApp 💬
            </PlayfulButton>

            <PlayfulButton 
              onClick={handleNativeShare}
              variant="secondary"
              className="w-full flex items-center justify-center gap-2"
            >
              <Share2 size={20} />
              Share Anywhere
            </PlayfulButton>
          </div>

          <p className="mt-6 text-sm text-muted-foreground">
            Happy Valentine's Day! 💝
          </p>
        </Card>
      </motion.div>
    </div>
  );
}
