/** Signal Field refinement: legible editorial hierarchy, personal storytelling, and evidence-led project narratives. */
import { BlurText } from "@/components/BlurText";
import { CaseStudy, CaseStudyPanel } from "@/components/CaseStudyPanel";
import { FloatingLiquidNav } from "@/components/FloatingLiquidNav";
import { ReachOutPanel } from "@/components/ReachOutPanel";
import { NidarrShowcase } from "@/components/NidarrShowcase";
import { OrbitalScene } from "@/components/OrbitalScene";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { InteractivePixelGrid } from "@/components/ui/interactive-pixel-grid";
import { MeshDriftShader } from "@/components/ui/mesh-drift-shader";
import { FirstLoadExperience } from "@/components/FirstLoadExperience";
import { triggerInteractionRipple } from "@/lib/interactionRipple";
import { shouldSkipFirstLoadExperience } from "@/lib/firstLoadExperience";
import { learningTracks } from "@/lib/learningTracks";
import { primaryNavigation, type PrimaryNavigationId } from "@/lib/navigation";
import { toolboxPractices, toolboxTickerRows, type ToolboxTickerRow } from "@/lib/toolboxTicker";
import {
  ArrowUpRight,
  Braces,
  CircleDotDashed,
  GraduationCap,
  Github,
  Mail,
  MapPin,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";

const portrait = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663907191755/WekHJzpZOJUKIlnp.jpeg";
const logoMark = "/manus-storage/iitm-madras-emblem_ce837c30.png";
const nidarrEvidence = {
  home: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663907191755/xHpPFFzQCHOIAQUb.png",
  report: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663907191755/uEhrNwQQJlfwiDhG.png",
  walk: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663907191755/IQFeiEyaHqJyAIMr.png",
  map: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663907191755/itwEKDpYWSWiAWaR.png",
  profile: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663907191755/VueDxQFucIUBOyFH.png",
};

type Project = CaseStudy & { title: string; tagline: string; className: string; trace?: string[] };

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
];

function LearningTopic({ track, index }: { track: (typeof learningTracks)[number]; index: number }) {
  return (
    <AccordionItem value={track.title} className="learning-card">
      <AccordionTrigger className="learning-card__trigger" onPointerDown={triggerInteractionRipple}>
        <span>{String(index + 1).padStart(2, "0")}</span><h3>{track.title}</h3><span className="learning-open">Explore</span>
      </AccordionTrigger>
      <AccordionContent className="learning-card__dropdown"><div className="learning-card__detail"><p><strong>Currently exploring</strong>{track.now}</p><p><strong>Tools</strong>{track.tools}</p><p><strong>Question</strong>{track.question}</p><p><strong>Current project</strong>{track.project}</p></div></AccordionContent>
    </AccordionItem>
  );
}

export default function Home() {
  const pendingNavigationRef = useRef<PrimaryNavigationId | null>(null);
  const navigationTimerRef = useRef<number | undefined>(undefined);
  const [activeSection, setActiveSection] = useState<PrimaryNavigationId>("top");
  const [introComplete, setIntroComplete] = useState(shouldSkipFirstLoadExperience);
  const completeFirstLoad = useCallback(() => setIntroComplete(true), []);

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
    <div id="top" className="signal-field signal-field--liquid">
      {!introComplete && <FirstLoadExperience onComplete={completeFirstLoad} />}
      {introComplete && <FloatingLiquidNav activeSection={activeSection} onNavigate={activateNavigation} />}
      <div aria-hidden={!introComplete} inert={!introComplete}>
      <a className="skip-link" href="#main-content">Skip to content</a>
      <div className="site-pixel-grid" aria-hidden="true"><div className="site-pixel-grid__fallback" /><InteractivePixelGrid className="site-pixel-grid__canvas" /></div>
      <div className="liquid-signal-thread" aria-hidden="true"><i /><i /><i /></div>

      <main id="main-content">
        <section className="hero" data-trail-color="232,76,53" aria-labelledby="hero-title">
          <div className="hero-mesh" aria-hidden="true"><div className="hero-mesh__fallback" /><MeshDriftShader className="hero-mesh__canvas" /></div>
          <div className="hero-gridlines" aria-hidden="true" />
          <div className="hero-copy">
            <div className="liquid-hero-mark" aria-hidden="true"><img src={logoMark} alt="" /><i /></div>
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

        <section className="signal-strip" data-trail-color="232,76,53" aria-label="Current portfolio signal">
          <p>Currently building <strong>Nidarr</strong>, learning in public, and mapping the systems behind useful software.</p>
          <a href="https://nidarr.vercel.app/" target="_blank" rel="noreferrer">Open Nidarr <ArrowUpRight size={17} aria-hidden="true" /></a>
        </section>

        <section id="work" className="section work-section" data-trail-color="157,119,255" aria-labelledby="work-heading">
          <div className="section-heading section-heading--work">
            <span>Selected work</span>
            <h2 id="work-heading">What I&apos;m<br /><em>making real.</em></h2>
            <p>Projects that explore safer interfaces, more human civic guidance, and data systems built around the next useful decision.</p>
          </div>
          <div className="work-layout">
            {projects.map((project) => {
              const isNidarr = project.title === "Nidarr";
              return (
              <article className={`${project.className} project-card`} key={project.title} onPointerMove={isNidarr ? undefined : tiltGlassSurface} onPointerLeave={isNidarr ? undefined : resetGlassTilt}>
                {isNidarr ? (
                  <NidarrShowcase assets={nidarrEvidence} />
                ) : <div className="work-visual work-visual--field"><div className="work-visual__artifact" aria-hidden="true"><span>{project.category}</span><span>{project.year}</span><i /></div></div>}
                <div className="project-card__content">
                  <div className="work-meta"><span>{project.category}</span><span>{project.year}</span></div>
                  <h3>{project.title}</h3>
                  <p className="work-tools">{project.role}</p>
                  <p className="work-description">{project.tagline}</p>
                  {project.trace && <div className="project-card__trace" aria-label="Project system trace">{project.trace.map((trace, index) => <span key={trace}><b>{String(index + 1).padStart(2, "0")}</b>{trace}</span>)}</div>}
                  {isNidarr && <div className="nidarr-actions"><a className="project-live-link" href={project.href} target="_blank" rel="noreferrer">Open live prototype <ArrowUpRight size={16} aria-hidden="true" /></a></div>}
                  <CaseStudyPanel study={project} />
                </div>
              </article>
            )})}
          </div>
        </section>

        <section id="learning" className="section learning-section" data-trail-color="76,202,181" aria-labelledby="learning-heading">
          <div className="learning-copy">
            <h2 id="learning-heading">I&apos;m learning<br />where the edge is.</h2>
            <p>These are active directions, not claimed expertise. Each one is a thread I&apos;m testing through projects, reading, and practice.</p>
          </div>
          <Accordion type="single" collapsible className="learning-list">
            {learningTracks.map((track, index) => <LearningTopic track={track} index={index} key={track.title} />)}
          </Accordion>
        </section>

        <section id="about" className="section about-section" data-trail-color="226,178,84" aria-labelledby="about-heading">
          <div className="about-portrait"><img src={portrait} alt="Saptajit Saha at Indian Institute of Technology Madras" width="1084" height="1448" loading="lazy" /></div>
          <div className="about-copy">
            <h2 id="about-heading">Student status.<br /><em>Builder mindset.</em></h2>
            <p>I&apos;m Saptajit, an incoming second-year B.S. Data Science and Applications student at Indian Institute of Technology Madras. I&apos;m interested in AI, machine learning, data science, and software engineering because I like seeing an unclear system become something a person can actually use.</p>
            <p>I build because the fastest way to understand an idea is to give it edges, constraints, and a user. Right now, I&apos;m looking for the next problem worth taking apart carefully.</p>
            <div className="education-note"><GraduationCap size={20} aria-hidden="true" /><span><strong>Indian Institute of Technology Madras</strong> B.S. in Data Science and Applications · 2029</span></div>
          </div>
        </section>

        <section className="section toolbox-section" data-trail-color="85,163,255" aria-labelledby="toolbox-heading">
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

      <footer id="contact" className="site-footer" data-trail-color="236,103,157">
        <ReachOutPanel />
        <div className="footer-bottom"><span className="footer-signal-mark"><img src={logoMark} alt="" />© 2026 Saptajit Saha</span><span>Kolkata, India</span></div>
      </footer>
      </div>
    </div>
  );
}

function tiltGlassSurface(event: ReactPointerEvent<HTMLElement>) {
  if (event.pointerType !== "mouse" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const bounds = event.currentTarget.getBoundingClientRect();
  const horizontal = (event.clientX - bounds.left) / bounds.width - .5;
  const vertical = (event.clientY - bounds.top) / bounds.height - .5;
  event.currentTarget.style.setProperty("--glass-tilt-x", `${(-vertical * 2.2).toFixed(2)}deg`);
  event.currentTarget.style.setProperty("--glass-tilt-y", `${(horizontal * 2.8).toFixed(2)}deg`);
}

function resetGlassTilt(event: ReactPointerEvent<HTMLElement>) {
  event.currentTarget.style.setProperty("--glass-tilt-x", "0deg");
  event.currentTarget.style.setProperty("--glass-tilt-y", "0deg");
}

function ToolboxMark({ tool }: { tool: ToolboxTickerRow["tools"][number] }) {
  const className = `toolbox-chip__logo${tool.name === "GitHub" ? " toolbox-chip__logo--inverse" : ""}`;
  if (tool.mark.kind === "iconify") {
    return <svg className={className} viewBox={`0 0 ${tool.mark.icon.width} ${tool.mark.icon.height}`} aria-hidden="true" focusable="false" dangerouslySetInnerHTML={{ __html: tool.mark.icon.body }} />;
  }
  return <svg className={className} viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill={`#${tool.mark.icon.hex}`} d={tool.mark.icon.path} /></svg>;
}
