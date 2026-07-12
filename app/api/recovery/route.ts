import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Verification from "@/models/Verification";

export async function GET() {
  try {

    await connectDB();

    const latest = await Verification
      .findOne()
      .sort({ createdAt: -1 });

    if (!latest) {

      return NextResponse.json(
        {
          success: false,
          message: "No verification found.",
        },
        {
          status: 404,
        }
      );

    }

    const recovery = {

      company: latest.company,

      jobRole: latest.jobRole,

      website: latest.website,

      email: latest.email,

      phone: latest.phone,

      education: latest.education,

      applicationFee: latest.applicationFee,

      trustScore: latest.trustScore,

      status: latest.status,

      notificationNumber:
        latest.notificationNumber,

      description:
        latest.description,

      createdAt:
        latest.createdAt,

      location:
        latest.location || "Unknown",

      userName:
        "Guardian AI User",

    };

    return NextResponse.json({

      success: true,

      data: recovery,

    });

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Recovery API failed.",
      },
      {
        status: 500,
      }
    );

  }

}