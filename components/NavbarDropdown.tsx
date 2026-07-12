"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";

interface DropdownItem {
  label: string;
  href: string;
}

interface NavbarDropdownProps {
  title: string;
  items: DropdownItem[];
}

export default function NavbarDropdown({
  title,
  items,
}: NavbarDropdownProps) {
  const [open, setOpen] = useState(false);

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        ref.current &&
        !ref.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClick);

    return () =>
      document.removeEventListener(
        "mousedown",
        handleClick
      );
  }, []);

  return (
    <div
      ref={ref}
      className="relative"
    >
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1 rounded-xl px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-blue-600"
      >
        {title}

        <ChevronDown
          className={`h-4 w-4 transition duration-300 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div className="absolute left-0 top-12 w-64 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">

          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="block border-b border-slate-100 px-5 py-4 text-sm font-medium text-slate-700 transition hover:bg-blue-50 hover:text-blue-600 last:border-none"
            >
              {item.label}
            </Link>
          ))}

        </div>
      )}
    </div>
  );
}