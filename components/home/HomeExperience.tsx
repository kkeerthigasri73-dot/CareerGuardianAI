"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  BrainCircuit,
  Check,
  CircleAlert,
  Monitor,
  Play,
  Radar,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Target,
  TrendingUp,
  X,
} from "lucide-react";

type InstallPrompt = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

const storageKeys = {
  mode: "careerGuardianExperienceMode",
  completed: "careerGuardianOnboardingCompleted",
};

const welcomeMessage = "Welcome to CareerGuardian AI. Protect your career. Verify every opportunity. Grow with confidence. And succeed with intelligence.";

const introCards = [
  { number: "01", label: "VERIFY", title: "Check before you commit.", description: "Check whether a recruitment opportunity is trustworthy before you apply.", icon: ShieldCheck, color: "cyan" },
  { number: "02", label: "GROW", title: "Build your next advantage.", description: "Build your Career DNA, improve your resume, practice interviews and discover opportunities.", icon: TrendingUp, color: "blue" },
  { number: "03", label: "RECOVER", title: "Know what to do next.", description: "Get guidance when you encounter suspicious recruitment activity or a scam.", icon: Radar, color: "violet" },
  { number: "04", label: "AI GUARDIAN", title: "One layer. Every career decision.", description: "One intelligent career protection layer connecting verification, growth and recovery.", icon: BrainCircuit, color: "pink" },
] as const;

export function resetCareerGuardianOnboarding() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(storageKeys.completed);
  window.localStorage.removeItem(storageKeys.mode);
}

export function speakWelcomeMessage() {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return false;
  const synth = window.speechSynthesis;
  synth.cancel();
  const utterance = new SpeechSynthesisUtterance(welcomeMessage);
  const voice = synth.getVoices().find((item) => /^en(-|_)/i.test(item.lang) && /natural|neural|enhanced|google|microsoft/i.test(item.name)) || synth.getVoices().find((item) => /^en(-|_)/i.test(item.lang));
  if (voice) utterance.voice = voice;
  utterance.rate = 0.92;
  utterance.pitch = 1.02;
  synth.speak(utterance);
  return true;
}

export function stopWelcomeVoice() {
  if (typeof window !== "undefined" && "speechSynthesis" in window) window.speechSynthesis.cancel();
}

export default function HomeExperience() {
  const [entryChoice, setEntryChoice] = useState<"website" | "app" | null>(null);
  const [onboarding, setOnboarding] = useState<"choice" | "welcome" | "survey" | "summary" | null>(null);
  const [step, setStep] = useState(0);
  const [installPrompt, setInstallPrompt] = useState<InstallPrompt | null>(null);
  const [welcomeVisible, setWelcomeVisible] = useState(false);
  const [voiceOn, setVoiceOn] = useState(false);

  useEffect(() => {
    const resetRequested = process.env.NODE_ENV === "development" && new URLSearchParams(window.location.search).get("onboarding") === "reset";
    if (resetRequested) resetCareerGuardianOnboarding();
    const savedMode = window.localStorage.getItem(storageKeys.mode);
    const completed = window.localStorage.getItem(storageKeys.completed);
    if (savedMode === "website" || savedMode === "app") setEntryChoice(savedMode);
    if (!completed || resetRequested) setOnboarding(savedMode ? "welcome" : "choice");

    const handleInstallPrompt = (event: Event) => {
      event.preventDefault();
      setInstallPrompt(event as InstallPrompt);
    };
    window.addEventListener("beforeinstallprompt", handleInstallPrompt);
    return () => {
      window.removeEventListener("beforeinstallprompt", handleInstallPrompt);
      stopWelcomeVoice();
    };
  }, []);

  function chooseEntry(choice: "website" | "app") {
    window.localStorage.setItem(storageKeys.mode, choice);
    setEntryChoice(choice);
    setOnboarding("welcome");
  }

  async function installApp() {
    if (!installPrompt) return;
    await installPrompt.prompt();
    await installPrompt.userChoice;
    setInstallPrompt(null);
  }

  function finishOnboarding() {
    window.localStorage.setItem(storageKeys.completed, "true");
    setOnboarding(null);
    setWelcomeVisible(true);
    stopWelcomeVoice();
  }

  function skipOnboarding() {
    finishOnboarding();
  }

  function skipVoiceIntroduction() {
    setVoiceOn(false);
    stopWelcomeVoice();
    setOnboarding("survey");
  }

  function startVoice() {
    setVoiceOn(speakWelcomeMessage());
  }

  return (
    <>
      <div className="homepage-shell">
        <Hero />
        <Journey />
        <Intelligence />
        <Opportunities />
        <Demo />
        <FinalCta />
      </div>

      {welcomeVisible && (
        <div className="fixed bottom-6 right-6 z-[70] flex max-w-sm items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-700 shadow-xl" role="status">
          <Sparkles className="h-5 w-5 shrink-0 text-cyan-600" />
          <span>Welcome to your safer, smarter career journey.</span>
          <button type="button" aria-label="Dismiss welcome" onClick={() => setWelcomeVisible(false)}><X className="h-4 w-4" /></button>
        </div>
      )}

      {onboarding === "choice" && <EntryChoice onChoose={chooseEntry} />}
      {onboarding === "welcome" && <WelcomeStep onVoice={startVoice} voiceOn={voiceOn} onContinue={skipVoiceIntroduction} onSkip={skipVoiceIntroduction} />}
      {onboarding === "survey" && <SurveyStep step={step} onContinue={() => step === introCards.length - 1 ? setOnboarding("summary") : setStep((value) => value + 1)} onSkip={skipOnboarding} />}
      {onboarding === "summary" && <SummaryStep onEnter={finishOnboarding} />}

      {entryChoice === "app" && installPrompt && onboarding === null && (
        <button type="button" onClick={installApp} className="fixed bottom-24 left-5 z-40 flex items-center gap-2 rounded-full bg-slate-950 px-4 py-3 text-sm font-bold text-white shadow-xl lg:bottom-6">
          <Smartphone className="h-4 w-4 text-cyan-300" /> Install CareerGuardian AI
        </button>
      )}
    </>
  );
}

function EntryChoice({ onChoose }: { onChoose: (choice: "website" | "app") => void }) {
  return <Overlay><div className="w-full max-w-5xl"><div className="mb-10 flex items-start justify-between gap-8"><div className="max-w-2xl"><p className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.2em] text-cyan-300"><ShieldCheck className="h-4 w-4" /> CareerGuardian AI</p><h1 className="mt-5 text-4xl font-black leading-tight text-white sm:text-6xl">How would you like to explore CareerGuardian AI?</h1><p className="mt-5 text-lg leading-8 text-slate-300">Choose the experience that fits the way you make career decisions.</p></div><div className="hidden h-24 w-24 items-center justify-center rounded-full border border-cyan-300/30 bg-cyan-300/10 text-cyan-200 shadow-[0_0_80px_rgba(34,211,238,0.2)] sm:flex"><BrainCircuit className="h-11 w-11" /></div></div><div className="grid gap-5 md:grid-cols-2"><ChoiceCard icon={Monitor} title="Explore as Website" description="Experience the complete CareerGuardian AI platform in your browser." button="Explore as Website" onClick={() => onChoose("website")} /><ChoiceCard icon={Smartphone} title="Explore as App" description="Experience CareerGuardian AI as a focused app-like workspace." button="Explore as App" onClick={() => onChoose("app")} /></div></div></Overlay>;
}

function ChoiceCard({ icon: Icon, title, description, button, onClick }: { icon: typeof Monitor; title: string; description: string; button: string; onClick: () => void }) {
  return <article className="rounded-3xl border border-white/15 bg-white/[0.08] p-7 text-white shadow-2xl backdrop-blur-sm transition hover:-translate-y-1 hover:border-cyan-300/60 hover:bg-white/[0.12]"><div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-300 text-slate-950"><Icon className="h-7 w-7" /></div><h2 className="mt-7 text-2xl font-bold">{title}</h2><p className="mt-3 min-h-14 leading-7 text-slate-300">{description}</p><button type="button" onClick={onClick} className="mt-7 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 font-bold text-slate-950 transition hover:bg-cyan-200">{button}<ArrowRight className="h-4 w-4" /></button></article>;
}

function WelcomeStep({ onVoice, voiceOn, onContinue, onSkip }: { onVoice: () => void; voiceOn: boolean; onContinue: () => void; onSkip: () => void }) {
  return <Overlay><div className="w-full max-w-3xl text-center"><div className="mx-auto flex h-28 w-28 animate-pulse items-center justify-center rounded-full border border-cyan-300/40 bg-cyan-300/10 text-cyan-300 shadow-[0_0_100px_rgba(34,211,238,0.24)]"><ShieldCheck className="h-14 w-14" /></div><p className="mt-8 text-sm font-bold uppercase tracking-[0.2em] text-cyan-300">Your intelligent career guardian</p><h1 className="mt-4 text-4xl font-black text-white sm:text-6xl">Welcome to CareerGuardian AI</h1><p className="mt-5 text-xl font-semibold text-cyan-100">Protect. Verify. Grow. Succeed.</p><p className="mx-auto mt-4 max-w-xl text-lg leading-8 text-slate-300">Your AI-powered career protection and growth companion.</p><div className="mt-9 flex flex-wrap justify-center gap-3"><button type="button" onClick={onVoice} className="inline-flex items-center gap-2 rounded-xl bg-cyan-300 px-6 py-4 font-bold text-slate-950 hover:bg-cyan-200"><Sparkles className="h-5 w-5" /> {voiceOn ? "Voice On" : "Start Voice Introduction"}</button><button type="button" onClick={onContinue} className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-6 py-4 font-bold text-white hover:bg-white/15">Continue <ArrowRight className="h-5 w-5" /></button></div><button type="button" onClick={onSkip} className="mt-6 text-sm font-semibold text-slate-400 underline-offset-4 hover:text-white hover:underline">Skip Introduction</button></div></Overlay>;
}

function SurveyStep({ step, onContinue, onSkip }: { step: number; onContinue: () => void; onSkip: () => void }) {
  const card = introCards[step];
  const Icon = card.icon;
  return <Overlay><div className="w-full max-w-3xl"><div className="flex items-center justify-between text-sm font-bold text-slate-400"><span>CareerGuardian AI introduction</span><span>{card.number} / 04</span></div><div className="mt-4 h-1.5 rounded-full bg-white/10"><div className="h-full rounded-full bg-gradient-to-r from-cyan-300 to-violet-400 transition-all duration-500" style={{ width: `${((step + 1) / introCards.length) * 100}%` }} /></div><div className="mt-14 rounded-[2rem] border border-white/15 bg-white/[0.08] p-8 shadow-2xl backdrop-blur-xl sm:p-12"><div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-300 text-slate-950 shadow-[0_0_45px_rgba(34,211,238,0.2)]"><Icon className="h-8 w-8" /></div><p className="mt-10 text-sm font-black uppercase tracking-[0.2em] text-cyan-300">{card.label}</p><h1 className="mt-4 text-3xl font-black text-white sm:text-5xl">{card.title}</h1><p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">{card.description}</p><div className="mt-10 flex flex-wrap items-center gap-4"><button type="button" onClick={onContinue} className="inline-flex items-center gap-2 rounded-xl bg-cyan-300 px-6 py-3.5 font-bold text-slate-950 hover:bg-cyan-200">{step === introCards.length - 1 ? "Continue" : "Continue"} <ArrowRight className="h-5 w-5" /></button><button type="button" onClick={onSkip} className="text-sm font-semibold text-slate-400 underline-offset-4 hover:text-white hover:underline">Skip Introduction</button></div></div></div></Overlay>;
}

function SummaryStep({ onEnter }: { onEnter: () => void }) {
  return <Overlay><div className="w-full max-w-3xl text-center"><div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-cyan-300 text-slate-950 shadow-[0_0_60px_rgba(34,211,238,0.24)]"><ShieldCheck className="h-10 w-10" /></div><p className="mt-8 text-sm font-bold uppercase tracking-[0.2em] text-cyan-300">All systems aligned</p><h1 className="mt-4 text-4xl font-black text-white sm:text-6xl">Your CareerGuardian is ready.</h1><p className="mx-auto mt-5 max-w-xl text-lg leading-8 text-slate-300">A safer, smarter workspace for the decisions ahead.</p><button type="button" onClick={onEnter} className="mt-10 inline-flex items-center gap-2 rounded-xl bg-cyan-300 px-7 py-4 font-bold text-slate-950 hover:bg-cyan-200">Enter CareerGuardian AI <ArrowRight className="h-5 w-5" /></button></div></Overlay>;
}

function Overlay({ children }: { children: React.ReactNode }) {
  return <div className="fixed inset-0 z-[60] overflow-y-auto bg-[#071321] px-5 py-10 sm:px-8"><div className="mx-auto flex min-h-full items-center justify-center">{children}</div></div>;
}

function Hero() {
  return <section className="hero-command relative overflow-hidden"><div className="hero-command__grid" aria-hidden="true" /><div className="hero-command__beam hero-command__beam--one" aria-hidden="true" /><div className="hero-command__beam hero-command__beam--two" aria-hidden="true" /><div className="relative mx-auto grid max-w-7xl items-center gap-12 px-6 py-16 lg:grid-cols-[1.02fr_.98fr] lg:py-20"><div className="hero-copy"><span className="inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-cyan-50 px-4 py-2 text-xs font-black tracking-[0.16em] text-black"><ShieldCheck className="h-4 w-4" /> AI-POWERED CAREER PROTECTION</span><h1 className="mt-7 max-w-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-3xl font-bold leading-[1.05] tracking-tight text-transparent sm:text-4xl md:text-5xl">Protect Your Career.<br />Not Just Your Resume.</h1><p className="mt-7 max-w-xl text-lg leading-8 text-slate-600">CareerGuardian AI helps students verify recruitment, discover their career direction, become placement-ready and find opportunities that actually match them.</p><div className="mt-9 flex flex-wrap gap-3"><Link href="/analyze" className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-5 py-3.5 font-bold text-white shadow-lg shadow-cyan-100 transition hover:-translate-y-0.5 hover:bg-cyan-700">Verify an Opportunity <ArrowRight className="h-5 w-5" /></Link><Link href="/career-dna" className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-5 py-3.5 font-bold text-slate-800 transition hover:border-pink-400 hover:text-pink-700">Explore Career AI</Link></div><p className="mt-7 text-sm font-bold tracking-wide text-slate-500">Protect <span className="text-cyan-600">•</span> Verify <span className="text-pink-600">•</span> Grow <span className="text-emerald-600">•</span> Succeed</p></div><GuardianConsole /></div></section>;
}

function GuardianConsole() {
  return <div className="hero-console" aria-label="CareerGuardian profile setup overview"><div className="hero-console__top"><span className="flex items-center gap-2 text-sm font-bold text-white"><span className="hero-live-dot" /> CAREERGUARDIAN PROFILE</span><span className="text-xs text-slate-400">NOT CONNECTED</span></div><div className="hero-console__orb"><div className="hero-orbit hero-orbit--outer" /><div className="hero-orbit hero-orbit--inner" /><div className="hero-orb-core"><ShieldCheck className="h-10 w-10" /><span>BUILD<br />YOUR PROFILE</span></div><span className="hero-orb-label hero-orb-label--top">VERIFY</span><span className="hero-orb-label hero-orb-label--right">GROW</span><span className="hero-orb-label hero-orb-label--bottom">MATCH</span></div><div className="grid gap-2 sm:grid-cols-3"><div className="hero-metric"><ShieldCheck className="h-4 w-4 text-cyan-300" /><strong>START</strong><span>Verify a signal</span></div><div className="hero-metric"><Target className="h-4 w-4 text-pink-300" /><strong>SHAPE</strong><span>Build Career DNA</span></div><div className="hero-metric"><TrendingUp className="h-4 w-4 text-violet-300" /><strong>MOVE</strong><span>Find your fit</span></div></div></div>;
}

function Journey() {
  const stages = [{ number: "01", title: "PROTECT", description: "Spot recruitment risks before they cost you.", items: ["Recruitment Verification", "Trust Score", "Community Confidence"], icon: ShieldCheck, color: "text-cyan-700 bg-cyan-50" }, { number: "02", title: "GROW", description: "Turn your potential into career readiness.", items: ["Career DNA", "Resume", "Interview", "Placement"], icon: TrendingUp, color: "text-emerald-700 bg-emerald-50" }, { number: "03", title: "SUCCEED", description: "Move from preparation to the right opportunity.", items: ["Job Matching", "Job Alerts", "Opportunity Radar"], icon: Radar, color: "text-amber-700 bg-amber-50" }, { number: "04", title: "RECOVER", description: "When something goes wrong, know what to do next.", items: ["Report", "Evidence", "Guidance"], icon: CircleAlert, color: "text-red-700 bg-red-50" }];
  return <section id="journey" className="journey-section bg-white py-20"><div className="mx-auto max-w-7xl px-6"><div className="max-w-2xl"><p className="text-sm font-bold uppercase tracking-[0.18em] text-black">The CareerGuardian journey</p><h2 className="mt-4 text-3xl font-black text-black md:text-4xl">One Guardian. Every Career Decision.</h2><p className="mt-4 text-lg leading-8 text-black">A single intelligence layer that helps you move forward with better signals, stronger preparation and fewer surprises.</p></div><div className="mt-12 grid gap-4 lg:grid-cols-4">{stages.map(({ icon: Icon, ...stage }) => <article key={stage.number} className="relative rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"><div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${stage.color}`}><Icon className="h-6 w-6" /></div><p className="mt-7 text-sm font-black tracking-[0.16em] text-black">{stage.number}</p><h3 className="mt-2 text-2xl font-black text-black">{stage.title}</h3><p className="mt-3 min-h-14 text-sm leading-6 text-black">{stage.description}</p><ul className="mt-5 space-y-2 text-sm font-semibold text-black">{stage.items.map((item) => <li key={item} className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-600" />{item}</li>)}</ul></article>)}</div></div></section>;
}

function Intelligence() {
  return <section id="grow" className="section-black bg-slate-50 py-20"><div className="mx-auto grid max-w-7xl items-center gap-12 px-6 lg:grid-cols-[.85fr_1.15fr]"><div><p className="text-sm font-bold uppercase tracking-[0.18em] text-violet-700">Guardian intelligence</p><h2 className="mt-4 text-3xl font-black text-slate-900 md:text-4xl">Your career signals, explained clearly.</h2><p className="mt-4 text-lg leading-8 text-slate-600">CareerGuardian does not guess your readiness. It builds a useful picture from your verified opportunities, Career DNA, resume and interview activity.</p><Link href="/career-dna" className="mt-7 inline-flex items-center gap-2 font-bold text-violet-700 hover:text-pink-700">Build My Career Profile <ArrowRight className="h-5 w-5" /></Link></div><div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl sm:p-8"><div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-100 pb-6"><div><p className="text-sm font-bold uppercase tracking-[0.16em] text-slate-500">What your profile will reveal</p><p className="mt-2 text-2xl font-black text-slate-900">No score until there is real signal.</p></div><span className="rounded-full bg-violet-50 px-3 py-1 text-sm font-bold text-violet-700">Personalized after setup</span></div><div className="mt-7 grid gap-3 sm:grid-cols-2"><div className="rounded-2xl border border-cyan-100 bg-cyan-50 p-4"><ShieldCheck className="h-6 w-6 text-cyan-700" /><h3 className="mt-4 font-black text-slate-900">Recruitment safety</h3><p className="mt-2 text-sm leading-6 text-slate-600">Signals from opportunities you ask us to verify.</p></div><div className="rounded-2xl border border-violet-100 bg-violet-50 p-4"><Sparkles className="h-6 w-6 text-violet-700" /><h3 className="mt-4 font-black text-slate-900">Career direction</h3><p className="mt-2 text-sm leading-6 text-slate-600">Patterns from your interests, skills and goals.</p></div><div className="rounded-2xl border border-pink-100 bg-pink-50 p-4"><Target className="h-6 w-6 text-pink-700" /><h3 className="mt-4 font-black text-slate-900">Readiness priorities</h3><p className="mt-2 text-sm leading-6 text-slate-600">Practical next steps for resume and interviews.</p></div><div className="rounded-2xl border border-rose-100 bg-rose-50 p-4"><TrendingUp className="h-6 w-6 text-rose-700" /><h3 className="mt-4 font-black text-slate-900">Opportunity fit</h3><p className="mt-2 text-sm leading-6 text-slate-600">Recommendations shaped around your profile.</p></div></div></div></div></section>;
}

function Opportunities() {
  const opportunities = [{ title: "AI Engineer", org: "Example opportunity", location: "Chennai · Full Time", match: "92%", tags: ["AI / ML interest", "Python skill", "Preferred location"] }, { title: "Data Analyst", org: "Example opportunity", location: "Remote · Internship", match: "86%", tags: ["Data Science interest", "Career direction", "Remote preference"] }, { title: "Cloud Associate", org: "Example opportunity", location: "Bangalore · Full Time", match: "81%", tags: ["Cloud interest", "Technical skills", "Location match"] }];
  return <section id="opportunities" className="section-black bg-white py-20"><div className="mx-auto max-w-7xl px-6"><div className="flex flex-col justify-between gap-5 md:flex-row md:items-end"><div className="max-w-2xl"><p className="text-sm font-bold uppercase tracking-[0.18em] text-blue-700">Personalized opportunities</p><h2 className="mt-4 text-3xl font-black text-slate-900 md:text-4xl">Don't Search Every Opportunity.</h2><p className="mt-3 text-lg leading-8 text-slate-600">Let your career profile find the relevant ones. These are example cards; live recommendations appear after you sign in.</p></div><Link href="/jobs" className="inline-flex items-center gap-2 font-bold text-blue-700">Explore opportunities <ArrowRight className="h-5 w-5" /></Link></div><div className="mt-10 grid gap-4 lg:grid-cols-3">{opportunities.map((opportunity) => <article key={opportunity.title} className="rounded-3xl border border-slate-200 p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"><div className="flex items-start justify-between gap-4"><div><h3 className="text-xl font-black text-slate-900">{opportunity.title}</h3><p className="mt-1 text-sm text-slate-500">{opportunity.org}</p></div><span className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-black text-emerald-700">{opportunity.match} match</span></div><p className="mt-6 text-sm font-semibold text-slate-700">{opportunity.location}</p><p className="mt-6 text-xs font-bold uppercase tracking-[0.14em] text-slate-400">Matched because</p><ul className="mt-3 space-y-2 text-sm text-slate-600">{opportunity.tags.map((tag) => <li key={tag} className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-600" />{tag}</li>)}</ul><Link href="/jobs" className="mt-7 inline-flex items-center gap-2 text-sm font-bold text-slate-900 hover:text-blue-700">View Opportunity <ArrowRight className="h-4 w-4" /></Link></article>)}</div></div></section>;
}

function Demo() {
  return <section className="section-black bg-white py-20"><div className="mx-auto max-w-7xl px-6"><div className="grid items-center gap-10 lg:grid-cols-[.8fr_1.2fr]"><div><p className="text-sm font-bold uppercase tracking-[0.18em] text-violet-700">See it in action</p><h2 className="mt-4 text-3xl font-black text-slate-900 md:text-4xl">From a suspicious message to a safer, smarter career decision.</h2><p className="mt-4 leading-8 text-slate-600">A short guided look at how CareerGuardian helps you verify, understand and act.</p><button type="button" className="mt-7 inline-flex items-center gap-2 rounded-xl bg-violet-700 px-5 py-3.5 font-bold text-white shadow-lg shadow-violet-100 hover:bg-pink-700"><Play className="h-4 w-4 fill-current" /> Watch 90-Second Demo</button></div><div className="relative flex aspect-video items-center justify-center overflow-hidden rounded-3xl border border-violet-200 bg-gradient-to-br from-violet-50 via-white to-rose-50 shadow-xl"><div className="absolute inset-0 opacity-40" style={{ backgroundImage: "linear-gradient(rgba(124,58,237,.12) 1px, transparent 1px), linear-gradient(90deg, rgba(236,72,153,.12) 1px, transparent 1px)", backgroundSize: "42px 42px" }} /><div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-violet-700 text-white shadow-[0_0_50px_rgba(124,58,237,0.25)]"><Play className="ml-1 h-7 w-7 fill-current" /></div><span className="absolute bottom-5 left-5 text-xs font-bold uppercase tracking-[0.16em] text-violet-700">Product preview · video ready</span></div></div></div></section>;
}

function FinalCta() {
  return <section id="recover" className="bg-white px-6 py-20"><div className="mx-auto max-w-5xl rounded-3xl bg-gradient-to-br from-blue-700 to-cyan-600 px-6 py-14 text-center text-white shadow-2xl sm:px-12"><h2 className="text-3xl font-black md:text-4xl">Your Career Should Move Forward. Safely.</h2><p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-blue-50">Verify the opportunity. Understand your path. Build your skills. Find what fits. And move forward with confidence.</p><div className="mt-8 flex flex-wrap justify-center gap-3"><Link href="/signup" className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3.5 font-bold text-blue-700 hover:bg-cyan-50">Start Your Career Journey <ArrowRight className="h-5 w-5" /></Link><Link href="/analyze" className="inline-flex items-center gap-2 rounded-xl border border-white/50 px-5 py-3.5 font-bold text-white hover:bg-white/10">Verify an Opportunity</Link></div><p className="mt-8 text-sm font-bold tracking-wide text-blue-100">CareerGuardian AI · Protect · Verify · Grow · Succeed</p></div></section>;
}
