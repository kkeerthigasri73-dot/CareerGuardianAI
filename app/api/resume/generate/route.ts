import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import CareerDNA from "@/models/CareerDNA";
import Groq from "groq-sdk";
import Resume from "@/models/Resume";
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY!,
});

export async function POST(req: NextRequest) {

  try {

    await connectDB();

    const body = await req.json();

    const { careerDNAId } = body;

    const dna = await CareerDNA.findById(
      careerDNAId
    );

    if (!dna) {

      return NextResponse.json(
        {
          success: false,
          message: "Career DNA not found.",
        },
        {
          status: 404,
        }
      );

    }

    const prompt = `
You are Guardian Resume Studio AI.

Create a professional ATS Resume.

Verified Recruitment

${JSON.stringify(
  dna.verifiedJob,
  null,
  2
)}

Student Profile

${JSON.stringify(
  dna.student,
  null,
  2
)}

Career DNA Report

${JSON.stringify(
  dna.report,
  null,
  2
)}

Return ONLY JSON.

{

"name":"",

"professionalSummary":"",

"skills":[],

"projects":[],

"internship":[],

"certifications":[],

"achievements":[],

"languages":[],

"resumeScore":0,

"atsKeywords":[]

}

Rules

Professional Summary should be recruiter friendly.

Reorder skills according to the job.

Reorder projects according to the job.

Generate ATS keywords.

Return JSON only.

`;

    const completion =
      await groq.chat.completions.create({

        model: "llama-3.3-70b-versatile",

        temperature: 0.2,

        response_format: {
          type: "json_object",
        },

        messages: [

          {
            role: "user",
            content: prompt,
          },

        ],

      });

    const reply =
      completion.choices[0]?.message?.content || "{}";

    let result;

    try {

      result =
        JSON.parse(reply);
        await Resume.create({

  userId: "demo-user",

  resume: result,

  resumeScore: result.resumeScore || 0,

  atsKeywords: result.atsKeywords || [],

});

    } catch {

      result = {};

    }

    return NextResponse.json({

      success: true,

      data: result,

    });

  } catch (err) {

    console.error(err);

    return NextResponse.json(
      {

        success: false,

        message:
          "Resume generation failed.",

      },
      {

        status: 500,

      }
    );

  }

}