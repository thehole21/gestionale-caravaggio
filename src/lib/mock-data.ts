import { Artist, Appointment } from '@/types';

// Logo originale incluso nel favicon del progetto.
export const CARAVAGGIO_LOGO_URL =
  '/favicon.ico';

export const STUDIOS = {
  ROMA: {
    id: 'ROMA',
    name: 'Roma • Porta Labicana',
    address: 'Via di Porta Labicana 56, 00185 Roma',
  },
  MILANO: {
    id: 'MILANO',
    name: 'Milano • Corso Lodi',
    address: 'Galleria del Teatro / Corso Lodi, Milano',
  },
} as const;


export const ARTISTS: Artist[] = [
  {
    id: 'art-ruby',
    name: 'Ruby',
    email: 'ruby@caravaggiostattooatelier.com',
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
    email: 'laura@caravaggiostattooatelier.com',
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
    id: 'art-lorenzo',
    name: 'Lorenzo',
    email: 'lorenzo@caravaggiostattooatelier.com',
    studio: 'ROMA',
    role: 'Resident • Black & Grey Chiaroscuro',
    splitPct: 30,
    color: '#34C759',
    bgSoft: '#EAF9EE',
    border: '#B5ECC2',
    text: '#1B6E30',
    avatar: 'LO',
  },
  {
    id: 'art-mirko',
    name: 'Mirko',
    email: 'mirko@caravaggiostattooatelier.com',
    studio: 'MILANO',
    role: 'Resident • Realismo & Blackwork',
    splitPct: 35,
    color: '#FF9500',
    bgSoft: '#FFF5E5',
    border: '#FFD699',
    text: '#995700',
    avatar: 'MK',
  },
  {
    id: 'art-anna',
    name: 'Anna',
    email: 'anna@caravaggiostattooatelier.com',
    studio: 'MILANO',
    role: 'Resident • Fine Line & Microrealismo',
    splitPct: 35,
    color: '#FF2D55',
    bgSoft: '#FFEBEF',
    border: '#FFB3C2',
    text: '#9E0B28',
    avatar: 'AN',
  },
];

export const INITIAL_APPOINTMENTS: Appointment[] = [
{
    id: 'apt-101',
    clientName: 'Mario Rossi',
    clientPhone: '+39 348 912 3401',
    title: 'Micro Color Realistic Avambraccio',
    artistId: 'art-ruby',
    studio: 'ROMA',
    date: '2026-10-21', // Oggi
    startTime: '14:15',
    endTime: '17:45',
    price: 500,
    status: 'scheduled',
    paymentMethod: null,
    studioFeeStatus: 'unsettled',
    notes: 'Acconto €100 già scalato',
},
  {
      id: 'apt-102',
      clientName: 'Giulia De Santis',
      clientPhone: '+39 339 441 8821',
      title: 'Surrealismo & Fine Line Costato',
      artistId: 'art-laura',
      studio: 'ROMA',
      date: '2026-10-21', // Oggi
      startTime: '16:00',
      endTime: '18:15',
      price: null, // Importo non presente a calendario: lo chiederà il popup serale
      status: 'scheduled',
      paymentMethod: null,
      studioFeeStatus: 'unsettled',
      notes: 'Prezzo da definire a fine seduta in base alla dimensione',
  },
  {
      id: 'apt-103',
      clientName: 'Alessandro Mancini',
      clientPhone: '+39 320 119 5532',
      title: 'Soggetto Caravaggesco Spalla',
      artistId: 'art-lorenzo',
      studio: 'ROMA',
      date: '2026-10-21',
      startTime: '10:30',
      endTime: '13:30',
      price: 450,
      status: 'completed',
      paymentMethod: 'cash',
      studioFeeStatus: 'pending_fee', // Chiuso ma % studio ancora da dare
      notes: 'Tatuatore deve ancora versare il 30% in cassa studio',
  },
  {
      id: 'apt-104',
      clientName: 'Tommaso Galli',
      clientPhone: '+39 340 772 9104',
      title: 'Sleeve Realistico Seduta 2',
      artistId: 'art-mirko',
      studio: 'MILANO',
      date: '2026-10-21',
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
      title: 'Botanical Fine Line',
      artistId: 'art-anna',
      studio: 'MILANO',
      date: '2026-10-22',
      startTime: '14:30',
      endTime: '17:00',
      price: 380,
      status: 'scheduled',
      paymentMethod: null,
      studioFeeStatus: 'unsettled',
  },
];



