export interface DomainResult {
  passed: boolean;
  score: number;
  status: string;
  ssl: boolean;
  government: boolean;
  message: string;
}

export async function verifyDomain(
  website: string
): Promise<DomainResult> {
  if (!website) {
    return {
      passed: false,
      score: 0,
      status: "Missing",
      ssl: false,
      government: false,
      message: "Website not provided",
    };
  }

  try {
    let url = website.trim();

    if (!url.startsWith("http")) {
      url = "https://" + url;
    }

    const response = await fetch(url, {
      method: "HEAD",
    });

    const ssl = url.startsWith("https://");

    const govt =
      url.includes(".gov.in") ||
      url.includes(".nic.in") ||
      url.includes(".gov");

    return {
      passed: response.ok,
      score: govt ? 15 : 10,
      status: response.status.toString(),
      ssl,
      government: govt,
      message: govt
        ? "Official Government Website"
        : "Website reachable",
    };
  } catch {
    return {
      passed: false,
      score: 0,
      status: "Offline",
      ssl: false,
      government: false,
      message: "Website unreachable",
    };
  }
}