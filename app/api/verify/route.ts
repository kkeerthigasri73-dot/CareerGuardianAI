import { NextResponse } from "next/server";
import { verifyDomain } from "@/lib/live/domain";
import { verifyEmail } from "@/lib/live/email";
import { fuseRecruitmentEvidence } from "@/lib/evidenceFusion";
import connectDB from "@/lib/mongodb";
import Verification from "@/models/Verification";
import User from "@/models/User";
import { calculateBadges } from "@/lib/badges";
import groq from "@/lib/groq";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { company, website, email, phone, salary, notificationNumber, applicationFee, education, jobRole, description, userId } = body;
    const domain = await verifyDomain(website || "");
    const emailResult = verifyEmail(email || "", website || "");
    const evidence = fuseRecruitmentEvidence(body, domain, emailResult);
    let aiExplanation = "";
    try {
      const explanationResponse = await groq.chat.completions.create({
        model: "openai/gpt-oss-120b",
        temperature: 0,
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content: 'You are CareerGuardian AI Trust Engine. Explain the supplied structured recruitment assessment accurately. Respond in selectedApplicationLanguage when possible. Distinguish supporting, risk, missing, and conflicting evidence. Missing evidence does not mean fraud. A call, personal phone, informal language, accent, grammar, or lack of a public posting is not fraud by itself. Treat transcription as evidence, not proof. Use only supplied timestamped excerpts; do not invent quotes, timestamps, or speaker identities. Prioritize actual payment demands, credential requests, domain conflicts, impersonation, and contradictions. Never change supplied scores or verdict. Return JSON only with a summary string.'
          },
          {
            role: "user",
            content: JSON.stringify({
              sourceType: evidence.sourceType,
              inputType: body.inputType || "unknown",
              inputMethod: body.inputMethod || "unknown",
              selectedApplicationLanguage: body.selectedApplicationLanguage || "en",
              extractedData: { company, jobRole, website, email, phone, salary, applicationFee },
              recording: body.inputType === "recording" ? {
                transcript: typeof body.transcript === "string" ? body.transcript.slice(0, 20000) : "",
                transcriptSegments: (body.transcriptSegments || []).slice(0, 80),
                keyEvidence: body.keyEvidence || [], repeatedEvidence: body.repeatedEvidence || [],
                recordingRiskSignals: body.recordingRiskSignals,
                transcriptLanguage: body.transcriptLanguage,
                duration: body.recordingDuration,
                additionalEvidenceSource: body.additionalEvidenceSource || "",
              } : undefined,
              evidence: evidence.evidence,
              positiveSignals: evidence.positiveSignals,
              negativeSignals: evidence.negativeSignals,
              missingSignals: evidence.missingSignals,
              riskScore: evidence.riskScore,
              verificationConfidence: evidence.verificationConfidence,
              sourceConfidence: evidence.sourceConfidence,
              evidenceCoverage: evidence.evidenceCoverage,
              verdict: evidence.verdict,
              recommendedAction: evidence.recommendedAction,
            }),
          },
        ],
      });
      const reply = explanationResponse.choices[0]?.message?.content || "{}";
      const parsed = JSON.parse(reply);
      if (typeof parsed.summary === "string") aiExplanation = parsed.summary.slice(0, 1200);
    } catch {
      aiExplanation = "";
    }
    const layers = evidence.layers;
    // The original response fields remain available for existing consumers.
    const verdict = evidence.verdict;
    await connectDB();
    const savedVerification = await Verification.create({
      userId: userId || "demo-user", company: company || "", jobRole: jobRole || "",
      trustScore: evidence.trustScore, status: verdict, layers, website: website || "",
      email: email || "", phone: phone || "", salary: salary || "",
      notificationNumber: notificationNumber || "", applicationFee: applicationFee || "",
      education: education || "", description: description || "",
      sourceType: evidence.sourceType, riskScore: evidence.riskScore,
      inputType: body.inputType || "unknown", inputMethod: body.inputMethod || "unknown",
      verificationConfidence: evidence.verificationConfidence, sourceConfidence: evidence.sourceConfidence,
      evidenceCoverage: evidence.evidenceCoverage, evidence: evidence.evidence,
      positiveSignals: evidence.positiveSignals, negativeSignals: evidence.negativeSignals,
      missingSignals: evidence.missingSignals, independentConfirmation: evidence.independentConfirmation,
      recommendedAction: evidence.recommendedAction,
      aiExplanation,
      mediaType: body.mediaType,
      mediaMetadata: body.mediaMetadata,
      recordingDuration: body.recordingDuration,
      transcript: typeof body.transcript === "string" ? body.transcript.slice(0, 200000) : undefined,
      cleanTranscript: typeof body.cleanTranscript === "string" ? body.cleanTranscript.slice(0, 200000) : undefined,
      transcriptLanguage: body.transcriptLanguage,
      selectedApplicationLanguage: body.selectedApplicationLanguage,
      transcriptSegments: Array.isArray(body.transcriptSegments) ? body.transcriptSegments.slice(0, 1500) : undefined,
      keyEvidence: Array.isArray(body.keyEvidence) ? body.keyEvidence.slice(0, 80) : undefined,
      repeatedEvidence: Array.isArray(body.repeatedEvidence) ? body.repeatedEvidence.slice(0, 80) : undefined,
      recordingRiskSignals: body.recordingRiskSignals,
      recordingSummary: body.recordingSummary,
    });
    let unlockedBadges: string[] = [];
    if (userId) {
      const user = await User.findById(userId);
      if (user) {
        user.verificationCount = Number(user.verificationCount || 0) + 1;
        unlockedBadges = calculateBadges(user);
        user.badges = unlockedBadges;
        await user.save();
      }
    }
    return NextResponse.json({
      success: true, trustScore: evidence.trustScore, verdict, layers, unlockedBadges,
      verificationId: String(savedVerification._id),
      riskScore: evidence.riskScore, verificationConfidence: evidence.verificationConfidence,
      sourceConfidence: evidence.sourceConfidence, sourceType: evidence.sourceType,
      evidenceCoverage: evidence.evidenceCoverage, evidence: evidence.evidence,
      inputType: body.inputType || "unknown", inputMethod: body.inputMethod || "unknown",
      sourceLabel: evidence.sourceLabel, positiveSignals: evidence.positiveSignals,
      negativeSignals: evidence.negativeSignals, missingSignals: evidence.missingSignals,
      independentConfirmation: evidence.independentConfirmation,
      recommendedAction: evidence.recommendedAction,
      aiExplanation,
      ...(body.inputType === "recording" ? {
        mediaType: body.mediaType, recordingDuration: body.recordingDuration,
        mediaMetadata: body.mediaMetadata,
        transcript: body.transcript, cleanTranscript: body.cleanTranscript,
        transcriptLanguage: body.transcriptLanguage, selectedApplicationLanguage: body.selectedApplicationLanguage,
        transcriptSegments: body.transcriptSegments, keyEvidence: body.keyEvidence,
        repeatedEvidence: body.repeatedEvidence, recordingRiskSignals: body.recordingRiskSignals,
        recordingSummary: body.recordingSummary,
      } : {}),
    });
  } catch (error) {
    console.error("Verification Error:", error instanceof Error ? error.message : "Unknown error");
    return NextResponse.json({ success: false, message: "Verification failed." }, { status: 500 });
  }
}

