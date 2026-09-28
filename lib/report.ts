import jsPDF from "jspdf";

type ReportLayer = {
  layer?: number;
  title?: string;
  name?: string;
  passed?: boolean;
  score?: number;
  message?: string;
  status?: string;
};

type ReportData = {
  verification?: {
    trustScore?: number;
    verdict?: string;
    layers?: ReportLayer[];
    id?: string;
    _id?: string;
    createdAt?: string;
  };
  company?: string;
  jobRole?: string;
  website?: string;
  email?: string;
  phone?: string;
  salary?: string;
  applicationFee?: string;
  education?: string;
  notificationNumber?: string;
  description?: string;
  generatedAt?: string;
  fileName?: string;
  reference?: string;
};

const PAGE_WIDTH = 210;
const PAGE_HEIGHT = 297;
const MARGIN = 16;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;
const COLORS = {
  navy: [11, 28, 58] as const,
  blue: [37, 99, 235] as const,
  cyan: [6, 182, 212] as const,
  violet: [124, 58, 237] as const,
  ink: [30, 41, 59] as const,
  muted: [100, 116, 139] as const,
  line: [226, 232, 240] as const,
  pale: [248, 250, 252] as const,
  white: [255, 255, 255] as const,
  green: [22, 163, 74] as const,
  amber: [217, 119, 6] as const,
  red: [220, 38, 38] as const,
};
type Rgb = readonly [number, number, number];

function setFill(doc: jsPDF, color: Rgb) { doc.setFillColor(...color); }
function setStroke(doc: jsPDF, color: Rgb) { doc.setDrawColor(...color); }
function setText(doc: jsPDF, color: Rgb) { doc.setTextColor(...color); }
function clean(value: unknown, fallback = "Not available") {
  return value === undefined || value === null || String(value).trim() === "" ? fallback : String(value).trim();
}
function truncate(value: string, length = 48) { return value.length > length ? `${value.slice(0, length - 1)}...` : value; }
function writeWrapped(doc: jsPDF, value: string, x: number, y: number, width: number, size = 9, color: Rgb = COLORS.ink, font = "normal") {
  doc.setFont("helvetica", font); doc.setFontSize(size); setText(doc, color);
  const lines = doc.splitTextToSize(clean(value), width) as string[];
  doc.text(lines, x, y); return lines.length * (size * 0.42);
}
function roundedCard(doc: jsPDF, x: number, y: number, width: number, height: number, fill: Rgb = COLORS.white, border: Rgb = COLORS.line) {
  setFill(doc, fill); setStroke(doc, border); doc.setLineWidth(0.35); doc.roundedRect(x, y, width, height, 3, 3, "FD");
}
function sectionLabel(doc: jsPDF, label: string, x: number, y: number) {
  doc.setFont("helvetica", "bold"); doc.setFontSize(8); setText(doc, COLORS.blue); doc.text(label.toUpperCase(), x, y);
  setStroke(doc, COLORS.cyan); doc.setLineWidth(1.2); doc.line(x, y + 3, x + 18, y + 3);
}
function pageTitle(doc: jsPDF, eyebrow: string, title: string, page: number) {
  setFill(doc, COLORS.navy); doc.rect(0, 0, PAGE_WIDTH, 27, "F");
  doc.setFont("helvetica", "bold"); doc.setFontSize(9); setText(doc, COLORS.cyan); doc.text("CAREERGUARDIAN AI", MARGIN, 10);
  doc.setFontSize(7); setText(doc, [186, 204, 229]); doc.text(eyebrow.toUpperCase(), MARGIN, 17);
  doc.setFontSize(8); doc.text(`${String(page).padStart(2, "0")} / 05`, PAGE_WIDTH - MARGIN, 14, { align: "right" });
  doc.setFontSize(20); setText(doc, COLORS.navy); doc.text(title, MARGIN, 43);
}
function footer(doc: jsPDF, data: ReportData, page: number, generatedAt: string) {
  const y = PAGE_HEIGHT - 15; setStroke(doc, COLORS.line); doc.setLineWidth(0.35); doc.line(MARGIN, y - 5, PAGE_WIDTH - MARGIN, y - 5);
  doc.setFont("helvetica", "bold"); doc.setFontSize(7); setText(doc, COLORS.navy); doc.text("CAREERGUARDIAN AI", MARGIN, y);
  doc.setFont("helvetica", "normal"); setText(doc, COLORS.muted); doc.text("Verify before you trust. Protect before you proceed.", MARGIN, y + 4);
  doc.text(`ID: ${clean(data.verification?.id || data.verification?._id)}`, PAGE_WIDTH / 2, y, { align: "center" });
  doc.text(`Generated: ${generatedAt}`, PAGE_WIDTH - MARGIN, y, { align: "right" });
  doc.setFontSize(6.5); doc.text("AI-Assisted Recruitment Investigation  •  12-Layer Verification  •  Evidence-Based Analysis", PAGE_WIDTH / 2, y + 8, { align: "center" });
  doc.setFontSize(7); doc.text(`Page ${page} of 5`, PAGE_WIDTH - MARGIN, y + 8, { align: "right" });
}
function getLayers(data: ReportData) {
  return [...(data.verification?.layers || [])].sort((a, b) => Number(a.layer || 0) - Number(b.layer || 0)).slice(0, 12);
}
function layerStatus(layer: ReportLayer) {
  const explicit = clean(layer.status, "").toUpperCase();
  if (["PASS", "FAIL", "REVIEW"].includes(explicit)) return explicit;
  if (layer.passed) return "PASS";
  const message = clean(layer.message, "").toLowerCase();
  return !message || /not found|not mentioned|requires review|unavailable|missing/.test(message) ? "REVIEW" : "FAIL";
}
function statusStyle(status: string) {
  if (status === "PASS") return { color: COLORS.green, fill: [240, 253, 244] as Rgb };
  if (status === "REVIEW") return { color: COLORS.amber, fill: [255, 251, 235] as Rgb };
  if (status === "FAIL") return { color: COLORS.red, fill: [254, 242, 242] as Rgb };
  return { color: COLORS.muted, fill: COLORS.pale };
}
function scoreValue(data: ReportData) {
  const score = Number(data.verification?.trustScore);
  return Number.isFinite(score) ? Math.max(0, Math.min(100, Math.round(score))) : null;
}
function drawScore(doc: jsPDF, score: number | null, x: number, y: number) {
  setStroke(doc, [219, 234, 254]); doc.setLineWidth(5); doc.circle(x, y, 27, "S"); setStroke(doc, COLORS.cyan); doc.setLineWidth(2.5);
  for (let index = 0; index < (score === null ? 0 : Math.round(score / 4)); index += 1) {
    const angle = -Math.PI / 2 + (index / 25) * Math.PI * 2; const inner = 24.5; const outer = 29.5;
    doc.line(x + Math.cos(angle) * inner, y + Math.sin(angle) * inner, x + Math.cos(angle) * outer, y + Math.sin(angle) * outer);
  }
  doc.setFont("helvetica", "bold"); doc.setFontSize(24); setText(doc, COLORS.navy); doc.text(score === null ? "--" : `${score}%`, x, y + 3, { align: "center" });
  doc.setFont("helvetica", "normal"); doc.setFontSize(7); setText(doc, COLORS.muted); doc.text("TRUST SCORE", x, y + 11, { align: "center" });
}
function drawStatusBadge(doc: jsPDF, status: string, x: number, y: number, width = 24) {
  const style = statusStyle(status); setFill(doc, style.fill); doc.roundedRect(x, y - 5, width, 8, 2, 2, "F");
  doc.setFont("helvetica", "bold"); doc.setFontSize(7); setText(doc, style.color); doc.text(status, x + width / 2, y, { align: "center" });
}
function drawLayerMini(doc: jsPDF, layer: ReportLayer, x: number, y: number, width: number) {
  const status = layerStatus(layer); const style = statusStyle(status); setFill(doc, style.fill); setStroke(doc, COLORS.line); doc.roundedRect(x, y, width, 13, 2.5, 2.5, "FD");
  setFill(doc, style.color); doc.circle(x + 5, y + 6.5, 2.8, "F"); doc.setFont("helvetica", "bold"); doc.setFontSize(5.5); setText(doc, COLORS.white); doc.text(String(layer.layer || "-"), x + 5, y + 8, { align: "center" });
  doc.setFontSize(5.6); setText(doc, COLORS.ink); doc.text(truncate(clean(layer.title || layer.name), 15), x + 10, y + 6); doc.setFont("helvetica", "normal"); doc.setFontSize(5.3); setText(doc, style.color); doc.text(status, x + 10, y + 11.5);
}
function drawKeyValue(doc: jsPDF, label: string, value: string, x: number, y: number, width: number) {
  doc.setFont("helvetica", "bold"); doc.setFontSize(7); setText(doc, COLORS.muted); doc.text(label.toUpperCase(), x, y); writeWrapped(doc, value, x, y + 6, width, 9, COLORS.ink, "bold");
}

export function generateReport(input: ReportData) {
  const data = input || {};
  const doc = new jsPDF({ format: "a4", unit: "mm", compress: true });
  const layers = getLayers(data);
  const score = scoreValue(data);
  const verdict = clean(data.verification?.verdict, "REVIEW").toUpperCase();
  const generatedAt = new Date(data.generatedAt || Date.now()).toLocaleString();
  const positiveLayers = layers.filter((layer) => layerStatus(layer) === "PASS");
  const riskLayers = layers.filter((layer) => layerStatus(layer) !== "PASS");
  const passedCount = positiveLayers.length;
  const reviewCount = layers.filter((layer) => layerStatus(layer) === "REVIEW").length;

  // Page 1: summary
  pageTitle(doc, "Recruitment investigation dossier", "Investigation Summary", 1);
  writeWrapped(
    doc,
    "A structured assessment of the submitted recruitment information using CareerGuardian AI's 12-layer verification engine.",
    MARGIN,
    51,
    120,
    9,
    COLORS.muted
  );

  roundedCard(doc, MARGIN, 61, CONTENT_WIDTH, 67, [247, 251, 255], [207, 226, 247]);
  drawScore(doc, score, 49, 94);
  const verdictStyle = statusStyle(verdict === "SAFE" ? "PASS" : verdict === "REVIEW" ? "REVIEW" : "FAIL");
  setFill(doc, verdictStyle.fill);
  doc.roundedRect(78, 73, 38, 10, 3, 3, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  setText(doc, verdictStyle.color);
  doc.text(verdict, 97, 80, { align: "center" });
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  setText(doc, COLORS.navy);
  doc.text("AI assessment", 78, 92);
  const summary = data.verification?.verdict
    ? `${verdict} assessment based on ${layers.length || 0} recorded verification layers. ${passedCount} passed and ${reviewCount} require review or attention.`
    : "No final verdict was returned by the verification engine.";
  writeWrapped(doc, summary, 78, 100, 105, 9, COLORS.ink);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);
  setText(doc, COLORS.muted);
  doc.text("ASSESSMENT SCOPE", 78, 118);
  writeWrapped(doc, "Evidence shown in this dossier is limited to the information returned by the verification engine.", 78, 123, 105, 7.5, COLORS.muted);

  sectionLabel(doc, "Investigation metadata", MARGIN, 142);
  roundedCard(doc, MARGIN, 149, CONTENT_WIDTH, 31);
  drawKeyValue(doc, "Investigation ID", clean(data.verification?.id || data.verification?._id), MARGIN + 7, 158, 45);
  drawKeyValue(doc, "Document / reference", clean(data.fileName || data.reference || data.notificationNumber), 77, 158, 48);
  drawKeyValue(doc, "Investigation date", clean(data.verification?.createdAt, generatedAt), 143, 158, 48);

  sectionLabel(doc, "Risk signal overview", MARGIN, 193);
  const signalGroups: ReadonlyArray<readonly [string, readonly number[]]> = [
    ["Organization", [2]],
    ["Website", [3]],
    ["Contact", [4, 5]],
    ["Financial", [6, 9]],
    ["Recruitment language", [7, 11]],
    ["Security", [8]],
  ];
  signalGroups.forEach(([label, numbers], index) => {
    const x = MARGIN + (index % 3) * 60;
    const y = 200 + Math.floor(index / 3) * 25;
    const selected = layers.filter((layer) => numbers.includes(Number(layer.layer)));
    const status = selected.length && selected.every((layer) => layerStatus(layer) === "PASS") ? "PASS" : selected.some((layer) => layerStatus(layer) === "FAIL") ? "FAIL" : "REVIEW";
    const style = statusStyle(status);
    roundedCard(doc, x, y, 55, 19, style.fill, COLORS.line);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.2);
    setText(doc, COLORS.ink);
    doc.text(label, x + 5, y + 8);
    doc.setFontSize(6.5);
    setText(doc, style.color);
    doc.text(status, x + 5, y + 14);
  });

  sectionLabel(doc, "12-layer verification", MARGIN, 247);
  layers.forEach((layer, index) => drawLayerMini(doc, layer, MARGIN + (index % 6) * 30, 252 + Math.floor(index / 6) * 15, 28));
  footer(doc, data, 1, generatedAt);

  // Page 2: all layers
  doc.addPage();
  pageTitle(doc, "Verification evidence", "12-Layer Verification", 2);
  writeWrapped(doc, "Every layer below is rendered from the existing verification response. No assessment values are added by the report generator.", MARGIN, 52, 170, 9, COLORS.muted);
  layers.forEach((layer, index) => {
    const y = 63 + index * 15.5;
    const status = layerStatus(layer);
    const style = statusStyle(status);
    roundedCard(doc, MARGIN, y, CONTENT_WIDTH, 12.5, index % 2 ? COLORS.white : COLORS.pale, COLORS.line);
    setFill(doc, style.color);
    doc.circle(MARGIN + 7, y + 6.2, 3.3, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7);
    setText(doc, COLORS.white);
    doc.text(String(layer.layer || index + 1), MARGIN + 7, y + 8.2, { align: "center" });
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    setText(doc, COLORS.navy);
    doc.text(clean(layer.title || layer.name), MARGIN + 15, y + 5.5);
    writeWrapped(doc, clean(layer.message), MARGIN + 15, y + 10, 119, 7, COLORS.muted);
    drawStatusBadge(doc, status, PAGE_WIDTH - MARGIN - 27, y + 7, 27);
  });
  footer(doc, data, 2, generatedAt);

  // Page 3: flow
  doc.addPage();
  pageTitle(doc, "Processing architecture", "Investigation Flow", 3);
  writeWrapped(doc, "Ordered verification pipeline represented by the engine's recorded layers.", MARGIN, 52, 170, 9, COLORS.muted);
  const flowLabels = [
    "Document / Input",
    ...layers.map((layer) => clean(layer.title || layer.name)),
    "Final Verdict",
  ];
  const flowStepHeight = 15;
  flowLabels.forEach((label, index) => {
    const y = 63 + index * flowStepHeight;
    const isFinal = index === flowLabels.length - 1;
    const layer = layers[index - 1];
    const status = layer ? layerStatus(layer) : isFinal ? (verdict === "SAFE" ? "PASS" : "REVIEW") : "REVIEW";
    const style = statusStyle(status);
    setStroke(doc, index === 0 ? COLORS.cyan : COLORS.line);
    doc.setLineWidth(0.8);
    if (index < flowLabels.length - 1) doc.line(28, y + 5, 28, y + flowStepHeight);
    setFill(doc, isFinal ? COLORS.navy : style.fill);
    setStroke(doc, isFinal ? COLORS.navy : style.color);
    doc.circle(28, y + 5, 4.5, "FD");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7);
    setText(doc, isFinal ? COLORS.white : style.color);
    doc.text(index === 0 ? "IN" : isFinal ? "OK" : String(index), 28, y + 7, { align: "center" });
    roundedCard(doc, 40, y - 2, 150, 14, isFinal ? [240, 246, 255] : COLORS.white, isFinal ? [147, 197, 253] : COLORS.line);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    setText(doc, COLORS.navy);
    doc.text(label, 47, y + 4);
    if (layer) drawStatusBadge(doc, status, 160, y + 5, 24);
  });
  footer(doc, data, 3, generatedAt);

  // Page 4: evidence
  doc.addPage();
  pageTitle(doc, "Evidence register", "Risk & Evidence", 4);
  const evidenceColumns = [
    { title: "Risk indicators detected", items: riskLayers, x: MARGIN, color: COLORS.red },
    { title: "Positive verification signals", items: positiveLayers, x: 108, color: COLORS.green },
  ];
  evidenceColumns.forEach(({ title, items, x, color }) => {
    const width = 86;
    sectionLabel(doc, title, x, 53);
    let y = 62;
    if (items.length === 0) {
      roundedCard(doc, x, y, width, 24, color === COLORS.green ? [240, 253, 244] : COLORS.pale, COLORS.line);
      writeWrapped(doc, `No ${title.toLowerCase()} were returned by the verification engine.`, x + 5, y + 10, width - 10, 7.5, COLORS.muted);
      return;
    }
    items.forEach((layer) => {
      const status = layerStatus(layer);
      const style = statusStyle(status);
      const messageLines = doc.splitTextToSize(clean(layer.message), width - 22) as string[];
      const height = Math.max(18, 10 + Math.min(messageLines.length, 2) * 3.5);
      roundedCard(doc, x, y, width, height, style.fill, COLORS.line);
      setFill(doc, style.color);
      doc.circle(x + 6, y + 7, 2.5, "F");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(7);
      setText(doc, COLORS.navy);
      doc.text(truncate(clean(layer.title || layer.name), 19), x + 12, y + 6.5);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(6.5);
      setText(doc, COLORS.ink);
      doc.text(messageLines.slice(0, 2), x + 12, y + 11);
      y += height + 3;
    });
  });
  footer(doc, data, 4, generatedAt);

  // Page 5: timeline and assessment
  doc.addPage();
  pageTitle(doc, "Audit trail", "Investigation Timeline", 5);
  writeWrapped(doc, "An ordered processing record is shown because exact processing timestamps are not part of the verification response.", MARGIN, 52, 175, 9, COLORS.muted);
  const timeline = [
    "Document uploaded",
    "OCR extraction completed",
    "Organization identified",
    "Website verification completed",
    "Recruiter contact analysis completed",
    "Financial analysis completed",
    "12-layer verification completed",
    "AI trust score generated",
    "Final verdict generated",
  ];
  timeline.forEach((item, index) => {
    const y = 64 + index * 15;
    setStroke(doc, index === timeline.length - 1 ? COLORS.violet : COLORS.line);
    doc.setLineWidth(0.8);
    if (index < timeline.length - 1) doc.line(26, y + 4, 26, y + 15);
    setFill(doc, index === timeline.length - 1 ? COLORS.violet : COLORS.cyan);
    doc.circle(26, y + 4, 3.2, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    setText(doc, COLORS.ink);
    doc.text(item, 37, y + 7);
  });

  roundedCard(doc, MARGIN, 213, CONTENT_WIDTH, 49, [243, 248, 255], [191, 219, 254]);
  sectionLabel(doc, "CareerGuardian AI assessment", MARGIN + 8, 224);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(17);
  setText(doc, COLORS.navy);
  doc.text(verdict, MARGIN + 8, 239);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  setText(doc, COLORS.muted);
  doc.text("Final trust score", MARGIN + 8, 247);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(15);
  setText(doc, COLORS.blue);
  doc.text(score === null ? "Not available" : `${score}%`, MARGIN + 8, 255);
  writeWrapped(doc, "This assessment reflects the evidence returned by the verification engine and is not a legal conclusion or guarantee.", 86, 235, 105, 8.5, COLORS.ink);
  footer(doc, data, 5, generatedAt);

  doc.save("CareerGuardian_Recruitment_Investigation_Report.pdf");
}