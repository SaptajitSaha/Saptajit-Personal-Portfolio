/** Signal Field: dimensional editorial portfolio, dark vermilion palette, and evidence-led student storytelling. */
import { BlurText } from "@/components/BlurText";
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
  MoveUpRight,
  Sparkles,
} from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef } from "react";

const portrait = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663907191755/WekHJzpZOJUKIlnp.jpeg";
const logoMark = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663907191755/jMpoHQKDfmjRxKql.png";
const projectVisuals = [
  "https://files.manuscdn.com/user_upload_by_module/session_file/310519663907191755/BMnAXVrOFGqqWdYJ.png",
  "https://files.manuscdn.com/user_upload_by_module/session_file/310519663907191755/UtdAOpvBoDaBXJlq.png",
  "https://files.manuscdn.com/user_upload_by_module/session_file/310519663907191755/hChvUijntSWcHDuB.png",
];

const projects = [
  {
    index: "01 / FIELD BUILD",
    title: "Nidarr",
    tools: "React · TypeScript · Gemini · Location-aware UX",
    description:
      "A mobile-first personal safety prototype that turns scattered safety signals into a guided, more usable experience.",
    outcome: "Safety Map, Walk With Me, AI-assisted reports, and a community-verification flow.",
    href: "https://nidarr.vercel.app/",
    image: projectVisuals[0],
    className: "work-feature",
  },
  {
    index: "02 / CIVIC PROTOTYPE",
    title: "Interactive Election Assistant",
    tools: "AI-guided flow · Product thinking · Accessible UX",
    description:
      "A decision-based guide designed to make real voting questions easier to navigate, from eligibility and documents to voter-list issues.",
    outcome: "A shift from generic answers toward context-aware civic guidance.",
    href: "https://www.linkedin.com/in/saptajitsaha/",
    image: projectVisuals[1],
    className: "work-compact",
  },
  {
    index: "03 / DATA PRACTICE",
    title: "Operational analytics",
    tools: "Python · SQL · Power BI · Looker Studio · Excel",
    description:
      "Explorations across placement, scholarship, and e-commerce datasets, designed to make patterns, bottlenecks, and next decisions easier to see.",
    outcome: "Dashboards and reporting built around questions, not vanity metrics.",
    href: "https://github.com/SaptajitSaha",
    image: projectVisuals[2],
    className: "work-compact work-compact--dark",
  },
];

const learningTracks = [
  ["01", "AI systems", "LLMs, agentic flows, responsible AI"],
  ["02", "Machine learning", "statistical foundations, model thinking"],
  ["03", "Software craft", "React, TypeScript, product prototyping"],
  ["04", "Quantitative finance", "market signals, ML methods, NLP"],
];

const toolbox = ["Python", "SQL", "TypeScript", "React", "Power BI", "Pandas", "Git", "Gemini", "Looker Studio", "C++"];

export default function Home() {
  const stageRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage || reduceMotion) return;

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
  }, [reduceMotion]);

  return (
    <div className="signal-field">
      <header className="site-header">
        <a className="brand-mark" href="#top" aria-label="Saptajit Saha home">
          <img src={logoMark} alt="" />
          <span>SS / 01</span>
        </a>
        <nav className="site-nav" aria-label="Primary navigation">
          <a href="#work">Work</a>
          <a href="#learning">Learning</a>
          <a href="#about">About</a>
        </nav>
        <a className="header-cta" href="mailto:sahasaptajit@gmail.com">Let&apos;s talk <MoveUpRight size={15} /></a>
      </header>

      <main id="top">
        <section className="hero" ref={stageRef} aria-labelledby="hero-title">
          <div className="hero-gridlines" aria-hidden="true" />
          <div className="hero-copy">
            <p className="kicker"><CircleDotDashed size={14} /> Kolkata, India · IIT Madras ’29</p>
            <h1 id="hero-title">Saptajit<br /><span>Saha</span></h1>
            <BlurText className="hero-statement" text="Building at the intersection of AI, data, and software." />
            <p className="hero-detail">Early in the work. Serious about the work. Exploring ideas that move from a difficult system to a usable tool.</p>
            <div className="hero-actions">
              <a className="button button--signal" href="#work">Trace the work <ArrowUpRight size={17} /></a>
              <a className="button button--quiet" href="https://github.com/SaptajitSaha" target="_blank" rel="noreferrer">GitHub <Github size={16} /></a>
            </div>
          </div>

          <div className="stage-wrap" aria-label="Interactive project constellation">
            <div className="stage-scene">
              <div className="stage-orbit orbit--one" aria-hidden="true" />
              <div className="stage-orbit orbit--two" aria-hidden="true" />
              <span className="orbit-label orbit-label--one">NIDARR / 2026</span>
              <span className="orbit-label orbit-label--two">AI + SAFETY</span>
              <span className="orbit-label orbit-label--three">IITM / DS</span>
              <figure className="portrait-plane">
                <div className="portrait-backdrop" />
                <img src={portrait} alt="Saptajit Saha standing before a colorful IITM mural" />
                <figcaption><span>FIELD NOTE 01</span><strong>Builder / learner</strong></figcaption>
              </figure>
              <div className="stage-chip stage-chip--ai"><Sparkles size={15} /> AI systems</div>
              <div className="stage-chip stage-chip--data"><Database size={15} /> Data practice</div>
              <div className="stage-chip stage-chip--code"><Code2 size={15} /> Software craft</div>
            </div>
            <p className="stage-hint">Move through the field <span aria-hidden="true">↗</span></p>
          </div>
        </section>

        <section className="signal-strip" aria-label="Current portfolio signal">
          <p>Currently building <strong>Nidarr</strong>, learning in public, and mapping the systems behind useful software.</p>
          <a href="https://nidarr.vercel.app/" target="_blank" rel="noreferrer">Open Nidarr <ArrowUpRight size={16} /></a>
        </section>

        <section id="work" className="section work-section" aria-labelledby="work-heading">
          <div className="section-heading">
            <span>01 / BUILDS WITH A POINT OF VIEW</span>
            <h2>What I&apos;m<br /><em>making real.</em></h2>
            <p>Three active threads: safer interfaces, more human civic guidance, and operational data that makes the next move clearer.</p>
          </div>
          <div className="work-layout">
            {projects.map((project, index) => (
              <motion.article
                className={project.className}
                key={project.title}
                initial={reduceMotion ? false : { opacity: 0, y: 26, filter: "blur(5px)" }}
                whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: index * 0.06, ease: [0.23, 1, 0.32, 1] }}
              >
                <a href={project.href} target="_blank" rel="noreferrer" className="work-card-link" aria-label={`Open ${project.title}`}>
                  <div className="work-visual"><img src={project.image} alt="Abstract data-inspired project visual" /></div>
                  <div className="work-meta"><span>{project.index}</span><ArrowUpRight size={17} /></div>
                  <h3>{project.title}</h3>
                  <p className="work-tools">{project.tools}</p>
                  <p className="work-description">{project.description}</p>
                  <p className="work-outcome">{project.outcome}</p>
                </a>
              </motion.article>
            ))}
          </div>
        </section>

        <section id="learning" className="section learning-section" aria-labelledby="learning-heading">
          <div className="learning-copy">
            <span>02 / IN MOTION</span>
            <h2 id="learning-heading">I&apos;m learning<br />where the edge is.</h2>
            <p>My student years are for building foundations and testing ideas: systems, models, interfaces, and the math that holds them together.</p>
          </div>
          <div className="learning-list">
            {learningTracks.map(([number, title, detail]) => (
              <article key={title}>
                <span>{number}</span>
                <h3>{title}</h3>
                <p>{detail}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="about" className="section about-section" aria-labelledby="about-heading">
          <div className="about-portrait"><img src={portrait} alt="Saptajit Saha at IIT Madras" /></div>
          <div className="about-copy">
            <span>03 / THE LONG GAME</span>
            <h2 id="about-heading">Student status.<br /><em>Builder mindset.</em></h2>
            <p>I&apos;m Saptajit, an incoming second-year B.S. Data Science and Applications student at IIT Madras. I&apos;m drawn to AI, machine learning, data science, software engineering, creative web work, and quantitative finance because difficult systems become more interesting when they become useful.</p>
            <p>I am not trying to look ten years ahead of where I am. I&apos;m building seriously, documenting what I learn, and looking for the next problem worth understanding.</p>
            <div className="education-note"><GraduationCap size={19} /><span><strong>IIT Madras</strong> B.S. in Data Science and Applications · 2029</span></div>
          </div>
        </section>

        <section className="section toolbox-section" aria-labelledby="toolbox-heading">
          <div className="toolbox-topline"><span>04 / TOOLBOX</span><Layers3 size={19} /></div>
          <h2 id="toolbox-heading">Tools are just the surface.<br /><em>Thinking is the system.</em></h2>
          <div className="toolbox-cloud" aria-label="Technologies and tools">
            {toolbox.map((tool, index) => <span key={tool} style={{ animationDelay: `${index * 70}ms` }}>{tool}</span>)}
          </div>
          <div className="learning-notes">
            <p><Braces size={17} /> Building with: Python, SQL, React, TypeScript, BI tools, and product prototypes.</p>
            <p><MapPin size={17} /> Based in Kolkata, looking outward.</p>
          </div>
        </section>
      </main>

      <footer id="contact" className="site-footer">
        <div className="footer-main">
          <p>Have a difficult system<br />worth making <em>usable?</em></p>
          <a className="footer-mail" href="mailto:sahasaptajit@gmail.com">sahasaptajit@gmail.com <ArrowUpRight size={22} /></a>
        </div>
        <div className="footer-links">
          <a href="https://www.linkedin.com/in/saptajitsaha/" target="_blank" rel="noreferrer"><Linkedin size={16} /> LinkedIn</a>
          <a href="https://github.com/SaptajitSaha" target="_blank" rel="noreferrer"><Github size={16} /> GitHub</a>
          <a href="mailto:sahasaptajit@gmail.com"><Mail size={16} /> Email</a>
        </div>
        <div className="footer-bottom"><span>© 2026 Saptajit Saha</span><span>Signal Field / 01</span></div>
      </footer>
    </div>
  );
}
