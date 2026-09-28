import { NextResponse } from "next/server";
import groq from "@/lib/groq";
import { extractTextFromOCR, OcrExtractionError } from "@/lib/ocr";
import { extractionPrompt } from "@/lib/prompts";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { image, mimeType } = body;

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

    const extractedText = await extractTextFromOCR(image, mimeType || "image/png");

    if (!extractedText || extractedText.trim() === "") {
      return NextResponse.json(
        {
          success: false,
          message: "No text found in the uploaded image.",
        },
        {
          status: 400,
        }
      );
    }

    const completion =
      await groq.chat.completions.create({
      model: "openai/gpt-oss-120b",
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
    if (error instanceof OcrExtractionError) {
      return NextResponse.json(
        {
          success: false,
          message: error.message,
        },
        {
          status: error.code === "OCR_PAYLOAD_TOO_LARGE" ? 413 : 400,
        }
      );
    }

    console.error("Extract API Error:", error instanceof Error ? error.message : "Unknown error");

    return NextResponse.json(
      {
        success: false,
        message: "OCR extraction failed. Please try again.",
      },
      {
        status: 500,
      }
    );
  }
}