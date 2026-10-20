'use client';
import { useState } from 'react';
import TopBar from '@/components/TopBar';
import GoogleCalendarView from '@/components/GoogleCalendarView';
import AccountingReportsView from '@/components/AccountingReportsView';
import CheckoutSheetModal from '@/components/CheckoutSheetModal';
import NewAppointmentModal from '@/components/NewAppointmentModal';
import LoginScreen from '@/components/LoginScreen';
import { ARTISTS, INITIAL_APPOINTMENTS } from '@/lib/mock-data';
import { cancellationVisibility, migrateAppointments, today, visibleAppointments } from '@/lib/agenda';
import type { Appointment, AuthSession, PaymentMethod, StudioFeeStatus, StudioId } from '@/types';
import { X } from 'lucide-react';

export default function CaravaggioAppPage() {
 const [session,setSession]=useState<AuthSession|null>(null);
 const [activeTab,setActiveTab]=useState<'calendar'|'reports'>('calendar');
 const [studioFilter,setStudioFilter]=useState<StudioId>('ALL');
 const [appointments,setAppointments]=useState<Appointment[]>(INITIAL_APPOINTMENTS);
 const [selectedArtists,setSelectedArtists]=useState<string[]>(ARTISTS.map(a=>a.id));
 const [checkout,setCheckout]=useState<Appointment|null>(null);
 const [editor,setEditor]=useState<{date:string;time:string;appointment?:Appointment;mode?:'edit'|'move'}|null>(null);
 const [notice,setNotice]=useState('');
 const [storageReady,setStorageReady]=useState(false);
 const loadArchive=()=>{
   try {
     const saved=localStorage.getItem('caravaggio_demo_appts_v3') ?? localStorage.getItem('caravaggio_demo_appts_v2');
     if(saved) setAppointments(migrateAppointments(JSON.parse(saved)));
     setStorageReady(true);
   } catch { setStorageReady(false); setNotice('Impossibile leggere l’archivio locale. I dati esistenti sono preservati; ricarica prima di salvare nuove modifiche.'); }
 };
 const update=(next:Appointment[])=>{
   if(!storageReady) {setNotice('Archivio non disponibile: le modifiche non sono state salvate.');return false;}
   try {localStorage.setItem('caravaggio_demo_appts_v3',JSON.stringify(next));setAppointments(next);return true;}
   catch {setNotice('Spazio locale non disponibile: modifica non salvata.');return false;}
 };
 const login=(s:AuthSession)=>{loadArchive();setSession(s);setActiveTab('calendar');setSelectedArtists(s.role==='artist'?[s.artistId!]:ARTISTS.map(a=>a.id));setStudioFilter(s.role==='artist'?s.studio:'ALL');};
 if(!session) return <><LoginScreen onLogin={login}/>{notice && <p role="alert" className="p-4 text-red-800">{notice}</p>}</>;
 const isAdmin=session.role==='admin';
 const accessible=visibleAppointments(appointments,session);
 const artists=isAdmin?ARTISTS:ARTISTS.filter(a=>a.id===session.artistId);
 const canEdit=(a:Appointment)=>isAdmin||a.artistId===session.artistId;
 const pending=accessible.filter(a=>a.date===today()&&a.status==='scheduled'&&(studioFilter==='ALL'||a.studio===studioFilter));
 const confirm=(id:string,outcome:'completed'|'cancelled',price:number|null,payment:PaymentMethod,fee:StudioFeeStatus)=>{
   const original=appointments.find(a=>a.id===id);
   if(!original||!canEdit(original))return;
   if(outcome==='completed'&&(!price||price<=0||!Number.isFinite(price)||!payment))return;
   const privateCancellation=outcome==='cancelled'&&cancellationVisibility(original,session.role)==='private';
   const next=appointments.map(a=>a.id===id?{...a,status:outcome,price:outcome==='completed'?price:a.price,paymentMethod:payment,studioFeeStatus:fee,cancelledAt:outcome==='cancelled'?new Date().toISOString():undefined,cancellationVisibility:outcome==='cancelled'?(privateCancellation?'private' as const:'management' as const):undefined}:a);
   if(update(next)){setCheckout(null);setNotice(privateCancellation?'Appuntamento annullato entro 24 ore dalla creazione. Escluso dall’agenda e dai report della direzione.':'Appuntamento aggiornato.');}
 };
 const save=(a:Appointment)=>{
   const original=appointments.find(item=>item.id===a.id);
   if((original&&!canEdit(original))||(!isAdmin&&a.artistId!==session.artistId))return false;
   if(!a.date||a.endTime<=a.startTime){setNotice('Controlla la data e gli orari.');return false;}
   const next=original?appointments.map(item=>item.id===a.id?{...a,createdAt:original.createdAt}:item):[...appointments,{...a,createdAt:new Date().toISOString()}];
   if(update(next)){setNotice(original?'Appuntamento aggiornato.':'Appuntamento aggiunto.');return true;}return false;
 };
 return <div className="atelier-app">
   <TopBar activeTab={activeTab} setActiveTab={setActiveTab} studioFilter={studioFilter} setStudioFilter={setStudioFilter} roleMode={session.role} activeArtistId={session.artistId||''} artists={artists} pendingCount={pending.length} onTriggerPush={()=>pending.length?setCheckout(pending[0]):setNotice('Nessun appuntamento da chiudere oggi.')} onLogout={()=>{setSession(null);setCheckout(null);setEditor(null);setNotice('');}}/>
   {notice && <div className="app-notice" role="status"><span>{notice}</span><button aria-label="Chiudi messaggio" onClick={()=>setNotice('')}><X size={18}/></button></div>}
   {activeTab==='calendar'?<GoogleCalendarView appointments={accessible} artists={artists} selectedArtists={selectedArtists} toggleArtist={id=>isAdmin&&setSelectedArtists(prev=>prev.includes(id)?prev.filter(a=>a!==id):[...prev,id])} studioFilter={studioFilter} roleMode={session.role} onSelectAppointment={setCheckout} onEmptySlotClick={(date,time)=>setEditor({date,time})}/>:<AccountingReportsView appointments={accessible} artists={artists} studioFilter={studioFilter} roleMode={session.role} onOpenAppointment={setCheckout} onSettlePendingFee={id=>{const a=appointments.find(item=>item.id===id);if(a&&canEdit(a)&&a.status==='completed'&&update(appointments.map(item=>item.id===id?{...item,studioFeeStatus:'settled'}:item)))setNotice('Versamento della quota studio registrato.');}}/>}
   {checkout && <CheckoutSheetModal key={checkout.id} appointment={checkout} artist={artists.find(a=>a.id===checkout.artistId)} roleMode={session.role} onClose={()=>setCheckout(null)} onConfirmCheckout={confirm} onEdit={mode=>{setEditor({date:checkout.date,time:checkout.startTime,appointment:checkout,mode});setCheckout(null);}}/>}
   {editor && <NewAppointmentModal key={editor.appointment?.id||'new'} isOpen onClose={()=>setEditor(null)} onSave={save} artists={artists} defaultDate={editor.date} defaultStartTime={editor.time} roleMode={session.role} activeArtistId={session.artistId||artists.find(a=>studioFilter==='ALL'||a.studio===studioFilter)?.id||artists[0].id} appointment={editor.appointment} mode={editor.mode}/>}
   <footer className="app-footer">Caravaggio’s Tattoo Atelier · {isAdmin?'Direzione':'Area personale'}<span>Demo · dati salvati su questo dispositivo</span></footer>
 </div>;
}

