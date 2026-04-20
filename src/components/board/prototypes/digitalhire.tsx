"use client";

import { useEffect, useRef, useState } from "react";
import type { CardActivity } from "../use-card-activity";
import { ProjectFrame } from "../project-frame";
import { FocusModal } from "../focus-modal";
import { cn } from "@/lib/cn";

// DigitalHire palette — deep indigo with AI-purple accents, pulled from
// the Flutter design tokens (aiPurple, aiGrammar). This is the one piece
// of work on the board where "current, still shipping" is the whole point.
const DH = {
  bg: "#0f1020",
  surface: "#181a2e",
  surfaceHi: "#20243e",
  border: "#2d3152",
  primary: "#6366f1",
  aiPurple: "#a78bfa",
  aiGrammar: "#22d3ee",
  success: "#34d399",
  warn: "#fbbf24",
  text: "#f5f5f7",
  muted: "#9ca3af",
  soft: "#cbd5e1",
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
      innerClassName="bg-[#0f1020]"
      onOpen={onOpen}
      tape="top-right"
    >
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute -top-16 -right-10 w-56 h-56 rounded-full"
          style={{ background: DH.aiPurple, filter: "blur(90px)", opacity: 0.35 }}
        />
        <div
          className="absolute -bottom-10 -left-10 w-48 h-48 rounded-full"
          style={{ background: DH.primary, filter: "blur(80px)", opacity: 0.3 }}
        />
      </div>

      <div className="relative h-full flex items-center justify-center px-4">
        <ChatStreamStage animated={activity === "active"} />
      </div>

      <div className="absolute top-4 left-4 right-4 flex items-start justify-between">
        <div className="flex items-center gap-2">
          <DHMark size={28} />
          <div>
            <p className="text-[11px] font-semibold text-white leading-none">
              DigitalHire
            </p>
            <p className="text-[9px] text-[#9ca3af] mt-0.5">
              design · product · engineering
            </p>
          </div>
        </div>
        <div
          className="text-[8px] font-mono uppercase tracking-[0.18em] px-2 py-1 rounded-full flex items-center gap-1.5"
          style={{
            background: "rgba(167,139,250,0.12)",
            border: `1px solid ${DH.aiPurple}55`,
            color: DH.aiPurple,
          }}
        >
          <span
            className="h-1.5 w-1.5 rounded-full animate-pulse"
            style={{ background: DH.aiPurple }}
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
        background: `linear-gradient(135deg, ${DH.primary} 0%, ${DH.aiPurple} 100%)`,
        boxShadow: "0 6px 18px -8px rgba(99,102,241,0.5)",
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

// ---- Peek animation: mini chat streaming ---------------------------------

const USER_MSG = "create a job post for a senior frontend engineer";
const AI_REPLY =
  "On it. I'll draft it now and flag what to review.";
const JOB_TITLE = "Senior Frontend Engineer";

function ChatStreamStage({ animated }: { animated: boolean }) {
  const [phase, setPhase] = useState<"idle" | "user" | "thinking" | "reply" | "tool" | "done">(
    "idle",
  );
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

      // User typing
      schedule(() => setPhase("user"), 300);
      for (let i = 1; i <= USER_MSG.length; i++) {
        schedule(() => setUserChars(i), 300 + i * 28);
      }

      const userDone = 300 + USER_MSG.length * 28 + 200;

      // Thinking
      schedule(() => setPhase("thinking"), userDone);

      // Reply streaming
      const replyStart = userDone + 600;
      schedule(() => setPhase("reply"), replyStart);
      for (let i = 1; i <= AI_REPLY.length; i++) {
        schedule(() => setReplyChars(i), replyStart + i * 22);
      }

      const replyDone = replyStart + AI_REPLY.length * 22 + 200;

      // Tool call
      schedule(() => setPhase("tool"), replyDone);

      // Done, hold, loop
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
        background: DH.surface,
        border: `1px solid ${DH.border}`,
        boxShadow: "0 18px 40px -16px rgba(0,0,0,0.6)",
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

      {/* AI thinking indicator */}
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

      {/* AI reply bubble (left-aligned) */}
      {(phase === "reply" || phase === "tool" || phase === "done") && (
        <div className="flex justify-start">
          <div
            className="text-[9px] leading-tight px-2 py-1.5 rounded-lg max-w-[90%]"
            style={{
              background: DH.surfaceHi,
              color: DH.text,
              border: `1px solid ${DH.border}`,
            }}
          >
            {AI_REPLY.slice(0, replyChars)}
            {phase === "reply" && replyChars < AI_REPLY.length && (
              <span
                className="inline-block w-[1px] h-[9px] ml-0.5 align-middle"
                style={{ background: DH.text }}
              />
            )}
          </div>
        </div>
      )}

      {/* Tool call chip */}
      {(phase === "tool" || phase === "done") && (
        <div
          className="flex items-center gap-1 px-2 py-1 rounded-md self-start"
          style={{
            background: "rgba(167,139,250,0.12)",
            border: `1px solid ${DH.aiPurple}55`,
            opacity: phase === "tool" ? 1 : 0.95,
            transition: "opacity 200ms",
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

      {/* Role strip */}
      <div
        className="mt-1 pt-1.5 flex items-center justify-between text-[7px] font-mono uppercase tracking-[0.14em]"
        style={{ borderTop: `1px solid ${DH.border}`, color: DH.muted }}
      >
        <span>designer · pm · dev</span>
        <span style={{ color: DH.aiGrammar }}>3.5 yrs</span>
      </div>
    </div>
  );
}

// ====================================================================
// FOCUS MODAL
// ====================================================================

type Tab = "story" | "chat" | "system" | "backend";

function DigitalHireFocus() {
  const [tab, setTab] = useState<Tab>("story");
  return (
    <div
      className="w-[min(1240px,96vw)] h-[min(780px,92vh)] grid grid-cols-[380px_1fr] overflow-hidden font-sans"
      style={{ background: DH.bg, color: DH.text }}
    >
      <Sidebar />
      <section className="flex flex-col overflow-hidden min-w-0">
        <TabBar tab={tab} setTab={setTab} />
        <div className="flex-1 overflow-hidden">
          {tab === "story" && <StoryTab />}
          {tab === "chat" && <ChatTab />}
          {tab === "system" && <SystemTab />}
          {tab === "backend" && <BackendTab />}
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
        background: DH.surface,
        borderColor: DH.border,
      }}
    >
      <div className="flex items-center gap-3">
        <DHMark size={48} />
        <div>
          <p className="font-semibold tracking-tight text-base leading-none text-white">
            DigitalHire
          </p>
          <p className="text-[10px] font-mono uppercase tracking-[0.22em] text-[#9ca3af] mt-1">
            2022 — now · recruitment saas
          </p>
        </div>
      </div>

      <p className="mt-5 text-[13px] leading-relaxed" style={{ color: DH.soft }}>
        The longest thread in my career so far. I came in as the sole
        product designer, rebuilt the product from scratch on the back of
        an in-house engineering team, ended up as PM because I was
        already the one nobody could go around, and eventually moved
        back into the code when the team needed it.
      </p>

      <div className="mt-6">
        <p className="text-[10px] font-mono uppercase tracking-[0.22em] text-[#9ca3af] mb-2">
          My roles, in the order they happened
        </p>
        <ul className="space-y-2 text-[13px]" style={{ color: DH.soft }}>
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
              style={{ background: DH.aiGrammar }}
            />
            Full-stack dev, picked up when it mattered
          </li>
        </ul>
      </div>

      <div className="mt-6">
        <p className="text-[10px] font-mono uppercase tracking-[0.22em] text-[#9ca3af] mb-2">
          Stack across the three surfaces
        </p>
        <div className="flex flex-wrap gap-1.5">
          {[
            "Flutter",
            "Next.js",
            "NestJS 11",
            "TypeORM",
            "MySQL",
            "BullMQ",
            "Redis",
            "OpenAI",
            "AWS ECS",
            "Stripe",
            "Firebase",
          ].map((s) => (
            <span
              key={s}
              className="text-[10px] px-2 py-0.5 rounded border"
              style={{
                borderColor: DH.border,
                background: DH.surfaceHi,
                color: DH.soft,
              }}
            >
              {s}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <p className="text-[10px] font-mono uppercase tracking-[0.22em] text-[#9ca3af] mb-2">
          Credits
        </p>
        <p className="text-[12px] leading-relaxed" style={{ color: DH.soft }}>
          <a
            href="https://github.com/mohsinraza-fdev"
            target="_blank"
            rel="noreferrer"
            className="underline decoration-dotted hover:text-white"
          >
            Mohsin Raza
          </a>{" "}
          on frontend, especially the chat client.{" "}
          <a
            href="https://github.com/ishaquehassan"
            target="_blank"
            rel="noreferrer"
            className="underline decoration-dotted hover:text-white"
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
          background: "rgba(167,139,250,0.1)",
          color: DH.soft,
          border: `1px solid ${DH.aiPurple}33`,
        }}
      >
        Next beat: a new AI agent layer across the platform. Can&apos;t
        show it yet, but it&apos;s the reason my evenings look like this.
      </div>

      <div className="mt-6 space-y-2">
        <a
          href="https://www.figma.com/design/8x94SC1c5SvGyjP6DKdP4p/Updated"
          target="_blank"
          rel="noreferrer"
          className="group flex items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          style={{
            background: `linear-gradient(135deg, ${DH.primary} 0%, ${DH.aiPurple} 100%)`,
            boxShadow: "0 8px 24px -8px rgba(99,102,241,0.5)",
          }}
        >
          <span className="flex items-center gap-2">
            <span
              className="h-1.5 w-1.5 rounded-full bg-white animate-pulse"
              aria-hidden
            />
            View the Figma file
          </span>
          <span className="transition-transform group-hover:translate-x-1">
            →
          </span>
        </a>
        <a
          href="https://digitalhire.com"
          target="_blank"
          rel="noreferrer"
          className="group flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium transition-colors"
          style={{
            background: DH.surfaceHi,
            border: `1px solid ${DH.border}`,
            color: DH.text,
          }}
        >
          <span>Visit digitalhire.com</span>
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
    { id: "story", label: "Story" },
    { id: "chat", label: "The chat rewrite" },
    { id: "system", label: "Design system" },
    { id: "backend", label: "Backend migration" },
  ];
  return (
    <nav
      className="h-14 flex items-center pl-7 pr-24 gap-1 shrink-0 border-b"
      style={{ borderColor: DH.border, background: DH.surface }}
    >
      {items.map((item) => {
        const active = tab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setTab(item.id)}
            className={cn(
              "relative h-14 px-4 text-sm font-medium transition-colors",
              active ? "text-white" : "text-[#9ca3af] hover:text-white",
            )}
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
// STORY TAB
// ====================================================================

const BEATS = [
  {
    year: "2022",
    label: "The rebuild",
    title:
      "Sole designer. Redesigned every surface from scratch. Shipped web and mobile in parallel.",
    copy: "DigitalHire had been outsourced before I arrived. The product worked, in the way old outsourced products work. The company made the call to build an in-house engineering team and re-platform everything. I was the first designer. A consultant was kept on standby. He was never needed. I ran stakeholder discovery, built the design system on day one so handoff stayed fast, and kept the design developer-friendly because I still thought like one.",
    color: "#6366f1",
  },
  {
    year: "2023",
    label: "The AI shift",
    title:
      "Forms to chat. The whole product paradigm changed and I designed the new one.",
    copy: "The old flow was a form. Fill in a job, AI generates a post. Fill in an interview, AI generates questions. When chat-first AI became the expectation, the whole pattern had to flip. Conversations instead of forms. Personas instead of branching UIs. I took the redesign end-to-end while still shipping the existing app.",
    color: "#a78bfa",
  },
  {
    year: "2024",
    label: "Became PM",
    title:
      "A title I never asked for. People kept coming to me because I knew the product better than anyone.",
    copy: "I designed it, communicated every change, talked to every stakeholder, sat in every review. At some point the company formalized what was already true and gave me the PM title. Still the only designer. Now also the one writing the specs and running the sprint.",
    color: "#22d3ee",
  },
  {
    year: "2025",
    label: "The dev pivot",
    title:
      "Design was done, engineering was stuck. I picked up the code.",
    copy: "The chat rewrite was blocked. The old service was overengineered with layers that the business did not need. Ishaque pushed me to own it. Mohsin took the client. I rebuilt the service on NestJS with a stack matched to the requirements, not to a buzzword. Daily internal testing. We shipped on time. The President called it the smoothest launch DigitalHire has ever had. I have been in the codebase since.",
    color: "#34d399",
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
        <h3 className="mt-1 text-2xl font-semibold tracking-tight text-white">
          The same job turned into three jobs. None of them by plan.
        </h3>
        <p
          className="mt-2 text-sm leading-relaxed max-w-[680px]"
          style={{ color: DH.soft }}
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
                <p className="text-lg font-semibold tracking-tight text-white leading-snug">
                  {b.title}
                </p>
                <p
                  className="mt-2 text-sm leading-relaxed"
                  style={{ color: DH.soft }}
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
            background: "rgba(52,211,153,0.08)",
            border: `1px solid ${DH.success}33`,
          }}
        >
          <p
            className="text-[10px] font-mono uppercase tracking-[0.22em] mb-2"
            style={{ color: DH.success }}
          >
            Stakeholder note
          </p>
          <p className="text-lg font-serif italic text-white leading-relaxed">
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
                background: DH.surface,
                border: `1px solid ${DH.border}`,
              }}
            >
              <p
                className="text-[9px] font-mono uppercase tracking-[0.22em]"
                style={{ color: DH.muted }}
              >
                {s.k}
              </p>
              <p className="mt-1 text-base font-semibold text-white">
                {s.v}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ====================================================================
// CHAT TAB — the engineering case study
// ====================================================================

// Keyword router fixture — a tiny slice of the real 37-pattern set, so
// the demo feels honest without shipping the production regex.
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
      <div className="max-w-[940px] mx-auto px-10 py-12">
        <p
          className="text-[11px] font-mono uppercase tracking-[0.22em]"
          style={{ color: DH.aiPurple }}
        >
          The rewrite that made the simpler thing win
        </p>
        <h3 className="mt-1 text-2xl font-semibold tracking-tight text-white">
          We removed more than we added. That was the whole point.
        </h3>
        <p
          className="mt-2 text-sm leading-relaxed max-w-[720px]"
          style={{ color: DH.soft }}
        >
          The previous chat service ran on direct AI APIs wrapped in
          LangChain, LangGraph, and a RAG layer. The business did not
          need any of it. I rewrote the service on NestJS with a stack
          tuned to what chat actually does in this product.
        </p>

        <div className="mt-8 grid grid-cols-2 gap-4">
          <div
            className="rounded-2xl p-5"
            style={{
              background: DH.surface,
              border: `1px solid ${DH.border}`,
            }}
          >
            <p
              className="text-[10px] font-mono uppercase tracking-[0.22em] mb-3"
              style={{ color: "#f87171" }}
            >
              Removed
            </p>
            <ul className="space-y-1.5 text-sm" style={{ color: DH.soft }}>
              {[
                "LangChain",
                "LangGraph",
                "RAG pipeline",
                "Vector database",
                "Embedding store",
                "Agentic loops",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <span
                    className="text-[#f87171] text-[13px] font-mono"
                    style={{ textDecorationLine: "line-through" }}
                  >
                    ×
                  </span>
                  <span
                    style={{
                      textDecoration: "line-through",
                      textDecorationColor: "#f8717188",
                    }}
                  >
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div
            className="rounded-2xl p-5"
            style={{
              background: DH.surface,
              border: `1px solid ${DH.border}`,
            }}
          >
            <p
              className="text-[10px] font-mono uppercase tracking-[0.22em] mb-3"
              style={{ color: DH.success }}
            >
              Kept, built, tuned
            </p>
            <ul className="space-y-1.5 text-sm" style={{ color: DH.soft }}>
              <li>Direct OpenAI SDK, 350-line wrapper</li>
              <li>Keyword-first router (37 regex patterns)</li>
              <li>26KB system prompt, 3 personas</li>
              <li>5 native function-calling tools</li>
              <li>SSE streaming with backpressure tweaks</li>
              <li>Hardcoded nudges for vague prompts</li>
            </ul>
          </div>
        </div>

        {/* Interactive router demo */}
        <div
          className="mt-8 rounded-2xl overflow-hidden"
          style={{
            background: DH.surface,
            border: `1px solid ${DH.border}`,
          }}
        >
          <div className="p-5">
            <p
              className="text-[10px] font-mono uppercase tracking-[0.22em] mb-3"
              style={{ color: DH.aiPurple }}
            >
              The keyword-first path, live
            </p>
            <p className="text-sm mb-4" style={{ color: DH.soft }}>
              Type anything a user might. If the keyword router matches
              before the LLM gets involved, that request never costs us
              a token.
            </p>

            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message..."
              className="w-full rounded-lg px-4 py-3 text-sm font-mono outline-none"
              style={{
                background: DH.bg,
                border: `1px solid ${DH.border}`,
                color: DH.text,
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
                    ? "no tokens spent"
                    : "gpt-4o-mini · 1 call"
                }
                state={decision.kind === "match" ? "done" : "pending"}
              />
            </div>
          </div>

          <div
            className="px-5 py-3 text-xs font-mono flex items-center justify-between"
            style={{
              background: DH.bg,
              borderTop: `1px solid ${DH.border}`,
              color: DH.muted,
            }}
          >
            <span>modules/agent/agent.service.ts</span>
            <span>
              {decision.kind === "match"
                ? `persona: ${decision.target}`
                : "persona: UNKNOWN"}
            </span>
          </div>
        </div>

        <p
          className="mt-6 text-xs font-mono"
          style={{ color: DH.muted }}
        >
          71 files · ~9,900 LOC · 4,148 lines of tests · 13 HTTP endpoints
          · no queues, no Redis, no background jobs
        </p>
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
        background: DH.surfaceHi,
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
          style={{ color: state === "skipped" ? DH.muted : DH.text }}
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
// SYSTEM TAB — design system + mobile
// ====================================================================

const TOKENS: { name: string; color: string }[] = [
  { name: "primary", color: "#6366f1" },
  { name: "aiPurple", color: "#a78bfa" },
  { name: "aiGrammar", color: "#22d3ee" },
  { name: "workplaceType", color: "#fbbf24" },
  { name: "jobType", color: "#60a5fa" },
  { name: "experienceLevel", color: "#f472b6" },
  { name: "compensation", color: "#34d399" },
  { name: "education", color: "#c084fc" },
  { name: "critical", color: "#f87171" },
  { name: "success", color: "#34d399" },
  { name: "warning", color: "#fbbf24" },
  { name: "borderAiCritical", color: "#ef4444" },
];

function SystemTab() {
  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-[940px] mx-auto px-10 py-12">
        <p
          className="text-[11px] font-mono uppercase tracking-[0.22em]"
          style={{ color: DH.aiPurple }}
        >
          Design system, early decision, long payoff
        </p>
        <h3 className="mt-1 text-2xl font-semibold tracking-tight text-white">
          One system, three surfaces, one designer.
        </h3>
        <p
          className="mt-2 text-sm leading-relaxed max-w-[720px]"
          style={{ color: DH.soft }}
        >
          The web, the iOS app, and the Android app all draw from the
          same tokens. Setting this up on day one meant every new
          feature two years later was still a small design job, not a
          redesign.
        </p>

        <div className="mt-8">
          <p
            className="text-[10px] font-mono uppercase tracking-[0.22em] mb-3"
            style={{ color: DH.muted }}
          >
            Semantic tokens · a slice of 200+
          </p>
          <div className="grid grid-cols-4 gap-3">
            {TOKENS.map((t) => (
              <div
                key={t.name}
                className="rounded-lg p-3 flex items-center gap-3"
                style={{
                  background: DH.surface,
                  border: `1px solid ${DH.border}`,
                }}
              >
                <span
                  className="h-8 w-8 rounded-md shrink-0"
                  style={{
                    background: t.color,
                    boxShadow: `0 4px 12px -4px ${t.color}`,
                  }}
                />
                <span
                  className="text-[11px] font-mono truncate"
                  style={{ color: DH.soft }}
                >
                  {t.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 grid grid-cols-3 gap-4">
          {[
            {
              surface: "Web",
              stack: "Next.js + Tailwind",
              detail: "Marketing, recruiter dashboard, admin.",
            },
            {
              surface: "iOS · Android",
              stack: "Flutter 3.38 · Stacked MVVM",
              detail:
                "Candidate + employer app. Dev and prod flavors. 80+ named routes. Chat module plugs into the new service.",
            },
            {
              surface: "Backend",
              stack: "NestJS 11 · TypeORM · MySQL",
              detail:
                "Modular monolith. 13 feature modules. BullMQ for async work.",
            },
          ].map((s) => (
            <div
              key={s.surface}
              className="rounded-2xl p-5"
              style={{
                background: DH.surface,
                border: `1px solid ${DH.border}`,
              }}
            >
              <p
                className="text-[10px] font-mono uppercase tracking-[0.22em] mb-1"
                style={{ color: DH.aiPurple }}
              >
                {s.surface}
              </p>
              <p className="text-sm font-semibold text-white mb-2">
                {s.stack}
              </p>
              <p className="text-xs leading-relaxed" style={{ color: DH.soft }}>
                {s.detail}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-8 grid grid-cols-5 gap-3">
          {[
            { k: "Dart files", v: "2,503" },
            { k: "Lines of code", v: "246k" },
            { k: "Feature modules", v: "17" },
            { k: "Named routes", v: "80+" },
            { k: "Test files", v: "171" },
          ].map((s) => (
            <div
              key={s.k}
              className="rounded-xl p-3"
              style={{
                background: DH.surfaceHi,
                border: `1px solid ${DH.border}`,
              }}
            >
              <p
                className="text-[9px] font-mono uppercase tracking-[0.22em]"
                style={{ color: DH.muted }}
              >
                {s.k}
              </p>
              <p className="mt-1 text-sm font-semibold text-white">{s.v}</p>
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
// BACKEND TAB — migration
// ====================================================================

const MODULES = [
  { name: "recruitment", note: "jobs, interviews, screening · 41 entities" },
  { name: "applicant", note: "profiles, resumes" },
  { name: "company", note: "org, teams, members" },
  { name: "media", note: "CloudFront-signed video + files" },
  { name: "subscription", note: "Stripe billing, plans, coupons" },
  { name: "notification", note: "push · email · SMS · Slack" },
  { name: "integrations", note: "Postmark, Stripe, external APIs" },
  { name: "audit", note: "request log + audit trail" },
  { name: "chat-agent", note: "thin HTTP proxy, brain is elsewhere" },
  { name: "aggregator-bff", note: "BFF layer for the apps" },
  { name: "content", note: "SEO, sitemap, static pages" },
  { name: "auth", note: "RS512 JWT, token blacklist, permissions" },
  { name: "health", note: "readiness + liveness, separate port" },
];

function BackendTab() {
  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-[940px] mx-auto px-10 py-12">
        <p
          className="text-[11px] font-mono uppercase tracking-[0.22em]"
          style={{ color: DH.aiPurple }}
        >
          The quiet work, still in flight
        </p>
        <h3 className="mt-1 text-2xl font-semibold tracking-tight text-white">
          Migrating a 3-year-old monolith into a cleaner monolith.
        </h3>
        <p
          className="mt-2 text-sm leading-relaxed max-w-[720px]"
          style={{ color: DH.soft }}
        >
          The old backend had grown the way old backends grow. I am
          rebuilding it on NestJS with a modular monolith layout. Same
          product, same database, new bones. The goal is not novelty.
          It is making the next three years of features cheaper to ship.
        </p>

        <div className="mt-8">
          <p
            className="text-[10px] font-mono uppercase tracking-[0.22em] mb-3"
            style={{ color: DH.muted }}
          >
            13 feature modules
          </p>
          <div className="grid grid-cols-2 gap-3">
            {MODULES.map((m, i) => (
              <div
                key={m.name}
                className="rounded-lg p-3 flex items-center gap-3"
                style={{
                  background: DH.surface,
                  border: `1px solid ${DH.border}`,
                }}
              >
                <span
                  className="text-[10px] font-mono"
                  style={{ color: DH.muted }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-white">
                    {m.name}
                  </p>
                  <p
                    className="text-[11px] truncate"
                    style={{ color: DH.soft }}
                  >
                    {m.note}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8">
          <p
            className="text-[10px] font-mono uppercase tracking-[0.22em] mb-3"
            style={{ color: DH.muted }}
          >
            Infra choices
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
              "RS512 JWT + token blacklist",
              "Health port 8081",
              "Request ID + audit subscriber",
            ].map((x) => (
              <span
                key={x}
                className="text-[11px] px-2.5 py-1 rounded-md"
                style={{
                  background: DH.surfaceHi,
                  border: `1px solid ${DH.border}`,
                  color: DH.soft,
                }}
              >
                {x}
              </span>
            ))}
          </div>
        </div>

        <div
          className="mt-8 rounded-2xl p-5"
          style={{
            background: "rgba(99,102,241,0.08)",
            border: `1px solid ${DH.primary}44`,
          }}
        >
          <p
            className="text-[10px] font-mono uppercase tracking-[0.22em] mb-2"
            style={{ color: DH.primary }}
          >
            The chat-agent module, in full
          </p>
          <pre
            className="text-[12px] leading-relaxed font-mono rounded-lg p-3 overflow-x-auto"
            style={{
              background: DH.bg,
              color: DH.soft,
              border: `1px solid ${DH.border}`,
            }}
          >
            {`// modules/chat-agent/chat-agent.service.ts
forward(path, body, headers) {
  return this.http.post(
    \`\${env.SVC_CHAT_URL}\${path}\`,
    body,
    { headers },
  );
}`}
          </pre>
          <p className="mt-3 text-xs" style={{ color: DH.soft }}>
            The chat brain lives in its own service. From this backend&apos;s
            point of view, chat is a proxy and nothing more. That
            boundary is the whole reason the chat rewrite was cheap.
          </p>
        </div>

        <div className="mt-6 grid grid-cols-4 gap-3">
          {[
            { k: "TS files", v: "469" },
            { k: "LOC", v: "~59k" },
            { k: "TypeORM entities", v: "84" },
            { k: "Unit tests", v: "111" },
          ].map((s) => (
            <div
              key={s.k}
              className="rounded-xl p-3"
              style={{
                background: DH.surface,
                border: `1px solid ${DH.border}`,
              }}
            >
              <p
                className="text-[9px] font-mono uppercase tracking-[0.22em]"
                style={{ color: DH.muted }}
              >
                {s.k}
              </p>
              <p className="mt-1 text-sm font-semibold text-white">{s.v}</p>
            </div>
          ))}
        </div>

        <p
          className="mt-6 text-xs font-mono"
          style={{ color: DH.muted }}
        >
          In-flight · daily commits · daily reviews with the team
        </p>
      </div>
    </div>
  );
}
