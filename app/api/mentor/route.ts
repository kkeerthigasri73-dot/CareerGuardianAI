import { NextResponse } from "next/server";
import { groq } from "@/lib/groq";

const mentorPrompt = `
You are CareerGuardian AI Mentor.

You help students and professionals build successful careers.

Rules:

- Answer clearly.
- Use bullet points.
- Give practical advice.
- Recommend certifications.
- Recommend projects.
- Recommend interview tips.
- Recommend internships if applicable.
- Keep answers below 350 words.
`;

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { question } = body;

    if (!question) {
      return NextResponse.json(
        {
          success: false,
          message: "Question is required.",
        },
        {
          status: 400,
        }
      );
    }

    const completion =
      await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",

        temperature: 0.4,

        messages: [
          {
            role: "system",
            content: mentorPrompt,
          },
          {
            role: "user",
            content: question,
          },
        ],
      });

    const answer =
      completion.choices[0]?.message?.content ||
      "Sorry, I couldn't generate an answer.";

    return NextResponse.json({
      success: true,
      answer,
    });

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "AI Mentor Failed",
      },
      {
        status: 500,
      }
    );
  }
}