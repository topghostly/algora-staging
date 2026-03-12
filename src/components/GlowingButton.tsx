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
  className?: string;
}

export default function GlowingButton({
  href,
  children,
  className,
}: GlowingButtonProps) {
  const [isAnimationFinished, setIsAnimationFinished] = useState(false);
  const angle = useMotionValue(0);

  const background = useTransform(
    angle,
    (v) =>
      `conic-gradient(from ${v}deg, transparent 35%, #2dd4bf, #94700d, #0d9488, #0d8f94, transparent)`,
  );

  useEffect(() => {
    const controls = animate(angle, 680, {
      duration: 12,
      ease: "anticipate",
      onComplete: () => setIsAnimationFinished(true),
    });
    return controls.stop;
  }, [angle]);

  return (
    <Link
      href={href}
      className={cn(
        "relative inline-flex items-center justify-center rounded-full p-[1.5px] group transition-transform",
        className,
      )}
    >
      {/* Background Layers */}
      <div className="absolute top-0 left-0 right-0 bottom-0 rounded-full ">
        {/* Rotating Glow Layers */}
        <AnimatePresence mode="wait">
          {!isAnimationFinished && (
            <motion.div
              key="glow-layers"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2, ease: "easeInOut" }}
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

        {/* Final Solid State (Transitioning in) */}
        <motion.div
          className="absolute top-0 left-0 w-full h-full rounded-full bg-zinc-300 dark:bg-zinc-700 group-hover:bg-[#0d8f94] transition-all duration-300 ease-in-out"
          initial={{ opacity: 0 }}
          animate={{ opacity: isAnimationFinished ? 1 : 0 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
        />
      </div>

      {/* Button Content */}
      <div className="relative z-10 w-full rounded-full bg-white px-4 py-1 text-[13px] font-medium text-zinc-700 transition-colors dark:bg-zinc-950 dark:text-zinc-300 group-hover:text-zinc-900 dark:group-hover:text-white">
        {children}
      </div>
    </Link>
  );
}
