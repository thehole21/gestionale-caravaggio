export type StudioId = 'ALL' | 'ROMA' | 'MILANO';

export type AppointmentStatus = 'scheduled' | 'completed' | 'cancelled';
export type StudioFeeStatus = 'unsettled' | 'settled' | 'pending_fee';
export type PaymentMethod = 'cash' | 'pos' | 'transfer' | null;
export type CalendarViewMode = 'day' | 'week' | 'month';

export interface AuthSession {
  role: 'admin' | 'artist';
  artistId?: string;
  name: string;
  studio: 'ALL' | 'ROMA' | 'MILANO';
}

export interface Artist {
  id: string;
  name: string;
  email: string;
  studio: 'ROMA' | 'MILANO';
  role: string;
  splitPct: number; // % che spetta allo studio (es. 30%)
  color: string;
  bgSoft: string;
  border: string;
  text: string;
  avatar: string;
}

export interface Appointment {
  id: string;
  clientName: string;
  clientPhone: string;
  title: string;
  artistId: string;
  studio: 'ROMA' | 'MILANO';
  date: string;       // Formato "YYYY-MM-DD" (es. "2026-10-21") per navigare tra i mesi
  dayOffset?: number; // Mantenuto per retrocompatibilità
  startTime: string;  // "HH:MM"
  endTime: string;    // "HH:MM"
  price: number | null;
  status: AppointmentStatus;
  paymentMethod: PaymentMethod;
  studioFeeStatus: StudioFeeStatus;
  notes?: string;
  cancelledLate?: boolean; // true se annullato a meno di 24h (visibile alla direzione)
}