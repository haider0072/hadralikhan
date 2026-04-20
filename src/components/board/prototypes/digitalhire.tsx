"use client";

import { useEffect, useRef, useState } from "react";
import type { CardActivity } from "../use-card-activity";
import { ProjectFrame } from "../project-frame";
import { FocusModal } from "../focus-modal";
import { cn } from "@/lib/cn";

// Palette is pulled straight from the Flutter app (lib/shared/app_colors.dart
// + app_theme.dart), so surfaces here read like the product itself.
const DH = {
  bg: "#f7faf9",
  paper: "#ffffff",
  card: "#F8FBFE",
  paperAlt: "#f1f5f2",
  border: "#e5e7eb",
  borderSoft: "#eef2ee",
  ink: "#0f172a",
  inkSoft: "#374151",
  muted: "#64748b",
  primary: "#00BA52", // green700
  primaryDark: "#005C28", // green900
  primarySoft: "#E5FAEE", // green100
  primarySofter: "#F2FDF7", // green50
  aiPurple: "#870CE8",
  aiPurpleSoft: "#F3E8FF",
  aiGrammar: "#E0F2FE",
  aiGrammarBorder: "#0369A1",
  workplaceType: "#FADCDB",
  jobType: "#E3F3E4",
  experienceLevel: "#F0DEF2",
  compensation: "#FFEFD6",
  education: "#D6F5FF",
  success: "#059669",
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
          "70k+ users, three platforms, one design system. Designer, then PM, then dev.",
      }}
      innerClassName="bg-white"
      onOpen={onOpen}
      tape="top-right"
    >
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute -top-16 -right-10 w-56 h-56 rounded-full"
          style={{ background: DH.aiPurple, filter: "blur(100px)", opacity: 0.16 }}
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
              70k+ users · 3 platforms
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
        background: DH.primary,
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

      {phase === "thinking" && (
        <div className="flex items-center gap-1 pl-1">
          <span className="h-1.5 w-1.5 rounded-full animate-pulse" style={{ background: DH.aiPurple }} />
          <span className="h-1.5 w-1.5 rounded-full animate-pulse" style={{ background: DH.aiPurple, animationDelay: "150ms" }} />
          <span className="h-1.5 w-1.5 rounded-full animate-pulse" style={{ background: DH.aiPurple, animationDelay: "300ms" }} />
        </div>
      )}

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

      {(phase === "tool" || phase === "done") && (
        <div
          className="flex items-center gap-1 px-2 py-1 rounded-md self-start"
          style={{
            background: DH.aiPurpleSoft,
            border: `1px solid ${DH.aiPurple}55`,
          }}
        >
          <span className="h-1.5 w-1.5 rounded-full" style={{ background: DH.success }} />
          <span className="text-[8px] font-mono" style={{ color: DH.aiPurple }}>
            createJobAd
          </span>
          <span className="text-[7px] font-mono" style={{ color: DH.muted }}>
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

type Tab = "overview" | "design" | "chat";

function DigitalHireFocus() {
  const [tab, setTab] = useState<Tab>("overview");
  return (
    <div
      className="w-[min(1180px,96vw)] h-[min(760px,92vh)] grid grid-cols-[340px_1fr] overflow-hidden font-sans"
      style={{ background: DH.bg, color: DH.ink }}
    >
      <Sidebar />
      <section className="flex flex-col overflow-hidden min-w-0">
        <TabBar tab={tab} setTab={setTab} />
        <div className="flex-1 overflow-hidden">
          {tab === "overview" && <OverviewTab />}
          {tab === "design" && <DesignTab />}
          {tab === "chat" && <ChatTab />}
        </div>
      </section>
    </div>
  );
}

// ====================================================================
// SIDEBAR
// ====================================================================

function Sidebar() {
  return (
    <aside
      className="p-7 overflow-y-auto border-r flex flex-col"
      style={{ background: DH.paper, borderColor: DH.border }}
    >
      <div className="flex items-center gap-3">
        <DHMark size={44} />
        <div>
          <p className="font-semibold tracking-tight text-base leading-none" style={{ color: DH.ink }}>
            DigitalHire
          </p>
          <p className="text-[10px] font-mono uppercase tracking-[0.22em] mt-1.5" style={{ color: DH.muted }}>
            2022 — now · talent engine
          </p>
        </div>
      </div>

      <p className="mt-5 text-[13px] leading-relaxed" style={{ color: DH.inkSoft }}>
        Video-first recruitment SaaS. I came in as sole designer, ended up
        PM, and moved back into the code when it mattered.
      </p>

      <div className="mt-5">
        <p className="text-[10px] font-mono uppercase tracking-[0.22em] mb-2" style={{ color: DH.muted }}>
          Roles, in the order they happened
        </p>
        <ul className="space-y-1.5 text-[12.5px]" style={{ color: DH.inkSoft }}>
          <li className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: DH.primary }} />
            Product Designer, solo from day one
          </li>
          <li className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: DH.aiPurple }} />
            Product Manager, not a title I asked for
          </li>
          <li className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: DH.aiGrammarBorder }} />
            Full-stack dev, picked up when it mattered
          </li>
        </ul>
      </div>

      <div className="mt-5">
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
          on frontend.{" "}
          <a
            href="https://github.com/ishaquehassan"
            target="_blank"
            rel="noreferrer"
            className="underline decoration-dotted"
            style={{ color: DH.ink }}
          >
            Ishaque Hassan
          </a>{" "}
          as engineering manager.
        </p>
      </div>

      <div
        className="mt-5 p-3 rounded-xl text-[12px] leading-relaxed"
        style={{
          background: DH.aiPurpleSoft,
          color: DH.inkSoft,
          border: `1px solid ${DH.aiPurple}33`,
        }}
      >
        Next beat: an AI agent layer across the platform. Can&apos;t show
        it yet — it&apos;s why my evenings look like this.
      </div>

      <div className="mt-auto pt-6 space-y-2">
        <a
          href="https://digitalhire.com"
          target="_blank"
          rel="noreferrer"
          className="group flex items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          style={{
            background: DH.primary,
            boxShadow: `0 8px 24px -8px ${DH.primary}88`,
          }}
        >
          <span className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" aria-hidden />
            Visit the live product
          </span>
          <span className="transition-transform group-hover:translate-x-1">→</span>
        </a>
        <a
          href="https://play.google.com/store/apps/details?id=com.digitalhire"
          target="_blank"
          rel="noreferrer"
          className="group flex items-center justify-between rounded-xl px-4 py-3 text-[13px] font-medium transition-colors"
          style={{
            background: DH.paperAlt,
            border: `1px solid ${DH.border}`,
            color: DH.ink,
          }}
        >
          <span>Android app on Play Store</span>
          <span className="transition-transform group-hover:translate-x-1">→</span>
        </a>
      </div>
    </aside>
  );
}

// ====================================================================
// TAB BAR — solid green underline, no gradient
// ====================================================================

function TabBar({ tab, setTab }: { tab: Tab; setTab: (t: Tab) => void }) {
  const items: { id: Tab; label: string }[] = [
    { id: "overview", label: "Overview" },
    { id: "design", label: "Design" },
    { id: "chat", label: "AI chat" },
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
            className={cn("relative h-14 px-4 text-sm font-medium transition-colors")}
            style={{ color: active ? DH.ink : DH.muted }}
          >
            {item.label}
            {active && (
              <span
                className="absolute bottom-[-1px] left-4 right-4 h-[2px] rounded-full"
                style={{ background: DH.primary }}
              />
            )}
          </button>
        );
      })}
    </nav>
  );
}

// ====================================================================
// OVERVIEW TAB — metrics first, tight, visual
// ====================================================================

function OverviewTab() {
  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-[920px] mx-auto px-10 py-10">
        {/* Hero metrics */}
        <div className="grid grid-cols-4 gap-3">
          <MetricCard value="70K+" label="users on the platform" accent={DH.primary} />
          <MetricCard value="10K+" label="Android installs" accent={DH.aiGrammarBorder} />
          <MetricCard value="3" label="platforms shipped" accent={DH.aiPurple} />
          <MetricCard value="3.5y" label="on the same product" accent={DH.primaryDark} />
        </div>

        <div className="mt-10 grid grid-cols-[1fr_1.1fr] gap-6">
          {/* What shipped */}
          <div>
            <p className="text-[10px] font-mono uppercase tracking-[0.22em] mb-3" style={{ color: DH.muted }}>
              What I shipped
            </p>
            <ul className="space-y-2.5">
              <ShipRow
                dot={DH.primary}
                head="Rebuilt the product from scratch"
                sub="Web, iOS, Android — one design system, day one."
              />
              <ShipRow
                dot={DH.aiPurple}
                head="Designed the pivot from forms to chat"
                sub="Two personas, five tool calls, one unified surface."
              />
              <ShipRow
                dot={DH.aiGrammarBorder}
                head="Rewrote the chat service on NestJS"
                sub="Stripped LangChain, added keyword routing + SSE."
              />
              <ShipRow
                dot={DH.primaryDark}
                head="Leading the monolith migration"
                sub="13 modules, 84 entities, clean seams before AI layer."
              />
            </ul>
          </div>

          {/* Job card preview — actual DH card pattern */}
          <div>
            <p className="text-[10px] font-mono uppercase tracking-[0.22em] mb-3" style={{ color: DH.muted }}>
              A live job post from the platform
            </p>
            <JobCard />

            <div className="mt-4 flex items-center gap-3">
              <div
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px]"
                style={{ background: DH.primarySoft, color: DH.primaryDark }}
              >
                <span className="h-1.5 w-1.5 rounded-full" style={{ background: DH.primary }} />
                Actively hiring
              </div>
              <span className="text-[11px]" style={{ color: DH.muted }}>
                · composed from five reusable tokens
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({
  value,
  label,
  accent,
}: {
  value: string;
  label: string;
  accent: string;
}) {
  return (
    <div
      className="rounded-2xl p-4"
      style={{
        background: DH.card,
        border: `1px solid ${DH.border}`,
      }}
    >
      <p className="text-[28px] font-semibold leading-none tracking-tight" style={{ color: accent }}>
        {value}
      </p>
      <p className="mt-2 text-[11px] leading-snug" style={{ color: DH.muted }}>
        {label}
      </p>
    </div>
  );
}

function ShipRow({
  dot,
  head,
  sub,
}: {
  dot: string;
  head: string;
  sub: string;
}) {
  return (
    <li
      className="rounded-xl px-3 py-2.5 flex items-start gap-3"
      style={{ background: DH.card, border: `1px solid ${DH.border}` }}
    >
      <span className="h-2 w-2 rounded-full mt-1.5 shrink-0" style={{ background: dot }} />
      <div>
        <p className="text-[13px] font-medium" style={{ color: DH.ink }}>
          {head}
        </p>
        <p className="text-[12px] mt-0.5" style={{ color: DH.muted }}>
          {sub}
        </p>
      </div>
    </li>
  );
}

// The actual job card pattern from lib/.../ai_job_card_item.dart
function JobCard() {
  return (
    <div
      className="rounded-2xl p-4"
      style={{
        background: DH.card,
        border: `1px solid ${DH.border}`,
      }}
    >
      <p className="text-[13px] font-semibold leading-snug" style={{ color: DH.ink }}>
        Senior Frontend Engineer{" "}
        <span className="font-normal" style={{ color: DH.inkSoft }}>
          at Acme Studios
        </span>
      </p>
      <div className="mt-1 flex items-center gap-1.5 text-[11px]" style={{ color: DH.muted }}>
        <span>Remote</span>
        <span className="h-[3px] w-[3px] rounded-full" style={{ background: DH.muted }} />
        <span>Karachi or remote</span>
        <span className="h-[3px] w-[3px] rounded-full" style={{ background: DH.muted }} />
        <span>Full-time</span>
        <span className="h-[3px] w-[3px] rounded-full" style={{ background: DH.muted }} />
        <span>4 days ago</span>
      </div>
      <div className="mt-3 flex flex-wrap gap-1.5">
        <SkillChip>TypeScript</SkillChip>
        <SkillChip>React</SkillChip>
        <SkillChip>Design systems</SkillChip>
        <SkillChip>+5</SkillChip>
      </div>
    </div>
  );
}

function SkillChip({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="text-[10.5px] px-2 py-[3px] rounded-md"
      style={{
        background: DH.paper,
        border: `1px solid ${DH.border}`,
        color: DH.inkSoft,
      }}
    >
      {children}
    </span>
  );
}

// ====================================================================
// DESIGN TAB — visual, no paragraphs
// ====================================================================

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

const CATEGORY_TOKENS = [
  { token: "workplaceType", bg: DH.workplaceType, label: "Remote" },
  { token: "jobType", bg: DH.jobType, label: "Full-time" },
  { token: "experienceLevel", bg: DH.experienceLevel, label: "Mid-senior" },
  { token: "compensation", bg: DH.compensation, label: "$120k — $160k" },
  { token: "education", bg: DH.education, label: "Bachelor's+" },
];

function DesignTab() {
  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-[920px] mx-auto px-10 py-10">
        {/* Primary ramp */}
        <div className="flex items-end justify-between mb-3">
          <div>
            <p className="text-[10px] font-mono uppercase tracking-[0.22em]" style={{ color: DH.muted }}>
              Primary · green
            </p>
            <p className="text-[18px] font-semibold mt-1" style={{ color: DH.ink }}>
              green700 — #00BA52
            </p>
          </div>
          <p className="text-[11px] font-mono" style={{ color: DH.muted }}>
            same ramp across web, iOS, Android
          </p>
        </div>
        <div className="grid grid-cols-10 gap-1 rounded-xl overflow-hidden">
          {PRIMARY_RAMP.map((c) => (
            <div
              key={c.n}
              className="aspect-[2/3] flex items-end justify-center pb-1.5"
              style={{ background: c.c }}
            >
              <span
                className="text-[9px] font-mono"
                style={{ color: parseInt(c.n) >= 500 ? "#fff" : DH.ink }}
              >
                {c.n}
              </span>
            </div>
          ))}
        </div>

        {/* Taxonomy tokens */}
        <div className="mt-10">
          <p className="text-[10px] font-mono uppercase tracking-[0.22em] mb-3" style={{ color: DH.muted }}>
            Taxonomy tokens · job-post DNA
          </p>
          <div className="grid grid-cols-5 gap-2.5">
            {CATEGORY_TOKENS.map((t) => (
              <div
                key={t.token}
                className="rounded-xl p-3 flex flex-col gap-2"
                style={{ background: DH.card, border: `1px solid ${DH.border}` }}
              >
                <span
                  className="text-[11px] font-medium px-2 py-1 rounded-md self-start"
                  style={{ background: t.bg, color: DH.ink }}
                >
                  {t.label}
                </span>
                <span className="text-[10px] font-mono" style={{ color: DH.muted }}>
                  {t.token}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Composed card */}
        <div className="mt-10 grid grid-cols-[1fr_1.1fr] gap-6">
          <div>
            <p className="text-[10px] font-mono uppercase tracking-[0.22em] mb-3" style={{ color: DH.muted }}>
              How it composes
            </p>
            <div
              className="rounded-xl p-4"
              style={{ background: DH.card, border: `1px solid ${DH.border}` }}
            >
              <code className="text-[11.5px] leading-6 font-mono" style={{ color: DH.inkSoft }}>
                <span style={{ color: DH.aiPurple }}>AiJobCardItem</span>(
                <br />
                &nbsp;&nbsp;title: <span style={{ color: DH.primary }}>&quot;Senior FE&quot;</span>,
                <br />
                &nbsp;&nbsp;workplaceType: <span style={{ color: DH.primary }}>&quot;Remote&quot;</span>,
                <br />
                &nbsp;&nbsp;jobType: <span style={{ color: DH.primary }}>&quot;Full-time&quot;</span>,
                <br />
                &nbsp;&nbsp;skills: [ <span style={{ color: DH.primary }}>&quot;TS&quot;</span>,{" "}
                <span style={{ color: DH.primary }}>&quot;React&quot;</span>, … ],
                <br />)
              </code>
            </div>
          </div>
          <div>
            <p className="text-[10px] font-mono uppercase tracking-[0.22em] mb-3" style={{ color: DH.muted }}>
              Rendered result
            </p>
            <JobCard />
          </div>
        </div>

        {/* AI components */}
        <div className="mt-10">
          <p className="text-[10px] font-mono uppercase tracking-[0.22em] mb-3" style={{ color: DH.muted }}>
            AI surfaces · purple means machine, blue means grammar assist
          </p>
          <div className="grid grid-cols-2 gap-3">
            <div
              className="rounded-xl p-4 flex flex-col gap-3"
              style={{ background: DH.card, border: `1px solid ${DH.border}` }}
            >
              <div
                className="rounded-lg p-3 flex items-center gap-2"
                style={{
                  background: "#fff",
                  border: `1px solid ${DH.aiPurple}55`,
                  boxShadow: `0 0 0 3px ${DH.aiPurple}15`,
                }}
              >
                <span className="h-2 w-2 rounded-full animate-pulse" style={{ background: DH.aiPurple }} />
                <span className="text-[12px]" style={{ color: DH.inkSoft }}>
                  ask me to post a role…
                </span>
              </div>
              <p className="text-[10px] font-mono" style={{ color: DH.muted }}>
                ai input · aiPurple ring
              </p>
            </div>
            <div
              className="rounded-xl p-4 flex flex-col gap-3"
              style={{ background: DH.card, border: `1px solid ${DH.border}` }}
            >
              <div
                className="rounded-lg p-3"
                style={{ background: DH.aiGrammar, border: `1px solid ${DH.aiGrammarBorder}55` }}
              >
                <span className="text-[12px]" style={{ color: DH.inkSoft }}>
                  <span
                    className="underline decoration-wavy decoration-2 underline-offset-2"
                    style={{ textDecorationColor: DH.aiGrammarBorder }}
                  >
                    im looking for
                  </span>{" "}
                  a backend engineer
                </span>
              </div>
              <p className="text-[10px] font-mono" style={{ color: DH.muted }}>
                ai grammar hint · blue underline
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ====================================================================
// CHAT TAB — visual, persona-first, tight
// ====================================================================

function ChatTab() {
  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-[920px] mx-auto px-10 py-10">
        {/* Personas */}
        <div className="grid grid-cols-2 gap-4">
          <PersonaCard
            tint={DH.primarySoft}
            border={DH.primary}
            role="Employer"
            quote="I'm hiring a senior frontend engineer"
            body="Sharp, fast. Drafts + saves without long forms."
          />
          <PersonaCard
            tint={DH.aiGrammar}
            border={DH.aiGrammarBorder}
            role="Applicant"
            quote="Can you help me prep for my interview?"
            body="Calm, supportive. Suggests next steps, never pushes."
          />
        </div>

        {/* Tool chips */}
        <div className="mt-10">
          <div className="flex items-end justify-between mb-3">
            <p className="text-[10px] font-mono uppercase tracking-[0.22em]" style={{ color: DH.muted }}>
              Five things the chat can do
            </p>
            <p className="text-[11px]" style={{ color: DH.muted }}>
              each one a tool call, surfaced as a live chip
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              "createJobAd",
              "createInterviewRequest",
              "searchApplicant",
              "searchJob",
              "answerFAQ",
            ].map((t) => (
              <div
                key={t}
                className="flex items-center gap-2 px-3 py-1.5 rounded-md"
                style={{ background: DH.aiPurpleSoft, border: `1px solid ${DH.aiPurple}55` }}
              >
                <span className="h-1.5 w-1.5 rounded-full" style={{ background: DH.success }} />
                <span className="text-[11.5px] font-mono" style={{ color: DH.aiPurple }}>
                  {t}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Router */}
        <div className="mt-10">
          <div className="flex items-end justify-between mb-3">
            <p className="text-[10px] font-mono uppercase tracking-[0.22em]" style={{ color: DH.muted }}>
              The UX-first router
            </p>
            <p className="text-[11px]" style={{ color: DH.muted }}>
              ~80% of traffic never touches the LLM
            </p>
          </div>
          <div
            className="rounded-xl p-4 grid grid-cols-[1fr_auto_1fr] items-center gap-3"
            style={{ background: DH.card, border: `1px solid ${DH.border}` }}
          >
            <div className="space-y-2">
              <RouteRow
                label="“show me remote jobs”"
                tag="keyword"
                color={DH.primary}
                tint={DH.primarySoft}
              />
              <RouteRow
                label="“what's my sub status?”"
                tag="keyword"
                color={DH.primary}
                tint={DH.primarySoft}
              />
              <RouteRow
                label="“draft a post for a senior FE”"
                tag="llm"
                color={DH.aiPurple}
                tint={DH.aiPurpleSoft}
              />
            </div>
            <span style={{ color: DH.muted }}>→</span>
            <div className="space-y-2">
              <RouteOutcome ok label="direct answer · 120ms" color={DH.primary} />
              <RouteOutcome ok label="subscription lookup · 180ms" color={DH.primary} />
              <RouteOutcome label="stream + tool call · 2s" color={DH.aiPurple} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PersonaCard({
  tint,
  border,
  role,
  quote,
  body,
}: {
  tint: string;
  border: string;
  role: string;
  quote: string;
  body: string;
}) {
  return (
    <div
      className="rounded-2xl p-5 flex flex-col gap-3"
      style={{ background: DH.card, border: `1px solid ${DH.border}` }}
    >
      <div className="flex items-center gap-2">
        <span className="text-[10px] font-mono uppercase tracking-[0.2em]" style={{ color: DH.muted }}>
          {role}
        </span>
        <span className="h-1 w-1 rounded-full" style={{ background: DH.muted }} />
        <span className="text-[10px] font-mono" style={{ color: border }}>
          persona
        </span>
      </div>
      <p
        className="text-[14px] font-medium leading-snug px-3 py-2 rounded-lg"
        style={{ background: tint, color: DH.ink, border: `1px solid ${border}33` }}
      >
        &ldquo;{quote}&rdquo;
      </p>
      <p className="text-[12px] leading-relaxed" style={{ color: DH.inkSoft }}>
        {body}
      </p>
    </div>
  );
}

function RouteRow({
  label,
  tag,
  color,
  tint,
}: {
  label: string;
  tag: string;
  color: string;
  tint: string;
}) {
  return (
    <div
      className="rounded-md px-3 py-2 flex items-center justify-between gap-2"
      style={{ background: DH.paper, border: `1px solid ${DH.border}` }}
    >
      <span className="text-[12px]" style={{ color: DH.inkSoft }}>
        {label}
      </span>
      <span
        className="text-[9px] font-mono uppercase tracking-[0.18em] px-2 py-0.5 rounded"
        style={{ background: tint, color }}
      >
        {tag}
      </span>
    </div>
  );
}

function RouteOutcome({
  label,
  color,
  ok,
}: {
  label: string;
  color: string;
  ok?: boolean;
}) {
  return (
    <div
      className="rounded-md px-3 py-2 flex items-center gap-2"
      style={{ background: DH.paper, border: `1px solid ${DH.border}` }}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: ok ? DH.success : color }} />
      <span className="text-[12px]" style={{ color: DH.inkSoft }}>
        {label}
      </span>
    </div>
  );
}
