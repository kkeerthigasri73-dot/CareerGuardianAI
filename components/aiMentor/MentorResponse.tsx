"use client";

import { Bot, Copy, CheckCircle2 } from "lucide-react";
import { useState } from "react";

export default function MentorResponse({
  answer,
}: {
  answer: string;
}) {
  const [copied, setCopied] = useState(false);

  async function copyAnswer() {
    await navigator.clipboard.writeText(answer);

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  }

  if (!answer) return null;

  return (
    <div className="rounded-3xl bg-white p-8 shadow-xl">

      <div className="flex items-center justify-between">

        <div className="flex items-center gap-3">

          <div className="rounded-xl bg-blue-100 p-3">

            <Bot className="h-7 w-7 text-blue-600" />

          </div>

          <div>

            <h2 className="text-2xl font-bold">

              AI Mentor Response

            </h2>

            <p className="text-slate-500">

              CareerGuardian AI

            </p>

          </div>

        </div>

        <button

          onClick={copyAnswer}

          className="flex items-center gap-2 rounded-xl bg-slate-100 px-4 py-2 transition hover:bg-slate-200"

        >

          {copied ? (

            <>

              <CheckCircle2 className="h-5 w-5 text-green-600" />

              Copied

            </>

          ) : (

            <>

              <Copy className="h-5 w-5" />

              Copy

            </>

          )}

        </button>

      </div>

      <div className="mt-8 rounded-2xl border border-blue-100 bg-blue-50 p-6">

        <div className="whitespace-pre-wrap leading-8 text-slate-700">

          {answer}

        </div>

      </div>

    </div>
  );
}