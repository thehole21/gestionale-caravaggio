import { Artist, Appointment } from '@/types';

export const STUDIOS = {
  ROMA: {
    id: 'ROMA',
    name: 'Roma • Via di Porta Labicana 56',
    address: 'Via di Porta Labicana 56, Roma',
  },
  MILANO: {
    id: 'MILANO',
    name: 'Milano • Corso Lodi 18',
    address: 'Corso Lodi 18, Milano',
  },
} as const;

export const ARTISTS: Artist[] = [
  {
    id: 'art-ruby',
    name: 'Ruby',
    email: 'ruby@caravaggio.com',
    studio: 'ROMA',
    role: 'Resident • Micro Color Realistic',
    splitPct: 30,
    color: '#007AFF',
    bgSoft: '#EBF4FF',
    border: '#B8DAFF',
    text: '#004A99',
    avatar: 'RB',
  },
  {
    id: 'art-laura',
    name: 'Laura Rodriguez',
    email: 'laura@caravaggio.com',
    studio: 'ROMA',
    role: 'Resident • Surrealismo & Fine Line',
    splitPct: 30,
    color: '#AF52DE',
    bgSoft: '#F6ECFC',
    border: '#DFBAF5',
    text: '#6A248F',
    avatar: 'LR',
  },
  {
    id: 'art-edoardo',
    name: 'Edoardo Visconti',
    email: 'edoardo@caravaggio.com',
    studio: 'MILANO',
    role: 'Resident • Realism & Chicano',
    splitPct: 35,
    color: '#FF9500',
    bgSoft: '#FFF5E5',
    border: '#FFD699',
    text: '#995700',
    avatar: 'EV',
  },
  {
    id: 'art-chiara',
    name: 'Chiara Brambilla',
    email: 'chiara@caravaggio.com',
    studio: 'MILANO',
    role: 'Resident • Ornamental & Blackwork',
    splitPct: 35,
    color: '#FF2D55',
    bgSoft: '#FFEBEF',
    border: '#FFB3C2',
    text: '#9E0B28',
    avatar: 'CB',
  },
];

// Helper per ottenere una data YYYY-MM-DD relativa a oggi
export function getRelativeDateStr(offsetDays: number): string {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

export const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: 'apt-101',
    clientName: 'Mario Rossi',
    clientPhone: '+39 348 912 3401',
    title: 'Avambraccio Micro Color Realistic',
    artistId: 'art-ruby',
    studio: 'ROMA',
    date: getRelativeDateStr(0), // Oggi
    startTime: '14:15',
    endTime: '17:45',
    price: 500,
    status: 'scheduled',
    paymentMethod: null,
    studioFeeStatus: 'unsettled',
    notes: 'Acconto €100 già versato',
  },
  {
    id: 'apt-102',
    clientName: 'Giulia De Santis',
    clientPhone: '+39 339 441 8821',
    title: 'Surrealismo Costato',
    artistId: 'art-laura',
    studio: 'ROMA',
    date: getRelativeDateStr(0), // Oggi
    startTime: '16:00',
    endTime: '18:15',
    price: null, // Prezzo non inserito a calendario
    status: 'scheduled',
    paymentMethod: null,
    studioFeeStatus: 'unsettled',
    notes: 'Prezzo da definire a fine seduta',
  },
  {
    id: 'apt-103',
    clientName: 'Alessandro Mancini',
    clientPhone: '+39 320 119 5532',
    title: 'Micro Color Petto',
    artistId: 'art-ruby',
    studio: 'ROMA',
    date: getRelativeDateStr(0), // Oggi mattina
    startTime: '10:30',
    endTime: '13:00',
    price: 400,
    status: 'completed',
    paymentMethod: 'cash',
    studioFeeStatus: 'pending_fee', // Chiuso ma % studio in sospeso
    notes: 'Tatuatore deve ancora lasciare il 30% in cassa',
  },
  {
    id: 'apt-104',
    clientName: 'Tommaso Galli',
    clientPhone: '+39 340 772 9104',
    title: 'Realismo Manica Intera',
    artistId: 'art-edoardo',
    studio: 'MILANO',
    date: getRelativeDateStr(-1), // Ieri
    startTime: '11:00',
    endTime: '16:00',
    price: 700,
    status: 'completed',
    paymentMethod: 'pos',
    studioFeeStatus: 'settled',
  },
  {
    id: 'apt-105',
    clientName: 'Sofia Pellegrini',
    clientPhone: '+39 392 883 1920',
    title: 'Fine Line Spalla',
    artistId: 'art-ruby',
    studio: 'ROMA',
    date: getRelativeDateStr(2), // Tra 2 giorni (> 24h, annullabile senza penalità direzione)
    startTime: '15:00',
    endTime: '18:00',
    price: 350,
    status: 'scheduled',
    paymentMethod: null,
    studioFeeStatus: 'unsettled',
    notes: 'Appuntamento tra 48h (test annullamento >24h)',
  },
];