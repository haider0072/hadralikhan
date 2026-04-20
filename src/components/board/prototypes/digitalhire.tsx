"use client";

import { useEffect, useRef, useState } from "react";
import type { CardActivity } from "../use-card-activity";
import { ProjectFrame } from "../project-frame";
import { FocusModal } from "../focus-modal";
import { cn } from "@/lib/cn";

// Real DigitalHire palette, pulled straight from the Flutter app:
//   lib/shared/app_colors.dart + lib/shared/app_theme.dart
// Primary green + aiPurple + the five taxonomy pastels are exactly the
// tokens the product itself uses, so surfaces here read like DH.
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
  primary: "#00BA52",
  primaryHover: "#008F3F",
  primaryDark: "#005C28",
  primarySoft: "#E5FAEE",
  primarySofter: "#F2FDF7",
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
  danger: "#E11D48",
};

// ====================================================================
// REAL DIGITALHIRE WORDMARK — straight from the Flutter asset bundle
// (assets/images/brand_logo.svg). "Digital" in grey, "Hire" in green.
// ====================================================================

function DHWordmark({
  height = 24,
  mono = false,
}: {
  height?: number;
  mono?: boolean;
}) {
  const ink = mono ? "#ffffff" : DH.ink;
  const brand = mono ? "#ffffff" : DH.primary;
  return (
    <svg
      viewBox="0 0 207 48"
      height={height}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="DigitalHire"
      style={{ flexShrink: 0 }}
    >
      <path
        d="M14.7177 3.06C19.2303 3.06 23.0184 4.6531 26.0406 7.81862C29.0628 10.9841 30.5739 14.8945 30.5739 19.529C30.5739 24.1634 29.0628 28.0738 26.0406 31.2393C23.0184 34.4048 19.2303 35.9979 14.7177 35.9979H1.61462V3.06H14.7177ZM14.7177 29.7703C17.5743 29.7703 19.8927 28.8186 21.6936 26.9152C23.4738 25.0117 24.3846 22.5497 24.3846 19.5083C24.3846 16.4669 23.4945 13.9841 21.6936 12.1014C19.8927 10.2186 17.5536 9.26689 14.7177 9.26689H8.11442V29.7703H14.7177Z"
        fill={ink}
      />
      <path
        d="M35.7074 9.64896C34.6931 9.64896 33.8237 9.27655 33.0992 8.55241C32.354 7.80758 31.9814 6.93861 31.9814 5.94551C31.9814 4.93172 32.354 4.06275 33.0992 3.31792C33.8444 2.5731 34.7138 2.17999 35.7074 2.17999C36.7424 2.17999 37.6325 2.55241 38.3777 3.31792C39.1229 4.08344 39.4955 4.95241 39.4955 5.94551C39.4955 6.9593 39.1229 7.82827 38.3777 8.55241C37.6325 9.27655 36.7424 9.64896 35.7074 9.64896ZM32.6852 36.0076V12.4628H38.7503V35.9869H32.6852V36.0076Z"
        fill={ink}
      />
      <path
        d="M60.1335 12.0621H66.0537V34.4483C66.0537 38.0896 64.8531 40.8621 62.4519 42.7655C60.0507 44.669 57.1527 45.6414 53.7579 45.6414C51.2118 45.6414 48.9762 45.1448 47.0511 44.1724C45.126 43.2 43.6356 41.7724 42.6006 39.8896L47.7756 36.931C48.9762 39.1241 51.0255 40.2207 53.9442 40.2207C55.8486 40.2207 57.3597 39.7241 58.4568 38.7103C59.5539 37.6965 60.1128 36.2896 60.1128 34.4276V31.8827C58.3326 34.2621 55.8072 35.4621 52.578 35.4621C49.2453 35.4621 46.4715 34.3034 44.2152 31.9655C41.9589 29.6276 40.8618 26.7724 40.8618 23.4207C40.8618 20.0896 41.9796 17.2552 44.2566 14.8965C46.5336 12.5379 49.2867 11.3586 52.5987 11.3586C55.8279 11.3586 58.3326 12.5586 60.1335 14.9379V12.0621ZM48.8106 28.0965C50.0526 29.2965 51.6258 29.9172 53.5509 29.9172C55.4553 29.9172 57.0492 29.3172 58.2912 28.0965C59.5332 26.8965 60.1542 25.3448 60.1542 23.4621C60.1542 21.6207 59.5332 20.0896 58.2912 18.869C57.0492 17.669 55.476 17.0483 53.5509 17.0483C51.6465 17.0483 50.0526 17.6483 48.8106 18.869C47.5686 20.069 46.9476 21.6 46.9476 23.4621C46.9476 25.3448 47.5686 26.8759 48.8106 28.0965Z"
        fill={ink}
      />
      <path
        d="M72.3672 9.64896C71.3529 9.64896 70.4835 9.27655 69.759 8.55241C69.0138 7.80758 68.6412 6.93861 68.6412 5.94551C68.6412 4.93172 69.0138 4.06275 69.759 3.31792C70.4835 2.5731 71.3736 2.17999 72.3672 2.17999C73.4022 2.17999 74.2923 2.55241 75.0375 3.31792C75.7827 4.06275 76.1553 4.95241 76.1553 5.94551C76.1553 6.9593 75.7827 7.82827 75.0375 8.55241C74.2923 9.27655 73.4022 9.64896 72.3672 9.64896ZM69.3657 36.0076V12.4628H75.4308V35.9869H69.3657V36.0076Z"
        fill={ink}
      />
      <path
        d="M92.2392 18.1145H86.9193V27.9007C86.9193 28.7076 87.1263 29.3076 87.5403 29.68C87.9543 30.0524 88.5546 30.28 89.3205 30.3214C90.1071 30.3627 91.08 30.3627 92.2392 30.3007V35.8041C88.0578 36.28 85.1184 35.8869 83.421 34.6248C81.7029 33.3628 80.8542 31.1283 80.8542 27.9007V18.1145H76.7556V12.28H80.8542V7.52137L86.9193 5.67999V12.2593H92.2392V18.1145Z"
        fill={ink}
      />
      <path
        d="M111.49 11.8221H117.576V35.3462H111.511V32.5738C109.689 34.8704 107.122 36.0083 103.831 36.0083C100.685 36.0083 97.9938 34.8083 95.7582 32.4083C93.5226 30.0083 92.4048 27.0703 92.4048 23.5945C92.4048 20.1186 93.5226 17.16 95.7582 14.76C97.9938 12.36 100.685 11.16 103.831 11.16C107.122 11.16 109.689 12.2979 111.511 14.5945V11.8221H111.49ZM100.291 28.3738C101.513 29.6152 103.065 30.2359 104.949 30.2359C106.833 30.2359 108.385 29.6152 109.627 28.3738C110.869 27.1324 111.49 25.5393 111.49 23.5945C111.49 21.6497 110.869 20.0566 109.627 18.8152C108.385 17.5738 106.833 16.9531 104.949 16.9531C103.065 16.9531 101.513 17.5738 100.291 18.8152C99.0702 20.0566 98.4492 21.6497 98.4492 23.5945C98.4492 25.5393 99.0702 27.1324 100.291 28.3738Z"
        fill={ink}
      />
      <path d="M120.867 36.0055V1.64001H126.932V35.9848L120.867 36.0055Z" fill={ink} />
      <path
        d="M149.288 3.06H155.747V35.9979H149.288V22.3428H137.055V35.9772H130.555V3.06H137.055V16.1359H149.288V3.06Z"
        fill={brand}
      />
      <path
        d="M174.853 16.511C175.412 15.0007 176.343 13.8835 177.647 13.1179C178.951 12.3731 180.4 11.98 181.994 11.98V18.7662C180.131 18.5386 178.496 18.9317 177.026 19.9042C175.577 20.8766 174.832 22.4904 174.832 24.7455V35.98H168.767V12.4559H174.832V16.511H174.853Z"
        fill={brand}
      />
      <path
        d="M188.425 26.1106C189.233 29.0486 191.447 30.5382 195.07 30.5382C197.388 30.5382 199.148 29.752 200.348 28.1796L205.254 30.9934C202.936 34.3451 199.52 36.021 194.987 36.021C191.096 36.021 187.97 34.8417 185.61 32.483C183.25 30.1244 182.091 27.1658 182.091 23.5865C182.091 20.0486 183.25 17.0899 185.569 14.7106C187.887 12.3313 190.868 11.152 194.511 11.152C197.968 11.152 200.804 12.352 203.06 14.7313C205.296 17.1727 206.414 20.1106 206.414 23.6279C206.414 24.4141 206.331 25.2417 206.186 26.1313H188.425V26.1106ZM188.342 21.4141H200.348C199.997 19.821 199.293 18.621 198.216 17.8348C197.14 17.0486 195.898 16.6555 194.511 16.6555C192.876 16.6555 191.53 17.0692 190.454 17.8968C189.398 18.7451 188.674 19.9037 188.342 21.4141Z"
        fill={brand}
      />
      <path
        d="M162.391 2C161.377 2 160.508 2.37241 159.783 3.13793C159.038 3.88276 158.686 4.77241 158.686 5.76552C158.686 6.77931 159.059 7.64828 159.783 8.37241C160.508 9.11724 161.398 9.46897 162.391 9.46897C163.426 9.46897 164.317 9.09655 165.041 8.37241C165.786 7.62759 166.138 6.75862 166.138 5.76552C166.138 4.75172 165.766 3.88276 165.041 3.13793C164.317 2.3931 163.426 2 162.391 2Z"
        fill={brand}
      />
      <path
        d="M162.412 12.1172C161.708 12.1172 161.046 11.9931 160.425 11.7862L158.645 33.469L162.454 36.8621L166.262 33.469L164.482 11.7862C163.799 11.9931 163.116 12.1172 162.412 12.1172Z"
        fill={brand}
      />
    </svg>
  );
}

// ====================================================================
// MAIN ENTRY
// ====================================================================

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
// PEEK — cycles three product scenes. Not just chat; video resume, job
// composer and AI chat take turns so the card itself hints at the
// whole product surface area.
// ====================================================================

type Scene = "video" | "compose" | "chat" | "match";

const SCENES: { id: Scene; label: string }[] = [
  { id: "video", label: "Video resume" },
  { id: "compose", label: "Job composer" },
  { id: "chat", label: "AI chat" },
  { id: "match", label: "Candidate match" },
];

function DigitalHirePeek({
  activity,
  onOpen,
}: {
  activity: CardActivity;
  onOpen: () => void;
}) {
  const [scene, setScene] = useState<Scene>("video");
  useEffect(() => {
    if (activity !== "active") return;
    const id = setInterval(() => {
      setScene((s) => {
        const order: Scene[] = ["video", "compose", "chat", "match"];
        return order[(order.indexOf(s) + 1) % order.length];
      });
    }, 3200);
    return () => clearInterval(id);
  }, [activity]);

  return (
    <ProjectFrame
      meta={{
        year: "2022 — now",
        title: "DigitalHire",
        tagline:
          "Video-first recruitment. 70k+ users, three platforms, one design system.",
      }}
      innerClassName="bg-white"
      onOpen={onOpen}
      tape="top-right"
    >
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute -top-16 -right-10 w-56 h-56 rounded-full"
          style={{ background: DH.aiPurple, filter: "blur(100px)", opacity: 0.14 }}
        />
        <div
          className="absolute -bottom-10 -left-10 w-48 h-48 rounded-full"
          style={{ background: DH.primary, filter: "blur(90px)", opacity: 0.22 }}
        />
      </div>

      <div className="absolute top-4 left-4 right-4 flex items-start justify-between z-10">
        <div className="flex items-center gap-2">
          <DHWordmark height={16} />
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

      <div className="absolute inset-0 pt-12 pb-8 px-4 flex items-center justify-center">
        {scene === "video" && <PeekVideoResume animated={activity === "active"} />}
        {scene === "compose" && <PeekJobCompose animated={activity === "active"} />}
        {scene === "chat" && <PeekChat animated={activity === "active"} />}
        {scene === "match" && <PeekMatch animated={activity === "active"} />}
      </div>

      <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between font-mono text-[9px] uppercase tracking-[0.18em]">
        <div className="flex items-center gap-1.5">
          {SCENES.map((s) => (
            <span
              key={s.id}
              className="h-1 rounded-full transition-all"
              style={{
                width: scene === s.id ? 16 : 4,
                background: scene === s.id ? DH.primary : DH.border,
              }}
            />
          ))}
        </div>
        <span style={{ color: DH.muted }}>
          {SCENES.find((s) => s.id === scene)?.label}
        </span>
      </div>
    </ProjectFrame>
  );
}

// ---- Peek scene: video resume with face marker + waveform -----------

function PeekVideoResume({ animated }: { animated: boolean }) {
  const [t, setT] = useState(0);
  useEffect(() => {
    if (!animated) return;
    const id = setInterval(() => setT((x) => (x + 1) % 60), 120);
    return () => clearInterval(id);
  }, [animated]);

  return (
    <div
      className="relative w-[210px] h-[140px] rounded-xl overflow-hidden"
      style={{
        background: `linear-gradient(135deg, #1f2937 0%, #111827 100%)`,
        boxShadow: "0 18px 36px -18px rgba(15,23,42,0.5)",
        border: `1px solid ${DH.border}`,
      }}
    >
      <div className="absolute top-2 left-2 right-2 flex items-center justify-between z-10">
        <div
          className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[7px] font-mono uppercase tracking-[0.2em]"
          style={{ background: DH.danger, color: "#fff" }}
        >
          <span className="h-1 w-1 rounded-full bg-white animate-pulse" />
          rec
        </div>
        <span className="text-[8px] font-mono text-white/70">00:{(60 - t).toString().padStart(2, "0")}</span>
      </div>

      {/* Face marker */}
      <svg viewBox="0 0 210 140" className="absolute inset-0 w-full h-full">
        <rect
          x="70"
          y="34"
          width="70"
          height="80"
          rx="10"
          fill="none"
          stroke={DH.primary}
          strokeWidth="1.2"
          strokeDasharray="3 4"
          opacity="0.7"
        />
        <circle cx="95" cy="60" r="2" fill={DH.primary} opacity="0.8" />
        <circle cx="115" cy="60" r="2" fill={DH.primary} opacity="0.8" />
        <path
          d="M 92 78 Q 105 88 118 78"
          stroke={DH.primary}
          strokeWidth="1.3"
          fill="none"
          opacity="0.8"
        />
      </svg>

      {/* Transcript */}
      <div
        className="absolute bottom-2 left-2 right-2 px-2 py-1.5 rounded-md text-[8px]"
        style={{
          background: "rgba(0,0,0,0.55)",
          color: "#fff",
          backdropFilter: "blur(6px)",
        }}
      >
        <span className="opacity-70 font-mono text-[7px] mr-1">live:</span>
        &ldquo;I&apos;ve been shipping product for 3 years…&rdquo;
      </div>
    </div>
  );
}

// ---- Peek scene: job composer with tokens flying in -----------------

function PeekJobCompose({ animated }: { animated: boolean }) {
  const tokens: { label: string; bg: string }[] = [
    { label: "Remote", bg: DH.workplaceType },
    { label: "Full-time", bg: DH.jobType },
    { label: "Mid-senior", bg: DH.experienceLevel },
    { label: "$120k", bg: DH.compensation },
  ];
  const [filled, setFilled] = useState(0);
  useEffect(() => {
    if (!animated) {
      setFilled(tokens.length);
      return;
    }
    setFilled(0);
    const id = setInterval(() => {
      setFilled((f) => (f >= tokens.length ? 0 : f + 1));
    }, 700);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [animated]);

  return (
    <div
      className="relative w-[230px] rounded-xl p-2.5"
      style={{
        background: DH.paper,
        border: `1px solid ${DH.border}`,
        boxShadow: "0 14px 32px -16px rgba(15,23,42,0.2)",
      }}
    >
      <p className="text-[8px] font-mono uppercase tracking-[0.22em] mb-1.5" style={{ color: DH.muted }}>
        new job post · composing
      </p>
      <p className="text-[11px] font-semibold" style={{ color: DH.ink }}>
        Senior Frontend Engineer
      </p>
      <p className="text-[9px]" style={{ color: DH.inkSoft }}>
        at Acme Studios
      </p>

      <div className="mt-2 flex flex-wrap gap-1 min-h-[22px]">
        {tokens.slice(0, filled).map((tok) => (
          <span
            key={tok.label}
            className="text-[9px] px-1.5 py-0.5 rounded-md animate-[fadein_300ms_ease-out]"
            style={{ background: tok.bg, color: DH.ink }}
          >
            {tok.label}
          </span>
        ))}
        {filled < tokens.length && (
          <span
            className="text-[9px] px-1.5 py-0.5 rounded-md border-dashed border"
            style={{ borderColor: DH.border, color: DH.muted }}
          >
            +
          </span>
        )}
      </div>
      <style>{`@keyframes fadein { from { opacity: 0; transform: translateY(-4px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </div>
  );
}

// ---- Peek scene: AI chat ------------------------------------------

function PeekChat({ animated }: { animated: boolean }) {
  const USER_MSG = "find me senior frontend candidates";
  const [chars, setChars] = useState(0);
  useEffect(() => {
    if (!animated) {
      setChars(USER_MSG.length);
      return;
    }
    setChars(0);
    const id = setInterval(() => {
      setChars((c) => (c >= USER_MSG.length ? 0 : c + 1));
    }, 55);
    return () => clearInterval(id);
  }, [animated]);

  return (
    <div
      className="relative w-[220px] rounded-xl p-2 flex flex-col gap-1.5"
      style={{
        background: DH.paper,
        border: `1px solid ${DH.border}`,
        boxShadow: "0 14px 32px -16px rgba(15,23,42,0.2)",
      }}
    >
      <div className="flex justify-end">
        <div
          className="text-[9px] leading-tight px-2 py-1.5 rounded-lg max-w-[85%] text-right"
          style={{ background: DH.primary, color: "#fff" }}
        >
          {USER_MSG.slice(0, chars)}
          {chars < USER_MSG.length && (
            <span
              className="inline-block w-[1px] h-[9px] ml-0.5 align-middle"
              style={{ background: "#fff" }}
            />
          )}
        </div>
      </div>
      {chars >= USER_MSG.length && (
        <>
          <div
            className="flex items-center gap-1 px-2 py-1 rounded-md self-start"
            style={{
              background: DH.aiPurpleSoft,
              border: `1px solid ${DH.aiPurple}55`,
            }}
          >
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: DH.success }} />
            <span className="text-[8px] font-mono" style={{ color: DH.aiPurple }}>
              searchApplicant
            </span>
          </div>
          <div
            className="text-[8.5px] px-2 py-1.5 rounded-lg"
            style={{ background: DH.paperAlt, color: DH.ink, border: `1px solid ${DH.border}` }}
          >
            Found 24 candidates. Top three below.
          </div>
        </>
      )}
    </div>
  );
}

// ---- Peek scene: candidate match card -----------------------------

function PeekMatch({ animated }: { animated: boolean }) {
  const candidates = [
    { name: "Ayesha K.", role: "Senior FE · 6 yrs", match: 94 },
    { name: "Daniyal R.", role: "Senior FE · 5 yrs", match: 89 },
    { name: "Hira N.", role: "Mid-senior FE · 4 yrs", match: 81 },
  ];
  return (
    <div
      className="relative w-[230px] rounded-xl p-2"
      style={{
        background: DH.paper,
        border: `1px solid ${DH.border}`,
        boxShadow: "0 14px 32px -16px rgba(15,23,42,0.2)",
      }}
    >
      <p className="text-[8px] font-mono uppercase tracking-[0.22em] mb-1.5" style={{ color: DH.muted }}>
        top matches · ranked
      </p>
      <div className="space-y-1">
        {candidates.map((c, i) => (
          <div
            key={c.name}
            className="flex items-center gap-2 p-1 rounded-md"
            style={{
              background: i === 0 ? DH.primarySofter : "transparent",
              border: i === 0 ? `1px solid ${DH.primary}33` : "1px solid transparent",
            }}
          >
            <div
              className="h-6 w-6 rounded-full flex items-center justify-center text-[9px] font-semibold text-white"
              style={{
                background: [DH.primary, DH.aiGrammarBorder, DH.aiPurple][i],
              }}
            >
              {c.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[9px] font-semibold leading-none" style={{ color: DH.ink }}>
                {c.name}
              </p>
              <p className="text-[8px] leading-none mt-0.5" style={{ color: DH.muted }}>
                {c.role}
              </p>
            </div>
            <span
              className="text-[9px] font-mono px-1.5 py-0.5 rounded"
              style={{
                background: i === 0 ? DH.primary : DH.paperAlt,
                color: i === 0 ? "#fff" : DH.inkSoft,
              }}
            >
              {c.match}%
            </span>
          </div>
        ))}
      </div>
      {animated && (
        <span
          className="absolute -top-1 -right-1 h-2 w-2 rounded-full animate-ping"
          style={{ background: DH.primary }}
        />
      )}
    </div>
  );
}

// ====================================================================
// FOCUS MODAL — scene switcher, not tabs. Each scene is an interactive
// reconstruction of an actual DigitalHire product surface.
// ====================================================================

function DigitalHireFocus() {
  const [scene, setScene] = useState<Scene>("video");
  return (
    <div
      className="w-[min(1240px,96vw)] h-[min(780px,92vh)] grid grid-cols-[340px_1fr] overflow-hidden font-sans"
      style={{ background: DH.bg, color: DH.ink }}
    >
      <Sidebar />
      <section className="flex flex-col overflow-hidden min-w-0">
        <SceneSwitcher scene={scene} setScene={setScene} />
        <div className="flex-1 overflow-hidden relative">
          {scene === "video" && <VideoResumeScene />}
          {scene === "compose" && <JobComposerScene />}
          {scene === "chat" && <AiChatScene />}
          {scene === "match" && <CandidateMatchScene />}
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
      <DHWordmark height={26} />
      <p
        className="mt-2 text-[10px] font-mono uppercase tracking-[0.22em]"
        style={{ color: DH.muted }}
      >
        2022 — now · video-first recruitment
      </p>

      <div className="mt-6 grid grid-cols-3 gap-2">
        <Stat value="70K+" label="users" />
        <Stat value="10K+" label="installs" />
        <Stat value="3.5y" label="on it" />
      </div>

      <p
        className="mt-6 text-[15px] leading-[1.5] tracking-tight"
        style={{ color: DH.ink }}
      >
        Designed it. Ran it. Eventually wrote it.{" "}
        <span style={{ color: DH.muted }}>
          Same product the whole time.
        </span>
      </p>

      <div className="mt-6">
        <p
          className="text-[10px] font-mono uppercase tracking-[0.22em] mb-2.5"
          style={{ color: DH.muted }}
        >
          The arc
        </p>
        <ul className="space-y-2 text-[13px]" style={{ color: DH.inkSoft }}>
          <li className="flex items-baseline gap-2.5">
            <span
              className="text-[10px] font-mono shrink-0"
              style={{ color: DH.muted }}
            >
              2022
            </span>
            <span>Sole designer. Rebuilt every surface from zero.</span>
          </li>
          <li className="flex items-baseline gap-2.5">
            <span
              className="text-[10px] font-mono shrink-0"
              style={{ color: DH.muted }}
            >
              2023
            </span>
            <span>Picked up PM because nobody could go around.</span>
          </li>
          <li className="flex items-baseline gap-2.5">
            <span
              className="text-[10px] font-mono shrink-0"
              style={{ color: DH.muted }}
            >
              2024
            </span>
            <span>Designed the pivot from forms to chat-first AI.</span>
          </li>
          <li className="flex items-baseline gap-2.5">
            <span
              className="text-[10px] font-mono shrink-0"
              style={{ color: DH.muted }}
            >
              2025
            </span>
            <span>Rewrote the chat service on NestJS, stripped LangChain.</span>
          </li>
          <li className="flex items-baseline gap-2.5">
            <span
              className="text-[10px] font-mono shrink-0"
              style={{ color: DH.primary }}
            >
              now
            </span>
            <span style={{ color: DH.ink }}>
              Leading the monolith migration. AI agent layer next.
            </span>
          </li>
        </ul>
      </div>

      <div className="mt-6">
        <p
          className="text-[10px] font-mono uppercase tracking-[0.22em] mb-2"
          style={{ color: DH.muted }}
        >
          Stack
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
            "OpenAI SDK",
            "Whisper",
            "Stripe",
            "AWS",
          ].map((s) => (
            <span
              key={s}
              className="text-[11px] px-2 py-[3px] rounded-md"
              style={{
                background: DH.card,
                border: `1px solid ${DH.border}`,
                color: DH.inkSoft,
              }}
            >
              {s}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <p
          className="text-[10px] font-mono uppercase tracking-[0.22em] mb-2"
          style={{ color: DH.muted }}
        >
          Shoulders stood on
        </p>
        <p className="text-[12.5px] leading-relaxed" style={{ color: DH.inkSoft }}>
          <a
            href="https://github.com/mohsinraza-fdev"
            target="_blank"
            rel="noreferrer"
            className="underline decoration-dotted"
            style={{ color: DH.ink }}
          >
            Mohsin Raza
          </a>{" "}
          held the frontend together, especially the chat client.{" "}
          <a
            href="https://github.com/ishaquehassan"
            target="_blank"
            rel="noreferrer"
            className="underline decoration-dotted"
            style={{ color: DH.ink }}
          >
            Ishaque Hassan
          </a>{" "}
          pushed me into the rewrite when nobody else would see it through.
        </p>
      </div>

      <div className="mt-auto pt-8 space-y-2">
        <a
          href="https://digitalhire.com"
          target="_blank"
          rel="noreferrer"
          className="group flex items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          style={{
            background: DH.primary,
            boxShadow: `0 10px 28px -10px ${DH.primary}66`,
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
            background: DH.paper,
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

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div
      className="rounded-xl p-3"
      style={{ background: DH.card, border: `1px solid ${DH.border}` }}
    >
      <p
        className="text-[18px] font-semibold leading-none tracking-tight"
        style={{ color: DH.ink }}
      >
        {value}
      </p>
      <p className="mt-1.5 text-[10px]" style={{ color: DH.muted }}>
        {label}
      </p>
    </div>
  );
}

// ====================================================================
// SCENE SWITCHER
// ====================================================================

function SceneSwitcher({
  scene,
  setScene,
}: {
  scene: Scene;
  setScene: (s: Scene) => void;
}) {
  return (
    <nav
      className="h-16 flex items-center pl-7 pr-24 gap-2 shrink-0 border-b"
      style={{ borderColor: DH.border, background: DH.paper }}
    >
      {SCENES.map((s) => {
        const active = scene === s.id;
        return (
          <button
            key={s.id}
            onClick={() => setScene(s.id)}
            className={cn(
              "h-10 px-4 rounded-xl text-[13px] font-medium transition-all flex items-center gap-2",
            )}
            style={{
              background: active ? DH.primary : DH.card,
              color: active ? "#fff" : DH.inkSoft,
              border: `1px solid ${active ? DH.primary : DH.border}`,
              boxShadow: active ? `0 6px 16px -8px ${DH.primary}aa` : "none",
            }}
          >
            <SceneIcon scene={s.id} active={active} />
            {s.label}
          </button>
        );
      })}
      <div className="ml-auto flex items-center gap-2">
        <span
          className="h-1.5 w-1.5 rounded-full animate-pulse"
          style={{ background: DH.primary }}
        />
        <span
          className="text-[10px] font-mono uppercase tracking-[0.22em]"
          style={{ color: DH.muted }}
        >
          live surfaces
        </span>
      </div>
    </nav>
  );
}

function SceneIcon({ scene, active }: { scene: Scene; active: boolean }) {
  const c = active ? "#fff" : DH.muted;
  if (scene === "video")
    return (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="6" width="13" height="12" rx="2" stroke={c} strokeWidth="2" />
        <path d="M16 10l5-3v10l-5-3" stroke={c} strokeWidth="2" strokeLinejoin="round" />
      </svg>
    );
  if (scene === "compose")
    return (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
        <rect x="4" y="4" width="16" height="16" rx="3" stroke={c} strokeWidth="2" />
        <path d="M8 10h8M8 14h5" stroke={c} strokeWidth="2" strokeLinecap="round" />
      </svg>
    );
  if (scene === "chat")
    return (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
        <path
          d="M4 5h16v11H9l-5 4V5z"
          stroke={c}
          strokeWidth="2"
          strokeLinejoin="round"
        />
      </svg>
    );
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <circle cx="9" cy="9" r="4" stroke={c} strokeWidth="2" />
      <path d="M3 19c1-3 4-5 6-5s5 2 6 5" stroke={c} strokeWidth="2" strokeLinecap="round" />
      <path d="M15 13l2 2 4-4" stroke={DH.primary} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ====================================================================
// SCENE 1 — VIDEO RESUME (the product's signature surface)
// ====================================================================

function VideoResumeScene() {
  const [recording, setRecording] = useState(true);
  const [elapsed, setElapsed] = useState(0);
  const [barPhase, setBarPhase] = useState(0);
  useEffect(() => {
    if (!recording) return;
    const id = setInterval(() => {
      setElapsed((t) => (t >= 60 ? 60 : t + 1));
      setBarPhase((p) => (p + 1) % 1000);
    }, 1000);
    return () => clearInterval(id);
  }, [recording]);

  const transcript = [
    "Hi, I'm Haider.",
    "I've been designing products for six years,",
    "shipping for three of those as a PM.",
    "Recently I've been deep in AI chat surfaces…",
  ];
  const shown = Math.min(transcript.length, Math.floor(elapsed / 3) + 1);

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-[960px] mx-auto px-10 py-8 grid grid-cols-[1.15fr_1fr] gap-6">
        {/* Camera frame */}
        <div
          className="rounded-2xl overflow-hidden relative aspect-[4/3]"
          style={{
            background: "linear-gradient(135deg, #0f172a 0%, #1f2937 100%)",
            boxShadow: "0 24px 60px -28px rgba(15,23,42,0.6)",
          }}
        >
          {/* Soft blob "subject" behind face marker so it feels like a real viewfinder */}
          <div
            className="absolute left-1/2 top-[40%] -translate-x-1/2 -translate-y-1/2 w-56 h-56 rounded-full"
            style={{ background: "#e2e8f0", opacity: 0.08, filter: "blur(40px)" }}
          />
          {/* Grid */}
          <svg
            viewBox="0 0 100 75"
            preserveAspectRatio="none"
            className="absolute inset-0 w-full h-full opacity-20"
          >
            <path d="M33 0V75M66 0V75M0 25H100M0 50H100" stroke="#fff" strokeWidth="0.15" />
          </svg>
          {/* Face marker */}
          <svg
            viewBox="0 0 400 300"
            className="absolute inset-0 w-full h-full"
          >
            <rect
              x="135"
              y="65"
              width="130"
              height="160"
              rx="18"
              fill="none"
              stroke={DH.primary}
              strokeWidth="2"
              strokeDasharray="6 8"
              opacity="0.85"
            />
            <circle cx="175" cy="125" r="4" fill={DH.primary} />
            <circle cx="225" cy="125" r="4" fill={DH.primary} />
            <path
              d="M 170 170 Q 200 190 230 170"
              stroke={DH.primary}
              strokeWidth="2.5"
              fill="none"
              strokeLinecap="round"
            />
            <text
              x="135"
              y="55"
              fill={DH.primary}
              fontSize="11"
              fontFamily="ui-monospace, monospace"
              letterSpacing="2"
            >
              FACE · LOCKED
            </text>
          </svg>

          {/* Top bar */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
            <div
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono uppercase tracking-[0.22em]"
              style={{ background: DH.danger, color: "#fff" }}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
              {recording ? "rec" : "paused"}
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono uppercase tracking-[0.22em]"
              style={{ background: "rgba(255,255,255,0.12)", color: "#fff", backdropFilter: "blur(8px)" }}
            >
              <span>00:{(60 - elapsed).toString().padStart(2, "0")}</span>
              <span className="opacity-60">/ 01:00</span>
            </div>
          </div>

          {/* Waveform */}
          <div className="absolute bottom-4 left-4 right-4 h-[32px] flex items-end gap-[2px]">
            {Array.from({ length: 44 }).map((_, i) => {
              const h =
                6 +
                Math.abs(Math.sin((barPhase + i * 24) / 36)) * 26 +
                Math.abs(Math.sin((barPhase + i * 15) / 22)) * 6;
              return (
                <div
                  key={i}
                  className="flex-1 rounded-full transition-[height] duration-150"
                  style={{
                    height: recording ? `${h}px` : "6px",
                    background: DH.primary,
                    opacity: 0.85,
                  }}
                />
              );
            })}
          </div>
        </div>

        {/* Controls + transcript */}
        <div className="flex flex-col gap-4">
          <div>
            <p
              className="text-[10px] font-mono uppercase tracking-[0.22em] mb-1"
              style={{ color: DH.aiPurple }}
            >
              The product&apos;s signature surface
            </p>
            <h3 className="text-[22px] font-semibold leading-tight tracking-tight" style={{ color: DH.ink }}>
              Video resumes, sixty seconds, with a live transcript.
            </h3>
          </div>

          {/* Controls */}
          <div
            className="rounded-2xl p-4 flex items-center gap-3"
            style={{ background: DH.card, border: `1px solid ${DH.border}` }}
          >
            <button
              onClick={() => setRecording((r) => !r)}
              className="h-11 w-11 rounded-full flex items-center justify-center transition-transform hover:scale-105"
              style={{
                background: DH.danger,
                boxShadow: `0 10px 22px -10px ${DH.danger}aa`,
              }}
              aria-label={recording ? "pause" : "record"}
            >
              {recording ? (
                <svg width="14" height="14" viewBox="0 0 14 14">
                  <rect x="3" y="3" width="3" height="8" rx="1" fill="#fff" />
                  <rect x="8" y="3" width="3" height="8" rx="1" fill="#fff" />
                </svg>
              ) : (
                <div className="h-3.5 w-3.5 rounded-full bg-white" />
              )}
            </button>
            <button
              onClick={() => setElapsed(0)}
              className="h-11 px-4 rounded-full text-[13px] font-medium transition-colors"
              style={{
                background: DH.paper,
                border: `1px solid ${DH.border}`,
                color: DH.inkSoft,
              }}
            >
              Retake
            </button>
            <div className="ml-auto text-right">
              <p className="text-[10px] font-mono uppercase tracking-[0.22em]" style={{ color: DH.muted }}>
                target
              </p>
              <p className="text-[14px] font-semibold" style={{ color: DH.ink }}>
                60s max
              </p>
            </div>
          </div>

          {/* Transcript */}
          <div
            className="rounded-2xl p-4 flex-1"
            style={{ background: DH.card, border: `1px solid ${DH.border}` }}
          >
            <div className="flex items-center gap-2 mb-3">
              <span
                className="h-2 w-2 rounded-full animate-pulse"
                style={{ background: DH.primary }}
              />
              <p
                className="text-[10px] font-mono uppercase tracking-[0.22em]"
                style={{ color: DH.muted }}
              >
                Live transcript · whisper streaming
              </p>
            </div>
            <div className="space-y-1.5">
              {transcript.slice(0, shown).map((line, i) => (
                <p
                  key={i}
                  className="text-[13px] leading-relaxed"
                  style={{
                    color: i === shown - 1 ? DH.ink : DH.inkSoft,
                    opacity: i === shown - 1 ? 1 : 0.7,
                  }}
                >
                  {line}
                </p>
              ))}
              {shown < transcript.length && (
                <span
                  className="inline-block w-2 h-[14px] align-middle"
                  style={{ background: DH.ink }}
                />
              )}
            </div>
          </div>

          <p className="text-[11px]" style={{ color: DH.muted }}>
            Face-lock overlay uses the product&apos;s own face_marker
            asset. Transcript streams over the same SSE pipe the chat
            service uses.
          </p>
        </div>
      </div>
    </div>
  );
}

// ====================================================================
// SCENE 2 — JOB COMPOSER (taxonomy tokens click into a live card)
// ====================================================================

const TAXONOMY = [
  { token: "workplaceType", bg: DH.workplaceType, options: ["Remote", "Hybrid", "On-site"] },
  { token: "jobType", bg: DH.jobType, options: ["Full-time", "Part-time", "Contract"] },
  { token: "experienceLevel", bg: DH.experienceLevel, options: ["Junior", "Mid", "Mid-senior", "Senior"] },
  { token: "compensation", bg: DH.compensation, options: ["$80k — $120k", "$120k — $160k", "$160k+"] },
  { token: "education", bg: DH.education, options: ["Bachelor's+", "Master's+", "Any"] },
];

function JobComposerScene() {
  const [picks, setPicks] = useState<Record<string, string>>({
    workplaceType: "Remote",
    jobType: "Full-time",
    experienceLevel: "Mid-senior",
    compensation: "$120k — $160k",
    education: "Bachelor's+",
  });
  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-[960px] mx-auto px-10 py-8 grid grid-cols-[1fr_1.1fr] gap-6">
        {/* Left: token pickers */}
        <div>
          <p
            className="text-[10px] font-mono uppercase tracking-[0.22em] mb-1"
            style={{ color: DH.aiPurple }}
          >
            Click a chip — watch the card rebuild
          </p>
          <h3 className="text-[22px] font-semibold leading-tight tracking-tight mb-4" style={{ color: DH.ink }}>
            Every job post is five tokens.
          </h3>

          <div className="space-y-3">
            {TAXONOMY.map((row) => (
              <div
                key={row.token}
                className="rounded-xl p-3"
                style={{ background: DH.card, border: `1px solid ${DH.border}` }}
              >
                <p
                  className="text-[10px] font-mono mb-2"
                  style={{ color: DH.muted }}
                >
                  {row.token}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {row.options.map((opt) => {
                    const active = picks[row.token] === opt;
                    return (
                      <button
                        key={opt}
                        onClick={() =>
                          setPicks((p) => ({ ...p, [row.token]: opt }))
                        }
                        className="text-[11.5px] px-2.5 py-1 rounded-md transition-all"
                        style={{
                          background: active ? row.bg : DH.paper,
                          color: DH.ink,
                          border: `1px solid ${active ? "transparent" : DH.border}`,
                          boxShadow: active
                            ? `0 4px 12px -6px rgba(15,23,42,0.18)`
                            : "none",
                          transform: active ? "translateY(-1px)" : "none",
                        }}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: live card */}
        <div className="flex flex-col gap-4">
          <p
            className="text-[10px] font-mono uppercase tracking-[0.22em]"
            style={{ color: DH.muted }}
          >
            Preview · AiJobCardItem
          </p>
          <div
            className="rounded-2xl p-5"
            style={{
              background: DH.card,
              border: `1px solid ${DH.border}`,
              boxShadow: "0 18px 40px -22px rgba(15,23,42,0.25)",
            }}
          >
            <p className="text-[15px] font-semibold" style={{ color: DH.ink }}>
              Senior Frontend Engineer{" "}
              <span className="font-normal" style={{ color: DH.inkSoft }}>
                at Acme Studios
              </span>
            </p>
            <div className="mt-1.5 flex items-center gap-1.5 text-[12px]" style={{ color: DH.muted }}>
              <span>{picks.workplaceType}</span>
              <span className="h-[3px] w-[3px] rounded-full" style={{ background: DH.muted }} />
              <span>Karachi or remote</span>
              <span className="h-[3px] w-[3px] rounded-full" style={{ background: DH.muted }} />
              <span>{picks.jobType}</span>
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {TAXONOMY.map((row) => (
                <span
                  key={row.token}
                  className="text-[11px] px-2 py-[3px] rounded-md"
                  style={{ background: row.bg, color: DH.ink }}
                >
                  {picks[row.token]}
                </span>
              ))}
            </div>
            <div
              className="mt-4 pt-3 flex items-center justify-between"
              style={{ borderTop: `1px solid ${DH.border}` }}
            >
              <span className="text-[11px]" style={{ color: DH.muted }}>
                4 days ago
              </span>
              <span
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px]"
                style={{ background: DH.primarySoft, color: DH.primaryDark }}
              >
                <span className="h-1.5 w-1.5 rounded-full" style={{ background: DH.primary }} />
                Actively hiring
              </span>
            </div>
          </div>

          <button
            className="rounded-xl px-4 py-3 text-[14px] font-semibold text-white transition-opacity hover:opacity-90 flex items-center justify-center gap-2"
            style={{
              background: DH.primary,
              boxShadow: `0 10px 24px -10px ${DH.primary}aa`,
            }}
          >
            Post this job
            <span>→</span>
          </button>

          <p className="text-[11px]" style={{ color: DH.muted }}>
            Tokens are named after meaning, not color. A junior designer
            can&apos;t pick the &ldquo;wrong pink&rdquo; by accident.
          </p>
        </div>
      </div>
    </div>
  );
}

// ====================================================================
// SCENE 3 — AI CHAT
// ====================================================================

type Persona = "employer" | "applicant";

const PROMPTS: Record<Persona, { text: string; tool: string; result: string }[]> = {
  employer: [
    {
      text: "find senior frontend candidates in Karachi",
      tool: "searchApplicant",
      result: "Found 24 candidates · top 3 shown below",
    },
    {
      text: "draft a job post for a senior product designer",
      tool: "createJobAd",
      result: "Drafted · review before posting",
    },
    {
      text: "book an interview with Ayesha at 3pm Friday",
      tool: "createInterviewRequest",
      result: "Interview scheduled · invite sent",
    },
  ],
  applicant: [
    {
      text: "help me prep for a frontend interview",
      tool: "answerFAQ",
      result: "Here are the three things I&apos;d practice first",
    },
    {
      text: "show remote roles hiring this week",
      tool: "searchJob",
      result: "12 remote roles · sorted by recency",
    },
  ],
};

function AiChatScene() {
  const [persona, setPersona] = useState<Persona>("employer");
  const [activeIdx, setActiveIdx] = useState(0);
  const prompts = PROMPTS[persona];
  const active = prompts[activeIdx];

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-[960px] mx-auto px-10 py-8">
        {/* Persona switcher */}
        <div className="flex items-center gap-2 mb-5">
          {(["employer", "applicant"] as Persona[]).map((p) => {
            const sel = persona === p;
            return (
              <button
                key={p}
                onClick={() => {
                  setPersona(p);
                  setActiveIdx(0);
                }}
                className="h-10 px-4 rounded-full text-[13px] font-medium transition-all flex items-center gap-2"
                style={{
                  background: sel ? DH.ink : DH.paper,
                  color: sel ? "#fff" : DH.inkSoft,
                  border: `1px solid ${sel ? "transparent" : DH.border}`,
                }}
              >
                <span
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ background: sel ? DH.primary : DH.muted }}
                />
                {p === "employer" ? "Employer" : "Applicant"} persona
              </button>
            );
          })}
          <span className="ml-auto text-[11px]" style={{ color: DH.muted }}>
            ~80% of traffic hits keyword routing, never touches the LLM
          </span>
        </div>

        <div className="grid grid-cols-[1fr_1fr] gap-4">
          {/* Left: prompt pills */}
          <div
            className="rounded-2xl p-4"
            style={{ background: DH.card, border: `1px solid ${DH.border}` }}
          >
            <p
              className="text-[10px] font-mono uppercase tracking-[0.22em] mb-3"
              style={{ color: DH.muted }}
            >
              Try a prompt
            </p>
            <div className="space-y-2">
              {prompts.map((p, i) => {
                const sel = i === activeIdx;
                return (
                  <button
                    key={p.text}
                    onClick={() => setActiveIdx(i)}
                    className="w-full text-left rounded-xl px-3.5 py-2.5 transition-all"
                    style={{
                      background: sel ? DH.paper : DH.paperAlt,
                      border: `1px solid ${sel ? DH.ink : DH.border}`,
                    }}
                  >
                    <p className="text-[13px]" style={{ color: DH.ink }}>
                      &ldquo;{p.text}&rdquo;
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right: chat surface */}
          <div
            className="rounded-2xl p-4 flex flex-col gap-3"
            style={{ background: DH.paper, border: `1px solid ${DH.border}`, minHeight: 300 }}
          >
            <div className="flex items-center gap-2 pb-3" style={{ borderBottom: `1px solid ${DH.borderSoft}` }}>
              <div
                className="h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white"
                style={{ background: DH.ink }}
              >
                {persona === "employer" ? "E" : "A"}
              </div>
              <p className="text-[12.5px]" style={{ color: DH.inkSoft }}>
                {persona === "employer" ? "Employer" : "Applicant"} · with DigitalHire
              </p>
              <span className="ml-auto text-[10px] font-mono" style={{ color: DH.muted }}>
                via chat-management-service-v2
              </span>
            </div>

            <div className="flex justify-end">
              <div
                className="text-[13px] leading-snug px-3 py-2 rounded-xl max-w-[80%] text-right"
                style={{ background: DH.primary, color: "#fff" }}
              >
                {active.text}
              </div>
            </div>

            <div
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md self-start"
              style={{ background: DH.aiPurpleSoft, border: `1px solid ${DH.aiPurple}55` }}
            >
              <span className="h-1.5 w-1.5 rounded-full animate-pulse" style={{ background: DH.success }} />
              <span className="text-[11px] font-mono" style={{ color: DH.aiPurple }}>
                {active.tool}
              </span>
              <span className="text-[10px] font-mono" style={{ color: DH.muted }}>
                · tool call
              </span>
            </div>

            <div className="flex justify-start">
              <div
                className="text-[13px] leading-snug px-3 py-2 rounded-xl max-w-[85%]"
                style={{ background: DH.paperAlt, color: DH.ink, border: `1px solid ${DH.border}` }}
                dangerouslySetInnerHTML={{ __html: active.result }}
              />
            </div>

            <div
              className="mt-auto pt-3 flex items-center gap-2"
              style={{ borderTop: `1px solid ${DH.borderSoft}` }}
            >
              <div
                className="flex-1 rounded-full px-3 py-2 text-[12px]"
                style={{
                  background: DH.paper,
                  border: `1px solid ${DH.aiPurple}55`,
                  boxShadow: `0 0 0 3px ${DH.aiPurple}10`,
                  color: DH.muted,
                }}
              >
                ask me anything…
              </div>
              <div
                className="h-9 w-9 rounded-full flex items-center justify-center text-white"
                style={{ background: DH.aiPurple }}
              >
                ↑
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ====================================================================
// SCENE 4 — CANDIDATE MATCH (Employer dashboard with a live match feed)
// ====================================================================

const CANDIDATES = [
  {
    name: "Ayesha Khan",
    role: "Senior Frontend Engineer",
    exp: "6 yrs · Karachi · Remote OK",
    match: 94,
    skills: ["TypeScript", "React", "Design systems"],
  },
  {
    name: "Daniyal Rashid",
    role: "Senior Frontend Engineer",
    exp: "5 yrs · Lahore · Hybrid",
    match: 89,
    skills: ["React", "Next.js", "GraphQL"],
  },
  {
    name: "Hira Naseem",
    role: "Mid-senior FE",
    exp: "4 yrs · Islamabad · Remote",
    match: 81,
    skills: ["Vue", "TypeScript"],
  },
];

function CandidateMatchScene() {
  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-[960px] mx-auto px-10 py-8">
        <div className="flex items-end justify-between mb-5">
          <div>
            <p
              className="text-[10px] font-mono uppercase tracking-[0.22em] mb-1"
              style={{ color: DH.aiPurple }}
            >
              Employer side · live match feed
            </p>
            <h3 className="text-[22px] font-semibold leading-tight tracking-tight" style={{ color: DH.ink }}>
              Matches stream in the moment a job goes live.
            </h3>
          </div>
          <div
            className="flex items-center gap-2 px-3 py-1.5 rounded-full"
            style={{ background: DH.primarySoft, border: `1px solid ${DH.primary}33` }}
          >
            <span className="h-2 w-2 rounded-full animate-pulse" style={{ background: DH.primary }} />
            <span className="text-[11px] font-medium" style={{ color: DH.primaryDark }}>
              24 new today
            </span>
          </div>
        </div>

        {/* Candidate rows */}
        <div className="space-y-2">
          {CANDIDATES.map((c, i) => (
            <div
              key={c.name}
              className="rounded-2xl p-4 grid grid-cols-[auto_1fr_auto_auto] items-center gap-4"
              style={{
                background: i === 0 ? DH.primarySofter : DH.card,
                border: `1px solid ${i === 0 ? `${DH.primary}33` : DH.border}`,
              }}
            >
              {/* Video thumb — uniform, monochrome */}
              <div
                className="h-14 w-14 rounded-xl overflow-hidden relative flex items-center justify-center text-white font-semibold"
                style={{ background: `linear-gradient(135deg, #1f2937, #0f172a)` }}
              >
                <span>{c.name.charAt(0)}</span>
                <span
                  className="absolute bottom-1 right-1 h-3.5 w-3.5 rounded-full flex items-center justify-center"
                  style={{ background: "rgba(255,255,255,0.18)" }}
                >
                  <svg width="8" height="8" viewBox="0 0 10 10" fill="#fff">
                    <polygon points="2,1 9,5 2,9" />
                  </svg>
                </span>
              </div>
              {/* Name + skills */}
              <div className="min-w-0">
                <p className="text-[14px] font-semibold" style={{ color: DH.ink }}>
                  {c.name}
                </p>
                <p className="text-[12px]" style={{ color: DH.muted }}>
                  {c.role} · {c.exp}
                </p>
                <div className="mt-1.5 flex flex-wrap gap-1">
                  {c.skills.map((s) => (
                    <span
                      key={s}
                      className="text-[10px] px-1.5 py-0.5 rounded"
                      style={{
                        background: DH.paper,
                        border: `1px solid ${DH.border}`,
                        color: DH.inkSoft,
                      }}
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
              {/* Match bar — uniform green */}
              <div className="w-32">
                <div
                  className="h-1.5 rounded-full overflow-hidden"
                  style={{ background: DH.paperAlt }}
                >
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${c.match}%`, background: DH.primary }}
                  />
                </div>
                <p
                  className="mt-1 text-[10px] font-mono uppercase tracking-[0.18em]"
                  style={{ color: DH.muted }}
                >
                  match · {c.match}%
                </p>
              </div>
              {/* Actions */}
              <div className="flex items-center gap-1.5">
                <button
                  className="h-9 px-3 rounded-full text-[11px] font-medium"
                  style={{
                    background: DH.paper,
                    border: `1px solid ${DH.border}`,
                    color: DH.inkSoft,
                  }}
                >
                  Skip
                </button>
                <button
                  className="h-9 px-3.5 rounded-full text-[11px] font-semibold text-white"
                  style={{
                    background: i === 0 ? DH.primary : DH.ink,
                  }}
                >
                  Book interview
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Metric strip — single ink tone */}
        <div className="mt-6 grid grid-cols-4 gap-3">
          <DashStat label="jobs live" value="312" />
          <DashStat label="applications this week" value="1.4k" />
          <DashStat label="interviews scheduled" value="78" />
          <DashStat label="median time-to-reply" value="6h" />
        </div>
      </div>
    </div>
  );
}

function DashStat({ label, value }: { label: string; value: string }) {
  return (
    <div
      className="rounded-xl p-3"
      style={{ background: DH.card, border: `1px solid ${DH.border}` }}
    >
      <p className="text-[20px] font-semibold leading-none" style={{ color: DH.ink }}>
        {value}
      </p>
      <p className="mt-1.5 text-[10.5px]" style={{ color: DH.muted }}>
        {label}
      </p>
    </div>
  );
}
