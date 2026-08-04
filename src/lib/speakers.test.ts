import {describe, expect, it} from 'vitest'

import {
  askingSpeaker,
  findSpeaker,
  speakerLabel,
  timestampSeconds,
  timestampUrl,
  usableSpeakers,
} from './speakers'

const speakers = [
  {_key: 'a', id: 'seb', name: 'Sebastian', interviewer: true},
  {_key: 'b', id: 'till', name: 'Till', role: 'Vocals'},
  {_key: 'c', name: 'No id'},
]

describe('findSpeaker', () => {
  it('finds by id', () => {
    expect(findSpeaker(speakers, 'till')?.name).toBe('Till')
  })

  it('returns nothing without an id or a match', () => {
    expect(findSpeaker(speakers, undefined)).toBeUndefined()
    expect(findSpeaker(speakers, 'nobody')).toBeUndefined()
    expect(findSpeaker(undefined, 'till')).toBeUndefined()
  })
})

describe('askingSpeaker', () => {
  it('uses the block choice when there is one', () => {
    expect(askingSpeaker(speakers, {askedBy: 'till'})?.name).toBe('Till')
  })

  it('falls back to the first interviewer', () => {
    expect(askingSpeaker(speakers, {})?.name).toBe('Sebastian')
    expect(askingSpeaker(speakers, {askedBy: 'nobody'})?.name).toBe('Sebastian')
  })

  it('returns nothing when nobody is marked as one', () => {
    expect(askingSpeaker([{id: 'x', name: 'X'}], {})).toBeUndefined()
  })
})

describe('speakerLabel', () => {
  it('prefers the name, then the id', () => {
    expect(speakerLabel({id: 'till', name: 'Till'})).toBe('Till')
    expect(speakerLabel({id: 'till'})).toBe('till')
  })

  it('falls back for an empty or missing speaker', () => {
    expect(speakerLabel(undefined)).toBe('—')
    expect(speakerLabel({name: '   '})).toBe('—')
    expect(speakerLabel(undefined, '?')).toBe('?')
  })
})

describe('timestampSeconds', () => {
  it('reads minutes and seconds', () => {
    expect(timestampSeconds('12:34')).toBe(754)
    expect(timestampSeconds('0:07')).toBe(7)
  })

  it('reads hours too', () => {
    expect(timestampSeconds('1:02:33')).toBe(3753)
  })

  it('refuses what it cannot read, rather than guessing', () => {
    expect(timestampSeconds('twelve')).toBeUndefined()
    expect(timestampSeconds('12')).toBeUndefined()
    expect(timestampSeconds('1:2:3:4')).toBeUndefined()
    expect(timestampSeconds('12:75')).toBeUndefined()
    expect(timestampSeconds('')).toBeUndefined()
    expect(timestampSeconds(undefined)).toBeUndefined()
  })
})

describe('timestampUrl', () => {
  it('uses the form each service expects', () => {
    expect(timestampUrl('https://youtu.be/abc', 90)).toBe('https://youtu.be/abc?t=90')
    expect(timestampUrl('https://vimeo.com/1', 90)).toBe('https://vimeo.com/1#t=90s')
  })

  it('keeps an existing query string intact', () => {
    expect(timestampUrl('https://youtube.com/watch?v=abc', 5)).toBe(
      'https://youtube.com/watch?v=abc&t=5',
    )
  })

  it('hands the source back when there is nothing to add', () => {
    expect(timestampUrl('https://example.test', undefined)).toBe('https://example.test')
    expect(timestampUrl(undefined, 5)).toBeUndefined()
  })
})

describe('usableSpeakers', () => {
  it('drops the ones a block could never refer to', () => {
    expect(usableSpeakers(speakers).map((speaker) => speaker.id)).toEqual(['seb', 'till'])
    expect(usableSpeakers(undefined)).toEqual([])
  })
})
