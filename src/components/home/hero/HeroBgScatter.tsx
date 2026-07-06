"use client";

import { motion } from "framer-motion";
import type { BgImage } from "./content";
import { BG_GRADIENTS, BG_IMAGES } from "./content";


const images = BG_IMAGES;
const gradients = BG_GRADIENTS;

function BgScatterImage({
  img,
  gradient,
  index,
}: {
  img: BgImage;
  gradient: string;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: img.opacity, scale: 1 }}
      transition={{
        delay: 0.4 + img.delay,
        duration: 0.9,
        ease: [0.16, 1, 0.3, 1],
      }}
      style={{
        position: "absolute",
        top: img.top,
        left: img.left,
        width: img.width,
        height: img.height,
        zIndex: img.zIndex,
        borderRadius: 4,
        overflow: "hidden",
        boxShadow: "0 8px 32px rgba(0,0,0,0.45)",
        ["--r" as string]: `${img.rotate}deg`,
        animation: `float-${img.float} ${7 + index * 0.7}s ease-in-out ${img.delay}s infinite`,
      }}
    >
      <div style={{ position: "absolute", inset: 0, background: gradient }} />
      {/* Swap div for <Image src={img.src} alt="" fill style={{objectFit:"cover"}} sizes="260px"/> */}
    </motion.div>
  );
}

export default function HeroBgScatter() {
  return (
    <div
      className="hero-bg-images"
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
      }}
    >
      {images.map((img, i) => (
        <BgScatterImage
          key={img.id}
          img={img}
          gradient={
            gradients[img.id] ?? "linear-gradient(135deg,#1a1a2e,#2d2d44)"
          }
          index={i}
        />
      ))}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 70% 80% at 50% 50%,rgba(10,10,15,0.55) 0%,rgba(10,10,15,0.82) 100%)",
        }}
      />
      <div
        className="hero-light-overlay"
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 70% 80% at 50% 50%,rgba(245,240,232,0.55) 0%,rgba(245,240,232,0.85) 100%)",
          opacity: 0,
          transition: "opacity 0.3s",
        }}
      />
    </div>
  );
}
