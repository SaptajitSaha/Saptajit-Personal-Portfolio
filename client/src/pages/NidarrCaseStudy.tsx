import { ArrowUpRight, ArrowLeft } from "lucide-react";
import { useEffect } from "react";
import { Link } from "wouter";
import "./nidarr-case.css";

const features = [
  {
    id: "01",
    title: "Structured reporting",
    body: "Incident text goes to the Express backend, where Gemini returns a provisional structured analysis — category, severity, time context, and summary — protected by an 18-second frontend timeout with retry.",
  },
  {
    id: "02",
    title: "Transparent signal map",
    body: "OpenStreetMap through React Leaflet, with seven bundled demonstration signals and user reports rendered as distinctly purple, explicitly unverified markers. Demo counts and community counts never mix.",
  },
  {
    id: "03",
    title: "Walk With Me",
    body: "Foreground-only timed journeys with optional trusted-contact details, timestamp-derived countdowns, check-ins, and a clearly labelled simulated help state for demos.",
  },
  {
    id: "04",
    title: "User-confirmed location",
    body: "Reports use browser geolocation or a manually selected map point. Gemini never supplies latitude or longitude — the user always confirms where something happened.",
  },
  {
    id: "05",
    title: "Local profile & reset",
    body: "Device-local personalisation, trusted-contact defaults, and a confirmed prototype reset that removes only Nidarr-owned state while preserving bundled demonstration signals.",
  },
  {
    id: "06",
    title: "Tested interactions",
    body: "The reporting and journey flows are covered by Playwright browser tests against Chromium, keeping the prototype's core loops stable while it evolves.",
  },
];

const workflow = [
  { step: "Report", body: "Choose a category and describe the concern in your own words." },
  { step: "Analyse", body: "Gemini returns a provisional structured result — or nothing, if the report isn't safety-relevant." },
  { step: "Confirm", body: "You supply or select the coordinates. The AI never decides where something happened." },
  { step: "Map", body: "The report is saved as a pending community signal — visible, purple, and explicitly unverified." },
];

export default function NidarrCaseStudy() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="case-page">
      <header className="case-top">
        <Link className="case-back" href="/"><ArrowLeft size={15} aria-hidden="true" /> Portfolio</Link>
        <div className="case-top__links">
          <a href="https://nidarr.vercel.app/" target="_blank" rel="noreferrer">Live prototype <ArrowUpRight size={13} aria-hidden="true" /></a>
          <a href="https://github.com/SaptajitSaha/Nidarr" target="_blank" rel="noreferrer">GitHub <ArrowUpRight size={13} aria-hidden="true" /></a>
        </div>
      </header>

      <main className="case-main">
        <p className="case-label">Case study · 2026 · Personal safety prototype</p>
        <h1 className="case-title">Nidarr</h1>
        <p className="case-tagline">A mobile-first personal-safety prototype for clearer reporting, transparent safety signals, and foreground journey check-ins.</p>

        <div className="case-body">
          <section className="case-section">
            <h2>The problem</h2>
            <p>People navigating an uncomfortable situation often need several things at once: a simple way to structure what happened, geographic context, and a lightweight journey check-in. Those experiences are commonly fragmented — and safety information is easily presented with more certainty than the evidence supports.</p>
            <p>Nidarr explores one mobile experience that connects those tasks while clearly separating three things most products blur together: fictional demonstration data, provisional AI analysis, and unverified community submissions.</p>
          </section>

          <section className="case-section">
            <h2>What actually works</h2>
            <p>This is a hackathon prototype, not a production safety service — so the feature set is deliberately scoped to things that genuinely function end to end.</p>
            <div className="case-features">
              {features.map(feature => (
                <article className="case-feature" key={feature.id}>
                  <span className="case-feature__id">{feature.id}</span>
                  <h3>{feature.title}</h3>
                  <p>{feature.body}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="case-section">
            <h2>The workflow</h2>
            <div className="case-workflow">
              {workflow.map((item, index) => (
                <article className="case-step" key={item.step}>
                  <span className="case-step__no">{String(index + 1).padStart(2, "0")}</span>
                  <h3>{item.step}</h3>
                  <p>{item.body}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="case-section case-note">
            <h2>Honest by design</h2>
            <p>Nidarr never verifies allegations, recommends a "safest" route, contacts emergency services, or sends real alerts. Every screen labels what is demonstration data, what is provisional AI output, and what comes from the community — because a safety interface that overstates its certainty is worse than no interface at all.</p>
          </section>

          <section className="case-section">
            <h2>Built with</h2>
            <p className="case-stack">React 19 · TypeScript · Vite · Express 5 · Leaflet &amp; OpenStreetMap · Gemini API · Playwright</p>
            <p className="case-stack-note">My role covered the product design, the full React frontend, the Gemini analysis flow and its guardrails, and the Playwright test coverage.</p>
          </section>
        </div>

        <footer className="case-footer">
          <a className="case-cta" href="https://nidarr.vercel.app/" target="_blank" rel="noreferrer">Open the live prototype <ArrowUpRight size={16} aria-hidden="true" /></a>
          <Link className="case-back case-back--bottom" href="/"><ArrowLeft size={15} aria-hidden="true" /> Back to the portfolio</Link>
        </footer>
      </main>
    </div>
  );
}
