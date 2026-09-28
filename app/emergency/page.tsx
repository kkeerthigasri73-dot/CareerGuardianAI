"use client";

import { useEffect, useState } from "react";

import { BANKS } from "@/app/data/banks";
import EmergencyBanner from "@/components/emergency/EmergencyBanner";
import VictimSummary from "@/components/emergency/VictimSummary";
import RecoveryTimeline from "@/components/emergency/RecoveryTimeline";
import EmergencyActions from "@/components/emergency/EmergencyActions";
import ComplaintGenerator from "@/components/emergency/ComplaintGenerator";
import EvidenceLocker from "@/components/emergency/EvidenceLocker";
import EmergencyWizard from "@/components/emergency/EmergencyWizard";
import RecoveryProgress from "@/components/emergency/RecoveryProgress";
import LegalAssistant from "@/components/emergency/LegalAssistant";
import RecoveryAssistant from "@/components/emergency/RecoveryAssistant";
import FraudChecklist from "@/components/emergency/FraudChecklist";
import EmergencyContacts from "@/components/emergency/EmergencyContacts";
import ScamHeatMap from "@/components/emergency/ScamHeatMap";
import CommunityAlerts from "@/components/emergency/CommunityAlerts";
import SuccessStories from "@/components/emergency/SuccessStories";
import PreventionTips from "@/components/emergency/PreventionTips";
import HelpCenter from "@/components/emergency/HelpCenter";
import EmergencyFooter from "@/components/emergency/EmergencyFooter";
import EmergencyModeHeader from "@/components/emergency/EmergencyModeHeader";
import EmergencyCountdown from "@/components/emergency/EmergencyCountdown";
import ReportScam from "@/components/emergency/ReportScam";

export default function EmergencyPage() {
  const [recovery, setRecovery] = useState<any>(null);
  const [stage, setStage] = useState<"home" | "wizard" | "dashboard">("home");
  const [emergencyData, setEmergencyData] = useState<any>(null);
  const EmergencyBannerComp: any = EmergencyBanner;
  const VictimSummaryComp: any = VictimSummary;
  const RecoveryTimelineComp: any = RecoveryTimeline;
  const EmergencyActionsComp: any = EmergencyActions;
  const ComplaintGeneratorComp: any = ComplaintGenerator;
  const EvidenceLockerComp: any = EvidenceLocker;
  const RecoveryProgressComp: any = RecoveryProgress;
  const LegalAssistantComp: any = LegalAssistant;
  const RecoveryAssistantComp: any = RecoveryAssistant;
  const FraudChecklistComp: any = FraudChecklist;
  const EmergencyContactsComp: any = EmergencyContacts;
  const ScamHeatMapComp: any = ScamHeatMap;
  const CommunityAlertsComp: any = CommunityAlerts;
  const SuccessStoriesComp: any = SuccessStories;
  const PreventionTipsComp: any = PreventionTips;
  const HelpCenterComp: any = HelpCenter;
  const EmergencyFooterComp: any = EmergencyFooter;

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadRecovery() {
      try {
        const res = await fetch("/api/recovery");
        const result = await res.json();

        if (result.success) {
          setRecovery(result.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadRecovery();
  }, []);

  const handleCall1930 = () => {
    window.location.href = "tel:1930";
  };

  const handleNotifyBank = () => {
    const selectedBank = emergencyData?.bank || "SBI";
    const bankData = BANKS[selectedBank as keyof typeof BANKS] || BANKS.SBI;
    window.open(bankData.website, "_blank", "noopener,noreferrer");
  };

  const handleGenerateComplaint = () => {
    document.getElementById("complaint")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-100">
        <h2 className="text-2xl font-bold">Loading Guardian Recovery...</h2>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-100">
      <div className="mx-auto max-w-7xl space-y-12 px-6 py-10">
        {stage === "home" && (
          <EmergencyBannerComp data={recovery} onStart={() => setStage("wizard")} />
        )}

        {stage === "wizard" && (
          <EmergencyWizard
            open={true}
            onClose={() => setStage("home")}
            onFinish={(form) => {
              setEmergencyData(form);
              setStage("dashboard");
              setTimeout(() => {
                document.getElementById("emergency-dashboard")?.scrollIntoView({
                  behavior: "smooth",
                });
              }, 200);
            }}
          />
        )}

        {stage === "dashboard" && (
          <div id="emergency-dashboard">
            <EmergencyModeHeader
              data={recovery}
              emergency={emergencyData}
              onCall1930={handleCall1930}
              onNotifyBank={handleNotifyBank}
              onGenerateComplaint={handleGenerateComplaint}
            />
            <div className="mt-8">
              <EmergencyCountdown />
            </div>
            <VictimSummaryComp data={recovery} emergency={emergencyData} />
            <RecoveryTimelineComp data={recovery} emergency={emergencyData} />
            <EmergencyActionsComp data={recovery} />
            <ComplaintGeneratorComp data={recovery} emergency={emergencyData} />
            <EvidenceLockerComp data={recovery} />
            <RecoveryProgressComp data={recovery} emergency={emergencyData} />
            <LegalAssistantComp data={recovery} />
            <RecoveryAssistantComp data={recovery} emergency={emergencyData} />
            <FraudChecklistComp data={recovery} emergency={emergencyData} />
            <EmergencyContactsComp data={recovery} />
            <ScamHeatMapComp data={recovery} />

<ReportScam />

<CommunityAlertsComp data={recovery} />
            <SuccessStoriesComp data={recovery} />
            <PreventionTipsComp data={recovery} />
            <HelpCenterComp data={recovery} />
            <EmergencyFooterComp data={recovery} />
          </div>
        )}
      </div>
    </main>
  );
}