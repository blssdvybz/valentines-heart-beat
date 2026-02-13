import { motion, HTMLMotionProps } from "framer-motion";
import { cn, vibrate, HAPTIC } from "@/lib/utils";

interface PlayfulButtonProps extends HTMLMotionProps<"button"> {
  variant?: "primary" | "secondary" | "danger";
  size?: "sm" | "md" | "lg";
}

export function PlayfulButton({
  children,
  className,
  variant = "primary",
  size = "md",
  onClick,
  ...props
}: PlayfulButtonProps) {
  const baseStyles = "relative font-bold rounded-2xl shadow-lg transition-colors border-b-4 active:border-b-0 active:translate-y-1";

  const variants = {
    primary: "bg-primary text-primary-foreground border-primary/50 hover:bg-primary/90 hover:shadow-primary/30",
    secondary: "bg-secondary text-secondary-foreground border-secondary/50 hover:bg-secondary/90 hover:shadow-secondary/30",
    danger: "bg-red-500 text-white border-red-700 hover:bg-red-600",
  };

  const sizes = {
    sm: "px-4 py-2 text-lg",
    md: "px-8 py-3 text-xl",
    lg: "px-10 py-5 text-2xl",
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    vibrate(HAPTIC.TAP);
    onClick?.(e);
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={cn(baseStyles, variants[variant], sizes[size], "font-display tracking-wider", className)}
      onClick={handleClick}
      {...props}
    >
      {children}
    </motion.button>
  );
}
