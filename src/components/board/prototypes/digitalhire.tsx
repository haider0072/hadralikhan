"use client";

import { useEffect, useRef, useState } from "react";
import type { CardActivity } from "../use-card-activity";
import { ProjectFrame } from "../project-frame";
import { FocusModal } from "../focus-modal";
import { cn } from "@/lib/cn";

// Real DigitalHire palette, pulled from the Flutter app's lightThemeColors.
// Green primary, specific AI-purple accent, and the semantic pastels the
// product uses for job taxonomy tags. Kept light on purpose so the case
// study reads like the product it is about.
const DH = {
  bg: "#f7faf9",
  paper: "#ffffff",
  paperAlt: "#f1f5f2",
  border: "#e5e7eb",
  borderSoft: "#eef2ee",
  ink: "#0f172a",
  inkSoft: "#374151",
  muted: "#64748b",
  primary: "#00BA52", // green700
  primaryDark: "#005C28", // green900
  primarySoft: "#E5FAEE", // green100
  aiPurple: "#870CE8",
  aiPurpleSoft: "#F3E8FF",
  aiGrammar: "#E0F2FE", // blue100
  aiGrammarBorder: "#0369A1", // blue700
  // Category chip tokens
  workplaceType: "#FADCDB",
  jobType: "#E3F3E4",
  experienceLevel: "#F0DEF2",
  compensation: "#FFEFD6",
  education: "#D6F5FF",
  critical: "#E11D48",
  success: "#059669",
  warning: "#CA8A04",
};

export function DigitalHirePrototype({ activity }: { activity: CardActivity }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <DigitalHirePeek activity={activity} onOpen={() => setOpen(true)} />
      <FocusModal
        open={open}
        onClose={() => setOpen(false)}
        projectKey="DigitalHire"
      >
        <DigitalHireFocus />
      </FocusModal>
    </>
  );
}

// ====================================================================
// PEEK
// ====================================================================

function DigitalHirePeek({
  activity,
  onOpen,
}: {
  activity: CardActivity;
  onOpen: () => void;
}) {
  return (
    <ProjectFrame
      meta={{
        year: "2022 — now",
        title: "DigitalHire",
        tagline:
          "3.5 years of one role turning into three. Designer, then PM, then development too.",
      }}
      innerClassName="bg-white"
      onOpen={onOpen}
      tape="top-right"
    >
      {/* Soft green-purple wash */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute -top-16 -right-10 w-56 h-56 rounded-full"
          style={{ background: DH.aiPurple, filter: "blur(100px)", opacity: 0.18 }}
        />
        <div
          className="absolute -bottom-10 -left-10 w-48 h-48 rounded-full"
          style={{ background: DH.primary, filter: "blur(90px)", opacity: 0.22 }}
        />
      </div>

      <div className="relative h-full flex items-center justify-center px-4">
        <ChatStreamStage animated={activity === "active"} />
      </div>

      <div className="absolute top-4 left-4 right-4 flex items-start justify-between">
        <div className="flex items-center gap-2">
          <DHMark size={28} />
          <div>
            <p className="text-[11px] font-semibold leading-none" style={{ color: DH.ink }}>
              DigitalHire
            </p>
            <p className="text-[9px] mt-0.5" style={{ color: DH.muted }}>
              integrated talent engine
            </p>
          </div>
        </div>
        <div
          className="text-[8px] font-mono uppercase tracking-[0.18em] px-2 py-1 rounded-full flex items-center gap-1.5"
          style={{
            background: DH.primarySoft,
            border: `1px solid ${DH.primary}55`,
            color: DH.primaryDark,
          }}
        >
          <span
            className="h-1.5 w-1.5 rounded-full animate-pulse"
            style={{ background: DH.primary }}
          />
          current work
        </div>
      </div>
    </ProjectFrame>
  );
}

function DHMark({ size = 32 }: { size?: number }) {
  return (
    <div
      className="rounded-lg overflow-hidden relative"
      style={{
        width: size,
        height: size,
        background: `linear-gradient(135deg, ${DH.primary} 0%, ${DH.primaryDark} 100%)`,
        boxShadow: `0 6px 18px -8px ${DH.primary}aa`,
      }}
    >
      <svg viewBox="0 0 32 32" width={size} height={size}>
        <path
          d="M 9 10 L 9 22 L 14 22 Q 19 22 19 16 Q 19 10 14 10 Z"
          fill="#fff"
          opacity="0.95"
        />
        <circle cx="22" cy="10" r="2.5" fill="#fff" opacity="0.95" />
      </svg>
    </div>
  );
}

// ---- Peek: mini chat streaming -----------------------------------------

const USER_MSG = "create a job post for a senior frontend engineer";
const AI_REPLY = "On it. I'll draft it now and flag what to review.";
const JOB_TITLE = "Senior Frontend Engineer";

function ChatStreamStage({ animated }: { animated: boolean }) {
  const [phase, setPhase] = useState<
    "idle" | "user" | "thinking" | "reply" | "tool" | "done"
  >("idle");
  const [userChars, setUserChars] = useState(0);
  const [replyChars, setReplyChars] = useState(0);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    if (!animated) return;
    let alive = true;

    const schedule = (fn: () => void, delay: number) => {
      timers.current.push(setTimeout(fn, delay));
    };

    const run = () => {
      if (!alive) return;
      setPhase("idle");
      setUserChars(0);
      setReplyChars(0);

      schedule(() => setPhase("user"), 300);
      for (let i = 1; i <= USER_MSG.length; i++) {
        schedule(() => setUserChars(i), 300 + i * 28);
      }
      const userDone = 300 + USER_MSG.length * 28 + 200;

      schedule(() => setPhase("thinking"), userDone);

      const replyStart = userDone + 600;
      schedule(() => setPhase("reply"), replyStart);
      for (let i = 1; i <= AI_REPLY.length; i++) {
        schedule(() => setReplyChars(i), replyStart + i * 22);
      }
      const replyDone = replyStart + AI_REPLY.length * 22 + 200;

      schedule(() => setPhase("tool"), replyDone);
      schedule(() => setPhase("done"), replyDone + 900);
      schedule(run, replyDone + 3200);
    };

    run();
    return () => {
      alive = false;
      timers.current.forEach(clearTimeout);
      timers.current = [];
    };
  }, [animated]);

  return (
    <div
      className="relative w-full max-w-[240px] rounded-xl p-2 flex flex-col gap-1.5"
      style={{
        background: DH.paper,
        border: `1px solid ${DH.border}`,
        boxShadow: "0 12px 30px -14px rgba(15,23,42,0.18)",
      }}
    >
      {/* User bubble (right-aligned) */}
      <div className="flex justify-end">
        <div
          className="text-[9px] leading-tight px-2 py-1.5 rounded-lg max-w-[85%] text-right"
          style={{
            background: DH.primary,
            color: "#fff",
            opacity: phase === "idle" ? 0 : 1,
            transition: "opacity 200ms",
          }}
        >
          {USER_MSG.slice(0, userChars)}
          {phase === "user" && userChars < USER_MSG.length && (
            <span
              className="inline-block w-[1px] h-[9px] ml-0.5 align-middle"
              style={{ background: "#fff" }}
            />
          )}
        </div>
      </div>

      {/* Thinking */}
      {phase === "thinking" && (
        <div className="flex items-center gap-1 pl-1">
          <span
            className="h-1.5 w-1.5 rounded-full animate-pulse"
            style={{ background: DH.aiPurple }}
          />
          <span
            className="h-1.5 w-1.5 rounded-full animate-pulse"
            style={{ background: DH.aiPurple, animationDelay: "150ms" }}
          />
          <span
            className="h-1.5 w-1.5 rounded-full animate-pulse"
            style={{ background: DH.aiPurple, animationDelay: "300ms" }}
          />
        </div>
      )}

      {/* AI reply */}
      {(phase === "reply" || phase === "tool" || phase === "done") && (
        <div className="flex justify-start">
          <div
            className="text-[9px] leading-tight px-2 py-1.5 rounded-lg max-w-[90%]"
            style={{
              background: DH.paperAlt,
              color: DH.ink,
              border: `1px solid ${DH.border}`,
            }}
          >
            {AI_REPLY.slice(0, replyChars)}
            {phase === "reply" && replyChars < AI_REPLY.length && (
              <span
                className="inline-block w-[1px] h-[9px] ml-0.5 align-middle"
                style={{ background: DH.ink }}
              />
            )}
          </div>
        </div>
      )}

      {/* Tool chip */}
      {(phase === "tool" || phase === "done") && (
        <div
          className="flex items-center gap-1 px-2 py-1 rounded-md self-start"
          style={{
            background: DH.aiPurpleSoft,
            border: `1px solid ${DH.aiPurple}55`,
          }}
        >
          <span
            className="h-1.5 w-1.5 rounded-full"
            style={{ background: DH.success }}
          />
          <span
            className="text-[8px] font-mono"
            style={{ color: DH.aiPurple }}
          >
            createJobAd
          </span>
          <span
            className="text-[7px] font-mono"
            style={{ color: DH.muted }}
          >
            · {JOB_TITLE}
          </span>
        </div>
      )}

      <div
        className="mt-1 pt-1.5 flex items-center justify-between text-[7px] font-mono uppercase tracking-[0.14em]"
        style={{ borderTop: `1px solid ${DH.borderSoft}`, color: DH.muted }}
      >
        <span>designer · pm · dev</span>
        <span style={{ color: DH.primary }}>3.5 yrs</span>
      </div>
    </div>
  );
}

// ====================================================================
// FOCUS MODAL
// ====================================================================

type Tab = "story" | "design" | "chat" | "engineering";

function DigitalHireFocus() {
  const [tab, setTab] = useState<Tab>("design");
  return (
    <div
      className="w-[min(1240px,96vw)] h-[min(780px,92vh)] grid grid-cols-[380px_1fr] overflow-hidden font-sans"
      style={{ background: DH.bg, color: DH.ink }}
    >
      <Sidebar />
      <section className="flex flex-col overflow-hidden min-w-0">
        <TabBar tab={tab} setTab={setTab} />
        <div className="flex-1 overflow-hidden">
          {tab === "story" && <StoryTab />}
          {tab === "design" && <DesignTab />}
          {tab === "chat" && <ChatTab />}
          {tab === "engineering" && <EngineeringTab />}
        </div>
      </section>
    </div>
  );
}

function Sidebar() {
  return (
    <aside
      className="p-7 overflow-y-auto border-r"
      style={{
        background: DH.paper,
        borderColor: DH.border,
      }}
    >
      <div className="flex items-center gap-3">
        <DHMark size={48} />
        <div>
          <p className="font-semibold tracking-tight text-base leading-none" style={{ color: DH.ink }}>
            DigitalHire
          </p>
          <p className="text-[10px] font-mono uppercase tracking-[0.22em] mt-1" style={{ color: DH.muted }}>
            2022 — now · talent engine
          </p>
        </div>
      </div>

      <p className="mt-5 text-[13px] leading-relaxed" style={{ color: DH.inkSoft }}>
        The longest thread in my career so far. I came in as the sole
        product designer, rebuilt the product from scratch on the back of
        an in-house engineering team, ended up as PM because I was
        already the one nobody could go around, and eventually moved
        back into the code when the team needed it.
      </p>

      <div className="mt-6">
        <p className="text-[10px] font-mono uppercase tracking-[0.22em] mb-2" style={{ color: DH.muted }}>
          My roles, in the order they happened
        </p>
        <ul className="space-y-2 text-[13px]" style={{ color: DH.inkSoft }}>
          <li className="flex items-center gap-2">
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{ background: DH.primary }}
            />
            Product Designer, solo from day one
          </li>
          <li className="flex items-center gap-2">
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{ background: DH.aiPurple }}
            />
            Product Manager, not a title I asked for
          </li>
          <li className="flex items-center gap-2">
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{ background: DH.aiGrammarBorder }}
            />
            Full-stack dev, picked up when it mattered
          </li>
        </ul>
      </div>

      <div className="mt-6">
        <p className="text-[10px] font-mono uppercase tracking-[0.22em] mb-2" style={{ color: DH.muted }}>
          Credits
        </p>
        <p className="text-[12px] leading-relaxed" style={{ color: DH.inkSoft }}>
          <a
            href="https://github.com/mohsinraza-fdev"
            target="_blank"
            rel="noreferrer"
            className="underline decoration-dotted"
            style={{ color: DH.ink }}
          >
            Mohsin Raza
          </a>{" "}
          on frontend, especially the chat client.{" "}
          <a
            href="https://github.com/ishaquehassan"
            target="_blank"
            rel="noreferrer"
            className="underline decoration-dotted"
            style={{ color: DH.ink }}
          >
            Ishaque Hassan
          </a>{" "}
          as engineering manager, pushed me into the chat rewrite when
          nobody else could see it through.
        </p>
      </div>

      <div
        className="mt-6 p-3 rounded-xl text-xs leading-relaxed"
        style={{
          background: DH.aiPurpleSoft,
          color: DH.inkSoft,
          border: `1px solid ${DH.aiPurple}33`,
        }}
      >
        Next beat: a new AI agent layer across the platform. Can&apos;t
        show it yet, but it&apos;s the reason my evenings look like this.
      </div>

      <div className="mt-6 space-y-2">
        <a
          href="https://digitalhire.com"
          target="_blank"
          rel="noreferrer"
          className="group flex items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          style={{
            background: `linear-gradient(135deg, ${DH.primary} 0%, ${DH.primaryDark} 100%)`,
            boxShadow: `0 8px 24px -8px ${DH.primary}88`,
          }}
        >
          <span className="flex items-center gap-2">
            <span
              className="h-1.5 w-1.5 rounded-full bg-white animate-pulse"
              aria-hidden
            />
            Visit the live product
          </span>
          <span className="transition-transform group-hover:translate-x-1">
            →
          </span>
        </a>
        <a
          href="https://play.google.com/store/apps/details?id=com.digitalhire"
          target="_blank"
          rel="noreferrer"
          className="group flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium transition-colors"
          style={{
            background: DH.paperAlt,
            border: `1px solid ${DH.border}`,
            color: DH.ink,
          }}
        >
          <span>Android app on Play Store</span>
          <span className="transition-transform group-hover:translate-x-1">
            →
          </span>
        </a>
        <a
          href="https://www.figma.com/design/8x94SC1c5SvGyjP6DKdP4p/Updated"
          target="_blank"
          rel="noreferrer"
          className="group flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium transition-colors"
          style={{
            background: DH.paperAlt,
            border: `1px solid ${DH.border}`,
            color: DH.ink,
          }}
        >
          <span>Open the Figma file</span>
          <span className="transition-transform group-hover:translate-x-1">
            →
          </span>
        </a>
      </div>
    </aside>
  );
}

function TabBar({ tab, setTab }: { tab: Tab; setTab: (t: Tab) => void }) {
  const items: { id: Tab; label: string }[] = [
    { id: "design", label: "Design system" },
    { id: "chat", label: "The AI chat" },
    { id: "engineering", label: "Engineering" },
    { id: "story", label: "Story" },
  ];
  return (
    <nav
      className="h-14 flex items-center pl-7 pr-24 gap-1 shrink-0 border-b"
      style={{ borderColor: DH.border, background: DH.paper }}
    >
      {items.map((item) => {
        const active = tab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setTab(item.id)}
            className={cn(
              "relative h-14 px-4 text-sm font-medium transition-colors",
            )}
            style={{ color: active ? DH.ink : DH.muted }}
          >
            {item.label}
            {active && (
              <span
                className="absolute bottom-[-1px] left-4 right-4 h-[2px] rounded-full"
                style={{
                  background: `linear-gradient(90deg, ${DH.primary}, ${DH.aiPurple})`,
                }}
              />
            )}
          </button>
        );
      })}
    </nav>
  );
}

// ====================================================================
// DESIGN TAB — the hero tab
// ====================================================================

const CATEGORY_CHIPS = [
  { name: "workplaceType", bg: DH.workplaceType, label: "Remote" },
  { name: "jobType", bg: DH.jobType, label: "Full-time" },
  { name: "experienceLevel", bg: DH.experienceLevel, label: "Mid-senior" },
  { name: "compensation", bg: DH.compensation, label: "$120k — $160k" },
  { name: "education", bg: DH.education, label: "Bachelor's or higher" },
];

const PRIMARY_RAMP = [
  { n: "50", c: "#F2FDF7" },
  { n: "100", c: "#E5FAEE" },
  { n: "200", c: "#CBF6DE" },
  { n: "300", c: "#A0EEC3" },
  { n: "400", c: "#74E7A7" },
  { n: "500", c: "#49DF8B" },
  { n: "600", c: "#25D070" },
  { n: "700", c: "#00BA52" },
  { n: "800", c: "#008F3F" },
  { n: "900", c: "#005C28" },
];

const TYPE_SCALE = [
  { name: "c10", weight: 400, size: 10, label: "caption" },
  { name: "c12", weight: 400, size: 12, label: "caption" },
  { name: "l10", weight: 500, size: 10, label: "label" },
  { name: "l12", weight: 500, size: 12, label: "label" },
  { name: "t13", weight: 500, size: 13, label: "title" },
  { name: "t14", weight: 500, size: 14, label: "title" },
  { name: "t16", weight: 500, size: 16, label: "title" },
  { name: "t20", weight: 600, size: 20, label: "title" },
];

function DesignTab() {
  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-[960px] mx-auto px-10 py-12">
        <p
          className="text-[11px] font-mono uppercase tracking-[0.22em]"
          style={{ color: DH.aiPurple }}
        >
          Day one decision, long payoff
        </p>
        <h3 className="mt-1 text-2xl font-semibold tracking-tight" style={{ color: DH.ink }}>
          The design system came before the first screen.
        </h3>
        <p
          className="mt-2 text-sm leading-relaxed max-w-[720px]"
          style={{ color: DH.inkSoft }}
        >
          Web, iOS, and Android all draw from the same tokens. Names
          describe what a thing means in the product, not what color it
          happens to be. A new feature today is still a small design
          job, not a redesign.
        </p>

        {/* Primary color ramp */}
        <div className="mt-10">
          <div className="flex items-baseline justify-between mb-3">
            <p
              className="text-[10px] font-mono uppercase tracking-[0.22em]"
              style={{ color: DH.muted }}
            >
              Primary — green
            </p>
            <p className="text-[11px] font-mono" style={{ color: DH.muted }}>
              primary = green700 · #00BA52
            </p>
          </div>
          <div className="grid grid-cols-10 gap-1 rounded-lg overflow-hidden">
            {PRIMARY_RAMP.map((c) => (
              <div
                key={c.n}
                className="aspect-[2/3] flex items-end justify-center pb-2"
                style={{ background: c.c }}
              >
                <span
                  className="text-[9px] font-mono"
                  style={{
                    color: parseInt(c.n) >= 500 ? "#fff" : DH.ink,
                  }}
                >
                  {c.n}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Category tokens with real component */}
        <div className="mt-10 grid grid-cols-[1.2fr_1fr] gap-6">
          <div>
            <p
              className="text-[10px] font-mono uppercase tracking-[0.22em] mb-3"
              style={{ color: DH.muted }}
            >
              Taxonomy tokens — the job-post DNA
            </p>
            <p
              className="text-sm leading-relaxed mb-4"
              style={{ color: DH.inkSoft }}
            >
              Every job post on the platform uses the same five
              categories. The tokens are named after what they mean, so
              a junior designer can&apos;t pick the &ldquo;wrong
              pink&rdquo; by accident.
            </p>
            <div className="flex flex-wrap gap-2">
              {CATEGORY_CHIPS.map((c) => (
                <div key={c.name} className="flex flex-col gap-1">
                  <span
                    className="inline-flex px-3 py-1.5 rounded-md text-[12px] font-medium"
                    style={{ background: c.bg, color: DH.ink }}
                  >
                    {c.label}
                  </span>
                  <span
                    className="text-[9px] font-mono text-center"
                    style={{ color: DH.muted }}
                  >
                    {c.name}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Live job card preview using the tokens */}
          <div
            className="rounded-2xl p-5"
            style={{
              background: DH.paper,
              border: `1px solid ${DH.border}`,
              boxShadow: "0 4px 14px -8px rgba(15,23,42,0.08)",
            }}
          >
            <p
              className="text-[10px] font-mono uppercase tracking-[0.22em] mb-3"
              style={{ color: DH.muted }}
            >
              Composed
            </p>
            <p className="text-[15px] font-semibold" style={{ color: DH.ink }}>
              Senior Frontend Engineer
            </p>
            <p className="text-[12px] mt-0.5" style={{ color: DH.muted }}>
              Acme Studios · Karachi or remote
            </p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {CATEGORY_CHIPS.map((c) => (
                <span
                  key={c.name}
                  className="text-[10px] px-2 py-0.5 rounded"
                  style={{ background: c.bg, color: DH.ink }}
                >
                  {c.label}
                </span>
              ))}
            </div>
            <div
              className="mt-4 pt-3 flex items-center justify-between text-[11px]"
              style={{ borderTop: `1px solid ${DH.border}`, color: DH.muted }}
            >
              <span>4 days ago</span>
              <span
                className="px-2 py-0.5 rounded"
                style={{ background: DH.primarySoft, color: DH.primaryDark }}
              >
                Actively hiring
              </span>
            </div>
          </div>
        </div>

        {/* Typography */}
        <div className="mt-12">
          <div className="flex items-baseline justify-between mb-3">
            <p
              className="text-[10px] font-mono uppercase tracking-[0.22em]"
              style={{ color: DH.muted }}
            >
              Typography — Poppins · 400 · 500 · 600
            </p>
            <p className="text-[11px] font-mono" style={{ color: DH.muted }}>
              c = caption · l = label · t = title
            </p>
          </div>
          <div
            className="rounded-2xl overflow-hidden"
            style={{
              background: DH.paper,
              border: `1px solid ${DH.border}`,
            }}
          >
            {TYPE_SCALE.map((t, i) => (
              <div
                key={t.name}
                className="grid grid-cols-[80px_80px_1fr_80px] gap-4 px-5 py-3 items-baseline"
                style={{
                  borderTop: i === 0 ? "none" : `1px solid ${DH.border}`,
                }}
              >
                <span
                  className="text-[11px] font-mono"
                  style={{ color: DH.muted }}
                >
                  {t.name}
                </span>
                <span
                  className="text-[11px] font-mono"
                  style={{ color: DH.muted }}
                >
                  {t.weight}
                </span>
                <span
                  style={{
                    fontSize: `${t.size}px`,
                    fontWeight: t.weight,
                    color: DH.ink,
                    fontFamily: "var(--font-poppins), Poppins, system-ui",
                  }}
                >
                  A senior frontend engineer who cares about craft.
                </span>
                <span
                  className="text-[11px] font-mono text-right"
                  style={{ color: DH.muted }}
                >
                  {t.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* AI component showcase */}
        <div className="mt-12">
          <p
            className="text-[10px] font-mono uppercase tracking-[0.22em] mb-3"
            style={{ color: DH.muted }}
          >
            Components designed for AI feedback
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div
              className="rounded-xl p-4"
              style={{
                background: DH.paper,
                border: `1px solid ${DH.aiPurple}55`,
                boxShadow: `0 0 0 3px ${DH.aiPurpleSoft}`,
              }}
            >
              <p
                className="text-[10px] font-mono uppercase tracking-[0.22em] mb-2"
                style={{ color: DH.aiPurple }}
              >
                AI input · aiPurple focus
              </p>
              <div
                className="rounded-lg px-3 py-2.5 text-[13px] flex items-center gap-2"
                style={{ background: DH.aiPurpleSoft }}
              >
                <span
                  className="h-4 w-4 rounded-full flex items-center justify-center text-[10px] font-bold text-white"
                  style={{ background: DH.aiPurple }}
                >
                  ✦
                </span>
                <span style={{ color: DH.ink }}>
                  Summarize this candidate in 2 sentences
                </span>
              </div>
            </div>

            <div
              className="rounded-xl p-4"
              style={{
                background: DH.paper,
                border: `1px solid ${DH.aiGrammarBorder}55`,
              }}
            >
              <p
                className="text-[10px] font-mono uppercase tracking-[0.22em] mb-2"
                style={{ color: DH.aiGrammarBorder }}
              >
                AI grammar · aiGrammar hint
              </p>
              <p className="text-[13px]" style={{ color: DH.ink }}>
                We are looking for a{" "}
                <span
                  className="px-1 rounded"
                  style={{
                    background: DH.aiGrammar,
                    boxShadow: `inset 0 -2px 0 ${DH.aiGrammarBorder}`,
                  }}
                >
                  seasoned
                </span>{" "}
                engineer.
              </p>
            </div>
          </div>
        </div>

        {/* Scale footer */}
        <div className="mt-10 grid grid-cols-4 gap-3">
          {[
            { k: "Surfaces", v: "Web · iOS · Android" },
            { k: "Tokens", v: "200+ semantic" },
            { k: "Feature modules", v: "17 on mobile" },
            { k: "Named routes", v: "80+" },
          ].map((s) => (
            <div
              key={s.k}
              className="rounded-xl p-4"
              style={{
                background: DH.paper,
                border: `1px solid ${DH.border}`,
              }}
            >
              <p
                className="text-[9px] font-mono uppercase tracking-[0.22em]"
                style={{ color: DH.muted }}
              >
                {s.k}
              </p>
              <p className="mt-1 text-sm font-semibold" style={{ color: DH.ink }}>
                {s.v}
              </p>
            </div>
          ))}
        </div>

        <p
          className="mt-5 text-xs italic"
          style={{ color: DH.muted }}
        >
          Handoff was easy because I still thought like a developer. The
          tokens are named after what they mean in the product, not
          after colors.
        </p>
      </div>
    </div>
  );
}

// ====================================================================
// CHAT TAB — reframed around the product decision
// ====================================================================

const ROUTER_PATTERNS: {
  re: RegExp;
  label: string;
  target: "employer" | "applicant";
}[] = [
  { re: /\b(hire|hiring|job post|recruit|candidate)\b/i, label: "hire / hiring / recruit / candidate", target: "employer" },
  { re: /\b(create|post|publish)\b.*\b(job|role|position)\b/i, label: "create / post + job / role", target: "employer" },
  { re: /\b(interview|assess|screen)\b/i, label: "interview / assess / screen", target: "employer" },
  { re: /\b(apply|application|resume|cv)\b/i, label: "apply / application / resume", target: "applicant" },
  { re: /\b(looking for|find me)\b.*\b(job|role)\b/i, label: "looking for + job / role", target: "applicant" },
];

type RouterDecision =
  | { kind: "match"; pattern: string; target: "employer" | "applicant" }
  | { kind: "fallback" };

function decide(input: string): RouterDecision {
  for (const p of ROUTER_PATTERNS) {
    if (p.re.test(input)) {
      return { kind: "match", pattern: p.label, target: p.target };
    }
  }
  return { kind: "fallback" };
}

function ChatTab() {
  const [input, setInput] = useState("I'm hiring a senior frontend engineer");
  const decision = decide(input);

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-[960px] mx-auto px-10 py-12">
        <p
          className="text-[11px] font-mono uppercase tracking-[0.22em]"
          style={{ color: DH.aiPurple }}
        >
          Forms to chat, and back to craft
        </p>
        <h3 className="mt-1 text-2xl font-semibold tracking-tight" style={{ color: DH.ink }}>
          The AI chat is a product surface, not a chatbot demo.
        </h3>
        <p
          className="mt-2 text-sm leading-relaxed max-w-[720px]"
          style={{ color: DH.inkSoft }}
        >
          When the chat-first shift hit, we could have bolted a bubble
          onto the existing forms. Instead we designed the conversation
          as the primary surface and let it fall back to forms when
          structure helped. Two personas, five clear things it can do,
          a visible tool call when it acts on your behalf.
        </p>

        {/* Two persona cards */}
        <div className="mt-8 grid grid-cols-2 gap-4">
          <div
            className="rounded-2xl p-5"
            style={{
              background: DH.paper,
              border: `1px solid ${DH.primary}44`,
              boxShadow: `0 0 0 4px ${DH.primarySoft}55`,
            }}
          >
            <div className="flex items-center justify-between mb-2">
              <p
                className="text-[10px] font-mono uppercase tracking-[0.22em]"
                style={{ color: DH.primaryDark }}
              >
                Employer persona
              </p>
              <span
                className="text-[9px] font-mono px-2 py-0.5 rounded-full"
                style={{ background: DH.primarySoft, color: DH.primaryDark }}
              >
                sharp, fast
              </span>
            </div>
            <p className="text-sm font-semibold" style={{ color: DH.ink }}>
              &ldquo;I&apos;m hiring a senior frontend engineer&rdquo;
            </p>
            <p className="mt-2 text-xs leading-relaxed" style={{ color: DH.inkSoft }}>
              Speaks like a recruiter. Assumes you know the role.
              Always offers to draft and save without making you wait
              through a form.
            </p>
          </div>

          <div
            className="rounded-2xl p-5"
            style={{
              background: DH.paper,
              border: `1px solid ${DH.aiGrammarBorder}44`,
              boxShadow: `0 0 0 4px ${DH.aiGrammar}88`,
            }}
          >
            <div className="flex items-center justify-between mb-2">
              <p
                className="text-[10px] font-mono uppercase tracking-[0.22em]"
                style={{ color: DH.aiGrammarBorder }}
              >
                Applicant persona
              </p>
              <span
                className="text-[9px] font-mono px-2 py-0.5 rounded-full"
                style={{ background: DH.aiGrammar, color: DH.aiGrammarBorder }}
              >
                warm, coach
              </span>
            </div>
            <p className="text-sm font-semibold" style={{ color: DH.ink }}>
              &ldquo;Can you help me prep for my interview?&rdquo;
            </p>
            <p className="mt-2 text-xs leading-relaxed" style={{ color: DH.inkSoft }}>
              Calm, supportive, never pushy. Suggests next steps
              instead of asking more questions. Knows when to let the
              candidate breathe.
            </p>
          </div>
        </div>

        {/* Tool chips — show what chat can actually do */}
        <div className="mt-8">
          <p
            className="text-[10px] font-mono uppercase tracking-[0.22em] mb-3"
            style={{ color: DH.muted }}
          >
            The five things chat can do · shown as live tool chips
          </p>
          <div className="flex flex-wrap gap-2">
            {[
              "createJobAd",
              "createInterviewCreateRequest",
              "searchApplicantRequest",
              "searchJobRequest",
              "answerFAQ",
            ].map((t) => (
              <div
                key={t}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg"
                style={{
                  background: DH.aiPurpleSoft,
                  border: `1px solid ${DH.aiPurple}44`,
                }}
              >
                <span
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ background: DH.success }}
                />
                <span
                  className="text-[12px] font-mono"
                  style={{ color: DH.aiPurple }}
                >
                  {t}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* The keyword router — reframed as a product decision */}
        <div
          className="mt-8 rounded-2xl overflow-hidden"
          style={{
            background: DH.paper,
            border: `1px solid ${DH.border}`,
          }}
        >
          <div className="p-5">
            <div className="flex items-baseline justify-between mb-2">
              <p
                className="text-[10px] font-mono uppercase tracking-[0.22em]"
                style={{ color: DH.aiPurple }}
              >
                The UX-first router
              </p>
              <p className="text-[11px]" style={{ color: DH.muted }}>
                fast-path before token spend
              </p>
            </div>
            <p className="text-sm mb-4" style={{ color: DH.inkSoft }}>
              Chat should feel instant for the obvious stuff. A keyword
              scan routes 80% of requests in milliseconds. Only the
              genuinely ambiguous prompts touch the LLM.
            </p>

            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type anything a user might say..."
              className="w-full rounded-lg px-4 py-3 text-sm font-mono outline-none"
              style={{
                background: DH.paperAlt,
                border: `1px solid ${DH.border}`,
                color: DH.ink,
              }}
            />

            <div className="mt-4 grid grid-cols-3 gap-3">
              <RouterStep
                label="Keyword scan"
                sub="37 patterns"
                state="done"
              />
              <RouterStep
                label={
                  decision.kind === "match" ? "Fast-path hit" : "No match"
                }
                sub={
                  decision.kind === "match"
                    ? decision.pattern
                    : "falls through"
                }
                state={decision.kind === "match" ? "done" : "skipped"}
              />
              <RouterStep
                label={
                  decision.kind === "match"
                    ? `Route to ${decision.target}`
                    : "LLM classifier"
                }
                sub={
                  decision.kind === "match"
                    ? "instant, no tokens"
                    : "gpt-4o-mini · 1 call"
                }
                state={decision.kind === "match" ? "done" : "pending"}
              />
            </div>
          </div>
        </div>

        {/* Small engineering nod, but compact */}
        <div
          className="mt-6 rounded-xl p-4 text-[12px] leading-relaxed"
          style={{
            background: DH.paperAlt,
            border: `1px solid ${DH.border}`,
            color: DH.inkSoft,
          }}
        >
          <span className="font-semibold" style={{ color: DH.ink }}>
            What we decided not to build:
          </span>{" "}
          LangChain, LangGraph, a RAG pipeline, a vector database, an
          embedding store, agentic loops. Chat in this product is
          persona + tool calls + five intents. The rest would have been
          scaffolding for our resume, not the user&apos;s flow.
        </div>
      </div>
    </div>
  );
}

function RouterStep({
  label,
  sub,
  state,
}: {
  label: string;
  sub: string;
  state: "done" | "skipped" | "pending";
}) {
  const color =
    state === "done"
      ? DH.success
      : state === "skipped"
        ? DH.muted
        : DH.aiPurple;
  return (
    <div
      className="rounded-lg p-3"
      style={{
        background: DH.paper,
        border: `1px solid ${state === "pending" ? DH.aiPurple + "55" : DH.border}`,
      }}
    >
      <div className="flex items-center gap-2 mb-1">
        <span
          className="h-1.5 w-1.5 rounded-full"
          style={{
            background: color,
            boxShadow:
              state === "pending" ? `0 0 10px ${DH.aiPurple}` : undefined,
          }}
        />
        <span
          className="text-[10px] font-mono uppercase tracking-[0.14em]"
          style={{ color: state === "skipped" ? DH.muted : DH.ink }}
        >
          {label}
        </span>
      </div>
      <p className="text-[11px]" style={{ color: DH.muted }}>
        {sub}
      </p>
    </div>
  );
}

// ====================================================================
// ENGINEERING TAB — compact, supports the designer story
// ====================================================================

const MODULES = [
  { name: "recruitment", note: "jobs, interviews · 41 entities" },
  { name: "applicant", note: "profiles, resumes" },
  { name: "company", note: "org, teams" },
  { name: "media", note: "signed video + files" },
  { name: "subscription", note: "Stripe billing" },
  { name: "notification", note: "push · email · Slack" },
  { name: "chat-agent", note: "thin proxy to chat service" },
  { name: "integrations", note: "Postmark, Stripe, external" },
  { name: "audit", note: "request + audit trail" },
  { name: "aggregator-bff", note: "BFF for the apps" },
  { name: "content", note: "SEO, sitemap" },
  { name: "auth", note: "RS512 JWT, permissions" },
  { name: "health", note: "liveness, separate port" },
];

function EngineeringTab() {
  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-[960px] mx-auto px-10 py-12">
        <p
          className="text-[11px] font-mono uppercase tracking-[0.22em]"
          style={{ color: DH.aiPurple }}
        >
          The quiet work behind the product
        </p>
        <h3 className="mt-1 text-2xl font-semibold tracking-tight" style={{ color: DH.ink }}>
          Two services under the chat rebuild, one ongoing monolith
          migration.
        </h3>
        <p
          className="mt-2 text-sm leading-relaxed max-w-[720px]"
          style={{ color: DH.inkSoft }}
        >
          This is the part that lets the design work keep shipping. I
          keep it visible here because it is part of the job, not
          because the engineering is the product.
        </p>

        {/* Two service cards */}
        <div className="mt-8 grid grid-cols-2 gap-4">
          <div
            className="rounded-2xl p-5"
            style={{
              background: DH.paper,
              border: `1px solid ${DH.aiPurple}44`,
            }}
          >
            <p
              className="text-[10px] font-mono uppercase tracking-[0.22em] mb-2"
              style={{ color: DH.aiPurple }}
            >
              chat-management-service-v2
            </p>
            <p className="text-sm font-semibold" style={{ color: DH.ink }}>
              The chat brain
            </p>
            <p className="mt-2 text-xs leading-relaxed" style={{ color: DH.inkSoft }}>
              NestJS 11 · OpenAI SDK via OpenRouter · SSE streaming ·
              9 modules · 13 HTTP endpoints · 71 files · ~9,900 LOC ·
              4,148 lines of tests.
            </p>
          </div>
          <div
            className="rounded-2xl p-5"
            style={{
              background: DH.paper,
              border: `1px solid ${DH.primary}44`,
            }}
          >
            <p
              className="text-[10px] font-mono uppercase tracking-[0.22em] mb-2"
              style={{ color: DH.primaryDark }}
            >
              dh-backend-v2 · in flight
            </p>
            <p className="text-sm font-semibold" style={{ color: DH.ink }}>
              The monolith migration
            </p>
            <p className="mt-2 text-xs leading-relaxed" style={{ color: DH.inkSoft }}>
              NestJS 11 · MySQL via TypeORM · BullMQ + Redis · 13
              feature modules · 84 entities · 469 files · ~59k LOC ·
              daily commits.
            </p>
          </div>
        </div>

        {/* Module grid */}
        <div className="mt-8">
          <p
            className="text-[10px] font-mono uppercase tracking-[0.22em] mb-3"
            style={{ color: DH.muted }}
          >
            Backend modules · 13
          </p>
          <div className="grid grid-cols-2 gap-2">
            {MODULES.map((m, i) => (
              <div
                key={m.name}
                className="rounded-lg px-3 py-2 flex items-center gap-3"
                style={{
                  background: DH.paper,
                  border: `1px solid ${DH.border}`,
                }}
              >
                <span
                  className="text-[10px] font-mono shrink-0"
                  style={{ color: DH.muted }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[12px] font-semibold" style={{ color: DH.ink }}>
                    {m.name}
                  </p>
                  <p
                    className="text-[10px] truncate"
                    style={{ color: DH.muted }}
                  >
                    {m.note}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Infra chips */}
        <div className="mt-8">
          <p
            className="text-[10px] font-mono uppercase tracking-[0.22em] mb-3"
            style={{ color: DH.muted }}
          >
            Infra
          </p>
          <div className="flex flex-wrap gap-2">
            {[
              "AWS ECS",
              "MySQL 8",
              "Redis",
              "BullMQ · 4 queues",
              "CloudFront signed URLs",
              "AWS Secrets Manager",
              "S3 · R2 · Minio abstraction",
              "RS512 JWT",
              "Request ID + audit subscriber",
            ].map((x) => (
              <span
                key={x}
                className="text-[11px] px-2.5 py-1 rounded-md"
                style={{
                  background: DH.paperAlt,
                  border: `1px solid ${DH.border}`,
                  color: DH.inkSoft,
                }}
              >
                {x}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ====================================================================
// STORY TAB
// ====================================================================

const BEATS = [
  {
    year: "2022",
    label: "The rebuild",
    title:
      "Sole designer. Redesigned every surface from scratch. Shipped web and mobile in parallel.",
    copy: "DigitalHire had been outsourced before I arrived. The product worked, in the way old outsourced products work. The company made the call to build an in-house engineering team and re-platform everything. I was the first designer. A consultant was kept on standby. He was never needed. I ran stakeholder discovery, built the design system on day one so handoff stayed fast, and kept the design developer-friendly because I still thought like one.",
    color: DH.primary,
  },
  {
    year: "2023",
    label: "The AI shift",
    title:
      "Forms to chat. The whole product paradigm changed and I designed the new one.",
    copy: "The old flow was a form. Fill in a job, AI generates a post. Fill in an interview, AI generates questions. When chat-first AI became the expectation, the whole pattern had to flip. Conversations instead of forms. Personas instead of branching UIs. I took the redesign end-to-end while still shipping the existing app.",
    color: DH.aiPurple,
  },
  {
    year: "2024",
    label: "Became PM",
    title:
      "A title I never asked for. People kept coming to me because I knew the product better than anyone.",
    copy: "I designed it, communicated every change, talked to every stakeholder, sat in every review. At some point the company formalized what was already true and gave me the PM title. Still the only designer. Now also the one writing the specs and running the sprint.",
    color: DH.aiGrammarBorder,
  },
  {
    year: "2025",
    label: "The dev pivot",
    title: "Design was done, engineering was stuck. I picked up the code.",
    copy: "The chat rewrite was blocked. The old service was overengineered with layers that the business did not need. Ishaque pushed me to own it. Mohsin took the client. I rebuilt the service on NestJS with a stack matched to the requirements, not to a buzzword. Daily internal testing. We shipped on time. The President called it the smoothest launch DigitalHire has ever had. I have been in the codebase since.",
    color: DH.success,
  },
];

function StoryTab() {
  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-[860px] mx-auto px-10 py-12">
        <p
          className="text-[11px] font-mono uppercase tracking-[0.22em]"
          style={{ color: DH.aiPurple }}
        >
          3.5 years, one thread
        </p>
        <h3 className="mt-1 text-2xl font-semibold tracking-tight" style={{ color: DH.ink }}>
          The same job turned into three jobs. None of them by plan.
        </h3>
        <p
          className="mt-2 text-sm leading-relaxed max-w-[680px]"
          style={{ color: DH.inkSoft }}
        >
          Each beat below is the moment the role quietly widened. I did
          not negotiate for any of them. They were asked for because I
          was already doing the thing.
        </p>

        <ol className="mt-10 space-y-10 relative">
          {BEATS.map((b, i) => (
            <li key={i} className="grid grid-cols-[64px_1fr] gap-4">
              <div className="flex flex-col items-center">
                <span
                  className="h-9 w-9 rounded-full flex items-center justify-center text-[10px] font-mono font-semibold text-white"
                  style={{ background: b.color }}
                >
                  {i + 1}
                </span>
                {i < BEATS.length - 1 && (
                  <span
                    className="w-px flex-1 mt-2"
                    style={{ background: DH.border }}
                  />
                )}
              </div>
              <div className="pb-6">
                <div className="flex items-baseline gap-3 mb-1">
                  <p
                    className="text-[10px] font-mono uppercase tracking-[0.22em]"
                    style={{ color: b.color }}
                  >
                    {b.label}
                  </p>
                  <span
                    className="text-[10px] font-mono"
                    style={{ color: DH.muted }}
                  >
                    · {b.year}
                  </span>
                </div>
                <p className="text-lg font-semibold tracking-tight leading-snug" style={{ color: DH.ink }}>
                  {b.title}
                </p>
                <p
                  className="mt-2 text-sm leading-relaxed"
                  style={{ color: DH.inkSoft }}
                >
                  {b.copy}
                </p>
              </div>
            </li>
          ))}
        </ol>

        <div
          className="mt-8 p-5 rounded-2xl"
          style={{
            background: DH.primarySoft,
            border: `1px solid ${DH.primary}44`,
          }}
        >
          <p
            className="text-[10px] font-mono uppercase tracking-[0.22em] mb-2"
            style={{ color: DH.primaryDark }}
          >
            Stakeholder note
          </p>
          <p className="text-lg font-serif italic leading-relaxed" style={{ color: DH.ink }}>
            &ldquo;The smoothest launch DigitalHire has ever had.&rdquo;
          </p>
          <p
            className="mt-2 text-xs font-mono"
            style={{ color: DH.muted }}
          >
            President of DigitalHire, on the chat service launch
          </p>
        </div>

        <div className="mt-6 grid grid-cols-4 gap-3">
          {[
            { k: "Duration", v: "3.5 years" },
            { k: "Roles held", v: "3" },
            { k: "Services shipped", v: "3" },
            { k: "Combined LOC", v: "~316k" },
          ].map((s) => (
            <div
              key={s.k}
              className="rounded-xl p-4"
              style={{
                background: DH.paper,
                border: `1px solid ${DH.border}`,
              }}
            >
              <p
                className="text-[9px] font-mono uppercase tracking-[0.22em]"
                style={{ color: DH.muted }}
              >
                {s.k}
              </p>
              <p className="mt-1 text-base font-semibold" style={{ color: DH.ink }}>
                {s.v}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
