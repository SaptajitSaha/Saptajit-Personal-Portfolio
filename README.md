# Saptajit Saha — Portfolio

![Portfolio cover](https://capsule-render.vercel.app/api?type=rect&color=0D0D0F&height=150&section=header&text=Saptajit%20Saha&fontColor=F1EEE9&fontSize=48&fontAlignY=43&desc=Signal%20Field%20%2F%20AI%2C%20data%20%26%20software&descAlignY=69&descSize=17&animation=fadeIn)

> **An editorial 3D portfolio for a student builder working at the intersection of AI, data, and software.**

![Animated portfolio statement](https://readme-typing-svg.demolab.com/?font=DM+Mono&weight=500&size=18&duration=2400&pause=800&color=E84C35&background=0D0D0F00&vCenter=true&width=760&lines=Early+in+the+work.+Serious+about+the+work.;Building+AI%2C+data%2C+and+software+experiments.;Turning+difficult+systems+into+usable+tools.)

[![Live portfolio](https://img.shields.io/badge/View%20portfolio-0D0D0F?style=for-the-badge&logo=vercel&logoColor=F1EEE9)](https://saptajit-personal-portfolio.vercel.app/)
[![GitHub repository](https://img.shields.io/badge/Source%20code-0D0D0F?style=for-the-badge&logo=github&logoColor=F1EEE9)](https://github.com/SaptajitSaha/Saptajit-Personal-Portfolio)
[![Email Saptajit](https://img.shields.io/badge/Contact-E84C35?style=for-the-badge&logo=gmail&logoColor=FFFFFF)](mailto:sahasaptajit@gmail.com)

## Signal Field

**Signal Field** is a dark, vermilion-led portfolio system built around one tactile CSS-3D hero scene. The site combines a portrait plane, shallow project constellation, technical field grid, and evidence-led project narratives. It avoids the usual template grid in favour of a research-log rhythm that lets current projects, learning, and intent speak for themselves.

This portfolio belongs to **Saptajit Saha**, an incoming second-year B.S. Data Science and Applications student at IIT Madras. It documents a practical interest in AI, machine learning, data science, software engineering, creative web work, and quantitative finance without overstating seniority.

## Preview

| Desktop signal field | Responsive mobile composition |
| --- | --- |
| ![Signal Field desktop preview](https://files.manuscdn.com/user_upload_by_module/session_file/310519663907191755/cdtbQExfdtPyxGUW.png) | ![Signal Field mobile preview](https://files.manuscdn.com/user_upload_by_module/session_file/310519663907191755/QMMyLJFgxNHtHiCk.png) |

## Built with

![React](https://img.shields.io/badge/React%2019-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=FFFFFF)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=FFFFFF)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS%204-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=FFFFFF)
![Motion](https://img.shields.io/badge/Motion-0D0D0F?style=for-the-badge&logo=framer&logoColor=E84C35)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=FFFFFF)

| Layer | Selection | Reason |
| --- | --- | --- |
| Interface | React 19 + TypeScript | Component-driven interface with type-safe portfolio content. |
| Motion | Motion + CSS 3D | Finite blur reveals and an intentionally shallow, pointer-responsive hero scene. |
| Styling | Tailwind CSS 4 + custom CSS | Deliberate visual tokens and a highly authored editorial system. |
| Icons | Lucide React | A consistent, accessible icon language. |
| Deployment | Vercel | Static Vite hosting configured with SPA fallback routing. |

## Featured work

| Project | Focus | Highlights |
| --- | --- | --- |
| **[Nidarr](https://nidarr.vercel.app/)** | Mobile-first personal safety prototype | Safety Map, AI-assisted report analysis, location-aware reporting, Walk With Me, and a community-verification flow. |
| **Interactive Election Assistant** | Context-aware civic guidance | Decision-based flows for voting eligibility, documents, voter-list issues, relocation, and flexible queries. |
| **Operational analytics** | Data practice across placement, scholarship, and e-commerce questions | SQL, Python, Power BI, Looker Studio, and dashboards built around actionable questions. |

## Design decisions

| Element | Purpose |
| --- | --- |
| Signal Vermilion `#E84C35` | A human point of emphasis inside an otherwise monochrome technical system. |
| Portrait plane | Grounds the site in a real person rather than a synthetic or generic hero image. |
| CSS 3D constellation | Adds shallow, purposeful depth around projects, AI systems, data practice, and software craft. |
| Reduced-motion support | Keeps the complete portfolio usable when motion is disabled. |
| Motion-guided text reveal | Provides hierarchy once, without an endless decorative animation loop. |

## Run it locally

```bash
git clone https://github.com/SaptajitSaha/Saptajit-Personal-Portfolio.git
cd Saptajit-Personal-Portfolio
pnpm install
pnpm dev
```

Before opening a pull request or deploying, run:

```bash
pnpm check
pnpm build
```

## Project structure

```text
.
├── client/
│   ├── src/
│   │   ├── components/BlurText.tsx  # Finite blur-reveal hero text
│   │   ├── pages/Home.tsx           # Signal Field portfolio experience
│   │   ├── index.css                # Tokens, CSS 3D scene, responsive styling
│   │   └── App.tsx                  # Application shell and routing
│   └── index.html                   # Document metadata and favicon
├── vercel.json                      # Static Vite build and SPA rewrites
└── package.json                     # Scripts and dependencies
```

## Deploy to Vercel

The repository is configured to deploy the Vite static output instead of a Node server bundle.

```text
Framework preset: Vite
Build command: pnpm exec vite build
Output directory: dist/public
```

When importing into Vercel, keep the repository root as the project root and select `main` as the production branch.

## Contact

**Saptajit Saha** · IIT Madras Data Science student · Kolkata, India  
[sahasaptajit@gmail.com](mailto:sahasaptajit@gmail.com) · [LinkedIn](https://www.linkedin.com/in/saptajitsaha/) · [GitHub](https://github.com/SaptajitSaha)

---

<sub>Signal Field / 01 — built with an editorial eye and a builder&apos;s mindset.</sub>
