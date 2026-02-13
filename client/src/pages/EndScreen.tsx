import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { PlayfulButton } from "@/components/PlayfulButton";
import { Card } from "@/components/ui/card";
import { Share2, Camera, Download, RefreshCw, X } from "lucide-react";
import workerImg from "@assets/worker-image_1770900515921.png";

// External Asset for BG
const BG_URL = "https://thumbs.dreamstime.com/b/pink-gold-glitter-heart-confetti-transparent-background-bright-falling-star-dust-romantic-design-elements-wedding-136311884.jpg";

interface EndScreenProps {
  playerName: string;
}

export default function EndScreen({ playerName }: EndScreenProps) {
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

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

    return () => {
      stopCamera();
    };
  }, []);

  // Initialize camera when the modal opens
  useEffect(() => {
    let mounted = true;

    const initCamera = async () => {
      if (isCameraOpen && !streamRef.current) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: "user" }
          });

          if (!mounted) {
            stream.getTracks().forEach(track => track.stop());
            return;
          }

          streamRef.current = stream;
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        } catch (err) {
          console.error("Error accessing camera:", err);
          alert("Unable to access camera. Please allow camera permissions.");
          if (mounted) setIsCameraOpen(false);
        }
      }
    };

    initCamera();

    return () => {
      mounted = false;
    };
  }, [isCameraOpen]);

  const startCamera = () => {
    setIsCameraOpen(true);
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCameraOpen(false);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');

      if (ctx) {
        // Set canvas dimensions to match video
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        // Apply filters
        ctx.filter = "contrast(1.1) saturate(1.2) sepia(0.2)";

        // Draw video frame
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Reset filter for overlays
        ctx.filter = "none";

        // Add "Soft Pink Glow" overlay (semi-transparent pink fill)
        ctx.fillStyle = "rgba(255, 182, 193, 0.1)"; // Light pink
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Add Decoration: Heart Emojis in corners
        ctx.font = "40px Arial";
        ctx.fillText("💖", 20, 50);
        ctx.fillText("💖", canvas.width - 60, 50);
        ctx.fillText("💖", 20, canvas.height - 20);
        ctx.fillText("💖", canvas.width - 60, canvas.height - 20);


        // Add Text: "Cheers! Happy Valentine's to me! 💪❤️"
        ctx.font = "bold 30px Arial";
        ctx.fillStyle = "#ffffff";
        ctx.textAlign = "center";

        // Text Shadow for readability
        ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
        ctx.shadowBlur = 4;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;

        // Draw text in two lines to prevent overflow
        const textLine1 = "Cheers! Happy Valentine's";
        const textLine2 = "to me! 💪❤️";
        const lineHeight = 35;
        const textBottomMargin = 50;

        ctx.fillText(textLine1, canvas.width / 2, canvas.height - textBottomMargin - lineHeight);
        ctx.fillText(textLine2, canvas.width / 2, canvas.height - textBottomMargin);

        // Save image
        const dataUrl = canvas.toDataURL('image/png');
        setCapturedImage(dataUrl);
        stopCamera();
      }
    }
  };

  const downloadPhoto = () => {
    if (capturedImage) {
      const link = document.createElement('a');
      link.href = capturedImage;
      link.download = `valentine-builder-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const retakePhoto = () => {
    setCapturedImage(null);
    // Determine if we need to explicitly start camera or if removing capturedImage is enough
    // Since we want to go back to camera mode:
    startCamera();
  };

  const shareText = `I ${playerName}!, just had my Valentine's Heart Beat - 2026! 💖 💪 Check it out!`;
  const shareUrl = window.location.href;

  const handleWhatsAppShare = () => {
    const url = `https://wa.me/?text=${encodeURIComponent(shareText + " " + shareUrl)}`;
    window.open(url, '_blank');
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      if (capturedImage) {
        // Try to share the image if supported (complex, usually requires File object)
        // For simplicity, we share the link and text, but maybe mention "I have a photo!"
        try {
          // Convert dataURL to Blob for sharing file if supported
          const blob = await (await fetch(capturedImage)).blob();
          const file = new File([blob], 'valentine-selfie.png', { type: blob.type });

          if (navigator.canShare && navigator.canShare({ files: [file] })) {
            await navigator.share({
              files: [file],
              title: 'Valentine\'s Heart Beat',
              text: shareText,
            });
            return;
          }
        } catch (e) {
          console.log("Error sharing file, falling back to text", e);
        }
      }

      try {
        await navigator.share({
          title: 'Valentine\'s Heart Beat',
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

    <div className="min-h-screen flex items-center justify-center p-4 overflow-hidden relative">

      {/* Dynamic Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(255,0,255,0.1),transparent_70%)] animate-pulse-fast"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent/10 rounded-full blur-[100px] animate-float"></div>
      </div>

      <AnimatePresence mode="wait">
        {!isCameraOpen && !capturedImage && (
          <motion.div
            key="celebration"
            initial={{ scale: 0.8, opacity: 0, rotate: -5 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            exit={{ scale: 0.8, opacity: 0, rotate: 5 }}
            transition={{ type: "spring", bounce: 0.5 }}
            className="w-full max-w-lg z-10"
          >
            <div className="glass-panel p-10 md:p-12 rounded-[2.5rem] shadow-[0_0_60px_rgba(255,0,255,0.4)] border border-white/20 text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary via-secondary to-accent animate-gradient-x"></div>

              <motion.div
                animate={{
                  y: [0, -20, 0],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                className="mb-8"
              >
                <img
                  src={workerImg}
                  alt="Winner Worker"
                  className="w-56 h-56 mx-auto -mt-32 object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)]"
                />
              </motion.div>

              <h2 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-white to-white/70 mb-4 leading-none tracking-tighter text-glow drop-shadow-lg">
                MISSION COMPLETE
              </h2>
              <p className="text-2xl font-bold text-secondary mb-8 font-display tracking-widest uppercase">
                VIBE CHECK PASSED ✅
              </p>

              <p className="text-xl md:text-2xl font-body text-muted-foreground mb-10 leading-relaxed">
                <span className="font-bold text-primary block text-3xl mb-2">{playerName}</span>
                you secured the bag (my heart) 💖💪
              </p>

              <div className="space-y-4">
                <PlayfulButton
                  onClick={startCamera}
                  variant="primary"
                  className="w-full flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(255,0,255,0.5)] hover:shadow-[0_0_40px_rgba(255,0,255,0.7)] text-xl py-6"
                >
                  <Camera size={28} />
                  VICTORY SELFIE 📸
                </PlayfulButton>

                <PlayfulButton
                  onClick={handleWhatsAppShare}
                  className="w-full bg-[#25D366]/20 hover:bg-[#25D366]/40 text-[#25D366] border border-[#25D366]/50 flex items-center justify-center gap-2 backdrop-blur-sm"
                >
                  WhatsApp 💬
                </PlayfulButton>

                <PlayfulButton
                  onClick={handleNativeShare}
                  variant="secondary"
                  className="w-full flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border-white/10 text-white"
                >
                  <Share2 size={20} />
                  Share Vibes
                </PlayfulButton>

              </div>
            </div>
          </motion.div>
        )}

        {isCameraOpen && (
          <motion.div
            key="camera"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/95 p-4 backdrop-blur-xl"
          >
            <div className="relative w-full max-w-md aspect-[9/16] rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(255,0,255,0.3)] border-4 border-primary/50">
              {/* Camera UI Overlay */}
              <div className="absolute inset-0 pointer-events-none z-10 flex flex-col justify-between p-6">
                <div className="flex justify-between items-start">
                  <div className="bg-black/50 px-3 py-1 rounded-full text-white text-xs font-mono border border-white/20">REC ●</div>
                  <div className="text-white/80 text-xs font-mono">{new Date().toLocaleTimeString()}</div>
                </div>
                <div className="text-center">
                  <div className="text-white/50 text-xs font-mono mb-2">FILTER: LOVE_CORE.EXE</div>
                </div>
              </div>

              {/* Floating Hearts Decoration */}
              <motion.div
                animate={{ y: [0, -50, 0], opacity: [0, 1, 0], scale: [0.5, 1.5, 0.5] }}
                transition={{ repeat: Infinity, duration: 4 }}
                className="absolute top-1/4 left-1/4 text-6xl z-20 mix-blend-screen pointer-events-none"
              >💖</motion.div>
              <motion.div
                animate={{ y: [0, -80, 0], opacity: [0, 1, 0], scale: [0.5, 1.2, 0.5] }}
                transition={{ repeat: Infinity, duration: 5, delay: 1 }}
                className="absolute bottom-1/3 right-1/4 text-5xl z-20 mix-blend-screen pointer-events-none"
              >✨</motion.div>

              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover transform scale-x-[-1]" // Mirror effect
                style={{ filter: "contrast(1.2) saturate(1.3) hue-rotate(-10deg)" }}
              />

              <canvas ref={canvasRef} className="hidden" />

              <button
                onClick={stopCamera}
                className="absolute top-4 right-4 bg-black/50 p-3 rounded-full text-white backdrop-blur-md z-30 hover:bg-black/70 transition-colors border border-white/20"
              >
                <X size={24} />
              </button>

              <div className="absolute bottom-10 left-0 right-0 flex justify-center z-30 pointer-events-auto">
                <PlayfulButton
                  onClick={capturePhoto}
                  size="lg"
                  className="rounded-full w-24 h-24 p-0 flex items-center justify-center bg-white/10 border-4 border-white/80 backdrop-blur-sm active:scale-90 transition-transform"
                >
                  <div className="w-20 h-20 bg-primary rounded-full border-4 border-white shadow-[0_0_20px_rgba(255,0,255,0.8)]" />
                </PlayfulButton>
              </div>
            </div>
            <p className="text-white mt-6 font-bold text-2xl animate-pulse font-display tracking-widest text-glow">POV: YOU WON 🏆</p>
          </motion.div>
        )}

        {capturedImage && (
          <motion.div
            key="preview"
            initial={{ opacity: 0, scale: 0.9, rotate: 2 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="w-full max-w-md z-10"
          >
            <div className="glass-panel p-6 rounded-[2rem] shadow-2xl border border-white/20">
              <div className="relative rounded-2xl overflow-hidden mb-6 border-2 border-white/20 shadow-inner">
                <img src={capturedImage!} alt="Captured Selfie" className="w-full h-auto" />
                <div className="absolute bottom-2 right-2 bg-black/60 px-2 py-1 rounded text-[10px] text-white font-mono">
                  vibes_captured.png
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <PlayfulButton onClick={downloadPhoto} className="w-full flex gap-2 items-center justify-center bg-gradient-to-r from-primary to-accent text-black font-bold border-none">
                  <Download size={20} /> SAVE RECEIPT
                </PlayfulButton>

                <div className="flex gap-4">
                  <PlayfulButton onClick={retakePhoto} variant="secondary" className="flex-1 flex gap-2 items-center justify-center text-sm bg-white/5 border-white/10 text-white hover:bg-white/10">
                    <RefreshCw size={16} /> RETAKE
                  </PlayfulButton>
                  <PlayfulButton onClick={handleNativeShare} variant="secondary" className="flex-1 flex gap-2 items-center justify-center text-sm bg-white/5 border-white/10 text-white hover:bg-white/10">
                    <Share2 size={16} /> POST
                  </PlayfulButton>
                </div>

                <button
                  onClick={() => setCapturedImage(null)}
                  className="text-muted-foreground hover:text-white transition-colors text-sm mt-2 font-mono"
                >
                  {'< BACK_TO_BASE'}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
