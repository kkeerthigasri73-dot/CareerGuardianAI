"use client";

import Link from "next/link";
import {
  ShieldCheck,
  BrainCircuit,
  FileText,
  Mic2,
  LayoutDashboard,
  ArrowRight,
} from "lucide-react";

const actions = [
  {
    title: "Verify Recruitment",
    description: "Verify a new recruitment notification.",
    href: "/verify",
    icon: ShieldCheck,
    color: "from-green-500 to-emerald-600",
  },
  {
    title: "Career DNA",
    description: "View your AI Career Intelligence Report.",
    href: "/career-dna",
    icon: BrainCircuit,
    color: "from-blue-600 to-cyan-500",
  },
  {
    title: "Resume Studio",
    description: "Generate an ATS-optimized resume.",
    href: "/resume-builder",
    icon: FileText,
    color: "from-violet-600 to-purple-600",
  },
  {
    title: "Interview AI",
    description: "Practice AI-powered mock interviews.",
    href: "/interview",
    icon: Mic2,
    color: "from-orange-500 to-red-500",
  },
];

export default function QuickActions() {

  return (

    <section className="rounded-3xl bg-white p-8 shadow-xl">

      <div className="flex items-center gap-3">

        <LayoutDashboard className="h-8 w-8 text-blue-600"/>

        <h2 className="text-3xl font-black">

          Quick Actions

        </h2>

      </div>

      <p className="mt-3 text-slate-500">

        Quickly access every Guardian AI module.

      </p>

      <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">

        {actions.map((action) => {

          const Icon = action.icon;

          return (

            <Link
              key={action.title}
              href={action.href}
              className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-md transition duration-300 hover:-translate-y-2 hover:shadow-xl"
            >

              <div
                className={`inline-flex rounded-2xl bg-gradient-to-r ${action.color} p-4 text-white`}
              >

                <Icon className="h-8 w-8"/>

              </div>

              <h3 className="mt-6 text-2xl font-bold">

                {action.title}

              </h3>

              <p className="mt-3 leading-7 text-slate-600">

                {action.description}

              </p>

              <div className="mt-6 flex items-center gap-2 font-semibold text-blue-600">

                Open Module

                <ArrowRight className="h-5 w-5 transition group-hover:translate-x-2"/>

              </div>

            </Link>

          );

        })}

      </div>

    </section>

  );

}