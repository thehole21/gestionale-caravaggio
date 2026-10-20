'use client';
import Image from 'next/image';

import React, { useState } from 'react';
import {
  Lock,
  Mail,
  ArrowRight,
  ShieldCheck,
  UserCheck,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { ARTISTS, CARAVAGGIO_LOGO_URL } from '@/lib/mock-data';
import { AuthSession, Artist } from '@/types';

interface LoginScreenProps {
  artists?: Artist[];
  onLogin: (session: AuthSession) => void;
}

export default function LoginScreen({ artists = ARTISTS, onLogin }: LoginScreenProps) {
  const [roleType, setRoleType] = useState<'artist' | 'admin'>('artist');
  const [email, setEmail] = useState('ruby@caravaggiostattooatelier.com');
  const [password, setPassword] = useState('caravaggio2026');
  const [errorMsg, setErrorMsg] = useState('');
  const [isForgotOpen, setIsForgotOpen] = useState(false);
  const [forgotSent, setForgotSent] = useState(false);

  const safeArtists = artists && artists.length > 0 ? artists : ARTISTS;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (roleType === 'admin') {
      onLogin({
        role: 'admin',
        name: 'Direzione & Management',
        email,
        studio: 'ALL',
      });
      return;
    }

    const foundArtist =
      safeArtists.find(
        (a) => a.email && a.email.toLowerCase() === email.trim().toLowerCase()
      ) || safeArtists[0];

    onLogin({
      role: 'artist',
      artistId: foundArtist.id,
      name: foundArtist.name,
      email: foundArtist.email,
      studio: foundArtist.studio,
    });
  };

  const handleQuickSelectArtist = (artist: Artist) => {
    setRoleType('artist');
    setEmail(artist.email);
    setPassword('caravaggio2026');
  };

  return (
    <div className="min-h-screen bg-[#F5F5F7] flex flex-col justify-center items-center p-4 sm:p-6 font-sans">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-[#E5E5EA] overflow-hidden p-6 sm:p-8 space-y-6">
        {/* Header con Vero Logo Caravaggio's Tattoo Atelier */}
        <div className="text-center space-y-3">
          <div className="w-20 h-20 bg-[#1D1D1F] rounded-2xl mx-auto flex items-center justify-center p-2.5 shadow-md">
            <Image
              width={64}
              height={64}
              unoptimized
              src={CARAVAGGIO_LOGO_URL}
              alt="Caravaggio's Tattoo Atelier"
              className="w-full h-full object-contain"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-bold tracking-tight text-[#1D1D1F]">
              Caravaggio&apos;s Tattoo Atelier
            </h1>
            <p className="text-xs text-[#86868B] font-medium mt-0.5">
              Roma (Via di Porta Labicana 56) • Milano (Corso Lodi)
            </p>
          </div>
        </div>

        {/* Selettore Ruolo: Tatuatore vs Direzione */}
        <div className="bg-[#F2F2F7] p-1 rounded-2xl grid grid-cols-2 gap-1">
          <button
            type="button"
            onClick={() => {
              setRoleType('artist');
              setEmail(safeArtists[0]?.email || 'ruby@caravaggiostattooatelier.com');
            }}
            className={`py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              roleType === 'artist'
                ? 'bg-white text-[#1D1D1F] shadow-sm'
                : 'text-[#6E6E73] hover:text-[#1D1D1F]'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Area Tatuatore</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setRoleType('admin');
              setEmail('direzione@caravaggiostattooatelier.com');
            }}
            className={`py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              roleType === 'admin'
                ? 'bg-white text-[#1D1D1F] shadow-sm'
                : 'text-[#6E6E73] hover:text-[#1D1D1F]'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Direzione Studio</span>
          </button>
        </div>

        {/* Form Email & Password */}
        <form onSubmit={handleLoginSubmit} className="space-y-4">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-[#FF3B30]/10 text-[#FF3B30] text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-[#1D1D1F] mb-1.5">
              Email {roleType === 'admin' ? 'Amministratore' : 'Tatuatore'}
            </label>
            <div className="relative flex items-center">
              <Mail className="w-4 h-4 text-[#86868B] absolute left-3.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nome@caravaggiostattooatelier.com"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#F5F5F7] border border-transparent focus:bg-white focus:border-[#007AFF] text-xs font-semibold text-[#1D1D1F] focus:outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-[#1D1D1F]">Password</label>
              <button
                type="button"
                onClick={() => {
                  setIsForgotOpen(true);
                  setForgotSent(false);
                }}
                className="text-[11px] font-semibold text-[#007AFF] hover:underline"
              >
                Password dimenticata?
              </button>
            </div>
            <div className="relative flex items-center">
              <Lock className="w-4 h-4 text-[#86868B] absolute left-3.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#F5F5F7] border border-transparent focus:bg-white focus:border-[#007AFF] text-xs font-semibold text-[#1D1D1F] focus:outline-none transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-2xl bg-[#1D1D1F] hover:bg-black text-white font-bold text-xs shadow-sm flex items-center justify-center gap-2 transition-all active:scale-95"
          >
            <span>
              {roleType === 'admin'
                ? 'Accedi come Direzione (Roma + Milano)'
                : 'Accedi al Calendario Personale'}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Selettore rapido account reali per la Demo */}
        <div className="pt-3 border-t border-[#F2F2F7] space-y-2">
          <p className="text-[10px] uppercase font-bold text-[#86868B] tracking-wider text-center">
            Compilazione Rapida Account Reali (Per Demo)
          </p>

          {roleType === 'artist' ? (
            <div className="flex flex-wrap gap-1.5 justify-center">
              {safeArtists.map((art) => (
                <button
                  key={art.id}
                  type="button"
                  onClick={() => handleQuickSelectArtist(art)}
                  className={`px-2.5 py-1.5 rounded-xl text-[11px] font-bold border transition-all flex items-center gap-1.5 ${
                    email.toLowerCase() === art.email?.toLowerCase()
                      ? 'bg-[#1D1D1F] text-white border-[#1D1D1F]'
                      : 'bg-[#F5F5F7] text-[#1D1D1F] border-transparent hover:bg-[#E5E5EA]'
                  }`}
                >
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: art.color }}
                  />
                  <span>{art.name}</span>
                  <span className="text-[9px] opacity-70">({art.studio})</span>
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center">
              <span className="inline-block px-3 py-1.5 rounded-xl bg-[#F5F5F7] text-[11px] font-semibold text-[#6E6E73]">
                Email pronta: <strong>direzione@caravaggiostattooatelier.com</strong>
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Modal Recupero Password */}
      {isForgotOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-[#1D1D1F]">Reimposta Password</h3>
            {!forgotSent ? (
              <>
                <p className="text-xs text-[#6E6E73]">
                  Inserisci la tua email associata a Caravaggio&apos;s Tattoo Atelier. Riceverai un link di reset.
                </p>
                <input
                  type="email"
                  defaultValue={email}
                  placeholder="nome@caravaggiostattooatelier.com"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#F5F5F7] text-xs font-semibold text-[#1D1D1F] focus:outline-none border border-[#E5E5EA]"
                />
                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsForgotOpen(false)}
                    className="flex-1 py-2.5 rounded-xl bg-[#F2F2F7] text-xs font-bold text-[#6E6E73]"
                  >
                    Annulla
                  </button>
                  <button
                    type="button"
                    onClick={() => setForgotSent(true)}
                    className="flex-1 py-2.5 rounded-xl bg-[#007AFF] text-xs font-bold text-white shadow-sm"
                  >
                    Invia Link
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center py-4 space-y-3">
                <CheckCircle2 className="w-10 h-10 text-[#34C759] mx-auto" />
                <p className="text-xs font-bold text-[#1D1D1F]">
                  Link di recupero inviato a {email}
                </p>
                <button
                  type="button"
                  onClick={() => setIsForgotOpen(false)}
                  className="w-full py-2.5 rounded-xl bg-[#1D1D1F] text-xs font-bold text-white"
                >
                  Torna al Login
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
