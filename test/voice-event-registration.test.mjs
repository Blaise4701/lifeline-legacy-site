import assert from 'node:assert/strict';
import test from 'node:test';
import { createHash } from 'node:crypto';
import { normalizeVoiceRegistration, validVoiceCredential, VOICE_EVENT_ID } from '../src/lib/voice-event-registration.ts';
const digest = createHash('sha256').update('test-only-token').digest('hex');
test('credentials must match and malformed headers fail closed', () => {
 assert.equal(validVoiceCredential('Bearer test-only-token', digest), true);
 for (const header of [null, '', 'test-only-token', 'Bearer wrong', 'Bearer ' + 'a'.repeat(300)]) assert.equal(validVoiceCredential(header, digest), false);
});
const base = { consent: 'yes', smsConsent: 'no', guestCount: '0', guestsJson: '[]' };
test('event, submission type and honeypot cannot be overridden by action input', () => {
 const result = normalizeVoiceRegistration({ ...base, type: 'continuity-review-start', eventId: 'other-event', website: 'skip' });
 assert.equal(result.eventId, VOICE_EVENT_ID); assert.equal(result.type, 'event-registration'); assert.equal(result.website, '');
});
test('SMS permission stays separate and ambiguous permissions are rejected', () => {
 assert.equal(normalizeVoiceRegistration(base).consent, true);
 assert.equal(normalizeVoiceRegistration(base).smsConsent, false);
 assert.equal(normalizeVoiceRegistration({ ...base, smsConsent: 'maybe' }), null);
 assert.equal(normalizeVoiceRegistration({ ...base, consent: undefined }), null);
 assert.equal(normalizeVoiceRegistration({ ...base, consent: false }).consent, false);
});
test('guest list must be valid bounded JSON; names pass through to shared validation', () => {
 for (const guestsJson of ['broken', '{}', '[1,2,3,4]']) assert.equal(normalizeVoiceRegistration({ ...base, guestsJson }), null);
 const guest = { firstName: 'Jordan', lastName: 'Example', relationship: 'Friend' };
 assert.deepEqual(normalizeVoiceRegistration({ ...base, guestCount: '1', guestsJson: JSON.stringify([guest]) }).guests, [guest]);
});
