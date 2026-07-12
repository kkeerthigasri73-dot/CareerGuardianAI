"use client";

import {
  Mail,
  Phone,
  MapPin,
  Link2,
  User,
  GraduationCap,
  GitBranch,
} from "lucide-react";

interface ResumeData {
  name: string;
  email: string;
  phone: string;
  location?: string;
  linkedin?: string;
  github?: string;

  professionalSummary?: string;

  college: string;
  degree: string;
  cgpa: string;
  passingYear?: string;

  skills: string[];

  projects: string[];
  internship: string[];
  certifications: string[];
  achievements: string[];
  languages: string[];
}

export default function ResumeTemplate({
  data,
}: {
  data: ResumeData;
}) {
  if (!data) return null;

  return (

    <div
      id="resume-template"
      className="mx-auto max-w-6xl overflow-hidden rounded-3xl bg-white shadow-2xl"
    >

      <div className="grid grid-cols-12">

        {/* ========================= */}
        {/* LEFT SIDEBAR */}
        {/* ========================= */}

        <aside className="col-span-4 bg-gradient-to-b from-slate-900 via-blue-950 to-slate-900 p-10 text-white">

          {/* Avatar */}

          <div className="flex justify-center">

            <div className="flex h-44 w-44 items-center justify-center rounded-full border-4 border-blue-500 bg-slate-200">

              <User className="h-24 w-24 text-slate-500"/>

            </div>

          </div>

          {/* Contact */}

          <div className="mt-10">

            <h2 className="mb-6 text-2xl font-bold tracking-wide">

              CONTACT

            </h2>

            <div className="space-y-5">

              <div className="flex items-center gap-4">

                <Mail className="text-blue-400"/>

                <span>{data.email}</span>

              </div>

              <div className="flex items-center gap-4">

                <Phone className="text-blue-400"/>

                <span>{data.phone}</span>

              </div>

              <div className="flex items-center gap-4">

                <MapPin className="text-blue-400"/>

                <span>

                  {data.location || "India"}

                </span>

              </div>

              <div className="flex items-center gap-4">

                <Link2 className="text-blue-400"/>

                <span>

                  {data.linkedin || "-"}

                </span>

              </div>

              <div className="flex items-center gap-4">

                <GitBranch className="text-blue-400"/>

                <span>

                  {data.github || "-"}

                </span>

              </div>

            </div>

          </div>

          {/* Career Snapshot */}

          <div className="mt-14">

            <h2 className="mb-6 text-2xl font-bold">

              CAREER SNAPSHOT

            </h2>

            <ul className="space-y-4 text-blue-100">

              <li>

                • AI optimized ATS Resume

              </li>

              <li>

                • Strong technical foundation

              </li>

              <li>

                • Industry-oriented projects

              </li>

              <li>

                • Quick learner

              </li>

              <li>

                • Excellent problem solving

              </li>

            </ul>

          </div>

          {/* Strengths */}

          <div className="mt-14">

            <h2 className="mb-6 text-2xl font-bold">

              KEY STRENGTHS

            </h2>

            <div className="space-y-3">

              {[
                "Problem Solving",
                "Critical Thinking",
                "Leadership",
                "Communication",
                "Team Collaboration",
              ].map((item) => (

                <div
                  key={item}
                  className="rounded-xl border border-blue-700 bg-blue-900/40 px-5 py-3"
                >

                  {item}

                </div>

              ))}

            </div>

          </div>

        </aside>

        {/* ========================= */}
        {/* RIGHT CONTENT */}
        {/* ========================= */}

        <main className="col-span-8 p-12">

          {/* Header */}

          <h1 className="text-6xl font-black text-slate-900">

            {data.name}

          </h1>

          <p className="mt-4 text-xl font-semibold uppercase tracking-[8px] text-blue-600">

            Software Engineer

          </p>

          <div className="my-8 h-[2px] bg-blue-200"/>

          {/* Professional Summary */}

          <section>

            <div className="mb-6 flex items-center gap-4">

              <div className="rounded-full bg-blue-600 p-3 text-white">

                <User className="h-6 w-6"/>

              </div>

              <h2 className="text-3xl font-bold">

                Professional Summary

              </h2>

            </div>

            <p className="leading-9 text-slate-700">

              {data.professionalSummary ||

              "Guardian AI generated ATS professional summary will appear here."}

            </p>

          </section>

          <div className="my-10 border-b"/>

          {/* Education */}

          <section>

            <div className="mb-6 flex items-center gap-4">

              <div className="rounded-full bg-blue-600 p-3 text-white">

                <GraduationCap className="h-6 w-6"/>

              </div>

              <h2 className="text-3xl font-bold">

                Education

              </h2>

            </div>

            <div className="rounded-2xl border border-slate-200 p-6">

              <h3 className="text-2xl font-bold">

                {data.degree}

              </h3>

              <p className="mt-2 text-lg">

                {data.college}

              </p>

              <div className="mt-5 flex gap-12">

                <span>

                  CGPA :

                  <strong>

                    {" "}

                    {data.cgpa}

                  </strong>

                </span>

                <span>

                  Graduation :

                  <strong>

                    {" "}

                    {data.passingYear || "-"}

                  </strong>

                </span>

              </div>

            </div>

          </section>
                    {/* Divider */}

          <div className="my-10 border-b" />

          {/* ========================= */}
          {/* Technical Skills */}
          {/* ========================= */}

          <section>

            <div className="mb-8 flex items-center gap-4">

              <div className="rounded-full bg-blue-600 p-3 text-white">

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.75 3v2.25M14.25 3v2.25M4.5 9.75H19.5M6.75 21h10.5A2.25 2.25 0 0019.5 18.75V8.25A2.25 2.25 0 0017.25 6H6.75A2.25 2.25 0 004.5 8.25v10.5A2.25 2.25 0 006.75 21z"
                  />
                </svg>

              </div>

              <h2 className="text-3xl font-bold">

                Technical Skills

              </h2>

            </div>

            <div className="flex flex-wrap gap-4">

              {data.skills.map((skill, index) => (

                <div
                  key={index}
                  className="rounded-full border border-blue-300 bg-blue-50 px-6 py-3 text-sm font-semibold text-blue-700 transition hover:bg-blue-600 hover:text-white"
                >

                  {skill}

                </div>

              ))}

            </div>

          </section>

          {/* Divider */}

          <div className="my-10 border-b" />

          {/* ========================= */}
          {/* Projects */}
          {/* ========================= */}

          <section>

            <h2 className="mb-8 text-3xl font-bold">

              Featured Projects

            </h2>

            <div className="space-y-6">

              {data.projects.map((project, index) => (

                <div

                  key={index}

                  className="rounded-3xl border border-slate-200 bg-gradient-to-r from-white to-slate-50 p-7 shadow-sm"

                >

                  <div className="flex items-center justify-between">

                    <h3 className="text-2xl font-bold">

                      {project}

                    </h3>

                    <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">

                      Project {index + 1}

                    </span>

                  </div>

                  <p className="mt-4 leading-8 text-slate-600">

                    Developed as part of academic and practical learning.

                    Demonstrates technical knowledge, analytical thinking,

                    software engineering practices and real-world

                    implementation skills.

                  </p>

                </div>

              ))}

            </div>

          </section>

          {/* Divider */}

          <div className="my-10 border-b" />
                    {/* ========================= */}
          {/* Internship */}
          {/* ========================= */}

          <section>

            <div className="mb-8 flex items-center gap-4">

              <div className="rounded-full bg-blue-600 p-3 text-white">

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 13V7a2 2 0 00-2-2h-3V3H9v2H6a2 2 0 00-2 2v6m16 0v6a2 2 0 01-2 2H6a2 2 0 01-2-2v-6m16 0H4"
                  />
                </svg>

              </div>

              <h2 className="text-3xl font-bold">

                Internship Experience

              </h2>

            </div>

            <div className="space-y-6">

              {data.internship.map((item, index) => (

                <div

                  key={index}

                  className="rounded-3xl border-l-8 border-blue-600 bg-slate-50 p-7 shadow-sm"

                >

                  <div className="flex items-center justify-between">

                    <h3 className="text-2xl font-bold">

                      Internship {index + 1}

                    </h3>

                    <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">

                      Industry Experience

                    </span>

                  </div>

                  <p className="mt-5 leading-8 text-slate-700">

                    {item}

                  </p>

                </div>

              ))}

            </div>

          </section>

          {/* Divider */}

          <div className="my-10 border-b"/>

          {/* ========================= */}
          {/* Certifications */}
          {/* ========================= */}

          <section>

            <div className="mb-8 flex items-center gap-4">

              <div className="rounded-full bg-blue-600 p-3 text-white">

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 1.343-3 3 0 .72.254 1.38.678 1.897L12 17l2.322-4.103A2.993 2.993 0 0015 11c0-1.657-1.343-3-3-3z"
                  />
                </svg>

              </div>

              <h2 className="text-3xl font-bold">

                Certifications

              </h2>

            </div>

            <div className="grid gap-5 md:grid-cols-2">

              {data.certifications.map((item, index) => (

                <div

                  key={index}

                  className="rounded-3xl border border-slate-200 bg-gradient-to-r from-blue-50 to-white p-6 shadow-sm transition hover:shadow-lg"

                >

                  <div className="mb-4 flex items-center justify-between">

                    <h3 className="font-bold text-blue-700">

                      Certificate {index + 1}

                    </h3>

                    <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">

                      VERIFIED

                    </span>

                  </div>

                  <p className="leading-7 text-slate-700">

                    {item}

                  </p>

                </div>

              ))}

            </div>

          </section>

          {/* Divider */}

          <div className="my-10 border-b"/>
                    {/* ========================= */}
          {/* Achievements */}
          {/* ========================= */}

          <section>

            <h2 className="mb-8 text-3xl font-bold">

              Achievements

            </h2>

            <div className="space-y-5">

              {data.achievements.length > 0 ? (

                data.achievements.map((item, index) => (

                  <div
                    key={index}
                    className="flex items-start gap-4 rounded-2xl border border-yellow-200 bg-yellow-50 p-5"
                  >

                    <div className="mt-1 flex h-10 w-10 items-center justify-center rounded-full bg-yellow-400 font-bold text-white">

                      ★

                    </div>

                    <div>

                      <h3 className="font-bold">

                        Achievement {index + 1}

                      </h3>

                      <p className="mt-2 leading-7 text-slate-700">

                        {item}

                      </p>

                    </div>

                  </div>

                ))

              ) : (

                <p className="text-slate-500">

                  No achievements added.

                </p>

              )}

            </div>

          </section>

          <div className="my-10 border-b" />

          {/* ========================= */}
          {/* Languages */}
          {/* ========================= */}

          <section>

            <h2 className="mb-8 text-3xl font-bold">

              Languages

            </h2>

            <div className="flex flex-wrap gap-4">

              {data.languages.map((language, index) => (

                <div

                  key={index}

                  className="rounded-full border border-slate-300 bg-slate-100 px-6 py-3 font-semibold"

                >

                  {language}

                </div>

              ))}

            </div>

          </section>

          <div className="my-10 border-b" />

          {/* ========================= */}
          {/* Guardian AI Insights */}
          {/* ========================= */}

          <section>

            <div className="rounded-3xl bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-500 p-8 text-white">

              <h2 className="text-3xl font-bold">

                Guardian AI Resume Insights

              </h2>

              <div className="mt-8 grid gap-5 md:grid-cols-2">

                <div className="rounded-2xl bg-white/10 p-5">

                  ✅ ATS Friendly Resume

                </div>

                <div className="rounded-2xl bg-white/10 p-5">

                  ✅ Optimized Skill Keywords

                </div>

                <div className="rounded-2xl bg-white/10 p-5">

                  ✅ Recruiter Ready Layout

                </div>

                <div className="rounded-2xl bg-white/10 p-5">

                  ✅ Career DNA Optimized

                </div>

              </div>

            </div>

          </section>

          <div className="mt-12 border-t pt-8">

            <div className="flex items-center justify-between">

              <div>

                <h3 className="text-xl font-bold text-blue-700">

                  Generated by Guardian Resume Studio™

                </h3>

                <p className="mt-2 text-slate-500">

                  AI-powered ATS Resume Generation Platform

                </p>

              </div>

              <div className="text-right">

                <p className="text-sm text-slate-500">

                  Powered by

                </p>

                <h3 className="text-xl font-bold text-blue-700">

                  Guardian AI

                </h3>

              </div>

            </div>

          </div>

        </main>

      </div>

    </div>

  );

}