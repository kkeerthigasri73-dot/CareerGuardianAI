"use client";

import { CheckCircle2, Loader2, XCircle } from "lucide-react";

interface TrustLayerProps {
  title: string;
  description: string;
  status: "pending" | "running" | "completed";
  passed?: boolean;
  message?: string;
}

export default function TrustLayer({
  title,
  description,
  status,
  passed,
  message,
}: TrustLayerProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

      <div className="flex items-center justify-between">

        <div className="flex items-center gap-4">

          {status === "completed" &&
            (passed ? (
              <CheckCircle2 className="h-7 w-7 text-green-600" />
            ) : (
              <XCircle className="h-7 w-7 text-red-600" />
            ))}

          {status === "running" && (
            <Loader2 className="h-7 w-7 animate-spin text-blue-600" />
          )}

          {status === "pending" && (
            <div className="h-7 w-7 rounded-full border-2 border-slate-300" />
          )}

          <div>

            <h3 className="font-semibold">
              {title}
            </h3>

            <p className="text-sm text-slate-500">
              {status === "completed"
                ? message
                : description}
            </p>

          </div>

        </div>

        {status === "completed" && (
          <span
            className={`rounded-full px-3 py-1 text-sm font-semibold ${
              passed
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {passed ? "PASS" : "FAIL"}
          </span>
        )}

        {status === "running" && (
          <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-700">
            Running
          </span>
        )}

        {status === "pending" && (
          <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-500">
            Waiting
          </span>
        )}

      </div>

    </div>
  );
}