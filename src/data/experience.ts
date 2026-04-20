export type Experience = {
  company: string;
  role: string;
  period: string;
  location: string;
  body: string;
  highlights: string[];
};

export const experience: Experience[] = [
  {
    company: "DigitalHire",
    role: "Designer · PM · Developer",
    period: "2022 — now",
    location: "Karachi",
    body: "Video-first recruitment SaaS. Joined as the sole product designer, became PM because I was already the one nobody could go around, and moved back into the code when the chat rewrite stalled.",
    highlights: [
      "Redesigned every surface from scratch, day one design system",
      "Shipped web, iOS, and Android in parallel, all on one set of tokens",
      "Designed the pivot from form-based AI to chat-first",
      "Rewrote the chat service on NestJS, stripped the LangChain stack",
      "Migrating the legacy backend into a clean NestJS monolith",
    ],
  },
  {
    company: "iSystematic",
    role: "Designer · Developer",
    period: "Previous",
    location: "New York / Karachi",
    body: "Experience design, web and mobile, business intelligence. Tech firm combining technology with psychology.",
    highlights: [
      "Experience design for enterprise clients",
      "Web and mobile product engineering",
      "BI and analytics surfaces",
    ],
  },
  {
    company: "Walletly",
    role: "Designer · Developer",
    period: "Previous",
    location: "Brisbane",
    body: "Loyalty program SaaS covering digital coupons, loyalty cards, membership passes, event tickets, iBeacon proximity marketing, and chatbot integrations.",
    highlights: [
      "Digital wallet and loyalty experiences",
      "Chatbot and proximity flows",
      "End-to-end shipping on a small team",
    ],
  },
  {
    company: "Geek Warehouse",
    role: "Designer · Developer",
    period: "Previous",
    location: "Karachi",
    body: "Software house building web, mobile, and desktop apps alongside digital marketing work.",
    highlights: [
      "Cross-platform product work",
      "Early career polyglot engineering",
    ],
  },
];
