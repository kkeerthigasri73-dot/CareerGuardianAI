"use client";

import { useState } from "react";

import InterviewSetup from "@/components/interview/InterviewSetup";
import InterviewQuestion from "@/components/interview/InterviewQuestion";
import EvaluationCard from "@/components/interview/EvaluationCard";
import InterviewResult from "@/components/interview/InterviewResult";
import InterviewWelcome from "@/components/interview/InterviewWelcome";
import downloadInterviewReport from "@/lib/interview/downloadInterviewReport";
export default function InterviewPage() {

  const [interview, setInterview] =
    useState<any>(null);

  const [currentQuestion, setCurrentQuestion] =
    useState(0);

  const [evaluation, setEvaluation] =
    useState<any>(null);

  const [evaluations, setEvaluations] =
    useState<any[]>([]);

  const [completed, setCompleted] =
    useState(false);

  const [finalReport, setFinalReport] =
    useState<any>(null);
  const [showWelcome, setShowWelcome] = useState(true);
  async function handleSubmit(
    question: any,
    answer: string
  ) {

    try {

      const response = await fetch(
        "/api/interview/evaluate",
        {

          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({

            company: interview.company,

            role:
              interview.jobRole ||
              interview.title,

            question:
              question.question,

            answer,

          }),

        }
      );

      const result =
        await response.json();

      if (!result.success) {

        alert(
          "Evaluation failed."
        );

        return;

      }

      setEvaluation(
        result.evaluation
      );

    } catch (err) {

      console.error(err);

      alert(
        "Interview evaluation failed."
      );

    }

  }
    function calculateResult(data: any[]) {

    if (!data.length) {

      return {

        overall: 0,

        technical: 0,

        communication: 0,

        confidence: 0,

        problemSolving: 0,

        hiringProbability: 0,

        recommendation:
          "No interview data available.",

        strengths: [],

        improvements: [],

      };

    }

    const technical = Math.round(
      data.reduce(
        (sum, item) => sum + item.technical,
        0
      ) / data.length
    );

    const communication = Math.round(
      data.reduce(
        (sum, item) => sum + item.communication,
        0
      ) / data.length
    );

    const confidence = Math.round(
      data.reduce(
        (sum, item) => sum + item.confidence,
        0
      ) / data.length
    );

    const problemSolving = Math.round(
      data.reduce(
        (sum, item) => sum + item.problemSolving,
        0
      ) / data.length
    );

    const overall = Math.round(
      data.reduce(
        (sum, item) => sum + item.overall,
        0
      ) / data.length
    );

    return {

      overall,

      technical,

      communication,

      confidence,

      problemSolving,

      hiringProbability:
        Math.min(overall + 5, 100),

      recommendation:

        overall >= 85

          ? "Excellent interview performance. You are ready for placements."

          : overall >= 70

          ? "Very good performance. Improve a few weak areas before interviews."

          : overall >= 50

          ? "Average performance. Practice technical interviews regularly."

          : "Continue improving your technical skills and communication.",

      strengths: [

        "Technical Understanding",

        "Communication",

        "Professional Attitude",

      ],

      improvements: [

        "Give more real-world examples.",

        "Improve confidence while answering.",

        "Explain your thought process clearly.",

      ],

    };

  }

  function nextQuestion() {

    if (!evaluation) return;

    const updated = [

      ...evaluations,

      evaluation,

    ];

    setEvaluations(updated);

    setEvaluation(null);

    if (

      currentQuestion <

      interview.questions.length - 1

    ) {

      setCurrentQuestion((prev) => prev + 1);

      return;

    }

    // Generate Final Report

    const report =
      calculateResult(updated);

    setFinalReport(report);

    setCompleted(true);

  }
    return (

    <main className="min-h-screen bg-slate-100">

      <section className="mx-auto max-w-7xl px-6 py-10">

        

       {showWelcome ? (

  <InterviewWelcome
    onStart={() => setShowWelcome(false)}
  />

) : !interview ? (

  <InterviewSetup
    onStart={setInterview}
  />

) : null}

        {interview && !completed && (

          <>

            <InterviewQuestion

              interview={interview}

              currentQuestion={currentQuestion}

              totalQuestions={
                interview.questions.length
              }

              onSubmit={handleSubmit}

            />

            {evaluation && (

              <div className="mt-8 space-y-8">

                <EvaluationCard
                  evaluation={evaluation}
                />

                <button

                  onClick={nextQuestion}

                  className="w-full rounded-2xl bg-gradient-to-r from-green-600 to-emerald-500 py-5 text-lg font-bold text-white shadow-lg transition hover:scale-[1.02]"

                >

                  {currentQuestion ===
                  interview.questions.length - 1

                    ? "Generate Guardian AI Report"

                    : "Continue to Next Question"}

                </button>

              </div>

            )}

          </>

        )}

        {completed && finalReport && (

          <InterviewResult

            result={finalReport}

           onDownload={() =>
downloadInterviewReport(finalReport)
}

          />

        )}

      </section>

    </main>

  );

}