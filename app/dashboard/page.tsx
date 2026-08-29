"use client";

import { useEffect, useRef, useState } from "react";

import DashboardHeader from "@/components/dashboard/DashboardHeader";
import ProgressCards from "@/components/dashboard/ProgressCards";
import ActivityTimeline from "@/components/dashboard/ActivityTimeline";
import GuardianInsights from "@/components/dashboard/GuardianInsights";
import QuickActions from "@/components/dashboard/QuickActions";

export default function DashboardPage() {

  const [loading, setLoading] = useState(true);

  const [dashboard, setDashboard] = useState<any>(null);
  const hasLoadedRef = useRef(false);

  useEffect(() => {

    if (hasLoadedRef.current) return;

    hasLoadedRef.current = true;
    loadDashboard();

  }, []);

  async function loadDashboard() {

    try {

      const response = await fetch("/api/dashboard", {
        credentials: "same-origin",
      });

      if (response.status === 401 || response.status === 403) {
        throw new Error("Your session has expired. Please log in again.");
        return;
      }

      if (!response.ok) {
        throw new Error(`Dashboard request failed: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {

        setDashboard(result);

      }

    } catch (err) {

      console.error(err);

    } finally {

      setLoading(false);

    }

  }

  if (loading) {

    return (

      <main className="flex min-h-screen items-center justify-center bg-slate-100">

        <div className="text-center">

          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />

          <h1 className="text-3xl font-bold text-slate-900">

            Loading Guardian Dashboard...

          </h1>

          <p className="mt-3 text-slate-600">

            Verifying your secure session.

          </p>

        </div>

      </main>

    );

  }

  if (!dashboard) {

    return (

      <main className="flex min-h-screen items-center justify-center">

        <h1 className="text-3xl font-bold">

          No Dashboard Data Found

        </h1>

      </main>

    );

  }

  return (

    <main className="min-h-screen bg-slate-100">

      <section className="mx-auto max-w-7xl space-y-10 px-6 py-10">

        <DashboardHeader

          name={dashboard.career?.student?.name || "Student"}

          guardianScore={dashboard.guardianScore}

        />

        <ProgressCards

          verificationScore={dashboard.verificationScore}

          careerScore={dashboard.careerScore}

          resumeScore={dashboard.resumeScore}

          interviewScore={dashboard.interviewScore}

          guardianScore={dashboard.guardianScore}

        />

        <ActivityTimeline

          verificationCompleted={!!dashboard.verification}

          careerCompleted={!!dashboard.career}

          resumeCompleted={!!dashboard.resume}

          interviewCompleted={!!dashboard.interview}

        />

        <GuardianInsights

          insights={

            dashboard.career?.report?.weakAreas || []

          }

          companies={

            dashboard.career?.report?.recommendedCompanies || []

          }

          roadmap={

            dashboard.career?.report?.learningRoadmap?.map(

              (item: any) => `${item.week} - ${item.task}`

            ) || []

          }

        />

        <QuickActions />

      </section>

    </main>

  );

}