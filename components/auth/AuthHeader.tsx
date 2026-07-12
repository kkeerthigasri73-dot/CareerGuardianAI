"use client";

import { ShieldCheck, Sparkles } from "lucide-react";

export default function AuthHeader() {
  return (
    <div className="rounded-3xl bg-gradient-to-r from-blue-700 via-indigo-600 to-cyan-600 p-10 text-white shadow-xl">

      <div className="flex items-center gap-5">

        <div className="rounded-2xl bg-white/20 p-4">

          <ShieldCheck className="h-10 w-10" />

        </div>

        <div>

          <h1 className="text-4xl font-bold">

            Welcome to CareerGuardian AI

          </h1>

          <p className="mt-2 text-lg text-blue-100">

            Securely access your AI Career Platform.

          </p>

        </div>

      </div>

      <div className="mt-8 rounded-2xl bg-white/10 p-6">

        <div className="flex items-center gap-3">

          <Sparkles className="h-6 w-6 text-yellow-300" />

          <p>

            Login to access your Career DNA, Recruitment Reports,
            Resume Builder, AI Mentor, Placement Predictor,
            Opportunity Radar and Dashboard.

          </p>

        </div>

      </div>

    </div>
  );
}