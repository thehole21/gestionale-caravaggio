# Gestionale Caravaggio

## Avvio e verifiche

Richiede Node 24 (o una versione con supporto nativo TypeScript per i test).

```sh
npm run dev
npx tsc --noEmit
node --test tests/agenda.test.mjs
npm run build
```

## Modello della demo

- Le date degli appuntamenti sono stringhe ISO `YYYY-MM-DD`, indipendenti dalla settimana visualizzata. “Oggi” usa Europe/Rome.
- `createdAt` è immutabile dopo la creazione, anche quando una seduta viene spostata.
- L'annullamento di una seduta programmata da parte del tatuatore entro 24 ore dalla creazione resta nel suo storico, ma viene escluso da tutti i dati presentati alla direzione. Dopo 24 ore è visibile nei report della direzione. I record legacy senza data di creazione non ottengono una nuova finestra di 24 ore.
- I report usano lo stesso intervallo per totali, registro, quote e performance. Gli incassi includono solo sedute completate. Il guadagno personale sottrae l'intera quota studio, anche se ancora da versare.
- I clienti unici sono stimati tramite telefono normalizzato, con nome come fallback. La versione definitiva dovrà usare un identificativo cliente.
- Gli importi delle quote sono arrotondati al centesimo.

## Persistenza e migrazione

La demo usa `localStorage` con chiave `caravaggio_demo_appts_v3`. Al primo accesso legge anche `caravaggio_demo_appts_v2`, senza eliminarla; gli offset legacy sono riferiti al lunedì 19 ottobre 2026. Nessun database è collegato. Errori di lettura impediscono di sovrascrivere l'archivio; errori di scrittura sono mostrati e non chiudono l'editor.

## Passaggio alla versione ufficiale

Il login resta quello dimostrativo esistente. Filtrare i dati nel client separa le viste, ma non costituisce controllo di accesso sicuro: i dati locali e il codice della demo sono accessibili sul dispositivo. Prima dell'uso con dati reali servono autenticazione, autorizzazione server per record, archivio condiviso, timestamp server per la regola delle 24 ore, audit delle modifiche e backup. I promemoria aperti dalla campanella sono dimostrativi: la UI non promette invii automatici.

Le regole di date, visibilità, migrazione e annullamento sono isolate in `src/lib/agenda.ts`, con test di regressione in `tests/agenda.test.mjs`. Il logo usa il favicon originale già incluso nel progetto, senza dipendere da URL esterni.
