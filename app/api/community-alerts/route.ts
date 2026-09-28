import { NextResponse } from "next/server";

import connectDB from "@/lib/mongodb";
import Verification from "@/models/Verification";

function getCommunityLevel(reportCount: number) {
  if (reportCount >= 6) {
    return {
      level: "HIGH",
      label: "High Community Risk",
    };
  }

  if (reportCount >= 3) {
    return {
      level: "MEDIUM",
      label: "Community Warning",
    };
  }

  return {
    level: "LOW",
    label: "Low Reports",
  };
}

export async function GET() {
  try {
    await connectDB();

    const reports =
      await Verification.find({
        communityReported: true,
      })
        .sort({ createdAt: -1 })
        .lean();

    const companyMap = new Map();

    reports.forEach((report: any) => {
      const companyName =
        report.company?.trim() || "Unknown Company";

      const key =
        companyName.toLowerCase();

      if (!companyMap.has(key)) {
        companyMap.set(key, {
          company: companyName,

          reportCount: 0,

          latestReport:
            report.createdAt,

          description:
            report.description || "",

          location:
            report.location || "Unknown",

          reports: [],
        });
      }

      const company =
        companyMap.get(key);

      company.reportCount += 1;

      company.reports.push(report);

      if (
        new Date(report.createdAt) >
        new Date(company.latestReport)
      ) {
        company.latestReport =
          report.createdAt;
      }
    });

    const alerts = Array.from(
      companyMap.values()
    )
      .map((company: any) => {
        const community =
          getCommunityLevel(
            company.reportCount
          );

        return {
          ...company,

          level:
            community.level,

          communityStatus:
            community.label,
        };
      })
      .sort(
        (a: any, b: any) =>
          b.reportCount -
          a.reportCount
      );

    const totalReports =
      reports.length;

    const totalCompanies =
      alerts.length;

    const highRiskCompanies =
      alerts.filter(
        (item: any) =>
          item.level === "HIGH"
      ).length;

    const communityWarnings =
      alerts.filter(
        (item: any) =>
          item.level === "MEDIUM"
      ).length;

    return NextResponse.json({
      success: true,

      alerts,

      statistics: {
        totalReports,

        totalCompanies,

        highRiskCompanies,

        communityWarnings,
      },
    });
  } catch (error) {
    console.error(
      "Community Alerts Error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to load community alerts.",
      },
      {
        status: 500,
      }
    );
  }
}