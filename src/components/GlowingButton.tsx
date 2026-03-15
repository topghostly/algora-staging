"use client";

import Link from "next/link";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
  animate,
} from "framer-motion";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface GlowingButtonProps {
  href: string;
  children: React.ReactNode;
  bg?: string;
  textColor?: string;
  className?: string;
  initialAnimation?: boolean;
}

export default function GlowingButton({
  href,
  children,
  className,
  bg = "white",
  textColor = "black",
  initialAnimation = false,
}: GlowingButtonProps) {
  const [isAnimationFinished, setIsAnimationFinished] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isInitialPlaying, setIsInitialPlaying] = useState(initialAnimation);
  const angle = useMotionValue(0);

  const background = useTransform(
    angle,
    (v) =>
      `conic-gradient(from ${v}deg, transparent 35%, #2dd4bf, #94700d, #0d9488, #0d8f94, transparent)`,
  );

  useEffect(() => {
    if (initialAnimation) {
      const controls = animate(angle, 680, {
        duration: 12,
        ease: "anticipate",
        onComplete: () => {
          setIsAnimationFinished(true);
          setIsInitialPlaying(false);
        },
      });
      return controls.stop;
    } else {
      setIsAnimationFinished(true);
    }
  }, [angle, initialAnimation]);

  // Handle hover animation
  useEffect(() => {
    if (isHovered && !isInitialPlaying) {
      const controls = animate(angle, angle.get() + 260, {
        duration: 5,
        // repeat: Infinity,
        ease: "linear",
      });
      return controls.stop;
    }
  }, [isHovered, isInitialPlaying, angle]);

  const showGlow = isHovered || isInitialPlaying;
  const showOutline = isAnimationFinished && !isHovered;

  return (
    <Link
      href={href}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "relative inline-flex items-center justify-center rounded-full p-[1.5px] group transition-transform",
        className,
      )}
    >
      {/* Background Layers */}
      <div className="absolute top-0 left-0 right-0 bottom-0 rounded-full">
        {/* Final Solid State (Transitioning in) */}
        <motion.div
          className="absolute top-0 left-0 w-full h-full rounded-full bg-zinc-300 dark:bg-zinc-800 transition-all duration-300 ease-in-out"
          initial={{ opacity: 0 }}
          animate={{ opacity: showOutline ? 1 : 0 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
        />

        {/* Rotating Glow Layers */}
        <AnimatePresence>
          {showGlow && (
            <motion.div
              key="glow-layers"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="absolute top-0 left-0 w-full h-full rounded-full flex items-center justify-center"
            >
              <motion.div
                className="absolute top-0 left-0 w-full h-full rounded-full blur-[5px] opacity-50"
                style={{ background }}
              />

              <motion.div
                className="absolute top-0 left-0 w-full h-full rounded-full"
                style={{ background }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Button Content */}
      <div
        className="relative z-10 w-full rounded-full px-4 py-1.5 text-[13px] font-medium transition-colors"
        style={{
          backgroundColor: bg,
          color: textColor,
        }}
      >
        {children}
      </div>
    </Link>
  );
}
