"use client";

import { useEffect, useState } from "react";

import ResumeHeader from "@/components/resumeBuilder/ResumeHeader";
import ResumeForm from "@/components/resumeBuilder/ResumeForm";
import ResumePreview from "@/components/resumeBuilder/ResumePreview";

export default function ResumeBuilderPage() {

  const [careerDNA, setCareerDNA] =
    useState<any>(null);

  const [resumeData, setResumeData] =
    useState<any>(null);

  const [loading, setLoading] =
    useState(false);

  const [editing, setEditing] =
    useState(true);

  useEffect(() => {

    loadCareerDNA();

  }, []);

  async function loadCareerDNA() {

    try {

      const response =
        await fetch(
          "/api/career-dna/latest"
        );

      const result =
        await response.json();

      if (result.success) {

        setCareerDNA(result.data);

      }

    } catch (err) {

      console.error(err);

    }

  }

  async function generateResume() {

    if (!careerDNA) {

      alert("Career DNA not found.");

      return;

    }

    try {

      setLoading(true);

      const response =
        await fetch(
          "/api/resume/generate",
          {

            method: "POST",

            headers: {

              "Content-Type":
                "application/json",

            },

            body: JSON.stringify({

              careerDNAId:
                careerDNA._id,

            }),

          }
        );

      const result =
        await response.json();

      if (!result.success) {

        alert(
          "Resume generation failed."
        );

        return;

      }

      setResumeData({

        ...careerDNA.student,

        ...result.data,

      });

      setEditing(false);

    } catch (err) {

      console.error(err);

    } finally {

      setLoading(false);

    }

  }

  return (

    <main className="min-h-screen bg-slate-100">

      <section className="mx-auto max-w-7xl px-6 py-10">

        <ResumeHeader />

        <div className="mt-10">

          {editing ? (

            <ResumeForm

              onGenerate={generateResume}

            />

          ) : (

            <ResumePreview

              data={resumeData}

              onEdit={() =>
                setEditing(true)
              }

            />

          )}

        </div>

        {loading && (

          <div className="mt-8 rounded-3xl bg-white p-10 text-center shadow-xl">

            <h2 className="text-3xl font-bold">

              Guardian AI is building your ATS Resume...

            </h2>

            <p className="mt-4 text-slate-500">

              Optimizing resume according to the verified recruitment.

            </p>

          </div>

        )}

      </section>

    </main>

  );

}