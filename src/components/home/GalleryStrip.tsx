import Image from "next/image";
import Fade from "@/components/motion/Fade";
import { galleryStrip } from "@/content/site";

const COPIES = [0, 1, 2, 3];

function MarqueeRow({ images, reverse = false }: { images: typeof galleryStrip.images; reverse?: boolean; label: string }) {
  return (
    <div className="marquee-viewport">
      <div className={`marquee-track${reverse ? " marquee-reverse" : ""}`}>
        {COPIES.map((g) => (
          <div key={g} className="marquee-group" aria-hidden={g > 0}>
            {images.map((img) => (
              <figure
                key={`${g}-${img.caption}`}
                className="card"
                style={{ overflow: "hidden", margin: 0, width: 280, flexShrink: 0, position: "relative", border: "none" }}
              >
                <div style={{ position: "relative", aspectRatio: "1/1" }}>
                  <Image src={img.src} alt={g === 0 ? img.alt : ""} fill sizes="280px" style={{ objectFit: "cover" }} loading="lazy" />
                </div>
                <figcaption
                  style={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    textAlign: "center",
                    padding: 20,
                    background: "rgba(24,14,10,0.42)",
                    color: "#fffaf3",
                    fontFamily: "var(--font-display)",
                    fontSize: "1.45rem",
                    fontWeight: 800,
                    letterSpacing: "-0.01em",
                    lineHeight: 1.2,
                  }}
                >
                  {img.caption}
                </figcaption>
              </figure>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function GalleryStrip() {
  const mid = Math.ceil(galleryStrip.images.length / 2);
  const rowA = galleryStrip.images.slice(0, mid);
  const rowB = galleryStrip.images.slice(mid);

  return (
    <section style={{ background: "var(--cream)", borderBottom: "1px solid var(--line)", overflow: "hidden" }}>
      <div className="wrap section-pad" style={{ paddingBottom: 36 }}>
        <Fade>
          <div className="kicker" style={{ marginBottom: 14 }}>
            {galleryStrip.kicker}
          </div>
          <h2 className="display-lg" style={{ maxWidth: 640, marginBottom: 14 }}>
            {galleryStrip.heading}
          </h2>
          <p className="body-text" style={{ maxWidth: 640 }}>
            {galleryStrip.body}
          </p>
        </Fade>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 16, paddingBottom: 56 }}>
        <MarqueeRow images={rowA} label="Event galleries row one" />
        <MarqueeRow images={rowB} reverse label="Event galleries row two" />
      </div>

      <style>{`
        .marquee-viewport { overflow: hidden; width: 100%; }
        .marquee-track {
          display: flex;
          width: max-content;
          animation: marquee-left 55s linear infinite;
        }
        .marquee-track.marquee-reverse { animation: marquee-right 60s linear infinite; }
        .marquee-group {
          display: flex;
          gap: 16px;
          padding-right: 16px;
        }
        .marquee-viewport:hover .marquee-track { animation-play-state: paused; }
        @keyframes marquee-left {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        @keyframes marquee-right {
          from { transform: translateX(-50%); }
          to { transform: translateX(0); }
        }
        @media (prefers-reduced-motion: reduce) {
          .marquee-track, .marquee-track.marquee-reverse { animation: none; }
          .marquee-viewport { overflow-x: auto; }
        }
      `}</style>
    </section>
  );
}
