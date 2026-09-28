import { NextResponse } from "next/server";

import connectDB from "@/lib/mongodb";
import Verification from "@/models/Verification";

export async function POST(
  req: Request
) {
  try {
    await connectDB();

    const body =
      await req.json();

    const {
      userId,
      company,
      description,
      website,
      location,
    } = body;

    if (!company) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Company name is required.",
        },
        {
          status: 400,
        }
      );
    }

    const report =
      await Verification.create({
        userId:
          userId || "anonymous",

        company,

        description:
          description || "",

        website:
          website || "",

        location:
          location || "Unknown",

        status:
          "COMMUNITY_REPORTED",

        trustScore: 0,

        communityReported: true,
      });

    return NextResponse.json({
      success: true,

      message:
        "Community report submitted successfully.",

      report,
    });

  } catch (error) {
    console.error(
      "Report Scam Error:",
      error
    );

    return NextResponse.json(
      {
        success: false,

        message:
          "Failed to submit scam report.",
      },
      {
        status: 500,
      }
    );
  }
}