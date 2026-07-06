"use client";

import { motion } from "framer-motion";
import { content } from "./content";

const headline = content.headline
const subheadline = content.subheadline

export default function HeroHeadline() {
  return (
    <>
      <motion.h1
        className="display-hero"
        initial={{ opacity:0, y:24 }} animate={{ opacity:1, y:0 }}
        transition={{ delay:0.1, duration:0.7, ease:[0.16,1,0.3,1] }}
        style={{ marginBottom:20, maxWidth:"16ch" }}
      >
        {headline.line1}{" "}
        <em style={{ fontStyle:"italic", color:"var(--coral)" }}>{headline.em1}</em>
        <br/>
        {headline.line2}{" "}
        <em style={{ fontStyle:"italic" }}>{headline.em2}</em>
      </motion.h1>

      <motion.p
        initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
        transition={{ delay:0.2, duration:0.6 }}
        style={{
          fontFamily: "var(--font-body)",
          fontSize:   "clamp(0.88rem,2vw,1.02rem)",
          lineHeight: 1.78,
          color:      "var(--ink-2)",
          maxWidth:   480,
          marginBottom: 36,
        }}
      >
        {subheadline}
      </motion.p>
    </>
  );
}
