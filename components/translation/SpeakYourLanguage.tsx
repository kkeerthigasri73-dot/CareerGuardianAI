"use client";

import { useState } from "react";
import {
  Languages,
  Volume2,
  Loader2,
} from "lucide-react";

const languages = [
  { code: "en", name: "English" },
  { code: "hi", name: "Hindi" },
  { code: "ta", name: "Tamil" },
  { code: "te", name: "Telugu" },
  { code: "ml", name: "Malayalam" },
  { code: "kn", name: "Kannada" },
];

export default function SpeakYourLanguage() {
  const [text, setText] = useState(
    "Welcome to CareerGuardian AI. Build your career with confidence."
  );

  const [language, setLanguage] =
    useState("en");

  const [translatedText, setTranslatedText] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  async function translateText() {
    try {
      setLoading(true);

      const response = await fetch(
        "/api/translate",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            text,
            targetLanguage: language,
          }),
        }
      );

      const result =
        await response.json();

      if (result.success) {
        setTranslatedText(
          result.translatedText
        );
      }

    } catch (error) {
      console.error(
        "Translation error:",
        error
      );

    } finally {
      setLoading(false);
    }
  }

  function speakText() {
    const content =
      translatedText || text;

    if (!content) return;

    window.speechSynthesis.cancel();

    const speech =
      new SpeechSynthesisUtterance(
        content
      );

    speech.lang =
      language === "ta"
        ? "ta-IN"
        : language === "hi"
        ? "hi-IN"
        : language === "te"
        ? "te-IN"
        : language === "ml"
        ? "ml-IN"
        : language === "kn"
        ? "kn-IN"
        : "en-IN";

    speech.rate = 0.9;

    window.speechSynthesis.speak(
      speech
    );
  }

  return (
    <section className="rounded-3xl bg-white p-8 shadow-xl">

      <div className="flex items-center gap-3">

        <div className="rounded-2xl bg-blue-100 p-3">

          <Languages className="h-7 w-7 text-blue-600" />

        </div>

        <div>

          <h2 className="text-2xl font-black text-slate-900">

            Speak Your Language

          </h2>

          <p className="text-sm text-slate-500">

            Translate CareerGuardian AI into your preferred language.

          </p>

        </div>

      </div>

      <div className="mt-8">

        <label className="font-semibold text-slate-700">

          Select Language

        </label>

        <select
          value={language}
          onChange={(event) =>
            setLanguage(
              event.target.value
            )
          }
          className="mt-2 w-full rounded-xl border border-slate-200 p-4 outline-none focus:border-blue-500"
        >

          {languages.map((item) => (

            <option
              key={item.code}
              value={item.code}
            >

              {item.name}

            </option>

          ))}

        </select>

      </div>

      <div className="mt-6">

        <label className="font-semibold text-slate-700">

          Text

        </label>

        <textarea
          value={text}
          onChange={(event) =>
            setText(
              event.target.value
            )
          }
          rows={5}
          className="mt-2 w-full rounded-2xl border border-slate-200 p-4 outline-none focus:border-blue-500"
        />

      </div>

      <button
        onClick={translateText}
        disabled={loading}
        className="mt-6 flex w-full items-center justify-center gap-3 rounded-2xl bg-blue-600 py-4 font-bold text-white transition hover:bg-blue-700 disabled:opacity-60"
      >

        {loading ? (

          <Loader2 className="h-5 w-5 animate-spin" />

        ) : (

          <Languages className="h-5 w-5" />

        )}

        {loading
          ? "Translating..."
          : "Translate Text"}

      </button>

      {translatedText && (

        <div className="mt-6 rounded-2xl bg-slate-50 p-6">

          <p className="text-sm font-bold text-slate-500">

            TRANSLATED TEXT

          </p>

          <p className="mt-3 text-lg text-slate-800">

            {translatedText}

          </p>

          <button
            onClick={speakText}
            className="mt-5 flex items-center gap-3 rounded-xl bg-emerald-600 px-5 py-3 font-bold text-white transition hover:bg-emerald-700"
          >

            <Volume2 className="h-5 w-5" />

            Listen

          </button>

        </div>

      )}

    </section>
  );
}