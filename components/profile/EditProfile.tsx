"use client";

import { useEffect, useState } from "react";
import { Save, Loader2 } from "lucide-react";

export default function EditProfile() {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    college: "",
    degree: "",
    branch: "",
    cgpa: "",
    skills: "",
    careerGoal: "",
  });

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    const res = await fetch("/api/profile");

    const json = await res.json();

    if (json.success) {
      setForm({
        name: json.user.name || "",
        email: json.user.email || "",
        college: json.user.college || "",
        degree: json.user.degree || "",
        branch: json.user.branch || "",
        cgpa: json.user.cgpa || "",
        skills: json.user.skills?.join(", ") || "",
        careerGoal: json.user.careerGoal || "",
      });
    }
  }

  function update(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement
    >
  ) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function saveProfile() {
    setLoading(true);

    const res = await fetch("/api/profile/update", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...form,
        skills: form.skills
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      }),
    });

    const json = await res.json();

    if (json.success) {
      alert("Profile Updated Successfully");
    } else {
      alert(json.message);
    }

    setLoading(false);
  }

  return (
    <div className="rounded-3xl bg-white p-8 shadow">

      <h2 className="text-3xl font-bold">
        Edit Profile
      </h2>

      <div className="mt-8 grid gap-6 md:grid-cols-2">

        <Input
          label="Full Name"
          name="name"
          value={form.name}
          onChange={update}
        />

        <Input
          label="Email"
          name="email"
          value={form.email}
          onChange={update}
        />

        <Input
          label="College"
          name="college"
          value={form.college}
          onChange={update}
        />

        <Input
          label="Degree"
          name="degree"
          value={form.degree}
          onChange={update}
        />

        <Input
          label="Branch"
          name="branch"
          value={form.branch}
          onChange={update}
        />

        <Input
          label="CGPA"
          name="cgpa"
          value={form.cgpa}
          onChange={update}
        />

      </div>

      <div className="mt-6">

        <label className="mb-2 block font-semibold">
          Skills
        </label>

        <textarea
          rows={4}
          name="skills"
          value={form.skills}
          onChange={update}
          className="w-full rounded-xl border p-4"
        />

      </div>

      <div className="mt-6">

        <label className="mb-2 block font-semibold">
          Career Goal
        </label>

        <textarea
          rows={4}
          name="careerGoal"
          value={form.careerGoal}
          onChange={update}
          className="w-full rounded-xl border p-4"
        />

      </div>

      <button
        onClick={saveProfile}
        disabled={loading}
        className="mt-8 flex items-center gap-3 rounded-2xl bg-blue-600 px-8 py-4 text-white"
      >
        {loading ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            Saving...
          </>
        ) : (
          <>
            <Save className="h-5 w-5" />
            Save Profile
          </>
        )}
      </button>

    </div>
  );
}

function Input({
  label,
  ...props
}: any) {
  return (
    <div>

      <label className="mb-2 block font-semibold">
        {label}
      </label>

      <input
        {...props}
        className="w-full rounded-xl border p-3"
      />

    </div>
  );
}