"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Loader } from "lucide-react";

export default function GlobalLoader() {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
        animate={{ opacity: 1, backdropFilter: "blur(4px)" }}
        exit={{
          opacity: 0,
          backdropFilter: "blur(0px)",
          transition: { duration: 0.3 },
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="fixed inset-0 z-[9999] flex items-center justify-center bg-white/80"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0, transition: { duration: 0.3 } }}
          transition={{ duration: 0.4, ease: "easeOut", delay: 0.1 }}
          className="flex flex-col items-center justify-center gap-4"
        >
          <div className="bg-secondary/1 p-4 rounded-full">
            <Loader size={26} className="animate-spin" />
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
