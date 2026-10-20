'use client';

import React from 'react';
import { CheckCircle2, AlertCircle, TrendingUp, Users, Ban, Wallet } from 'lucide-react';
import { Appointment, Artist, StudioId } from '@/types';

interface AccountingReportsViewProps {
  appointments: Appointment[];
  artists: Artist[];
  studioFilter: StudioId;
  onSettlePendingFee: (aptId: string) => void;
  onOpenAppointment: (apt: Appointment) => void;
}

export default function AccountingReportsView({
  appointments,
  artists,
  studioFilter,
  onSettlePendingFee,
  onOpenAppointment,
}: AccountingReportsViewProps) {
  const filteredAppts = appointments.filter(
    (a) => studioFilter === 'ALL' || a.studio === studioFilter
  );

  const completedAppts = filteredAppts.filter((a) => a.status === 'completed');
  const cancelledAppts = filteredAppts.filter((a) => a.status === 'cancelled');

  const totalGross = completedAppts.reduce((sum, a) => sum + (a.price || 0), 0);

  const totalStudioSettled = completedAppts
    .filter((a) => a.studioFeeStatus === 'settled')
    .reduce((sum, a) => {
      const art = artists.find((ar) => ar.id === a.artistId);
      return sum + Math.round(((a.price || 0) * (art?.splitPct || 30)) / 100);
    }, 0);

  const pendingFeeAppointments = completedAppts.filter(
    (a) => a.studioFeeStatus === 'pending_fee'
  );

  const totalStudioPending = pendingFeeAppointments.reduce((sum, a) => {
    const art = artists.find((ar) => ar.id === a.artistId);
    return sum + Math.round(((a.price || 0) * (art?.splitPct || 30)) / 100);
  }, 0);

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* 4 KPI Cards stile Apple Health / Stripe */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[#E5E5EA] shadow-xs">
          <div className="flex items-center justify-between text-[#86868B] text-xs font-semibold">
            <span>Volume Lordo Tatuato</span>
            <TrendingUp className="w-4 h-4 text-[#007AFF]" />
          </div>
          <p className="text-2xl font-bold text-[#1D1D1F] mt-2">
            € {totalGross.toLocaleString('it-IT')}
          </p>
          <p className="text-[11px] text-[#86868B] mt-1">
            Su {completedAppts.length} appuntamenti chiusi
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E5E5EA] shadow-xs">
          <div className="flex items-center justify-between text-[#86868B] text-xs font-semibold">
            <span>Quota Studio Incassata</span>
            <Wallet className="w-4 h-4 text-[#34C759]" />
          </div>
          <p className="text-2xl font-bold text-[#34C759] mt-2">
            € {totalStudioSettled.toLocaleString('it-IT')}
          </p>
          <p className="text-[11px] text-[#86868B] mt-1">Già versata in cassa/POS</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#FFD699] bg-[#FFFDF9] shadow-xs">
          <div className="flex items-center justify-between text-[#995700] text-xs font-semibold">
            <span>% Studio in Sospeso</span>
            <AlertCircle className="w-4 h-4 text-[#FF9500]" />
          </div>
          <p className="text-2xl font-bold text-[#FF9500] mt-2">
            € {totalStudioPending.toLocaleString('it-IT')}
          </p>
          <p className="text-[11px] text-[#995700] mt-1">
            {pendingFeeAppointments.length} appuntamenti chiusi da saldare
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E5E5EA] shadow-xs">
          <div className="flex items-center justify-between text-[#86868B] text-xs font-semibold">
            <span>Appuntamenti Annullati</span>
            <Ban className="w-4 h-4 text-[#FF3B30]" />
          </div>
          <p className="text-2xl font-bold text-[#1D1D1F] mt-2">{cancelledAppts.length}</p>
          <p className="text-[11px] text-[#86868B] mt-1">Tracciati dai tatuatori</p>
        </div>
      </div>

      {/* Box Sospesi Rapidi da Saldare */}
      {pendingFeeAppointments.length > 0 && (
        <div className="bg-white rounded-2xl border border-[#FFD699] p-5">
          <h3 className="text-sm font-bold text-[#1D1D1F] flex items-center gap-2 mb-3">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FF9500]" />
            Quote Studio in Sospeso (Appuntamenti chiusi ma % non ancora versata)
          </h3>
          <div className="divide-y divide-[#F2F2F7]">
            {pendingFeeAppointments.map((apt) => {
              const art = artists.find((a) => a.id === apt.artistId);
              const fee = Math.round(((apt.price || 0) * (art?.splitPct || 30)) / 100);
              return (
                <div
                  key={apt.id}
                  className="py-3 flex flex-wrap items-center justify-between gap-3"
                >
                  <div>
                    <p className="text-xs font-bold text-[#1D1D1F]">
                      {art?.name} • Cliente: {apt.clientName} ({apt.studio})
                    </p>
                    <p className="text-[11px] text-[#86868B]">
                      Incasso cliente: € {apt.price} ({apt.paymentMethod?.toUpperCase()}) •
                      Quota studio {art?.splitPct}%:{' '}
                      <strong className="text-[#FF9500]">€ {fee}</strong>
                    </p>
                  </div>
                  <button
                    onClick={() => onSettlePendingFee(apt.id)}
                    className="px-3.5 py-1.5 rounded-xl bg-[#34C759] hover:bg-[#2DB14E] text-white text-xs font-bold flex items-center gap-1.5 transition-all"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Segna % Studio Saldata (€ {fee})
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tabella Report Mensile per Tatuatore */}
      <div className="bg-white rounded-2xl border border-[#E5E5EA] overflow-hidden">
        <div className="px-6 py-4 border-b border-[#F2F2F7] flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-[#1D1D1F]">
              Report Mensile Performance Tatuatori
            </h3>
            <p className="text-xs text-[#86868B]">
              Clienti portati, fatturato generato, annullamenti e stato quote studio
            </p>
          </div>
          <Users className="w-4 h-4 text-[#86868B]" />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#F2F2F7] text-[11px] font-bold uppercase text-[#86868B] bg-[#FBFBFD]">
                <th className="py-3 px-6">Tatuatore</th>
                <th className="py-3 px-4">Sede</th>
                <th className="py-3 px-4 text-center">Clienti Fatti</th>
                <th className="py-3 px-4 text-center">Annullati</th>
                <th className="py-3 px-4 text-right">Incasso Lordo</th>
                <th className="py-3 px-4 text-right">% Studio Versata</th>
                <th className="py-3 px-6 text-right">% In Sospeso</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F2F2F7] text-xs">
              {artists
                .filter((a) => studioFilter === 'ALL' || a.studio === studioFilter)
                .map((artist) => {
                  const artAppts = appointments.filter((ap) => ap.artistId === artist.id);
                  const done = artAppts.filter((ap) => ap.status === 'completed');
                  const canc = artAppts.filter((ap) => ap.status === 'cancelled');
                  const gross = done.reduce((s, ap) => s + (ap.price || 0), 0);
                  const settled = done
                    .filter((ap) => ap.studioFeeStatus === 'settled')
                    .reduce(
                      (s, ap) => s + Math.round(((ap.price || 0) * artist.splitPct) / 100),
                      0
                    );
                  const pending = done
                    .filter((ap) => ap.studioFeeStatus === 'pending_fee')
                    .reduce(
                      (s, ap) => s + Math.round(((ap.price || 0) * artist.splitPct) / 100),
                      0
                    );

                  return (
                    <tr key={artist.id} className="hover:bg-[#FBFBFD]">
                      <td className="py-3.5 px-6 font-bold text-[#1D1D1F] flex items-center gap-2.5">
                        <span
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: artist.color }}
                        />
                        {artist.name}
                      </td>
                      <td className="py-3.5 px-4 text-[#6E6E73] font-medium">
                        {artist.studio} ({artist.splitPct}%)
                      </td>
                      <td className="py-3.5 px-4 text-center font-bold text-[#1D1D1F]">
                        {done.length}
                      </td>
                      <td className="py-3.5 px-4 text-center font-semibold text-[#FF3B30]">
                        {canc.length}
                      </td>
                      <td className="py-3.5 px-4 text-right font-bold text-[#1D1D1F]">
                        € {gross.toLocaleString('it-IT')}
                      </td>
                      <td className="py-3.5 px-4 text-right font-bold text-[#34C759]">
                        € {settled.toLocaleString('it-IT')}
                      </td>
                      <td className="py-3.5 px-6 text-right font-bold">
                        {pending > 0 ? (
                          <span className="px-2 py-1 rounded-lg bg-[#FFF5E5] text-[#FF9500]">
                            € {pending} da dare
                          </span>
                        ) : (
                          <span className="text-[#86868B]">€ 0</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}