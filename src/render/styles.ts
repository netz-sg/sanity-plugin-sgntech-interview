/**
 * Structural CSS for an interview: the speaker column and the turns.
 *
 * No colours, no fonts. Every value worth changing is a custom property with
 * its default at the point of use — a default declared on the block itself
 * would beat the same variable set on an ancestor, so theming from a wrapper
 * would silently do nothing.
 *
 * Set `--sgn-interview-layout: inline` on any ancestor to get the classic
 * `NAME: text` form instead of two columns.
 *
 * @public
 */
export const interviewStyles = `
.sgn-interview {
  margin: 0;
  color: inherit;
  font: inherit;
}

.sgn-interview__turn {
  display: grid;
  grid-template-columns: var(--sgn-interview-speaker-width, 7.5rem) minmax(0, 1fr);
  gap: var(--sgn-interview-column-gap, 1.25rem);
  align-items: baseline;
}

.sgn-interview__turn + .sgn-interview__turn {
  margin-top: var(--sgn-interview-turn-gap, 0.75rem);
}

.sgn-interview__turn--answer + .sgn-interview__turn--question {
  margin-top: var(--sgn-interview-pair-gap, 1.75rem);
}

.sgn-interview__speaker {
  margin: 0;
  font-size: var(--sgn-interview-speaker-size, 0.8125em);
  font-weight: var(--sgn-interview-speaker-weight, 600);
  letter-spacing: var(--sgn-interview-speaker-tracking, 0.06em);
  text-transform: var(--sgn-interview-speaker-transform, uppercase);
  opacity: var(--sgn-interview-speaker-opacity, 0.72);
  overflow-wrap: break-word;
}

.sgn-interview__role {
  display: block;
  font-weight: 400;
  text-transform: none;
  letter-spacing: normal;
  opacity: 0.75;
}

.sgn-interview__text {
  margin: 0;
}

.sgn-interview__text > p {
  margin: 0;
}

.sgn-interview__text > p + p {
  margin-top: var(--sgn-interview-paragraph-gap, 0.75em);
}

.sgn-interview__turn--question .sgn-interview__text {
  font-weight: var(--sgn-interview-question-weight, 600);
}

.sgn-interview__meta {
  margin: var(--sgn-interview-meta-gap, 0.35rem) 0 0;
  font-size: var(--sgn-interview-meta-size, 0.8125em);
  opacity: var(--sgn-interview-meta-opacity, 0.65);
}

.sgn-interview__meta > * + *::before {
  content: ' · ';
}

.sgn-interview__original {
  margin: var(--sgn-interview-meta-gap, 0.35rem) 0 0;
  font-size: var(--sgn-interview-meta-size, 0.8125em);
  font-style: italic;
  opacity: var(--sgn-interview-meta-opacity, 0.65);
}

/* One column once the speaker column would squeeze the text, and whenever the
   inline layout is asked for. */
@container (max-width: 30rem) {
  .sgn-interview__turn {
    grid-template-columns: minmax(0, 1fr);
    gap: var(--sgn-interview-stacked-gap, 0.2rem);
  }
}

@media (max-width: 30rem) {
  .sgn-interview__turn {
    grid-template-columns: minmax(0, 1fr);
    gap: var(--sgn-interview-stacked-gap, 0.2rem);
  }
}
`

const STYLE_ID = 'sgn-interview-styles'

/**
 * Adds {@link interviewStyles} to the document once.
 *
 * Only needed when the stylesheet is not already part of the site's own CSS.
 *
 * @public
 */
export function ensureInterviewStyles(): void {
  if (typeof document === 'undefined' || document.getElementById(STYLE_ID)) return

  const element = document.createElement('style')
  element.id = STYLE_ID
  element.textContent = interviewStyles
  document.head.appendChild(element)
}
