import assert from "node:assert/strict";
import test from "node:test";

import { emailPermission } from "../src/lib/ghl-email-permission.ts";

test("blocks a contact with global DND enabled", () => {
  assert.equal(emailPermission({ dnd: true }), "blocked");
});

test("blocks a contact with active email DND", () => {
  assert.equal(
    emailPermission({ dndSettings: { email: { status: "active" } } }),
    "blocked",
  );
});

test("blocks a contact with active all-channel DND", () => {
  assert.equal(
    emailPermission({ dndSettings: { all: { status: "active" } } }),
    "blocked",
  );
});

test("allows a contact with global DND disabled", () => {
  assert.equal(emailPermission({ dnd: false }), "allowed");
});

test("allows a contact with inactive email DND", () => {
  assert.equal(
    emailPermission({ dndSettings: { email: { status: "inactive" } } }),
    "allowed",
  );
});

test("allows a contact with no global or email DND fields", () => {
  assert.equal(emailPermission({}), "allowed");
});

test("allows a contact with SMS-only DND", () => {
  assert.equal(
    emailPermission({ dndSettings: { sms: { status: "active" } } }),
    "allowed",
  );
});

test("ignores inbound DND when determining outbound email permission", () => {
  assert.equal(
    emailPermission({ inboundDndSettings: { email: { status: "active" } } }),
    "allowed",
  );
});
