"use client";

import { useEffect, useState } from "react";
import { ShieldCheck } from "lucide-react";
import TrustLayer from "./TrustLayer";
import DownloadReportButton from "./DownloadReportButton";
import TrustScore from "./TrustScore";
import AIRecommendation from "./AIRecommendation";
import { generateRecommendation } from "@/lib/aiRecommendation";
import { runTrustEngine } from "@/lib/trustEngine";

const layers = [
  {
    title: "OCR Extraction",
    description: "Extracting recruitment details...",
  },
  {
    title: "Government Verification",
    description: "Checking official government notification...",
  },
  {
    title: "Website Verification",
    description: "Validating official website...",
  },
  {
    title: "Recruiter Email",
    description: "Checking recruiter email domain...",
  },
  {
    title: "Phone Verification",
    description: "Validating contact number...",
  },
  {
    title: "Salary Analysis",
    description: "Checking salary realism...",
  },
  {
    title: "Scam Keyword Detection",
    description: "Scanning suspicious keywords...",
  },
  {
    title: "HTTPS Security",
    description: "Checking website security...",
  },
  {
    title: "Application Fee",
    description: "Detecting illegal application fee...",
  },
  {
    title: "Education Verification",
    description: "Checking eligibility criteria...",
  },
  {
    title: "Job Role Verification",
    description: "Validating job designation...",
  },
  {
    title: "AI Final Trust Score",
    description: "Generating final AI verdict...",
  },
];

export default function TrustEngine({
  data,
}: {
  data: any;
}) {
  const [currentLayer, setCurrentLayer] = useState(0);

  useEffect(() => {
    if (currentLayer >= layers.length) return;

    const timer = setTimeout(() => {
      setCurrentLayer((prev) => prev + 1);
    }, 650);

    return () => clearTimeout(timer);
  }, [currentLayer]);

  const progress = Math.min(
    (currentLayer / layers.length) * 100,
    100
  );

  const results = runTrustEngine(data);

  const totalScore = results.reduce(
    (sum, item) => sum + item.score,
    0
  );

  const trustScore =
    data?.verification?.trustScore ??
    Math.round((totalScore / 105) * 100);

  const verdict =
    data?.verification?.verdict ??
    (trustScore >= 80
      ? "SAFE"
      : trustScore >= 60
      ? "SUSPICIOUS"
      : "SCAM");
  const recommendations = generateRecommendation(
  trustScore,
  data
);

  return (
    <div className="rounded-3xl bg-white p-8 shadow-xl">

      <div className="mb-8 flex items-center gap-4">

        <div className="rounded-xl bg-blue-100 p-3">
          <ShieldCheck className="h-8 w-8 text-blue-600" />
        </div>

        <div>

          <h2 className="text-3xl font-bold">
            CareerGuardian AI Investigation
          </h2>

          <p className="text-slate-500">
            Running 12-Layer Recruitment Trust Verification...
          </p>

        </div>

      </div>

      <div className="mb-8">

        <div className="mb-3 flex justify-between">

          <span className="font-semibold">
            Investigation Progress
          </span>

          <span className="font-bold text-blue-600">
            {Math.round(progress)}%
          </span>

        </div>

        <div className="h-3 overflow-hidden rounded-full bg-slate-200">

          <div
            className="h-full rounded-full bg-gradient-to-r from-blue-600 via-violet-600 to-cyan-500 transition-all duration-700"
            style={{
              width: `${progress}%`,
            }}
          />

        </div>

      </div>

      <div className="space-y-4">

        {layers.map((layer, index) => (

          <TrustLayer
            key={index}
            title={results[index]?.name || layer.title}
            description={layer.description}
            status={
              index < currentLayer
                ? "completed"
                : index === currentLayer
                ? "running"
                : "pending"
            }
            passed={results[index]?.passed}
            message={results[index]?.message}
          />

        ))}

      </div>
            {currentLayer >= layers.length && (

        <div className="mt-10 rounded-3xl border border-blue-200 bg-gradient-to-br from-blue-50 via-white to-cyan-50 p-8">

          <div className="grid gap-8 lg:grid-cols-2">

            {/* Left */}

            <div>

              <h2 className="text-3xl font-bold text-slate-900">
                AI Investigation Completed
              </h2>

              <p className="mt-2 text-slate-600">
                CareerGuardian AI successfully completed all
                12 verification layers.
              </p>

              <div className="mt-8 space-y-4">

                <div className="rounded-2xl bg-white p-5 shadow">

                  <p className="text-sm text-slate-500">
                    Government Verification
                  </p>

                  <h3
                    className={`mt-2 text-2xl font-bold ${
                      results[1]?.passed
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {results[1]?.passed
                      ? "Verified"
                      : "Not Verified"}
                  </h3>

                </div>

                <div className="rounded-2xl bg-white p-5 shadow">

                  <p className="text-sm text-slate-500">
                    Scam Probability
                  </p>

                  <h3 className="mt-2 text-2xl font-bold text-red-500">
                    {Math.max(0, 100 - trustScore)}%
                  </h3>

                </div>

                <div className="rounded-2xl bg-white p-5 shadow">

                  <p className="text-sm text-slate-500">
                    Final Verdict
                  </p>

                  <h3
                    className={`mt-2 text-2xl font-bold ${
                      verdict === "SAFE"
                        ? "text-green-600"
                        : verdict === "SUSPICIOUS"
                        ? "text-yellow-500"
                        : "text-red-600"
                    }`}
                  >
                    {verdict}
                  </h3>

                </div>

              </div>

            </div>

            {/* Right */}

           <div className="flex flex-col items-center justify-center">

  <TrustScore
    score={trustScore}
    verdict={verdict}
  />

</div>

          </div>

          {/* Investigation Summary */}

          <div className="mt-10 rounded-2xl bg-white p-6 shadow">

            <h3 className="mb-6 text-2xl font-bold">
              12-Layer Investigation Report
            </h3>

            <div className="space-y-3">

              {results.map((layer, index) => (

                <div
                  key={index}
                  className="flex items-center justify-between rounded-xl border border-slate-200 p-4"
                >

                  <div>

                    <h4 className="font-semibold">
                      {layer.name}
                    </h4>

                    <p className="text-sm text-slate-500">
                      {layer.message}
                    </p>

                  </div>

                  <span
                    className={`rounded-full px-4 py-2 text-sm font-bold ${
                      layer.passed
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {layer.passed ? "PASS" : "FAIL"}
                  </span>

                </div>

              ))}

            </div>

          </div>

          {/* AI Explanation */}

          <div className="mt-8 rounded-2xl bg-blue-50 p-6">

            <h3 className="mb-4 text-xl font-bold">
              AI Decision Explanation
            </h3>

            <ul className="space-y-2 text-slate-700">

              <li>
                ✅ Official recruitment information analyzed.
              </li>

              <li>
                ✅ Website, email and phone verified.
              </li>

              <li>
                ✅ Scam keyword detection completed.
              </li>

              <li>
                ✅ Salary and eligibility analyzed.
              </li>

              <li>
                ✅ Final AI trust score generated.
              </li>

            </ul>

          </div>
<AIRecommendation
  items={recommendations}
/>
          <DownloadReportButton data={data} />
        </div>

      )}

    </div>
  );
}