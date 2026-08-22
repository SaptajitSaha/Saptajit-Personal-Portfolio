/** Signal Field refinement: legible editorial hierarchy, personal storytelling, and evidence-led project narratives. */
import { BlurText } from "@/components/BlurText";
import { CaseStudy, CaseStudyPanel } from "@/components/CaseStudyPanel";
import { ContactDialog } from "@/components/ContactDialog";
import { NidarrShowcase } from "@/components/NidarrShowcase";
import { OrbitalScene } from "@/components/OrbitalScene";
import { learningTracks } from "@/lib/learningTracks";
import { primaryNavigation, type PrimaryNavigationId } from "@/lib/navigation";
import { toolboxPractices, toolboxTickerRows, type ToolboxTickerRow } from "@/lib/toolboxTicker";
import {
  ArrowUpRight,
  Braces,
  CircleDotDashed,
  GraduationCap,
  Github,
  Layers3,
  Linkedin,
  Mail,
  MapPin,
  Menu,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

const portrait = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663907191755/WekHJzpZOJUKIlnp.jpeg";
const logoMark = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663907191755/jMpoHQKDfmjRxKql.png";
const nidarrEvidence = {
  home: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663907191755/ZuhcSYWKTRzpFYal.png",
  report: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663907191755/gDDTVyQMOfOWXWDG.png",
  walk: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663907191755/BOdBIwbeInlygQnU.png",
  map: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663907191755/gKiQtaxPOaaPCGJB.png",
  profile: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663907191755/IRtCRCwruNdloRka.png",
};

type Project = CaseStudy & { title: string; tagline: string; className: string };

const projects: Project[] = [
  {
    title: "Nidarr",
    category: "Personal safety prototype",
    year: "2026",
    role: "Product & frontend prototype builder",
    tagline: "A mobile safety prototype that brings critical actions into one guided, more usable flow.",
    problem: "Safety tools can become hard to navigate when a person needs a clear next action quickly.",
    approach: "Started with one mobile entry point, then shaped a flow around visible safety signals and concrete actions.",
    system: "React, TypeScript, Gemini-powered analysis, location-aware reporting, Safety Map, and Walk With Me.",
    contribution: "Built the product flow, safety overview, incident-report experience, and the Walk With Me concept.",
    learning: "How can a safety interaction stay clear and useful when location or community context is incomplete?",
    status: "Prototype. Public performance results are not published.",
    href: "https://nidarr.vercel.app/",
    linkLabel: "Visit prototype",
    className: "work-feature nidarr-card",
  },
  {
    title: "Interactive Election Assistant",
    category: "Civic AI concept",
    year: "2026",
    role: "Experience prototype builder",
    tagline: "A decision-based guide for questions around voting eligibility, documents, voter lists, and relocation.",
    problem: "Civic questions are often personal and context-specific, while generic answers can leave people uncertain about what to do.",
    approach: "Framed guidance as a decision flow so the next useful question remains visible.",
    system: "AI-guided interaction design, accessible UX principles, and product prototyping.",
    contribution: "Shaped the decision-flow concept and the interaction model for practical voter questions.",
    learning: "How can AI guidance be helpful without hiding uncertainty or making decisions for people?",
    status: "Concept prototype. No outcome metrics are claimed.",
    href: "https://www.linkedin.com/in/saptajitsaha/",
    linkLabel: "See project context",
    className: "work-compact",
  },
  {
    title: "Operational Analytics",
    category: "Data practice",
    year: "2025–26",
    role: "Analyst & dashboard builder",
    tagline: "A set of placement, scholarship, and e-commerce explorations that turn messy records into clearer questions.",
    problem: "Operational data often hides the patterns, bottlenecks, and choices that deserve attention.",
    approach: "Used analysis and dashboards to move from raw records toward decision-ready views.",
    system: "Python, SQL, Power BI, Looker Studio, Excel, Pandas, and data visualization.",
    contribution: "Cleaned data, explored trends, and structured dashboards around useful operational questions.",
    learning: "The visual is only useful when the question behind it is precise.",
    status: "Portfolio practice across multiple datasets. No performance metrics are claimed.",
    href: "https://github.com/SaptajitSaha",
    linkLabel: "Visit GitHub",
    className: "work-compact work-compact--dark",
  },
];

export default function Home() {
  const pendingNavigationRef = useRef<PrimaryNavigationId | null>(null);
  const navigationTimerRef = useRef<number | undefined>(undefined);
  const [activeSection, setActiveSection] = useState<PrimaryNavigationId>("top");

  function activateNavigation(id: PrimaryNavigationId) {
    pendingNavigationRef.current = id;
    setActiveSection(id);
    if (navigationTimerRef.current) window.clearTimeout(navigationTimerRef.current);
    navigationTimerRef.current = window.setTimeout(() => {
      pendingNavigationRef.current = null;
    }, 1000);
  }

  useEffect(() => {
    let frame = 0;
    const syncActiveSection = () => {
      frame = 0;
      if (pendingNavigationRef.current) return;
      let next: PrimaryNavigationId = "top";
      for (const item of primaryNavigation.slice(1)) {
        const section = document.getElementById(item.id);
        if (section && section.getBoundingClientRect().top <= window.innerHeight * 0.34) next = item.id;
      }
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 8) next = "contact";
      setActiveSection(current => current === next ? current : next);
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(syncActiveSection);
    };
    syncActiveSection();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
      if (navigationTimerRef.current) window.clearTimeout(navigationTimerRef.current);
    };
  }, []);

  return (
    <div id="top" className="signal-field">
      <a className="skip-link" href="#main-content">Skip to content</a>
      <header className="site-header">
        <a className="brand-mark" href="#top" aria-label="Saptajit Saha home"><img src={logoMark} alt="" width="25" height="25" /><span>Saptajit Saha</span><i className="brand-signal" aria-hidden="true" /></a>
        <nav className="bubble-nav" aria-label="Primary navigation">
          {primaryNavigation.map((item) => <a key={item.id} href={`#${item.id}`} data-active={activeSection === item.id || undefined} aria-current={activeSection === item.id ? "location" : undefined} onClick={() => activateNavigation(item.id)}>{item.label}</a>)}
        </nav>
        <a className="bubble-email" href="mailto:sahasaptajit@gmail.com"><Mail size={15} aria-hidden="true" /><span>Email</span></a>
        <details className="mobile-bubble-nav">
          <summary aria-label="Open navigation"><Menu size={19} aria-hidden="true" /><span>Menu</span></summary>
          <nav aria-label="Mobile navigation">{primaryNavigation.map((item) => <a key={item.id} href={`#${item.id}`} data-active={activeSection === item.id || undefined} onClick={() => activateNavigation(item.id)}>{item.label}</a>)}</nav>
        </details>
      </header>

      <main id="main-content">
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-gridlines" aria-hidden="true" />
          <div className="hero-copy">
            <p className="kicker"><CircleDotDashed size={15} aria-hidden="true" /> Kolkata, India · IIT Madras ’29</p>
            <h1 id="hero-title">Saptajit<br /><span>Saha</span></h1>
            <BlurText className="hero-statement" text="Building at the intersection of AI, data, and software." />
            <p className="hero-detail">I build small, serious experiments that turn difficult questions into useful tools.</p>
            <div className="hero-actions">
              <a className="button button--signal" href="#work">Explore work <ArrowUpRight size={18} aria-hidden="true" /></a>
              <a className="button button--quiet" href="https://github.com/SaptajitSaha" target="_blank" rel="noreferrer">GitHub <Github size={17} aria-hidden="true" /></a>
            </div>
          </div>

          <OrbitalScene portraitSrc={portrait} portraitAlt="Saptajit Saha standing before a colorful Indian Institute of Technology Madras mural" />
        </section>

        <section className="signal-strip" aria-label="Current portfolio signal">
          <p>Currently building <strong>Nidarr</strong>, learning in public, and mapping the systems behind useful software.</p>
          <a href="https://nidarr.vercel.app/" target="_blank" rel="noreferrer">Open Nidarr <ArrowUpRight size={17} aria-hidden="true" /></a>
        </section>

        <section id="work" className="section work-section" aria-labelledby="work-heading">
          <div className="section-heading section-heading--work">
            <span>Selected work</span>
            <h2 id="work-heading">What I&apos;m<br /><em>making real.</em></h2>
            <p>Projects that explore safer interfaces, more human civic guidance, and data systems built around the next useful decision.</p>
          </div>
          <div className="work-layout">
            {projects.map((project) => {
              const isNidarr = project.title === "Nidarr";
              return (
              <article className={`${project.className} project-card`} key={project.title}>
                {isNidarr ? (
                  <NidarrShowcase assets={{ dashboard: nidarrEvidence.home, report: nidarrEvidence.report, map: nidarrEvidence.map }} />
                ) : <div className="work-visual work-visual--field"><div className="work-visual__artifact" aria-hidden="true"><span>{project.category}</span><span>{project.year}</span><i /></div></div>}
                <div className="project-card__content">
                  <div className="work-meta"><span>{project.category}</span><span>{project.year}</span></div>
                  <h3>{project.title}</h3>
                  <p className="work-tools">{project.role}</p>
                  <p className="work-description">{project.tagline}</p>
                  {isNidarr && <div className="nidarr-actions"><a className="project-live-link" href={project.href} target="_blank" rel="noreferrer">Open live prototype <ArrowUpRight size={16} aria-hidden="true" /></a></div>}
                  <CaseStudyPanel study={project} />
                </div>
              </article>
            )})}
          </div>
        </section>

        <section id="learning" className="section learning-section" aria-labelledby="learning-heading">
          <div className="learning-copy">
            <h2 id="learning-heading">I&apos;m learning<br />where the edge is.</h2>
            <p>These are active directions, not claimed expertise. Each one is a thread I&apos;m testing through projects, reading, and practice.</p>
          </div>
          <div className="learning-list">
            {learningTracks.map((track, index) => (
              <details className="learning-card" key={track.title}>
                <summary><span>{String(index + 1).padStart(2, "0")}</span><h3>{track.title}</h3><span className="learning-open">Explore <PlusMark /></span></summary>
                <div className="learning-card__detail"><p><strong>Currently exploring</strong>{track.now}</p><p><strong>Tools</strong>{track.tools}</p><p><strong>Question</strong>{track.question}</p><p><strong>Current project</strong>{track.project}</p></div>
              </details>
            ))}
          </div>
        </section>

        <section id="about" className="section about-section" aria-labelledby="about-heading">
          <div className="about-portrait"><img src={portrait} alt="Saptajit Saha at Indian Institute of Technology Madras" width="1084" height="1448" loading="lazy" /></div>
          <div className="about-copy">
            <h2 id="about-heading">Student status.<br /><em>Builder mindset.</em></h2>
            <p>I&apos;m Saptajit, an incoming second-year B.S. Data Science and Applications student at Indian Institute of Technology Madras. I&apos;m interested in AI, machine learning, data science, and software engineering because I like seeing an unclear system become something a person can actually use.</p>
            <p>I build because the fastest way to understand an idea is to give it edges, constraints, and a user. Right now, I&apos;m looking for the next problem worth taking apart carefully.</p>
            <div className="education-note"><GraduationCap size={20} aria-hidden="true" /><span><strong>Indian Institute of Technology Madras</strong> B.S. in Data Science and Applications · 2029</span></div>
          </div>
        </section>

        <section className="section toolbox-section" aria-labelledby="toolbox-heading">
          <div className="toolbox-topline"><span>Tools I use or am learning</span></div>
          <h2 id="toolbox-heading">Tools become useful<br /><em>when the questions do.</em></h2>
          <div className="toolbox-ticker" aria-label="Technology and tool groups">
            <ul className="toolbox-ticker__accessible">
              {toolboxTickerRows.flatMap(row => row.tools).map(tool => <li key={tool.name}>{tool.name}</li>)}
            </ul>
            {toolboxTickerRows.map(row => {
              const repeatedTools = [...row.tools, ...row.tools, ...row.tools];
              return <div className={`toolbox-ticker__row toolbox-ticker__row--${row.direction}`} key={row.label}>
                <span className="toolbox-ticker__label">{row.label}</span>
                <div className="toolbox-ticker__viewport">
                  <div className="toolbox-ticker__track" aria-hidden="true">
                    {repeatedTools.map((tool, index) => <div className="toolbox-chip" key={`${tool.name}-${index}`}><ToolboxMark tool={tool} /><span>{tool.name}</span></div>)}
                  </div>
                </div>
              </div>;
            })}
          </div>
          <div className="toolbox-practices" aria-label="Core practices"><span>Practices</span>{toolboxPractices.map(practice => <span className="toolbox-practice" key={practice}>{practice}</span>)}</div>
          <div className="learning-notes"><p><Braces size={18} aria-hidden="true" />Building with code, data, and small product experiments.</p><p><MapPin size={18} aria-hidden="true" />Based in Kolkata, looking outward.</p></div>
        </section>
      </main>

      <footer id="contact" className="site-footer">
        <section className="connect-panel" aria-labelledby="connect-heading">
          <div className="connect-panel__intro">
            <p className="connect-panel__kicker">Open channel</p>
            <h2 id="connect-heading">Connect with<br /><em>me.</em></h2>
            <p>Have an idea, a collaboration, or a problem worth taking apart? I&apos;d like to hear it.</p>
          </div>
          <div className="connect-panel__actions">
            <div className="connect-panel__message">
              <span className="connect-panel__status" aria-hidden="true" />
              <div><strong>Start a conversation</strong><p>A short note is enough to begin.</p></div>
            </div>
            <ContactDialog />
            <div className="connect-panel__direct" aria-label="Direct contact options">
              <a href="mailto:sahasaptajit@gmail.com"><Mail size={16} aria-hidden="true" /><span>Email directly</span><ArrowUpRight size={14} aria-hidden="true" /></a>
              <a href="https://www.linkedin.com/in/saptajitsaha/" target="_blank" rel="noreferrer"><Linkedin size={16} aria-hidden="true" /><span>LinkedIn</span><ArrowUpRight size={14} aria-hidden="true" /></a>
              <a href="https://github.com/SaptajitSaha" target="_blank" rel="noreferrer"><Github size={16} aria-hidden="true" /><span>GitHub</span><ArrowUpRight size={14} aria-hidden="true" /></a>
            </div>
          </div>
        </section>
        <div className="footer-bottom"><span>© 2026 Saptajit Saha</span><span>Kolkata, India</span></div>
      </footer>
    </div>
  );
}

function PlusMark() { return <span aria-hidden="true">+</span>; }

function ToolboxMark({ tool }: { tool: ToolboxTickerRow["tools"][number] }) {
  const className = `toolbox-chip__logo${tool.name === "GitHub" ? " toolbox-chip__logo--inverse" : ""}`;
  if (tool.mark.kind === "iconify") {
    return <svg className={className} viewBox={`0 0 ${tool.mark.icon.width} ${tool.mark.icon.height}`} aria-hidden="true" focusable="false" dangerouslySetInnerHTML={{ __html: tool.mark.icon.body }} />;
  }
  return <svg className={className} viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill={`#${tool.mark.icon.hex}`} d={tool.mark.icon.path} /></svg>;
}
