"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { content, GALLERY_THUMBS, type GalleryThumb } from "./content";

const DOTS = [
  { id: "eye-l",      x: 37, y: 32, t: 0.08 },
  { id: "eye-r",      x: 63, y: 32, t: 0.08 },
  { id: "brow-l",     x: 30, y: 26, t: 0.04 },
  { id: "brow-r",     x: 70, y: 26, t: 0.04 },
  { id: "nose-tip",   x: 50, y: 47, t: 0.38 },
  { id: "nostril-l",  x: 44, y: 54, t: 0.46 },
  { id: "nostril-r",  x: 56, y: 54, t: 0.46 },
  { id: "mouth-l",    x: 37, y: 64, t: 0.58 },
  { id: "mouth-r",    x: 63, y: 64, t: 0.58 },
  { id: "mouth-c",    x: 50, y: 68, t: 0.64 },
  { id: "chin",       x: 50, y: 75, t: 0.72 },
  { id: "cheek-l",    x: 27, y: 42, t: 0.28 },
  { id: "cheek-r",    x: 73, y: 42, t: 0.28 },
];

const PULSE_RINGS = [
  { id: "ring-0",   delay: 0   },
  { id: "ring-0.5", delay: 0.5 },
];

const widget = content.widget
const thumbs = GALLERY_THUMBS

interface Props {
  widget: typeof content.widget;
  thumbs: GalleryThumb[];
}

type Phase = "scanning" | "matched" | "gallery";

function ScanWidget({ widget, thumbs }: Props) {
  const [phase, setPhase] = useState<Phase>("scanning");
  const [prog,  setProg]  = useState(0);
  const raf = useRef<number | null>(null);

  const startScan = useCallback(() => {
    setPhase("scanning");
    setProg(0);
    let t0: number | null = null;
    const DUR = 2800;

    const tick = (ts: number) => {
      if (!t0) t0 = ts;
      const p = Math.min((ts - t0) / DUR, 1);
      setProg(p);
      if (p < 1) {
        raf.current = requestAnimationFrame(tick);
      } else {
        setPhase("matched");
        setTimeout(() => setPhase("gallery"), 900);
        setTimeout(() => startScan(), 4500);
      }
    };
    raf.current = requestAnimationFrame(tick);
  }, []);

  useEffect(() => {
    startScan();
    return () => { if (raf.current) cancelAnimationFrame(raf.current); };
  }, [startScan]);

  const scanY   = prog * 100;
  const isMatch = phase === "matched" || phase === "gallery";

  return (
    <div style={{ position: "relative", width: 200, height: 200 }}>

      {/* ── SCANNING / MATCHED ── */}
      <AnimatePresence>
        {phase !== "gallery" && (
          <motion.div
            key="scan"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            style={{ position: "absolute", inset: 0 }}
          >
            {/* Outer frame */}
            <div style={{
              position: "absolute", inset: 0,
              borderWidth: 1, borderStyle: "solid",
              borderColor: isMatch ? "var(--coral)" : "rgba(255,255,255,0.14)",
              borderRadius: 8, transition: "border-color 0.4s",
            }}/>

            {/* Corner brackets */}
            <div style={{ position:"absolute", top:0,    left:0,  width:20, height:20, borderTopWidth:2,    borderTopStyle:"solid",    borderLeftWidth:2,   borderLeftStyle:"solid",   borderTopLeftRadius:7,     borderColor: isMatch ? "var(--coral)" : "rgba(255,255,255,0.4)", transition:"border-color 0.4s" }}/>
            <div style={{ position:"absolute", top:0,    right:0, width:20, height:20, borderTopWidth:2,    borderTopStyle:"solid",    borderRightWidth:2,  borderRightStyle:"solid",  borderTopRightRadius:7,    borderColor: isMatch ? "var(--coral)" : "rgba(255,255,255,0.4)", transition:"border-color 0.4s" }}/>
            <div style={{ position:"absolute", bottom:0, left:0,  width:20, height:20, borderBottomWidth:2, borderBottomStyle:"solid", borderLeftWidth:2,   borderLeftStyle:"solid",   borderBottomLeftRadius:7,  borderColor: isMatch ? "var(--coral)" : "rgba(255,255,255,0.4)", transition:"border-color 0.4s" }}/>
            <div style={{ position:"absolute", bottom:0, right:0, width:20, height:20, borderBottomWidth:2, borderBottomStyle:"solid", borderRightWidth:2,  borderRightStyle:"solid",  borderBottomRightRadius:7, borderColor: isMatch ? "var(--coral)" : "rgba(255,255,255,0.4)", transition:"border-color 0.4s" }}/>

            {/* Face silhouette */}
            <div style={{ position: "absolute", inset: 18, opacity: 0.18 }}>
              <svg viewBox="0 0 100 100" width="100%" height="100%" fill="none" aria-hidden="true">
                <ellipse cx="50" cy="46" rx="27" ry="33" stroke="var(--ink)" strokeWidth="1.5"/>
                <line x1="44" y1="79" x2="40" y2="93" stroke="var(--ink)" strokeWidth="1.5"/>
                <line x1="56" y1="79" x2="60" y2="93" stroke="var(--ink)" strokeWidth="1.5"/>
                <ellipse cx="37" cy="41" rx="5" ry="3.5" stroke="var(--ink)" strokeWidth="1.2"/>
                <ellipse cx="63" cy="41" rx="5" ry="3.5" stroke="var(--ink)" strokeWidth="1.2"/>
                <path d="M48 47 L44 57 Q50 61 56 57 Z" stroke="var(--ink)" strokeWidth="1.2"/>
                <path d="M37 68 Q50 74 63 68" stroke="var(--ink)" strokeWidth="1.2"/>
              </svg>
            </div>

            {/* Scan line */}
            {phase === "scanning" && (
              <div style={{ position:"absolute", left:3, right:3, top:`${scanY * 0.86}%`, pointerEvents:"none" }}>
                <div style={{ height:1, background:"var(--coral)", boxShadow:"0 0 10px var(--coral)", borderRadius:1 }}/>
                <div style={{ height:16, background:"linear-gradient(to bottom,rgba(255,107,107,0.18),transparent)", marginTop:-1 }}/>
              </div>
            )}

            {/* Landmark dots */}
            {DOTS.map((d) => (
              <div
                key={d.id}
                style={{
                  position: "absolute",
                  left: `${d.x}%`, top: `${d.y}%`,
                  width: 4, height: 4, borderRadius: "50%",
                  background: isMatch ? "var(--coral)" : "rgba(180,180,220,0.85)",
                  transform:  `translate(-50%,-50%) scale(${prog > d.t ? 1 : 0})`,
                  opacity:    prog > d.t ? 1 : 0,
                  transition: `transform 0.2s, opacity 0.2s, background 0.4s`,
                  boxShadow:  isMatch ? "0 0 6px var(--coral)" : "none",
                }}
              />
            ))}

            {/* Match label */}
            {phase === "matched" && (
              <motion.div
                initial={{ opacity:0, y:6 }}
                animate={{ opacity:1, y:0 }}
                style={{
                  position: "absolute", bottom: -34, left: "50%",
                  transform: "translateX(-50%)", whiteSpace: "nowrap",
                  background: "rgba(255,107,107,0.1)",
                  borderWidth:1, borderStyle:"solid", borderColor:"rgba(255,107,107,0.3)",
                  borderRadius: 99, padding: "4px 12px",
                  fontFamily: "var(--font-mono)", fontSize: "0.55rem",
                  color: "var(--coral)", letterSpacing: "0.12em",
                }}
              >
                {widget.match}
              </motion.div>
            )}

            {/* Pulse rings */}
            {isMatch && PULSE_RINGS.map((ring) => (
              <div
                key={ring.id}
                style={{
                  position: "absolute", inset: -8,
                  borderWidth:1, borderStyle:"solid", borderColor:"rgba(255,107,107,0.2)",
                  borderRadius: 12,
                  animation: `ring-pulse 1.6s ease-out ${ring.delay}s infinite`,
                  pointerEvents: "none",
                }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── GALLERY ── */}
      <AnimatePresence>
        {phase === "gallery" && (
          <motion.div
            key="gallery"
            initial={{ opacity:0, scale:0.92 }}
            animate={{ opacity:1, scale:1 }}
            exit={{   opacity:0, scale:0.92 }}
            transition={{ duration:0.4, ease:[0.16,1,0.3,1] }}
            style={{ position:"absolute", inset:0 }}
          >
            <div style={{
              position: "absolute", inset: 0,
              borderWidth:1, borderStyle:"solid", borderColor:"var(--coral)",
              borderRadius: 8, overflow: "hidden", background: "var(--bg-2)",
            }}>
              {/* Header bar */}
              <div style={{
                padding: "7px 10px",
                borderBottomWidth:1, borderBottomStyle:"solid", borderBottomColor:"rgba(255,107,107,0.2)",
                display:"flex", alignItems:"center", gap:6,
              }}>
                <div style={{ width:5, height:5, borderRadius:"50%", background:"var(--coral)", boxShadow:"0 0 6px var(--coral)" }}/>
                <span style={{ fontFamily:"var(--font-mono)", fontSize:"0.5rem", color:"var(--coral)", letterSpacing:"0.14em" }}>
                  {widget.photos}
                </span>
              </div>

              {/* 2×2 grid */}
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:2, padding:8, height:"calc(100% - 32px)" }}>
                {thumbs.map((thumb, i) => (
                  <motion.div
                    key={thumb.id}
                    initial={{ opacity:0, scale:0.85 }}
                    animate={{ opacity:1, scale:1 }}
                    transition={{ delay: i * 0.08, duration:0.35, ease:[0.16,1,0.3,1] }}
                    style={{ borderRadius:4, overflow:"hidden", position:"relative", background:thumb.gradient }}
                  >
                    {thumb.src ? (
                      <Image
                        src={thumb.src}
                        alt={`Matched photo ${i + 1}`}
                        fill
                        style={{ objectFit:"cover" }}
                        sizes="80px"
                      />
                    ) : (
                      <div style={{ width:"100%", height:"100%", background:thumb.gradient, minHeight:60 }}/>
                    )}

                    {/* Check badge on first thumb only */}
                    {i === 0 && (
                      <div style={{
                        position:"absolute", bottom:4, right:4,
                        width:14, height:14, borderRadius:"50%",
                        background:"var(--coral)",
                        display:"flex", alignItems:"center", justifyContent:"center",
                      }}>
                        <svg width="8" height="8" viewBox="0 0 8 8" fill="none" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
                          <path d="M1.5 4l2 2 3-3"/>
                        </svg>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Download hint */}
            <motion.div
              initial={{ opacity:0, y:4 }}
              animate={{ opacity:1, y:0 }}
              transition={{ delay:0.4, duration:0.3 }}
              style={{
                position:"absolute", bottom:-34, left:"50%",
                transform:"translateX(-50%)", whiteSpace:"nowrap",
                display:"flex", alignItems:"center", gap:6,
                fontFamily:"var(--font-mono)", fontSize:"0.52rem",
                color:"var(--ink-3)", letterSpacing:"0.1em",
              }}
            >
              <svg width="9" height="9" viewBox="0 0 9 9" fill="none" stroke="var(--coral)" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
                <path d="M4.5 1v5M2 5l2.5 2.5L7 5"/><path d="M1 8h7"/>
              </svg>
              {widget.download}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function HeroScanWidget() {
  return (
    <motion.div
      initial={{ opacity:0, scale:0.88, y:20 }}
      animate={{ opacity:1, scale:1,    y:0 }}
      transition={{ delay:0.45, duration:0.8, ease:[0.16,1,0.3,1] }}
      style={{ marginBottom: 52 }}
    >
      <div style={{
        background: "var(--bg-2)",
        borderWidth:1, borderStyle:"solid", borderColor:"rgba(255,255,255,0.08)",
        borderRadius:14, padding:"24px 36px 52px",
        display:"inline-flex", flexDirection:"column", alignItems:"center", gap:22,
        boxShadow:"0 20px 60px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.03)",
        position:"relative",
      }}>
        {/* Header */}
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <div style={{ width:5, height:5, borderRadius:"50%", background:"var(--coral)", boxShadow:"0 0 8px var(--coral)" }}/>
          <span style={{ fontFamily:"var(--font-mono)", fontSize:"0.55rem", letterSpacing:"0.2em", textTransform:"uppercase", color:"var(--ink-3)" }}>
            {widget.label}
          </span>
        </div>

        <ScanWidget widget={widget} thumbs={thumbs} />

        {/* Stat pill — right */}
        <div style={{ position:"absolute", top:"50%", right:-88, transform:"translateY(-50%)" }} className="widget-stat-right">
          <div style={{ background:"var(--bg-3)", borderWidth:1, borderStyle:"solid", borderColor:"rgba(255,255,255,0.08)", borderRadius:8, padding:"10px 14px", boxShadow:"0 4px 20px rgba(0,0,0,0.3)" }}>
            <div style={{ fontFamily:"var(--font-mono)", fontSize:"0.5rem", color:"var(--ink-3)", letterSpacing:"0.14em", marginBottom:3 }}>{widget.accuracy.label}</div>
            <div style={{ fontFamily:"var(--font-display)", fontSize:"1.6rem", fontWeight:600, color:"var(--coral)", lineHeight:1 }}>{widget.accuracy.value}</div>
          </div>
        </div>

        {/* Stat pill — left */}
        <div style={{ position:"absolute", top:"50%", left:-80, transform:"translateY(-50%)" }} className="widget-stat-left">
          <div style={{ background:"var(--bg-3)", borderWidth:1, borderStyle:"solid", borderColor:"rgba(255,255,255,0.08)", borderRadius:8, padding:"10px 14px", boxShadow:"0 4px 20px rgba(0,0,0,0.3)" }}>
            <div style={{ fontFamily:"var(--font-mono)", fontSize:"0.5rem", color:"var(--ink-3)", letterSpacing:"0.14em", marginBottom:3 }}>{widget.speed.label}</div>
            <div style={{ fontFamily:"var(--font-display)", fontSize:"1.6rem", fontWeight:600, color:"var(--ink)", lineHeight:1 }}>{widget.speed.value}</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
