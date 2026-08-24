import { ArrowUpRight, Check, Copy, Github, Linkedin, Mail, MessageCircleMore } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { ContactDialog } from "./ContactDialog";
import { BookingCalendar } from "./ui/booking-calendar";

export function ReachOutPanel() {
  const email = "sahasaptajit@gmail.com";
  const [copied, setCopied] = useState(false);
  const resetTimerRef = useRef<number | undefined>(undefined);

  useEffect(() => () => { if (resetTimerRef.current) window.clearTimeout(resetTimerRef.current); }, []);

  const copyEmail = async () => {
    const fallbackCopy = () => {
      const textArea = document.createElement("textarea");
      textArea.value = email;
      textArea.style.position = "fixed";
      textArea.style.opacity = "0";
      document.body.appendChild(textArea);
      try {
        textArea.select();
        return document.execCommand("copy");
      } catch {
        return false;
      } finally {
        textArea.remove();
      }
    };

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(email);
      } else {
        fallbackCopy();
      }
    } catch {
      fallbackCopy();
    }
    setCopied(true);
    if (resetTimerRef.current) window.clearTimeout(resetTimerRef.current);
    resetTimerRef.current = window.setTimeout(() => setCopied(false), 1800);
  };

  return (
    <section className="reach-out" aria-labelledby="connect-heading">
      <div className="reach-out__heading"><p className="connect-panel__kicker">Open channel</p><h2 id="connect-heading">Reach<br /><em>out.</em></h2><p>Have an idea, a collaboration, or a problem worth taking apart? I&apos;d like to hear it.</p></div>
      <div className="reach-out__grid">
        <ContactDialog trigger={<button className="reach-out__message" type="button"><span><MessageCircleMore size={17} aria-hidden="true" /> Direct message</span><strong>Start a conversation</strong><p>Send a note through the portfolio.</p><ArrowUpRight size={18} aria-hidden="true" /></button>} />
        <BookingCalendar />
        <div className="reach-out__email">
          <a className="reach-out__email-link" href={`mailto:${email}`}><span><Mail size={17} aria-hidden="true" /> Email me</span><strong>{email}</strong><ArrowUpRight size={18} aria-hidden="true" /></a>
          <button className="reach-out__copy" type="button" onClick={copyEmail} aria-label={copied ? "Email address copied" : "Copy email address"}><span aria-live="polite">{copied ? <><Check size={14} aria-hidden="true" /> Copied</> : <><Copy size={14} aria-hidden="true" /> Copy</>}</span></button>
        </div>
      </div>
      <div className="reach-out__socials" aria-label="Professional links"><a href="https://www.linkedin.com/in/saptajitsaha/" target="_blank" rel="noreferrer"><Linkedin size={14} aria-hidden="true" /> LinkedIn <ArrowUpRight size={12} aria-hidden="true" /></a><a href="https://github.com/SaptajitSaha" target="_blank" rel="noreferrer"><Github size={14} aria-hidden="true" /> GitHub <ArrowUpRight size={12} aria-hidden="true" /></a><a href={`mailto:${email}`}><Mail size={14} aria-hidden="true" /> Email <ArrowUpRight size={12} aria-hidden="true" /></a></div>
    </section>
  );
}
