import { NextResponse } from "next/server";

import connectDB from "@/lib/mongodb";
import Verification from "@/models/Verification";

export async function GET() {

  try {

    await connectDB();

    const latest =
      await Verification.findOne()
      .sort({ createdAt: -1 });

    if (!latest) {

      return NextResponse.json({

        success:false,

      });

    }

    return NextResponse.json({

      success:true,

      data:latest,

    });

  } catch (err) {

    console.error(err);

    return NextResponse.json({

      success:false,

    },{

      status:500,

    });

  }

}