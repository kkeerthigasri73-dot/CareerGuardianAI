export interface ScamResult {
  passed: boolean;
  score: number;
  message: string;
}

const keywords = [
  "registration fee",
  "processing fee",
  "pay immediately",
  "urgent joining",
  "100% job",
  "telegram",
  "whatsapp only",
  "guaranteed job",
  "limited vacancy",
  "without interview",
  "without exam",
];

export function detectScam(
  text: string
): ScamResult {

  const content = text.toLowerCase();

  const found = keywords.filter(k =>
    content.includes(k)
  );

  return {
    passed: found.length === 0,
    score: found.length === 0 ? 15 : 0,
    message:
      found.length === 0
        ? "No Scam Keywords"
        : found.join(", "),
  };
}