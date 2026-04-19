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
    role: "Product Designer · Full-Stack",
    period: "Current",
    location: "Karachi",
    body: "Video-based hiring SaaS. Title says Designer; reality is designer, engineer, and accidental PM — end-to-end product, AI agents, and infrastructure.",
    highlights: [
      "Designed the entire product surface",
      "Migrated 14 microservices into one NestJS monolith",
      "Built the AI Chat Agent — UX, frontend, backend",
      "Vue/Nuxt admin · React job-board kit · Flutter mobile",
      "AWS CDK, Docker, Kafka, data sync pipelines",
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
    body: "Loyalty program SaaS — digital coupons, loyalty cards, membership passes, event tickets, iBeacon proximity marketing, chatbot integrations.",
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
