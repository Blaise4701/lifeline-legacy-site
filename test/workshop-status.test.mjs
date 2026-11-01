import assert from 'node:assert/strict';
import test from 'node:test';
import { hasWorkshopEnded, isRegistrationClosed } from '../src/lib/workshop-status.ts';

const event = { dateTime: '2026-11-12T14:00:00-06:00', endDateTime: '2026-11-12T19:30:00-06:00' };
test('registration closes at Dallas start time, while archive waits for the end', () => {
  assert.equal(isRegistrationClosed(event, Date.parse('2026-11-12T19:59:59Z')), false);
  assert.equal(isRegistrationClosed(event, Date.parse('2026-11-12T20:00:00Z')), true);
  assert.equal(hasWorkshopEnded(event, Date.parse('2026-11-12T20:00:00Z')), false);
  assert.equal(hasWorkshopEnded(event, Date.parse('2026-11-13T01:30:00Z')), true);
});
test('summer offset and missing end time use the explicit start timestamp', () => {
  const summer = { dateTime: '2026-10-12T18:00:00-05:00' };
  assert.equal(isRegistrationClosed(summer, Date.parse('2026-10-12T22:59:59Z')), false);
  assert.equal(hasWorkshopEnded(summer, Date.parse('2026-10-12T23:00:00Z')), true);
});
test('manual closure and cancellation override a future start', () => {
  const now = Date.parse('2026-10-31T12:00:00Z');
  assert.equal(isRegistrationClosed({ ...event, registrationClosed: true }, now), true);
  assert.equal(isRegistrationClosed({ ...event, cancelled: true }, now), true);
  assert.equal(hasWorkshopEnded({ ...event, registrationClosed: true }, now), false);
});
test('invalid dates fail closed', () => {
  assert.equal(isRegistrationClosed({ dateTime: 'invalid' }), true);
  assert.equal(hasWorkshopEnded({ dateTime: 'invalid' }), true);
});
