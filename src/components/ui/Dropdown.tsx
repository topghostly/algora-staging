"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { usePathname } from "next/navigation";
import { clsx, type ClassValue } from "clsx";

interface DropdownProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  position?: "above" | "below" | "left" | "right";
  align?: "start" | "center" | "end";
  className?: string;
  dropdownClassName?: string;
}

export default function Dropdown({
  trigger,
  children,
  position = "below",
  align = "center",
  className,
  dropdownClassName,
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  const closeDropdown = useCallback(() => {
    setIsOpen(false);
  }, []);

  useEffect(() => {
    closeDropdown();
  }, [pathname, closeDropdown]);

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

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeDropdown();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
      window.addEventListener("scroll", handleScroll, { capture: true });
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("scroll", handleScroll, { capture: true });
    };
  }, [isOpen, closeDropdown]);

  const getPositionStyles = (): React.CSSProperties => {
    const styles: React.CSSProperties = {};

    switch (position) {
      case "above":
        styles.bottom = "100%";
        styles.marginBottom = "10px";
        break;
      case "left":
        styles.right = "100%";
        styles.top = "50%";
        styles.transform = "translateY(-50%) translateX(-10px)";
        return styles;
      case "right":
        styles.left = "100%";
        styles.top = "50%";
        styles.transform = "translateY(-50%) translateX(10px)";
        return styles;
      case "below":
      default:
        styles.top = "100%";
        styles.marginTop = "10px";
        break;
    }

    if (position === "above" || position === "below") {
      switch (align) {
        case "start":
          styles.left = "0";
          break;
        case "end":
          styles.right = "0";
          break;
        case "center":
        default:
          styles.left = "50%";
          styles.transform = "translateX(-50%)";
          break;
      }
    }

    return styles;
  };

  const getAnimationStyles = (): React.CSSProperties => {
    const isHorizontalCenter =
      (position === "above" || position === "below") && align === "center";
    const isVerticalCenter = position === "left" || position === "right";

    let baseTransform = "";
    if (isHorizontalCenter && isVerticalCenter)
      baseTransform = "translate(-50%, -50%)";
    else if (isHorizontalCenter) baseTransform = "translateX(-50%)";
    else if (isVerticalCenter) baseTransform = "translateY(-50%)";

    return {
      opacity: isOpen ? 1 : 0,
      visibility: isOpen ? "visible" : "hidden",
      transform: isOpen
        ? baseTransform
        : `${baseTransform} ${
            position === "above"
              ? "translateY(10px)"
              : position === "below"
                ? "translateY(-10px)"
                : position === "left"
                  ? "translateX(10px)"
                  : "translateX(-10px)"
          }`,
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
          dropdownClassName,
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
