"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader } from "lucide-react";
import Image from "next/image";

export default function LoadingScreen() {
  const [isVisible, setIsVisible] = useState(true);
  const [showLoader, setShowLoader] = useState(false);

  useEffect(() => {
    const hasBeenShown = sessionStorage.getItem("a_l_s");

    if (hasBeenShown) {
      setIsVisible(false);
      return;
    }

    const MIN_DURATION = 2200;
    let pageLoaded = false;
    let minTimeElapsed = false;

    const tryHide = () => {
      if (pageLoaded && minTimeElapsed) {
        setIsVisible(false);
        sessionStorage.setItem("a_l_s", "true");
      }
    };

    const onLoad = () => {
      pageLoaded = true;
      tryHide();
    };

    const minTimer = setTimeout(() => {
      minTimeElapsed = true;
      tryHide();
    }, MIN_DURATION);

    const loaderTimer = setTimeout(() => setShowLoader(true), MIN_DURATION);

    if (document.readyState === "complete") {
      pageLoaded = true;
    } else {
      window.addEventListener("load", onLoad);
    }

    return () => {
      window.removeEventListener("load", onLoad);
      clearTimeout(minTimer);
      clearTimeout(loaderTimer);
    };
  }, []);

  useEffect(() => {
    if (isVisible) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, [isVisible]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            transition: { duration: 0.2, ease: "easeInOut", delay: 0.1 },
          }}
          className="fixed inset-0 z-9999 flex  items-center justify-center bg-white"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{
              scale: 1,
              opacity: 1,
              transition: { duration: 1, ease: [0.16, 1, 0.3, 1] },
            }}
            exit={{
              scale: 0,
              opacity: 0,
              transition: { duration: 0.1, ease: "easeIn" },
            }}
            className="relative w-15 h-15 bg-reg"
          >
            <Image
              src="/images/svg/Algora-image.svg"
              alt="Algora Logo"
              fill
              priority
              className="object-contain"
            />
          </motion.div>

          <AnimatePresence>
            {showLoader && (
              <motion.div
                initial={{ opacity: 0, scale: 0, filter: "blur(10px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, scale: 0, filter: "blur(10px)" }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="absolute top-[calc(50%+48px)] left-1/2 -translate-x-1/2 flex items-center gap-2 text-sm text-muted-foreground"
              >
                <Loader size={22} className="animate-spin" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
