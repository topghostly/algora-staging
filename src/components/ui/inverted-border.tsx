import React, { useId } from "react";

/**
 * InvertedCornerImage
 *
 * Props:
 * - width: number | string (e.g. 640, "640px", "40rem", "100%")
 * - height: number | string
 * - imageUrl: string
 * - radius?: number (default 24)  // corner radius in px
 * - notchBg?: string (default "#fff") // background color behind the notch (usually page bg)
 * - borderColor?: string (default "#059669") // the arc/border color
 * - position?: "top-left" | "top-right" | "bottom-left" | "bottom-right" (default "top-left")
 * - children: ReactNode
 */
export function InvertedCornerImage({
  width,
  height,
  imageUrl,
  radius = 24,
  notchBg = "#fff",
  borderColor = "#059669",
  position = "top-left",
  children,
}: {
  width: number | string;
  height: number | string;
  imageUrl: string;
  radius?: number;
  notchBg?: string;
  borderColor?: string;
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  children: React.ReactNode;
}) {
  const id = useId().replace(/:/g, "");
  const notchRefClass = `notch-${id}`;

  // Normalize width/height to CSS values
  const w = typeof width === "number" ? `${width}px` : width;
  const h = typeof height === "number" ? `${height}px` : height;

  // Position logic
  const isTop = position.startsWith("top");
  const isLeft = position.endsWith("left");

  // Determine which border radius to apply to the notch
  const borderRadius = isTop
    ? isLeft
      ? `0 0 ${radius}px 0`
      : `0 0 0 ${radius}px`
    : isLeft
      ? `0 ${radius}px 0 0`
      : `${radius}px 0 0 0`;

  // Determine radial gradient center for pseudo-elements
  const gradientCenter = isTop
    ? isLeft
      ? "bottom right"
      : "bottom left"
    : isLeft
      ? "top right"
      : "top left";

  // Position styles for the notch container
  const positionStyles: React.CSSProperties = {
    top: isTop ? 0 : "auto",
    bottom: isTop ? "auto" : 0,
    left: isLeft ? 0 : "auto",
    right: isLeft ? "auto" : 0,
  };

  // We'll use CSS variables so the pseudo-elements can use dynamic radius/color/bg.
  const styleVars = {
    width: w,
    height: h,
    borderRadius: `${radius}px`,
    backgroundImage: `url(${imageUrl})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",

    // vars for the notch
    "--r": `${radius}px`,
    "--notch-bg": notchBg,
    "--arc": borderColor,
    "--radius": borderRadius,
    "--center": gradientCenter,
    "--neg-r": `-${radius}px`,
  };

  return (
    <div className="relative overflow-hidden" style={{ ...(styleVars as any) }}>
      {/* This element sizes itself to children */}
      <div
        className={`notch-container ${notchRefClass} inline-block w-fit h-fit absolute`}
        style={positionStyles}
      >
        {children}
      </div>

      {/* scoped styles for the pseudo-elements using unique class */}
      <style>{`
        .${notchRefClass}{
          background: var(--notch-bg);
          border-radius: var(--radius);
        }
        .${notchRefClass}::before,
        .${notchRefClass}::after{
          content: "";
          position: absolute;
          width: var(--r);
          height: var(--r);
          /* draws the curved arc in the "cut" corners */
          background: radial-gradient(
            circle var(--r) at var(--center),
            var(--arc) 98%,
            var(--notch-bg) 100%
          );
        }
        
        /* Pseudo-element 1: expands the notch horizontally */
        .${notchRefClass}::before{
          ${isTop ? "top: 0;" : "bottom: 0;"}
          ${isLeft ? "right: var(--neg-r);" : "left: var(--neg-r);"}
        }
        
        /* Pseudo-element 2: expands the notch vertically */
        .${notchRefClass}::after{
          ${isLeft ? "left: 0;" : "right: 0;"}
          ${isTop ? "bottom: var(--neg-r);" : "top: var(--neg-r);"}
        }
      `}</style>
    </div>
  );
}
