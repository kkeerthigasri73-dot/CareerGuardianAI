"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck } from "lucide-react";

import InputSelector from "@/components/verify/InputSelector";
import UploadZone from "@/components/verify/UploadZone";
import AIThinking from "@/components/verify/AIThinking";
import ExtractedInfo from "@/components/analyze/ExtractedInfo";
import TrustEngine from "@/components/analyze/TrustEngine";

export default function VerifyPage() {
  const router = useRouter();

  const [selected, setSelected] = useState("pdf");

  const [file, setFile] = useState<File | null>(null);

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

  async function startVerification() {
    if (!file) {
      alert("Please upload a recruitment document.");
      return;
    }

    try {
      setLoading(true);

      setStarted(true);

      setThinking(true);

      const reader = new FileReader();

      reader.onloadend = async () => {
        try {
          const base64 =
            (reader.result as string).split(",")[1];

          const mimeType = file.type;

          // STEP 1: Extract recruitment information
          const extractResponse =
            await fetch("/api/extract", {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body: JSON.stringify({
                image: base64,
                mimeType,
                website: "",
                message: "",
              }),
            });

          const extract =
            await extractResponse.json();

          if (!extract.success) {
            alert(
              extract.message ||
                "OCR Extraction Failed"
            );

            setThinking(false);

            return;
          }

          setResult(extract.data);

          // Get logged-in user ID
          const userId =
            localStorage.getItem("userId");

          // STEP 2: Verify recruitment
          const verifyResponse =
            await fetch("/api/verify", {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body: JSON.stringify({
                ...extract.data,
                userId,
              }),
            });

          const verify =
            await verifyResponse.json();

          if (!verify.success) {
            alert(
              verify.message ||
                "Verification Failed"
            );

            setThinking(false);

            return;
          }

          setVerification(verify);

          // Save verified recruitment
          // for Career DNA and Interview features
          localStorage.setItem(
            "verifiedRecruitment",
            JSON.stringify({
              company:
                extract.data.company || "",

              jobRole:
                extract.data.jobRole || "",

              salary:
                extract.data.salary || "",

              education:
                extract.data.education || "",

              requiredSkills:
                extract.data.requiredSkills || [],

              website:
                extract.data.website || "",

              email:
                extract.data.email || "",

              trustScore:
                verify.trustScore,

              verdict:
                verify.verdict,
            })
          );

          setThinking(false);

          setEngineStarted(true);

        } catch (err) {
          console.error(err);

          alert("Verification Failed");

          setThinking(false);
        }
      };

      reader.readAsDataURL(file);

    } catch (error) {
      console.error(error);

      alert("Unable to start verification.");

      setThinking(false);

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
      <section className="mx-auto max-w-7xl px-6 py-10">

        {/* Header */}

        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-5 py-2">
            <ShieldCheck className="h-5 w-5 text-blue-600" />

            <span className="font-semibold text-blue-700">
              Guardian Verify™
            </span>
          </div>

          <h1 className="mt-6 text-5xl font-black text-slate-900">
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
              />
            </div>

            <UploadZone
              selected={selected}
              file={file}
              onFileChange={setFile}
            />

            <div className="mt-10 text-center">
              <button
                onClick={startVerification}
                disabled={loading}
                className="rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 px-10 py-5 text-lg font-bold text-white shadow-lg transition hover:scale-105 disabled:opacity-60"
              >
                {loading
                  ? "Preparing..."
                  : "Start Guardian Verify™"}
              </button>
            </div>
          </>
        )}

        {/* AI Thinking */}

        {thinking && (
          <div className="mt-10">
            <AIThinking />
          </div>
        )}

        {/* Verification Results */}

        {engineStarted &&
          verification &&
          result && (
            <>
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
                    <div className="text-4xl">
                      🏆
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
                            🏆{" "}
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
                  View Company Report →
                </button>
              </div>
            </>
          )}

      </section>
    </main>
  );
}