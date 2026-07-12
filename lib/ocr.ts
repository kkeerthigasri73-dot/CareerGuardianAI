import axios from "axios";
import FormData from "form-data";

export async function extractTextFromOCR(
  base64Image: string
): Promise<string> {
  const apiKey = process.env.OCR_SPACE_API_KEY!;

  const cleanBase64 = base64Image.replace(
  /^data:image\/\w+;base64,/,
  ""
);

const imageBuffer = Buffer.from(
  cleanBase64,
  "base64"
);

  const form = new FormData();

  form.append("apikey", apiKey);
  form.append("language", "eng");
  form.append("isOverlayRequired", "false");
  form.append("OCREngine", "2");

  form.append("file", imageBuffer, {
    filename: "upload.png",
    contentType: "image/png",
  });

  const response = await axios.post(
    "https://api.ocr.space/parse/image",
    form,
    {
      headers: form.getHeaders(),
      maxBodyLength: Infinity,
    }
  );

  const parsed = response.data;

  if (!parsed.ParsedResults) {
    return "";
  }

  return parsed.ParsedResults.map(
    (x: any) => x.ParsedText
  ).join("\n");
}