"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  User,
  LayoutDashboard,
  LogOut,
  ChevronDown,
} from "lucide-react";

interface UserData {
  name: string;
  email: string;
}

export default function UserMenu() {
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
    const res = await fetch("/api/profile");

    console.log("Status:", res.status);

    const text = await res.text();

    console.log("Response:", text);

    if (!res.ok) {
      setUser(null);
      return;
    }

    const json = JSON.parse(text);

    if (json.success) {
      setUser(json.user);
    } else {
      setUser(null);
    }

  } catch (err) {
    console.error(err);
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

  if (!user) return null;

  return (
    <div
      ref={menuRef}
      className="relative"
    >
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-2 shadow-sm transition hover:shadow-md"
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 text-lg font-bold text-white">
          {user.name.charAt(0).toUpperCase()}
        </div>

        <div className="hidden text-left lg:block">

          <p className="text-sm font-semibold text-slate-900">
            {user.name}
          </p>

          <p className="text-xs text-slate-500">
            {user.email}
          </p>

        </div>

        <ChevronDown
          className={`h-4 w-4 transition ${
            open ? "rotate-180" : ""
          }`}
        />

      </button>

      {open && (

        <div className="absolute right-0 mt-3 w-72 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl">

          <div className="bg-gradient-to-r from-blue-600 to-cyan-500 p-6 text-white">

            <div className="flex items-center gap-4">

              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/20 text-2xl font-bold">

                {user.name.charAt(0).toUpperCase()}

              </div>

              <div>

                <h3 className="font-bold">
                  {user.name}
                </h3>

                <p className="text-sm text-blue-100">
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

              My Profile

            </Link>

            <Link
              href="/dashboard"
              className="mt-1 flex items-center gap-3 rounded-xl px-4 py-3 transition hover:bg-slate-100"
              onClick={() => setOpen(false)}
            >

              <LayoutDashboard className="h-5 w-5 text-green-600" />

              Dashboard

            </Link>

            <button
              onClick={logout}
              className="mt-2 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left transition hover:bg-red-50 hover:text-red-600"
            >

              <LogOut className="h-5 w-5" />

              Logout

            </button>

          </div>

        </div>

      )}

    </div>
  );
}