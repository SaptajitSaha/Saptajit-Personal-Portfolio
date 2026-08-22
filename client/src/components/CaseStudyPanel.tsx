/** Signal Field refinement: reusable, evidence-led project detail disclosure with no fabricated results. */
import { ArrowUpRight, Plus } from "lucide-react";

export type CaseStudy = {
  category: string;
  year: string;
  role: string;
  problem: string;
  approach: string;
  system: string;
  contribution: string;
  learning: string;
  status: string;
  href: string;
  linkLabel: string;
};

export function CaseStudyPanel({ study }: { study: CaseStudy }) {
  const sections = [
    ["Problem", study.problem],
    ["Approach", study.approach],
    ["System", study.system],
    ["My contribution", study.contribution],
    ["Learning", study.learning],
  ];

  return (
    <details className="case-study">
      <summary>
        <span>View case study</span>
        <Plus size={16} aria-hidden="true" />
      </summary>
      <div className="case-study__body">
        <dl>
          <div className="case-study__role"><dt>My role</dt><dd>{study.role}</dd></div>
          {sections.map(([label, value]) => (
            <div key={label}><dt>{label}</dt><dd>{value}</dd></div>
          ))}
        </dl>
        <div className="case-study__footer">
          <p>{study.status}</p>
          <a href={study.href} target="_blank" rel="noreferrer">{study.linkLabel} <ArrowUpRight size={15} aria-hidden="true" /></a>
        </div>
      </div>
    </details>
  );
}
