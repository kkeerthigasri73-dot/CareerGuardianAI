import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import CareerDNA from "@/models/CareerDNA";
import Resume from "@/models/Resume";
import groq from "@/lib/groq";

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

Use ONLY facts explicitly present in Student Profile. Career DNA and the verified job may guide skill ordering and wording, but are not evidence about the student's personal history. Do not invent a title, project details, responsibilities, certifications, achievements, languages, dates, grades, or contact information. If a fact is missing, return an empty string or empty array. Return projects, internships, certifications, achievements, and languages only when they are explicitly present in Student Profile.

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

        model: "openai/gpt-oss-120b",

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

    const result = JSON.parse(reply) as Record<string, unknown>;
    await Resume.create({ userId: String(dna.userId || "demo-user"), resume: result, resumeScore: Number(result.resumeScore) || 0, atsKeywords: Array.isArray(result.atsKeywords) ? result.atsKeywords : [] });

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
