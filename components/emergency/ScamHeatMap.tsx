"use client";

import {
  AlertTriangle,
  TrendingUp,
  ShieldCheck,
  MapPinned,
} from "lucide-react";

import TamilNaduMap from "./TamilNadumap";

export default function ScamHeatMap() {
  return (
    <section className="mt-16 rounded-3xl bg-gradient-to-br from-blue-50 via-white to-cyan-50 p-10 shadow-xl">

      {/* Header */}

      <div className="text-center">

        <span className="rounded-full bg-blue-100 px-5 py-2 text-sm font-semibold text-blue-700">

          AI SCAM ANALYTICS

        </span>

        <h2 className="mt-5 text-4xl font-bold text-slate-900">

          Recruitment Scam Heat Map

        </h2>

        <p className="mt-3 text-slate-600">

          CareerGuardian AI continuously analyzes recruitment
          scam reports to identify high-risk regions.

        </p>

      </div>

      {/* Statistics */}

      <div className="mt-12 grid gap-6 md:grid-cols-4">

        <StatCard
          icon={<AlertTriangle className="h-8 w-8 text-red-600" />}
          title="125"
          subtitle="Scam Reports"
        />

        <StatCard
          icon={<MapPinned className="h-8 w-8 text-blue-600" />}
          title="18"
          subtitle="Cities Monitored"
        />

        <StatCard
          icon={<TrendingUp className="h-8 w-8 text-orange-600" />}
          title="+12%"
          subtitle="Monthly Growth"
        />

        <StatCard
          icon={<ShieldCheck className="h-8 w-8 text-green-600" />}
          title="96%"
          subtitle="AI Accuracy"
        />

      </div>

      {/* Interactive Map */}

      <div className="mt-14">

        <TamilNaduMap />

      </div>

      {/* Weekly Trend */}

      <div className="mt-14 rounded-3xl bg-white p-8 shadow-lg">

        <h2 className="mb-8 text-2xl font-bold">

          Weekly Scam Trend

        </h2>

        <div className="flex items-end justify-between gap-4">

          {[
            35,
            55,
            65,
            90,
            70,
            50,
            40,
          ].map((height, index) => (

            <div
              key={index}
              className="flex flex-1 flex-col items-center"
            >

              <div
                className="w-full rounded-t-xl bg-gradient-to-t from-red-600 to-orange-400"
                style={{
                  height: `${height * 2}px`,
                }}
              />

              <p className="mt-3 text-sm">

                {["Mon","Tue","Wed","Thu","Fri","Sat","Sun"][index]}

              </p>

            </div>

          ))}

        </div>

      </div>

      {/* AI Recommendation */}

      <div className="mt-14 rounded-3xl bg-gradient-to-r from-red-600 to-orange-500 p-8 text-white shadow-xl">

        <h2 className="text-3xl font-bold">

          🤖 AI Recommendation

        </h2>

        <p className="mt-5 leading-8 text-red-100">

          Recruitment scams are increasing in metropolitan
          regions. Always verify company domains, recruiter
          emails and avoid making advance payments before
          joining any organization.

        </p>

      </div>

      {/* Report Button */}

      <div className="mt-12 text-center">

        <button
  onClick={() => {
    document
      .getElementById("report-scam")
      ?.scrollIntoView({
        behavior: "smooth",
      });
  }}
  className="rounded-2xl bg-red-600 px-10 py-4 text-lg font-semibold text-white transition hover:bg-red-700"
>
  🚨 Report Scam
</button>

      </div>

    </section>
  );
}

function StatCard({
  icon,
  title,
  subtitle,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="rounded-2xl bg-white p-6 text-center shadow">

      <div className="flex justify-center">

        {icon}

      </div>

      <h2 className="mt-4 text-3xl font-bold">

        {title}

      </h2>

      <p className="mt-2 text-slate-600">

        {subtitle}

      </p>

    </div>
  );
}