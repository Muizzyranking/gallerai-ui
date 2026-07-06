"use client";

import { motion } from "framer-motion";
import { content } from "./content";
import HeroBgScatter from "./HeroBgScatter";
import HeroCtas from "./HeroCtas";
import HeroHeadline from "./HeroHeadline";
import HeroScanWidget from "./HeroScanWidget";
import HeroSocialProof from "./HeroSocialProof";

export default function HeroSection() {
  return (
    <section style={{
      position: "relative", minHeight: "100vh",
      display: "flex", flexDirection: "column",
      overflow: "hidden", paddingTop: 64,
    }}>
      <HeroBgScatter />

      <div style={{ position:"absolute", top:"30%", left:"50%", transform:"translateX(-50%)", width:600, height:500, borderRadius:"50%", background:"radial-gradient(ellipse,rgba(255,107,107,0.08) 0%,transparent 70%)", pointerEvents:"none", zIndex:1 }}/>

      <div className="wrap" style={{
        flex: 1, display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        textAlign: "center", position: "relative", zIndex: 2,
        paddingTop: "clamp(48px,8vw,80px)",
        paddingBottom: "clamp(40px,6vw,64px)",
      }}>
        {/* Badge */}
        <motion.div initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.5 }} style={{ marginBottom:28 }}>
          <span className="badge"><span className="badge-dot"/>{content.badge}</span>
        </motion.div>

        <HeroHeadline/>
        <HeroCtas />
        <HeroScanWidget />
        <HeroSocialProof />
      </div>

      {/* Bottom fade */}
      <div style={{ position:"absolute", bottom:0, left:0, right:0, height:120, background:"linear-gradient(to top,var(--bg),transparent)", pointerEvents:"none", zIndex:3 }}/>

      <style>{`
        @media (max-width: 768px) {
          .hero-bg-images    { display: none !important; }
          .widget-stat-right { display: none !important; }
          .widget-stat-left  { display: none !important; }
        }
        html[data-theme="light"] .hero-light-overlay { opacity: 1 !important; }
      `}</style>
    </section>
  );
}
