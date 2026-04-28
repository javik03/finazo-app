/**
 * Hero — editorial lead column. Right-side aside is a separate component
 * (QuizAside) so it can be a Client Component while this stays server.
 */

import { QuizAside } from "./QuizAside";

type HeroProps = {
  kicker: string;
  title: React.ReactNode;
  deck: string;
  bylineInitial: string;
  bylineName: string;
  readingTime: string;
  updatedLabel: string;
  leadParagraphs: React.ReactNode[];
};

export function Hero({
  kicker,
  title,
  deck,
  bylineInitial,
  bylineName,
  readingTime,
  updatedLabel,
  leadParagraphs,
}: HeroProps): React.ReactElement {
  return (
    <section className="us-hero">
      <div className="us-container">
        <div className="us-hero-grid">
          <article>
            <div className="us-hero-kicker">{kicker}</div>
            <h1 className="us-hero-title">{title}</h1>
            <p className="us-hero-deck">{deck}</p>

            <div className="us-hero-byline">
              <div className="us-byline-av">{bylineInitial}</div>
              <div>
                Editorial <span className="us-byline-name">{bylineName}</span>
              </div>
              <span className="us-byline-sep">·</span>
              <span>{readingTime}</span>
              <span className="us-byline-sep">·</span>
              <span>{updatedLabel}</span>
            </div>

            {leadParagraphs.map((paragraph, idx) => (
              <p key={idx} className="us-hero-lead">
                {paragraph}
              </p>
            ))}
          </article>

          <QuizAside />
        </div>
      </div>
    </section>
  );
}
