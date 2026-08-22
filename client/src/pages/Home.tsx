/**
 * Data Noir Editorial: cinematic ink-black portfolio, Cormorant Garamond display,
 * DM Mono metadata, Signal Vermilion accents, technical rails, and quiet asymmetry.
 */
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Github,
  Linkedin,
  Mail,
  Search,
} from "lucide-react";

const mosaicImages = [
  "https://files.manuscdn.com/user_upload_by_module/session_file/310519663907191755/BMnAXVrOFGqqWdYJ.png",
  "https://files.manuscdn.com/user_upload_by_module/session_file/310519663907191755/UtdAOpvBoDaBXJlq.png",
  "https://files.manuscdn.com/user_upload_by_module/session_file/310519663907191755/hChvUijntSWcHDuB.png",
  "https://files.manuscdn.com/user_upload_by_module/session_file/310519663907191755/EWoQqdbmlaOUXCVw.png",
];

const logoMark = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663907191755/jMpoHQKDfmjRxKql.png";

const projects = [
  {
    index: "01",
    title: "Placement Analytics Dashboard",
    tools: "SQL · Python · Power BI · Excel",
    description:
      "An interactive view of CTC trends, eligibility stages, selection ratios, and branch-wise distribution—built to turn placement records into clearer decisions.",
    outcome: "Filters for company, role, package range, and academic level.",
    accent: "#13c792",
    className: "project-card project-card--wide",
  },
  {
    index: "02",
    title: "Scholarship & Student Aid Analytics",
    tools: "Python · SQL · Pandas · Looker Studio",
    description:
      "A monitoring lens for scholarship applications, designed to identify approval bottlenecks, missing documents, and follow-up needs.",
    outcome: "Clear views for approval patterns and trend reporting.",
    accent: "#ff7a19",
    className: "project-card project-card--offset",
  },
  {
    index: "03",
    title: "E-Commerce Order & Delivery Analysis",
    tools: "SQL · Power BI/Tableau · Excel",
    description:
      "A performance analysis across revenue, late deliveries, cancellations, city-wise performance, and repeat operational issues.",
    outcome: "Business findings translated into concise recommendations.",
    accent: "#23a8ff",
    className: "project-card project-card--wide",
  },
];

const skills = [
  ["Programming", "Python, SQL, C, C++, JavaScript"],
  ["Analysis", "Statistics, EDA, KPI analysis, segmentation, reporting"],
  ["Libraries", "Pandas, NumPy, Matplotlib, Seaborn"],
  ["BI & visual", "Power BI, Tableau, Looker Studio, Excel, Google Sheets"],
  ["Data", "SQL Server, joins, aggregates, subqueries, CASE, windows"],
  ["Tools", "Git, GitHub, Colab, Jupyter, VS Code, Power Query"],
];

export default function Home() {
  return (
    <main id="home" className="portfolio-shell">
      <div className="edge-rail edge-rail--left" aria-hidden="true" />
      <div className="edge-rail edge-rail--right" aria-hidden="true" />

      <section className="opening" aria-labelledby="hero-title">
        <nav className="top-nav" aria-label="Primary navigation">
          <a href="#home" className="top-nav__brand" aria-label="Home">
            <img
              src={logoMark}
              alt="Saptajit Saha monogram"
            />
          </a>
          <div className="top-nav__links">
            <a href="#about">About</a>
            <a href="#work">Work</a>
            <a href="#skills">Skills</a>
            <a href="#contact">Contact</a>
          </div>
          <a className="nav-search" href="#work" aria-label="View selected work">
            <Search size={15} strokeWidth={1.6} />
          </a>
        </nav>

        <div className="hero-copy">
          <p className="eyebrow eyebrow--hero">Kolkata, India · Data Science · 2025—29</p>
          <h1 id="hero-title">
            <span>Data analyst</span>
            <em>in training.</em>
          </h1>
          <p className="hero-kicker">finding the story inside the signal</p>
        </div>

        <div className="hero-intro" aria-label="Saptajit Saha introduction">
          <p>Curious with data.</p>
          <p>Clear with decisions.</p>
          <span>Saptajit<br />Saha</span>
        </div>

        <div className="mosaic" aria-label="Editorial data art collage">
          {mosaicImages.map((src, index) => (
            <figure className={`mosaic__tile mosaic__tile--${index + 1}`} key={src}>
              <img src={src} alt="Abstract data analysis editorial art" />
            </figure>
          ))}
        </div>

        <div className="hero-grid" aria-label="Quick portfolio overview">
          <a className="hero-grid__item" href="#about">
            <span className="micro-label"><i style={{ background: "#13c792" }} />Now <ArrowRight size={15} /></span>
            <strong>Data Analyst Intern</strong>
            <small>IIT Madras · Kolkata</small>
          </a>
          <a className="hero-grid__item" href="#work">
            <span className="micro-label"><i style={{ background: "#ff7a19" }} />Building <ArrowRight size={15} /></span>
            <strong>Decision-ready dashboards</strong>
            <small>SQL, Python, Power BI</small>
          </a>
          <a className="hero-grid__item" href="#skills">
            <span className="micro-label"><i style={{ background: "#23a8ff" }} />Learning <ArrowRight size={15} /></span>
            <strong>Machine learning</strong>
            <small>Business & data analytics</small>
          </a>
          <a className="hero-grid__item hero-grid__contact" href="#contact">
            <span className="micro-label"><i style={{ background: "#ea3e7b" }} />Reach out</span>
            <span className="talk-button">Start a<br />conversation <b><ArrowRight size={17} /></b></span>
          </a>
        </div>
      </section>

      <section className="silence" aria-label="Transition to selected work">
        <p className="silence__note">scroll to trace the work <ArrowDownRight size={15} /></p>
        <div className="silence__glow" aria-hidden="true" />
      </section>

      <section id="work" className="content-section work-section" aria-labelledby="work-title">
        <div className="section-lead">
          <p className="eyebrow">Selected work · 2025—26</p>
          <h2 id="work-title">Analysis that moves<br /><em>from records to action.</em></h2>
        </div>

        <div className="project-list">
          {projects.map((project) => (
            <article className={project.className} key={project.index} style={{ "--accent": project.accent } as React.CSSProperties}>
              <div className="project-card__topline">
                <span>{project.index}</span>
                <span className="project-card__mark" />
              </div>
              <h3>{project.title}</h3>
              <p className="project-card__tools">{project.tools}</p>
              <p className="project-card__description">{project.description}</p>
              <footer>
                <span>{project.outcome}</span>
                <ArrowUpRight size={17} />
              </footer>
            </article>
          ))}
        </div>
      </section>

      <section id="about" className="content-section about-section" aria-labelledby="about-title">
        <div className="about-statement">
          <p className="eyebrow">A little context</p>
          <h2 id="about-title">I like making<br /><em>complex systems legible.</em></h2>
        </div>
        <div className="about-body">
          <p>
            I am Saptajit Saha, a Data Analyst Intern candidate studying Data Science and Applications at IIT Madras. I work across SQL, Python, spreadsheets, and BI tools to clean data, investigate patterns, and make operational decisions easier to see.
          </p>
          <p>
            My current interests include analytical dashboards, application analysis, e-commerce operations, business reporting, and the practical side of machine learning.
          </p>
          <div className="credential-line">
            <span>Education</span>
            <strong>IIT Madras · B.S. Data Science & Applications</strong>
            <small>2025—29 · CGPA 8.17/10</small>
          </div>
        </div>
      </section>

      <section id="skills" className="content-section skills-section" aria-labelledby="skills-title">
        <div className="section-lead section-lead--compact">
          <p className="eyebrow">Tools & methods</p>
          <h2 id="skills-title">A practical<br /><em>analytical toolkit.</em></h2>
        </div>
        <div className="skill-index">
          {skills.map(([label, detail], index) => (
            <div className="skill-index__row" key={label}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{label}</strong>
              <p>{detail}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="content-section credentials-section" aria-labelledby="credentials-title">
        <p className="eyebrow">Selected learning</p>
        <h2 id="credentials-title">Working knowledge,<br /><em>kept in motion.</em></h2>
        <div className="credential-cards">
          <article><span>01</span><h3>Python for Everybody</h3><p>Specialization · University of Michigan</p></article>
          <article><span>02</span><h3>Remote Sensing Data Analysis</h3><p>Crop Production Forecasting · IIRS ISRO</p></article>
          <article><span>03</span><h3>Data Analytics</h3><p>Physics Wallah</p></article>
        </div>
      </section>

      <footer id="contact" className="contact-section">
        <div className="contact-section__copy">
          <p className="eyebrow">Next conversation</p>
          <h2>Have a data problem<br /><em>worth unpacking?</em></h2>
        </div>
        <div className="contact-section__actions">
          <a className="contact-mail" href="mailto:sahasaptajit4@gmail.com">
            sahasaptajit4@gmail.com <ArrowUpRight size={18} />
          </a>
          <p>+91 80136 92767 · Kolkata, West Bengal, India</p>
          <div className="social-links">
            <a href="https://www.linkedin.com/" target="_blank" rel="noreferrer"><Linkedin size={16} /> LinkedIn</a>
            <a href="https://github.com/" target="_blank" rel="noreferrer"><Github size={16} /> GitHub</a>
            <a href="mailto:sahasaptajit4@gmail.com"><Mail size={16} /> Email</a>
          </div>
        </div>
        <div className="footer-bottom">
          <img src={logoMark} alt="" />
          <span>© 2026 Saptajit Saha</span>
          <span>Designed for considered decisions.</span>
        </div>
      </footer>
    </main>
  );
}
