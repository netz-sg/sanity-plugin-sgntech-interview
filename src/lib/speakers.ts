import type {InterviewValue, Speaker} from './types'

/**
 * The speaker a block refers to, or the first interviewer when it asks for one
 * without naming it.
 *
 * @public
 */
export function findSpeaker(
  speakers: Speaker[] | undefined,
  id: string | undefined,
): Speaker | undefined {
  if (!Array.isArray(speakers)) return undefined
  if (id) return speakers.find((speaker) => speaker.id === id)
  return undefined
}

/**
 * Who is asking: the block's own choice, otherwise the first speaker marked as
 * an interviewer.
 *
 * @public
 */
export function askingSpeaker(
  speakers: Speaker[] | undefined,
  value: InterviewValue | undefined,
): Speaker | undefined {
  const named = findSpeaker(speakers, value?.askedBy)
  if (named) return named
  return (speakers ?? []).find((speaker) => speaker.interviewer)
}

/**
 * What to print for a speaker, falling back through name, id and a dash so a
 * half-filled interview still renders.
 *
 * @public
 */
export function speakerLabel(speaker: Speaker | undefined, fallback = '—'): string {
  return speaker?.name?.trim() || speaker?.id?.trim() || fallback
}

/**
 * Turns `12:34` or `1:02:33` into seconds, for links into a recording.
 *
 * Returns `undefined` for anything it cannot read, so a typo becomes a plain
 * label rather than a link to second zero.
 *
 * @public
 */
export function timestampSeconds(input: string | undefined): number | undefined {
  const raw = (input ?? '').trim()
  if (!raw) return undefined

  const parts = raw.split(':')
  if (parts.length < 2 || parts.length > 3) return undefined
  if (!parts.every((part) => /^\d{1,3}$/.test(part))) return undefined

  const numbers = parts.map(Number)
  const [hours, minutes, seconds] =
    numbers.length === 3 ? numbers : [0, numbers[0] ?? 0, numbers[1] ?? 0]

  if (minutes > 59 || seconds > 59) return undefined
  return hours * 3600 + minutes * 60 + seconds
}

/**
 * Adds a start time to a media URL, in the form each service expects.
 *
 * @public
 */
export function timestampUrl(source: string | undefined, seconds: number | undefined): string | undefined {
  if (!source || seconds === undefined) return source

  const separator = source.includes('?') ? '&' : '?'
  if (/youtu\.?be/.test(source)) return `${source}${separator}t=${seconds}`
  if (/vimeo\./.test(source)) return `${source}#t=${seconds}s`
  return `${source}${separator}t=${seconds}`
}

/**
 * Speakers that can actually be offered in a picker.
 *
 * @public
 */
export function usableSpeakers(speakers: Speaker[] | undefined): Speaker[] {
  if (!Array.isArray(speakers)) return []
  return speakers.filter((speaker) => Boolean(speaker?.id?.trim()))
}
