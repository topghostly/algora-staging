"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
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

  return (
    <Link
      href={href}
      className={cn(
        "relative inline-flex items-center justify-center rounded-full p-[1.5px] overflow-hidden group transition-transform",
        className,
      )}
    >
      {/* Background Layers */}
      <div className="absolute inset-0 rounded-full overflow-hidden">
        {/* Rotating Glow Layers */}
        <AnimatePresence mode="wait">
          {!isAnimationFinished && (
            <motion.div
              key="glow-layers"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2, ease: "easeInOut" }}
              className="absolute inset-[-150%] flex items-center justify-center"
            >
              <motion.div
                className="absolute inset-0 blur-[20px] opacity-50"
                style={{
                  background: `conic-gradient(from 0deg, transparent 35%, #2dd4bf, #94700d, #0d9488, #0d8f94, transparent)`,
                }}
                animate={{ rotate: 680 }}
                transition={{ duration: 12, ease: "anticipate" }}
              />

              <motion.div
                className="absolute inset-0"
                style={{
                  background: `conic-gradient(from 0deg, transparent 35%, #2dd4bf, #94700d, #0d9488, #0d8f94, transparent)`,
                }}
                animate={{ rotate: 680 }}
                transition={{ duration: 12, ease: "anticipate" }}
                onAnimationComplete={() => setIsAnimationFinished(true)}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Final Solid State (Transitioning in) */}
        <motion.div
          className="absolute inset-0 bg-zinc-300 dark:bg-zinc-700 group-hover:bg-[#0d8f94] transition-all duration-300 ease-in-out"
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
