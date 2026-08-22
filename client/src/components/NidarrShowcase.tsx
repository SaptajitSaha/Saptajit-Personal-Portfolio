import { ExternalLink } from "lucide-react";
import { PhoneCarousel, type ImageItem } from "@/components/ui/phone-mockups-1";
import "./nidarr-showcase.css";

type NidarrScreens = {
  home: string;
  report: string;
  map: string;
  walk: string;
  profile: string;
};

export function NidarrShowcase({ assets }: { assets: NidarrScreens }) {
  const screens: ImageItem[] = [
    { src: assets.home, label: "Safety overview", alt: "Nidarr safety overview on mobile" },
    { src: assets.report, label: "Incident report", alt: "Nidarr report an incident screen on mobile" },
    { src: assets.map, label: "Safety map", alt: "Nidarr Kolkata safety map on mobile" },
    { src: assets.walk, label: "Walk with me", alt: "Nidarr trusted-contact walk screen on mobile" },
    { src: assets.profile, label: "Profile", alt: "Nidarr user profile screen on mobile" },
  ];

  return (
    <section className="nidarr-showcase" aria-label="Nidarr mobile product screens">
      <div className="nidarr-showcase__atmosphere" aria-hidden="true" />
      <PhoneCarousel images={screens} />
      <a className="nidarr-showcase__prototype" href="https://nidarr.vercel.app/" target="_blank" rel="noreferrer">Open prototype <ExternalLink size={13} aria-hidden="true" /></a>
    </section>
  );
}
