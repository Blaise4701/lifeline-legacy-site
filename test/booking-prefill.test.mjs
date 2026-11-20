import assert from 'node:assert/strict';
import test from 'node:test';
import { buildBookingUrl, normalizeUsPhone } from '../src/lib/booking-prefill.ts';

test('US phone numbers are normalized for the booking widget', () => {
 assert.equal(normalizeUsPhone('(972) 555-0100'), '+19725550100');
 assert.equal(normalizeUsPhone('1-972-555-0100'), '+19725550100');
 assert.equal(normalizeUsPhone('+44 20 7946 0958'), '+44 20 7946 0958');
});

test('booking URL receives first name, email and phone and keeps existing parameters', () => {
 const url = new URL(buildBookingUrl('https://api.leadconnectorhq.com/widget/booking/abc?x=1', {
  firstName: 'Sam Example', email: 'sam@example.com', phone: '(972) 555-0100',
 }));
 assert.equal(url.searchParams.get('x'), '1');
 assert.equal(url.searchParams.get('first_name'), 'Sam Example');
 assert.equal(url.searchParams.get('email'), 'sam@example.com');
 assert.equal(url.searchParams.get('phone'), '+19725550100');
});

test('non-https or invalid booking URLs are returned unchanged', () => {
 const prefill = { firstName: 'Sam', email: 'sam@example.com', phone: '9725550100' };
 assert.equal(buildBookingUrl('http://example.com/cal', prefill), 'http://example.com/cal');
 assert.equal(buildBookingUrl('not a url', prefill), 'not a url');
 assert.equal(buildBookingUrl('', prefill), '');
});
