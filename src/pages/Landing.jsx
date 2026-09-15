import { HeartHandshake } from "lucide-react";
import { IconActivity, IconArrowUpRight, IconBriefcase, IconCheckCircle, IconHeart, IconHome, IconLeaf, IconUsers } from "../components/icons";

const STATS = [
  { value: "248", label: "Active volunteers" },
  { value: "612", label: "Beneficiaries supported" },
  { value: "187", label: "Confirmed matches" },
];

const STEPS = [
  {
    title: "Tell us what you bring",
    body: "Volunteers list the skills and time they can offer; families and individuals describe what they need — no forms longer than a coffee break.",
    icon: IconUsers,
  },
  {
    title: "We find the right fit",
    body: "Our matching engine scores every possible pairing by shared skills and location, so the people who show up are actually equipped to help.",
    icon: IconCheckCircle,
  },
  {
    title: "A coordinator confirms it",
    body: "Every match is reviewed by a real person before it's confirmed — the algorithm proposes, a coordinator decides.",
    icon: IconHeart,
  },
];

const FOCUS_AREAS = [
  { label: "Housing Assistance", icon: IconHome },
  { label: "Job Placement", icon: IconBriefcase },
  { label: "Childcare Support", icon: IconUsers },
  { label: "Senior Care", icon: IconHeart },
  { label: "Food Security", icon: IconLeaf },
  { label: "Healthcare Outreach", icon: IconActivity },
];

function NavBar({ onSignIn }) {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <div className="flex items-center gap-2.5">
          <span className="inline-flex size-8 items-center justify-center rounded-md bg-brand-600 text-white">
            <HeartHandshake className="size-4.5" strokeWidth={2} />
          </span>
          <span className="text-sm font-semibold tracking-wide text-slate-900">Impact Project</span>
        </div>

        <nav className="hidden items-center gap-8 text-sm font-medium text-slate-600 sm:flex">
          <a href="#how-it-works" className="transition-colors hover:text-slate-900">
            How it works
          </a>
          <a href="#focus-areas" className="transition-colors hover:text-slate-900">
            Focus areas
          </a>
          <a href="#get-involved" className="transition-colors hover:text-slate-900">
            Get involved
          </a>
        </nav>

        <button
          type="button"
          onClick={onSignIn}
          className="rounded-md bg-brand-600 px-3.5 py-1.5 text-sm font-medium text-white transition-colors hover:bg-brand-700"
        >
          Sign in
        </button>
      </div>
    </header>
  );
}

function Hero({ onSignIn }) {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-6xl px-6 pb-20 pt-20 sm:pt-28">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-600">Volunteer matching, done right</p>
        <h1 className="mt-5 max-w-3xl font-display text-5xl font-semibold tracking-tight text-slate-900 sm:text-6xl">
          Real support, matched to real need.
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-600">
          Impact Project pairs volunteers with the families and individuals who need them most —
          matched by skill and location, confirmed by a person, not left to a spreadsheet.
        </p>

        <div className="mt-10 flex flex-wrap items-center gap-4">
          <a
            href="#get-involved"
            className="inline-flex items-center gap-2 rounded-md bg-brand-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-700"
          >
            Become a volunteer
            <IconArrowUpRight className="size-4" />
          </a>
          <button
            type="button"
            onClick={onSignIn}
            className="inline-flex items-center gap-2 rounded-md border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
          >
            Staff sign in
          </button>
        </div>

        <dl className="mt-20 grid grid-cols-3 gap-8 border-t border-slate-200 pt-10 sm:max-w-xl">
          {STATS.map((stat) => (
            <div key={stat.label}>
              <dt className="sr-only">{stat.label}</dt>
              <dd className="text-3xl font-bold text-slate-900 sm:text-4xl">{stat.value}</dd>
              <p className="mt-1 text-sm text-slate-500">{stat.label}</p>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

function HowItWorks() {
  return (
    <section id="how-it-works" className="border-t border-slate-100 bg-white py-24">
      <div className="mx-auto max-w-6xl px-6">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-600">How it works</p>
        <h2 className="mt-3 max-w-xl font-display text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
          From sign-up to a confirmed match in three steps.
        </h2>

        <div className="relative mt-16 grid grid-cols-1 gap-12 sm:grid-cols-3 sm:gap-8">
          <div aria-hidden="true" className="absolute left-0 right-0 top-6 hidden h-px bg-slate-200 sm:block" />
          {STEPS.map((step, i) => (
            <div key={step.title} className="relative">
              <span className="relative z-10 inline-flex size-12 items-center justify-center rounded-full bg-brand-50 text-brand-600">
                <step.icon className="size-5" />
              </span>
              <p className="mt-5 text-xs font-semibold uppercase tracking-wide text-slate-400">Step {i + 1}</p>
              <h3 className="mt-1 text-lg font-semibold text-slate-900">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-500">{step.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FocusAreas() {
  return (
    <section id="focus-areas" className="border-t border-slate-100 bg-white py-24">
      <div className="mx-auto max-w-6xl px-6">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-600">Where we help</p>
        <h2 className="mt-3 max-w-xl font-display text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
          Six areas where a matched volunteer changes the outcome.
        </h2>

        <div className="mt-14 grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-3">
          {FOCUS_AREAS.map((area) => (
            <div key={area.label} className="flex items-center gap-3">
              <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-600">
                <area.icon className="size-5" />
              </span>
              <span className="text-sm font-medium text-slate-800 sm:text-base">{area.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Mission() {
  return (
    <section className="border-t border-slate-100 bg-slate-50 py-24">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-600">Our mission</p>
        <p className="mt-6 font-display text-2xl italic leading-relaxed text-slate-900 sm:text-3xl">
          Good intentions don't fill a gap by themselves — the right person, with the right skill,
          showing up at the right time does. We built Impact Project so that match isn't left to
          chance.
        </p>
      </div>
    </section>
  );
}

function GetInvolved({ onSignIn }) {
  return (
    <section id="get-involved" className="bg-brand-600 py-20">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-8 px-6 sm:flex-row sm:items-center">
        <div>
          <h2 className="font-display text-2xl font-semibold text-white sm:text-3xl">Ready to make a difference?</h2>
          <p className="mt-2 max-w-md text-sm text-brand-100">
            Reach out and a coordinator will follow up about volunteering or getting support.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <a
            href="mailto:volunteer@impactproject.org"
            className="inline-flex items-center gap-2 rounded-md bg-white px-5 py-3 text-sm font-semibold text-brand-700 shadow-sm transition-colors hover:bg-brand-50"
          >
            Email volunteer@impactproject.org
          </a>
          <button
            type="button"
            onClick={onSignIn}
            className="inline-flex items-center gap-2 rounded-md border border-white/40 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
          >
            Staff sign in
          </button>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 text-sm text-slate-500 sm:flex-row">
        <div className="flex items-center gap-2.5">
          <span className="inline-flex size-6 items-center justify-center rounded bg-brand-600 text-white">
            <HeartHandshake className="size-3.5" strokeWidth={2} />
          </span>
          <span className="font-medium text-slate-900">Impact Project</span>
        </div>
        <p>Matching volunteers with real need, one confirmed pairing at a time.</p>
      </div>
    </footer>
  );
}

export default function Landing({ onSignIn }) {
  return (
    <div className="min-h-screen bg-white">
      <NavBar onSignIn={onSignIn} />
      <Hero onSignIn={onSignIn} />
      <HowItWorks />
      <FocusAreas />
      <Mission />
      <GetInvolved onSignIn={onSignIn} />
      <Footer />
    </div>
  );
}
