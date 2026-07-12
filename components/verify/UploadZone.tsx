"use client";

import { useRef } from "react";
import {
  CloudUpload,
  FileText,
  Upload,
} from "lucide-react";

interface UploadZoneProps {
  selected: string;
  file: File | null;
  onFileChange: (file: File | null) => void;
}

export default function UploadZone({
  selected,
  file,
  onFileChange,
}: UploadZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const acceptType = () => {
    switch (selected) {
      case "pdf":
        return ".pdf";

      case "image":
        return "image/*";

      default:
        return "*";
    }
  };

  return (
    <section className="mt-8 rounded-3xl bg-white p-8 shadow-lg">

      <h2 className="text-2xl font-bold text-slate-900">

        Upload Recruitment

      </h2>

      <p className="mt-2 text-slate-600">

        Upload your recruitment notification, internship offer,
        WhatsApp screenshot or recruitment document.

      </p>

      <div
        onClick={() => inputRef.current?.click()}
        className="mt-8 cursor-pointer rounded-3xl border-2 border-dashed border-blue-300 bg-blue-50 p-12 text-center transition hover:border-blue-600 hover:bg-blue-100"
      >

        <CloudUpload className="mx-auto h-16 w-16 text-blue-600" />

        <h3 className="mt-6 text-2xl font-bold">

          Drag & Drop File Here

        </h3>

        <p className="mt-3 text-slate-500">

          or click to browse your device

        </p>

        <button
          type="button"
          className="mt-8 rounded-2xl bg-blue-600 px-8 py-4 font-semibold text-white transition hover:bg-blue-700"
        >

          <div className="flex items-center gap-3">

            <Upload className="h-5 w-5" />

            Browse File

          </div>

        </button>

        <input
          ref={inputRef}
          type="file"
          accept={acceptType()}
          className="hidden"
          onChange={(e) =>
            onFileChange(e.target.files?.[0] || null)
          }
        />

      </div>

      {file && (

        <div className="mt-8 rounded-2xl border border-green-200 bg-green-50 p-5">

          <div className="flex items-center gap-4">

            <FileText className="h-10 w-10 text-green-600" />

            <div>

              <h4 className="font-bold text-slate-800">

                {file.name}

              </h4>

              <p className="text-sm text-slate-500">

                {(file.size / 1024).toFixed(1)} KB

              </p>

            </div>

          </div>

        </div>

      )}

    </section>
  );
}