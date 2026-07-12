"use client";

import {
  FileText,
  Image,
  Link2,
  MessageSquareText,
  Type,
} from "lucide-react";

interface InputSelectorProps {
  selected: string;
  onSelect: (type: string) => void;
}

const options = [
  {
    id: "pdf",
    title: "PDF",
    subtitle: "Recruitment PDF",
    icon: FileText,
  },
  {
    id: "image",
    title: "Image",
    subtitle: "Offer Letter",
    icon: Image,
  },
  {
    id: "whatsapp",
    title: "WhatsApp",
    subtitle: "Chat Screenshot",
    icon: MessageSquareText,
  },
  {
    id: "url",
    title: "Job URL",
    subtitle: "Paste Link",
    icon: Link2,
  },
  {
    id: "text",
    title: "Text",
    subtitle: "Paste Content",
    icon: Type,
  },
];

export default function InputSelector({
  selected,
  onSelect,
}: InputSelectorProps) {
  return (
    <section className="rounded-3xl bg-white p-8 shadow-lg">

      <h2 className="text-2xl font-bold text-slate-900">

        Choose Recruitment Source

      </h2>

      <p className="mt-2 text-slate-600">

        Select how you want Guardian Verify™ to analyze the recruitment.

      </p>

      <div className="mt-8 grid gap-5 md:grid-cols-3 lg:grid-cols-5">

        {options.map((item) => {

          const Icon = item.icon;

          const active = selected === item.id;

          return (

            <button
              key={item.id}
              onClick={() => onSelect(item.id)}
              className={`rounded-2xl border-2 p-6 transition-all duration-300
              ${
                active
                  ? "border-blue-600 bg-blue-50 shadow-lg"
                  : "border-slate-200 hover:border-blue-300 hover:shadow-md"
              }`}
            >

              <div
                className={`mx-auto flex h-14 w-14 items-center justify-center rounded-2xl
                ${
                  active
                    ? "bg-blue-600 text-white"
                    : "bg-slate-100 text-slate-600"
                }`}
              >

                <Icon className="h-7 w-7" />

              </div>

              <h3 className="mt-5 font-bold">

                {item.title}

              </h3>

              <p className="mt-2 text-sm text-slate-500">

                {item.subtitle}

              </p>

            </button>

          );

        })}

      </div>

    </section>
  );
}