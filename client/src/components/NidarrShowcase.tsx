import { ExternalLink } from "lucide-react";
import { PhoneCarousel, type ImageItem } from "@/components/ui/phone-mockups-1";
import "./nidarr-showcase.css";

export function NidarrShowcase({ screens }: { screens: ImageItem[] }) {

  return (
    <section className="nidarr-showcase" aria-label="Nidarr mobile product screens">
      <div className="nidarr-showcase__atmosphere" aria-hidden="true" />
      <PhoneCarousel images={screens} />
      <a className="nidarr-showcase__prototype" href="https://nidarr.vercel.app/" target="_blank" rel="noreferrer">Open prototype <ExternalLink size={13} aria-hidden="true" /></a>
    </section>
  );
}
