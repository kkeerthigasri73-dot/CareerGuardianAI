"use client";

import {
  BrainCircuit,
  ShieldCheck,
  Sparkles,
  FileCheck2,
  ArrowRight,
} from "lucide-react";

interface Props {
  onGenerate: () => void;
}

export default function ResumeForm({
  onGenerate,
}: Props) {

  return (

    <div className="space-y-8">

      {/* Hero */}

      <section className="rounded-3xl bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-500 p-10 text-white shadow-2xl">

        <div className="flex items-center gap-5">

          <div className="rounded-3xl bg-white/20 p-5">

            <BrainCircuit className="h-12 w-12"/>

          </div>

          <div>

            <h1 className="text-5xl font-black">

              Guardian Resume Studio™

            </h1>

            <p className="mt-3 text-lg text-blue-100">

              Guardian AI automatically creates an ATS-ready resume using
              your verified recruitment and Career DNA.

            </p>

          </div>

        </div>

      </section>

      {/* AI Pipeline */}

      <section className="rounded-3xl bg-white p-10 shadow-xl">

        <h2 className="text-3xl font-bold">

          Guardian AI Resume Pipeline

        </h2>

        <div className="mt-10 grid gap-6 lg:grid-cols-4">

          <div className="rounded-2xl border p-6 text-center">

            <ShieldCheck className="mx-auto h-10 w-10 text-green-600"/>

            <h3 className="mt-4 font-bold">

              Verified Recruitment

            </h3>

            <p className="mt-2 text-sm text-slate-500">

              Uses verified company recruitment.

            </p>

          </div>

          <div className="rounded-2xl border p-6 text-center">

            <BrainCircuit className="mx-auto h-10 w-10 text-blue-600"/>

            <h3 className="mt-4 font-bold">

              Career DNA

            </h3>

            <p className="mt-2 text-sm text-slate-500">

              Reads your AI career profile.

            </p>

          </div>

          <div className="rounded-2xl border p-6 text-center">

            <FileCheck2 className="mx-auto h-10 w-10 text-purple-600"/>

            <h3 className="mt-4 font-bold">

              ATS Optimization

            </h3>

            <p className="mt-2 text-sm text-slate-500">

              AI optimizes skills and projects.

            </p>

          </div>

          <div className="rounded-2xl border p-6 text-center">

            <Sparkles className="mx-auto h-10 w-10 text-yellow-500"/>

            <h3 className="mt-4 font-bold">

              Resume Generated

            </h3>

            <p className="mt-2 text-sm text-slate-500">

              Recruiter-ready professional resume.

            </p>

          </div>

        </div>

      </section>

      {/* AI Features */}

      <section className="rounded-3xl bg-white p-10 shadow-xl">

        <h2 className="text-3xl font-bold">

          Guardian AI will automatically

        </h2>

        <div className="mt-8 space-y-5">

          {[
            "Generate Professional Summary",
            "Optimize ATS Keywords",
            "Reorder Technical Skills",
            "Highlight Relevant Projects",
            "Improve Resume Structure",
            "Increase Resume Score",
          ].map((item) => (

            <div
              key={item}
              className="flex items-center gap-4 rounded-2xl bg-blue-50 p-5"
            >

              <ArrowRight className="text-blue-600"/>

              <span className="font-medium">

                {item}

              </span>

            </div>

          ))}

        </div>

      </section>

      {/* Generate */}

      <button

        onClick={onGenerate}

        className="flex w-full items-center justify-center gap-4 rounded-2xl bg-gradient-to-r from-blue-700 to-cyan-500 py-6 text-xl font-bold text-white transition hover:scale-[1.02]"

      >

        <BrainCircuit className="h-7 w-7"/>

        Generate AI ATS Resume

      </button>

    </div>

  );

}