'use client';
import Image from 'next/image';
import { Calendar, BarChart3, Bell, LogOut } from 'lucide-react';
import type { Artist, StudioId } from '@/types';
import { CARAVAGGIO_LOGO_URL } from '@/lib/mock-data';
interface Props {
 activeTab:'calendar'|'reports'; setActiveTab:(tab:'calendar'|'reports')=>void;
 studioFilter:StudioId; setStudioFilter:(studio:StudioId)=>void;
 roleMode:'admin'|'artist'; activeArtistId:string; artists:Artist[];
 pendingCount:number; onTriggerPush:()=>void; onLogout:()=>void;
}
export default function TopBar(p:Props) {
 const artist=p.artists.find(a=>a.id===p.activeArtistId);
 return <header className="app-header">
   <div className="brand-lockup"><Image unoptimized src={CARAVAGGIO_LOGO_URL} alt="Caravaggio’s Tattoo Atelier" width={48} height={48}/><div><strong>CARAVAGGIO’S</strong><span>{p.roleMode==='admin'?'Direzione · Roma e Milano':`${artist?.name} · ${artist?.studio}`}</span></div></div>
   <nav aria-label="Navigazione principale" className="app-nav"><button aria-current={p.activeTab==='calendar'?'page':undefined} onClick={()=>p.setActiveTab('calendar')}><Calendar size={17}/>Agenda</button><button aria-current={p.activeTab==='reports'?'page':undefined} onClick={()=>p.setActiveTab('reports')}><BarChart3 size={17}/>{p.roleMode==='artist'?'I miei report':'Report'}</button></nav>
   <div className="header-actions">{p.roleMode==='admin' && <select aria-label="Filtra sede" value={p.studioFilter} onChange={e=>p.setStudioFilter(e.target.value as StudioId)}><option value="ALL">Tutte le sedi</option><option value="ROMA">Roma</option><option value="MILANO">Milano</option></select>}<button className="icon-button" aria-label={`Promemoria demo: ${p.pendingCount} appuntamenti da chiudere`} title="Apri promemoria demo" onClick={p.onTriggerPush}><Bell size={18}/>{p.pendingCount>0 && <span className="notification-count">{p.pendingCount}</span>}</button><button className="icon-button" aria-label="Esci" onClick={p.onLogout}><LogOut size={18}/></button></div>
 </header>;
}
