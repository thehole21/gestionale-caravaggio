'use client';

import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, Ban, Banknote, CreditCard, Building2, Clock } from 'lucide-react';
import { Appointment, Artist, PaymentMethod, StudioFeeStatus } from '@/types';

interface CheckoutSheetModalProps {
  appointment: Appointment | null;
  artist: Artist | undefined;
  onClose: () => void;
  onConfirmCheckout: (
    aptId: string,
    outcome: 'completed' | 'cancelled',
    finalPrice: number | null,
    paymentMethod: PaymentMethod,
    studioFeeStatus: StudioFeeStatus
  ) => void;
}

export default function CheckoutSheetModal({
  appointment,
  artist,
  onClose,
  onConfirmCheckout,
}: CheckoutSheetModalProps) {
  const [outcome, setOutcome] = useState<'completed' | 'cancelled'>('completed');
  const [priceInput, setPriceInput] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [feeGivenNow, setFeeGivenNow] = useState<boolean>(true);

  useEffect(() => {
    if (appointment) {
      setOutcome(appointment.status === 'cancelled' ? 'cancelled' : 'completed');
      setPriceInput(appointment.price ? String(appointment.price) : '');
      setPaymentMethod(appointment.paymentMethod || 'cash');
      setFeeGivenNow(appointment.studioFeeStatus !== 'pending_fee');
    }
  }, [appointment]);

  if (!appointment || !artist) return null;

  const numericPrice = parseFloat(priceInput) || 0;
  const studioFeeAmount = Math.round((numericPrice * artist.splitPct) / 100);
  const artistNetAmount = numericPrice - studioFeeAmount;

  const handleSave = () => {
    if (outcome === 'cancelled') {
      onConfirmCheckout(appointment.id, 'cancelled', null, null, 'unsettled');
      return;
    }
    if (numericPrice <= 0) return;

    onConfirmCheckout(
      appointment.id,
      'completed',
      numericPrice,
      paymentMethod,
      feeGivenNow ? 'settled' : 'pending_fee'
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl shadow-2xl border border-[#E5E5EA] overflow-hidden animate-in slide-in-from-bottom duration-200">
        {/* Header Apple Sheet */}
        <div className="px-6 pt-5 pb-4 border-b border-[#F2F2F7] flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#007AFF]">
              Check-out Fine Giornata • {appointment.studio}
            </span>
            <h3 className="text-lg font-bold text-[#1D1D1F] mt-0.5">
              Hai tatuato {appointment.clientName} oggi?
            </h3>
            <p className="text-xs text-[#86868B]">
              {appointment.title} ({appointment.startTime} - {appointment.endTime})
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#F2F2F7] flex items-center justify-center text-[#6E6E73] hover:text-[#1D1D1F]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Step 1: L'ho fatto / L'ho cancellato */}
          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => setOutcome('completed')}
              className={`py-3 px-4 rounded-2xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                outcome === 'completed'
                  ? 'bg-[#1D1D1F] text-white border-[#1D1D1F] shadow-sm'
                  : 'bg-[#F5F5F7] text-[#6E6E73] border-transparent'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Sì, l&apos;ho fatto</span>
            </button>

            <button
              type="button"
              onClick={() => setOutcome('cancelled')}
              className={`py-3 px-4 rounded-2xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                outcome === 'cancelled'
                  ? 'bg-[#FF3B30] text-white border-[#FF3B30] shadow-sm'
                  : 'bg-[#F5F5F7] text-[#6E6E73] border-transparent'
              }`}
            >
              <Ban className="w-4 h-4" />
              <span>Annullato / No-Show</span>
            </button>
          </div>

          {outcome === 'completed' && (
            <>
              {/* Step 2: Importo (Se manca a calendario lo evidenzia) */}
              <div className="bg-[#F5F5F7] p-4 rounded-2xl">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-[#1D1D1F]">
                    {appointment.price === null
                      ? '⚠️ Importo non inserito a calendario: quanto ha pagato?'
                      : 'Importo Incassato (€)'}
                  </label>
                  <span className="text-[11px] text-[#86868B]">
                    Studio {artist.splitPct}%
                  </span>
                </div>

                <div className="relative flex items-center">
                  <span className="text-2xl font-bold text-[#1D1D1F] mr-2">€</span>
                  <input
                    type="number"
                    value={priceInput}
                    onChange={(e) => setPriceInput(e.target.value)}
                    placeholder="Es. 500"
                    className="w-full bg-white rounded-xl px-3.5 py-2.5 text-xl font-bold text-[#1D1D1F] border border-[#E5E5EA] focus:outline-none focus:border-[#007AFF]"
                  />
                </div>

                {/* Preset rapidi se non c'era il prezzo */}
                {appointment.price === null && (
                  <div className="flex gap-1.5 mt-2.5">
                    {[150, 250, 350, 500, 700].map((val) => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => setPriceInput(String(val))}
                        className="flex-1 py-1 rounded-lg bg-white border border-[#E5E5EA] text-xs font-semibold text-[#1D1D1F] hover:border-[#007AFF]"
                      >
                        €{val}
                      </button>
                    ))}
                  </div>
                )}

                {/* Split Automatico Tatuatore / Studio */}
                {numericPrice > 0 && (
                  <div className="mt-3 pt-3 border-t border-[#E5E5EA] flex items-center justify-between text-xs">
                    <span className="text-[#6E6E73]">
                      Al Tatuatore:{' '}
                      <strong className="text-[#1D1D1F]">€ {artistNetAmount}</strong>
                    </span>
                    <span className="text-[#6E6E73]">
                      Quota Studio ({artist.splitPct}%):{' '}
                      <strong className="text-[#007AFF]">€ {studioFeeAmount}</strong>
                    </span>
                  </div>
                )}
              </div>

              {/* Step 3: Come ha pagato? */}
              <div>
                <label className="block text-xs font-bold text-[#1D1D1F] mb-2">
                  Come ha pagato {appointment.clientName}?
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'cash', label: 'Contanti', icon: Banknote },
                    { id: 'pos', label: 'POS / Carta', icon: CreditCard },
                    { id: 'transfer', label: 'Bonifico', icon: Building2 },
                  ].map((item) => {
                    const Icon = item.icon;
                    const active = paymentMethod === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setPaymentMethod(item.id as PaymentMethod)}
                        className={`py-2.5 px-3 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1 transition-all ${
                          active
                            ? 'bg-[#007AFF]/10 border-[#007AFF] text-[#007AFF]'
                            : 'bg-white border-[#E5E5EA] text-[#6E6E73]'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 4: Hai già dato la % allo studio? */}
              <div>
                <label className="block text-xs font-bold text-[#1D1D1F] mb-2">
                  Hai già lasciato la % allo studio (€ {studioFeeAmount})?
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setFeeGivenNow(true)}
                    className={`p-3 rounded-2xl border text-left transition-all ${
                      feeGivenNow
                        ? 'bg-[#34C759]/10 border-[#34C759] text-[#1B6E30]'
                        : 'bg-white border-[#E5E5EA] text-[#6E6E73]'
                    }`}
                  >
                    <p className="text-xs font-bold">✓ Sì, già versata</p>
                    <p className="text-[10px] opacity-80 mt-0.5">
                      Appuntamento chiuso e saldato
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFeeGivenNow(false)}
                    className={`p-3 rounded-2xl border text-left transition-all ${
                      !feeGivenNow
                        ? 'bg-[#FF9500]/15 border-[#FF9500] text-[#995700]'
                        : 'bg-white border-[#E5E5EA] text-[#6E6E73]'
                    }`}
                  >
                    <p className="text-xs font-bold flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> No, lascia in sospeso
                    </p>
                    <p className="text-[10px] opacity-80 mt-0.5">
                      Chiuso ma % studio da dare
                    </p>
                  </button>
                </div>
              </div>
            </>
          )}

          {/* Pulsante Conferma */}
          <button
            type="button"
            onClick={handleSave}
            disabled={outcome === 'completed' && numericPrice <= 0}
            className="w-full py-3.5 rounded-2xl bg-[#007AFF] hover:bg-[#0066D6] disabled:opacity-40 text-white font-bold text-sm shadow-sm transition-all"
          >
            {outcome === 'cancelled'
              ? 'Registra Annullamento'
              : feeGivenNow
              ? `Chiudi e Salda (€ ${numericPrice || 0})`
              : `Chiudi • Lascia € ${studioFeeAmount} in Sospeso`}
          </button>
        </div>
      </div>
    </div>
  );
}