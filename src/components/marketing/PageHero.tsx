import Fade from "@/components/motion/Fade";

export default function PageHero({ kicker, title, lede }: { kicker: string; title: string; lede: string }) {
  return (
    <section style={{ background: "var(--cream)", borderBottom: "1px solid var(--line)" }}>
      <div className="wrap" style={{ paddingTop: 72, paddingBottom: 56, maxWidth: 860 }}>
        <Fade>
          <div className="kicker" style={{ marginBottom: 16 }}>
            {kicker}
          </div>
          <h1 className="display-lg" style={{ marginBottom: 16 }}>
            {title}
          </h1>
          <p className="lede">{lede}</p>
        </Fade>
      </div>
    </section>
  );
}
