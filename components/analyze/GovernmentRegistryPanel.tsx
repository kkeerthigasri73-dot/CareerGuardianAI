import { AlertTriangle, CircleHelp, ShieldCheck } from "lucide-react";
import type { GovernmentVerificationResult } from "@/lib/governmentRegistry";

type GovernmentRegistryPanelProps = {
  result?: GovernmentVerificationResult | null;
};

function statusStyle(status: string) {
  if (["VERIFIED", "PASS", "SAFE", "CONSISTENT"].includes(status)) {
    return "border-emerald-200 bg-emerald-50 text-emerald-800";
  }
  if (["SUSPICIOUS", "FAIL", "PERSONAL_OR_SUSPICIOUS", "INCONSISTENT"].includes(status)) {
    return "border-red-200 bg-red-50 text-red-800";
  }
  return "border-amber-200 bg-amber-50 text-amber-800";
}

function StatusValue({ status }: { status: string }) {
  return (
    <span className={`inline-flex rounded-md border px-2 py-1 text-xs font-semibold ${statusStyle(status)}`}>
      {status.replaceAll("_", " ")}
    </span>
  );
}

export default function GovernmentRegistryPanel({ result }: GovernmentRegistryPanelProps) {
  if (!result) return null;

  const notApplicable = !result.isGovernmentJobClaim;
  const unavailable = result.verificationStatus === "UNAVAILABLE";
  const flags = result.redFlags || [];
  const positives = result.positiveSignals || [];

  return (
    <section aria-labelledby="government-registry-title" className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-200 bg-slate-50 px-5 py-4 sm:px-6">
        <div className="flex items-start gap-3">
          <div className="rounded-lg bg-teal-100 p-2 text-teal-800">
            <ShieldCheck aria-hidden="true" className="h-5 w-5" />
          </div>
          <div>
            <h2 id="government-registry-title" className="font-bold text-slate-900">Government registry cross-check</h2>
            <p className="mt-1 max-w-2xl text-sm text-slate-600">
              {notApplicable
                ? "No government recruitment claim was detected in this submission."
                : result.recommendation}
            </p>
          </div>
        </div>
        <StatusValue status={result.verificationStatus} />
      </div>

      <div className="grid gap-px bg-slate-200 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white px-5 py-4">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Official domain</p>
          <div className="mt-2"><StatusValue status={result.domainValidation.status} /></div>
          {result.domainValidation.urlChecked && <p className="mt-2 break-all text-xs text-slate-600">{result.domainValidation.urlChecked}</p>}
        </div>
        <div className="bg-white px-5 py-4">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Notification match</p>
          <div className="mt-2"><StatusValue status={result.notificationMatch.status} /></div>
          {result.notificationNumber && <p className="mt-2 text-xs text-slate-600">Ref: {result.notificationNumber}</p>}
        </div>
        <div className="bg-white px-5 py-4">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Recruitment details</p>
          <div className="mt-2"><StatusValue status={result.recruitmentConsistency.status} /></div>
        </div>
        <div className="bg-white px-5 py-4">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Payment route</p>
          <div className="mt-2"><StatusValue status={result.paymentSafety.status} /></div>
        </div>
      </div>

      {!notApplicable && (
        <div className="space-y-4 px-5 py-4 sm:px-6">
          <p className="text-sm text-slate-600">{result.domainValidation.reason}</p>

          {result.registryChecks.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-slate-800">Registry sources</h3>
              <ul className="mt-2 divide-y divide-slate-100">
                {result.registryChecks.map((check) => (
                  <li key={check.source} className="flex flex-wrap items-center justify-between gap-2 py-2 text-sm">
                    <span className="font-medium text-slate-700">{check.source}</span>
                    <span className="flex items-center gap-2">
                      <span className="max-w-xl text-right text-xs text-slate-500">{check.evidence}</span>
                      <StatusValue status={check.status} />
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {flags.length > 0 && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4">
              <h3 className="flex items-center gap-2 text-sm font-semibold text-red-900">
                <AlertTriangle aria-hidden="true" className="h-4 w-4" /> Evidence requiring caution
              </h3>
              <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-red-800">
                {flags.map((flag) => <li key={flag}>{flag}</li>)}
              </ul>
            </div>
          )}

          {positives.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-slate-800">Supporting signals</h3>
              <ul className="mt-1 list-inside list-disc space-y-1 text-sm text-slate-600">
                {positives.map((signal) => <li key={signal}>{signal}</li>)}
              </ul>
            </div>
          )}

          {(unavailable || result.evidenceQuality === "UNAVAILABLE") && (
            <p className="flex items-start gap-2 border-t border-slate-200 pt-3 text-xs text-slate-500">
              <CircleHelp aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" />
              One or more official registry sources could not be reached or are not configured. This is an unavailable check, not evidence that the notice is fraudulent.
            </p>
          )}
        </div>
      )}
    </section>
  );
}