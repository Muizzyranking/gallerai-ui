import Image from "next/image";
import Link from "next/link";
import FaceScanDemo from "@/components/home/FaceScanDemo";
import Fade from "@/components/motion/Fade";
import { hero } from "@/content/site";

export default function Hero() {
  return (
    <section style={{ background: "var(--paper)", borderBottom: "1px solid var(--line)" }}>
      <div
        className="wrap"
        style={{
          display: "grid",
          gridTemplateColumns: "1.05fr 0.95fr",
          gap: "clamp(32px,5vw,64px)",
          alignItems: "center",
          paddingTop: 72,
          paddingBottom: 72,
        }}
        id="hero-grid"
      >
        <Fade>
          <div className="kicker" style={{ marginBottom: 18 }}>
            {hero.kicker}
          </div>
          <h1 className="display-hero" style={{ marginBottom: 20 }}>
            {hero.headlineA}
            <br />
            <span style={{ color: "var(--accent)" }}>{hero.headlineB}</span>
          </h1>
          <p className="lede" style={{ marginBottom: 30 }}>
            {hero.lede}
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
            <Link href={hero.primaryCta.href} className="btn-primary">
              {hero.primaryCta.label}
            </Link>
            <Link href={hero.secondaryCta.href} className="btn-secondary">
              {hero.secondaryCta.label}
            </Link>
          </div>
        </Fade>

        <Fade delay={120}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, alignItems: "start" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 24, minWidth: 0 }}>
              <FaceScanDemo />
              <div className="card" style={{ padding: "18px 20px", background: "#fff" }}>
                <div
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.7rem",
                    letterSpacing: "0.14em",
                    color: "var(--accent-ink)",
                    marginBottom: 8,
                  }}
                >
                  SELFIE SEARCH
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "1.4rem",
                    fontWeight: 800,
                    lineHeight: 1.2,
                    color: "var(--ink)",
                  }}
                >
                  Find every photo you&apos;re in
                </div>
                <div style={{ marginTop: 6, fontSize: "0.9rem", color: "var(--ink-2)" }}>
                  No scrolling, no shared drives
                </div>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 24, minWidth: 0 }}>
              <div
                className="card"
                style={{ padding: "18px 20px", background: "var(--marigold-soft)", borderColor: "#ecd9a8" }}
              >
                <div
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.7rem",
                    letterSpacing: "0.14em",
                    color: "#8a6100",
                    marginBottom: 8,
                  }}
                >
                  LIVE GALLERY
                </div>
                <div style={{ fontFamily: "var(--font-display)", fontSize: "2rem", fontWeight: 800, lineHeight: 1 }}>
                  248
                </div>
                <div style={{ fontSize: "0.9rem", color: "#6b5420" }}>photos in Amara & Daniel&apos;s gallery</div>
              </div>
              <figure className="card" style={{ overflow: "hidden", margin: 0 }}>
                <div style={{ position: "relative", aspectRatio: "1/1" }}>
                  <Image
                    src="https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=700&auto=format&fit=crop"
                    alt="Wedding couple dancing while guests celebrate"
                    fill
                    sizes="300px"
                    style={{ objectFit: "cover" }}
                    priority
                  />
                </div>
                <figcaption className="hero-caption">
                  <span
                    style={{
                      fontSize: "0.9rem",
                      fontWeight: 700,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    Amara & Daniel — Wedding
                  </span>
                  <span className="event-tag-light" style={{ flexShrink: 0 }}>
                    248 photos
                  </span>
                </figcaption>
              </figure>
            </div>
          </div>
        </Fade>
      </div>

      <style>{`
        .hero-caption {
          padding: 12px 16px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 10px;
          border-top: 1px solid var(--line);
          background: #fff;
        }
        @media (max-width: 960px) {
          #hero-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
