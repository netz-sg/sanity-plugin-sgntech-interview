import type {PortableTextBlock} from '@portabletext/types'

/**
 * Someone taking part in the interview, defined once on the document.
 *
 * @public
 */
export interface Speaker {
  _key?: string
  /** Short id the blocks refer to, e.g. `till`. */
  id?: string
  name?: string
  /** Shown under the name, e.g. `Guitarist` or `Editor`. */
  role?: string
  /** Marks who is asking, so a renderer can style questions differently. */
  interviewer?: boolean
  /** Set when the speaker is a reference to a person document. */
  person?: {_ref?: string; _type?: string}
}

/**
 * One question and its answer.
 *
 * @public
 */
export interface InterviewValue {
  _key?: string
  _type?: string
  question?: string
  answer?: PortableTextBlock[]
  /** Who is answering; matches {@link Speaker.id}. */
  speaker?: string
  /** Who is asking, when it is not the document's default interviewer. */
  askedBy?: string
  /** `12:34` or `1:02:33`, pointing into the recording. */
  timestamp?: string
  /** Set when the answer was translated rather than quoted verbatim. */
  translated?: boolean
  /** The answer as it was actually said. */
  originalAnswer?: string
}

/**
 * Configuration for the plugin.
 *
 * @public
 */
export interface InterviewConfig {
  /** Block type name. Defaults to `interviewBlock`. */
  name?: string
  /** Label in the editor. Defaults to `Interview`. */
  title?: string
  /** Field name the speakers live in. Defaults to `interviewSpeakers`. */
  speakersField?: string
  /** Document types a speaker may point at, e.g. `['author', 'bandMember']`. */
  speakerTypes?: string[]
  /** Marks allowed in an answer. Defaults to bold, italic and link. */
  answerMarks?: {decorators?: string[]; link?: boolean}
  /** Adds the timestamp field. Defaults to `true`. */
  timestamps?: boolean
  /** Adds the translation fields. Defaults to `true`. */
  translation?: boolean
}
