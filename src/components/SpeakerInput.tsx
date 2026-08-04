import {Card, Flex, Select, Stack, Text} from '@sanity/ui'
import {useCallback} from 'react'
import {set, type StringInputProps, unset, useFormValue} from 'sanity'

import {usableSpeakers} from '../lib/speakers'
import type {Speaker} from '../lib/types'

const FIELD = 'interviewSpeakers'

function readSpeakers(value: unknown): Speaker[] {
  if (!Array.isArray(value)) return []

  return value.flatMap((entry) => {
    if (!entry || typeof entry !== 'object') return []
    const id = Reflect.get(entry, 'id')
    const name = Reflect.get(entry, 'name')
    const role = Reflect.get(entry, 'role')
    return [
      {
        id: typeof id === 'string' ? id : undefined,
        name: typeof name === 'string' ? name : undefined,
        role: typeof role === 'string' ? role : undefined,
      },
    ]
  })
}

/**
 * Picks one of the speakers defined on the document.
 *
 * @public
 */
export function SpeakerInput(props: StringInputProps): React.JSX.Element {
  const {value, onChange, elementProps, schemaType} = props

  const options: unknown = schemaType.options
  const named =
    options && typeof options === 'object' && 'speakersField' in options
      ? Reflect.get(options, 'speakersField')
      : undefined
  const field = typeof named === 'string' ? named : FIELD

  const speakers = usableSpeakers(readSpeakers(useFormValue([field])))

  const handle = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      const next = event.currentTarget.value
      onChange(next ? set(next) : unset())
    },
    [onChange],
  )

  if (speakers.length === 0) {
    return (
      <Card padding={3} radius={2} border tone="caution">
        <Stack gap={3}>
          <Text size={1} weight="medium">
            No speakers yet
          </Text>
          <Text size={1}>
            Add them in the “{field}” field of this document, then pick one here.
          </Text>
        </Stack>
      </Card>
    )
  }

  return (
    <Stack gap={3}>
      <Select {...elementProps} value={value ?? ''} onChange={handle}>
        <option value="">Not set</option>
        {speakers.map((speaker) => (
          <option key={speaker.id} value={speaker.id}>
            {speaker.name ?? speaker.id}
            {speaker.role ? ` — ${speaker.role}` : ''}
          </option>
        ))}
      </Select>

      {value && !speakers.some((speaker) => speaker.id === value) && (
        <Flex>
          <Text size={0} style={{color: 'var(--card-critical-fg-color)'}}>
            “{value}” is not in the speaker list — it was renamed or removed.
          </Text>
        </Flex>
      )}
    </Stack>
  )
}
