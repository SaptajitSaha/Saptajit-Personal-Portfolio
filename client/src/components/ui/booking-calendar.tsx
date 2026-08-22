import { ArrowLeft, ArrowRight, CalendarDays, CheckCircle2, Clock3, Globe2, Mail, Video } from "lucide-react";
import { useMemo, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./dialog";
import "./booking-calendar.css";

const weekdayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const slotHours = [11, 11.5, 12, 12.5, 13, 13.5, 14, 14.5, 15, 15.5];

function startOfDay(value: Date) { return new Date(value.getFullYear(), value.getMonth(), value.getDate()); }
function formatDate(value: Date) { return new Intl.DateTimeFormat("en-IN", { weekday: "short", day: "numeric", month: "long", year: "numeric" }).format(value); }
function formatTime(value: number, use24Hour: boolean) {
  const hour = Math.floor(value); const minute = value % 1 ? 30 : 0;
  if (use24Hour) return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
  const suffix = hour >= 12 ? "PM" : "AM"; const displayHour = hour % 12 || 12;
  return `${displayHour}:${String(minute).padStart(2, "0")} ${suffix}`;
}

export function BookingCalendar() {
  const today = useMemo(() => startOfDay(new Date()), []);
  const [visibleMonth, setVisibleMonth] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1));
  const [selectedDate, setSelectedDate] = useState(today);
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const [use24Hour, setUse24Hour] = useState(false);
  const monthLabel = new Intl.DateTimeFormat("en", { month: "long", year: "numeric" }).format(visibleMonth);
  const firstDay = visibleMonth.getDay();
  const daysInMonth = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + 1, 0).getDate();
  const selectedLabel = formatDate(selectedDate);
  const requestUrl = selectedSlot === null ? "" : `mailto:sahasaptajit@gmail.com?subject=${encodeURIComponent("30-minute portfolio call request")}&body=${encodeURIComponent(`Hi Saptajit,\n\nI'd like to request a 30-minute conversation on ${selectedLabel} at ${formatTime(selectedSlot, false)} (Asia/Kolkata).\n\nTopic:\n\nMy name:\n\nThank you.`)}`;
  const changeMonth = (amount: number) => setVisibleMonth(month => new Date(month.getFullYear(), month.getMonth() + amount, 1));
  const requestBooking = () => { if (requestUrl) window.location.href = requestUrl; };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="booking-calendar" type="button" aria-label="Open the 30-minute call scheduler">
          <div className="booking-calendar__copy"><span><CalendarDays size={14} aria-hidden="true" /> Conversation window</span><strong>Book a 30 min call</strong><p>Choose a preferred time, then send a request.</p></div>
          <div className="booking-calendar__sheet" aria-hidden="true"><div className="booking-calendar__month"><span>{monthLabel}</span><i>30 min</i></div><div className="booking-calendar__days">{weekdayLabels.map(day => <span className="booking-calendar__weekday" key={day}>{day[0]}</span>)}{Array.from({ length: firstDay }).map((_, index) => <span key={`blank-${index}`} />)}{Array.from({ length: daysInMonth }, (_, index) => index + 1).map(day => <span className={day === selectedDate.getDate() && visibleMonth.getMonth() === selectedDate.getMonth() ? "is-today" : ""} key={day}>{day}</span>)}</div></div>
          <ArrowRight className="booking-calendar__arrow" size={16} aria-hidden="true" />
        </button>
      </DialogTrigger>
      <DialogContent className="booking-dialog" aria-describedby="booking-dialog-description">
        <DialogHeader className="booking-dialog__sr-header"><DialogTitle>Book a 30-minute call</DialogTitle><DialogDescription id="booking-dialog-description">Select a preferred date and time, then send an email request for confirmation.</DialogDescription></DialogHeader>
        <aside className="booking-dialog__details"><span className="booking-dialog__identity">Saptajit Saha</span><h3>30 min<br />conversation</h3><p><CheckCircle2 size={16} aria-hidden="true" /> Requires confirmation</p><p><Clock3 size={16} aria-hidden="true" /> 30 minutes</p><p><Video size={16} aria-hidden="true" /> Video link arranged after confirmation</p><p><Globe2 size={16} aria-hidden="true" /> Asia/Kolkata</p></aside>
        <section className="booking-dialog__calendar" aria-label="Select a preferred meeting date"><div className="booking-dialog__calendar-head"><h3>{monthLabel}</h3><div><button type="button" onClick={() => changeMonth(-1)} aria-label="Show previous month"><ArrowLeft size={16} aria-hidden="true" /></button><button type="button" onClick={() => changeMonth(1)} aria-label="Show next month"><ArrowRight size={16} aria-hidden="true" /></button></div></div><div className="booking-dialog__weekday-row">{weekdayLabels.map(day => <span key={day}>{day}</span>)}</div><div className="booking-dialog__date-grid">{Array.from({ length: firstDay }).map((_, index) => <span key={`blank-${index}`} />)}{Array.from({ length: daysInMonth }, (_, index) => { const day = index + 1; const date = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth(), day); const isPast = date < today; const isSelected = startOfDay(date).getTime() === selectedDate.getTime(); return <button type="button" disabled={isPast} aria-pressed={isSelected} data-selected={isSelected || undefined} key={day} onClick={() => { setSelectedDate(date); setSelectedSlot(null); }}>{day}</button>; })}</div></section>
        <section className="booking-dialog__slots" aria-label={`Choose a time on ${selectedLabel}`}><div className="booking-dialog__slots-head"><div><span>{selectedLabel}</span><strong>Select a time</strong></div><div className="booking-dialog__clock-toggle" aria-label="Time format"><button type="button" data-active={!use24Hour || undefined} onClick={() => setUse24Hour(false)}>12h</button><button type="button" data-active={use24Hour || undefined} onClick={() => setUse24Hour(true)}>24h</button></div></div><div className="booking-dialog__slot-list">{slotHours.map(slot => <button type="button" key={slot} data-selected={selectedSlot === slot || undefined} aria-pressed={selectedSlot === slot} onClick={() => setSelectedSlot(slot)}>{formatTime(slot, use24Hour)}</button>)}</div><button className="booking-dialog__request" type="button" disabled={selectedSlot === null} onClick={requestBooking}>{selectedSlot === null ? "Select a time to continue" : <><Mail size={16} aria-hidden="true" /> Request {formatTime(selectedSlot, false)}</>}</button><p className="booking-dialog__note">A request email opens next. Your time is not reserved until confirmed.</p></section>
    </DialogContent>
    </Dialog>
  );
}
