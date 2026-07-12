export interface EmailResult {
  passed: boolean;
  score: number;
  message: string;
}

const officialDomains = [
  ".gov.in",
  ".nic.in",
  ".gov",
  ".org",
  ".edu",
];

export function verifyEmail(
  email: string
): EmailResult {

  if (!email) {
    return {
      passed: false,
      score: 0,
      message: "Email missing",
    };
  }

  const domain = email.toLowerCase();

  const official =
    officialDomains.some(d => domain.endsWith(d));

  return {
    passed: official,
    score: official ? 10 : 4,
    message: official
      ? "Official Email"
      : "Private Email Domain",
  };
}