"use client";

import {
  AlertTriangle,
  Clock3,
  BellRing,
  ShieldAlert,
} from "lucide-react";

const alerts = [
  {
    title: "Fake Railway Recruitment Website",
    level: "HIGH",
    color: "bg-red-100 text-red-600",
    time: "2 Hours Ago",
    description:
      "Multiple fake websites are impersonating Indian Railways recruitment. Always verify the official website before applying.",
  },
  {
    title: "Fake TCS Internship Offer",
    level: "MEDIUM",
    color: "bg-orange-100 text-orange-600",
    time: "Yesterday",
    description:
      "Students reported receiving fake internship emails requesting registration fees through UPI.",
  },
  {
    title: "Fake TNPSC Notification",
    level: "LOW",
    color: "bg-yellow-100 text-yellow-700",
    time: "2 Days Ago",
    description:
      "A fake TNPSC notification is circulating on WhatsApp groups with an unofficial application link.",
  },
  {
    title: "Telegram Job Scam Alert",
    level: "HIGH",
    color: "bg-red-100 text-red-600",
    time: "3 Days Ago",
    description:
      "Fraudsters are creating fake Telegram recruitment channels promising high-paying government jobs.",
  },
];

export default function CommunityAlerts() {
  return (
    <section className="mt-16 rounded-3xl bg-gradient-to-br from-orange-50 via-white to-red-50 p-10 shadow-xl">

      {/* Header */}

      <div className="text-center">

        <span className="rounded-full bg-red-100 px-5 py-2 text-sm font-semibold text-red-600">

          COMMUNITY ALERTS

        </span>

        <h2 className="mt-5 text-4xl font-bold text-slate-900">

          Latest Scam Alerts

        </h2>

        <p className="mt-3 text-slate-600">

          Stay informed about the latest fake recruitment scams reported
          by students and verified by CareerGuardian AI.

        </p>

      </div>

      {/* Alert Cards */}

      <div className="mt-12 space-y-6">

        {alerts.map((alert) => (

          <div
            key={alert.title}
            className="rounded-3xl border border-slate-200 bg-white p-6 shadow transition hover:shadow-xl"
          >

            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

              <div className="flex items-start gap-4">

                <div className="rounded-2xl bg-red-100 p-4">

                  <ShieldAlert className="h-7 w-7 text-red-600" />

                </div>

                <div>

                  <h3 className="text-xl font-bold text-slate-900">

                    {alert.title}

                  </h3>

                  <p className="mt-2 text-slate-600">

                    {alert.description}

                  </p>

                  <div className="mt-4 flex items-center gap-2 text-sm text-slate-500">

                    <Clock3 className="h-4 w-4" />

                    {alert.time}

                  </div>

                </div>

              </div>

              <div>

                <span
                  className={`rounded-full px-5 py-2 text-sm font-bold ${alert.color}`}
                >

                  {alert.level} RISK

                </span>

              </div>

            </div>

          </div>

        ))}

      </div>

      {/* Bottom Information */}

      <div className="mt-12 rounded-3xl bg-gradient-to-r from-red-600 to-orange-500 p-8 text-white">

        <div className="flex items-center gap-4">

          <BellRing className="h-10 w-10" />

          <div>

            <h3 className="text-2xl font-bold">

              Stay Alert. Stay Safe.

            </h3>

            <p className="mt-2 text-red-100">

              CareerGuardian AI continuously monitors emerging
              recruitment scams to help students identify and
              avoid fraudulent opportunities.

            </p>

          </div>

        </div>

      </div>

      {/* Alert Statistics */}

      <div className="mt-12 grid gap-6 md:grid-cols-3">

        <div className="rounded-2xl bg-white p-6 text-center shadow">

          <AlertTriangle className="mx-auto h-10 w-10 text-red-600" />

          <h2 className="mt-4 text-3xl font-bold text-red-600">

            156

          </h2>

          <p className="mt-2 text-slate-600">

            Active Scam Alerts

          </p>

        </div>

        <div className="rounded-2xl bg-white p-6 text-center shadow">

          <ShieldAlert className="mx-auto h-10 w-10 text-blue-600" />

          <h2 className="mt-4 text-3xl font-bold text-blue-600">

            1,240+

          </h2>

          <p className="mt-2 text-slate-600">

            Reports Verified

          </p>

        </div>

        <div className="rounded-2xl bg-white p-6 text-center shadow">

          <BellRing className="mx-auto h-10 w-10 text-green-600" />

          <h2 className="mt-4 text-3xl font-bold text-green-600">

            98%

          </h2>

          <p className="mt-2 text-slate-600">

            Detection Accuracy

          </p>

        </div>

      </div>

    </section>
  );
}