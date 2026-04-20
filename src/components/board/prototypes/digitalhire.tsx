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
// SCENE 1 — VIDEO RESUME
// Real product is a question-based flow (3+ prompts per resume).
// States follow the Flutter view model: preRecording · postRecording ·
// preview. Chrome is minimal: dark surface, rounded 24, an X to exit,
// and a 'Show/Hide question' pill. No invented face-lock or waveform.
// ====================================================================

const RESUME_QUESTIONS = [
  {
    short: "Introduce yourself",
    full: "Give us a quick introduction. Where you are, what you do, and what kind of role you're looking for next.",
  },
  {
    short: "A project you're proud of",
    full: "Walk us through a project you shipped recently. What was your role, and what did you learn from it?",
  },
  {
    short: "Why this role",
    full: "What makes you excited about this role? One specific thing is better than three vague ones.",
  },
];

type ResumeState = "preRecording" | "postRecording" | "preview";

function VideoResumeScene() {
  const [qIdx, setQIdx] = useState(0);
  const [state, setState] = useState<ResumeState>("preRecording");
  const [questionVisible, setQuestionVisible] = useState(true);
  const [recorded, setRecorded] = useState<boolean[]>([false, false, false]);

  const isLast = qIdx === RESUME_QUESTIONS.length - 1;
  const allDone = recorded.every(Boolean);

  const onRecord = () => {
    setRecorded((r) => r.map((v, i) => (i === qIdx ? true : v)));
    setState("postRecording");
  };
  const onReattempt = () => setState("preRecording");
  const onNext = () => {
    if (isLast) {
      setState("preview");
    } else {
      setQIdx((i) => i + 1);
      setState("preRecording");
    }
  };
  const onExit = () => {
    setQIdx(0);
    setState("preRecording");
    setRecorded([false, false, false]);
  };

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-[960px] mx-auto px-10 py-8 grid grid-cols-[1.1fr_1fr] gap-7">
        {/* Camera frame — portrait 9/16, dark surface, rounded 24 */}
        <div className="flex justify-center">
          <div
            className="relative overflow-hidden flex flex-col"
            style={{
              width: 296,
              height: 520,
              borderRadius: 24,
              background: "#030712", // surfaceDark
              boxShadow: "0 28px 70px -30px rgba(3,7,18,0.65)",
            }}
          >
            {/* Subtle radial glow so dark surface doesn't look dead */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(120% 80% at 50% 20%, rgba(255,255,255,0.06), transparent 60%)",
              }}
            />

            {/* Top chrome: X to exit + question counter */}
            <div className="relative flex items-center justify-between px-4 pt-4">
              <button
                onClick={onExit}
                className="h-7 w-7 rounded-full flex items-center justify-center"
                style={{ background: "rgba(255,255,255,0.1)" }}
                aria-label="Exit"
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path
                    d="M3 3l6 6M9 3l-6 6"
                    stroke="#fff"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
              <div className="flex items-center gap-1">
                {RESUME_QUESTIONS.map((_, i) => (
                  <span
                    key={i}
                    className="h-1 rounded-full transition-all"
                    style={{
                      width: i === qIdx ? 20 : 4,
                      background:
                        recorded[i] || i === qIdx
                          ? DH.primary
                          : "rgba(255,255,255,0.25)",
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Body */}
            {state === "preRecording" && (
              <div className="flex-1 relative">
                {/* Viewfinder placeholder — subtle head silhouette */}
                <div className="absolute inset-0 flex items-end justify-center pb-24">
                  <div
                    className="w-28 h-28 rounded-full"
                    style={{
                      background:
                        "radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%)",
                    }}
                  />
                </div>

                {/* Question overlay */}
                {questionVisible && (
                  <div className="absolute left-4 right-4 top-20">
                    <div
                      className="rounded-2xl px-4 py-3"
                      style={{
                        background: "rgba(255,255,255,0.08)",
                        backdropFilter: "blur(14px)",
                        border: "1px solid rgba(255,255,255,0.14)",
                      }}
                    >
                      <p
                        className="text-[10px] font-mono uppercase tracking-[0.2em] mb-1.5"
                        style={{ color: "rgba(255,255,255,0.6)" }}
                      >
                        Question {qIdx + 1}
                      </p>
                      <p
                        className="text-[14px] leading-[1.45]"
                        style={{ color: "#fff" }}
                      >
                        {RESUME_QUESTIONS[qIdx].full}
                      </p>
                    </div>
                  </div>
                )}

                {/* Show/hide question pill + record button */}
                <div className="absolute left-0 right-0 bottom-6 flex flex-col items-center gap-3">
                  <button
                    onClick={() => setQuestionVisible((v) => !v)}
                    className="px-3 py-1.5 rounded-full text-[12px]"
                    style={{
                      background: "rgba(255,255,255,0.1)",
                      color: "#fff",
                    }}
                  >
                    {questionVisible ? "Hide question" : "Show question"}
                  </button>
                  <button
                    onClick={onRecord}
                    className="h-14 w-14 rounded-full flex items-center justify-center transition-transform hover:scale-105"
                    style={{
                      background: "#fff",
                      boxShadow: "0 0 0 4px rgba(255,255,255,0.15)",
                    }}
                    aria-label="Record"
                  >
                    <span
                      className="block h-10 w-10 rounded-full"
                      style={{ background: DH.danger }}
                    />
                  </button>
                </div>
              </div>
            )}

            {state === "postRecording" && (
              <div className="flex-1 relative">
                {/* Playback placeholder */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div
                    className="h-14 w-14 rounded-full flex items-center justify-center"
                    style={{ background: "rgba(255,255,255,0.14)" }}
                  >
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="#fff">
                      <polygon points="4,2 15,9 4,16" />
                    </svg>
                  </div>
                </div>

                <div className="absolute left-0 right-0 bottom-6 flex items-center justify-center gap-2.5 px-4">
                  <button
                    onClick={onReattempt}
                    className="h-10 px-4 rounded-full text-[13px] font-medium"
                    style={{
                      background: "rgba(255,255,255,0.14)",
                      color: "#fff",
                    }}
                  >
                    Re-attempt
                  </button>
                  <button
                    onClick={onNext}
                    className="h-10 px-4 rounded-full text-[13px] font-semibold flex items-center gap-1.5"
                    style={{ background: DH.primary, color: "#fff" }}
                  >
                    {isLast ? "Final Preview" : "Next Question"}
                    <span>→</span>
                  </button>
                </div>
              </div>
            )}

            {state === "preview" && (
              <div className="flex-1 relative px-4 py-5 flex flex-col gap-2">
                <p
                  className="text-[10px] font-mono uppercase tracking-[0.22em]"
                  style={{ color: "rgba(255,255,255,0.55)" }}
                >
                  Your resume · {RESUME_QUESTIONS.length} clips
                </p>
                <div className="space-y-1.5 mt-1">
                  {RESUME_QUESTIONS.map((q, i) => (
                    <div
                      key={i}
                      className="rounded-xl px-3 py-2 flex items-center gap-2.5"
                      style={{ background: "rgba(255,255,255,0.07)" }}
                    >
                      <span
                        className="h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-mono"
                        style={{
                          background: "rgba(255,255,255,0.14)",
                          color: "#fff",
                        }}
                      >
                        {i + 1}
                      </span>
                      <p
                        className="text-[12px] leading-snug"
                        style={{ color: "#fff" }}
                      >
                        {q.short}
                      </p>
                      <span
                        className="ml-auto text-[10px] font-mono"
                        style={{ color: "rgba(255,255,255,0.5)" }}
                      >
                        00:{(20 + i * 3).toString().padStart(2, "0")}
                      </span>
                    </div>
                  ))}
                </div>
                <button
                  onClick={onNext}
                  className="mt-auto h-11 rounded-full text-[13px] font-semibold flex items-center justify-center gap-1.5"
                  style={{ background: DH.primary, color: "#fff" }}
                  disabled
                >
                  Confirm
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path
                      d="M2.5 6.5l2.5 2.5 4.5-5"
                      stroke="#fff"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right rail: context */}
        <div className="flex flex-col gap-4 pt-2">
          <div>
            <p
              className="text-[10px] font-mono uppercase tracking-[0.22em] mb-1.5"
              style={{ color: DH.aiPurple }}
            >
              {state === "preview"
                ? "Final preview before upload"
                : state === "postRecording"
                  ? "Playback · accept or re-attempt"
                  : `Question ${qIdx + 1} of ${RESUME_QUESTIONS.length}`}
            </p>
            <h3
              className="text-[22px] font-semibold leading-tight tracking-tight"
              style={{ color: DH.ink }}
            >
              {state === "preview"
                ? "Three short clips become one resume."
                : "A resume is a few short answers on camera."}
            </h3>
            <p
              className="mt-2 text-[13.5px] leading-relaxed"
              style={{ color: DH.inkSoft }}
            >
              Applicants answer a short list of questions on camera, one
              at a time. Re-attempt until each clip feels right, then
              confirm the set. No editing timeline, no uploads from disk.
            </p>
          </div>

          {/* Step rail */}
          <div
            className="rounded-2xl p-2"
            style={{ background: DH.card, border: `1px solid ${DH.border}` }}
          >
            {RESUME_QUESTIONS.map((q, i) => {
              const active = i === qIdx;
              return (
                <button
                  key={q.short}
                  onClick={() => {
                    setQIdx(i);
                    setState("preRecording");
                  }}
                  className="w-full text-left rounded-xl px-3 py-2.5 flex items-center gap-3 transition-colors"
                  style={{
                    background: active ? DH.primarySofter : "transparent",
                  }}
                >
                  <span
                    className="h-7 w-7 rounded-full flex items-center justify-center text-[11px] font-semibold"
                    style={{
                      background: recorded[i]
                        ? DH.primary
                        : active
                          ? DH.paper
                          : DH.paperAlt,
                      color: recorded[i]
                        ? "#fff"
                        : active
                          ? DH.ink
                          : DH.inkSoft,
                      border: `1px solid ${recorded[i] ? "transparent" : DH.border}`,
                    }}
                  >
                    {recorded[i] ? (
                      <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                        <path
                          d="M2.5 6.5l2.5 2.5 4.5-5"
                          stroke="#fff"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    ) : (
                      i + 1
                    )}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p
                      className="text-[13px] font-medium leading-snug"
                      style={{ color: DH.ink }}
                    >
                      {q.short}
                    </p>
                    <p
                      className="text-[11px] leading-snug mt-0.5 truncate"
                      style={{ color: DH.muted }}
                    >
                      {recorded[i] ? "Recorded · tap to re-attempt" : "Pending"}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          <p
            className="text-[11px]"
            style={{ color: allDone ? DH.primaryDark : DH.muted }}
          >
            {allDone
              ? "All three clips captured. Confirm to upload."
              : "Record one clip at a time. Re-attempt freely until it's right."}
          </p>
        </div>
      </div>
    </div>
  );
}

// ====================================================================
// SCENE 2 — JOB COMPOSER
// Real flow is a nine-step wizard (title → workplace → type → level →
// education → compensation → location → skills → benefits). Each step
// has a PageTitle, a helper, an input, and a progress bar at the
// bottom. This scene lets the viewer click through the same steps with
// the same staged page-title/helper/input layout, and the accumulated
// draft card rebuilds as they go.
// ====================================================================

type JobStep = {
  key: string;
  label: string;
  title: string;
  helper: string;
  hint: string;
  value: string;
  chipBg?: string;
};

const JOB_STEPS: JobStep[] = [
  {
    key: "title",
    label: "Title",
    title: "Which position are you looking to fill?",
    helper:
      "This information will assist us in crafting your job description.",
    hint: "Add the job title you are hiring for",
    value: "Senior Frontend Engineer",
  },
  {
    key: "workplace",
    label: "Workplace",
    title: "Remote, hybrid, or on-site?",
    helper:
      "This tells applicants how their day-to-day will feel before they read a single line.",
    hint: "Pick the arrangement for this role",
    value: "Remote",
    chipBg: DH.workplaceType,
  },
  {
    key: "type",
    label: "Type",
    title: "Is this a full-time, part-time, or contract role?",
    helper: "We use this to route the post to the right talent pools.",
    hint: "Select the employment type",
    value: "Full-time",
    chipBg: DH.jobType,
  },
  {
    key: "experience",
    label: "Experience",
    title: "How senior is this role?",
    helper: "Level filtering is the #1 thing candidates use to self-qualify.",
    hint: "Choose a level",
    value: "Mid-senior",
    chipBg: DH.experienceLevel,
  },
  {
    key: "compensation",
    label: "Compensation",
    title: "What's the pay range?",
    helper:
      "Posts with a salary band get 3× more applications on DigitalHire.",
    hint: "Set a min and max",
    value: "$120k — $160k",
    chipBg: DH.compensation,
  },
  {
    key: "education",
    label: "Education",
    title: "Any education requirement?",
    helper:
      "Don't filter people out unless you really mean it. &ldquo;Any&rdquo; is a fine answer.",
    hint: "Pick one",
    value: "Bachelor's+",
    chipBg: DH.education,
  },
  {
    key: "location",
    label: "Location",
    title: "Where is this role based?",
    helper: "Even remote roles usually have a region or a timezone.",
    hint: "City, country, or region",
    value: "Karachi, PK · remote-friendly",
  },
  {
    key: "skills",
    label: "Skills",
    title: "Which skills matter most?",
    helper:
      "Add three to six. We'll use them to match candidates against the brief.",
    hint: "Type a skill and press enter",
    value: "TypeScript · React · Design systems",
  },
  {
    key: "benefits",
    label: "Benefits",
    title: "Anything candidates should get excited about?",
    helper:
      "Equity, time off, learning budget, flexible hours — whatever makes your offer real.",
    hint: "Comma-separated list",
    value: "Equity · Annual learning budget · Flexible hours",
  },
];

function JobComposerScene() {
  const [stepIdx, setStepIdx] = useState(0);
  const [filled, setFilled] = useState<Record<string, boolean>>({
    title: true,
    workplace: true,
    type: true,
    experience: true,
    compensation: true,
  });
  const step = JOB_STEPS[stepIdx];
  const progress = stepIdx / (JOB_STEPS.length - 1);

  const next = () => {
    setFilled((f) => ({ ...f, [step.key]: true }));
    setStepIdx((i) => Math.min(i + 1, JOB_STEPS.length - 1));
  };
  const back = () => setStepIdx((i) => Math.max(i - 1, 0));

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-[960px] mx-auto px-10 py-8 grid grid-cols-[1fr_0.95fr] gap-7">
        {/* Left: the live wizard screen */}
        <div
          className="rounded-[20px] flex flex-col overflow-hidden"
          style={{
            background: DH.paper,
            border: `1px solid ${DH.border}`,
            minHeight: 520,
            boxShadow: "0 20px 44px -28px rgba(15,23,42,0.18)",
          }}
        >
          {/* Mini app bar */}
          <div
            className="flex items-center justify-between px-4 h-12"
            style={{ borderBottom: `1px solid ${DH.borderSoft}` }}
          >
            <button
              className="h-7 w-7 rounded-full flex items-center justify-center"
              style={{ background: DH.paperAlt }}
              aria-label="Cancel"
            >
              <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                <path
                  d="M3 3l6 6M9 3l-6 6"
                  stroke={DH.inkSoft}
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
              </svg>
            </button>
            <p
              className="text-[11px] font-mono uppercase tracking-[0.22em]"
              style={{ color: DH.muted }}
            >
              Step {stepIdx + 1} of {JOB_STEPS.length}
            </p>
            <span className="h-7 w-7" />
          </div>

          {/* Body — matches the Flutter PageTitle/PageDescription/AppInputField stack */}
          <div key={step.key} className="flex-1 px-5 pt-6 pb-4 flex flex-col">
            <p
              className="text-[10px] font-mono uppercase tracking-[0.22em] mb-2"
              style={{ color: DH.primary }}
            >
              {step.label}
            </p>
            <h4
              className="text-[20px] font-semibold leading-[1.2] tracking-tight"
              style={{ color: DH.ink }}
            >
              {step.title}
            </h4>
            <p
              className="mt-2 text-[13px] leading-relaxed"
              style={{ color: DH.muted }}
              dangerouslySetInnerHTML={{ __html: step.helper }}
            />

            {/* Input field — styled to mirror AppInputField */}
            <div className="mt-5">
              <p
                className="text-[10.5px] font-mono uppercase tracking-[0.18em] mb-1.5"
                style={{ color: DH.muted }}
              >
                {step.hint}
              </p>
              <div
                className="rounded-xl px-3.5 py-2.5 flex items-center justify-between"
                style={{
                  background: DH.paper,
                  border: `1px solid ${filled[step.key] ? DH.primary : DH.border}`,
                  boxShadow: filled[step.key]
                    ? `0 0 0 3px ${DH.primary}18`
                    : "none",
                }}
              >
                <span
                  className="text-[14px]"
                  style={{
                    color: filled[step.key] ? DH.ink : DH.muted,
                  }}
                >
                  {filled[step.key] ? step.value : step.hint}
                </span>
                {step.chipBg && filled[step.key] && (
                  <span
                    className="text-[11px] px-2 py-[3px] rounded-md"
                    style={{ background: step.chipBg, color: DH.ink }}
                  >
                    selected
                  </span>
                )}
              </div>
            </div>

            {/* Quick-pick chips on taxonomy steps */}
            {step.chipBg && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {getChipOptions(step.key).map((opt) => {
                  const active = step.value === opt;
                  return (
                    <button
                      key={opt}
                      onClick={() => {
                        step.value = opt;
                        setFilled((f) => ({ ...f, [step.key]: true }));
                      }}
                      className="text-[12px] px-2.5 py-1 rounded-md"
                      style={{
                        background: active ? step.chipBg : DH.paper,
                        color: DH.ink,
                        border: `1px solid ${active ? "transparent" : DH.border}`,
                      }}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Progress bar */}
          <div
            className="h-[3px] relative"
            style={{ background: DH.borderSoft }}
          >
            <div
              className="absolute inset-y-0 left-0 transition-all duration-300"
              style={{
                width: `${progress * 100}%`,
                background: DH.primary,
              }}
            />
          </div>

          {/* Footer — Back + Next */}
          <div
            className="flex items-center justify-between px-5 h-14"
            style={{ borderTop: `1px solid ${DH.borderSoft}` }}
          >
            <button
              onClick={back}
              disabled={stepIdx === 0}
              className="h-9 px-4 rounded-full text-[12.5px] font-medium transition-opacity"
              style={{
                background: DH.paperAlt,
                border: `1px solid ${DH.border}`,
                color: DH.inkSoft,
                opacity: stepIdx === 0 ? 0.4 : 1,
              }}
            >
              Back
            </button>
            <button
              onClick={next}
              className="h-9 px-4 rounded-full text-[12.5px] font-semibold text-white flex items-center gap-1.5"
              style={{ background: DH.primary }}
            >
              {stepIdx === JOB_STEPS.length - 1 ? "Generate draft" : "Next"}
              <span>→</span>
            </button>
          </div>
        </div>

        {/* Right: context + draft card that rebuilds as steps complete */}
        <div className="flex flex-col gap-4 pt-2">
          <div>
            <p
              className="text-[10px] font-mono uppercase tracking-[0.22em] mb-1.5"
              style={{ color: DH.aiPurple }}
            >
              The post flow, one question at a time
            </p>
            <h3
              className="text-[22px] font-semibold leading-tight tracking-tight"
              style={{ color: DH.ink }}
            >
              Nine steps, one page each, no giant form to abandon.
            </h3>
            <p
              className="mt-2 text-[13.5px] leading-relaxed"
              style={{ color: DH.inkSoft }}
            >
              The employer flow is a staged wizard. Every step has a
              single question, a single input, and a progress bar. The
              AI drafts the long-form description after step nine.
            </p>
          </div>

          {/* Live draft card */}
          <div
            className="rounded-[20px] p-4"
            style={{
              background: DH.card,
              border: `1px solid ${DH.border}`,
              boxShadow: "0 14px 34px -22px rgba(15,23,42,0.18)",
            }}
          >
            <p
              className="text-[10px] font-mono uppercase tracking-[0.22em] mb-2"
              style={{ color: DH.muted }}
            >
              Draft · assembling
            </p>
            <p className="text-[15px] font-semibold" style={{ color: DH.ink }}>
              {filled["title"] ? JOB_STEPS[0].value : "—"}
            </p>
            <div
              className="mt-1 flex items-center gap-1.5 text-[12px]"
              style={{ color: DH.muted }}
            >
              <span>
                {filled["workplace"] ? JOB_STEPS[1].value : "workplace"}
              </span>
              <span className="h-[3px] w-[3px] rounded-full" style={{ background: DH.muted }} />
              <span>
                {filled["type"] ? JOB_STEPS[2].value : "type"}
              </span>
              <span className="h-[3px] w-[3px] rounded-full" style={{ background: DH.muted }} />
              <span>
                {filled["experience"] ? JOB_STEPS[3].value : "level"}
              </span>
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {JOB_STEPS.filter((s) => s.chipBg && filled[s.key]).map((s) => (
                <span
                  key={s.key}
                  className="text-[11px] px-2 py-[3px] rounded-md"
                  style={{ background: s.chipBg, color: DH.ink }}
                >
                  {s.value}
                </span>
              ))}
            </div>
            {filled["location"] && (
              <p
                className="mt-3 text-[11.5px]"
                style={{ color: DH.inkSoft }}
              >
                📍 {JOB_STEPS[6].value}
              </p>
            )}
            {filled["skills"] && (
              <p
                className="mt-1.5 text-[11.5px]"
                style={{ color: DH.inkSoft }}
              >
                {JOB_STEPS[7].value}
              </p>
            )}
            {filled["benefits"] && (
              <p
                className="mt-1.5 text-[11.5px]"
                style={{ color: DH.inkSoft }}
              >
                {JOB_STEPS[8].value}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{ background: DH.aiPurple }}
            />
            <p
              className="text-[11px] font-mono uppercase tracking-[0.22em]"
              style={{ color: DH.aiPurple }}
            >
              AI drafts the description after the last step
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function getChipOptions(key: string): string[] {
  switch (key) {
    case "workplace":
      return ["Remote", "Hybrid", "On-site"];
    case "type":
      return ["Full-time", "Part-time", "Contract"];
    case "experience":
      return ["Junior", "Mid", "Mid-senior", "Senior"];
    case "compensation":
      return ["$80k — $120k", "$120k — $160k", "$160k+"];
    case "education":
      return ["Bachelor's+", "Master's+", "Any"];
    default:
      return [];
  }
}

// ====================================================================
// SCENE 3 — AI CHAT
// Real empty state from ai_chat_room_mobile_view.dart: a warm greeting
// with the user's first name + a wave emoji, centered, over a subtle
// white → #F0FFF6 gradient. Suggestion chips with leading icons are
// the real offerings the product ships. Clicking a chip fills the
// input and fires the corresponding tool call.
// ====================================================================

type Persona = "employer" | "applicant";

type Suggestion = {
  icon: "search" | "globe" | "bot" | "question" | "briefcase";
  label: string;
  tool: string;
};

const SUGGESTIONS: Record<Persona, Suggestion[]> = {
  employer: [
    {
      icon: "search",
      label: "Help me recruit talent",
      tool: "searchApplicant",
    },
    {
      icon: "globe",
      label: "Hire vetted offshore talent",
      tool: "searchApplicant",
    },
    {
      icon: "bot",
      label: "Build a custom AI agent",
      tool: "createAgent",
    },
  ],
  applicant: [
    {
      icon: "search",
      label: "Find me jobs related to frontend",
      tool: "searchJob",
    },
    {
      icon: "question",
      label: "How do I create a video resume?",
      tool: "answerFAQ",
    },
    {
      icon: "briefcase",
      label: "Show remote roles hiring this week",
      tool: "searchJob",
    },
  ],
};

function AiChatScene() {
  const [persona, setPersona] = useState<Persona>("employer");
  const [selected, setSelected] = useState<Suggestion | null>(null);
  const suggestions = SUGGESTIONS[persona];
  const greeting =
    persona === "employer"
      ? "Hey Haider! 👋"
      : "Hello! Are you hiring or job hunting?";
  const subline =
    persona === "employer"
      ? "How can I assist you today?"
      : "I've got you either way.";

  return (
    <div
      className="h-full overflow-y-auto"
      style={{
        background: "linear-gradient(180deg, #ffffff 0%, #F0FFF6 100%)",
      }}
    >
      <div className="max-w-[860px] mx-auto px-10 pt-8 pb-6 flex flex-col min-h-full">
        {/* Top row: persona toggle + chat history hint */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {(["employer", "applicant"] as Persona[]).map((p) => {
              const sel = persona === p;
              return (
                <button
                  key={p}
                  onClick={() => {
                    setPersona(p);
                    setSelected(null);
                  }}
                  className="h-9 px-3.5 rounded-full text-[12.5px] font-medium transition-all flex items-center gap-2"
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
                  {p === "employer" ? "Employer" : "Applicant"}
                </button>
              );
            })}
          </div>
          <div
            className="flex items-center gap-2 h-9 px-3 rounded-full"
            style={{ background: DH.paper, border: `1px solid ${DH.border}` }}
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path
                d="M2 4h12M2 8h12M2 12h8"
                stroke={DH.muted}
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
            <span
              className="text-[11px] font-medium"
              style={{ color: DH.inkSoft }}
            >
              Chat history
            </span>
          </div>
        </div>

        {/* Hero greeting */}
        {!selected && (
          <div className="flex-1 flex flex-col items-center justify-center text-center px-4 py-10">
            <h3
              className="text-[34px] font-semibold leading-[1.15] tracking-tight"
              style={{ color: DH.ink }}
            >
              {greeting}
            </h3>
            <p
              className="mt-1.5 text-[18px]"
              style={{ color: DH.inkSoft }}
            >
              {subline}
            </p>

            {/* Suggestion chips — AppChipType.aiSuggestion */}
            <div className="mt-8 flex flex-wrap justify-center gap-2 max-w-[560px]">
              {suggestions.map((s) => (
                <button
                  key={s.label}
                  onClick={() => setSelected(s)}
                  className="h-9 pl-2.5 pr-3.5 rounded-full text-[12.5px] font-medium flex items-center gap-2 transition-all hover:-translate-y-[1px]"
                  style={{
                    background: DH.aiPurpleSoft,
                    border: `1px solid ${DH.aiPurple}44`,
                    color: DH.aiPurple,
                  }}
                >
                  <SuggestionIcon kind={s.icon} />
                  {s.label}
                </button>
              ))}
            </div>

            <p
              className="mt-10 text-[11px] font-mono uppercase tracking-[0.22em]"
              style={{ color: DH.muted }}
            >
              Keyword router handles ~80% of prompts before the LLM sees them
            </p>
          </div>
        )}

        {/* Conversation view after a suggestion is picked */}
        {selected && (
          <div className="mt-8 space-y-4 flex-1">
            {/* User message */}
            <div className="flex justify-end">
              <div
                className="text-[14px] leading-snug px-4 py-2.5 rounded-2xl max-w-[72%]"
                style={{ background: DH.primary, color: "#fff" }}
              >
                {selected.label}
              </div>
            </div>

            {/* Tool chip */}
            <div
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md self-start w-fit"
              style={{
                background: DH.aiPurpleSoft,
                border: `1px solid ${DH.aiPurple}55`,
              }}
            >
              <span
                className="h-1.5 w-1.5 rounded-full animate-pulse"
                style={{ background: DH.success }}
              />
              <span
                className="text-[11px] font-mono"
                style={{ color: DH.aiPurple }}
              >
                {selected.tool}
              </span>
              <span className="text-[10px] font-mono" style={{ color: DH.muted }}>
                · tool call
              </span>
            </div>

            {/* AI response bubble */}
            <div className="flex justify-start">
              <div
                className="text-[14px] leading-relaxed px-4 py-3 rounded-2xl max-w-[78%]"
                style={{
                  background: DH.paper,
                  border: `1px solid ${DH.border}`,
                  color: DH.ink,
                }}
              >
                {aiReplyFor(selected)}
              </div>
            </div>

            {/* Reset */}
            <button
              onClick={() => setSelected(null)}
              className="text-[11.5px] font-medium"
              style={{ color: DH.muted }}
            >
              ← back to suggestions
            </button>
          </div>
        )}

        {/* Input field — mimics AiChatMessageInputField */}
        <div
          className="mt-6 flex items-center gap-2 p-1.5 rounded-full"
          style={{
            background: DH.paper,
            border: `1px solid ${DH.aiPurple}44`,
            boxShadow: `0 0 0 4px ${DH.aiPurple}10`,
          }}
        >
          <div
            className="flex-1 px-3 text-[13px]"
            style={{ color: DH.muted }}
          >
            Ask DigitalHire anything…
          </div>
          <button
            className="h-9 w-9 rounded-full flex items-center justify-center"
            style={{ background: DH.aiPurple }}
            aria-label="Send"
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path
                d="M8 13V3M3 8l5-5 5 5"
                stroke="#fff"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

function aiReplyFor(s: Suggestion): string {
  switch (s.tool) {
    case "searchApplicant":
      return "On it. Let me pull a shortlist — I'll show three to start, tap View All for the full match set.";
    case "createAgent":
      return "Love that. An agent needs a name, a scope, and a tone. Want to start with a recruiter agent tuned to your hiring brief?";
    case "searchJob":
      return "Found 12 roles this week. Want them ranked by match, recency, or compensation?";
    case "answerFAQ":
      return "Three clips, sixty seconds each, straight from your phone. I'll walk you through the questions.";
    default:
      return "On it.";
  }
}

function SuggestionIcon({
  kind,
}: {
  kind: Suggestion["icon"];
}) {
  const stroke = DH.aiPurple;
  if (kind === "search")
    return (
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
        <circle cx="7" cy="7" r="4.5" stroke={stroke} strokeWidth="1.5" />
        <path d="M10.5 10.5L14 14" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    );
  if (kind === "globe")
    return (
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="8" r="6" stroke={stroke} strokeWidth="1.5" />
        <path d="M2 8h12M8 2c2 2 2 10 0 12M8 2c-2 2-2 10 0 12" stroke={stroke} strokeWidth="1.5" />
      </svg>
    );
  if (kind === "bot")
    return (
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
        <rect x="3" y="5" width="10" height="8" rx="2" stroke={stroke} strokeWidth="1.5" />
        <path d="M8 3v2M6 9h.01M10 9h.01" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    );
  if (kind === "question")
    return (
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="8" r="6" stroke={stroke} strokeWidth="1.5" />
        <path d="M6 6a2 2 0 114 0c0 1-1 1.5-2 2v1M8 11.5h.01" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    );
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
      <rect x="2" y="5" width="12" height="8" rx="1.5" stroke={stroke} strokeWidth="1.5" />
      <path d="M6 5V3.5a1 1 0 011-1h2a1 1 0 011 1V5" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

// ====================================================================
// SCENE 4 — CANDIDATE MATCH
// Not a standalone dashboard — the product surfaces candidates inside
// the AI chat as an AiChatCandidateSearchPreviewCard. White outer card
// with a subtle green-tinted shadow, each row a F8FBFE chip with
// initials avatar + name + (video icon if hasVideo) + title + location.
// Footer: 'Found X candidates' + 'View All' primary button. No match
// bars, no inline skip/book actions.
// ====================================================================

const CANDIDATES = [
  {
    name: "Ayesha Khan",
    title: "Senior Frontend Engineer",
    location: "Karachi, PK",
    hasVideo: true,
  },
  {
    name: "Daniyal Rashid",
    title: "Senior Frontend Engineer",
    location: "Lahore, PK",
    hasVideo: true,
  },
  {
    name: "Hira Naseem",
    title: "Mid-senior Frontend Engineer",
    location: "Islamabad, PK",
    hasVideo: false,
  },
];

function CandidateMatchScene() {
  return (
    <div
      className="h-full overflow-y-auto"
      style={{
        background: "linear-gradient(180deg, #ffffff 0%, #F0FFF6 100%)",
      }}
    >
      <div className="max-w-[860px] mx-auto px-10 pt-8 pb-6 flex flex-col gap-4">
        {/* Context */}
        <div>
          <p
            className="text-[10px] font-mono uppercase tracking-[0.22em] mb-1.5"
            style={{ color: DH.aiPurple }}
          >
            How results show up in chat
          </p>
          <h3
            className="text-[22px] font-semibold leading-tight tracking-tight"
            style={{ color: DH.ink }}
          >
            The AI doesn&apos;t send you to a page. It drops the match inline.
          </h3>
          <p
            className="mt-2 text-[13.5px] leading-relaxed max-w-[620px]"
            style={{ color: DH.inkSoft }}
          >
            When the chat fires <code style={{ color: DH.aiPurple, fontFamily: "ui-monospace, monospace" }}>searchApplicant</code>,
            the tool response comes back as a preview card rendered right in
            the conversation. Three candidates, a fade for overflow, one
            primary &ldquo;View All&rdquo; action. No modal, no page switch.
          </p>
        </div>

        {/* User message */}
        <div className="flex justify-end">
          <div
            className="text-[14px] leading-snug px-4 py-2.5 rounded-2xl max-w-[72%]"
            style={{ background: DH.primary, color: "#fff" }}
          >
            find senior frontend engineers in Karachi
          </div>
        </div>

        {/* Tool chip */}
        <div
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md self-start w-fit"
          style={{
            background: DH.aiPurpleSoft,
            border: `1px solid ${DH.aiPurple}55`,
          }}
        >
          <span
            className="h-1.5 w-1.5 rounded-full animate-pulse"
            style={{ background: DH.success }}
          />
          <span
            className="text-[11px] font-mono"
            style={{ color: DH.aiPurple }}
          >
            searchApplicant
          </span>
          <span className="text-[10px] font-mono" style={{ color: DH.muted }}>
            · tool call
          </span>
        </div>

        {/* Actual preview card pattern from the Flutter source */}
        <div
          className="rounded-[20px] py-2"
          style={{
            background: DH.paper,
            border: `1px solid ${DH.border}`,
            boxShadow: "0 4px 12px rgba(5,67,30,0.05), 0 4px 8px rgba(5,67,30,0.05)",
            maxWidth: 480,
          }}
        >
          {/* Candidate rows */}
          <div className="px-2 py-1.5 relative">
            <div className="space-y-2">
              {CANDIDATES.map((c) => (
                <CandidatePreviewItem key={c.name} c={c} />
              ))}
            </div>
            {/* Fade gradient — the card truncates at 3 */}
            <div
              className="absolute bottom-0 left-0 right-0 h-10 rounded-b-[16px] pointer-events-none"
              style={{
                background:
                  "linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.9) 100%)",
              }}
            />
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between px-4 py-2">
            <p className="text-[13px]" style={{ color: DH.ink }}>
              <span className="font-medium">Found 24 candidates</span>
            </p>
            <button
              className="h-8 px-3.5 rounded-full text-[12px] font-semibold text-white"
              style={{ background: DH.primary }}
            >
              View All
            </button>
          </div>
        </div>

        <p
          className="mt-2 text-[11px] font-mono uppercase tracking-[0.22em]"
          style={{ color: DH.muted }}
        >
          Same pattern for jobs, interviews, profile previews — each tool returns a card like this
        </p>
      </div>
    </div>
  );
}

function CandidatePreviewItem({
  c,
}: {
  c: (typeof CANDIDATES)[number];
}) {
  const initials = c.name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  return (
    <div
      className="rounded-2xl px-3 py-2.5 flex items-center gap-3"
      style={{ background: DH.card, border: `1px solid ${DH.border}` }}
    >
      {/* 44x44 circular avatar with initials */}
      <div
        className="h-11 w-11 rounded-full flex items-center justify-center shrink-0"
        style={{
          background: DH.border,
          color: DH.muted,
          fontSize: 14,
          fontWeight: 500,
        }}
      >
        {initials}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <p
            className="text-[14px] font-medium leading-tight truncate"
            style={{ color: DH.ink }}
          >
            {c.name}
          </p>
          {c.hasVideo && (
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <rect x="1.5" y="4" width="9" height="8" rx="1.5" stroke={DH.primary} strokeWidth="1.5" />
              <path d="M10.5 7l4-2v6l-4-2" stroke={DH.primary} strokeWidth="1.5" strokeLinejoin="round" />
            </svg>
          )}
        </div>
        <p
          className="mt-0.5 text-[13px] truncate"
          style={{ color: DH.inkSoft }}
        >
          {c.title}
        </p>
        <div className="mt-0.5 flex items-center gap-1">
          <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
            <path
              d="M6 1.5c-2 0-3.5 1.5-3.5 3.5 0 2.5 3.5 5.5 3.5 5.5s3.5-3 3.5-5.5c0-2-1.5-3.5-3.5-3.5z"
              stroke={DH.muted}
              strokeWidth="1.1"
            />
            <circle cx="6" cy="5" r="1.2" stroke={DH.muted} strokeWidth="1.1" />
          </svg>
          <p className="text-[11.5px]" style={{ color: DH.muted }}>
            {c.location}
          </p>
        </div>
      </div>
    </div>
  );
}
