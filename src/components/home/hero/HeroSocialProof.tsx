"use client";

import { motion } from "framer-motion";
import { AVATAR_COLORS, content } from "./content";

const socialProof = content.socialProof;
const avatarColors = AVATAR_COLORS;

export default function HeroSocialProof() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.7, duration: 0.5 }}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 14,
        flexWrap: "wrap",
      }}
    >
      <div style={{ display: "flex" }}>
        {avatarColors.map((bg, i) => (
          <div
            key={bg}
            style={{
              width: 26,
              height: 26,
              borderRadius: "50%",
              background: bg,
              borderWidth: 2,
              borderStyle: "solid",
              borderColor: "var(--bg)",
              marginLeft: i > 0 ? -9 : 0,
            }}
          />
        ))}
      </div>
      <span
        style={{
          fontFamily: "var(--font-body)",
          fontSize: "0.78rem",
          color: "var(--ink-3)",
        }}
      >
        <span style={{ color: "var(--ink)", fontWeight: 600 }}>
          {socialProof.count}
        </span>{" "}
        {socialProof.label}
      </span>
    </motion.div>
  );
}
