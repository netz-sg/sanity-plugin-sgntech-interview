/**
 * Framework-side entry point: the React renderer for interviews. This entry
 * imports neither `sanity` nor `@sanity/ui`, so it can be used in a Next.js,
 * Remix or Astro app without pulling the Studio into the bundle.
 *
 * ```ts
 * import {Interview, ensureInterviewStyles} from 'sanity-plugin-sgntech-interview/render'
 * ```
 *
 * @packageDocumentation
 */

export {Interview, type InterviewLabels, type InterviewProps} from './render/Interview'
export {
  createInterviewPortableTextComponents,
  InterviewBlock,
  interviewPortableTextComponents,
} from './render/portableText'
export {ensureInterviewStyles, interviewStyles} from './render/styles'
export {
  askingSpeaker,
  findSpeaker,
  speakerLabel,
  timestampSeconds,
  timestampUrl,
  usableSpeakers,
} from './lib/speakers'
export type {InterviewValue, Speaker} from './lib/types'
