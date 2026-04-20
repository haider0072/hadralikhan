"use client";

import { useEffect, useRef, useState } from "react";
import type { CardActivity } from "../use-card-activity";
import { ProjectFrame } from "../project-frame";
import { FocusModal } from "../focus-modal";
import { GithubLogo } from "../tool-logos";
import { cn } from "@/lib/cn";

// Gris-inspired palette
const FC = {
  bg: "#f4e8dd",
  surface: "#ecdccb",
  surfaceHi: "#e2cfb9",
  border: "#c8b5a0",
  ink: "#2a1f2e",
  inkSoft: "#4a3d4c",
  muted: "#7a6e77",
  violet: "#8b7bb5",
  rose: "#d9a39e",
  sky: "#7ba8c4",
  tan: "#c4b8a0",
  sage: "#a3b09a",
  gold: "#d4b87a",
};

export function FlowCraftPrototype({ activity }: { activity: CardActivity }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <FlowCraftPeek activity={activity} onOpen={() => setOpen(true)} />
      <FocusModal
        open={open}
        onClose={() => setOpen(false)}
        projectKey="FlowCraft"
      >
        <FlowCraftFocus />
      </FocusModal>
    </>
  );
}

// ====================================================================
// PEEK
// ====================================================================

function FlowCraftPeek({
  activity,
  onOpen,
}: {
  activity: CardActivity;
  onOpen: () => void;
}) {
  return (
    <ProjectFrame
      meta={{
        year: "2026",
        title: "FlowCraft",
        tagline:
          "Started as a sprite-sheet tool for a game I was making. Became a whole creative platform.",
      }}
      innerClassName="bg-[#f4e8dd]"
      onOpen={onOpen}
      tape="top-left"
    >
      {/* Gris-style gradient wash */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 30% 40%, rgba(139,123,181,0.25) 0%, transparent 60%), radial-gradient(ellipse at 80% 70%, rgba(217,163,158,0.25) 0%, transparent 60%)",
          }}
        />
      </div>

      <div className="relative h-full flex items-center justify-center px-3">
        <SpriteStage animated={activity === "active"} />
      </div>

      <div className="absolute top-4 left-4 right-4 flex items-start justify-between">
        <div className="flex items-center gap-2">
          <FlowCraftMark size={28} />
          <div>
            <p className="text-[11px] font-semibold text-[#2a1f2e] leading-none">
              FlowCraft
            </p>
            <p className="text-[9px] text-[#7a6e77] mt-0.5">
              sprites · nodes · video
            </p>
          </div>
        </div>
        <span
          className="text-[9px] font-mono uppercase tracking-[0.18em] px-2 py-1 rounded-full"
          style={{
            background: "rgba(42,31,46,0.08)",
            color: "#4a3d4c",
            border: `1px solid ${FC.border}`,
          }}
        >
          3 nights
        </span>
      </div>
    </ProjectFrame>
  );
}

function FlowCraftMark({ size = 32 }: { size?: number }) {
  return (
    <div
      className="rounded-lg overflow-hidden relative"
      style={{
        width: size,
        height: size,
        background: `linear-gradient(135deg, ${FC.violet} 0%, ${FC.rose} 50%, ${FC.gold} 100%)`,
        boxShadow: "0 4px 12px -4px rgba(42,31,46,0.2)",
      }}
    >
      <svg
        viewBox="0 0 32 32"
        width={size}
        height={size}
        className="absolute inset-0"
      >
        <path
          d="M 8 10 L 16 6 L 24 10 L 24 22 L 16 26 L 8 22 Z"
          fill="none"
          stroke="#fff"
          strokeWidth="1.5"
          opacity="0.9"
        />
        <circle cx="16" cy="16" r="2.5" fill="#fff" opacity="0.95" />
      </svg>
    </div>
  );
}

// ---------- Peek stage: sprite sheet filling in ----------

type PoseKind = "t" | "walk" | "run" | "jump" | "attack";

const POSE_SEQUENCE: { key: PoseKind; label: string }[] = [
  { key: "t", label: "t-pose" },
  { key: "walk", label: "walk" },
  { key: "run", label: "run" },
  { key: "jump", label: "jump" },
];

function SpriteStage({ animated }: { animated: boolean }) {
  // how many poses have been "generated"
  const [revealed, setRevealed] = useState(0);
  const [generating, setGenerating] = useState<number | null>(null);
  const [credits, setCredits] = useState(42);

  useEffect(() => {
    if (!animated) return;
    const timers: ReturnType<typeof setTimeout>[] = [];
    let alive = true;

    const run = () => {
      setRevealed(0);
      setCredits(42);
      setGenerating(0);

      POSE_SEQUENCE.forEach((_, i) => {
        // start generating
        timers.push(
          setTimeout(() => {
            if (!alive) return;
            setGenerating(i);
          }, i * 900),
        );
        // finish generating
        timers.push(
          setTimeout(
            () => {
              if (!alive) return;
              setRevealed(i + 1);
              setCredits((c) => Math.max(0, c - 10));
              if (i === POSE_SEQUENCE.length - 1) setGenerating(null);
            },
            i * 900 + 700,
          ),
        );
      });

      timers.push(
        setTimeout(() => {
          if (!alive) return;
          run();
        }, POSE_SEQUENCE.length * 900 + 1800),
      );
    };

    run();
    return () => {
      alive = false;
      timers.forEach(clearTimeout);
    };
  }, [animated]);

  return (
    <div className="relative flex flex-col items-center gap-2">
      <div className="flex items-end gap-2">
        {POSE_SEQUENCE.map((pose, i) => {
          const isRevealed = i < revealed;
          const isGenerating = generating === i && !isRevealed;
          return (
            <div key={pose.key} className="flex flex-col items-center gap-1">
              <PoseFrame
                pose={pose.key}
                state={
                  isRevealed ? "done" : isGenerating ? "generating" : "pending"
                }
                size={48}
              />
              <span
                className={cn(
                  "text-[7px] font-mono uppercase tracking-[0.14em]",
                  isRevealed ? "text-[#2a1f2e]" : "text-[#7a6e77]",
                )}
              >
                {pose.label}
              </span>
            </div>
          );
        })}
      </div>

      <div
        className="flex items-center gap-1.5 px-2 py-0.5 rounded-full backdrop-blur"
        style={{
          background: "rgba(42,31,46,0.08)",
          border: `1px solid ${FC.border}`,
        }}
      >
        <span
          className="h-1.5 w-1.5 rounded-full"
          style={{
            background: credits === 0 ? FC.rose : FC.sage,
            boxShadow: credits === 0 ? `0 0 6px ${FC.rose}` : undefined,
          }}
        />
        <span className="text-[8px] font-mono tracking-[0.1em] text-[#4a3d4c]">
          {credits > 0 ? `${credits} cr` : "paused"}
        </span>
      </div>
    </div>
  );
}

function PoseFrame({
  pose,
  state,
  size,
}: {
  pose: PoseKind;
  state: "pending" | "generating" | "done";
  size: number;
}) {
  return (
    <div
      className="relative rounded-md overflow-hidden transition-all duration-300"
      style={{
        width: size,
        height: Math.round(size * 1.4),
        background:
          state === "pending"
            ? "rgba(42,31,46,0.04)"
            : `linear-gradient(180deg, ${FC.sky}33 0%, ${FC.violet}55 60%, ${FC.ink}88 100%)`,
        border:
          state === "pending"
            ? `1px dashed ${FC.border}`
            : `1px solid ${FC.border}`,
        boxShadow:
          state === "generating"
            ? `0 0 12px ${FC.gold}, 0 0 0 1px ${FC.gold}88`
            : state === "done"
              ? "0 4px 10px -4px rgba(42,31,46,0.25)"
              : undefined,
      }}
    >
      {state === "done" && <CharacterPose pose={pose} />}
      {state === "generating" && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            className="h-2 w-2 rounded-full animate-pulse"
            style={{ background: FC.gold }}
          />
        </div>
      )}
    </div>
  );
}

function CharacterPose({
  pose,
  flipped,
}: {
  pose: PoseKind;
  flipped?: boolean;
}) {
  const headColor = "#2a1f2e";
  const limbColor = "#2a1f2e";
  const capeColor = "#8b7bb5";

  return (
    <svg
      viewBox="0 0 80 120"
      className="absolute inset-0 w-full h-full"
      preserveAspectRatio="xMidYMax meet"
      style={flipped ? { transform: "scaleX(-1)" } : undefined}
      aria-hidden
    >
      {pose === "t" && (
        <>
          {/* cape behind body */}
          <path
            d="M 30 32 Q 24 70 22 104 L 58 104 Q 56 70 50 32 Z"
            fill={capeColor}
            opacity="0.5"
          />
          {/* torso */}
          <rect x="34" y="28" width="12" height="36" rx="2" fill={limbColor} />
          {/* head + hood */}
          <circle cx="40" cy="18" r="10" fill={headColor} />
          <path
            d="M 30 20 Q 30 8 40 8 Q 50 8 50 20 L 50 26 L 30 26 Z"
            fill={headColor}
          />
          {/* arms stretched out */}
          <rect x="10" y="31" width="24" height="5" rx="2.5" fill={limbColor} />
          <rect x="46" y="31" width="24" height="5" rx="2.5" fill={limbColor} />
          <circle cx="11" cy="33.5" r="3.5" fill={limbColor} />
          <circle cx="69" cy="33.5" r="3.5" fill={limbColor} />
          {/* legs */}
          <rect x="33" y="64" width="6" height="42" rx="2" fill={limbColor} />
          <rect x="41" y="64" width="6" height="42" rx="2" fill={limbColor} />
        </>
      )}

      {pose === "walk" && (
        <>
          <path
            d="M 32 32 Q 26 68 26 100 L 54 100 Q 54 68 48 32 Z"
            fill={capeColor}
            opacity="0.5"
          />
          <rect x="34" y="28" width="12" height="36" rx="2" fill={limbColor} />
          <circle cx="40" cy="18" r="10" fill={headColor} />
          <path
            d="M 30 20 Q 30 8 40 8 Q 50 8 50 20 L 50 26 L 30 26 Z"
            fill={headColor}
          />
          {/* left arm swinging forward */}
          <path
            d="M 38 33 Q 30 45 26 56"
            stroke={limbColor}
            strokeWidth="6"
            strokeLinecap="round"
            fill="none"
          />
          {/* right arm back */}
          <path
            d="M 42 33 Q 50 45 54 56"
            stroke={limbColor}
            strokeWidth="6"
            strokeLinecap="round"
            fill="none"
          />
          {/* left leg forward (bent knee) */}
          <path
            d="M 38 64 Q 30 82 26 104"
            stroke={limbColor}
            strokeWidth="7"
            strokeLinecap="round"
            fill="none"
          />
          {/* right leg back (pushing off) */}
          <path
            d="M 42 64 Q 50 82 54 104"
            stroke={limbColor}
            strokeWidth="7"
            strokeLinecap="round"
            fill="none"
          />
        </>
      )}

      {pose === "run" && (
        <>
          {/* cape flowing back */}
          <path
            d="M 34 34 Q 20 60 8 82 L 22 86 Q 40 66 46 38 Z"
            fill={capeColor}
            opacity="0.55"
          />
          {/* torso leaning forward */}
          <path
            d="M 36 28 L 48 28 L 46 66 L 34 66 Z"
            fill={limbColor}
          />
          {/* head forward */}
          <circle cx="46" cy="18" r="10" fill={headColor} />
          <path
            d="M 36 20 Q 36 8 46 8 Q 56 8 56 20 L 56 26 L 36 26 Z"
            fill={headColor}
          />
          {/* front arm bent forward */}
          <path
            d="M 44 33 Q 58 40 62 52"
            stroke={limbColor}
            strokeWidth="6"
            strokeLinecap="round"
            fill="none"
          />
          {/* back arm bent behind */}
          <path
            d="M 40 33 Q 30 38 22 46"
            stroke={limbColor}
            strokeWidth="6"
            strokeLinecap="round"
            fill="none"
          />
          {/* front leg reaching */}
          <path
            d="M 42 66 Q 56 78 60 96"
            stroke={limbColor}
            strokeWidth="7"
            strokeLinecap="round"
            fill="none"
          />
          {/* back leg kicking up */}
          <path
            d="M 38 66 Q 22 74 10 78"
            stroke={limbColor}
            strokeWidth="7"
            strokeLinecap="round"
            fill="none"
          />
        </>
      )}

      {pose === "jump" && (
        <>
          {/* cape flaring up behind */}
          <path
            d="M 28 34 Q 16 56 14 80 L 30 78 Q 36 60 38 38 Z"
            fill={capeColor}
            opacity="0.5"
          />
          <path
            d="M 50 34 Q 62 56 64 80 L 48 78 Q 44 60 44 38 Z"
            fill={capeColor}
            opacity="0.4"
          />
          {/* torso */}
          <rect x="34" y="28" width="12" height="30" rx="2" fill={limbColor} />
          {/* head */}
          <circle cx="40" cy="18" r="10" fill={headColor} />
          <path
            d="M 30 20 Q 30 8 40 8 Q 50 8 50 20 L 50 26 L 30 26 Z"
            fill={headColor}
          />
          {/* arms up and out */}
          <path
            d="M 38 31 Q 26 20 20 12"
            stroke={limbColor}
            strokeWidth="6"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M 42 31 Q 54 20 60 12"
            stroke={limbColor}
            strokeWidth="6"
            strokeLinecap="round"
            fill="none"
          />
          {/* knees tucked (bent legs) */}
          <path
            d="M 36 58 Q 28 72 34 88"
            stroke={limbColor}
            strokeWidth="7"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M 44 58 Q 52 72 46 88"
            stroke={limbColor}
            strokeWidth="7"
            strokeLinecap="round"
            fill="none"
          />
        </>
      )}

      {pose === "attack" && (
        <>
          {/* cape flaring back */}
          <path
            d="M 32 32 Q 20 60 14 88 L 28 90 Q 38 64 42 36 Z"
            fill={capeColor}
            opacity="0.5"
          />
          {/* torso leaning forward into strike */}
          <path
            d="M 34 28 L 46 28 L 44 64 L 32 64 Z"
            fill={limbColor}
          />
          {/* head forward */}
          <circle cx="42" cy="18" r="10" fill={headColor} />
          <path
            d="M 32 20 Q 32 8 42 8 Q 52 8 52 20 L 52 26 L 32 26 Z"
            fill={headColor}
          />
          {/* front arm fully extended into punch */}
          <path
            d="M 42 32 Q 54 32 68 36"
            stroke={limbColor}
            strokeWidth="6"
            strokeLinecap="round"
            fill="none"
          />
          <circle cx="70" cy="36" r="4.5" fill={limbColor} />
          {/* back arm bent for balance */}
          <path
            d="M 36 33 Q 26 40 22 52"
            stroke={limbColor}
            strokeWidth="6"
            strokeLinecap="round"
            fill="none"
          />
          {/* front lunging leg */}
          <path
            d="M 40 64 Q 50 82 58 104"
            stroke={limbColor}
            strokeWidth="7"
            strokeLinecap="round"
            fill="none"
          />
          {/* back leg planted, slight bend */}
          <path
            d="M 34 64 Q 26 84 22 104"
            stroke={limbColor}
            strokeWidth="7"
            strokeLinecap="round"
            fill="none"
          />
        </>
      )}
    </svg>
  );
}

function GrisSilhouette() {
  // Gris-inspired character — long hair, flowing cape, no visible face
  return (
    <svg
      viewBox="0 0 100 150"
      className="absolute inset-0 w-full h-full"
      preserveAspectRatio="xMidYMax meet"
      aria-hidden
    >
      <defs>
        <linearGradient id="fc-cape" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f4e8dd" stopOpacity="0.95" />
          <stop offset="60%" stopColor="#e8d8c7" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#c4b8a0" stopOpacity="0.75" />
        </linearGradient>
        <linearGradient id="fc-hair" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1a1420" />
          <stop offset="100%" stopColor="#2a1f2e" />
        </linearGradient>
      </defs>

      {/* Long hair cascading behind shoulders */}
      <path
        d="M 36 38 Q 30 60 32 90 L 44 88 L 44 40 Z"
        fill="url(#fc-hair)"
      />
      <path
        d="M 64 38 Q 70 60 68 90 L 56 88 L 56 40 Z"
        fill="url(#fc-hair)"
      />

      {/* Cape/dress — flowing, widest at floor */}
      <path
        d="M 40 58 L 60 58 Q 66 78 72 110 Q 78 138 80 148 L 20 148 Q 22 138 28 110 Q 34 78 40 58 Z"
        fill="url(#fc-cape)"
      />

      {/* Cape highlight (soft light from the left) */}
      <path
        d="M 40 58 L 50 58 Q 48 90 42 120 L 32 135 Q 34 100 40 58 Z"
        fill="#ffffff"
        opacity="0.18"
      />

      {/* Shadow at hem */}
      <path
        d="M 22 140 Q 50 148 78 140 L 80 148 L 20 148 Z"
        fill="#2a1f2e"
        opacity="0.35"
      />

      {/* Head — small, with hood */}
      <path
        d="M 38 30 Q 38 18 50 18 Q 62 18 62 30 L 62 42 Q 50 46 38 42 Z"
        fill="url(#fc-hair)"
      />

      {/* Hood shadow across face */}
      <path
        d="M 40 30 Q 50 34 60 30 L 60 40 Q 50 44 40 40 Z"
        fill="#000"
        opacity="0.55"
      />

      {/* Shoulder seam */}
      <path
        d="M 40 58 Q 50 62 60 58 L 58 62 Q 50 65 42 62 Z"
        fill="#2a1f2e"
        opacity="0.25"
      />
    </svg>
  );
}

// ====================================================================
// FOCUS MODAL
// ====================================================================

type Tab = "sprite" | "graph" | "story";

function FlowCraftFocus() {
  const [tab, setTab] = useState<Tab>("sprite");
  return (
    <div
      className="w-[min(1200px,96vw)] h-[min(760px,92vh)] grid grid-cols-[360px_1fr] overflow-hidden font-sans"
      style={{ background: FC.bg, color: FC.ink }}
    >
      <Sidebar />
      <section className="flex flex-col overflow-hidden min-w-0">
        <TabBar tab={tab} setTab={setTab} />
        <div className="flex-1 overflow-hidden">
          {tab === "sprite" && <SpriteTab />}
          {tab === "graph" && <GraphTab />}
          {tab === "story" && <StoryTab />}
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
        background: FC.surface,
        borderColor: FC.border,
      }}
    >
      <div className="flex items-center gap-3">
        <FlowCraftMark size={48} />
        <div>
          <p className="font-semibold tracking-tight text-base leading-none text-[#2a1f2e]">
            FlowCraft
          </p>
          <p className="text-[10px] font-mono uppercase tracking-[0.22em] text-[#7a6e77] mt-1">
            2026 · Creative platform
          </p>
        </div>
      </div>

      <p className="mt-5 text-[13px] leading-relaxed text-[#4a3d4c]">
        I was making a Gris-inspired platformer and kept hitting the
        same wall: no good tool existed to generate consistent
        character sprites for mobile-feel 2D games. I built one. Three
        nights later, the tool had grown into a full workflow platform
        with a node editor, batch runs, and video.
      </p>

      <div className="mt-6">
        <p className="text-[10px] font-mono uppercase tracking-[0.22em] text-[#7a6e77] mb-2">
          My role
        </p>
        <p className="text-[13px] leading-relaxed text-[#4a3d4c]">
          Solo. Pipeline design, node editor, OpenRouter gateway,
          Supabase schema, R2 storage, the whole thing. Ported the
          sprite core from an older CLI project (stripes-generator)
          and wrapped it in a web interface a non-engineer can use.
        </p>
      </div>

      <div className="mt-6">
        <p className="text-[10px] font-mono uppercase tracking-[0.22em] text-[#7a6e77] mb-2">
          Stack
        </p>
        <div className="flex flex-wrap gap-1.5">
          {[
            "Next.js 15",
            "React Flow",
            "Fabric.js",
            "Remotion",
            "OpenRouter",
            "Supabase",
            "R2",
            "Sharp",
            "Replicate",
          ].map((s) => (
            <span
              key={s}
              className="text-[10px] px-2 py-0.5 rounded border"
              style={{
                borderColor: FC.border,
                background: FC.surfaceHi,
                color: "#4a3d4c",
              }}
            >
              {s}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <p className="text-[10px] font-mono uppercase tracking-[0.22em] text-[#7a6e77] mb-2">
          What it taught me
        </p>
        <p className="text-[13px] leading-relaxed text-[#4a3d4c]">
          Character consistency across frames is the entire ball game
          for sprite generation. You solve it with a reference image
          and key-pose anchoring, not by throwing more prompt words at
          the model. Also: a small internal tool that fits your own
          workflow is worth more than a polished one that fits nobody
          in particular.
        </p>
      </div>

      <div
        className="mt-6 p-3 rounded-xl text-xs leading-relaxed"
        style={{
          background: "rgba(139,123,181,0.12)",
          color: "#4a3d4c",
          border: `1px solid ${FC.violet}33`,
        }}
      >
        Current status: built, usable, game parked while I refill API
        credits. The platform is waiting for the artist to come back.
      </div>

      <div className="mt-6 space-y-2">
        <a
          href="https://github.com/haider0072/flowcraft"
          target="_blank"
          rel="noreferrer"
          className="group flex items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          style={{
            background: `linear-gradient(135deg, ${FC.violet} 0%, ${FC.rose} 100%)`,
            boxShadow: "0 8px 24px -8px rgba(139,123,181,0.5)",
          }}
        >
          <span className="flex items-center gap-2">
            <GithubLogo size={16} />
            View on GitHub
          </span>
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
    { id: "sprite", label: "Sprites" },
    { id: "graph", label: "The workflow" },
    { id: "story", label: "Story" },
  ];
  return (
    <nav
      className="h-14 flex items-center pl-7 pr-24 gap-1 shrink-0 border-b"
      style={{ borderColor: FC.border, background: FC.surface }}
    >
      {items.map((item) => {
        const active = tab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setTab(item.id)}
            className={cn(
              "relative h-14 px-4 text-sm font-medium transition-colors",
              active ? "text-[#2a1f2e]" : "text-[#7a6e77] hover:text-[#2a1f2e]",
            )}
          >
            {item.label}
            {active && (
              <span
                className="absolute bottom-[-1px] left-4 right-4 h-[2px] rounded-full"
                style={{
                  background: `linear-gradient(90deg, ${FC.violet}, ${FC.rose})`,
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
// SPRITE TAB
// ====================================================================

type AnimKey = "idle" | "walk" | "run" | "jump" | "attack";

const ANIMATIONS: Record<
  AnimKey,
  {
    name: string;
    keyFrames: number;
    finalFrames: number;
    fps: number;
    // One entry per key frame. finalFrames are interpolated by repeating
    // the key sequence with horizontal flips to suggest mirrored strides.
    keys: { pose: PoseKind; flipped?: boolean }[];
  }
> = {
  idle: {
    name: "Idle",
    keyFrames: 2,
    finalFrames: 4,
    fps: 6,
    keys: [{ pose: "t" }, { pose: "t", flipped: true }],
  },
  walk: {
    name: "Walk",
    keyFrames: 8,
    finalFrames: 16,
    fps: 10,
    keys: [
      { pose: "t" },
      { pose: "walk" },
      { pose: "walk" },
      { pose: "t" },
      { pose: "t", flipped: true },
      { pose: "walk", flipped: true },
      { pose: "walk", flipped: true },
      { pose: "t", flipped: true },
    ],
  },
  run: {
    name: "Run",
    keyFrames: 8,
    finalFrames: 16,
    fps: 12,
    keys: [
      { pose: "run" },
      { pose: "run" },
      { pose: "jump" },
      { pose: "run", flipped: true },
      { pose: "run", flipped: true },
      { pose: "run", flipped: true },
      { pose: "jump" },
      { pose: "run" },
    ],
  },
  jump: {
    name: "Jump",
    keyFrames: 6,
    finalFrames: 12,
    fps: 8,
    keys: [
      { pose: "t" },
      { pose: "jump" },
      { pose: "jump" },
      { pose: "jump" },
      { pose: "jump" },
      { pose: "t" },
    ],
  },
  attack: {
    name: "Attack",
    keyFrames: 6,
    finalFrames: 12,
    fps: 10,
    keys: [
      { pose: "t" },
      { pose: "attack" },
      { pose: "attack" },
      { pose: "attack" },
      { pose: "t" },
      { pose: "t" },
    ],
  },
};

function SpriteTab() {
  const [anim, setAnim] = useState<AnimKey>("walk");
  const [phase, setPhase] = useState<"idle" | "reference" | "keys" | "interpolate" | "done">(
    "idle",
  );
  const [keyCount, setKeyCount] = useState(0);
  const [finalCount, setFinalCount] = useState(0);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const def = ANIMATIONS[anim];

  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };

  const run = (selected: AnimKey) => {
    clearTimers();
    setAnim(selected);
    setKeyCount(0);
    setFinalCount(0);
    setPhase("reference");

    const a = ANIMATIONS[selected];

    // Phase 1: reference
    timers.current.push(
      setTimeout(() => {
        setPhase("keys");
      }, 700),
    );

    // Phase 2: generate key frames one by one
    const keyStart = 700;
    for (let i = 0; i < a.keyFrames; i++) {
      timers.current.push(
        setTimeout(
          () => setKeyCount(i + 1),
          keyStart + 200 + i * 280,
        ),
      );
    }

    // Phase 3: interpolate
    const interpStart = keyStart + 200 + a.keyFrames * 280 + 400;
    timers.current.push(
      setTimeout(() => setPhase("interpolate"), interpStart),
    );
    for (let i = 0; i < a.finalFrames; i++) {
      timers.current.push(
        setTimeout(
          () => setFinalCount(i + 1),
          interpStart + 300 + i * 110,
        ),
      );
    }

    // Phase 4: done
    timers.current.push(
      setTimeout(
        () => setPhase("done"),
        interpStart + 300 + a.finalFrames * 110 + 300,
      ),
    );
  };

  useEffect(() => {
    run("walk");
    return clearTimers;
  }, []);

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-[900px] mx-auto px-10 py-12">
        <p
          className="text-[11px] font-mono uppercase tracking-[0.22em]"
          style={{ color: FC.violet }}
        >
          The origin feature
        </p>
        <h3 className="mt-1 text-2xl font-semibold tracking-tight text-[#2a1f2e]">
          One reference. Seven animations. Consistency held together by
          key-pose prompts and interpolation.
        </h3>
        <p className="mt-2 text-sm text-[#4a3d4c] max-w-[680px] leading-relaxed">
          Pick an animation. The model generates a handful of key poses
          off the character reference, then frame interpolation doubles
          them up into a smooth loop. Same silhouette, same outfit,
          same palette across every frame.
        </p>

        {/* Animation picker */}
        <div className="mt-8 flex items-center gap-2 flex-wrap">
          {(Object.keys(ANIMATIONS) as AnimKey[]).map((k) => {
            const active = anim === k;
            return (
              <button
                key={k}
                onClick={() => run(k)}
                className="px-3 h-8 rounded-lg text-[11px] font-mono uppercase tracking-[0.18em] font-semibold transition-all"
                style={{
                  background: active ? FC.ink : "transparent",
                  color: active ? FC.bg : "#4a3d4c",
                  border: `1px solid ${active ? FC.ink : FC.border}`,
                }}
              >
                {ANIMATIONS[k].name} · {ANIMATIONS[k].finalFrames}f
              </button>
            );
          })}
        </div>

        {/* Canvas */}
        <div
          className="mt-8 rounded-2xl p-8"
          style={{
            background: FC.surface,
            border: `1px solid ${FC.border}`,
          }}
        >
          <div className="grid grid-cols-[180px_1fr] gap-8">
            {/* Reference column */}
            <div className="flex flex-col items-center">
              <div
                className="relative h-[220px] w-[150px] rounded-xl overflow-hidden"
                style={{
                  background: `linear-gradient(180deg, ${FC.sky}77 0%, ${FC.violet}99 50%, ${FC.ink}dd 100%)`,
                  border: `1px solid ${FC.border}`,
                  boxShadow: "0 10px 28px -10px rgba(42,31,46,0.35)",
                }}
              >
                <GrisSilhouette />
                <div className="absolute bottom-2 left-2 text-[9px] font-mono uppercase tracking-[0.14em] text-white/90">
                  reference · 1:1
                </div>
                {phase !== "idle" && phase !== "reference" && (
                  <div
                    className="absolute top-2 right-2 h-2 w-2 rounded-full"
                    style={{
                      background: FC.sage,
                      boxShadow: `0 0 8px ${FC.sage}`,
                    }}
                  />
                )}
              </div>
              <div className="mt-3 text-[10px] font-mono uppercase tracking-[0.18em] text-[#7a6e77]">
                nano banana 2
              </div>
              <div className="mt-1 text-[10px] text-[#7a6e77]">
                1 credit · 1.1s
              </div>
            </div>

            {/* Pipeline + frames */}
            <div className="min-w-0">
              {/* Phase indicator */}
              <div className="flex items-center gap-3 mb-4">
                <PhaseDot active={phase === "reference"} done={phase !== "idle" && phase !== "reference"} label="Reference" />
                <PhaseLine done={phase !== "idle" && phase !== "reference"} />
                <PhaseDot
                  active={phase === "keys"}
                  done={phase === "interpolate" || phase === "done"}
                  label={`Key ${keyCount}/${def.keyFrames}`}
                />
                <PhaseLine done={phase === "interpolate" || phase === "done"} />
                <PhaseDot
                  active={phase === "interpolate"}
                  done={phase === "done"}
                  label={`Final ${finalCount}/${def.finalFrames}`}
                />
              </div>

              {/* Key frames strip */}
              <div className="mb-4">
                <p className="text-[9px] font-mono uppercase tracking-[0.18em] text-[#7a6e77] mb-2">
                  Key poses · prompted individually
                </p>
                <div className="flex gap-2 flex-wrap">
                  {def.keys.map((k, i) => (
                    <FrameBox
                      key={i}
                      filled={i < keyCount}
                      variant="key"
                      pose={k.pose}
                      flipped={k.flipped}
                    />
                  ))}
                </div>
              </div>

              {/* Final frames strip */}
              <div>
                <p className="text-[9px] font-mono uppercase tracking-[0.18em] text-[#7a6e77] mb-2">
                  Final frames · interpolated to {def.finalFrames} @ {def.fps} fps
                </p>
                <div className="flex gap-1.5 flex-wrap">
                  {Array.from({ length: def.finalFrames }).map((_, i) => {
                    const src = def.keys[i % def.keys.length];
                    return (
                      <FrameBox
                        key={i}
                        filled={i < finalCount}
                        variant="final"
                        pose={src.pose}
                        flipped={src.flipped}
                      />
                    );
                  })}
                </div>
              </div>

              {/* Result */}
              {phase === "done" && (
                <div
                  className="mt-5 rounded-lg p-3 flex items-center justify-between"
                  style={{
                    background: "rgba(163,176,154,0.18)",
                    border: `1px solid ${FC.sage}55`,
                  }}
                >
                  <span className="text-xs text-[#2a1f2e]">
                    Sprite sheet ready · {def.finalFrames} frames · looping
                    at {def.fps}fps
                  </span>
                  <span className="text-[10px] font-mono text-[#7a6e77]">
                    {def.keyFrames * 1 + 1} credits used
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        <p className="mt-4 text-xs text-[#7a6e77] font-mono">
          lib/sprites/pipeline.ts · SPRITE_NEGATIVE_PROMPT locks pose,
          outfit and palette · interpolate.ts doubles keys into final
        </p>
      </div>
    </div>
  );
}

function PhaseDot({
  active,
  done,
  label,
}: {
  active: boolean;
  done: boolean;
  label: string;
}) {
  return (
    <div className="flex items-center gap-2 shrink-0">
      <span
        className="h-2.5 w-2.5 rounded-full transition-all"
        style={{
          background: done ? FC.sage : active ? FC.gold : FC.border,
          boxShadow: active ? `0 0 10px ${FC.gold}` : undefined,
        }}
      />
      <span
        className={cn(
          "text-[10px] font-mono uppercase tracking-[0.14em]",
          done || active ? "text-[#2a1f2e]" : "text-[#7a6e77]",
        )}
      >
        {label}
      </span>
    </div>
  );
}

function PhaseLine({ done }: { done: boolean }) {
  return (
    <span
      className="h-px flex-1 transition-colors"
      style={{ background: done ? FC.sage : FC.border }}
    />
  );
}

function FrameBox({
  filled,
  variant,
  pose,
  flipped,
}: {
  filled: boolean;
  variant: "key" | "final";
  pose: PoseKind;
  flipped?: boolean;
}) {
  const size = variant === "key" ? 52 : 32;
  const isKey = variant === "key";
  return (
    <span
      className="rounded relative overflow-hidden transition-all duration-300"
      style={{
        width: size,
        height: Math.round(size * 1.3),
        background: filled
          ? isKey
            ? `linear-gradient(180deg, ${FC.sky}44 0%, ${FC.violet}88 60%, ${FC.ink}bb 100%)`
            : `linear-gradient(180deg, ${FC.rose}33 0%, ${FC.rose}66 100%)`
          : "rgba(42,31,46,0.05)",
        border: filled
          ? `1px solid ${isKey ? FC.violet + "66" : FC.rose + "66"}`
          : `1px dashed ${FC.border}`,
        boxShadow: filled
          ? "0 4px 10px -4px rgba(42,31,46,0.2)"
          : undefined,
      }}
    >
      {filled && <CharacterPose pose={pose} flipped={flipped} />}
    </span>
  );
}

// ====================================================================
// GRAPH TAB
// ====================================================================

type NodeDef = {
  id: string;
  title: string;
  kind: "input" | "model" | "transform" | "output";
  x: number;
  y: number;
  chip?: string;
};

const NODES: NodeDef[] = [
  { id: "prompt", title: "Prompt", kind: "input", x: 10, y: 60, chip: "text" },
  { id: "ref", title: "Reference", kind: "input", x: 10, y: 180, chip: "image" },
  { id: "enhance", title: "Prompt enhancer", kind: "transform", x: 142, y: 60, chip: "gpt-5" },
  { id: "gen", title: "Image generation", kind: "model", x: 142, y: 200, chip: "nano-banana" },
  { id: "bg", title: "BG remove", kind: "transform", x: 274, y: 200, chip: "rembg" },
  { id: "resize", title: "Resize", kind: "transform", x: 274, y: 80, chip: "64×64" },
  { id: "out", title: "Sprite output", kind: "output", x: 406, y: 140, chip: "png" },
];

const NODE_WIDTH = 114;

const EDGES: [string, string][] = [
  ["prompt", "enhance"],
  ["ref", "gen"],
  ["enhance", "gen"],
  ["enhance", "resize"],
  ["gen", "bg"],
  ["bg", "out"],
  ["resize", "out"],
];

function GraphTab() {
  const [pulse, setPulse] = useState(0);
  useEffect(() => {
    const i = setInterval(() => setPulse((p) => (p + 1) % 100), 60);
    return () => clearInterval(i);
  }, []);

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-[1000px] mx-auto px-10 py-12">
        <p
          className="text-[11px] font-mono uppercase tracking-[0.22em]"
          style={{ color: FC.violet }}
        >
          The scale moment
        </p>
        <h3 className="mt-1 text-2xl font-semibold tracking-tight text-[#2a1f2e]">
          The moment I realized a single generate button wasn&apos;t
          enough.
        </h3>
        <p className="mt-2 text-sm text-[#4a3d4c] max-w-[680px] leading-relaxed">
          Same character needs a sprite sheet, a tile, a social post, a
          video cover. Eleven node types, each one a pure transform.
          Wire them together once, reuse forever. React Flow as the
          canvas, each node hits a different OpenRouter model.
        </p>

        {/* Graph canvas */}
        <div
          className="mt-8 rounded-2xl relative overflow-hidden"
          style={{
            background: FC.surface,
            border: `1px solid ${FC.border}`,
            height: 380,
            backgroundImage: `radial-gradient(${FC.border} 1px, transparent 1px)`,
            backgroundSize: "16px 16px",
            backgroundPosition: "0 0",
          }}
        >
          {/* SVG edges */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            viewBox="0 0 540 380"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="fc-edge" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor={FC.violet} stopOpacity="0.6" />
                <stop offset="100%" stopColor={FC.rose} stopOpacity="0.6" />
              </linearGradient>
            </defs>
            {EDGES.map(([from, to], i) => {
              const a = NODES.find((n) => n.id === from)!;
              const b = NODES.find((n) => n.id === to)!;
              const x1 = a.x + NODE_WIDTH;
              const y1 = a.y + 36;
              const x2 = b.x;
              const y2 = b.y + 36;
              const midX = (x1 + x2) / 2;
              const d = `M ${x1} ${y1} C ${midX} ${y1}, ${midX} ${y2}, ${x2} ${y2}`;
              const dashOffset = -((pulse + i * 20) % 60);
              return (
                <g key={i}>
                  <path d={d} fill="none" stroke="url(#fc-edge)" strokeWidth="1.5" />
                  <path
                    d={d}
                    fill="none"
                    stroke={FC.gold}
                    strokeWidth="2"
                    strokeDasharray="6 54"
                    strokeDashoffset={dashOffset}
                    opacity="0.9"
                  />
                </g>
              );
            })}
          </svg>

          {/* Nodes */}
          {NODES.map((n) => (
            <NodeCard key={n.id} node={n} />
          ))}
        </div>

        {/* Node type grid */}
        <div className="mt-8">
          <p className="text-[10px] font-mono uppercase tracking-[0.22em] text-[#7a6e77] mb-3">
            Node library · 11 types
          </p>
          <div className="grid grid-cols-4 gap-2">
            {[
              { n: "Prompt input", t: "text" },
              { n: "Image gen", t: "model" },
              { n: "Image to image", t: "model" },
              { n: "Image describer", t: "model" },
              { n: "Prompt enhancer", t: "text" },
              { n: "BG remove", t: "transform" },
              { n: "Resize", t: "transform" },
              { n: "Text combiner", t: "text" },
              { n: "Video gen", t: "model" },
              { n: "Image output", t: "output" },
              { n: "Video output", t: "output" },
            ].map((x) => (
              <div
                key={x.n}
                className="rounded-md px-3 py-2 flex items-center justify-between"
                style={{
                  background: FC.surface,
                  border: `1px solid ${FC.border}`,
                }}
              >
                <span className="text-[11px] text-[#2a1f2e]">{x.n}</span>
                <span className="text-[9px] font-mono uppercase tracking-[0.12em] text-[#7a6e77]">
                  {x.t}
                </span>
              </div>
            ))}
          </div>
        </div>

        <p className="mt-4 text-xs text-[#7a6e77] font-mono">
          components/workflow/nodes/*.tsx · base-node.tsx · glow-edge.tsx
        </p>
      </div>
    </div>
  );
}

function NodeCard({ node }: { node: NodeDef }) {
  const accent =
    node.kind === "input"
      ? FC.sky
      : node.kind === "model"
        ? FC.violet
        : node.kind === "transform"
          ? FC.gold
          : FC.rose;
  return (
    <div
      className="absolute rounded-lg overflow-hidden"
      style={{
        left: node.x,
        top: node.y,
        width: NODE_WIDTH,
        background: FC.bg,
        border: `1px solid ${FC.border}`,
        boxShadow: "0 6px 16px -8px rgba(42,31,46,0.25)",
      }}
    >
      <div
        className="h-1"
        style={{ background: accent }}
      />
      <div className="p-2.5">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold text-[#2a1f2e]">
            {node.title}
          </span>
          <span
            className="h-1.5 w-1.5 rounded-full"
            style={{ background: accent }}
          />
        </div>
        {node.chip && (
          <span
            className="mt-1 inline-block text-[9px] font-mono uppercase tracking-[0.12em] px-1.5 py-0.5 rounded"
            style={{
              background: `${accent}22`,
              color: "#4a3d4c",
            }}
          >
            {node.chip}
          </span>
        )}
      </div>
      {/* connection dots */}
      <span
        className="absolute left-[-3px] top-1/2 -translate-y-1/2 h-1.5 w-1.5 rounded-full"
        style={{ background: FC.border }}
      />
      <span
        className="absolute right-[-3px] top-1/2 -translate-y-1/2 h-1.5 w-1.5 rounded-full"
        style={{ background: accent }}
      />
    </div>
  );
}

// ====================================================================
// STORY TAB
// ====================================================================

const BEATS = [
  {
    label: "The game",
    title: "A Gris-style platformer, one person, too ambitious.",
    copy: "I wanted to make a quiet 2D platformer. Watercolor feel, minimal mechanics, story told through movement. The hardest blocker wasn't design or code. It was art. Specifically: consistent character sprites across a dozen animations, in a style I could keep up with solo.",
    color: FC.sky,
  },
  {
    label: "The problem",
    title: "No tool let me turn one reference into a full sprite sheet.",
    copy: "Every image model would happily give me one cool frame. Ask for a walk cycle and the character became a different person every pose. WebTorrent on the web had solved streaming. Nobody had solved this for sprites on mobile-feel 2D games.",
    color: FC.violet,
  },
  {
    label: "The pivot",
    title: "Night one: a Discord bot. Night two: a platform.",
    copy: "March 27, 2026: I built stripes-generator, a Discord bot that runs a ComfyUI pipeline over Replicate, uses LoRA for character consistency, and OpenPose keypoints to drive animations. March 28: I realized this needed to live outside Discord. I started FlowCraft as a Next.js web app. Phases 1 through 3 shipped the same day. By March 30, it had a node editor, video gen, and templates.",
    color: FC.rose,
  },
  {
    label: "The pause",
    title: "Tool built. Credits spent. Game still in progress.",
    copy: "FlowCraft works. I use it. The game is paused while I top up API credits and go back to being the artist this tool was built for. A very specific, very honest side-project ending: the scaffolding got ahead of the thing it was scaffolding for.",
    color: FC.gold,
  },
];

function StoryTab() {
  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-[800px] mx-auto px-10 py-12">
        <p
          className="text-[11px] font-mono uppercase tracking-[0.22em]"
          style={{ color: FC.violet }}
        >
          Three nights
        </p>
        <h3 className="mt-1 text-2xl font-semibold tracking-tight text-[#2a1f2e]">
          Every side project has an arc. This one&apos;s arc ended with
          the tool alive and the game asleep.
        </h3>

        <ol className="mt-10 space-y-10 relative">
          {BEATS.map((beat, i) => (
            <li key={i} className="grid grid-cols-[56px_1fr] gap-4">
              <div className="flex flex-col items-center">
                <span
                  className="h-8 w-8 rounded-full flex items-center justify-center text-[11px] font-mono font-semibold text-white"
                  style={{ background: beat.color }}
                >
                  {i + 1}
                </span>
                {i < BEATS.length - 1 && (
                  <span
                    className="w-px flex-1 mt-2"
                    style={{ background: FC.border }}
                  />
                )}
              </div>
              <div className="pb-6">
                <p
                  className="text-[10px] font-mono uppercase tracking-[0.22em] mb-1"
                  style={{ color: beat.color }}
                >
                  {beat.label}
                </p>
                <p className="text-lg font-semibold tracking-tight text-[#2a1f2e] leading-snug">
                  {beat.title}
                </p>
                <p className="mt-2 text-sm text-[#4a3d4c] leading-relaxed">
                  {beat.copy}
                </p>
              </div>
            </li>
          ))}
        </ol>

        {/* Stat cards */}
        <div className="mt-4 grid grid-cols-4 gap-3">
          {[
            { k: "Built", v: "3 nights" },
            { k: "AI models", v: "6 via OpenRouter" },
            { k: "Node types", v: "11" },
            { k: "Frames / sheet", v: "42 max" },
          ].map((s) => (
            <div
              key={s.k}
              className="rounded-xl p-4"
              style={{
                background: FC.surface,
                border: `1px solid ${FC.border}`,
              }}
            >
              <p className="text-[9px] font-mono uppercase tracking-[0.22em] text-[#7a6e77]">
                {s.k}
              </p>
              <p className="mt-1 text-base font-semibold text-[#2a1f2e]">
                {s.v}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
