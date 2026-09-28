"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/src/context/LanguageContext";
import {
  User,
  LayoutDashboard,
  Settings,
  LogOut,
  ChevronDown,
} from "lucide-react";

interface UserData {
  name: string;
  email: string;
}

export default function UserMenu() {
  const { t } = useLanguage();
  const menuRef = useRef<HTMLDivElement>(null);

  const [open, setOpen] = useState(false);

  const [user, setUser] = useState<UserData | null>(null);

  useEffect(() => {
    loadProfile();

    function handleClick(e: MouseEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClick);

    return () =>
      document.removeEventListener("mousedown", handleClick);
  }, []);

  async function loadProfile() {
    try {
      const res = await fetch("/api/profile", {
        credentials: "same-origin",
        cache: "no-store",
      });

      if (res.status === 401 || res.status === 403) {
        setUser(null);
        return;
      }

      if (!res.ok) {
        throw new Error(`Profile request failed with status ${res.status}`);
      }

      const json = await res.json();

      if (json.success) {
        setUser(json.user);
      } else {
        setUser(null);
      }
    } catch (err) {
      console.warn("Profile fetch skipped because user is not authenticated.");
      setUser(null);
    }
  }
  async function logout() {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
      });

      // Clear local user state immediately
      setUser(null);

      // Close dropdown
      setOpen(false);

      // Go to home page with fresh reload
      window.location.href = "/";
    } catch (err) {
      console.error(err);
    }
  }

  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <Link href="/login" className="rounded-lg px-3 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-100 hover:text-cyan-700">
          Log in
        </Link>
        <Link href="/signup" className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-bold text-slate-900 transition hover:border-pink-400 hover:text-pink-700">
          Create account
        </Link>
      </div>
    );
  }

  return (
    <div
      ref={menuRef}
      className="relative shrink-0"
    >
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-2 shadow-sm transition hover:border-cyan-200 hover:shadow-md"
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 text-lg font-bold text-white">
          {user.name.charAt(0).toUpperCase()}
        </div>

        <div className="hidden min-w-0 max-w-[150px] text-left lg:block">

          <p className="text-sm font-semibold text-slate-900">
            <span className="block truncate">{user.name}</span>
          </p>

          <p className="text-xs text-slate-500">
            <span className="block truncate">{user.email}</span>
          </p>

        </div>

        <ChevronDown
          className={`h-4 w-4 transition ${
            open ? "rotate-180" : ""
          }`}
        />

      </button>

      {open && (

        <div className="absolute right-0 mt-3 w-72 max-w-[calc(100vw-2rem)] overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl">

          <div className="bg-gradient-to-r from-blue-600 to-cyan-500 p-6 text-white">

            <div className="flex items-center gap-4">

              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/20 text-2xl font-bold">

                {user.name.charAt(0).toUpperCase()}

              </div>

              <div>

                <h3 className="font-bold">
                  {user.name}
                </h3>

                <p className="max-w-[190px] truncate text-sm text-blue-100">
                  {user.email}
                </p>

              </div>

            </div>

          </div>

          <div className="p-3">

            <Link
              href="/profile"
              className="flex items-center gap-3 rounded-xl px-4 py-3 transition hover:bg-slate-100"
              onClick={() => setOpen(false)}
            >

              <User className="h-5 w-5 text-blue-600" />

              {t("myProfile")}

            </Link>

            <Link
              href="/dashboard"
              className="mt-1 flex items-center gap-3 rounded-xl px-4 py-3 transition hover:bg-slate-100"
              onClick={() => setOpen(false)}
            >

              <LayoutDashboard className="h-5 w-5 text-green-600" />

              {t("dashboard")}

            </Link>

            <Link
              href="/settings"
              className="mt-1 flex items-center gap-3 rounded-xl px-4 py-3 transition hover:bg-slate-100"
              onClick={() => setOpen(false)}
            >

              <Settings className="h-5 w-5 text-violet-600" />

              {t("settings")}

            </Link>

            <button
              onClick={logout}
              className="mt-2 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left transition hover:bg-red-50 hover:text-red-600"
            >

              <LogOut className="h-5 w-5" />

              {t("logout")}

            </button>

          </div>

        </div>

      )}

    </div>
  );
}