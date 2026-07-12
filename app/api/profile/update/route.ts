import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

import connectDB from "../../../../lib/mongodb";
import User from "../../../../models/User";

const JWT_SECRET =
  process.env.JWT_SECRET || "careerguardian_ai_super_secret_2026";

export async function PUT(req: NextRequest) {
  try {
    await connectDB();

    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    const decoded: any = jwt.verify(
      token,
      JWT_SECRET
    );

    const body = await req.json();

    const updatedUser = await User.findByIdAndUpdate(
      decoded.id,
      {
        name: body.name,
        email: body.email,
        college: body.college,
        degree: body.degree,
        branch: body.branch,
        cgpa: body.cgpa,
        skills: body.skills,
        careerGoal: body.careerGoal,
      },
      {
        new: true,
      }
    ).select("-password");

    return NextResponse.json({
      success: true,
      message: "Profile Updated Successfully",
      user: updatedUser,
    });

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Profile Update Failed",
      },
      {
        status: 500,
      }
    );

  }
}