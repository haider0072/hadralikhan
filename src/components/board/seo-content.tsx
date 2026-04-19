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
        {seo.name} — {seo.role}
      </h1>
      <p>{seo.description}</p>
      <p>
        Available for remote work worldwide. Based in {seo.location.city},{" "}
        {seo.location.country}. Contact:{" "}
        <a href={site.socials.email}>{site.email}</a>.
      </p>

      <h2>About</h2>
      {site.about.map((p, i) => (
        <p key={i}>{p}</p>
      ))}

      <h2>Experience</h2>
      <ul>
        {experience.map((e) => (
          <li key={e.company}>
            <h3>
              {e.role} — {e.company}
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

      <h2>Projects</h2>
      <ul>
        {projects.map((p) => (
          <li key={p.slug}>
            <h3>{p.title}</h3>
            <p>{p.tagline}</p>
            <p>
              <time>{p.year}</time> · {p.role} · {p.stack.join(", ")}
            </p>
            {p.href && (
              <p>
                <a href={p.href} rel="noreferrer">
                  {p.href}
                </a>
              </p>
            )}
          </li>
        ))}
      </ul>

      <h2>Skills & stack</h2>
      <ul>
        {skillGroups.map((g) => (
          <li key={g.label}>
            <h3>{g.label}</h3>
            <p>{g.items.join(", ")}</p>
          </li>
        ))}
      </ul>

      <h2>Links</h2>
      <ul>
        <li>
          <a href={site.socials.github} rel="me noreferrer">
            GitHub — haider0072
          </a>
        </li>
        <li>
          <a href={site.socials.linkedin} rel="me noreferrer">
            LinkedIn — hadralikhan
          </a>
        </li>
        <li>
          <a href={site.socials.twitter} rel="me noreferrer">
            Twitter — @hadralikhan
          </a>
        </li>
        <li>
          <a href={site.socials.email}>Email — {site.email}</a>
        </li>
      </ul>
    </div>
  );
}
