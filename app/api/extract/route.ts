import { NextResponse } from "next/server";
import { groq } from "@/lib/groq";
import { extractTextFromOCR } from "@/lib/ocr";
import { extractionPrompt } from "@/lib/prompts";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { image } = body;

    if (!image) {
      return NextResponse.json(
        {
          success: false,
          message: "No image received.",
        },
        {
          status: 400,
        }
      );
    }

    // STEP 1 - OCR
    const extractedText = await extractTextFromOCR(image);

    if (!extractedText || extractedText.trim() === "") {
      return NextResponse.json(
        {
          success: false,
          message: "No text found in image.",
        },
        {
          status: 400,
        }
      );
    }

    console.log("OCR TEXT:");
    console.log(extractedText);

    // STEP 2 - Groq Extraction
    const completion =
      await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",

        temperature: 0,

        response_format: {
          type: "json_object",
        },

        messages: [
          {
            role: "system",
            content: extractionPrompt,
          },
          {
            role: "user",
            content: extractedText,
          },
        ],
      });

    const reply =
      completion.choices[0]?.message?.content || "{}";

    console.log("GROQ RESPONSE:");
    console.log(reply);

    let json;

    try {
      json = JSON.parse(reply);
    } catch {
      json = {};
    }

    return NextResponse.json({
      success: true,
      text: extractedText,
      data: json,
    });

  } catch (error) {

    console.error("Extract API Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Extraction Failed",
      },
      {
        status: 500,
      }
    );
  }
}