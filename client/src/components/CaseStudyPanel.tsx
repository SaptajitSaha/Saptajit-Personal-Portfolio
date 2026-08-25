/** Signal Field refinement: reusable, evidence-led project detail disclosure using stable Radix accordion state. */
import { ArrowUpRight } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export type CaseStudy = {
  title: string;
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
  const sections = [["Problem", study.problem], ["Approach", study.approach], ["System", study.system], ["My contribution", study.contribution], ["Learning", study.learning]];

  return (
    <Accordion type="single" collapsible className="case-study-accordion">
      <AccordionItem value="case-study" className="case-study">
        <AccordionTrigger className="case-study__trigger">
          <span>Explore {study.title} case study</span>
        </AccordionTrigger>
        <AccordionContent className="case-study__dropdown">
          <div className="case-study__body">
            <dl>
              <div className="case-study__role"><dt>My role</dt><dd>{study.role}</dd></div>
              {sections.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}
            </dl>
            <div className="case-study__footer"><p>{study.status}</p><a href={study.href} target="_blank" rel="noreferrer">{study.linkLabel} <ArrowUpRight size={15} aria-hidden="true" /></a></div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
