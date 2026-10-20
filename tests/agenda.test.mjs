import { test } from 'node:test';
import assert from 'node:assert/strict';
import { addDays, periodBounds, movePeriod, canCancelPrivately, cancellationVisibility, visibleAppointments, migrateAppointments } from '../src/lib/agenda.ts';

const created = Date.parse('2026-10-20T08:00:00Z');
const apt = { id:'test', artistId:'ruby', clientName:'Cliente', date:'2026-10-22', startTime:'10:00', endTime:'12:00', status:'scheduled', createdAt:new Date(created).toISOString() };
test('24h grace is measured from creation, inclusive at the boundary', () => {
  assert.equal(canCancelPrivately(apt,created),true);
  assert.equal(canCancelPrivately(apt,created+86400000),true);
  assert.equal(canCancelPrivately(apt,created+86400001),false);
  assert.equal(canCancelPrivately(apt,created-1),false);
  assert.equal(canCancelPrivately({...apt,createdAt:undefined},created),false);
  assert.equal(canCancelPrivately({...apt,status:'completed'},created),false);
});
test('admin cancellations stay visible; re-saving a private cancellation stays private', () => {
  assert.equal(cancellationVisibility(apt,'admin',created),'management');
  assert.equal(cancellationVisibility(apt,'artist',created),'private');
  assert.equal(cancellationVisibility({...apt,status:'cancelled',cancellationVisibility:'private'},'artist',created+172800000),'private');
});
test('artists see only their own data; management excludes private cancellations', () => {
  const data=[apt,{...apt,id:'other',artistId:'other'},{...apt,id:'cancelled',status:'cancelled',cancellationVisibility:'private'}];
  assert.deepEqual(visibleAppointments(data,{role:'artist',artistId:'ruby'}).map(a=>a.id),['test','cancelled']);
  assert.deepEqual(visibleAppointments(data,{role:'admin'}).map(a=>a.id),['test','other']);
});
test('calendar periods handle Sunday, leap years, year changes and DST dates', () => {
  assert.deepEqual(periodBounds('2026-10-25','week'),['2026-10-19','2026-10-25']);
  assert.deepEqual(periodBounds('2028-02-15','month'),['2028-02-01','2028-02-29']);
  assert.deepEqual(periodBounds('2026-10-20','day'),['2026-10-20','2026-10-20']);
  assert.equal(movePeriod('2026-12-31','month',1),'2027-01-01');
  assert.equal(movePeriod('2026-03-31','month',-1),'2026-02-01');
  assert.equal(addDays('2026-10-25',1),'2026-10-26');
});
test('legacy migration preserves real dates and never invents creation timestamps', () => {
  const [legacy]=migrateAppointments([{...apt,date:'',dayOffset:2,createdAt:undefined}]);
  assert.equal(legacy.date,'2026-10-21');
  assert.equal(legacy.createdAt,undefined);
  assert.equal('dayOffset' in legacy,false);
  assert.equal(migrateAppointments([apt])[0].date,apt.date);
  assert.throws(()=>migrateAppointments({}));
  assert.throws(()=>migrateAppointments([{...apt,date:'2026-02-30'}]));
});
