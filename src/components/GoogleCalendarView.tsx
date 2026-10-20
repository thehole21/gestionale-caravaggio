'use client';

import React, { useState, useEffect } from 'react';
import {
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Appointment, Artist, StudioId } from '@/types';

interface GoogleCalendarViewProps {
  appointments: Appointment[];
  artists: Artist[];
  selectedArtists: string[];
  toggleArtist: (id: string) => void;
  studioFilter: StudioId;
  setStudioFilter: (studio: StudioId) => void;
  roleMode: 'admin' | 'artist';
  activeArtistId: string;
  onSelectAppointment: (apt: Appointment) => void;
  onEmptySlotClick: (dateStr: string, timeStr: string) => void;
}

const START_HOUR = 9;
const END_HOUR = 21;

function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export default function GoogleCalendarView({
  appointments,
  artists,
  selectedArtists,
  toggleArtist,
  studioFilter,
  setStudioFilter,
  roleMode,
  activeArtistId,
  onSelectAppointment,
  onEmptySlotClick,
}: GoogleCalendarViewProps) {
  const [selectedDate, setSelectedDate] = useState(() => new Date());
  const weekStart = new Date(selectedDate);
  weekStart.setDate(weekStart.getDate() - ((weekStart.getDay() + 6) % 7));
  const days = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(weekStart);
    date.setDate(weekStart.getDate() + index);
    return date;
  });
  const visibleArtists =
    roleMode === 'artist'
      ? [activeArtistId]
      : selectedArtists;

  const visibleAppointments = appointments.filter(
    (appointment) =>
      visibleArtists.includes(appointment.artistId) &&
      (studioFilter === 'ALL' || appointment.studio === studioFilter)
  );

  const moveWeek = (amount: number) => {
    setSelectedDate((current) => {
      const next = new Date(current);
      next.setDate(next.getDate() + amount * 7);
      return next;
    });
  };

  return (
    <main className="mx-auto max-w-7xl p-3 sm:p-6 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => moveWeek(-1)}
            aria-label="Settimana precedente"
            className="rounded-xl bg-white border border-[#E5E5EA] p-2 text-[#6E6E73] hover:text-[#1D1D1F]"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => setSelectedDate(new Date())}
            className="rounded-xl bg-white border border-[#E5E5EA] px-3 py-2 text-xs font-bold text-[#1D1D1F]"
          >
            Oggi
          </button>
          <button
            type="button"
            onClick={() => moveWeek(1)}
            aria-label="Settimana successiva"
            className="rounded-xl bg-white border border-[#E5E5EA] p-2 text-[#6E6E73] hover:text-[#1D1D1F]"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
          <h2 className="ml-1 text-sm font-bold text-[#1D1D1F]">
            {new Intl.DateTimeFormat('it-IT', { month: 'long', year: 'numeric' }).format(weekStart)}
          </h2>
        </div>

        {roleMode === 'admin' && (
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={studioFilter}
              onChange={(event) => setStudioFilter(event.target.value as StudioId)}
              aria-label="Filtra per sede"
              className="rounded-xl border border-[#E5E5EA] bg-white px-3 py-2 text-xs font-semibold"
            >
              <option value="ALL">Tutte le sedi</option>
              <option value="ROMA">Roma</option>
              <option value="MILANO">Milano</option>
            </select>
            <div className="flex gap-1.5">
              {artists.map((artist) => (
                <button
                  key={artist.id}
                  type="button"
                  onClick={() => toggleArtist(artist.id)}
                  aria-pressed={selectedArtists.includes(artist.id)}
                  className={`rounded-xl border px-2.5 py-2 text-xs font-semibold transition-colors ${
                    selectedArtists.includes(artist.id)
                      ? 'border-transparent text-white'
                      : 'border-[#E5E5EA] bg-white text-[#6E6E73]'
                  }`}
                  style={
                    selectedArtists.includes(artist.id)
                      ? { backgroundColor: artist.color }
                      : undefined
                  }
                >
                  {artist.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="overflow-x-auto rounded-2xl border border-[#E5E5EA] bg-white">
        <div className="grid min-w-[900px] grid-cols-7 divide-x divide-[#E5E5EA]">
          {days.map((day) => {
            const date = formatDate(day);
            const dayAppointments = visibleAppointments
              .filter((appointment) => appointment.date === date)
              .sort((first, second) => first.startTime.localeCompare(second.startTime));
            const isToday = date === formatDate(new Date());

            return (
              <section key={date} className="min-h-[420px]">
                <header
                  className={`sticky top-16 z-10 border-b border-[#E5E5EA] p-3 text-center ${
                    isToday ? 'bg-[#EBF4FF]' : 'bg-[#FAFAFC]'
                  }`}
                >
                  <p className="text-[10px] font-bold uppercase tracking-wide text-[#86868B]">
                    {new Intl.DateTimeFormat('it-IT', { weekday: 'short' }).format(day)}
                  </p>
                  <p className={`mt-1 text-sm font-bold ${isToday ? 'text-[#007AFF]' : 'text-[#1D1D1F]'}`}>
                    {day.getDate()}
                  </p>
                </header>
                <div className="space-y-2 p-2">
                  {dayAppointments.map((appointment) => {
                    const artist = artists.find((item) => item.id === appointment.artistId);
                    return (
                      <button
                        key={appointment.id}
                        type="button"
                        onClick={() => onSelectAppointment(appointment)}
                        className="w-full rounded-xl border p-2 text-left text-[11px] transition-opacity hover:opacity-80"
                        style={{
                          backgroundColor: artist?.bgSoft ?? '#F5F5F7',
                          borderColor: artist?.border ?? '#E5E5EA',
                          color: artist?.text ?? '#1D1D1F',
                        }}
                      >
                        <span className="block font-bold">
                          {appointment.startTime}–{appointment.endTime}
                        </span>
                        <span className="mt-1 block font-semibold">{appointment.clientName}</span>
                        <span className="block truncate">{appointment.title}</span>
                        {roleMode === 'admin' && (
                          <span className="mt-1 block opacity-75">{artist?.name}</span>
                        )}
                      </button>
                    );
                  })}
                  {Array.from({ length: END_HOUR - START_HOUR }, (_, index) => {
                    const hour = START_HOUR + index;
                    const time = `${String(hour).padStart(2, '0')}:00`;
                    return (
                      <button
                        key={time}
                        type="button"
                        onClick={() => onEmptySlotClick(date, time)}
                        className="w-full rounded-lg border border-dashed border-[#E5E5EA] py-1.5 text-[10px] text-[#86868B] hover:border-[#007AFF] hover:text-[#007AFF]"
                        aria-label={`Nuovo appuntamento il ${date} alle ${time}`}
                      >
                        + {time}
                      </button>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </main>
  );
}