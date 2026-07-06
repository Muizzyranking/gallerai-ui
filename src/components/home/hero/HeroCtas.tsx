"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { content } from "./content";

const ctas = content.ctas

export default function HeroCtas() {
  return (
    <motion.div
      initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }}
      transition={{ delay:0.3, duration:0.5 }}
      style={{ display:"flex", gap:12, justifyContent:"center", flexWrap:"wrap", marginBottom:60 }}
    >
      <Link href={ctas.primary.href} className="btn-primary">
        {ctas.primary.label}
        <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
          <path d="M2 6.5h9M7 2l4.5 4.5L7 11"/>
        </svg>
      </Link>
      <Link href={ctas.secondary.href} className="btn-ghost">
        {ctas.secondary.label}
      </Link>
    </motion.div>
  );
}
