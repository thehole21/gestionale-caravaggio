export type StudioId = 'ALL' | 'ROMA' | 'MILANO';

export type AppointmentStatus = 'scheduled' | 'completed' | 'cancelled';
export type StudioFeeStatus = 'unsettled' | 'settled' | 'pending_fee';
export type PaymentMethod = 'cash' | 'pos' | 'transfer' | null;

export interface AuthSession {
  role: 'admin' | 'artist';
  artistId?: string;
  name: string;
  email?: string;
  studio: 'ALL' | 'ROMA' | 'MILANO';
}

export interface Artist {
  id: string;
  name: string;
  email: string;
  studio: 'ROMA' | 'MILANO';
  role: string;
  splitPct: number;
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
  date: string;
  createdAt?: string;
  cancelledAt?: string;
  cancellationVisibility?: 'private' | 'management';
  startTime: string;
  endTime: string;
  price: number | null;
  status: AppointmentStatus;
  paymentMethod: PaymentMethod;
  studioFeeStatus: StudioFeeStatus;
  notes?: string;
}
