"use client";

import { useState } from "react";

import PlacementHeader from "@/components/placement/PlacementHeader";
import PlacementForm from "@/components/placement/PlacementForm";
import PlacementResult from "@/components/placement/PlacementResult";
import PlacementChart from "@/components/placement/PlacementChart";
import ImprovementPlan from "@/components/placement/ImprovementPlan";
import CompanyRecommendations from "@/components/placement/CompanyRecommendations";

export default function PlacementPage() {
  const [prediction, setPrediction] = useState<any>(null);

  return (
    <main className="min-h-screen bg-slate-100">

      <section className="mx-auto max-w-7xl px-6 py-10">

        <PlacementHeader />

        <div className="mt-10">

          {!prediction ? (

            <PlacementForm
              onPredict={setPrediction}
            />

          ) : (

            <div className="space-y-8">

              <PlacementResult
                result={prediction}
              />

              <PlacementChart
                result={prediction}
              />

              <ImprovementPlan
                result={prediction}
              />

              <CompanyRecommendations
                companies={prediction?.companies ?? []}
              />

            </div>

          )}

        </div>

      </section>

    </main>
  );
}