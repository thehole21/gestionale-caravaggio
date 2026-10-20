export type StudioId = 'ALL' | 'ROMA' | 'MILANO';

export type AppointmentStatus = 'scheduled' | 'completed' | 'cancelled';
export type StudioFeeStatus = 'unsettled' | 'settled' | 'pending_fee';
export type PaymentMethod = 'cash' | 'pos' | 'transfer' | null;

export type AuthSession =
  | {
      role: 'admin';
      name: string;
      studio: 'ALL';
    }
  | {
      role: 'artist';
      artistId: string;
      name: string;
      studio: 'ROMA' | 'MILANO';
    };

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
  dayOffset: number; // 0 = Lun, 1 = Mar, 2 = Mer (Oggi), ecc.
  startTime: string; // "HH:MM" libera al minuto
  endTime: string;   // "HH:MM" libera al minuto
  price: number | null; // null se il tatuatore non l'ha messo a calendario
  status: AppointmentStatus;
  paymentMethod: PaymentMethod;
  studioFeeStatus: StudioFeeStatus;
  notes?: string;
}