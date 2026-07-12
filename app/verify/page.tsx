"use client";

import { useEffect, useState } from "react";
import { ShieldCheck } from "lucide-react";

import InputSelector from "@/components/verify/InputSelector";
import UploadZone from "@/components/verify/UploadZone";
import AIThinking from "@/components/verify/AIThinking";
import ExtractedInfo from "@/components/analyze/ExtractedInfo";
import TrustEngine from "@/components/analyze/TrustEngine";

export default function VerifyPage() {

  const [selected, setSelected] = useState("pdf");

  const [file, setFile] = useState<File | null>(null);

  const [started, setStarted] = useState(false);

  const [thinking, setThinking] = useState(false);

  const [engineStarted, setEngineStarted] =
    useState(false);

  const [currentStep, setCurrentStep] =
    useState(0);

  const [showTrust, setShowTrust] =
    useState(false);

  const [showVerdict, setShowVerdict] =
    useState(false);

  const [showAction, setShowAction] =
    useState(false);

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

          // STEP 1

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

            alert("OCR Extraction Failed");

            return;

          }

          setResult(extract.data);

          // STEP 2

          const verifyResponse =
            await fetch("/api/verify", {

              method: "POST",

              headers: {

                "Content-Type":
                  "application/json",

              },

              body: JSON.stringify(
                extract.data
              ),

            });

          const verify =
            await verifyResponse.json();

          setVerification(verify);
          // Save verified recruitment for Career DNA & Interview

localStorage.setItem(
  "verifiedRecruitment",
  JSON.stringify({

    company: result?.company || extract.data.company,

    jobRole:
      result?.jobRole ||
      extract.data.jobRole,

    salary:
      result?.salary ||
      extract.data.salary,

    education:
      result?.education ||
      extract.data.education,

    requiredSkills:
      result?.requiredSkills ||
      extract.data.requiredSkills ||
      [],

    website:
      result?.website ||
      extract.data.website,

    email:
      result?.email ||
      extract.data.email,

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

        }

      };

      reader.readAsDataURL(file);

    } finally {

      setLoading(false);

    }

  }

  useEffect(() => {

    if (!engineStarted) return;

    if (
      currentStep <
      verification?.length
    ) {

      const timer = setTimeout(() => {

        setCurrentStep((prev) => prev + 1);

      }, 800);

      return () => clearTimeout(timer);

    }

    setTimeout(() => {

      setShowTrust(true);

    }, 400);

    setTimeout(() => {

      setShowVerdict(true);

    }, 1200);

    setTimeout(() => {

      setShowAction(true);

    }, 2000);

  }, [engineStarted, currentStep]);
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

          Upload any recruitment notification, offer letter,
          internship poster or screenshot and let Guardian AI
          verify its authenticity using our 12-Layer Verification Engine.

        </p>

      </div>

      {/* Upload */}

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

      {engineStarted && verification && result && (

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

        </>

      )}

    </section>

  </main>

  );
}
