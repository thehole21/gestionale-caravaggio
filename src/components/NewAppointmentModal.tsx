'use client';

import React, { useState, useEffect } from 'react';
import { X, Clock, User, Phone, Sparkles, Euro, Calendar as CalendarIcon, FileText } from 'lucide-react';
import { Appointment, Artist } from '@/types';

interface NewAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (newApt: Appointment) => void;
  artists: Artist[];
  defaultDate: string;
  defaultStartTime: string;
  roleMode: 'admin' | 'artist';
  activeArtistId: string;
}

export default function NewAppointmentModal({
  isOpen,
  onClose,
  onSave,
  artists,
  defaultDate,
  defaultStartTime,
  roleMode,
  activeArtistId,
}: NewAppointmentModalProps) {
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [title, setTitle] = useState('');
  const [artistId, setArtistId] = useState(activeArtistId || artists[0]?.id || 'art-1');
  const [date, setDate] = useState(defaultDate);
  const [startTime, setStartTime] = useState(defaultStartTime);
  const [endTime, setEndTime] = useState('17:00');
  const [priceMode, setPriceMode] = useState<'fixed' | 'tbd'>('fixed');
  const [priceInput, setPriceInput] = useState('500');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (isOpen) {
      setClientName('');
      setClientPhone('');
      setTitle('');
      setNotes('');
      setDate(defaultDate);
      setStartTime(defaultStartTime);

      // Calcola automaticamente +2 ore come fine di default
      const [hh, mm] = defaultStartTime.split(':').map(Number);
      const endHh = Math.min((hh || 14) + 2, 20);
      setEndTime(`${String(endHh).padStart(2, '0')}:${String(mm || 0).padStart(2, '0')}`);

      if (roleMode === 'artist') {
        setArtistId(activeArtistId);
      }
    }
  }, [isOpen, defaultDate, defaultStartTime, roleMode, activeArtistId]);

  if (!isOpen) return null;

  const selectedArtist = artists.find((a) => a.id === artistId) || artists[0];
  const numericPrice = priceMode === 'fixed' ? parseFloat(priceInput) || 0 : null;
  const studioShare =
    numericPrice && selectedArtist
      ? Math.round((numericPrice * selectedArtist.splitPct) / 100)
      : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim()) return;

    const newApt: Appointment = {
      id: `apt-${Date.now()}`,
      clientName: clientName.trim(),
      clientPhone: clientPhone.trim() || '+39 333 000 0000',
      title: title.trim() || 'Sessione Tattoo',
      artistId: selectedArtist.id,
      studio: selectedArtist.studio,
      date,
      startTime,
      endTime,
      price: numericPrice && numericPrice > 0 ? numericPrice : null,
      status: 'scheduled',
      paymentMethod: null,
      studioFeeStatus: 'unsettled',
      notes: notes.trim() || undefined,
    };

    onSave(newApt);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl shadow-2xl border border-[#E5E5EA] overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Header Stile Apple Calendar */}
        <div className="px-6 pt-5 pb-4 border-b border-[#F2F2F7] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span
              className="w-3.5 h-3.5 rounded-full shrink-0"
              style={{ backgroundColor: selectedArtist?.color || '#007AFF' }}
            />
            <div>
              <h3 className="text-base font-bold text-[#1D1D1F] leading-none">
                Nuovo Appuntamento in Agenda
              </h3>
              <p className="text-[11px] text-[#86868B] mt-1">
                Orario libero senza blocchi • Sincronizzato con Contabilità {selectedArtist?.studio}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#F2F2F7] flex items-center justify-center text-[#6E6E73] hover:text-[#1D1D1F]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[82vh] overflow-y-auto">
          {/* Cliente + Telefono */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#86868B] mb-1.5">
                Nome Cliente *
              </label>
              <div className="relative flex items-center">
                <User className="w-4 h-4 text-[#86868B] absolute left-3.5" />
                <input
                  type="text"
                  required
                  autoFocus
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="Es. Mario Rossi"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-[#F5F5F7] border border-transparent focus:bg-white focus:border-[#007AFF] text-xs font-semibold text-[#1D1D1F] focus:outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#86868B] mb-1.5">
                Telefono WhatsApp
              </label>
              <div className="relative flex items-center">
                <Phone className="w-4 h-4 text-[#86868B] absolute left-3.5" />
                <input
                  type="text"
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  placeholder="+39 348..."
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-[#F5F5F7] border border-transparent focus:bg-white focus:border-[#007AFF] text-xs font-semibold text-[#1D1D1F] focus:outline-none transition-all"
                />
              </div>
            </div>
          </div>

          {/* Progetto / Soggetto Tatuaggio */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#86868B] mb-1.5">
              Soggetto / Zona Corpo
            </label>
            <div className="relative flex items-center">
              <Sparkles className="w-4 h-4 text-[#86868B] absolute left-3.5" />
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Es. Avambraccio Chiaroscuro / Fine Line Costato"
                className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-[#F5F5F7] border border-transparent focus:bg-white focus:border-[#007AFF] text-xs font-semibold text-[#1D1D1F] focus:outline-none transition-all"
              />
            </div>
          </div>

          {/* Scelta Tatuatore (Se Admin può assegnarlo a chiunque, se Tatuatore è fisso su di sé) */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#86868B] mb-1.5">
              Tatuatore & Sede
            </label>
            <select
              disabled={roleMode === 'artist'}
              value={artistId}
              onChange={(e) => setArtistId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#F5F5F7] border border-transparent focus:bg-white focus:border-[#007AFF] text-xs font-bold text-[#1D1D1F] focus:outline-none disabled:opacity-70"
            >
              {artists.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name} — Sede {a.studio} (Quota Studio {a.splitPct}%)
                </option>
              ))}
            </select>
          </div>

          {/* Giorno + Orario Inizio e Fine Liberi al Minuto */}
          <div className="grid grid-cols-3 gap-2.5 bg-[#F5F5F7] p-3.5 rounded-2xl">
            <div>
              <label className="block text-[10px] font-bold uppercase text-[#86868B] mb-1 flex items-center gap-1">
                <CalendarIcon className="w-3 h-3" /> Giorno
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-white rounded-xl px-2.5 py-2 text-xs font-bold text-[#1D1D1F] border border-[#E5E5EA] focus:outline-none focus:border-[#007AFF]"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase text-[#86868B] mb-1 flex items-center gap-1">
                <Clock className="w-3 h-3" /> Inizio (Libero)
              </label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full bg-white rounded-xl px-2.5 py-2 text-xs font-bold text-[#1D1D1F] border border-[#E5E5EA] focus:outline-none focus:border-[#007AFF]"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase text-[#86868B] mb-1 flex items-center gap-1">
                <Clock className="w-3 h-3" /> Fine (Libera)
              </label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full bg-white rounded-xl px-2.5 py-2 text-xs font-bold text-[#1D1D1F] border border-[#E5E5EA] focus:outline-none focus:border-[#007AFF]"
              />
            </div>
          </div>

          {/* Prezzo Concordato vs Da definire a fine giornata */}
          <div className="bg-[#F5F5F7] p-4 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#1D1D1F] flex items-center gap-1.5">
                <Euro className="w-3.5 h-3.5 text-[#007AFF]" />
                Prezzo Seduta
              </span>

              <div className="flex bg-white p-0.5 rounded-xl border border-[#E5E5EA] text-[11px] font-semibold">
                <button
                  type="button"
                  onClick={() => setPriceMode('fixed')}
                  className={`px-2.5 py-1 rounded-lg transition-all ${
                    priceMode === 'fixed'
                      ? 'bg-[#1D1D1F] text-white font-bold'
                      : 'text-[#6E6E73]'
                  }`}
                >
                  Prezzo Fisso
                </button>
                <button
                  type="button"
                  onClick={() => setPriceMode('tbd')}
                  className={`px-2.5 py-1 rounded-lg transition-all ${
                    priceMode === 'tbd'
                      ? 'bg-[#FF9500] text-white font-bold'
                      : 'text-[#6E6E73]'
                  }`}
                >
                  Da definire a fine seduta
                </button>
              </div>
            </div>

            {priceMode === 'fixed' ? (
              <div>
                <div className="relative flex items-center">
                  <span className="text-lg font-bold text-[#1D1D1F] mr-2">€</span>
                  <input
                    type="number"
                    value={priceInput}
                    onChange={(e) => setPriceInput(e.target.value)}
                    placeholder="500"
                    className="w-full bg-white rounded-xl px-3.5 py-2 text-base font-bold text-[#1D1D1F] border border-[#E5E5EA] focus:outline-none focus:border-[#007AFF]"
                  />
                </div>
                {numericPrice && numericPrice > 0 ? (
                  <div className="flex items-center justify-between text-[11px] text-[#6E6E73] mt-2 px-1">
                    <span>
                      Al Tatuatore: <strong>€ {numericPrice - studioShare}</strong>
                    </span>
                    <span>
                      Quota Studio ({selectedArtist?.splitPct}%):{' '}
                      <strong className="text-[#007AFF]">€ {studioShare}</strong>
                    </span>
                  </div>
                ) : null}
              </div>
            ) : (
              <p className="text-[11px] text-[#995700] bg-[#FFF5E5] border border-[#FFD699] rounded-xl p-2.5 font-medium">
                Il calendario mostrerà <strong>&quot;€ ?&quot;</strong>. Alle 19:30 la notifica push chiederà automaticamente a {selectedArtist?.name} quanto ha pagato il cliente.
              </p>
            )}
          </div>

          {/* Note opzionali */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#86868B] mb-1.5">
              Note o Acconto (Opzionale)
            </label>
            <div className="relative flex items-center">
              <FileText className="w-4 h-4 text-[#86868B] absolute left-3.5" />
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Es. Acconto €100 già lasciato in studio"
                className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-[#F5F5F7] text-xs font-medium text-[#1D1D1F] focus:bg-white focus:border focus:border-[#007AFF] focus:outline-none"
              />
            </div>
          </div>

          {/* Pulsanti Azione */}
          <div className="pt-2 flex items-center gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-2xl bg-[#F2F2F7] hover:bg-[#E5E5EA] text-xs font-bold text-[#1D1D1F] transition-all"
            >
              Annulla
            </button>
            <button
              type="submit"
              className="flex-[2] py-3 rounded-2xl bg-[#007AFF] hover:bg-[#0066D6] text-xs font-bold text-white shadow-sm transition-all"
            >
              Salva in Calendario
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}