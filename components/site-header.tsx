"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, ShieldCheck, BrainCircuit, Siren, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import UserMenu from "@/components/UserMenu";
import NavbarDropdown from "@/components/NavbarDropdown";
import Logo from "@/components/branding/Logo";

const growItems = [
  {
    label: "Career DNA",
    href: "/career-dna",
  },
  {
    label: "Resume Builder",
    href: "/resume-builder",
  },
  {
    label: "Placement Predictor",
    href: "/placement",
  },
  {
    label: "Interview Simulator",
    href: "/interview",
  },
  {
    label: "AI Mentor",
    href: "/ai-mentor",
  },
  {
    label: "Opportunity Radar",
    href: "/opportunities",
  },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur-xl shadow-sm">

      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">

        {/* Logo */}

        <Logo />

        {/* Desktop Navigation */}

        <nav className="hidden items-center gap-2 lg:flex">

          <Link
            href="/"
            className="rounded-xl px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 hover:text-blue-600"
          >
            Home
          </Link>

          <Link
            href="/analyze"
            className="flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-blue-50 hover:text-blue-600"
          >
            <ShieldCheck className="h-4 w-4" />
            Verify
          </Link>

          <NavbarDropdown
            title="Grow"
            items={growItems}
          />

          <Link
            href="/emergency"
            className="flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-red-50 hover:text-red-600"
          >
            <Siren className="h-4 w-4" />
            Recover
          </Link>

          <Link
            href="/dashboard"
            className="flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 hover:text-blue-600"
          >
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </Link>

        </nav>

        {/* Right Side */}

        <div className="hidden items-center gap-4 lg:flex">

          <Link href="/analyze">

            <Button className="rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 px-6 font-semibold shadow">

              Verify Recruitment

            </Button>

          </Link>

          <UserMenu />

        </div>

        {/* Mobile Button */}

        <button
          onClick={() => setOpen(!open)}
          className="rounded-xl p-2 transition hover:bg-slate-100 lg:hidden"
        >
          {open ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>

      </div>

      {/* Mobile Menu */}

      {open && (

        <div className="border-t border-slate-200 bg-white lg:hidden">

          <div className="space-y-2 p-6">

            <Link
              href="/"
              onClick={() => setOpen(false)}
              className="block rounded-xl px-4 py-3 hover:bg-slate-100"
            >
              🏠 Home
            </Link>

            <Link
              href="/analyze"
              onClick={() => setOpen(false)}
              className="block rounded-xl px-4 py-3 hover:bg-slate-100"
            >
              🛡 Verify Recruitment
            </Link>

            <Link
              href="/career-dna"
              onClick={() => setOpen(false)}
              className="block rounded-xl px-4 py-3 hover:bg-slate-100"
            >
              Career DNA
            </Link>

            <Link
              href="/resume-builder"
              onClick={() => setOpen(false)}
              className="block rounded-xl px-4 py-3 hover:bg-slate-100"
            >
              Resume Builder
            </Link>

            <Link
              href="/placement"
              onClick={() => setOpen(false)}
              className="block rounded-xl px-4 py-3 hover:bg-slate-100"
            >
              Placement Predictor
            </Link>

            <Link
              href="/interview"
              onClick={() => setOpen(false)}
              className="block rounded-xl px-4 py-3 hover:bg-slate-100"
            >
              Interview Simulator
            </Link>

            <Link
              href="/ai-mentor"
              onClick={() => setOpen(false)}
              className="block rounded-xl px-4 py-3 hover:bg-slate-100"
            >
              AI Mentor
            </Link>

            <Link
              href="/opportunities"
              onClick={() => setOpen(false)}
              className="block rounded-xl px-4 py-3 hover:bg-slate-100"
            >
              Opportunity Radar
            </Link>

            <Link
              href="/emergency"
              onClick={() => setOpen(false)}
              className="block rounded-xl px-4 py-3 hover:bg-red-50"
            >
              🚨 Emergency Recovery
            </Link>

            <Link
              href="/dashboard"
              onClick={() => setOpen(false)}
              className="block rounded-xl px-4 py-3 hover:bg-slate-100"
            >
              Dashboard
            </Link>

            <Link
              href="/analyze"
              onClick={() => setOpen(false)}
            >
              <Button className="mt-4 w-full rounded-full bg-gradient-to-r from-blue-600 to-cyan-500">

                Verify Recruitment

              </Button>
            </Link>

            <div className="border-t pt-5">

              <UserMenu />

            </div>

          </div>

        </div>

      )}

    </header>
  );
}