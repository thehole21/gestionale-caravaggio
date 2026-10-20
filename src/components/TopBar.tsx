'use client';

import React from 'react';
import { Calendar, BarChart3, Bell, Plus, LogOut } from 'lucide-react';
import { Artist, StudioId } from '@/types';

interface TopBarProps {
  activeTab: 'calendar' | 'reports';
  setActiveTab: (tab: 'calendar' | 'reports') => void;
  studioFilter: StudioId;
  setStudioFilter: (studio: StudioId) => void;
  roleMode: 'admin' | 'artist';
  activeArtistId: string;
  artists: Artist[];
  pendingCount: number;
  onTriggerPush: () => void;
  onNewAppointment: () => void;
  onLogout: () => void;
}

export default function TopBar({
  activeTab,
  setActiveTab,
  studioFilter,
  setStudioFilter,
  roleMode,
  activeArtistId,
  artists,
  pendingCount,
  onTriggerPush,
  onNewAppointment,
  onLogout,
}: TopBarProps) {
  const loggedArtist = artists.find((a) => a.id === activeArtistId);

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-xl border-b border-[#E5E5EA] px-3 sm:px-6 h-16 flex items-center justify-between gap-2">
      {/* Sinistra: Identità + Switch Calendario / Report */}
      <div className="flex items-center gap-2.5 sm:gap-4 min-w-0">
        <div className="w-9 h-9 rounded-xl bg-[#1D1D1F] text-white flex items-center justify-center font-bold text-sm tracking-tight shadow-sm shrink-0">
          C
        </div>
        <div className="hidden md:block truncate">
          <h1 className="text-sm font-bold tracking-tight text-[#1D1D1F] leading-none">
            Caravaggio&apos;s Atelier
          </h1>
          <p className="text-[11px] text-[#86868B] font-medium mt-0.5 truncate">
            {roleMode === 'admin'
              ? 'Direzione • Roma & Milano'
              : `${loggedArtist?.name} • Sede ${loggedArtist?.studio}`}
          </p>
        </div>

        {/* Segmented Control (Visibile sia a Direzione che a Tatuatore) */}
        <div className="bg-[#F2F2F7] p-1 rounded-xl flex items-center shrink-0">
          <button
            onClick={() => setActiveTab('calendar')}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'calendar'
                ? 'bg-white text-[#1D1D1F] shadow-sm'
                : 'text-[#6E6E73] hover:text-[#1D1D1F]'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Agenda</span>
          </button>

          <button
            onClick={() => setActiveTab('reports')}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'reports'
                ? 'bg-white text-[#1D1D1F] shadow-sm'
                : 'text-[#6E6E73] hover:text-[#1D1D1F]'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>{roleMode === 'admin' ? 'Contabilità' : 'I Miei Guadagni'}</span>
          </button>
        </div>
      </div>

      {/* Destra: Filtro Sede (Solo Direzione) + Push + Nuovo + Esci */}
      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
        {roleMode === 'admin' && (
          <div className="hidden lg:flex bg-[#F2F2F7] p-1 rounded-xl text-xs font-medium">
            {(['ALL', 'ROMA', 'MILANO'] as StudioId[]).map((st) => (
              <button
                key={st}
                onClick={() => setStudioFilter(st)}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  studioFilter === st
                    ? 'bg-white text-[#1D1D1F] font-bold shadow-sm'
                    : 'text-[#6E6E73]'
                }`}
              >
                {st === 'ALL' ? 'Tutte' : st === 'ROMA' ? 'Roma' : 'Milano'}
              </button>
            ))}
          </div>
        )}

        <button
          onClick={onTriggerPush}
          title="Simula Notifica Fine Giornata"
          className="relative flex items-center gap-1.5 px-2.5 sm:px-3 py-2 rounded-xl bg-[#007AFF]/10 hover:bg-[#007AFF]/15 text-[#007AFF] text-xs font-bold transition-all active:scale-95"
        >
          <Bell className="w-4 h-4" />
          <span className="hidden xl:inline">Popup Serale</span>
          {pendingCount > 0 && (
            <span className="w-4 h-4 rounded-full bg-[#FF3B30] text-white text-[10px] font-bold flex items-center justify-center">
              {pendingCount}
            </span>
          )}
        </button>

        <button
          onClick={onNewAppointment}
          className="flex items-center gap-1 px-3 py-2 rounded-xl bg-[#1D1D1F] hover:bg-black text-white text-xs font-bold shadow-sm transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Nuovo</span>
        </button>

        <button
          onClick={onLogout}
          title="Esci"
          className="p-2 rounded-xl bg-[#F2F2F7] hover:bg-[#E5E5EA] text-[#6E6E73] hover:text-[#1D1D1F] transition-all"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}