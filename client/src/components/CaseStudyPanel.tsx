/** Signal Field refinement: reusable, evidence-led project detail disclosure with animated accessible state. */
import { ArrowUpRight, Plus } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import { triggerInteractionRipple } from "@/lib/interactionRipple";

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

const CLOSE_DELAY = 260;

export function CaseStudyPanel({ study }: { study: CaseStudy }) {
  const [expanded, setExpanded] = useState(false);
  const [mounted, setMounted] = useState(false);
  const closeTimer = useRef<number | undefined>(undefined);
  const expandedRef = useRef(false);
  const panelId = useId();
  const sections = [["Problem", study.problem], ["Approach", study.approach], ["System", study.system], ["My contribution", study.contribution], ["Learning", study.learning]];

  useEffect(() => () => { if (closeTimer.current) window.clearTimeout(closeTimer.current); }, []);

  const toggle = () => {
    const nextExpanded = !expandedRef.current;
    expandedRef.current = nextExpanded;
    if (!nextExpanded) {
      setExpanded(false);
      closeTimer.current = window.setTimeout(() => setMounted(false), CLOSE_DELAY);
      return;
    }
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    setMounted(true);
    window.requestAnimationFrame(() => { if (expandedRef.current) setExpanded(true); });
  };

  return (
    <section className="case-study" data-state={expanded ? "open" : "closed"}>
      <button className="case-study__trigger" type="button" aria-expanded={expanded} aria-controls={panelId} onClick={toggle} onPointerDown={triggerInteractionRipple}>
        <span>View case study</span><Plus size={16} aria-hidden="true" />
      </button>
      {mounted && (
        <div id={panelId} className="case-study__dropdown" aria-hidden={!expanded} inert={!expanded}>
          <div className="case-study__body">
            <dl>
              <div className="case-study__role"><dt>My role</dt><dd>{study.role}</dd></div>
              {sections.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}
            </dl>
            <div className="case-study__footer"><p>{study.status}</p><a href={study.href} target="_blank" rel="noreferrer">{study.linkLabel} <ArrowUpRight size={15} aria-hidden="true" /></a></div>
          </div>
        </div>
      )}
    </section>
  );
}
