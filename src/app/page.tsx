'use client';

import React, { useState, useEffect } from 'react';
import TopBar from '@/components/TopBar';
import GoogleCalendarView from '@/components/GoogleCalendarView';
import AccountingReportsView from '@/components/AccountingReportsView';
import CheckoutSheetModal from '@/components/CheckoutSheetModal';
import NewAppointmentModal from '@/components/NewAppointmentModal';
import LoginScreen from '@/components/LoginScreen';
import { ARTISTS, INITIAL_APPOINTMENTS } from '@/lib/mock-data';
import { Appointment, AuthSession, PaymentMethod, StudioFeeStatus, StudioId } from '@/types';
import { Bell, X } from 'lucide-react';

export default function CaravaggioAppPage() {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [activeTab, setActiveTab] = useState<'calendar' | 'reports'>('calendar');
  const [studioFilter, setStudioFilter] = useState<StudioId>('ALL');

  const [appointments, setAppointments] = useState<Appointment[]>(INITIAL_APPOINTMENTS);
  const [selectedArtists, setSelectedArtists] = useState<string[]>(
    ARTISTS.map((a) => a.id)
  );

  const [checkoutApt, setCheckoutApt] = useState<Appointment | null>(null);
  const [pushBannerApt, setPushBannerApt] = useState<Appointment | null>(null);

  // Stato per il Modal di Nuovo Appuntamento
  const [newAptModal, setNewAptModal] = useState<{
    isOpen: boolean;
    dayOffset: number;
    startTime: string;
  }>({
    isOpen: false,
    dayOffset: 2,
    startTime: '15:00',
  });

  useEffect(() => {
    const saved = localStorage.getItem('caravaggio_demo_appts_v1');
    if (saved) {
      try {
        setAppointments(JSON.parse(saved));
      } catch {}
    }
  }, []);

  const updateAppointments = (next: Appointment[]) => {
    setAppointments(next);
    localStorage.setItem('caravaggio_demo_appts_v1', JSON.stringify(next));
  };

  const handleLogin = (newSession: AuthSession) => {
    setSession(newSession);
    setActiveTab('calendar');
    if (newSession.role === 'artist' && newSession.artistId) {
      setSelectedArtists([newSession.artistId]);
      setStudioFilter(newSession.studio);
    } else {
      setSelectedArtists(ARTISTS.map((a) => a.id));
      setStudioFilter('ALL');
    }
  };

  const handleLogout = () => {
    setSession(null);
    setPushBannerApt(null);
    setCheckoutApt(null);
  };

  if (!session) {
    return <LoginScreen artists={ARTISTS} onLogin={handleLogin} />;
  }

  const roleMode = session.role;
  const activeArtistId = session.role === 'artist' ? session.artistId : 'art-ruby';

  const toggleArtist = (id: string) => {
    if (roleMode === 'artist') return;
    setSelectedArtists((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const pendingTodayAppts = appointments.filter(
    (a) =>
      a.dayOffset === 2 &&
      a.status === 'scheduled' &&
      (roleMode === 'admin' || a.artistId === activeArtistId)
  );

  const handleTriggerEveningPush = () => {
    const target =
      pendingTodayAppts[0] ||
      appointments.find((a) => roleMode === 'admin' || a.artistId === activeArtistId) ||
      appointments[0];
    setPushBannerApt(target);
  };

  const handleConfirmCheckout = (
    aptId: string,
    outcome: 'completed' | 'cancelled',
    finalPrice: number | null,
    paymentMethod: PaymentMethod,
    studioFeeStatus: StudioFeeStatus
  ) => {
    const updated = appointments.map((apt) =>
      apt.id === aptId
        ? {
            ...apt,
            status: outcome,
            price: outcome === 'completed' ? finalPrice : apt.price,
            paymentMethod,
            studioFeeStatus,
          }
        : apt
    );
    updateAppointments(updated);
    setCheckoutApt(null);
    setPushBannerApt(null);
  };

  const handleSettlePendingFee = (aptId: string) => {
    const updated = appointments.map((apt) =>
      apt.id === aptId ? { ...apt, studioFeeStatus: 'settled' as const } : apt
    );
    updateAppointments(updated);
  };

  const handleOpenNewModal = (dayOffset = 2, startTime = '15:00') => {
    setNewAptModal({ isOpen: true, dayOffset, startTime });
  };

  const handleSaveNewAppointment = (newApt: Appointment) => {
    updateAppointments([...appointments, newApt]);
  };

  return (
    <div className="min-h-screen bg-[#F5F5F7] text-[#1D1D1F] font-sans antialiased">
      {/* Banner Notifica Push iOS Interattivo */}
      {pushBannerApt && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[94%] max-w-md bg-[#1D1D1F]/95 backdrop-blur-xl text-white rounded-3xl p-4 shadow-2xl border border-white/15 flex items-center justify-between gap-3 animate-in fade-in slide-in-from-top duration-200">
          <div
            onClick={() => {
              setCheckoutApt(pushBannerApt);
              setPushBannerApt(null);
            }}
            className="flex items-center gap-3 cursor-pointer flex-1"
          >
            <div className="w-10 h-10 rounded-2xl bg-[#007AFF] flex items-center justify-center shrink-0">
              <Bell className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#007AFF]">
                  Notifica 19:30 • Caravaggio&apos;s
                </span>
                <span className="text-[10px] text-white/60">ora</span>
              </div>
              <p className="text-xs font-bold mt-0.5">
                Hai tatuato {pushBannerApt.clientName} oggi?
              </p>
              <p className="text-[11px] text-white/75">
                {pushBannerApt.price
                  ? `Importo a calendario €${pushBannerApt.price}. Tocca per chiudere.`
                  : `Importo mancante a calendario. Tocca per inserire prezzo e % studio.`}
              </p>
            </div>
          </div>
          <button
            onClick={() => setPushBannerApt(null)}
            className="p-1.5 rounded-full hover:bg-white/10 text-white/60"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <TopBar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        studioFilter={studioFilter}
        setStudioFilter={setStudioFilter}
        roleMode={roleMode}
        activeArtistId={activeArtistId}
        artists={ARTISTS}
        pendingCount={pendingTodayAppts.length}
        onTriggerPush={handleTriggerEveningPush}
        onNewAppointment={() => handleOpenNewModal(2, '15:00')}
        onLogout={handleLogout}
      />

      {activeTab === 'calendar' || roleMode === 'artist' ? (
        <GoogleCalendarView
          appointments={appointments}
          artists={ARTISTS}
          selectedArtists={selectedArtists}
          toggleArtist={toggleArtist}
          studioFilter={studioFilter}
          onSelectAppointment={(apt) => setCheckoutApt(apt)}
          onEmptySlotClick={(dayOffset, timeStr) => handleOpenNewModal(dayOffset, timeStr)}
        />
      ) : (
        <AccountingReportsView
          appointments={appointments}
          artists={ARTISTS}
          studioFilter={studioFilter}
          onSettlePendingFee={handleSettlePendingFee}
          onOpenAppointment={(apt) => setCheckoutApt(apt)}
        />
      )}

      <CheckoutSheetModal
        appointment={checkoutApt}
        artist={ARTISTS.find((a) => a.id === checkoutApt?.artistId)}
        onClose={() => setCheckoutApt(null)}
        onConfirmCheckout={handleConfirmCheckout}
      />

      <NewAppointmentModal
        isOpen={newAptModal.isOpen}
        onClose={() => setNewAptModal((prev) => ({ ...prev, isOpen: false }))}
        onSave={handleSaveNewAppointment}
        artists={ARTISTS}
        defaultDayOffset={newAptModal.dayOffset}
        defaultStartTime={newAptModal.startTime}
        roleMode={roleMode}
        activeArtistId={activeArtistId}
      />
    </div>
  );
}