"use client";

import { useEffect, useState } from "react";

import {
  BrainCircuit,
  GraduationCap,
  Code2,
  FolderGit2,
  Briefcase,
  ShieldCheck,
  Building2,
 IndianRupee,
} from "lucide-react";

import {
  StudentProfile,
  VerifiedJob,
} from "@/types/career-dna";

interface Props {
  verifiedJob: any;
  onAnalyze: (student: StudentProfile) => void;
}

export default function StudentForm({
  verifiedJob,
  onAnalyze,
}: Props) {
  const [student, setStudent] = useState<StudentProfile>({
    degree: "",
    year: "",
    cgpa: "",
    skills: "",
    projects: "",
    internship: "",
    github: "",
    linkedin: "",
  });

  function update(
    key: keyof StudentProfile,
    value: string
  ) {

    setStudent((prev) => ({
      ...prev,
      [key]: value,
    }));

  }

  return (

    <div className="space-y-8">

      {/* VERIFIED JOB */}

      <div className="rounded-3xl border border-green-200 bg-gradient-to-r from-green-50 to-emerald-50 p-8 shadow">

        <div className="mb-8 flex items-center gap-4">

          <ShieldCheck className="h-10 w-10 text-green-600" />

          <div>

            <h2 className="text-3xl font-bold">

              Verified Recruitment

            </h2>

            <p className="text-slate-600">

              This recruitment was verified by Guardian Verify™

            </p>

          </div>

        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">

          <Card
            icon={<Building2 />}
            title="Company"
value={verifiedJob?.company}          />

          <Card
            icon={<Briefcase />}
            title="Role"
            value={verifiedJob?.jobRole}
          />

          <Card
            icon={<IndianRupee />}
            title="Salary"
            value={verifiedJob?.salary}
          />

          <Card
            icon={<GraduationCap />}
            title="Education"
            value={verifiedJob?.education}
          />

        </div>

        <div className="mt-8 rounded-2xl bg-white p-6">

          <h3 className="mb-4 text-xl font-bold">

            Required Skills

          </h3>

          <div className="flex flex-wrap gap-3">

            {verifiedJob?.requiredSkills?.map((skill: string) => (

                <span
                  key={skill}
                  className="rounded-full bg-blue-100 px-4 py-2 font-semibold text-blue-700"
                >

                  {skill}

                </span>

              )
            )}

          </div>

        </div>

      </div>

      {/* STUDENT */}

      <div className="rounded-3xl bg-white p-8 shadow-xl">

        <div className="flex items-center gap-4">

          <BrainCircuit className="h-10 w-10 text-blue-600" />

          <div>

            <h2 className="text-3xl font-bold">

              Student Profile

            </h2>

            <p className="text-slate-500">

              Guardian AI will compare this profile with the verified recruitment.

            </p>

          </div>

        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2">

          <Input
            icon={<GraduationCap />}
            title="Degree"
            value={student.degree}
            onChange={(v: string)=>update("degree",v)}
          />

          <Input
            icon={<GraduationCap />}
            title="Current Year"
            value={student.year}
            onChange={(v: string)=>update("year",v)}
          />

          <Input
            icon={<GraduationCap />}
            title="CGPA"
            value={student.cgpa}
            onChange={(v: string)=>update("cgpa",v)}
          />

          <Input
            icon={<Code2 />}
            title="Skills"
            value={student.skills}
            onChange={(v: string)=>update("skills",v)}
          />

          <Input
            icon={<FolderGit2 />}
            title="Projects"
            value={student.projects}
            onChange={(v: string)=>update("projects",v)}
          />

          <Input
            icon={<Briefcase />}
            title="Internship"
            value={student.internship}
            onChange={(v: string)=>update("internship",v)}
          />

          <Input
            icon={<Code2 />}
            title="GitHub"
            value={student.github}
            onChange={(v: string)=>update("github",v)}
          />

          <Input
            icon={<Code2 />}
            title="LinkedIn"
            value={student.linkedin}
            onChange={(v: string)=>update("linkedin",v)}
          />

        </div>

        <button
          onClick={() => onAnalyze(student)}
          className="mt-10 w-full rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 py-5 text-lg font-bold text-white"
        >

          Generate Guardian Career DNA™

        </button>

      </div>

    </div>

  );

}

function Card({
  icon,
  title,
  value,
}:any){

  return(

    <div className="rounded-2xl bg-white p-5">

      <div className="mb-3 text-blue-600">

        {icon}

      </div>

      <p className="text-sm text-slate-500">

        {title}

      </p>

      <h3 className="mt-2 font-bold">

        {value || "-"}

      </h3>

    </div>

  );

}

function Input({
  icon,
  title,
  value,
  onChange,
}:any){

  return(

    <div>

      <label className="mb-2 flex items-center gap-2 font-semibold">

        {icon}

        {title}

      </label>

      <input
        value={value}
        onChange={(e)=>onChange(e.target.value)}
        className="w-full rounded-xl border border-slate-300 p-4 outline-none focus:border-blue-600"
      />

    </div>

  );

}