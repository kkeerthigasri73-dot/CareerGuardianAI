"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, ShieldCheck, Trophy } from "lucide-react";
import { useLanguage } from "@/src/context/LanguageContext";

import InputSelector from "@/components/verify/InputSelector";
import UploadZone from "@/components/verify/UploadZone";
import AIThinking from "@/components/verify/AIThinking";
import ExtractedInfo from "@/components/analyze/ExtractedInfo";
import TrustEngine from "@/components/analyze/TrustEngine";
import RecordingEvidencePanel from "@/components/analyze/RecordingEvidencePanel";

async function prepareRecordingAudio(file: File): Promise<{ audioFile: File; mediaType: "audio" | "video"; duration: number }> {
  const isVideo = /\.(mp4|mov|mkv)$/i.test(file.name) || file.type.startsWith("video/");
  const url = URL.createObjectURL(file);
  const element = document.createElement(isVideo ? "video" : "audio") as HTMLVideoElement | HTMLAudioElement;
  element.preload = "metadata";
  element.src = url;
  element.style.position = "fixed"; element.style.left = "-10000px"; element.style.width = "1px"; element.style.height = "1px";
  document.body.appendChild(element);
  let captureStream: MediaStream | null = null;
  let activeRecorder: MediaRecorder | null = null;
  try {
    await new Promise<void>((resolve, reject) => {
      element.onloadedmetadata = () => resolve();
      element.onerror = () => reject(new Error("This recording format could not be opened by your browser."));
    });
    const duration = Number.isFinite(element.duration) ? element.duration : 0;
    if (!duration) throw new Error("Recording duration could not be read.");
    if (!isVideo) return { audioFile: file, mediaType: "audio", duration };
    if (duration > 15 * 60) throw new Error("Recording is longer than 15 minutes. Choose a shorter recording.");
    const captureElement = element as HTMLVideoElement & { captureStream?: () => MediaStream; mozCaptureStream?: () => MediaStream };
    captureStream = captureElement.captureStream?.() || captureElement.mozCaptureStream?.() || null;
    if (!captureStream?.getAudioTracks().length) throw new Error("No speech/audio track could be extracted from this recording.");
    const audioStream = new MediaStream(captureStream.getAudioTracks());
    const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus") ? "audio/webm;codecs=opus" : "audio/webm";
    if (!MediaRecorder.isTypeSupported(mimeType)) throw new Error("This browser cannot extract the audio track. Try Chrome or upload an audio file.");
    const recorder = new MediaRecorder(audioStream, { mimeType });
    activeRecorder = recorder;
    const chunks: BlobPart[] = [];
    const recorded = new Promise<Blob>((resolve, reject) => {
      recorder.ondataavailable = (event) => { if (event.data.size) chunks.push(event.data); };
      recorder.onerror = () => reject(new Error("Audio could not be extracted from this video."));
      recorder.onstop = () => resolve(new Blob(chunks, { type: mimeType }));
    });
    const playbackEnded = new Promise<void>((resolve, reject) => {
      element.onended = () => resolve();
      element.onerror = () => reject(new Error("Video playback stopped before the audio was extracted."));
    });
    recorder.start(1000);
    try { await element.play(); await playbackEnded; }
    catch (error) { if (recorder.state !== "inactive") recorder.stop(); await recorded.catch(() => new Blob()); throw error; }
    if (recorder.state !== "inactive") recorder.stop();
    const blob = await recorded;
    if (!blob.size) throw new Error("No speech/audio track could be extracted from this recording.");
    return { audioFile: new File([blob], `${file.name.replace(/\.[^.]+$/, "")}.webm`, { type: "audio/webm" }), mediaType: "video", duration };
  } finally {
    if (activeRecorder?.state !== "inactive") activeRecorder?.stop();
    captureStream?.getTracks().forEach((track) => track.stop());
    element.pause(); element.removeAttribute("src"); element.load(); URL.revokeObjectURL(url);
    element.remove();
  }
}

export default function VerifyPage() {
  const router = useRouter();
  const { t, language } = useLanguage();

  const [selected, setSelected] = useState("job");
  const [sourceType, setSourceType] = useState("unknown");

  const [file, setFile] = useState<File | null>(null);
  const [inputMethod, setInputMethod] = useState<"file" | "text">("file");
  const [pastedText, setPastedText] = useState("");
  const [jobUrl, setJobUrl] = useState("");

  const [started, setStarted] = useState(false);

  const [thinking, setThinking] = useState(false);

  const [engineStarted, setEngineStarted] =
    useState(false);

  const [currentStep, setCurrentStep] =
    useState(0);

  const [loading, setLoading] =
    useState(false);

  const [result, setResult] =
    useState<any>(null);

  const [verification, setVerification] =
    useState<any>(null);
  const [recording, setRecording] = useState<any>(null);
  const [recordingProgress, setRecordingProgress] = useState("");
  const [combinePrevious, setCombinePrevious] = useState(false);

  async function startVerification() {
    if (selected === "recording" && !file) {
      alert("Please upload an audio or video recording.");
      return;
    }
    const textMode = selected === "url" || selected === "text" || (["whatsapp", "job"].includes(selected) && inputMethod === "text");
    if (textMode && selected !== "url" && !pastedText.trim()) {
      alert("Please paste the message before continuing.");
      return;
    }
    if (selected === "url" && !jobUrl.trim()) {
      alert("Please paste the recruitment link before continuing.");
      return;
    }
    if (!textMode && !file) {
      alert(selected === "whatsapp" ? "Please upload a WhatsApp screenshot." : "Please upload a recruitment document.");
      return;
    }

    try {
      setLoading(true);
      setStarted(true);
      setThinking(true);
      if (selected === "recording") setRecording(null);
      const inputType = selected;
      let previousContext: any = null;
      if (selected === "recording" && combinePrevious) {
        try { previousContext = JSON.parse(localStorage.getItem("verifiedRecruitment") || "null"); } catch { previousContext = null; }
        if (!previousContext) throw new Error("There is no previously analyzed opportunity on this device to compare.");
      }
      let recordingResult: any = null;
      let recordingText = "";
      if (selected === "recording" && file) {
        if (file.size > 25 * 1024 * 1024) throw new Error("Recording is too large to process. Choose a supported recording under 25 MB.");
        setRecordingProgress(t("verify.recording.processing", "Extracting audio from the recording…"));
        const media = await prepareRecordingAudio(file);
        if (media.duration > 15 * 60) throw new Error("Recording is longer than 15 minutes. Choose a shorter recording.");
        setRecordingProgress(t("verify.recording.transcribing", "Transcribing recording…"));
        const formData = new FormData();
        formData.append("audio", media.audioFile);
        formData.append("selectedApplicationLanguage", language);
        const transcribeResponse = await fetch("/api/transcribe", { method: "POST", body: formData });
        const transcribed = await transcribeResponse.json();
        if (!transcribeResponse.ok || !transcribed.success) throw new Error(transcribed.message || "Transcription failed.");
        recordingResult = { ...transcribed, mediaType: media.mediaType, duration: transcribed.duration || media.duration };
        recordingText = transcribed.transcriptSegments?.length
          ? transcribed.transcriptSegments.map((segment: any) => `[${Math.floor(segment.startTime / 60).toString().padStart(2, "0")}:${Math.floor(segment.startTime % 60).toString().padStart(2, "0")}] ${segment.text}`).join("\n")
          : transcribed.rawTranscript;
        setRecording(recordingResult);
      }
      const inputMethodValue = selected === "recording" ? recordingResult.mediaType : selected === "url" ? "url" : textMode ? "text" : "ocr";
      const extractPayload: Record<string, unknown> = { inputType, inputMethod: inputMethodValue };
      if (selected === "url") extractPayload.url = jobUrl;
      else if (selected === "recording") { extractPayload.text = recordingText; extractPayload.inputMethod = "text"; }
      else if (textMode) extractPayload.text = pastedText;
      else if (file) {
        const base64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve((reader.result as string).split(",")[1]);
          reader.onerror = () => reject(new Error("Could not read the selected file."));
          reader.readAsDataURL(file);
        });
        extractPayload.image = base64;
        extractPayload.mimeType = file.type;
      }

      const extractResponse = await fetch("/api/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(extractPayload),
      });
      const extract = await extractResponse.json();
      if (!extract.success) {
        alert(extract.message || "CareerGuardian AI could not analyze this message right now. Please try again.");
        setStarted(false);
        setThinking(false);
        setRecordingProgress("");
        return;
      }

      const extractedData = {
        ...extract.data,
        website: extract.data.website || (selected === "url" ? jobUrl : ""),
        description: selected === "recording" ? recordingResult.rawTranscript : inputMethodValue !== "ocr" ? extract.text : extract.data.description || "",
        inputType,
        inputMethod: inputMethodValue,
        ...(recordingResult ? {
          rawText: recordingResult.rawTranscript,
          mediaType: recordingResult.mediaType,
          recordingDuration: recordingResult.duration,
          mediaMetadata: { fileName: file?.name, mimeType: file?.type || "unknown", sizeBytes: file?.size, lastModified: file?.lastModified },
          transcript: recordingResult.rawTranscript,
          cleanTranscript: recordingResult.cleanTranscript,
          transcriptLanguage: recordingResult.transcriptLanguage,
          selectedApplicationLanguage: recordingResult.selectedApplicationLanguage,
          transcriptSegments: recordingResult.transcriptSegments,
          keyEvidence: recordingResult.keyEvidence,
          repeatedEvidence: recordingResult.repeatedEvidence,
          recordingRiskSignals: recordingResult.recordingRiskSignals,
          recordingSummary: recordingResult.recordingSummary,
          additionalEvidenceText: previousContext ? [previousContext.company, previousContext.jobRole, previousContext.description].filter(Boolean).join("\n") : "",
          additionalEvidenceSource: previousContext?.inputType || "",
        } : {}),
      };
      setResult(extractedData);
      const userId = localStorage.getItem("userId");
      const effectiveSource = sourceType;
      const verifyResponse = await fetch("/api/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...extractedData, sourceType: selected === "recording" ? recordingResult.mediaType === "video" ? "video_recording" : "call_recording" : effectiveSource, inputType, inputMethod: inputMethodValue, userId }),
      });
      const verify = await verifyResponse.json();
      if (!verify.success) {
        alert(verify.message || "Verification Failed");
        setStarted(false);
        setThinking(false);
        setRecordingProgress("");
        return;
      }
      setVerification(verify);
      localStorage.setItem("verifiedRecruitment", JSON.stringify({
        company: extractedData.company || "",
        recruiter: extractedData.recruiter || extractedData.contactPerson || "",
        jobRole: extractedData.jobRole || "",
        salary: extractedData.salary || "",
        education: extractedData.education || "",
        requiredSkills: extractedData.requiredSkills || [],
        website: extractedData.website || "",
        email: extractedData.email || "",
        phone: extractedData.phone || "",
        location: extractedData.location || "",
        description: selected === "recording" ? "" : extractedData.description || "",
        layers: verify.layers || [],
        trustScore: verify.trustScore,
        verdict: verify.verdict,
        riskScore: verify.riskScore,
        verificationConfidence: verify.verificationConfidence,
        sourceConfidence: verify.sourceConfidence,
        sourceType: verify.sourceType,
        ...(selected === "recording" ? {
          mediaType: recordingResult.mediaType,
          recordingDuration: recordingResult.duration,
          recordingRiskIndicators: (recordingResult.keyEvidence || []).filter((item: any) => /payment|fee|otp|pin|cvv|password|credential|urgency|threat|pressure/i.test(item.category)).map((item: any) => ({ category: item.category, startTime: item.startTime })),
        } : {}),
        inputType,
        inputMethod: inputMethodValue,
      }));
      setThinking(false);
      setRecordingProgress("");
      setEngineStarted(true);
    } catch (error) {
      console.error(error);
      setStarted(false);
      setThinking(false);
      setRecordingProgress("");
      alert("CareerGuardian AI could not analyze this message right now. Please try again.");
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    if (!engineStarted || !verification) return;

    const layers =
      verification.layers || [];

    if (currentStep < layers.length) {
      const timer = setTimeout(() => {
        setCurrentStep(
          (prev) => prev + 1
        );
      }, 800);

      return () => clearTimeout(timer);
    }
  }, [
    engineStarted,
    currentStep,
    verification,
  ]);

  return (
    <main className="min-h-screen bg-slate-100">
      <section className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10">

        {/* Header */}

        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-5 py-2">
            <ShieldCheck className="h-5 w-5 text-blue-600" />

            <span className="font-semibold text-blue-700">
              {t("verify.badge", "Guardian Verify")}
            </span>
          </div>

          <h1 className="mt-6 text-3xl font-black text-slate-900 sm:text-4xl lg:text-5xl">
            AI Recruitment Verification
          </h1>

          <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-slate-600">
            Upload any recruitment notification,
            offer letter, internship poster or
            screenshot and let Guardian AI verify
            its authenticity using our 12-Layer
            Verification Engine.
          </p>
        </div>

        {/* Upload Section */}

        {!started && (
          <>
            <div className="mt-12">
              <InputSelector
                selected={selected}
                onSelect={setSelected}
                recordingTitle={t("verify.recording.title", "Call / Audio / Video")}
                recordingDescription={t("verify.recording.description", "Analyze a recruitment call or video and extract timestamped evidence.")}
              />
            </div>

            <div className="mt-8 w-full rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
              <label htmlFor="opportunity-source" className="block font-semibold text-slate-800">
                How did you receive this opportunity?
              </label>
              <p className="mt-1 text-sm text-slate-500">This gives the checks context. A source by itself does not confirm legitimacy.</p>
              <select id="opportunity-source" value={sourceType} onChange={(event) => setSourceType(event.target.value)} className="mt-4 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900">
                <option value="unknown">Select source (optional)</option>
                <option value="company_website">Company Website</option>
                <option value="company_email">Company Email</option>
                <option value="college_placement_cell">College Placement Cell</option>
                <option value="hod_faculty">HOD / Faculty</option>
                <option value="college_whatsapp_group">College WhatsApp Group</option>
                <option value="linkedin">LinkedIn</option>
                <option value="job_portal">Job Portal</option>
                <option value="recruiter_directly">Recruiter Directly</option>
                <option value="employee_referral">Employee Referral</option>
                <option value="friend_known_contact">Friend / Known Contact</option>
                <option value="other">Other</option>
              </select>
            </div>

            <UploadZone
              selected={selected}
              file={file}
              onFileChange={setFile}
              inputMethod={inputMethod}
              onInputMethodChange={setInputMethod}
              text={pastedText}
              onTextChange={setPastedText}
              url={jobUrl}
              onUrlChange={setJobUrl}
              combinePrevious={combinePrevious}
              onCombinePreviousChange={setCombinePrevious}
            />

            <div className="mt-10 text-center">
              <button
                onClick={startVerification}
                disabled={loading}
                className="rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 px-10 py-5 text-lg font-bold text-white shadow-lg transition hover:scale-105 disabled:opacity-60"
              >
                {loading
                  ? "Preparing..."
                  : selected === "whatsapp" ? "Analyze WhatsApp Chat"
                  : selected === "text" ? "Analyze Conversation"
                  : selected === "job" ? "Verify Job Opportunity"
                  : selected === "url" ? "Verify Job Opportunity"
                  : selected === "recording" ? t("verify.recording.upload", "Upload Recording")
                  : "Extract & Verify"}
              </button>
            </div>
          </>
        )}

        {/* AI Thinking */}

        {thinking && (
          <div className="mt-10">
            {recordingProgress && <p className="mb-3 text-center font-semibold text-blue-700">{recordingProgress}</p>}
            <AIThinking />
          </div>
        )}

        {/* Verification Results */}

        {engineStarted &&
          verification &&
          result && (
            <>
              {recording && <RecordingEvidencePanel recording={recording} caseId={verification.verificationId || "Local case"} />}
              {verification.verdict === "HIGH RISK" && <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-5"><p className="font-semibold text-red-900">This assessment contains high-risk evidence.</p><Link href="/emergency" className="mt-3 inline-flex items-center gap-2 rounded-xl bg-red-700 px-4 py-2.5 font-semibold text-white hover:bg-red-800">Open Guardian Recovery <ArrowRight className="h-4 w-4" /></Link></div>}
              <div className="mt-10">
                <ExtractedInfo
                  data={{
                    ...result,
                    verification,
                  }}
                />
              </div>

              <div className="mt-10">
                <TrustEngine
                  data={{
                    ...result,
                    verification,
                  }}
                />
              </div>

              {/* Badge Unlocked */}

              {verification.unlockedBadges &&
                verification.unlockedBadges.length >
                  0 && (
                  <div className="mt-8 rounded-3xl border border-yellow-200 bg-yellow-50 p-6 text-center shadow-sm">
                    <div className="flex justify-center text-amber-500">
                      <Trophy aria-hidden="true" className="h-10 w-10" />
                    </div>

                    <h2 className="mt-3 text-xl font-black text-slate-900">
                      Badge Unlocked!
                    </h2>

                    <p className="mt-2 text-slate-600">
                      You earned:
                    </p>

                    <div className="mt-4 flex flex-wrap justify-center gap-3">
                      {verification.unlockedBadges.map(
                        (badge: string) => (
                          <span
                            key={badge}
                            className="rounded-full bg-yellow-200 px-4 py-2 text-sm font-bold text-yellow-900"
                          >
                              <Trophy aria-hidden="true" className="mr-2 inline h-4 w-4" />
                            {badge
                              .replace(
                                /_/g,
                                " "
                              )}
                          </span>
                        )
                      )}
                    </div>
                  </div>
                )}

              {/* Company Report Button */}

              <div className="mt-8 text-center">
                <button
                  onClick={() => {
                    const companyName =
                      result?.company;

                    if (!companyName) {
                      alert(
                        "Company name not found."
                      );

                      return;
                    }

                    const companySlug =
                      companyName
                        .trim()
                        .toLowerCase()
                        .replace(
                          /\s+/g,
                          "-"
                        );

                    router.push(
                      `/company/${companySlug}`
                    );
                  }}
                  className="rounded-2xl bg-slate-900 px-8 py-4 font-bold text-white shadow-lg transition hover:scale-105 hover:bg-slate-800"
                >
                  View Company Report <ArrowRight aria-hidden="true" className="ml-2 inline h-5 w-5" />
                </button>
              </div>
            </>
          )}

      </section>
    </main>
  );
}
