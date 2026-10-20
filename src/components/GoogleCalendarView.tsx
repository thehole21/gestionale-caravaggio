'use client';
import { useState } from 'react';
import { Plus, ChevronLeft, ChevronRight, ArrowUpRight } from 'lucide-react';
import type { Appointment, Artist, StudioId } from '@/types';
import { addDays, dateObject, formatDate, money, movePeriod, periodBounds, startOfWeek, today, type Period } from '@/lib/agenda';

interface Props {
  appointments: Appointment[]; artists: Artist[]; selectedArtists: string[];
  toggleArtist: (id: string) => void; studioFilter: StudioId; roleMode: 'admin' | 'artist';
  onSelectAppointment: (apt: Appointment) => void;
  onEmptySlotClick: (date: string, time: string) => void;
}
export default function GoogleCalendarView({ appointments, artists, selectedArtists, toggleArtist, studioFilter, roleMode, onSelectAppointment, onEmptySlotClick }: Props) {
  const [date, setDate] = useState(today);
  const [view, setView] = useState<Period>('day');
  const [start, end] = periodBounds(date, view);
  const filtered = appointments.filter(a => selectedArtists.includes(a.artistId) && (studioFilter === 'ALL' || a.studio === studioFilter) && a.status !== 'cancelled');
  const inPeriod = filtered.filter(a => a.date >= start && a.date <= end);
  const dates = view === 'month'
    ? Array.from({ length: 42 }, (_, i) => addDays(startOfWeek(start), i))
    : Array.from({ length: view === 'week' ? 7 : 1 }, (_, i) => addDays(start, i));
  const dayAppointments = (day: string) => filtered.filter(a => a.date === day).sort((a,b) => a.startTime.localeCompare(b.startTime));
  const card = (apt: Appointment) => {
    const artist = artists.find(a => a.id === apt.artistId);
    return <button key={apt.id} onClick={() => onSelectAppointment(apt)} className="appointment-card" style={{ borderLeftColor: artist?.color }}>
      <div className="appointment-time">{apt.startTime}<span>{apt.endTime}</span></div>
      <div className="min-w-0 flex-1"><strong className="block break-words">{apt.clientName}</strong><p className="mt-1 text-sm text-stone-500 break-words">{apt.title}</p><p className="mt-2 text-xs text-stone-500">{roleMode === 'admin' ? `${artist?.name} · ${apt.studio} · ` : ''}{apt.status === 'completed' ? (apt.studioFeeStatus === 'settled' ? 'Completato · quota saldata' : 'Completato · quota da versare') : 'In programma'}</p></div>
      <div className="text-right shrink-0"><strong className="text-sm">{apt.price === null ? 'Da definire' : money(apt.price)}</strong><ArrowUpRight className="w-4 h-4 ml-auto mt-3 text-stone-400" /></div>
    </button>;
  };
  return <main className="workspace">
    <section className="page-heading"><div><p className="eyebrow">{roleMode === 'admin' ? 'DIREZIONE · ROMA / MILANO' : 'IL TUO SPAZIO IN ATELIER'}</p><h1>{roleMode === 'admin' ? 'L’atelier, sotto controllo.' : 'La tua agenda.'}</h1><p className="text-stone-500 text-sm mt-2">Appuntamenti, clienti e chiusure. Tutto al posto giusto.</p></div><button className="primary-button" onClick={() => onEmptySlotClick(date, '10:00')}><Plus size={17} /> Nuovo appuntamento</button></section>
    <section className="summary-grid">
      <div><span>Appuntamenti nel periodo</span><strong>{inPeriod.length}</strong></div>
      <div><span>Da completare</span><strong>{inPeriod.filter(a => a.status === 'scheduled').length}</strong></div>
      <div><span>Valore programmato</span><strong>{money(inPeriod.filter(a => a.status === 'scheduled').reduce((s,a) => s + (a.price || 0),0))}</strong><small>Esclusi importi da definire</small></div>
    </section>
    <section className="agenda-panel">
      <div className="calendar-toolbar"><div className="flex items-center gap-2"><button className="icon-button" aria-label="Periodo precedente" onClick={() => setDate(movePeriod(date, view, -1))}><ChevronLeft size={18}/></button><button className="icon-button" aria-label="Periodo successivo" onClick={() => setDate(movePeriod(date, view, 1))}><ChevronRight size={18}/></button><button className="quiet-button" onClick={() => setDate(today())}>Oggi</button></div><h2 className="capitalize font-semibold">{view === 'month' ? formatDate(date, { month: 'long', year: 'numeric' }) : view === 'week' ? `${formatDate(start, {day:'numeric',month:'short'})} – ${formatDate(end)}` : formatDate(date, {weekday:'long',day:'numeric',month:'long',year:'numeric'})}</h2><div className="segmented">{(['day','week','month'] as Period[]).map(v => <button key={v} aria-pressed={view===v} onClick={() => setView(v)}>{v==='day'?'Giorno':v==='week'?'Settimana':'Mese'}</button>)}</div></div>
      <div className="calendar-filters"><label className="text-xs text-stone-500 flex items-center gap-2">Vai al giorno <input aria-label="Vai al giorno" type="date" value={date} onChange={e => e.target.value && setDate(e.target.value)} onClick={e => { try { e.currentTarget.showPicker(); } catch {} }} /></label>{roleMode === 'admin' && <div className="artist-filters">{artists.filter(a => studioFilter === 'ALL' || a.studio === studioFilter).map(a => <button key={a.id} aria-pressed={selectedArtists.includes(a.id)} onClick={() => toggleArtist(a.id)}><i style={{background:a.color}}/>{a.name}</button>)}</div>}</div>
      {view === 'month' ? <>
        <div className="month-grid month-labels">{['Lun','Mar','Mer','Gio','Ven','Sab','Dom'].map(d=><span key={d}>{d}</span>)}</div>
        <div className="month-grid">{dates.map(day => { const appts=dayAppointments(day); return <button key={day} className={`month-cell ${day===today()?'is-today':''} ${day.slice(0,7)!==date.slice(0,7)?'outside-month':''} ${day===date?'selected-date':''}`} onClick={() => setDate(day)} aria-label={`${formatDate(day)}: ${appts.length} appuntamenti`}><span className="day-number">{dateObject(day).getDate()}</span>{appts.length>0 && <><span className="month-count">{appts.length} <span className="hidden sm:inline">appuntamenti</span></span><div className="hidden lg:block text-left mt-2 space-y-1">{appts.slice(0,2).map(a=><p className="truncate text-xs" key={a.id}>{a.startTime} {a.clientName}</p>)}</div></>}</button>; })}</div>
        <div className="month-detail"><div className="flex items-center justify-between gap-2 mb-4"><h3 className="font-semibold">{formatDate(date)}</h3><button className="quiet-button" onClick={()=>onEmptySlotClick(date,'10:00')}><Plus size={15}/> Aggiungi</button></div>{dayAppointments(date).map(card)}{!dayAppointments(date).length && <p className="empty-state">Nessun appuntamento. Aggiungi una seduta per questo giorno.</p>}</div>
      </> : <div className={view==='week'?'week-agenda':'day-agenda'}>{dates.map(day=><section key={day} className="agenda-day">{view==='week' && <button className={`day-heading ${day===today()?'text-amber-800':''}`} onClick={()=>{setDate(day);setView('day');}}>{formatDate(day,{weekday:'short',day:'numeric',month:'short'})}<span>{dayAppointments(day).length} appuntamenti</span></button>}{dayAppointments(day).map(card)}{!dayAppointments(day).length && <div className="empty-state">Agenda libera</div>}<button className="add-slot" onClick={()=>onEmptySlotClick(day,'10:00')}><Plus size={16}/> Aggiungi appuntamento</button></section>)}</div>}
    </section>
  </main>;
}
