"use client";

import { useState } from "react";

import MentorHeader from "@/components/aiMentor/MentorHeader";
import SuggestedQuestions from "@/components/aiMentor/SuggestedQuestions";
import ChatBox from "@/components/aiMentor/ChatBox";
import MentorResponse from "@/components/aiMentor/MentorResponse";

export default function AIMentorPage() {

  const [answer, setAnswer] = useState("");

  const [chatKey, setChatKey] = useState(0);

  async function askQuestion(question: string) {

    try {

      const res = await fetch("/api/mentor", {

        method: "POST",

        headers: {

          "Content-Type": "application/json",

        },

        body: JSON.stringify({

          question,

        }),

      });

      const json = await res.json();

      if (json.success) {

        setAnswer(json.answer);

      }

    } catch (err) {

      console.error(err);

    }

  }

  return (

    <main className="min-h-screen bg-slate-50">

      <section className="mx-auto max-w-7xl px-6 py-10">

        <MentorHeader />

        <div className="mt-10 grid gap-8 lg:grid-cols-3">

          {/* Left */}

          <div>

            <SuggestedQuestions

              onSelect={(question) => {

                askQuestion(question);

              }}

            />

          </div>

          {/* Right */}

          <div className="lg:col-span-2 space-y-8">

            <ChatBox

              key={chatKey}

              onResponse={(res) => {

                setAnswer(res);

                setChatKey(chatKey + 1);

              }}

            />

            <MentorResponse

              answer={answer}

            />

          </div>

        </div>

      </section>

    </main>

  );

}