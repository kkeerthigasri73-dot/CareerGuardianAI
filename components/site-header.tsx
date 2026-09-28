"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  ShieldCheck,
  Siren,
  LayoutDashboard,
  ChevronDown,
  FileCheck2,
  Radar,
  TriangleAlert,
  FileText,
  GraduationCap,
  Mic2,
  Bot,
  Compass,
} from "lucide-react";

import { useLanguage } from "@/src/context/LanguageContext";
import UserMenu from "@/components/UserMenu";
import Logo from "@/components/branding/Logo";
import NotificationBell from "@/components/NotificationBell";

/* =========================================================
   NAVIGATION DATA
========================================================= */

const verifyItems = [
  {
    label: "Recruitment Verification",
    href: "/analyze",
    icon: ShieldCheck,
  },
  {
    label: "AI Trust Engine",
    href: "/verify",
    icon: FileCheck2,
  },
  {
    label: "Verification Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
];

const growItems = [
  {
    label: "Career DNA",
    href: "/career-dna",
    icon: Compass,
  },
  {
    label: "Resume Builder",
    href: "/resume-builder",
    icon: FileText,
  },
  {
    label: "Placement Predictor",
    href: "/placement",
    icon: GraduationCap,
  },
  {
    label: "Interview Simulator",
    href: "/interview",
    icon: Mic2,
  },
  {
    label: "AI Mentor",
    href: "/ai-mentor",
    icon: Bot,
  },
  {
    label: "Opportunity Radar",
    href: "/opportunities",
    icon: Radar,
  },
];

const recoverItems = [
  {
    label: "Emergency Recovery",
    href: "/emergency",
    icon: Siren,
  },
  {
    label: "Report a Scam",
    href: "/emergency#report-scam",
    icon: TriangleAlert,
  },
  {
    label: "Recovery Guidance",
    href: "/emergency",
    icon: ShieldCheck,
  },
];

/* =========================================================
   TYPES
========================================================= */

type NavItem = {
  label: string;
  href: string;
  icon?: typeof ShieldCheck;
};

/* =========================================================
   SITE HEADER
========================================================= */

export function SiteHeader() {
  const { t } = useLanguage();
  const pathname = usePathname();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [openMobileSection, setOpenMobileSection] =
    useState<string | null>(null);

  /* -------------------------------------------------------
     CLOSE ALL NAVIGATION
  ------------------------------------------------------- */

  const closeNavigation = () => {
    setOpenDropdown(null);
    setOpenMobileSection(null);
    setMobileOpen(false);
  };

  /* -------------------------------------------------------
     TOGGLE DESKTOP DROPDOWN
  ------------------------------------------------------- */

  const toggleDropdown = (name: string) => {
    setOpenDropdown((current) => {
      if (current === name) {
        return null;
      }

      return name;
    });
  };

  /* -------------------------------------------------------
     CHECK ACTIVE ROUTE
  ------------------------------------------------------- */

  const isActive = (href: string) => {
    const cleanHref = href.split("#")[0];

    if (cleanHref === "/") {
      return pathname === "/";
    }

    return (
      pathname === cleanHref ||
      pathname.startsWith(`${cleanHref}/`)
    );
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 shadow-[0_8px_30px_rgba(15,23,42,0.05)] backdrop-blur-xl">
      {/* =====================================================
          MAIN NAVBAR
      ===================================================== */}

      <div className="mx-auto flex h-[4.5rem] max-w-[1440px] items-center justify-between gap-6 px-5 sm:px-8">
        {/* =================================================
            LOGO

            IMPORTANT:
            Logo already contains its own Link.
            DO NOT wrap Logo inside another Link.
        ================================================= */}

        <div
          className="shrink-0"
          onClick={() => {
            closeNavigation();
          }}
        >
          <Logo />
        </div>

        {/* =================================================
            DESKTOP NAVIGATION
        ================================================= */}

        <nav className="ml-4 hidden flex-1 items-center justify-center gap-1 lg:flex">
          {/* HOME */}

          <Link
            href="/"
            onClick={closeNavigation}
            className={`rounded-lg px-3 py-2 text-sm font-bold transition ${
              isActive("/")
                ? "bg-indigo-50 text-indigo-700"
                : "text-slate-700 hover:bg-slate-100 hover:text-cyan-700"
            }`}
          >
            {t("home")}
          </Link>

          {/* =================================================
              VERIFY
          ================================================= */}

          <DesktopDropdown
            title={t("verify")}
            items={verifyItems}
            pathname={pathname}
            open={openDropdown === "verify"}
            onToggle={() => toggleDropdown("verify")}
            onNavigate={closeNavigation}
            isActive={verifyItems.some((item) =>
              isActive(item.href)
            )}
          />

          {/* =================================================
              GROW
          ================================================= */}

          <DesktopDropdown
            title={t("grow")}
            items={growItems}
            pathname={pathname}
            open={openDropdown === "grow"}
            onToggle={() => toggleDropdown("grow")}
            onNavigate={closeNavigation}
            isActive={growItems.some((item) =>
              isActive(item.href)
            )}
          />

          {/* =================================================
              RECOVER
          ================================================= */}

          <DesktopDropdown
            title={t("recover")}
            items={recoverItems}
            pathname={pathname}
            open={openDropdown === "recover"}
            onToggle={() => toggleDropdown("recover")}
            onNavigate={closeNavigation}
            isActive={recoverItems.some((item) =>
              isActive(item.href)
            )}
          />

          {/* =================================================
              DASHBOARD
          ================================================= */}

          <Link
            href="/dashboard"
            onClick={closeNavigation}
            className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-bold transition ${
              isActive("/dashboard")
                ? "bg-indigo-50 text-indigo-700"
                : "text-slate-700 hover:bg-slate-100 hover:text-cyan-700"
            }`}
          >
            <LayoutDashboard className="h-4 w-4" />
            {t("dashboard")}
          </Link>
        </nav>

        {/* =================================================
            DESKTOP RIGHT SIDE
        ================================================= */}

        <div className="ml-4 hidden shrink-0 items-center gap-4 lg:flex">
          <Link
            href="/analyze"
            onClick={closeNavigation}
            className="inline-flex items-center gap-2 whitespace-nowrap rounded-xl bg-slate-950 px-5 py-3 text-sm font-black text-white shadow-md shadow-violet-100 transition hover:bg-violet-700"
          >
            <ShieldCheck className="h-4 w-4" />
            Verify Recruitment
          </Link>

          <NotificationBell />

          <UserMenu />
        </div>

        {/* =================================================
            MOBILE MENU BUTTON
        ================================================= */}

        <button
          type="button"
          aria-label={
            mobileOpen ? "Close navigation menu" : "Open navigation menu"
          }
          aria-expanded={mobileOpen}
          onClick={() => {
            setMobileOpen((current) => !current);
            setOpenDropdown(null);
          }}
          className="rounded-lg p-2 transition hover:bg-slate-100 lg:hidden"
        >
          {mobileOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* =====================================================
          MOBILE NAVIGATION
      ===================================================== */}

      {mobileOpen && (
        <div className="border-t border-slate-200 bg-white lg:hidden">
          <nav className="space-y-2 p-5">
            {/* HOME */}

            <Link
              href="/"
              onClick={closeNavigation}
              className={`block rounded-xl px-4 py-3 text-sm font-semibold transition ${
                isActive("/")
                  ? "bg-indigo-50 text-indigo-700"
                  : "text-slate-700 hover:bg-slate-100 hover:text-blue-600"
              }`}
            >
              Home
            </Link>

            {/* VERIFY */}

            <MobileSection
              title="Verify"
              section="verify"
              items={verifyItems}
              open={openMobileSection === "verify"}
              onToggle={() =>
                setOpenMobileSection((current) =>
                  current === "verify" ? null : "verify"
                )
              }
              onNavigate={closeNavigation}
              isItemActive={isActive}
            />

            {/* GROW */}

            <MobileSection
              title="Grow"
              section="grow"
              items={growItems}
              open={openMobileSection === "grow"}
              onToggle={() =>
                setOpenMobileSection((current) =>
                  current === "grow" ? null : "grow"
                )
              }
              onNavigate={closeNavigation}
              isItemActive={isActive}
            />

            {/* RECOVER */}

            <MobileSection
              title="Recover"
              section="recover"
              items={recoverItems}
              open={openMobileSection === "recover"}
              onToggle={() =>
                setOpenMobileSection((current) =>
                  current === "recover" ? null : "recover"
                )
              }
              onNavigate={closeNavigation}
              isItemActive={isActive}
            />

            {/* DASHBOARD */}

            <Link
              href="/dashboard"
              onClick={closeNavigation}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                isActive("/dashboard")
                  ? "bg-indigo-50 text-indigo-700"
                  : "text-slate-700 hover:bg-slate-100 hover:text-blue-600"
              }`}
            >
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </Link>

            {/* VERIFY RECRUITMENT */}

            <Link
              href="/analyze"
              onClick={closeNavigation}
              className="mt-2 flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-3 text-sm font-bold text-white transition hover:bg-violet-700"
            >
              <ShieldCheck className="h-4 w-4" />
              Verify Recruitment
            </Link>
          </nav>

          {/* MOBILE USER AREA */}

          <div className="flex items-center gap-4 border-t border-slate-200 p-5">
            <NotificationBell />
            <UserMenu />
          </div>
        </div>
      )}
    </header>
  );
}

/* =========================================================
   DESKTOP DROPDOWN
========================================================= */

function DesktopDropdown({
  title,
  items,
  pathname,
  open,
  onToggle,
  onNavigate,
  isActive: active,
}: {
  title: string;
  items: NavItem[];
  pathname: string;
  open: boolean;
  onToggle: () => void;
  onNavigate: () => void;
  isActive: boolean;
}) {
  const itemIsActive = (href: string) => {
    const cleanHref = href.split("#")[0];

    /*
      Recruitment Verification uses /analyze.
      If the user is on /verify, don't mark /analyze active.
    */

    if (href === "/analyze" && pathname === "/verify") {
      return false;
    }

    if (cleanHref === "/") {
      return pathname === "/";
    }

    return (
      pathname === cleanHref ||
      pathname.startsWith(`${cleanHref}/`)
    );
  };

  return (
    <div className="relative">
      {/* DROPDOWN BUTTON */}

      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={onToggle}
        className={`flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-bold transition ${
          active
            ? "bg-indigo-50 text-indigo-700"
            : "text-slate-700 hover:bg-slate-100 hover:text-cyan-700"
        }`}
      >
        <span>{title}</span>

        <ChevronDown
          className={`h-4 w-4 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* DROPDOWN MENU */}

      {open && (
        <div
          role="menu"
          className="absolute left-1/2 top-full z-[100] mt-2 w-72 -translate-x-1/2 overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl shadow-slate-300/40"
        >
          {items.map((item) => {
            const Icon = item.icon;
            const activeItem = itemIsActive(item.href);

            return (
              <Link
                key={`${item.href}-${item.label}`}
                href={item.href}
                role="menuitem"
                onClick={onNavigate}
                className={`group flex items-center gap-3 rounded-xl px-3 py-3 transition ${
                  activeItem
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-slate-700 hover:bg-indigo-50 hover:text-indigo-700"
                }`}
              >
                {/* ICON */}

                {Icon && (
                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                      activeItem
                        ? "bg-indigo-100 text-indigo-700"
                        : "bg-slate-100 text-slate-600 group-hover:bg-indigo-100 group-hover:text-indigo-700"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                  </span>
                )}

                {/* TEXT */}

                <span className="flex-1">
                  <span className="block text-sm font-semibold">
                    {item.label}
                  </span>
                </span>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* =========================================================
   MOBILE SECTION
========================================================= */

function MobileSection({
  title,
  section,
  items,
  open,
  onToggle,
  onNavigate,
  isItemActive,
}: {
  title: string;
  section: string;
  items: NavItem[];
  open: boolean;
  onToggle: () => void;
  onNavigate: () => void;
  isItemActive: (href: string) => boolean;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-100">
      {/* SECTION BUTTON */}

      <button
        type="button"
        aria-expanded={open}
        onClick={onToggle}
        className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-left text-sm font-semibold transition ${
          open
            ? "bg-indigo-50 text-indigo-700"
            : "text-slate-700 hover:bg-slate-50"
        }`}
      >
        <span>{title}</span>

        <ChevronDown
          className={`h-4 w-4 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* SECTION ITEMS */}

      {open && (
        <div className="space-y-1 bg-slate-50/60 px-2 pb-2 pt-1">
          {items.map((item) => {
            const Icon = item.icon;
            const active = isItemActive(item.href);

            return (
              <Link
                key={`${section}-${item.href}-${item.label}`}
                href={item.href}
                onClick={onNavigate}
                className={`flex items-center gap-3 rounded-lg px-3 py-3 text-sm transition ${
                  active
                    ? "bg-indigo-100 font-semibold text-indigo-700"
                    : "text-slate-600 hover:bg-indigo-50 hover:text-indigo-700"
                }`}
              >
                {Icon && (
                  <Icon
                    className={`h-4 w-4 ${
                      active
                        ? "text-indigo-700"
                        : "text-indigo-600"
                    }`}
                  />
                )}

                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default SiteHeader;