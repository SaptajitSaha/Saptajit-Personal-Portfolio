import { ArrowUpRight, Github, Linkedin, Mail, MessageCircleMore } from "lucide-react";
import { ContactDialog } from "./ContactDialog";
import { BookingCalendar } from "./ui/booking-calendar";

export function ReachOutPanel() {
  return (
    <section className="reach-out" aria-labelledby="connect-heading">
      <div className="reach-out__heading"><p className="connect-panel__kicker">Open channel</p><h2 id="connect-heading">Reach<br /><em>out.</em></h2><p>Have an idea, a collaboration, or a problem worth taking apart? I&apos;d like to hear it.</p></div>
      <div className="reach-out__grid">
        <ContactDialog trigger={<button className="reach-out__message" type="button"><span><MessageCircleMore size={17} aria-hidden="true" /> Direct message</span><strong>Start a conversation</strong><p>Send a note through the portfolio.</p><ArrowUpRight size={18} aria-hidden="true" /></button>} />
        <BookingCalendar />
        <a className="reach-out__email" href="mailto:sahasaptajit@gmail.com"><span><Mail size={17} aria-hidden="true" /> Email me</span><strong>sahasaptajit@gmail.com</strong><ArrowUpRight size={18} aria-hidden="true" /></a>
      </div>
      <div className="reach-out__socials" aria-label="Professional links"><a href="https://www.linkedin.com/in/saptajitsaha/" target="_blank" rel="noreferrer"><Linkedin size={14} aria-hidden="true" /> LinkedIn <ArrowUpRight size={12} aria-hidden="true" /></a><a href="https://github.com/SaptajitSaha" target="_blank" rel="noreferrer"><Github size={14} aria-hidden="true" /> GitHub <ArrowUpRight size={12} aria-hidden="true" /></a><a href="mailto:sahasaptajit@gmail.com"><Mail size={14} aria-hidden="true" /> Email <ArrowUpRight size={12} aria-hidden="true" /></a></div>
    </section>
  );
}
