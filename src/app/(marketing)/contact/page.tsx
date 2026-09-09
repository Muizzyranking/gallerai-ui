import ContactForm from "@/components/marketing/ContactForm";
import PageHero from "@/components/marketing/PageHero";
import Fade from "@/components/motion/Fade";
import { site } from "@/content/site";

export default function ContactPage() {
  return (
    <>
      <PageHero
        kicker="Contact"
        title="Talk to us about your event"
        lede="Planning a wedding, festival, conference or a season of events? Tell us the date and guest count and we will recommend the right setup."
      />
      <section style={{ background: "var(--paper)" }}>
        <div className="wrap" style={{ maxWidth: 860, paddingTop: 48, paddingBottom: 88, display: "flex", flexDirection: "column", gap: 20 }}>
          <Fade>
            <ContactForm />
          </Fade>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }} id="contact-grid">
            <Fade delay={80}>
              <div className="card" style={{ padding: "30px 28px" }}>
                <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.3rem", fontWeight: 750, marginBottom: 10 }}>Event planning</h2>
                <p className="body-text" style={{ marginBottom: 18 }}>
                  Dates, guest counts, photographer workflow, QR posters.
                </p>
                <a
                  href={`mailto:${site.contactEmail}`}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    border: "1.5px solid var(--line-strong)",
                    borderRadius: "var(--r-ctl)",
                    padding: "13px 16px",
                    fontSize: "1rem",
                    fontWeight: 700,
                    color: "var(--ink)",
                    background: "var(--cream)",
                    overflowWrap: "anywhere",
                  }}
                >
                  <span aria-hidden="true" style={{ flexShrink: 0, color: "var(--accent-deep)" }}>
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <rect x="2" y="4" width="20" height="16" rx="2" />
                      <path d="m22 7-10 6L2 7" />
                    </svg>
                  </span>
                  {site.contactEmail}
                </a>
              </div>
            </Fade>
            <Fade delay={140}>
              <div className="card" style={{ padding: "30px 28px" }}>
                <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.3rem", fontWeight: 750, marginBottom: 10 }}>Support & privacy</h2>
                <p className="body-text" style={{ marginBottom: 18 }}>
                  Gallery help, removals, data and face-data requests.
                </p>
                <a
                  href={`mailto:${site.supportEmail}`}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    border: "1.5px solid var(--line-strong)",
                    borderRadius: "var(--r-ctl)",
                    padding: "13px 16px",
                    fontSize: "1rem",
                    fontWeight: 700,
                    color: "var(--ink)",
                    background: "var(--cream)",
                    overflowWrap: "anywhere",
                  }}
                >
                  <span aria-hidden="true" style={{ flexShrink: 0, color: "var(--accent-deep)" }}>
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <rect x="2" y="4" width="20" height="16" rx="2" />
                      <path d="m22 7-10 6L2 7" />
                    </svg>
                  </span>
                  {site.supportEmail}
                </a>
              </div>
            </Fade>
          </div>
        </div>
      </section>
      <style>{`@media (max-width: 760px) { #contact-grid { grid-template-columns: 1fr !important; } }`}</style>
    </>
  );
}
