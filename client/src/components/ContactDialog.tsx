import { submitWeb3FormsContact } from "@/lib/web3forms";
import { ArrowUpRight, Check, Copy, LoaderCircle } from "lucide-react";
import { FormEvent, useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

const contactEmail = "sahasaptajit@gmail.com";
const initialForm = { name: "", email: "", subject: "", message: "", website: "" };

type ContactForm = typeof initialForm;
type FieldErrors = Partial<Record<keyof ContactForm, string>>;

function validateForm(form: ContactForm): FieldErrors {
  const errors: FieldErrors = {};
  if (form.name.trim().length < 2) errors.name = "Please enter your name.";
  if (!/^\S+@\S+\.\S+$/.test(form.email)) errors.email = "Enter a valid email address.";
  if (form.subject.trim().length < 3) errors.subject = "Add a short subject.";
  if (form.message.trim().length < 10) errors.message = "Please add a little more detail.";
  return errors;
}

export function ContactDialog() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<ContactForm>(initialForm);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [state, setState] = useState<"form" | "success" | "error">("form");
  const [copied, setCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function updateField(field: keyof ContactForm, value: string) {
    setForm(current => ({ ...current, [field]: value }));
    setErrors(current => ({ ...current, [field]: undefined }));
  }

  function resetDialog() {
    setForm(initialForm);
    setErrors({});
    setState("form");
    setCopied(false);
  }

  function onOpenChange(nextOpen: boolean) {
    setOpen(nextOpen);
    if (!nextOpen) window.setTimeout(resetDialog, 180);
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const validationErrors = validateForm(form);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;
    setIsSubmitting(true);
    try {
      await submitWeb3FormsContact({
        name: form.name.trim(),
        email: form.email.trim(),
        subject: form.subject.trim(),
        message: form.message.trim(),
        botcheck: Boolean(form.website),
      }, import.meta.env.VITE_WEB3FORMS_ACCESS_KEY);
      setState("success");
    } catch {
      setState("error");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(contactEmail);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(contactEmail)}`;
  const outlookUrl = `https://outlook.office.com/mail/deeplink/compose?to=${encodeURIComponent(contactEmail)}`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <button className="footer-contact-button" type="button">Contact Me <ArrowUpRight size={22} aria-hidden="true" /></button>
      </DialogTrigger>
      <DialogContent className="contact-dialog" showCloseButton={false} aria-describedby={undefined}>
        <DialogHeader className="contact-dialog__header">
          <p className="contact-dialog__eyebrow">Contact me</p>
          <DialogTitle>Let&apos;s build something interesting.</DialogTitle>
          <DialogDescription id="contact-dialog-description">Send a short note and it will arrive directly in my inbox.</DialogDescription>
        </DialogHeader>

        {state === "success" ? (
          <section className="contact-dialog__state" aria-live="polite">
            <Check size={24} aria-hidden="true" />
            <h3>Message sent.</h3>
            <p>Thanks for reaching out — I&apos;ll get back to you soon.</p>
            <div className="contact-dialog__actions">
              <button className="contact-dialog__submit" type="button" onClick={resetDialog}>Send another message <ArrowUpRight size={16} aria-hidden="true" /></button>
              <DialogClose asChild><button className="contact-dialog__secondary" type="button">Close</button></DialogClose>
            </div>
          </section>
        ) : (
          <form className="contact-form" onSubmit={onSubmit} noValidate>
            {state === "error" && <p className="contact-form__notice" role="alert"><strong>Something went wrong.</strong> Please try again or email me directly below.</p>}
            <div className="contact-form__grid">
              <label>Name<input name="name" autoComplete="name" value={form.name} onChange={event => updateField("name", event.target.value)} aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? "contact-name-error" : undefined} disabled={isSubmitting} /></label>
              {errors.name && <span id="contact-name-error" className="contact-form__error">{errors.name}</span>}
              <label>Email<input name="email" type="email" autoComplete="email" value={form.email} onChange={event => updateField("email", event.target.value)} aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? "contact-email-error" : undefined} disabled={isSubmitting} /></label>
              {errors.email && <span id="contact-email-error" className="contact-form__error">{errors.email}</span>}
            </div>
            <label>Subject<input name="subject" value={form.subject} onChange={event => updateField("subject", event.target.value)} aria-invalid={Boolean(errors.subject)} aria-describedby={errors.subject ? "contact-subject-error" : undefined} disabled={isSubmitting} /></label>
            {errors.subject && <span id="contact-subject-error" className="contact-form__error">{errors.subject}</span>}
            <label>Message<textarea name="message" rows={5} value={form.message} onChange={event => updateField("message", event.target.value)} aria-invalid={Boolean(errors.message)} aria-describedby={errors.message ? "contact-message-error" : undefined} disabled={isSubmitting} /></label>
            {errors.message && <span id="contact-message-error" className="contact-form__error">{errors.message}</span>}
            <label className="contact-form__honeypot" aria-hidden="true">Website<input tabIndex={-1} autoComplete="off" name="website" value={form.website} onChange={event => updateField("website", event.target.value)} /></label>
            <DialogFooter className="contact-dialog__actions">
              <button className="contact-dialog__submit" type="submit" disabled={isSubmitting}>{isSubmitting ? <><LoaderCircle className="contact-dialog__spinner" size={16} aria-hidden="true" />Sending…</> : <>Send Message <ArrowUpRight size={16} aria-hidden="true" /></>}</button>
              <DialogClose asChild><button className="contact-dialog__secondary" type="button" disabled={isSubmitting}>Close</button></DialogClose>
            </DialogFooter>
          </form>
        )}

        <div className="contact-dialog__alternatives">
          <span>Prefer email?</span>
          <div><a href={gmailUrl} target="_blank" rel="noreferrer">Open Gmail <ArrowUpRight size={13} aria-hidden="true" /></a><a href={outlookUrl} target="_blank" rel="noreferrer">Open Outlook <ArrowUpRight size={13} aria-hidden="true" /></a><button type="button" onClick={copyEmail}>{copied ? <><Check size={13} aria-hidden="true" />Email copied.</> : <><Copy size={13} aria-hidden="true" />Copy email</>}</button></div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
