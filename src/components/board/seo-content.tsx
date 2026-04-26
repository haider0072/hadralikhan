import { site } from "@/data/site";
import { experience } from "@/data/experience";
import { projects } from "@/data/projects";
import { skillGroups } from "@/data/skills";
import { seo } from "@/data/seo";

/**
 * Hidden but discoverable content for search engines and LLM crawlers.
 * The board is rendered entirely client-side, so this provides a
 * semantic, text-only version of everything on the canvas.
 * Visually hidden with `sr-only` but fully present in the initial HTML.
 */
export function SeoContent() {
  return (
    <div className="sr-only" aria-hidden={false}>
      <h1>
        {seo.name} · {seo.role}
      </h1>
      <p>{seo.description}</p>
      <p>
        Available for remote, international engagements. Works with companies
        in the US, UK, Europe, Canada, Australia, Singapore, the UAE, and
        elsewhere. Contact:{" "}
        <a href={site.socials.email}>{site.email}</a>.
      </p>

      <h2>Frequently asked</h2>
      <dl>
        <dt>Who is Haider Ali Khan?</dt>
        <dd>
          Haider Ali Khan is a senior, multidisciplinary Product Designer,
          Product Manager, and Full-Stack Developer working remotely with
          companies worldwide. He designs products end-to-end and ships the
          systems underneath, spanning product UX, AI agents, web, mobile,
          backend, and infrastructure.
        </dd>

        <dt>Is he available for hire internationally?</dt>
        <dd>
          Yes. Haider works fully remote and is open to engagements with
          companies in the US, UK, Europe, Canada, Australia, Singapore, the
          UAE, and elsewhere. Full-time, contract, or consulting. Email{" "}
          <a href={site.socials.email}>{site.email}</a> to start a conversation.
        </dd>

        <dt>What time zones does he work across?</dt>
        <dd>
          Comfortable real-time overlap with US East-Coast mornings, all of
          Europe and the UK, and most of APAC and the Middle East. Baseline
          UTC+05.
        </dd>

        <dt>What kind of roles is he a fit for?</dt>
        <dd>
          Founding or first-design hires at AI and SaaS startups; senior or
          staff product designer roles where engineering fluency is a plus;
          design-engineer roles; AI product engineer or agent engineer roles;
          full-stack engineer with strong product taste.
        </dd>

        <dt>What does he specialize in?</dt>
        <dd>
          End-to-end product work for AI-native and SaaS companies: design
          systems, prototyping, LLM agents, MCP, RAG, React/Next.js, Vue/Nuxt,
          TypeScript, Flutter, NestJS, Kotlin, Python, Go, and AWS CDK
          infrastructure.
        </dd>

        <dt>What is his current role?</dt>
        <dd>
          Product Designer, PM, and Full-Stack engineer at DigitalHire, a
          video-based hiring SaaS. He designs the entire product surface,
          migrated 14 microservices into a NestJS monolith, built the AI Chat
          Agent end-to-end, and ships the Vue/Nuxt admin dashboard plus the
          Flutter mobile app.
        </dd>

        <dt>What's the fastest way to evaluate his work?</dt>
        <dd>
          Browse selected case studies under{" "}
          <a href="/classic">the classic scrolling view</a> or jump straight
          into individual project pages linked below.
        </dd>
      </dl>

      <h2>About</h2>
      {site.about.map((p, i) => (
        <p key={i}>{p}</p>
      ))}

      <h2>Experience</h2>
      <ul>
        {experience.map((e) => (
          <li key={e.company}>
            <h3>
              {e.role} · {e.company}
            </h3>
            <p>
              <time>{e.period}</time> · {e.location}
            </p>
            <p>{e.body}</p>
            <ul>
              {e.highlights.map((h) => (
                <li key={h}>{h}</li>
              ))}
            </ul>
          </li>
        ))}
      </ul>

      <h2>Projects &amp; case studies</h2>
      <p>
        Each project below has a dedicated page on this site. Live links go to
        the running product where available.
      </p>
      <ul>
        {projects.map((p) => (
          <li key={p.slug}>
            <h3>
              <a href={`/work/${p.slug}`}>{p.title}</a>
            </h3>
            <p>{p.tagline}</p>
            <p>
              <time>{p.year}</time> · {p.role} · {p.stack.join(", ")}
            </p>
            <p>
              <a href={`/work/${p.slug}`}>
                Read the {p.title} case study →
              </a>
            </p>
            {p.href && (
              <p>
                <a href={p.href} rel="noreferrer">
                  Visit the live {p.title} project: {p.href}
                </a>
              </p>
            )}
          </li>
        ))}
      </ul>

      <h2>Skills &amp; stack</h2>
      <ul>
        {skillGroups.map((g) => (
          <li key={g.label}>
            <h3>{g.label}</h3>
            <p>{g.items.join(", ")}</p>
          </li>
        ))}
      </ul>

      <h2>Hire him for</h2>
      <ul>
        <li>
          Founding / early-stage product design with engineering fluency
        </li>
        <li>End-to-end AI product engineering: LLM agents, MCP, RAG, tool use</li>
        <li>
          Design-to-code: Figma, Framer, shadcn/ui, Tailwind, design systems
        </li>
        <li>Product management on small, fast teams</li>
        <li>
          Full-stack feature ownership across Next.js, Vue/Nuxt, Flutter,
          NestJS, Kotlin, Python, Go
        </li>
      </ul>

      <h2>Other views</h2>
      <ul>
        <li>
          <a href="/">Pinboard view (this page)</a>
        </li>
        <li>
          <a href="/classic">Classic scrolling portfolio</a>
        </li>
      </ul>

      <h2>Links</h2>
      <ul>
        <li>
          <a href={site.socials.github} rel="me noreferrer">
            GitHub · haider0072
          </a>
        </li>
        <li>
          <a href={site.socials.linkedin} rel="me noreferrer">
            LinkedIn · hadralikhan
          </a>
        </li>
        <li>
          <a href={site.socials.twitter} rel="me noreferrer">
            Twitter · @hadralikhan
          </a>
        </li>
        <li>
          <a href={site.socials.email}>Email · {site.email}</a>
        </li>
      </ul>
    </div>
  );
}
