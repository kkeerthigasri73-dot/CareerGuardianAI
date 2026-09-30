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
  if (!website || !website.trim()) {
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

    // Remove spaces that may come from OCR
    url = url.replace(/\s/g, "");

    // Add HTTPS if OCR extracted only the domain
    if (!/^https?:\/\//i.test(url)) {
      url = `https://${url}`;
    }

    const timeoutSignal = AbortSignal.timeout(8000);
    let response = await fetch(url, {
      method: "HEAD",
      redirect: "follow",
      signal: timeoutSignal,
    });

    // Some websites block HEAD requests
    // Try GET if HEAD fails
    if (!response.ok) {
      response = await fetch(url, {
        method: "GET",
        redirect: "follow",
        signal: timeoutSignal,
      });
    }

    const finalUrl = response.url || url;

    const ssl = finalUrl.startsWith("https://");

    const govt =
      finalUrl.includes(".gov.in") ||
      finalUrl.includes(".nic.in") ||
      finalUrl.includes(".gov");

    if (!response.ok) {
      return {
        passed: false,
        score: 0,
        status: response.status.toString(),
        ssl,
        government: govt,
        message: "Website could not be verified",
      };
    }

    return {
      passed: true,
      score: govt ? 15 : 10,
      status: response.status.toString(),
      ssl,
      government: govt,
      message: govt
        ? "Official Government Website Verified"
        : "Official Website Reachable",
    };
  } catch (error) {
    return {
      passed: false,
      score: 0,
      status: "Offline",
      ssl: false,
      government: false,
      message: error instanceof Error && error.name === "TimeoutError" ? "Website check timed out" : "Website unreachable",
    };
  }
}
