"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LogIn, Loader2 } from "lucide-react";

export default function LoginForm() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  function update(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function login() {

    if (!form.email || !form.password) {
      alert("Please enter email and password.");
      return;
    }

    setLoading(true);

    try {

      const res = await fetch("/api/auth/login", {

        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(form),

      });

      const json = await res.json();

      if (json.success) {
  alert("Login Successful!");

  window.location.replace("/dashboard");

  return;
} else {
  alert(json.message);
}
    } catch {

      alert("Login Failed");

    }

    setLoading(false);

  }

  return (

    <div className="rounded-3xl bg-white p-8 shadow-xl">

      <h2 className="text-3xl font-bold">

        Login

      </h2>

      <p className="mt-2 text-slate-500">

        Welcome back to CareerGuardian AI

      </p>

      <div className="mt-8 space-y-5">

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={update}
          className="w-full rounded-xl border p-4"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={update}
          className="w-full rounded-xl border p-4"
        />

      </div>

      <button
        onClick={login}
        disabled={loading}
        className="mt-8 flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-600 py-4 text-lg font-semibold text-white"
      >

        {loading ? (

          <>

            <Loader2 className="h-5 w-5 animate-spin"/>

            Signing In...

          </>

        ) : (

          <>

            <LogIn className="h-5 w-5"/>

            Login

          </>

        )}

      </button>

      <p className="mt-6 text-center text-slate-500">

        Don't have an account?

        <Link
          href="/signup"
          className="ml-2 font-semibold text-blue-600"
        >

          Create Account

        </Link>

      </p>

    </div>

  );

}