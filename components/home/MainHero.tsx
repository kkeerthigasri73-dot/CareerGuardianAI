"use client";

import Link from "next/link";
import {
  ArrowRight,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

export default function MainHero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50">

      <div className="absolute -left-40 top-0 h-96 w-96 rounded-full bg-blue-200/30 blur-3xl" />

      <div className="absolute right-0 top-20 h-[450px] w-[450px] rounded-full bg-cyan-200/20 blur-3xl" />

      <div className="relative mx-auto flex min-h-[88vh] max-w-7xl items-center px-6">

        <div className="mx-auto max-w-4xl text-center">

          <div className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-5 py-2">

            <ShieldCheck className="h-5 w-5 text-blue-600" />

            <span className="font-semibold text-blue-700">

              CareerGuardian AI Platform

            </span>

          </div>

          <h1 className="mt-10 text-6xl font-black leading-tight text-slate-900">

            Protect.

            <span className="text-blue-600">

              Verify.

            </span>

            <br />

            Succeed.

          </h1>

          <p className="mx-auto mt-8 max-w-3xl text-xl leading-9 text-slate-600">

            CareerGuardian AI protects students and job seekers
            from fake recruitment, internship scams and fraudulent
            job offers while helping them build successful careers.

          </p>

          <div className="mt-12 flex justify-center gap-6">

            <Link href="#ecosystem">

              <button className="flex items-center gap-3 rounded-2xl bg-blue-600 px-10 py-5 text-lg font-semibold text-white shadow-xl transition hover:scale-105">

                Get Started

                <ArrowRight className="h-5 w-5" />

              </button>

            </Link>

          </div>

          <div className="mt-20 flex justify-center">

            <Sparkles className="h-8 w-8 animate-bounce text-blue-600" />

          </div>

        </div>

      </div>

    </section>
  );
}