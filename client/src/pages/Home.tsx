/** Signal Field refinement: legible editorial hierarchy, personal storytelling, and evidence-led project narratives. */
import { BlurText } from "@/components/BlurText";
import { CaseStudy, CaseStudyPanel } from "@/components/CaseStudyPanel";
import {
  ArrowUpRight,
  Braces,
  CircleDotDashed,
  Code2,
  Database,
  Github,
  GraduationCap,
  Layers3,
  Linkedin,
  Mail,
  MapPin,
  Menu,
  MoveUpRight,
  Sparkles,
} from "lucide-react";
import { useEffect, useRef } from "react";

const portrait = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663907191755/WekHJzpZOJUKIlnp.jpeg";
const logoMark = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663907191755/jMpoHQKDfmjRxKql.png";
const nidarrEvidence = {
  home: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663907191755/ZuhcSYWKTRzpFYal.png",
  report: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663907191755/gDDTVyQMOfOWXWDG.png",
  walk: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663907191755/BOdBIwbeInlygQnU.png",
  map: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663907191755/gKiQtaxPOaaPCGJB.png",
  profile: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663907191755/IRtCRCwruNdloRka.png",
  tour: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663907191755/nilqXNEdOJrvVJlF.gif",
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
    className: "work-compact election-card",
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

const learningTracks = [
  { title: "AI systems", now: "LLMs, agentic flows, and responsible AI", tools: "Gemini · Python", question: "How can an assistant stay useful without hiding uncertainty?", project: "Interactive Election Assistant" },
  { title: "Machine learning", now: "model evaluation, statistical foundations, and model thinking", tools: "Python · Pandas · PyTorch (learning)", question: "How do models fail outside the conditions they were tested in?", project: "Study thread" },
  { title: "Software craft", now: "responsive interfaces, frontend structure, and product prototyping", tools: "React · TypeScript · Git", question: "What makes a small prototype feel trustworthy enough to use?", project: "Nidarr" },
  { title: "Quantitative finance", now: "market signals, machine-learning methods, and NLP", tools: "Python · SQL", question: "How much signal survives beyond the backtest?", project: "Study thread" },
];

const toolboxGroups = [
  ["Build", ["Python", "TypeScript", "JavaScript", "React"]],
  ["Data", ["SQL", "Pandas", "Statistics", "Power BI", "Looker Studio"]],
  ["AI", ["Machine learning", "PyTorch", "Gemini"]],
  ["Tools", ["Git", "GitHub", "Excel"]],
] as const;

export default function Home() {
  const stageRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      const bounds = stage.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width - 0.5;
      const y = (event.clientY - bounds.top) / bounds.height - 0.5;
      stage.style.setProperty("--stage-rotate-x", `${Math.max(-4, Math.min(4, y * -7))}deg`);
      stage.style.setProperty("--stage-rotate-y", `${Math.max(-5, Math.min(5, x * 9))}deg`);
    };
    const resetStage = () => {
      stage.style.setProperty("--stage-rotate-x", "0deg");
      stage.style.setProperty("--stage-rotate-y", "0deg");
    };

    stage.addEventListener("pointermove", onPointerMove, { passive: true });
    stage.addEventListener("pointerleave", resetStage);
    return () => {
      stage.removeEventListener("pointermove", onPointerMove);
      stage.removeEventListener("pointerleave", resetStage);
    };
  }, []);

  return (
    <div id="top" className="signal-field">
      <a className="skip-link" href="#main-content">Skip to content</a>
      <header className="site-header">
        <a className="brand-mark" href="#top" aria-label="Saptajit Saha home"><img src={logoMark} alt="" width="25" height="25" /><span>Saptajit Saha</span><i className="brand-signal" aria-hidden="true" /></a>
        <nav className="site-nav" aria-label="Primary navigation">
          <a href="#top">Home</a><a href="#work">Work</a><a href="#learning">Learning</a><a href="#about">About</a><a href="#contact">Contact</a>
        </nav>
        <a className="header-cta" href="mailto:sahasaptajit@gmail.com">Email me <MoveUpRight size={16} aria-hidden="true" /></a>
        <details className="mobile-nav">
          <summary aria-label="Open navigation"><Menu size={20} aria-hidden="true" /></summary>
          <nav aria-label="Mobile navigation"><a href="#top">Home</a><a href="#work">Work</a><a href="#learning">Learning</a><a href="#about">About</a><a href="#contact">Contact</a></nav>
        </details>
      </header>

      <main id="main-content">
        <section className="hero" ref={stageRef} aria-labelledby="hero-title">
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

          <div className="stage-wrap" aria-label="Portrait and project constellation">
            <div className="stage-scene">
              <div className="stage-orbit orbit--one" aria-hidden="true" /><div className="stage-orbit orbit--two" aria-hidden="true" />
              <span className="orbit-label orbit-label--one">Nidarr / 2026</span>
              <figure className="portrait-plane">
                <div className="portrait-backdrop" aria-hidden="true" />
                <img src={portrait} alt="Saptajit Saha standing before a colorful IITM mural" width="1084" height="1448" fetchPriority="high" />
                <figcaption><span>IIT Madras</span><strong>Builder & learner</strong></figcaption>
              </figure>
              <div className="stage-chip stage-chip--ai"><Sparkles size={15} aria-hidden="true" /> AI systems</div>
              <div className="stage-chip stage-chip--data"><Database size={15} aria-hidden="true" /> Data practice</div>
              <div className="stage-chip stage-chip--code"><Code2 size={15} aria-hidden="true" /> Software craft</div>
            </div>
          </div>
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
              const isElection = project.title === "Interactive Election Assistant";
              return (
              <article className={`${project.className} project-card`} key={project.title}>
                {isNidarr ? (
                  <NidarrEvidence />
                ) : isElection ? <ElectionArtifact /> : <div className="work-visual work-visual--field"><div className="work-visual__artifact" aria-hidden="true"><span>{project.category}</span><span>{project.year}</span><i /></div></div>}
                <div className="project-card__content">
                  <div className="work-meta"><span>{project.category}</span><span>{project.year}</span></div>
                  <h3>{project.title}</h3>
                  <p className="work-tools">{project.role}</p>
                  <p className="work-description">{project.tagline}</p>
                  {isNidarr && <a className="project-live-link" href={project.href} target="_blank" rel="noreferrer">Open live prototype <ArrowUpRight size={16} aria-hidden="true" /></a>}
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
          <div className="about-portrait"><img src={portrait} alt="Saptajit Saha at IIT Madras" width="1084" height="1448" loading="lazy" /></div>
          <div className="about-copy">
            <h2 id="about-heading">Student status.<br /><em>Builder mindset.</em></h2>
            <p>I&apos;m Saptajit, an incoming second-year B.S. Data Science and Applications student at IIT Madras. I&apos;m interested in AI, machine learning, data science, and software engineering because I like seeing an unclear system become something a person can actually use.</p>
            <p>I build because the fastest way to understand an idea is to give it edges, constraints, and a user. Right now, I&apos;m looking for the next problem worth taking apart carefully.</p>
            <div className="education-note"><GraduationCap size={20} aria-hidden="true" /><span><strong>IIT Madras</strong> B.S. in Data Science and Applications · 2029</span></div>
          </div>
        </section>

        <section className="section toolbox-section" aria-labelledby="toolbox-heading">
          <div className="toolbox-topline"><span>Tools I use or am learning</span><Layers3 size={20} aria-hidden="true" /></div>
          <h2 id="toolbox-heading">Tools become useful<br /><em>when the questions do.</em></h2>
          <div className="toolbox-groups" aria-label="Technology and tool groups">
            {toolboxGroups.map(([group, tools]) => <div className="toolbox-group" key={group}><h3>{group}</h3><p>{tools.join(" · ")}</p></div>)}
          </div>
          <div className="learning-notes"><p><Braces size={18} aria-hidden="true" />Building with code, data, and small product experiments.</p><p><MapPin size={18} aria-hidden="true" />Based in Kolkata, looking outward.</p></div>
        </section>
      </main>

      <footer id="contact" className="site-footer">
        <div className="footer-main"><p>Have something<br />interesting to <em>build?</em></p><a className="footer-mail" href="mailto:sahasaptajit@gmail.com">sahasaptajit@gmail.com <ArrowUpRight size={23} aria-hidden="true" /></a></div>
        <div className="footer-links"><a href="https://www.linkedin.com/in/saptajitsaha/" target="_blank" rel="noreferrer"><Linkedin size={17} aria-hidden="true" /> LinkedIn</a><a href="https://github.com/SaptajitSaha" target="_blank" rel="noreferrer"><Github size={17} aria-hidden="true" /> GitHub</a><a href="mailto:sahasaptajit@gmail.com"><Mail size={17} aria-hidden="true" /> Email</a></div>
        <div className="footer-bottom"><span>© 2026 Saptajit Saha</span><span>Kolkata, India</span></div>
      </footer>
    </div>
  );
}

function PlusMark() { return <span aria-hidden="true">+</span>; }

function NidarrEvidence() {
  const screens = [
    [nidarrEvidence.home, "Nidarr safety tools home screen", "Home"],
    [nidarrEvidence.report, "Nidarr incident-report screen", "Report"],
    [nidarrEvidence.walk, "Nidarr Walk With Me screen", "Walk With Me"],
    [nidarrEvidence.map, "Nidarr safety map screen", "Safety Map"],
    [nidarrEvidence.profile, "Nidarr profile screen", "Profile"],
  ] as const;

  return (
    <div className="nidarr-media" aria-label="Nidarr product interface evidence">
      <a className="nidarr-tour" href="https://nidarr.vercel.app/" target="_blank" rel="noreferrer" aria-label="Open the Nidarr live prototype">
        <img src={nidarrEvidence.tour} alt="Animated product tour showing Nidarr safety features" width="360" height="720" loading="lazy" />
        <span>Live product tour <ArrowUpRight size={14} aria-hidden="true" /></span>
      </a>
      <div className="nidarr-screen-stack">
        {screens.map(([src, alt, label], index) => (
          <a href="https://nidarr.vercel.app/" target="_blank" rel="noreferrer" className={`nidarr-screen nidarr-screen--${index + 1}`} key={label} aria-label={`Open Nidarr to explore ${label}`}>
            <img src={src} alt={alt} width="440" height="871" loading="lazy" />
            <span>{label}</span>
          </a>
        ))}
      </div>
    </div>
  );
}

function ElectionArtifact() {
  return (
    <div className="election-artifact" aria-label="Election Assistant decision-flow artifact">
      <p>Decision guide / civic questions</p>
      <div className="election-artifact__flow">
        <span>Eligibility</span><i aria-hidden="true">→</i><span>Documents</span><i aria-hidden="true">→</i><span>Next step</span>
      </div>
      <div className="election-artifact__topics"><span>Voter list</span><span>Relocation</span><span>Correction</span></div>
    </div>
  );
}
