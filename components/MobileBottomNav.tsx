"use client";

import Link from "next/link";
import { Bell, BrainCircuit, Home, ShieldCheck, UserRound, type LucideIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/src/context/LanguageContext";
import type { TranslationKey } from "@/src/lib/translations";

const items: { href: string; label: TranslationKey; icon: LucideIcon }[] = [
  { href: "/", label: "home", icon: Home },
  { href: "/analyze", label: "verify", icon: ShieldCheck },
  { href: "/career-dna", label: "grow", icon: BrainCircuit },
  { href: "/dashboard", label: "dashboard", icon: Bell },
  { href: "/profile", label: "myProfile", icon: UserRound },
];

export default function MobileBottomNav() {
  const pathname = usePathname();
  const { t } = useLanguage();
  return (
    <nav className="mobile-bottom-nav" aria-label="App navigation">
      {items.map(({ href, label, icon: Icon }) => {
        const active = pathname === href || (href !== "/" && pathname.startsWith(`${href}/`));
        return <Link key={href} href={href} className={active ? "mobile-bottom-nav__item mobile-bottom-nav__item--active" : "mobile-bottom-nav__item"}><Icon className="h-5 w-5" /><span>{t(label)}</span></Link>;
      })}
    </nav>
  );
}
