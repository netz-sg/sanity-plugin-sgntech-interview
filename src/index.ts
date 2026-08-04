import {definePlugin} from 'sanity'

import type {InterviewConfig} from './lib/types'
import {createInterviewBlockType} from './schema/interviewBlock'

/**
 * Adds an `interviewBlock` to Sanity Studio: one question and its answer, as a
 * block in the article body, so intros, photos and section headings can sit
 * between the turns the way a printed interview does.
 *
 * Speakers are defined once on the document with `createSpeakersField`, and
 * each block picks from that list — renaming somebody fixes every turn at once.
 * An answer takes bold, italic and links, and can carry a timestamp into the
 * recording plus a note when it was translated rather than quoted.
 *
 * ```ts
 * import {defineArrayMember, defineConfig, defineField} from 'sanity'
 * import {createSpeakersField, interview} from 'sanity-plugin-sgntech-interview'
 *
 * export default defineConfig({
 *   plugins: [interview()],
 *   schema: {
 *     types: [
 *       {
 *         type: 'document',
 *         name: 'post',
 *         fields: [
 *           createSpeakersField(),
 *           defineField({
 *             type: 'array',
 *             name: 'body',
 *             of: [defineArrayMember({type: 'block'}), defineArrayMember({type: 'interviewBlock'})],
 *           }),
 *         ],
 *       },
 *     ],
 *   },
 * })
 * ```
 *
 * The React renderer lives under `sanity-plugin-sgntech-interview/render` and
 * imports neither `sanity` nor `@sanity/ui`.
 *
 * @public
 */
export const interview = definePlugin<InterviewConfig | void>((config) => {
  const options = config || {}

  return {
    name: 'sanity-plugin-sgntech-interview',
    schema: {types: [createInterviewBlockType(options)]},
  }
})

export {InterviewIcon} from './components/InterviewIcon'
export {SpeakerInput} from './components/SpeakerInput'
export {
  askingSpeaker,
  findSpeaker,
  speakerLabel,
  timestampSeconds,
  timestampUrl,
  usableSpeakers,
} from './lib/speakers'
export type {InterviewConfig, InterviewValue, Speaker} from './lib/types'
export {createInterviewBlockType} from './schema/interviewBlock'
export {createSpeakersField} from './schema/speakers'
