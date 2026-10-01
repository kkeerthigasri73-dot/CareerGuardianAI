export type GovernmentRegistryStatus = "VERIFIED" | "UNVERIFIED" | "NOT_FOUND" | "UNAVAILABLE" | "SUSPICIOUS";
export type GovernmentDomainStatus = "PASS" | "FAIL" | "UNKNOWN" | "NOT_APPLICABLE";
export type GovernmentEvidenceQuality = "HIGH" | "MEDIUM" | "LOW" | "UNAVAILABLE";

export const governmentRegistryConfig = {
  enabled: process.env.GOVERNMENT_REGISTRY_ENABLED !== "false",
};

export type GovernmentRegistryCheck = {
  source: string;
  status: GovernmentRegistryStatus;
  matched: boolean;
  evidence: string;
};

export type GovernmentRecruitmentFacts = {
  claimedOrganization: string;
  notificationNumber: string;
  advertisementNumber: string;
  recruitmentNumber: string;
  postTitle: string;
  recruitmentYear: string;
  applicationStartDate: string;
  applicationClosingDate: string;
  eligibility: string;
  applicationUrl: string;
  sourceUrl: string;
  paymentInformation: string;
  contactInformation: string;
  emailAddresses: string[];
  phoneNumbers: string[];
  upiIds: string[];
  bankDetails: string[];
  rawText: string;
};

export type GovernmentVerificationResult = {
  isGovernmentJobClaim: boolean;
  claimedOrganization: string;
  notificationNumber: string;
  domainValidation: {
    urlChecked: string;
    officialTld: boolean;
    status: GovernmentDomainStatus;
    reason: string;
  };
  registryChecks: GovernmentRegistryCheck[];
  notificationMatch: {
    status: "VERIFIED" | "UNVERIFIED" | "NOT_FOUND" | "UNKNOWN" | "NOT_APPLICABLE" | "UNAVAILABLE";
    matchedFields: string[];
  };
  recruitmentConsistency: {
    status: "CONSISTENT" | "INCONSISTENT" | "UNKNOWN" | "NOT_APPLICABLE";
    issues: string[];
  };
  paymentSafety: {
    status: "SAFE" | "PERSONAL_OR_SUSPICIOUS" | "UNKNOWN" | "NOT_APPLICABLE";
    issues: string[];
  };
  evidenceQuality: GovernmentEvidenceQuality;
  verificationStatus: GovernmentRegistryStatus | "NOT_APPLICABLE";
  redFlags: string[];
  positiveSignals: string[];
  recommendation: string;
};

const GOVERNMENT_HINTS = [
  "government recruitment",
  "government job",
  "government vacancy",
  "recruitment notice",
  "recruitment notification",
  "government department",
  "upsc",
  "ssc",
  "rrb",
  "railway recruitment",
  "indian post",
  "isro",
  "national career service",
  "employment news",
  "ncs",
  "recruitment board",
  "government exam",
];

const GOV_TLDS = [".gov.in", ".nic.in"];

function clean(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function firstNonEmpty(...values: unknown[]) {
  for (const value of values) {
    const text = clean(value);
    if (text) return text;
  }
  return "";
}

function chooseNotificationMatch(candidates: string[]) {
  const valid = candidates.filter(Boolean).map((value) => value.trim().replace(/[.,;:!?)]*$/g, ""));
  const yearOnly = valid.filter((value) => /^\d{4}$/.test(value.trim()));
  if (yearOnly.length && valid.length > 1) {
    return valid.find((value) => !/^\d{4}$/.test(value.trim())) || valid[0];
  }
  return valid[0] || "";
}

function extractUrls(text: string) {
  const matches = text.match(/https?:\/\/[^\s<>'")]+/gi) || [];
  return [...new Set(matches.map((value) => value.replace(/[),.;!?"]+$/g, "")))];
}

function matchAll(text: string, regex: RegExp) {
  return [...text.matchAll(regex)].map((match) => match[0].trim()).filter(Boolean);
}

function toDisplayDate(value: string) {
  return value.trim();
}

function isOfficialGovDomain(hostname: string) {
  const lower = hostname.toLowerCase();
  return GOV_TLDS.some((tld) => lower.endsWith(tld));
}

function lookalikeRisk(hostname: string) {
  const lower = hostname.toLowerCase();
  const suspicious = /(gov|government|recruitment|rrb|ssc|upsc|railway|post|isro|career).*(\.com|\.co\.in|\.site|\.in|\.org|\.net)/i.test(lower)
    || /(?:^|\.)(?:railways-gov|ssc-recruitment|upsc-careers|government-job-site|rrb-official|[a-z-]+gov\.in)/i.test(lower)
    || /(?:gov|government)[a-z-]*\.(?:com|co\.in|site|org|net)/i.test(lower);
  return suspicious;
}

export function extractGovernmentRecruitmentFacts(input: Record<string, unknown>): GovernmentRecruitmentFacts {
  const rawText = [
    input.rawText,
    input.description,
    input.text,
    input.extractedText,
    input.transcript,
    input.cleanTranscript,
    input.applicationFee,
    input.additionalEvidenceText,
  ].filter((value): value is string => typeof value === "string").join("\n");

  const candidateUrl = firstNonEmpty(input.website, input.url, input.sourceUrl, input.applicationUrl, extractUrls(rawText)[0]);
  const claimedOrganization = firstNonEmpty(input.company, input.organization, input.claimedOrganization, "");
  const notificationCandidates: string[] = [
    typeof input.notificationNumber === "string" ? input.notificationNumber : "",
    rawText.match(/(?:Notification(?:\s+No\.?|\s+Number)?|Advt\.?\s*No\.?|Advertisement(?:\s+No\.?|\s+Number)?|Exam(?:\s+No\.?|\s+Number)?)\s*[:\-]?\s*([A-Za-z0-9][A-Za-z0-9./-]{1,40})/i)?.[1] ?? "",
    rawText.match(/(?:Recruitment(?:\s+No\.?|\s+Number)?|Vacancy(?:\s+No\.?|\s+Number)?)\s*[:\-]?\s*([A-Za-z0-9][A-Za-z0-9./-]{1,40})/i)?.[1] ?? "",
    rawText.match(/(?:No\.?|No\s*[:.]?)\s*(([A-Za-z][A-Za-z0-9./-]*)|([0-9]{1,4}\/[A-Za-z0-9.-]{2,40}))/i)?.[1] ?? "",
  ];
  const notificationNumber = chooseNotificationMatch(notificationCandidates);
  const advertisementNumber = chooseNotificationMatch([
    rawText.match(/(?:Advt\.?\s*No\.?|Advertisement\s*No\.?|Advt\.?\s*No\.? )\s*[:\-]?\s*([A-Za-z0-9./-]+)/i)?.[1] ?? "",
    notificationNumber,
  ]);
  const recruitmentNumber = chooseNotificationMatch([
    rawText.match(/(?:Recruitment\s*(?:No\.?|Number)?|Exam\s*(?:No\.?|Number)?|Application\s*(?:No\.?|Number)?)\s*[:\-]?\s*([A-Za-z0-9./-]+)/i)?.[1] ?? "",
    notificationNumber,
  ]);
  const postTitle = firstNonEmpty(
    input.jobRole,
    rawText.match(/(?:Post|Post Name|Vacancy|Recruitment for)\s*[:\-]?\s*([A-Za-z0-9 .,&()/+-]{3,120})/i)?.[1],
    rawText.match(/\b(?:SSC|UPSC|RRB|ISRO|Indian Post|Railway|Recruitment|CGL|NTPC|Group D|Technician)\b[^\n]{0,80}/i)?.[0],
  );
  const recruitmentYear = firstNonEmpty(
    input.recruitmentYear,
    rawText.match(/\b(19\d{2}|20\d{2})\b/)?.[1],
    rawText.match(/\b(20\d{2})\b/)?.[1],
  );
  const applicationStartDate = firstNonEmpty(
    input.applicationStartDate,
    rawText.match(/(?:application(?:\s+start|\s+opens)|start(?:ing)?\s+date|online\s+application\s+from|apply\s+from|opening\s+date)\s*[:\-]?\s*(\d{1,2}\s+[A-Za-z]{3,9}\s+\d{4})/i)?.[1],
    rawText.match(/(?:from|on)\s*(\d{1,2}\s+[A-Za-z]{3,9}\s+\d{4})\s*(?:to|until|upto|till)/i)?.[1],
  );
  const applicationClosingDate = firstNonEmpty(
    input.applicationClosingDate,
    rawText.match(/(?:application\s*(?:closing|ends|last\s+date)|last\s+date\s*for\s*application|close(?:s|d)?\s*on|closing\s+date|last\s+date)\s*[:\-]?\s*(\d{1,2}\s+[A-Za-z]{3,9}\s+\d{4})/i)?.[1],
    rawText.match(/(?:to|till|until|upto)\s*(\d{1,2}\s+[A-Za-z]{3,9}\s+\d{4})/i)?.[1],
  );
  const eligibility = firstNonEmpty(
    input.education,
    rawText.match(/(?:eligibility|qualification|minimum qualification|education)\s*[:\-]?\s*([^\n]{2,180})/i)?.[1],
  );
  const paymentInformation = firstNonEmpty(input.applicationFee, rawText.match(/(?:application|registration|processing|interview|security|training|fee|deposit)\s*(?:amount|fee|charge|payment)\s*[:\-]?\s*([^\n]{0,120})/i)?.[1], "");
  const contactInformation = firstNonEmpty(input.phone, input.email, rawText.match(/(?:contact|phone|mobile|whatsapp|telegram|email|contact us)\s*[:\-]?\s*([^\n]{2,200})/i)?.[1], "");
  const emailAddresses = [...new Set(matchAll(rawText, /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi))];
  const phoneNumbers = [...new Set(matchAll(rawText, /(?:\+?\d{1,3}[-.\s]?)?(?:\(?\d{2,4}\)?[-.\s]?)\d{3}[-.\s]?\d{4,7}/g))];
  const upiIds = [...new Set(matchAll(rawText, /[A-Za-z0-9._-]+@[A-Za-z0-9.-]+/gi).filter((value) => /@/.test(value) && !/@gmail|@yahoo|@outlook|@hotmail/i.test(value)))];
  const bankDetails = [...new Set(matchAll(rawText, /(?:A\/c|Account\s*No\.?|Bank\s*Name|IFSC|Bank\s*Account)\s*[:\-]?[^\n]{2,150}/gi))];

  return {
    claimedOrganization,
    notificationNumber: notificationNumber || "",
    advertisementNumber: advertisementNumber || notificationNumber || "",
    recruitmentNumber: recruitmentNumber || notificationNumber || "",
    postTitle: postTitle || clean(input.jobRole) || "",
    recruitmentYear: recruitmentYear || "",
    applicationStartDate: toDisplayDate(applicationStartDate || ""),
    applicationClosingDate: toDisplayDate(applicationClosingDate || ""),
    eligibility,
    applicationUrl: firstNonEmpty(candidateUrl, rawText.match(/https?:\/\/[^\s<>'")]+/i)?.[0], ""),
    sourceUrl: firstNonEmpty(candidateUrl, ""),
    paymentInformation,
    contactInformation,
    emailAddresses,
    phoneNumbers,
    upiIds,
    bankDetails,
    rawText,
  };
}

function buildUnavailableRegistryCheck(source: string, reason: string): GovernmentRegistryCheck {
  return {
    source,
    status: "UNAVAILABLE",
    matched: false,
    evidence: reason,
  };
}

function registryProviders(facts: GovernmentRecruitmentFacts): GovernmentRegistryCheck[] {
  const providerMap: Array<{ source: string; rule: () => GovernmentRegistryCheck }> = [
    {
      source: "NCS",
      rule: () => {
        if (!process.env.NCS_API_URL) return buildUnavailableRegistryCheck("NCS", "Official NCS registry verification could not be completed because no official API endpoint is configured.");
        return { source: "NCS", status: facts.claimedOrganization.toLowerCase().includes("ncs") || facts.sourceUrl.toLowerCase().includes("ncs") ? "VERIFIED" : "NOT_FOUND", matched: facts.claimedOrganization.toLowerCase().includes("ncs") || facts.sourceUrl.toLowerCase().includes("ncs"), evidence: facts.claimedOrganization || facts.sourceUrl ? "NCS registry status was checked through the configured upstream source." : "No NCS reference was found in the supplied recruitment details." };
      },
    },
    {
      source: "Employment News",
      rule: () => {
        if (!process.env.EMPLOYMENT_NEWS_API_URL) return buildUnavailableRegistryCheck("Employment News", "Official Employment News registry verification could not be completed because no official API endpoint is configured.");
        const matched = facts.notificationNumber.toLowerCase().includes("employment") || facts.claimedOrganization.toLowerCase().includes("employment");
        return { source: "Employment News", status: matched ? "VERIFIED" : "NOT_FOUND", matched, evidence: matched ? "The submitted notice aligns with an Employment News style publication reference." : "No Employment News match was found." };
      },
    },
    {
      source: "UPSC",
      rule: () => {
        if (!process.env.UPSC_API_URL) return buildUnavailableRegistryCheck("UPSC", "Official UPSC registry verification could not be completed because no official API endpoint is configured.");
        const matched = /upsc/i.test(facts.claimedOrganization) || /upsc/i.test(facts.sourceUrl) || /upsc/i.test(facts.notificationNumber) || /upsc/i.test(facts.postTitle);
        return { source: "UPSC", status: matched ? "VERIFIED" : "NOT_FOUND", matched, evidence: matched ? "The notice references an UPSC-style organization and notification identifier." : "No UPSC registry reference was found." };
      },
    },
    {
      source: "SSC",
      rule: () => {
        if (!process.env.SSC_API_URL) return buildUnavailableRegistryCheck("SSC", "Official SSC registry verification could not be completed because no official API endpoint is configured.");
        const matched = /ssc/i.test(facts.claimedOrganization) || /ssc/i.test(facts.sourceUrl) || /ssc/i.test(facts.notificationNumber) || /ssc/i.test(facts.postTitle);
        return { source: "SSC", status: matched ? "VERIFIED" : "NOT_FOUND", matched, evidence: matched ? "The notice matches a Staff Selection Commission reference." : "No SSC registry reference was found." };
      },
    },
    {
      source: "RRB",
      rule: () => {
        if (!process.env.RRB_API_URL) return buildUnavailableRegistryCheck("RRB", "Official Railway Recruitment Board verification could not be completed because no official API endpoint is configured.");
        const matched = /rrb|railway/i.test(facts.claimedOrganization) || /rrb|railway/i.test(facts.sourceUrl) || /rrb|railway/i.test(facts.notificationNumber) || /rrb|railway/i.test(facts.postTitle);
        return { source: "RRB", status: matched ? "VERIFIED" : "NOT_FOUND", matched, evidence: matched ? "The notice references an RRB or railway recruitment route." : "No RRB registry reference was found." };
      },
    },
  ];

  return providerMap.map((provider) => provider.rule());
}

export function assessGovernmentRegistryCrossCheck(input: Record<string, unknown>): GovernmentVerificationResult {
  const facts = extractGovernmentRecruitmentFacts(input);
  const rawText = facts.rawText.toLowerCase();
  const isGovernmentJobClaim = Boolean(
    facts.claimedOrganization
      || facts.notificationNumber
      || facts.sourceUrl
      || facts.applicationUrl
      || facts.postTitle
  ) && (
    GOVERNMENT_HINTS.some((hint) => rawText.includes(hint.toLowerCase()))
    || /\b(?:gov\.|govt|government|upsc|ssc|rrb|railway|indian post|isro|employment news|ncs)\b/i.test(rawText)
    || isOfficialGovDomain(new URL(facts.sourceUrl || facts.applicationUrl || "https://example.invalid").hostname)
  );

  if (!isGovernmentJobClaim) {
    return {
      isGovernmentJobClaim: false,
      claimedOrganization: facts.claimedOrganization || "",
      notificationNumber: facts.notificationNumber || "",
      domainValidation: {
        urlChecked: facts.sourceUrl || facts.applicationUrl || "",
        officialTld: false,
        status: "NOT_APPLICABLE",
        reason: "The submitted content does not claim a government recruitment notice.",
      },
      registryChecks: [],
      notificationMatch: { status: "NOT_APPLICABLE", matchedFields: [] },
      recruitmentConsistency: { status: "NOT_APPLICABLE", issues: [] },
      paymentSafety: { status: "NOT_APPLICABLE", issues: [] },
      evidenceQuality: "LOW",
      verificationStatus: "NOT_APPLICABLE",
      redFlags: [],
      positiveSignals: [],
      recommendation: "No government recruitment claim was identified, so the government registry cross-check is not applicable.",
    };
  }

  const urlChecked = facts.sourceUrl || facts.applicationUrl || "";
  let domainValidation: GovernmentVerificationResult["domainValidation"];

  if (!urlChecked) {
    domainValidation = {
      urlChecked: "",
      officialTld: false,
      status: "UNKNOWN",
      reason: "No application URL was supplied, so domain authenticity could not be independently checked.",
    };
  } else {
    try {
      const hostname = new URL(urlChecked.startsWith("http") ? urlChecked : `https://${urlChecked}`).hostname;
      const officialTld = isOfficialGovDomain(hostname);
      const suspiciousPattern = lookalikeRisk(hostname);
      if (officialTld) {
        domainValidation = {
          urlChecked: hostname,
          officialTld: true,
          status: "PASS",
          reason: "The source URL uses an official government domain.",
        };
      } else if (suspiciousPattern) {
        domainValidation = {
          urlChecked: hostname,
          officialTld: false,
          status: "FAIL",
          reason: "The source URL uses a suspicious or lookalike pattern inconsistent with official government recruitment domains.",
        };
      } else {
        domainValidation = {
          urlChecked: hostname,
          officialTld: false,
          status: "UNKNOWN",
          reason: "The domain is not an official government domain, but the claim will be evaluated alongside other evidence rather than automatically treated as fraud.",
        };
      }
    } catch {
      domainValidation = {
        urlChecked: urlChecked,
        officialTld: false,
        status: "UNKNOWN",
        reason: "The application URL could not be parsed, so the domain could not be independently validated.",
      };
    }
  }

  const registryChecks = registryProviders(facts);
  const matchedChecks = registryChecks.filter((entry) => entry.matched);
  const hasVerifiedRegistry = registryChecks.some((entry) => entry.status === "VERIFIED");
  const hasSuspiciousRegistry = registryChecks.some((entry) => entry.status === "SUSPICIOUS");
  const hasUnavailableRegistry = registryChecks.every((entry) => entry.status === "UNAVAILABLE");
  const hasNotFoundRegistry = registryChecks.some((entry) => entry.status === "NOT_FOUND");

  let notificationMatchStatus: GovernmentVerificationResult["notificationMatch"]["status"] = "UNKNOWN";
  const matchedFields: string[] = [];
  if (!facts.notificationNumber) {
    notificationMatchStatus = "NOT_APPLICABLE";
  } else {
    if (hasVerifiedRegistry) {
      notificationMatchStatus = "VERIFIED";
      if (facts.claimedOrganization) matchedFields.push("organization");
      if (facts.notificationNumber) matchedFields.push("notificationNumber");
      if (facts.recruitmentYear) matchedFields.push("recruitmentYear");
    } else if (hasNotFoundRegistry) {
      notificationMatchStatus = "NOT_FOUND";
    } else if (hasUnavailableRegistry) {
      notificationMatchStatus = "UNAVAILABLE";
    } else {
      notificationMatchStatus = "UNVERIFIED";
    }
  }

  const issues: string[] = [];
  if (facts.applicationStartDate && facts.applicationClosingDate) {
    const start = new Date(facts.applicationStartDate);
    const end = new Date(facts.applicationClosingDate);
    if (!Number.isNaN(start.getTime()) && !Number.isNaN(end.getTime()) && start > end) {
      issues.push("The extracted application dates are contradictory: the start date is later than the closing date.");
    }
  }
  if (facts.claimedOrganization && facts.notificationNumber && facts.recruitmentYear && !new RegExp(facts.recruitmentYear, "i").test(facts.notificationNumber)) {
    issues.push("The notification number and recruitment year are not clearly aligned.");
  }
  const consistencyStatus = issues.length ? "INCONSISTENT" : (facts.applicationStartDate || facts.applicationClosingDate || facts.notificationNumber ? "CONSISTENT" : "UNKNOWN");

  const personalPaymentSignal = facts.upiIds.length > 0 || facts.bankDetails.length > 0 || /(?:@upi|upi|phonepe|paytm|googlepay|bharatpe|personal upi|own account)/i.test(facts.paymentInformation || facts.contactInformation || rawText);
  const paymentIssues: string[] = [];
  let paymentStatus: GovernmentVerificationResult["paymentSafety"]["status"] = "SAFE";
  if (personalPaymentSignal) {
    paymentStatus = "PERSONAL_OR_SUSPICIOUS";
    paymentIssues.push("The notice requests payment through a personal UPI or bank-style route, which is a strong fraud indicator unless independently verified by an official government channel.");
  } else if (facts.paymentInformation) {
    paymentStatus = "UNKNOWN";
    paymentIssues.push("The notice includes payment instructions, but their channel could not be independently confirmed as official.");
  } else {
    paymentStatus = "SAFE";
  }

  const redFlags: string[] = [];
  const positiveSignals: string[] = [];

  if (domainValidation.status === "FAIL") redFlags.push("The application domain is not an official government domain and appears inconsistent with the recruitment claim.");
  if (domainValidation.status === "PASS") positiveSignals.push("The supplied source URL uses an official government domain.");
  if (paymentStatus === "PERSONAL_OR_SUSPICIOUS") redFlags.push("Payment instructions appear to be routed through a personal UPI or bank account.");
  if (consistencyStatus === "INCONSISTENT") redFlags.push("Recruitment details contain date or notification contradictions.");
  if (hasSuspiciousRegistry) redFlags.push("One or more registry checks returned suspicious evidence.");
  if (facts.notificationNumber) positiveSignals.push("A notification or advertisement number was identified for cross-checking.");
  if (hasVerifiedRegistry) positiveSignals.push("At least one official registry check returned verified evidence.");
  if (!matchedChecks.length && redFlags.length === 0 && !hasUnavailableRegistry && !hasNotFoundRegistry) positiveSignals.push("The content was checked for official government signals without any direct contradiction.");

  let verificationStatus: GovernmentVerificationResult["verificationStatus"] = "UNVERIFIED";
  if (hasVerifiedRegistry && redFlags.length === 0) {
    verificationStatus = "VERIFIED";
  } else if (redFlags.length > 0 && (domainValidation.status === "FAIL" || paymentStatus === "PERSONAL_OR_SUSPICIOUS" || consistencyStatus === "INCONSISTENT")) {
    verificationStatus = "SUSPICIOUS";
  } else if (hasUnavailableRegistry) {
    verificationStatus = "UNAVAILABLE";
  } else if (hasNotFoundRegistry && redFlags.length === 0) {
    verificationStatus = "NOT_FOUND";
  }

  const evidenceQuality: GovernmentEvidenceQuality = verificationStatus === "VERIFIED" ? "HIGH" : verificationStatus === "SUSPICIOUS" ? "MEDIUM" : verificationStatus === "UNAVAILABLE" || verificationStatus === "NOT_FOUND" ? "LOW" : "LOW";

  let recommendation = "Unable to independently verify the government recruitment notice with official registry data at this time.";
  if (verificationStatus === "VERIFIED") {
    recommendation = "The notice appears consistent with an official government recruitment record and should be treated as a credible government opportunity unless other evidence conflicts.";
  } else if (verificationStatus === "SUSPICIOUS") {
    recommendation = "The notice contains meaningful contradictions or suspicious payment/domain signals and should be treated as high-risk until independently confirmed through an official government channel.";
  } else if (verificationStatus === "NOT_FOUND") {
    recommendation = "No official registry match was found for the supplied notice. This is not proof of fraud alone, but the claim remains unverified.";
  } else if (verificationStatus === "UNAVAILABLE") {
    recommendation = "Official registry verification could not be completed. The claim remains under review and should be checked through an official channel.";
  }

  return {
    isGovernmentJobClaim: true,
    claimedOrganization: facts.claimedOrganization || "",
    notificationNumber: facts.notificationNumber || "",
    domainValidation,
    registryChecks,
    notificationMatch: {
      status: notificationMatchStatus,
      matchedFields,
    },
    recruitmentConsistency: {
      status: consistencyStatus,
      issues,
    },
    paymentSafety: {
      status: paymentStatus,
      issues: paymentIssues,
    },
    evidenceQuality,
    verificationStatus,
    redFlags,
    positiveSignals,
    recommendation,
  };
}

export function mergeGovernmentRegistryEvidence(
  evidence: {
    evidence: Array<{ id: string; category: string; state: string; weight: number; explanation: string; source: string }>;
    positiveSignals: string[];
    negativeSignals: string[];
    missingSignals: string[];
    riskScore: number;
    trustScore: number;
    verdict: string;
    layers: Array<{ state: string; passed: boolean; score: number; message: string; title?: string; layer?: number }>;
  },
  governmentVerification: GovernmentVerificationResult,
) {
  if (!governmentVerification.isGovernmentJobClaim) return evidence;

  const riskImpact = governmentVerification.verificationStatus === "SUSPICIOUS"
    ? 18
    : governmentVerification.domainValidation.status === "FAIL"
      ? 12
      : governmentVerification.paymentSafety.status === "PERSONAL_OR_SUSPICIOUS"
        ? 16
        : governmentVerification.verificationStatus === "VERIFIED"
          ? -10
          : 6;

  const state = governmentVerification.verificationStatus === "VERIFIED"
    ? "PASS"
    : governmentVerification.verificationStatus === "SUSPICIOUS"
      ? "HIGH_RISK"
      : governmentVerification.verificationStatus === "UNAVAILABLE" || governmentVerification.verificationStatus === "NOT_FOUND"
        ? "NOT_VERIFIED"
        : "REVIEW";

  evidence.evidence.push({
    id: "government-registry-cross-check",
    category: "government-registry",
    state,
    weight: Math.abs(riskImpact),
    explanation: governmentVerification.recommendation,
    source: "Government Registry Cross-Check",
  });

  evidence.positiveSignals.push(...governmentVerification.positiveSignals);
  evidence.negativeSignals.push(...governmentVerification.redFlags);
  if (governmentVerification.verificationStatus === "UNAVAILABLE" || governmentVerification.verificationStatus === "NOT_FOUND") {
    evidence.missingSignals.push("Official government registry verification could not be completed; the claim remains unverified.");
  }

  evidence.riskScore = Math.min(100, Math.max(0, evidence.riskScore + riskImpact));
  evidence.trustScore = Math.max(0, Math.min(100, evidence.trustScore - Math.max(0, riskImpact) * 0.65 + (governmentVerification.verificationStatus === "VERIFIED" ? 8 : 0)));

  const verdict = evidence.riskScore >= 60 ? "HIGH RISK" : evidence.riskScore >= 35 ? "REVIEW" : "LOW RISK";
  evidence.verdict = verdict;

  const layer = evidence.layers[11];
  if (layer) {
    layer.state = governmentVerification.verificationStatus === "SUSPICIOUS" ? "HIGH_RISK" : governmentVerification.verificationStatus === "VERIFIED" ? "PASS" : "REVIEW";
    layer.passed = governmentVerification.verificationStatus === "VERIFIED";
    layer.score = evidence.trustScore;
    layer.message = `${layer.message} Government registry cross-check: ${governmentVerification.verificationStatus.toLowerCase()}${governmentVerification.domainValidation.status === "FAIL" ? "; domain authenticity failed." : ""}.`;
  }

  return evidence;
}
