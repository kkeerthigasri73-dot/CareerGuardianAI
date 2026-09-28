"use client";

import Link from "next/link";
import { Bell, BrainCircuit, Home, ShieldCheck, UserRound } from "lucide-react";
import { usePathname } from "next/navigation";

const items = [
  { href: "/", label: "Home", icon: Home },
  { href: "/analyze", label: "Verify", icon: ShieldCheck },
  { href: "/career-dna", label: "Grow", icon: BrainCircuit },
  { href: "/dashboard", label: "Dashboard", icon: Bell },
  { href: "/profile", label: "Profile", icon: UserRound },
];

export default function MobileBottomNav() {
  const pathname = usePathname();
  return (
    <nav className="mobile-bottom-nav" aria-label="App navigation">
      {items.map(({ href, label, icon: Icon }) => {
        const active = pathname === href || (href !== "/" && pathname.startsWith(`${href}/`));
        return <Link key={href} href={href} className={active ? "mobile-bottom-nav__item mobile-bottom-nav__item--active" : "mobile-bottom-nav__item"}><Icon className="h-5 w-5" /><span>{label}</span></Link>;
      })}
    </nav>
  );
}
