"use client";

import { useState } from "react";
import { Bot, Send, User, Sparkles, ShieldCheck } from "lucide-react";

interface Props {
  emergency?: any;
}

function buildResponse(message: string, emergency: any) {
  const bank = emergency?.bank || "SBI";
  if (/bank|transaction/i.test(message)) {
    return `Contact your bank immediately using ${bank}. Ask them to freeze the transaction and open a fraud case.`;
  }
  if (/1930|cyber/i.test(message)) {
    return "Call the National Cyber Helpline at 1930 and report the scam as soon as possible.";
  }
  if (/evidence|proof|chat/i.test(message)) {
    return "Preserve screenshots, payment proof, offer letters, WhatsApp chats, and email evidence in the locker.";
  }
  return "Do not panic. First call 1930, report the bank fraud, preserve evidence, and generate the complaint from the dashboard.";
}

export default function RecoveryAssistant({ emergency }: Props) {
  const [message, setMessage] = useState("");
  const [conversation, setConversation] = useState([
    {
      sender: "ai",
      message: emergency?.paid === "Yes" ? `I can help you recover from this scam. Your recovery plan is being prepared for ${emergency?.bank || "your selected bank"}.` : "I can help you recover from this scam. Start by telling me what happened and I will guide you step by step.",
    },
  ]);

  function submitMessage() {
    const trimmed = message.trim();
    if (!trimmed) return;
    setConversation((prev) => [...prev, { sender: "user", message: trimmed }, { sender: "ai", message: buildResponse(trimmed, emergency) }]);
    setMessage("");
  }

  return (
    <section className="mt-16 rounded-3xl bg-gradient-to-br from-blue-50 via-white to-cyan-50 p-10 shadow-xl">
      <div className="text-center">
        <span className="rounded-full bg-blue-100 px-5 py-2 text-sm font-semibold text-blue-700">AI RECOVERY ASSISTANT</span>
        <h2 className="mt-5 text-4xl font-bold text-slate-900">Emergency AI Chat Assistant</h2>
        <p className="mt-3 text-slate-600">Get instant recovery guidance after detecting a recruitment scam.</p>
      </div>

      <div className="mt-12 rounded-3xl bg-white shadow-lg">
        <div className="flex items-center gap-4 border-b p-6">
          <div className="rounded-2xl bg-blue-100 p-3">
            <Bot className="h-8 w-8 text-blue-600" />
          </div>
          <div>
            <h3 className="text-2xl font-bold">CareerGuardian AI</h3>
            <p className="text-green-600">● Online</p>
          </div>
        </div>

        <div className="space-y-6 p-8">
          {conversation.map((chat, index) => (
            <div key={`${chat.sender}-${index}`} className={`flex ${chat.sender === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-xl rounded-3xl p-5 shadow ${chat.sender === "user" ? "bg-blue-600 text-white" : "bg-slate-100"}`}>
                <div className="mb-3 flex items-center gap-2">
                  {chat.sender === "user" ? <User className="h-5 w-5" /> : <Bot className="h-5 w-5 text-blue-600" />}
                  <span className="font-semibold">{chat.sender === "user" ? "You" : "CareerGuardian AI"}</span>
                </div>
                <p className="leading-7">{chat.message}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="border-t p-6">
          <div className="flex gap-4">
            <input value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Ask AI anything..." className="flex-1 rounded-2xl border border-slate-300 p-4 outline-none focus:border-blue-500" />
            <button type="button" onClick={submitMessage} className="rounded-2xl bg-blue-600 px-6 text-white transition hover:bg-blue-700">
              <Send className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      <div className="mt-12 grid gap-6 md:grid-cols-3">
        <div className="rounded-2xl bg-white p-6 shadow">
          <Sparkles className="h-10 w-10 text-blue-600" />
          <h3 className="mt-5 text-xl font-bold">Instant Guidance</h3>
          <p className="mt-3 text-slate-600">AI provides recovery instructions within seconds.</p>
        </div>
        <div className="rounded-2xl bg-white p-6 shadow">
          <ShieldCheck className="h-10 w-10 text-green-600" />
          <h3 className="mt-5 text-xl font-bold">Legal Support</h3>
          <p className="mt-3 text-slate-600">Learn the next legal steps after reporting fraud.</p>
        </div>
        <div className="rounded-2xl bg-white p-6 shadow">
          <Bot className="h-10 w-10 text-purple-600" />
          <h3 className="mt-5 text-xl font-bold">24×7 AI Assistance</h3>
          <p className="mt-3 text-slate-600">AI is always available to answer scam recovery questions.</p>
        </div>
      </div>
    </section>
  );
}