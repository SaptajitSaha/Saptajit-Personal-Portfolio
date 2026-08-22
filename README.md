# Saptajit Saha — Data Analyst Portfolio

![Portfolio cover](https://capsule-render.vercel.app/api?type=rect&color=0D0D0F&height=150&section=header&text=Saptajit%20Saha&fontColor=F2EEE8&fontSize=48&fontAlignY=43&desc=Data%20Analyst%20Portfolio&descAlignY=69&descSize=17&animation=fadeIn)

> **A dark editorial portfolio that turns raw records into clear next steps.**

![Animated portfolio statement](https://readme-typing-svg.demolab.com/?font=DM+Mono&weight=500&size=18&duration=2400&pause=800&color=E84C35&background=0D0D0F00&vCenter=true&width=680&lines=Data+made+decision-ready.;From+raw+records+to+clear+next+steps.;SQL+%C2%B7+Python+%C2%B7+Power+BI+%C2%B7+Practical+insight.)

[![Live portfolio](https://img.shields.io/badge/View%20portfolio-0D0D0F?style=for-the-badge&logo=vercel&logoColor=F2EEE8)](https://saptajit-personal-portfolio.vercel.app/)
[![GitHub repository](https://img.shields.io/badge/Source%20code-0D0D0F?style=for-the-badge&logo=github&logoColor=F2EEE8)](https://github.com/SaptajitSaha/saptajit-data-portfolio)
[![Email Saptajit](https://img.shields.io/badge/Contact-E84C35?style=for-the-badge&logo=gmail&logoColor=FFFFFF)](mailto:sahasaptajit4@gmail.com)

## The idea

This is the personal portfolio of **Saptajit Saha**, a Data Analyst Intern candidate and B.S. Data Science and Applications student at IIT Madras. It treats analytical work as an editorial narrative: restrained typography, cinematic contrast, and compact information modules help make projects, methods, and contact details easy to trace.

The site was designed mobile-first, with technical rails, a data-art hero collage, adaptive project cards, and fully responsive resume-led sections. The visual language deliberately avoids a generic dashboard treatment in favor of a memorable, high-contrast portfolio experience.

## Preview

| Desktop composition | Mobile composition |
| --- | --- |
| ![Desktop portfolio preview](https://files.manuscdn.com/user_upload_by_module/session_file/310519663907191755/zQZLhBalEuGQcKIn.png) | ![Mobile portfolio preview](https://files.manuscdn.com/user_upload_by_module/session_file/310519663907191755/bEVETrGJUdagQAby.png) |

## Built with

![React](https://img.shields.io/badge/React%2019-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=FFFFFF)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=FFFFFF)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS%204-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=FFFFFF)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=FFFFFF)

| Layer | Selection | Why it is here |
| --- | --- | --- |
| Application | React 19 + TypeScript | Component-driven interface with dependable type checking. |
| Build system | Vite | Fast local development and optimized static production output. |
| Styling | Tailwind CSS 4 + custom CSS | Token-based foundations with highly specific editorial art direction. |
| Icons | Lucide React | Lightweight, consistent interface icons. |
| Deployment | Vercel | Static hosting configured through `vercel.json` with SPA fallback routing. |

## What is inside

| Section | Purpose | Core tools or ideas |
| --- | --- | --- |
| Hero | A compact identity and capability snapshot | Animated editorial reveal, art collage, contact CTA |
| Selected work | Three portfolio case studies | SQL, Python, Power BI, Excel, Looker Studio, Tableau |
| About | Academic context and analytical interests | IIT Madras B.S. Data Science & Applications |
| Skills | Practical tool and method index | Python, SQL, Pandas, NumPy, BI, data visualization |
| Credentials | Selected certifications and learning | University of Michigan, IIRS ISRO, Physics Wallah |
| Contact | Direct professional handoff | Email, GitHub, LinkedIn placeholders |

## Featured portfolio work

| Project | Focus | Stack | Delivered value |
| --- | --- | --- | --- |
| **Placement Analytics Dashboard** | Placement records, trends, and selection patterns | SQL, Python, Power BI, Excel | Interactive filtering by company, role, package range, and academic level. |
| **Scholarship & Student Aid Analytics** | Application monitoring and approval visibility | Python, SQL, Pandas, Looker Studio | Clear reporting on bottlenecks, missing documents, and follow-up needs. |
| **E-Commerce Order & Delivery Analysis** | Revenue and delivery performance | SQL, Power BI/Tableau, Excel | Concise findings on cancellations, late deliveries, segments, and operational issues. |

## Run it locally

The project uses pnpm. Install the dependencies, start the Vite development server, then open the local address shown in your terminal.

```bash
git clone https://github.com/SaptajitSaha/saptajit-data-portfolio.git
cd saptajit-data-portfolio
pnpm install
pnpm dev
```

Run a type check and static production build before opening a pull request or triggering a deployment.

```bash
pnpm check
pnpm build
```

## Project structure

```text
.
├── client/
│   ├── src/
│   │   ├── pages/Home.tsx       # Portfolio sections and content
│   │   ├── index.css            # Design tokens, responsive styling, motion
│   │   └── App.tsx              # Application entry and routing
│   └── index.html               # Document metadata and favicon
├── vercel.json                  # Static Vite build and SPA rewrites
├── PROJECT_UPDATES.md           # Ongoing edit, checkpoint, push, release flow
└── package.json                 # Scripts and dependencies
```

## Deploy to Vercel

The repository ships with a Vercel configuration designed to serve the static Vite output rather than a Node server bundle. When importing the repository into Vercel, select `main` as the production branch and keep the repository root as the project root.

```text
Framework preset: Vite
Build command: pnpm exec vite build
Output directory: dist/public
```

The `vercel.json` file also rewrites client-side paths to `index.html`, keeping the single-page application navigable on direct visits.

## Make it yours

The core content lives in `client/src/pages/Home.tsx`, while the visual system lives in `client/src/index.css`. Replace the contact links, add real dashboard screenshots or case-study routes, and update the project copy as new work becomes available. The README screenshots are intended as a representative product snapshot and can be refreshed after any major visual iteration.

## Contact

**Saptajit Saha** · Data Analyst Intern candidate · Kolkata, India  
[sahasaptajit4@gmail.com](mailto:sahasaptajit4@gmail.com) · [GitHub](https://github.com/SaptajitSaha)

---

<sub>Designed with an editorial eye and a practical data mindset.</sub>
