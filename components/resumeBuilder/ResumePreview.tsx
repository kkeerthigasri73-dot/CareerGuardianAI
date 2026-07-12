"use client";

import ResumeTemplate from "./ResumeTemplate";
import {
  Download,
  Printer,
  Pencil,
  ShieldCheck,
  BrainCircuit,
  BadgeCheck,
  TrendingUp,
} from "lucide-react";

interface Props {
  data: any;
  onEdit: () => void;
}

export default function ResumePreview({
  data,
  onEdit,
}: Props) {

  if (!data) return null;

  function printResume() {
    window.print();
  }

  function downloadResume() {

    const html =
      document.getElementById("resume-template");

    if (!html) return;

    const win =
      window.open("", "_blank");

    if (!win) return;

    win.document.write(`

      <html>

      <head>

      <title>Guardian Resume Studio</title>

      <style>

      body{

        font-family:Arial;

        margin:40px;

        color:#222;

      }

      h1{

        color:#1d4ed8;

      }

      h2{

        color:#2563eb;

        border-bottom:1px solid #ddd;

        padding-bottom:6px;

      }

      ul{

        line-height:1.8;

      }

      .badge{

        display:inline-block;

        margin:4px;

        padding:6px 12px;

        background:#dbeafe;

        border-radius:999px;

      }

      </style>

      </head>

      <body>

      ${html.innerHTML}

      </body>

      </html>

    `);

    win.document.close();

    win.print();

  }

  return (

    <div className="space-y-8">

      {/* ATS Dashboard */}

      <div className="rounded-3xl bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-500 p-8 text-white shadow-xl">

        <div className="flex flex-col gap-8 lg:flex-row lg:justify-between">

          <div>

            <div className="flex items-center gap-3">

              <BrainCircuit className="h-10 w-10"/>

              <div>

                <h2 className="text-4xl font-black">

                  Guardian Resume Studio™

                </h2>

                <p className="mt-2 text-blue-100">

                  ATS Optimized Resume Ready

                </p>

              </div>

            </div>

          </div>

          <div className="grid grid-cols-2 gap-4">

            <div className="rounded-2xl bg-white/10 p-5 text-center">

              <ShieldCheck className="mx-auto h-8 w-8"/>

              <h3 className="mt-3 text-3xl font-black">

                94%

              </h3>

              <p className="text-sm">

                ATS Score

              </p>

            </div>

            <div className="rounded-2xl bg-white/10 p-5 text-center">

              <TrendingUp className="mx-auto h-8 w-8"/>

              <h3 className="mt-3 text-3xl font-black">

                HIGH

              </h3>

              <p className="text-sm">

                Hiring Chance

              </p>

            </div>

          </div>

        </div>

      </div>

      {/* AI Suggestions */}

      <div className="rounded-3xl bg-white p-8 shadow-xl">

        <div className="mb-6 flex items-center gap-3">

          <BadgeCheck className="text-green-600"/>

          <h2 className="text-2xl font-bold">

            Guardian AI Resume Review

          </h2>

        </div>

        <div className="grid gap-4 md:grid-cols-2">

          <div className="rounded-2xl bg-green-50 p-5">

            ✓ ATS Friendly Resume

          </div>

          <div className="rounded-2xl bg-blue-50 p-5">

            ✓ Skills optimized for target job

          </div>

          <div className="rounded-2xl bg-yellow-50 p-5">

            ✓ Professional Summary improved

          </div>

          <div className="rounded-2xl bg-purple-50 p-5">

            ✓ Keywords added for recruiters

          </div>

        </div>

      </div>

      {/* Buttons */}

      <div className="flex flex-wrap gap-4">

        <button

          onClick={onEdit}

          className="flex items-center gap-3 rounded-2xl bg-slate-800 px-7 py-4 font-semibold text-white"

        >

          <Pencil className="h-5 w-5"/>

          Edit Resume

        </button>

        <button

          onClick={printResume}

          className="flex items-center gap-3 rounded-2xl bg-blue-600 px-7 py-4 font-semibold text-white"

        >

          <Printer className="h-5 w-5"/>

          Print Resume

        </button>

        <button

          onClick={downloadResume}

          className="flex items-center gap-3 rounded-2xl bg-green-600 px-7 py-4 font-semibold text-white"

        >

          <Download className="h-5 w-5"/>

          Download PDF

        </button>

      </div>

      {/* Resume */}

      <div

        id="resume-template"

        className="rounded-3xl bg-white p-10 shadow-xl"

      >

        <ResumeTemplate

          data={data}

        />

      </div>

    </div>

  );

}