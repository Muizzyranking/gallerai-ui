import Image from "next/image";
import Link from "next/link";
import Fade from "@/components/motion/Fade";
import { finalCta } from "@/content/site";

export default function FinalCta() {
  return (
    <section style={{ background: "var(--paper)", paddingBottom: 96 }}>
      <div className="wrap">
        <Fade>
          <div
            style={{
              position: "relative",
              borderRadius: 20,
              overflow: "hidden",
              background: "var(--espresso)",
              display: "grid",
              gridTemplateColumns: "1.05fr 0.95fr",
              minHeight: 380,
            }}
            id="final-grid"
          >
            <div
              style={{
                padding: "clamp(32px,5vw,64px)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <h2 className="display-lg" style={{ color: "#fff", marginBottom: 16 }}>
                {finalCta.heading}
              </h2>
              <p style={{ fontSize: "1.05rem", lineHeight: 1.65, color: "#d8c3ab", maxWidth: 460, marginBottom: 30 }}>
                {finalCta.body}
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
                <Link href={finalCta.primary.href} className="btn-primary">
                  {finalCta.primary.label}
                </Link>
                <Link
                  href={finalCta.secondary.href}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    padding: "15px 10px",
                    color: "#f0e2cf",
                    fontWeight: 700,
                    borderBottom: "2px solid rgba(255,255,255,0.3)",
                  }}
                >
                  {finalCta.secondary.label}
                </Link>
              </div>
            </div>
            <div style={{ position: "relative", minHeight: 300 }}>
              <Image
                src={finalCta.image}
                alt={finalCta.imageAlt}
                fill
                sizes="(max-width: 900px) 100vw, 560px"
                style={{ objectFit: "cover" }}
              />
            </div>
          </div>
        </Fade>
      </div>
      <style>{`
        @media (max-width: 900px) {
          #final-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
