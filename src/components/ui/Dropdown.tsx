"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { clsx, type ClassValue } from "clsx";

interface DropdownProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  position?: "above" | "below" | "left" | "right";
  className?: string;
  dropdownClassName?: string;
}

export default function Dropdown({
  trigger,
  children,
  position = "below",
  className,
  dropdownClassName,
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const closeDropdown = useCallback(() => {
    setIsOpen(false);
  }, []);

  const toggleDropdown = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        closeDropdown();
      }
    };

    const handleScroll = () => {
      if (isOpen) {
        closeDropdown();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      window.addEventListener("scroll", handleScroll, { capture: true });
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScroll, { capture: true });
    };
  }, [isOpen, closeDropdown]);

  const getPositionStyles = (): React.CSSProperties => {
    switch (position) {
      case "above":
        return {
          bottom: "100%",
          left: "50%",
          transform: "translateX(-50%) translateY(-10px)",
        };
      case "left":
        return {
          right: "100%",
          top: "50%",
          transform: "translateY(-50%) translateX(-10px)",
        };
      case "right":
        return {
          left: "100%",
          top: "50%",
          transform: "translateY(-50%) translateX(10px)",
        };
      case "below":
      default:
        return {
          top: "100%",
          left: "50%",
          transform: "translateX(-50%) translateY(10px)",
        };
    }
  };

  const getAnimationStyles = (): React.CSSProperties => {
    return {
      opacity: isOpen ? 1 : 0,
      visibility: isOpen ? "visible" : "hidden",
      transform: isOpen
        ? getPositionStyles().transform?.replace(/translate[XY]\(-?\d+px\)/, "")
        : getPositionStyles().transform,
      transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
    };
  };

  return (
    <div
      ref={containerRef}
      className={clsx("relative inline-block", className)}
      style={{ position: "relative" }}
    >
      <div onClick={toggleDropdown} className="cursor-pointer">
        {trigger}
      </div>

      <div
        className={clsx(
          "absolute min-w-[200px] bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden",
          dropdownClassName
        )}
        style={{
          ...getPositionStyles(),
          ...getAnimationStyles(),
          position: "absolute",
          zIndex: 100,
        }}
      >
        {children}
      </div>
    </div>
  );
}
