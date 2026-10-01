import test from "node:test";
import assert from "node:assert/strict";

import { assessGovernmentRegistryCrossCheck, extractGovernmentRecruitmentFacts } from "./lib/governmentRegistry.ts";

test("government registry marks suspicious gov claim on fake .com domain as suspicious", () => {
  const text = "Government recruitment notice for SSC CGL 2026. Apply at ssc-recruitment.co.in. Advt No. 03/2026/SSC. Payment by personal UPI 9876543210@upi.";
  const result = assessGovernmentRegistryCrossCheck({
    rawText: text,
    website: "https://ssc-recruitment.co.in",
    company: "SSC",
    notificationNumber: "03/2026/SSC",
    description: text,
    applicationFee: "₹500",
  });

  assert.equal(result.isGovernmentJobClaim, true);
  assert.equal(result.domainValidation.status, "FAIL");
  assert.equal(result.paymentSafety.status, "PERSONAL_OR_SUSPICIOUS");
  assert.ok(result.redFlags.length > 0);
});

test("extracts government recruitment information from official-looking content", () => {
  const facts = extractGovernmentRecruitmentFacts({
    rawText: "UPSC Recruitment 2026 Notification No. 12/UPSC. Apply from 01 Aug 2026 to 20 Aug 2026 at https://upsc.gov.in",
    company: "UPSC",
    description: "UPSC Recruitment 2026 Notification No. 12/UPSC",
  });

  assert.equal(facts.claimedOrganization, "UPSC");
  assert.equal(facts.notificationNumber, "12/UPSC");
  assert.equal(facts.recruitmentYear, "2026");
  assert.equal(facts.sourceUrl, "https://upsc.gov.in");
});
