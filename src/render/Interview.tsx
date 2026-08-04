import type {ReactNode} from 'react'

import {askingSpeaker, findSpeaker, speakerLabel, timestampSeconds, timestampUrl} from '../lib/speakers'
import type {InterviewValue, Speaker} from '../lib/types'

/**
 * Words the renderer prints, so a site can translate them.
 *
 * @public
 */
export interface InterviewLabels {
  translated: string
  originalWording: string
}

const DEFAULT_LABELS: InterviewLabels = {
  translated: 'Translated',
  originalWording: 'Originally',
}

/**
 * Props for {@link Interview}.
 *
 * @public
 */
export interface InterviewProps {
  value: InterviewValue
  /** The document's speaker list. */
  speakers?: Speaker[]
  /** Recording the timestamp points into; without it the time is plain text. */
  source?: string
  labels?: Partial<InterviewLabels>
  /** Renders the answer's Portable Text. */
  children?: ReactNode
  className?: string
}

function Turn(props: {
  kind: 'question' | 'answer'
  speaker: Speaker | undefined
  children: ReactNode
  meta?: ReactNode
}): React.JSX.Element {
  const {kind, speaker, children, meta} = props

  return (
    <div className={`sgn-interview__turn sgn-interview__turn--${kind}`}>
      <p className="sgn-interview__speaker">
        {speakerLabel(speaker)}
        {speaker?.role && <span className="sgn-interview__role">{speaker.role}</span>}
      </p>
      <div className="sgn-interview__text">
        {children}
        {meta}
      </div>
    </div>
  )
}

/**
 * One question-and-answer pair.
 *
 * The answer's rich text is passed in as children, so the site keeps using its
 * own Portable Text setup rather than a second one bundled here.
 *
 * @public
 */
export function Interview(props: InterviewProps): React.JSX.Element {
  const {value, speakers, source, labels, children, className} = props
  const words = {...DEFAULT_LABELS, ...labels}

  const answering = findSpeaker(speakers, value.speaker)
  const asking = askingSpeaker(speakers, value)
  const seconds = timestampSeconds(value.timestamp)
  const link = timestampUrl(source, seconds)

  const meta =
    value.timestamp || value.translated ? (
      <p className="sgn-interview__meta">
        {value.timestamp && (
          <span>
            {link && seconds !== undefined ? <a href={link}>{value.timestamp}</a> : value.timestamp}
          </span>
        )}
        {value.translated && <span>{words.translated}</span>}
      </p>
    ) : undefined

  return (
    <div className={['sgn-interview', className].filter(Boolean).join(' ')}>
      {value.question && (
        <Turn kind="question" speaker={asking}>
          <p>{value.question}</p>
        </Turn>
      )}

      <Turn kind="answer" speaker={answering} meta={meta}>
        {children}
        {value.translated && value.originalAnswer && (
          <p className="sgn-interview__original">
            {words.originalWording}: “{value.originalAnswer}”
          </p>
        )}
      </Turn>
    </div>
  )
}
