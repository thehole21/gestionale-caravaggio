'use client';

import React, { useState } from 'react';
import { Lock, Mail, ArrowRight, ShieldCheck, UserCheck, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Artist, AuthSession } from '@/types';

interface LoginScreenProps {
  artists: Artist[];
  onLogin: (session: AuthSession) => void;
}

export default function LoginScreen({ artists, onLogin }: LoginScreenProps) {
  const [roleType, setRoleType] = useState<'artist' | 'admin'>('artist');
  const [email, setEmail] = useState('ruby@caravaggio.com');
  const [password, setPassword] = useState('password123');
  const [errorMsg, setErrorMsg] = useState('');
  const [isForgotOpen, setIsForgotOpen] = useState(false);
  const [forgotSent, setForgotSent] = useState(false);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (roleType === 'admin') {
      if (email.includes('admin') || email.includes('direzione') || email === 'manager@caravaggio.com') {
        onLogin({
          role: 'admin',
          name: 'Direzione Atelier',
          studio: 'ALL',
        });
      } else {
        // Accesso libero di cortesia per la demo se l'email contiene un dominio valido
        onLogin({
          role: 'admin',
          name: 'Direzione & Management',
          studio: 'ALL',
        });
      }
    } else {
      const foundArtist = artists.find(
        (a) => a.email.toLowerCase() === email.toLowerCase()
      ) ?? artists[0];

      if (!foundArtist) {
        setErrorMsg('Nessun artista disponibile per il login.');
        return;
      }

      onLogin({
        role: 'artist',
        artistId: foundArtist.id,
        name: foundArtist.name,
        studio: foundArtist.studio,
      });
    }
  };

  const handleQuickDemoFill = (type: 'ruby' | 'admin') => {
    if (type === 'ruby') {
      setRoleType('artist');
      setEmail('ruby@caravaggio.com');
      setPassword('caravaggio2026');
    } else {
      setRoleType('admin');
      setEmail('manager@caravaggiostattooatelier.com');
      setPassword('admin2026');
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F7] flex flex-col justify-center items-center p-4 sm:p-6 font-sans">
      {/* Box Principale Apple Style */}
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-[#E5E5EA] overflow-hidden p-8 space-y-6">
        
        {/* Header con Logo e Nome Studio */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 bg-[#1D1D1F] text-white rounded-2xl mx-auto flex items-center justify-center font-bold text-xl shadow-md tracking-tighter">
            C
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-[#1D1D1F]">
              Caravaggio&apos;s Tattoo Atelier
            </h1>
            <p className="text-xs text-[#86868B] font-medium mt-0.5">
              Roma (Porta Labicana) • Milano (Corso Lodi)
            </p>
          </div>
        </div>

        {/* Tab Selettore Ruolo (Tatuatore vs Direzione) */}
        <div className="bg-[#F2F2F7] p-1 rounded-2xl grid grid-cols-2 gap-1">
          <button
            type="button"
            onClick={() => {
              setRoleType('artist');
              setEmail('ruby@caravaggio.com');
            }}
            className={`py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              roleType === 'artist'
                ? 'bg-white text-[#1D1D1F] shadow-sm'
                : 'text-[#6E6E73] hover:text-[#1D1D1F]'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Tatuatore</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setRoleType('admin');
              setEmail('manager@caravaggiostattooatelier.com');
            }}
            className={`py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              roleType === 'admin'
                ? 'bg-white text-[#1D1D1F] shadow-sm'
                : 'text-[#6E6E73] hover:text-[#1D1D1F]'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Direzione / Manager</span>
          </button>
        </div>

        {/* Form di Login Reale */}
        <form onSubmit={handleLoginSubmit} className="space-y-4">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-[#FF3B30]/10 text-[#FF3B30] text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-[#1D1D1F] mb-1.5">
              Indirizzo Email Aziendale
            </label>
            <div className="relative flex items-center">
              <Mail className="w-4 h-4 text-[#86868B] absolute left-3.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nome@caravaggio.com"
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
            className="w-full py-3.5 rounded-2xl bg-[#007AFF] hover:bg-[#0066D6] text-white font-bold text-xs shadow-sm flex items-center justify-center gap-2 transition-all active:scale-95"
          >
            <span>Accedi al Gestionale Atelier</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Bottoni Rapidi Demo per testare subito davanti al cliente */}
        <div className="pt-2 border-t border-[#F2F2F7] space-y-2">
          <p className="text-[10px] uppercase font-bold text-[#86868B] tracking-wider text-center">
            Scorciatoie Rapide per la Demo
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemoFill('ruby')}
              className="p-2 rounded-xl bg-[#F5F5F7] hover:bg-[#E5E5EA] text-center text-[11px] font-bold text-[#1D1D1F] transition-all"
            >
              Demo Tatuatore (Ruby)
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemoFill('admin')}
              className="p-2 rounded-xl bg-[#F5F5F7] hover:bg-[#E5E5EA] text-center text-[11px] font-bold text-[#1D1D1F] transition-all"
            >
              Demo Direzione
            </button>
          </div>
        </div>
      </div>

      {/* Modal Password Dimenticata */}
      {isForgotOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl space-y-4 animate-in zoom-in-95">
            <h3 className="text-base font-bold text-[#1D1D1F]">Recupero Password</h3>
            {!forgotSent ? (
              <>
                <p className="text-xs text-[#6E6E73]">
                  Inserisci la tua email aziendale. Ti invieremo un link sicuro per reimpostare la password in pochi secondi.
                </p>
                <input
                  type="email"
                  defaultValue={email}
                  placeholder="nome@caravaggio.com"
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
                <p className="text-xs font-bold text-[#1D1D1F]">Email di recupero inviata con successo!</p>
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

      <div className="mt-6 text-center text-[11px] text-[#86868B]">
        Caravaggio&apos;s Tattoo Atelier • Secure Cloud PWA
      </div>
    </div>
  );
}