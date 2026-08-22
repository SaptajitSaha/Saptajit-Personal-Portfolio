import { ArrowUpRight, CalendarDays } from "lucide-react";
import "./booking-calendar.css";

const weekdayLabels = ["S", "M", "T", "W", "T", "F", "S"];

export function BookingCalendar() {
  const now = new Date();
  const month = new Intl.DateTimeFormat("en", { month: "long", year: "numeric" }).format(now);
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).getDay();
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const today = now.getDate();
  const requestUrl = "mailto:sahasaptajit@gmail.com?subject=30-minute%20portfolio%20call&body=Hi%20Saptajit%2C%0A%0AI%27d%20like%20to%20request%20a%2030-minute%20conversation%20about%20...";

  return (
    <a className="booking-calendar" href={requestUrl} aria-label="Request a 30-minute portfolio call by email">
      <div className="booking-calendar__copy"><span><CalendarDays size={14} aria-hidden="true" /> Conversation window</span><strong>Book a 30 min call</strong><p>Times are arranged directly over email.</p></div>
      <div className="booking-calendar__sheet" aria-hidden="true">
        <div className="booking-calendar__month"><span>{month}</span><i>30 min</i></div>
        <div className="booking-calendar__days">
          {weekdayLabels.map((day, index) => <span className="booking-calendar__weekday" key={`${day}-${index}`}>{day}</span>)}
          {Array.from({ length: firstDay }).map((_, index) => <span key={`blank-${index}`} />)}
          {Array.from({ length: daysInMonth }, (_, index) => index + 1).map(day => <span className={day == today ? "is-today" : ""} key={day}>{day}</span>)}
        </div>
      </div>
      <ArrowUpRight className="booking-calendar__arrow" size={16} aria-hidden="true" />
    </a>
  );
}
