"use client";

import {
  BrainCircuit,
  Sparkles,
  Target,
  Download,
} from "lucide-react";
import jsPDF from "jspdf";
interface Props {
  recommendation: string;
  readiness: number;
  hiringProbability: number;
}

export default function CareerRecommendation({
  recommendation,
  readiness,
  hiringProbability,
}: Props) {

  const verdict =
    readiness >= 85
      ? "READY TO APPLY"
      : readiness >= 65
      ? "NEARLY READY"
      : "NEEDS IMPROVEMENT";

  const color =
    readiness >= 85
      ? "text-green-600"
      : readiness >= 65
      ? "text-yellow-500"
      : "text-red-600";

  function downloadReport() {

  const pdf = new jsPDF();

  pdf.setFontSize(22);
  pdf.text("Guardian Career DNA Report", 20, 20);

  pdf.setFontSize(16);
  pdf.text(`Career Verdict : ${verdict}`, 20, 40);

  pdf.text(`Job Readiness : ${readiness}%`, 20, 55);

  pdf.text(
    `Hiring Probability : ${hiringProbability}%`,
    20,
    70
  );

  pdf.setFontSize(14);

  const lines = pdf.splitTextToSize(
    recommendation,
    170
  );

  pdf.text("Guardian AI Recommendation",20,95);

  pdf.text(lines,20,110);

  pdf.save("Guardian_Career_DNA_Report.pdf");

}

  return (

    <section className="space-y-8">

      {/* AI Recommendation */}

      <div className="rounded-3xl bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-500 p-8 text-white shadow-2xl">

        <div className="flex items-center gap-4">

          <div className="rounded-2xl bg-white/20 p-4">

            <BrainCircuit className="h-8 w-8" />

          </div>

          <div>

            <h2 className="text-3xl font-bold">

              Guardian AI Recommendation

            </h2>

            <p className="text-blue-100">

              Personalized career guidance generated using your Career DNA.

            </p>

          </div>

        </div>

        <div className="mt-8 rounded-3xl bg-white/10 p-6">

          <div className="mb-4 flex items-center gap-3">

            <Sparkles className="text-yellow-300" />

            <h3 className="text-2xl font-bold">

              AI Advice

            </h3>

          </div>

          <p className="text-lg leading-8">

            {recommendation}

          </p>

        </div>

      </div>

      {/* Final Verdict */}

      <div className="grid gap-6 md:grid-cols-2">

        <div className="rounded-3xl bg-white p-8 shadow-xl">

          <div className="flex items-center gap-4">

            <Target className="h-10 w-10 text-blue-600" />

            <div>

              <h3 className="text-2xl font-bold">

                Career Verdict

              </h3>

              <p className="text-slate-500">

                Based on Guardian AI analysis

              </p>

            </div>

          </div>

          <h1 className={`mt-8 text-5xl font-black ${color}`}>

            {verdict}

          </h1>

        </div>

        <div className="rounded-3xl bg-white p-8 shadow-xl">

          <h3 className="text-2xl font-bold">

            Career Summary

          </h3>

          <div className="mt-8 space-y-4">

            <div className="flex justify-between">

              <span>Job Readiness</span>

              <strong>{readiness}%</strong>

            </div>

            <div className="flex justify-between">

              <span>Hiring Probability</span>

              <strong>{hiringProbability}%</strong>

            </div>

          </div>

        </div>

      </div>

      {/* Download */}

      <button

        onClick={downloadReport}

        className="flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-blue-700 to-cyan-500 py-5 text-lg font-bold text-white transition hover:scale-[1.02]"

      >

        <Download className="h-6 w-6" />

        Download Career DNA Report

      </button>

    </section>

  );

}