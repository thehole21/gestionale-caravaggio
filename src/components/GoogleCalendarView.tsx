'use client';

import React from 'react';
import { Check, AlertCircle, Clock, MapPin } from 'lucide-react';
import { Appointment, Artist, StudioId } from '@/types';
import { WEEK_DAYS } from '@/lib/mock-data';

interface GoogleCalendarViewProps {
  appointments: Appointment[];
  artists: Artist[];
  selectedArtists: string[];
  toggleArtist: (id: string) => void;
  studioFilter: StudioId;
  onSelectAppointment: (apt: Appointment) => void;
  onEmptySlotClick: (dayOffset: number, timeStr: string) => void;
}

const START_HOUR = 9;
const END_HOUR = 21;
const HOUR_HEIGHT = 68; // 68px per ora

function timeToMinutes(t: string): number {
  const [hh, mm] = t.split(':').map(Number);
  return hh * 60 + mm;
}

export default function GoogleCalendarView({
  appointments,
  artists,
  selectedArtists,
  toggleArtist,
  studioFilter,
  onSelectAppointment,
  onEmptySlotClick,
}: GoogleCalendarViewProps) {
  const hours = Array.from({ length: END_HOUR - START_HOUR }, (_, i) => START_HOUR + i);

  // Calcolo linea rossa dell'ora attuale (es. 15:25)
  const currentMinutesFromStart = (15 - START_HOUR) * 60 + 25;
  const currentTimeTop = (currentMinutesFromStart / 60) * HOUR_HEIGHT;

  return (
    <div className="flex h-[calc(100vh-4rem)] overflow-hidden bg-white">
      {/* Sidebar Sinistra stile Google Calendar */}
      <aside className="w-64 border-r border-[#E5E5EA] bg-[#FBFBFD] p-4 hidden lg:flex flex-col justify-between shrink-0">
        <div className="space-y-6">
          {/* Mini Mese */}
          <div>
            <div className="flex items-center justify-between mb-3 px-1">
              <span className="text-xs font-bold text-[#1D1D1F] tracking-tight">
                Ottobre 2026
              </span>
              <span className="text-[11px] text-[#86868B] font-medium">Settimana 43</span>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-semibold text-[#86868B] mb-1">
              <span>L</span><span>M</span><span>M</span><span>G</span><span>V</span><span>S</span><span>D</span>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center text-xs">
              {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                <div
                  key={day}
                  className={`h-7 w-7 mx-auto flex items-center justify-center rounded-full font-medium ${
                    day === 21
                      ? 'bg-[#007AFF] text-white font-bold'
                      : 'text-[#1D1D1F] hover:bg-[#E5E5EA]/60 cursor-pointer'
                  }`}
                >
                  {day}
                </div>
              ))}
            </div>
          </div>

          {/* Filtro Tatuatori con Checkbox Colorate */}
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-[#86868B] mb-2.5 px-1">
              Tatuatori in Studio
            </p>
            <div className="space-y-1">
              {artists
                .filter((a) => studioFilter === 'ALL' || a.studio === studioFilter)
                .map((artist) => {
                  const checked = selectedArtists.includes(artist.id);
                  return (
                    <button
                      key={artist.id}
                      onClick={() => toggleArtist(artist.id)}
                      className="w-full flex items-center justify-between px-2.5 py-2 rounded-xl hover:bg-[#F2F2F7] transition-colors text-left"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span
                          className="w-4 h-4 rounded-md flex items-center justify-center transition-all shrink-0"
                          style={{
                            backgroundColor: checked ? artist.color : 'transparent',
                            border: `2px solid ${artist.color}`,
                          }}
                        >
                          {checked && <Check className="w-2.5 h-2.5 text-white stroke-[3]" />}
                        </span>
                        <div className="truncate">
                          <p className="text-xs font-semibold text-[#1D1D1F] truncate">
                            {artist.name}
                          </p>
                          <p className="text-[10px] text-[#86868B]">
                            {artist.studio} • Studio {artist.splitPct}%
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                })}
            </div>
          </div>
        </div>

        {/* Legenda Stati */}
        <div className="bg-[#F2F2F7] p-3 rounded-2xl space-y-2 text-[11px]">
          <p className="font-bold text-[#1D1D1F]">Stato Contabile in Tempo Reale</p>
          <div className="flex items-center gap-2 text-[#6E6E73]">
            <span className="w-2 h-2 rounded-full bg-[#007AFF]" />
            <span>In programma (da chiudere)</span>
          </div>
          <div className="flex items-center gap-2 text-[#6E6E73]">
            <span className="w-2 h-2 rounded-full bg-[#FF9500]" />
            <span>Chiuso • % Studio in sospeso</span>
          </div>
          <div className="flex items-center gap-2 text-[#6E6E73]">
            <span className="w-2 h-2 rounded-full bg-[#34C759]" />
            <span>Chiuso • % Studio saldata</span>
          </div>
        </div>
      </aside>

      {/* Griglia Principale Google Calendar */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Intestazione Giorni */}
        <div className="grid grid-cols-[64px_repeat(6,1fr)] border-b border-[#E5E5EA] bg-white shrink-0">
          <div className="py-3 text-center text-[10px] font-semibold text-[#86868B] border-r border-[#E5E5EA]">
            GMT+2
          </div>
          {WEEK_DAYS.map((day) => (
            <div
              key={day.offset}
              className="py-2.5 text-center border-r border-[#E5E5EA] last:border-r-0"
            >
              <p
                className={`text-[11px] font-semibold ${
                  day.isToday ? 'text-[#007AFF]' : 'text-[#86868B]'
                }`}
              >
                {day.short}
              </p>
              <div
                className={`mt-0.5 w-8 h-8 mx-auto rounded-full flex items-center justify-center text-sm font-bold ${
                  day.isToday
                    ? 'bg-[#007AFF] text-white shadow-sm'
                    : 'text-[#1D1D1F]'
                }`}
              >
                {day.num}
              </div>
            </div>
          ))}
        </div>

        {/* Corpo Orario Scrollabile */}
        <div className="flex-1 overflow-y-auto relative">
          <div
            className="grid grid-cols-[64px_repeat(6,1fr)] relative"
            style={{ height: `${hours.length * HOUR_HEIGHT}px` }}
          >
            {/* Colonna Ore */}
            <div className="border-r border-[#E5E5EA] bg-white select-none">
              {hours.map((hour) => (
                <div
                  key={hour}
                  style={{ height: `${HOUR_HEIGHT}px` }}
                  className="relative pr-2 text-right"
                >
                  <span className="text-[11px] font-medium text-[#86868B] -top-2 relative">
                    {String(hour).padStart(2, '0')}:00
                  </span>
                </div>
              ))}
            </div>

            {/* 6 Colonne Giorni */}
            {WEEK_DAYS.map((day) => {
              const dayAppointments = appointments.filter(
                (a) =>
                  a.dayOffset === day.offset &&
                  selectedArtists.includes(a.artistId) &&
                  (studioFilter === 'ALL' || a.studio === studioFilter) &&
                  a.status !== 'cancelled'
              );

              return (
                <div
                  key={day.offset}
                  className="relative border-r border-[#E5E5EA] last:border-r-0 group"
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const clickY = e.clientY - rect.top;
                    const totalMins = START_HOUR * 60 + (clickY / HOUR_HEIGHT) * 60;
                    const roundedMins = Math.round(totalMins / 15) * 15;
                    const hh = Math.floor(roundedMins / 60);
                    const mm = roundedMins % 60;
                    const timeStr = `${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}`;
                    onEmptySlotClick(day.offset, timeStr);
                  }}
                >
                  {/* Linee Orarie e Mezz'ore */}
                  {hours.map((h) => (
                    <div
                      key={h}
                      style={{ height: `${HOUR_HEIGHT}px` }}
                      className="border-b border-[#F2F2F7] relative"
                    >
                      <div className="border-b border-dashed border-[#F5F5F7] top-1/2 relative" />
                    </div>
                  ))}

                  {/* Linea Rossa Ora Attuale stile Google Calendar */}
                  {day.isToday && (
                    <div
                      style={{ top: `${currentTimeTop}px` }}
                      className="absolute left-0 right-0 z-20 pointer-events-none flex items-center"
                    >
                      <div className="w-2.5 h-2.5 rounded-full bg-[#FF3B30] -ml-1.5" />
                      <div className="h-[1.5px] bg-[#FF3B30] flex-1" />
                    </div>
                  )}

                  {/* Card Appuntamenti Posizionati al Minuto */}
                  {dayAppointments.map((apt, idx) => {
                    const artist = artists.find((ar) => ar.id === apt.artistId);
                    if (!artist) return null;

                    const startMin = timeToMinutes(apt.startTime) - START_HOUR * 60;
                    const endMin = timeToMinutes(apt.endTime) - START_HOUR * 60;
                    const topPx = (startMin / 60) * HOUR_HEIGHT;
                    const heightPx = Math.max(((endMin - startMin) / 60) * HOUR_HEIGHT, 44);

                    // Gestione leggera sovrapposizione oraria nello stesso giorno
                    const overlapping = dayAppointments.filter(
                      (other) =>
                        other.id !== apt.id &&
                        timeToMinutes(other.startTime) < timeToMinutes(apt.endTime) &&
                        timeToMinutes(other.endTime) > timeToMinutes(apt.startTime)
                    );
                    const hasOverlap = overlapping.length > 0;
                    const widthStyle = hasOverlap ? '48%' : 'calc(100% - 8px)';
                    const leftStyle = hasOverlap && idx % 2 === 1 ? '50%' : '4px';

                    return (
                      <div
                        key={apt.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectAppointment(apt);
                        }}
                        style={{
                          top: `${topPx}px`,
                          height: `${heightPx}px`,
                          width: widthStyle,
                          left: leftStyle,
                          backgroundColor: artist.bgSoft,
                          borderColor: artist.border,
                          borderLeftWidth: '4px',
                          borderLeftColor: artist.color,
                        }}
                        className="absolute z-10 rounded-xl border p-2 cursor-pointer transition-all hover:shadow-md hover:scale-[1.01] flex flex-col justify-between overflow-hidden"
                      >
                        <div>
                          <div className="flex items-start justify-between gap-1">
                            <p
                              className="text-xs font-bold leading-tight truncate"
                              style={{ color: artist.text }}
                            >
                              {apt.clientName}
                            </p>

                            {/* Pill Prezzo o Da Definire */}
                            <span
                              className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md shrink-0 ${
                                apt.price
                                  ? 'bg-white/90 text-[#1D1D1F]'
                                  : 'bg-[#FF9500]/20 text-[#995700]'
                              }`}
                            >
                              {apt.price ? `€${apt.price}` : '€ ?'}
                            </span>
                          </div>

                          <p className="text-[11px] text-[#1D1D1F]/80 font-medium truncate mt-0.5">
                            {apt.title}
                          </p>
                        </div>

                        <div className="flex items-center justify-between text-[10px] mt-1">
                          <span className="font-semibold text-[#6E6E73] flex items-center gap-1">
                            <Clock className="w-2.5 h-2.5" />
                            {apt.startTime} - {apt.endTime}
                          </span>

                          {/* Badge Stato Chiusura / % Studio */}
                          {apt.status === 'completed' && apt.studioFeeStatus === 'settled' && (
                            <span className="px-1.5 py-0.5 rounded bg-[#34C759] text-white font-bold text-[9px]">
                              ✓ Saldato
                            </span>
                          )}
                          {apt.status === 'completed' && apt.studioFeeStatus === 'pending_fee' && (
                            <span className="px-1.5 py-0.5 rounded bg-[#FF9500] text-white font-bold text-[9px] flex items-center gap-0.5">
                              <AlertCircle className="w-2.5 h-2.5" /> % Sospesa
                            </span>
                          )}
                          {apt.status === 'scheduled' && (
                            <span className="px-1.5 py-0.5 rounded bg-white/80 text-[#6E6E73] font-semibold text-[9px]">
                              {apt.studio === 'ROMA' ? 'RM' : 'MI'}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}