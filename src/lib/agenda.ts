import type { Appointment, AuthSession } from '../types';

export type Period = 'day' | 'week' | 'month';
export const today = () => new Intl.DateTimeFormat('sv-SE', { timeZone: 'Europe/Rome' }).format(new Date());
export function dateObject(date: string) { return new Date(`${date}T12:00:00`); }
export function dateKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}
export function addDays(date: string, days: number) {
  const d = dateObject(date); d.setDate(d.getDate() + days); return dateKey(d);
}
export function startOfWeek(date: string) {
  return addDays(date, -((dateObject(date).getDay() + 6) % 7));
}
export function periodBounds(date: string, period: Period): [string, string] {
  if (period === 'day') return [date, date];
  if (period === 'week') { const start = startOfWeek(date); return [start, addDays(start, 6)]; }
  const d = dateObject(date);
  return [dateKey(new Date(d.getFullYear(), d.getMonth(), 1)), dateKey(new Date(d.getFullYear(), d.getMonth() + 1, 0))];
}
export function movePeriod(date: string, period: Period, direction: number) {
  if (period !== 'month') return addDays(date, direction * (period === 'day' ? 1 : 7));
  const d = dateObject(date); return dateKey(new Date(d.getFullYear(), d.getMonth() + direction, 1));
}
export const formatDate = (date: string, options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' }) =>
  dateObject(date).toLocaleDateString('it-IT', options);
export const money = (value: number) => value.toLocaleString('it-IT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 2 });
export function canCancelPrivately(apt: Appointment, now = Date.now()) {
  const age = now - Date.parse(apt.createdAt || '');
  return apt.status === 'scheduled' && Number.isFinite(age) && age >= 0 && age <= 24 * 60 * 60 * 1000;
}
export function cancellationVisibility(apt: Appointment, role: AuthSession['role'], now = Date.now()): 'private' | 'management' {
  if (apt.status === 'cancelled' && apt.cancellationVisibility) return apt.cancellationVisibility;
  return role === 'artist' && canCancelPrivately(apt, now) ? 'private' : 'management';
}
export function visibleAppointments(appointments: Appointment[], session: AuthSession) {
  return appointments.filter(a => session.role === 'artist'
    ? a.artistId === session.artistId
    : a.cancellationVisibility !== 'private');
}
// Legacy records used offsets from Monday 19 October 2026. Never invent a
// creation timestamp when migrating: unknown records cannot use the 24h grace.
export function migrateAppointments(raw: unknown): Appointment[] {
  if (!Array.isArray(raw)) throw new Error('Archivio non valido');
  return raw.map(item => {
    if (!item || typeof item !== 'object' || typeof item.id !== 'string' ||
        typeof item.artistId !== 'string' || typeof item.clientName !== 'string' ||
        !['scheduled', 'completed', 'cancelled'].includes(item.status) ||
        !/^\d{2}:\d{2}$/.test(item.startTime) || !/^\d{2}:\d{2}$/.test(item.endTime)) {
      throw new Error('Appuntamento non valido');
    }
    const { dayOffset, ...record } = item;
    const date = item.date || (Number.isInteger(dayOffset) ? addDays('2026-10-19', dayOffset) : '');
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || dateKey(dateObject(date)) !== date) throw new Error('Data non valida');
    return { ...record, date } as Appointment;
  });
}
