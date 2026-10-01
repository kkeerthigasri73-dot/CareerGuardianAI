import { createHash, randomUUID } from "crypto";
import connectDB from "@/lib/mongodb";
import ThreatCluster from "@/models/ThreatCluster";

const MAX_TEXT_LENGTH = 30000;
const DEDUPE_WINDOW_MS = 60 * 60 * 1000;
const REPORT_RETENTION_MS = 90 * 86400000;

function config(name: string, fallback: number, min: number, max: number) {
  const value = Number(process.env[name]);
  return Number.isFinite(value) ? Math.max(min, Math.min(max, Math.floor(value))) : fallback;
}

export const threatNetConfig = {
  enabled: process.env.THREATNET_ENABLED === "true",
  similarityThreshold: config("THREATNET_SIMILARITY_THRESHOLD", 85, 50, 100),
  risingReportThreshold: config("THREATNET_RISING_REPORT_THRESHOLD", 3, 2, 1000),
  highActivityThreshold: config("THREATNET_HIGH_ACTIVITY_THRESHOLD", 10, 3, 10000),
};

export function normalizeRecruitmentText(input: string) {
  return input.normalize("NFKC").toLowerCase()
    .replace(/\b(?:https?:\/\/)?(?:www\.)?([^\s/?#]+)(?:\/[^\s]*)?/gi, (_match, host: string) => ` url ${host.toLowerCase()} `)
    .replace(/([\w.+-]+)\s*\[at\]\s*([\w.-]+)\s*\[dot\]\s*(\w+)/gi, "$1@$2.$3")
    .replace(/\b(?:\+?91[\s.-]?)?(\d{5})[\s.-]?(\d{5})\b/g, " phone $1$2 ")
    .replace(/\b(\d{1,2})[/-](\d{1,2})[/-](20\d{2})\b/g, (_m, d: string, mo: string, y: string) => ` date ${y}-${mo.padStart(2,"0")}-${d.padStart(2,"0")} `)
    .replace(/\b(?:rs\.?|inr)\s*/g, " rs ")
    .replace(/₹\s*/g, " rs ")
    .replace(/\b(\w)\1{2,}\b/gi, "$1$1")
    .replace(/[“”‘’]/g, "'")
    .replace(/[^\p{L}\p{N}@._%+-]+/gu, " ")
    .replace(/\s+/g, " ").trim();
}

function shingles(text: string): string[] {
  const tokens = text.split(" ").filter(Boolean);
  if (tokens.length < 4) return tokens;
  const result = new Set<string>();
  for (let i = 0; i <= tokens.length - 3; i++) result.add(tokens.slice(i, i + 3).join(" "));
  return [...result];
}

function similarity(a: string[], b: string[]) {
  if (!a.length || !b.length) return 0;
  const left = new Set(a), right = new Set(b);
  let intersection = 0;
  for (const item of left) if (right.has(item)) intersection++;
  return Math.round(100 * intersection / (left.size + right.size - intersection));
}

const bounded = (values: string[]) => [...new Set(values.filter(Boolean))].slice(0, 30);
const extract = (text: string, regex: RegExp) => bounded([...text.matchAll(regex)].map((m) => m[0]));

export type ThreatIntelligence = {
  matched: boolean; clusterId: string | null; similarityScore: number; reportCount: number;
  reportsLast24Hours: number; reportsLast72Hours: number; firstSeenAt: string | null;
  lastSeenAt: string | null; threatLevel: "NO_MATCH" | "LOCALIZED" | "RISING_TREND" | "HIGH_ACTIVITY";
  evidence: string[];
};

export async function analyzeThreatNet(input: { text: string; company?: string; jobRole?: string; website?: string; phone?: string; notificationNumber?: string }) : Promise<ThreatIntelligence | null> {
  if (!threatNetConfig.enabled) return null;
  const original = input.text.slice(0, MAX_TEXT_LENGTH);
  const normalizedText = normalizeRecruitmentText(original);
  if (normalizedText.length < 30) return emptyResult();
  const contentHash = createHash("sha256").update(normalizedText).digest("hex");
  const signature = shingles(normalizedText);
  const db = await connectDB();
  if (!db) return emptyResult();
  const now = new Date();
  const recentClusters = await ThreatCluster.find({ lastSeenAt: { $gte: new Date(now.getTime() - REPORT_RETENTION_MS) } })
    .select("clusterId contentHash normalizedText similaritySignature reportCount reportTimes firstSeenAt lastSeenAt lastSubmissionAt sampleOrganizations sampleRoles domains phoneNumbers upiIds notificationNumbers locations")
    .limit(500).lean();
  const exact = recentClusters.find((cluster: any) => cluster.contentHash === contentHash);
  let matched: any = exact;
  let score = exact ? 100 : 0;
  if (!matched) {
    for (const cluster of recentClusters as any[]) {
      const candidateScore = similarity(signature, cluster.similaritySignature || shingles(cluster.normalizedText || ""));
      if (candidateScore > score) { score = candidateScore; matched = cluster; }
    }
    if (score < threatNetConfig.similarityThreshold) matched = null;
  }

  const domains = bounded([...extract(original, /(?:https?:\/\/)?(?:www\.)?[a-z0-9-]+(?:\.[a-z0-9-]+)+/gi), ...host(input.website || "")]);
  const phones = bounded(extract(original, /(?:\+?\d[\d ().-]{7,}\d)/g).map((v) => v.replace(/\D/g, "")).filter((v) => v.length >= 10).map((v) => v.slice(-10)));
  const upiIds = bounded(extract(original, /\b[a-z0-9._-]{2,}@[a-z][a-z0-9.-]{1,}\b/gi));
  const update = {
    $set: { lastSeenAt: now },
    $setOnInsert: { clusterId: randomUUID(), contentHash, normalizedText, similaritySignature: signature, firstSeenAt: now, status: "ACTIVE" },
  } as any;
  let cluster: any;
  if (matched) {
    cluster = await ThreatCluster.findOneAndUpdate({ clusterId: matched.clusterId }, update, { new: true });
    if (cluster && (!cluster.lastSubmissionAt || now.getTime() - new Date(cluster.lastSubmissionAt).getTime() > DEDUPE_WINDOW_MS)) {
      cluster.reportCount += 1;
      cluster.reportTimes = [...(cluster.reportTimes || []).filter((date: Date) => new Date(date).getTime() >= now.getTime() - REPORT_RETENTION_MS), now];
      cluster.lastSubmissionAt = now;
      cluster.reportCount = cluster.reportTimes.length;
      cluster.sampleOrganizations = bounded([...(cluster.sampleOrganizations || []), input.company || ""]);
      cluster.sampleRoles = bounded([...(cluster.sampleRoles || []), input.jobRole || ""]);
      cluster.domains = bounded([...(cluster.domains || []), ...domains]);
      cluster.phoneNumbers = bounded([...(cluster.phoneNumbers || []), ...phones]);
      cluster.upiIds = bounded([...(cluster.upiIds || []), ...upiIds]);
      cluster.notificationNumbers = bounded([...(cluster.notificationNumbers || []), input.notificationNumber || ""]);
      await cluster.save();
    }
  } else {
    cluster = await ThreatCluster.create({ ...update.$setOnInsert, reportCount: 1, reportTimes: [now], lastSubmissionAt: now,
      sampleOrganizations: bounded([input.company || ""]), sampleRoles: bounded([input.jobRole || ""]), domains, phoneNumbers: phones,
      upiIds, notificationNumbers: bounded([input.notificationNumber || ""]) });
  }
  if (!cluster) return emptyResult();
  const times = (cluster.reportTimes || []).map((date: Date) => new Date(date).getTime());
  const reportsLast24Hours = times.filter((time: number) => time >= now.getTime() - 86400000).length;
  const reportsLast72Hours = times.filter((time: number) => time >= now.getTime() - 72 * 3600000).length;
  const threatLevel = reportsLast24Hours >= threatNetConfig.highActivityThreshold ? "HIGH_ACTIVITY"
    : cluster.reportCount >= threatNetConfig.risingReportThreshold ? "RISING_TREND" : "LOCALIZED";
  const evidence = [score >= threatNetConfig.similarityThreshold ? "Highly similar recruitment content detected" : "Exact recruitment content detected"];
  if (reportsLast24Hours >= threatNetConfig.risingReportThreshold) evidence.push("Multiple submissions detected within 24 hours");
  console.info(`[ThreatNet] ${exact ? "Exact" : "Fuzzy"} match; score ${score}; report count ${cluster.reportCount}; level ${threatLevel}`);
  return { matched: true, clusterId: cluster.clusterId, similarityScore: score, reportCount: cluster.reportCount,
    reportsLast24Hours, reportsLast72Hours, firstSeenAt: new Date(cluster.firstSeenAt).toISOString(),
    lastSeenAt: new Date(cluster.lastSeenAt).toISOString(), threatLevel, evidence };
}

function host(value: string) { try { return new URL(/^https?:/i.test(value) ? value : `https://${value}`).hostname.toLowerCase().replace(/^www\./, ""); } catch { return ""; } }
function emptyResult(): ThreatIntelligence { return { matched: false, clusterId: null, similarityScore: 0, reportCount: 0, reportsLast24Hours: 0, reportsLast72Hours: 0, firstSeenAt: null, lastSeenAt: null, threatLevel: "NO_MATCH", evidence: [] }; }
