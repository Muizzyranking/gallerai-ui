import PageHero from "@/components/marketing/PageHero";
import Fade from "@/components/motion/Fade";

export default function ComplianceDoc({
  kicker,
  title,
  updated,
  intro,
  sections,
}: {
  kicker: string;
  title: string;
  updated: string;
  intro: string;
  sections: { h: string; p: string }[];
}) {
  return (
    <>
      <PageHero kicker={kicker} title={title} lede={intro} />
      <section style={{ background: "var(--paper)" }}>
        <div className="wrap" style={{ maxWidth: 820, paddingTop: 48, paddingBottom: 88 }}>
          <Fade>
            <p className="small-text" style={{ marginBottom: 32 }}>
              {updated}
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
              {sections.map((s, i) => (
                <div key={s.h} style={{ background: "#fff", border: "1px solid var(--line)", borderRadius: "var(--r-card)", padding: "26px 28px" }}>
                  <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.2rem", fontWeight: 750, marginBottom: 10 }}>
                    <span style={{ color: "var(--accent)", marginRight: 10 }}>{String(i + 1).padStart(2, "0")}</span>
                    {s.h}
                  </h2>
                  <p className="body-text">{s.p}</p>
                </div>
              ))}
            </div>
          </Fade>
        </div>
      </section>
    </>
  );
}
