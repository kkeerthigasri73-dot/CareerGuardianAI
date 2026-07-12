export interface HTTPSResult {
  passed: boolean;
  score: number;
  message: string;
}

export function verifyHTTPS(
  website: string
): HTTPSResult {

  if (!website) {
    return {
      passed: false,
      score: 0,
      message: "No Website",
    };
  }

  return {
    passed: website.startsWith("https://"),
    score: website.startsWith("https://")
      ? 5
      : 0,
    message: website.startsWith("https://")
      ? "HTTPS Enabled"
      : "HTTPS Missing",
  };
}