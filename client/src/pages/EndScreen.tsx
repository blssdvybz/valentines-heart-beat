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

  const startCamera = async () => {
    try {
      setIsCameraOpen(true);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      alert("Unable to access camera. Please allow camera permissions.");
      setIsCameraOpen(false);
    }
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
    <div
      className="min-h-screen flex items-center justify-center p-4 bg-cover bg-center overflow-hidden"
      style={{ backgroundImage: `url(${BG_URL})` }}
    >
      <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px]" />

      <AnimatePresence mode="wait">
        {!isCameraOpen && !capturedImage && (
          <motion.div
            key="celebration"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
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
                You did it! 🎉 Nkwagala Nyo!
              </h2>

              <p className="text-2xl font-body text-foreground mb-8">
                <span className="font-bold text-secondary">{playerName}</span>,<br />
                we build better together! 💪❤️
              </p>

              <div className="space-y-4">
                <PlayfulButton
                  onClick={startCamera}
                  variant="primary"
                  className="w-full flex items-center justify-center gap-2 shadow-lg"
                >
                  <Camera size={24} />
                  Take a Victory Selfie! 📸
                </PlayfulButton>

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
                Happy Valentine's Day, My Darling! 💝
              </p>
            </Card>
          </motion.div>
        )}

        {isCameraOpen && (
          <motion.div
            key="camera"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/90 p-4"
          >
            <div className="relative w-full max-w-md aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl border-4 border-primary">
              {/* Live Filter Overlay Effect via CSS */}
              <div className="absolute inset-0 pointer-events-none z-10 opacity-20 bg-pink-500 mix-blend-overlay"></div>

              {/* Floating Hearts Decoration */}
              <motion.div
                animate={{ y: [0, -20, 0], opacity: [0.5, 1, 0.5] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute top-4 left-4 text-4xl z-20"
              >💖</motion.div>
              <motion.div
                animate={{ y: [0, -30, 0], opacity: [0.5, 1, 0.5] }}
                transition={{ repeat: Infinity, duration: 2.5, delay: 0.5 }}
                className="absolute top-4 right-4 text-4xl z-20"
              >💖</motion.div>

              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover transform scale-x-[-1]" // Mirror effect
                style={{ filter: "contrast(1.1) saturate(1.2) sepia(0.2)" }}
              />

              <canvas ref={canvasRef} className="hidden" />

              <button
                onClick={stopCamera}
                className="absolute top-4 right-4 bg-white/20 p-2 rounded-full text-white backdrop-blur-sm z-30"
              >
                <X size={24} />
              </button>

              <div className="absolute bottom-8 left-0 right-0 flex justify-center z-30">
                <PlayfulButton
                  onClick={capturePhoto}
                  size="lg"
                  className="rounded-full w-20 h-20 p-0 flex items-center justify-center bg-white border-4 border-primary/50"
                >
                  <div className="w-16 h-16 bg-primary rounded-full border-2 border-white" />
                </PlayfulButton>
              </div>
            </div>
            <p className="text-white mt-4 font-bold text-lg animate-bounce">Strike a pose! ✨</p>
          </motion.div>
        )}

        {capturedImage && (
          <motion.div
            key="preview"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="w-full max-w-md z-10"
          >
            <Card className="p-4 border-4 border-primary bg-white/95 shadow-2xl rounded-3xl overflow-hidden">
              <div className="relative rounded-2xl overflow-hidden mb-4 border-2 border-primary/20">
                <img src={capturedImage} alt="Captured Selfie" className="w-full h-auto" />
              </div>

              <div className="flex flex-col gap-3">
                <PlayfulButton onClick={downloadPhoto} className="w-full flex gap-2 items-center justify-center bg-gradient-to-r from-pink-500 to-purple-500 text-white">
                  <Download size={20} /> Save Photo
                </PlayfulButton>

                <div className="flex gap-3">
                  <PlayfulButton onClick={retakePhoto} variant="secondary" className="flex-1 flex gap-2 items-center justify-center text-sm">
                    <RefreshCw size={16} /> Retake
                  </PlayfulButton>
                  <PlayfulButton onClick={handleNativeShare} variant="secondary" className="flex-1 flex gap-2 items-center justify-center text-sm">
                    <Share2 size={16} /> Share
                  </PlayfulButton>
                </div>

                <button
                  onClick={() => setCapturedImage(null)}
                  className="text-muted-foreground underline text-sm mt-2"
                >
                  Back to Celebration
                </button>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
