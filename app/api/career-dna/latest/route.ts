import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import CareerDNA from "@/models/CareerDNA";

export async function GET() {
  try {

    await connectDB();

    const latest = await CareerDNA
      .findOne()
      .sort({ createdAt: -1 });

    if (!latest) {

      return NextResponse.json(
        {
          success: false,
          message: "No Career DNA report found.",
        },
        {
          status: 404,
        }
      );

    }

    return NextResponse.json({
      success: true,
      data: latest,
    });

  } catch (error) {

    console.error(
      "Career DNA Latest Error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch Career DNA.",
      },
      {
        status: 500,
      }
    );

  }
}