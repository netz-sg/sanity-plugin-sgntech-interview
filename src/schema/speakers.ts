import {defineArrayMember, defineField} from 'sanity'

import type {InterviewConfig} from '../lib/types'

/**
 * The document field the blocks read their speakers from.
 *
 * Add it to any type that carries interviews:
 *
 * ```ts
 * defineType({name: 'post', fields: [createSpeakersField(), /* … *\/]})
 * ```
 *
 * @public
 */
export function createSpeakersField(config: InterviewConfig = {}) {
  const {speakersField = 'interviewSpeakers', speakerTypes = []} = config

  return defineField({
    name: speakersField,
    title: 'Interview speakers',
    description: 'Everyone taking part. Blocks pick from this list, so a name is only typed once.',
    type: 'array',
    of: [
      defineArrayMember({
        type: 'object',
        name: 'speaker',
        fields: [
          defineField({
            name: 'id',
            title: 'Short id',
            description: 'Used by the blocks, e.g. `till`. Lowercase, no spaces.',
            type: 'string',
            validation: (rule) =>
              rule.required().regex(/^[a-z0-9-]+$/, {name: 'lowercase letters, digits and dashes'}),
          }),
          defineField({name: 'name', type: 'string', validation: (rule) => rule.required()}),
          defineField({
            name: 'role',
            description: 'Shown under the name, e.g. Vocals or Editor.',
            type: 'string',
          }),
          defineField({
            name: 'interviewer',
            title: 'Asks the questions',
            description: 'Blocks without their own asker fall back to the first one marked here.',
            type: 'boolean',
            initialValue: false,
          }),
          ...(speakerTypes.length > 0
            ? [
                defineField({
                  name: 'person',
                  title: 'Person',
                  description: 'Optional link to an existing document.',
                  type: 'reference',
                  to: speakerTypes.map((type) => ({type})),
                }),
              ]
            : []),
        ],
        preview: {
          select: {title: 'name', role: 'role', id: 'id', interviewer: 'interviewer'},
          prepare: (select) => ({
            title: typeof select.title === 'string' ? select.title : 'Speaker',
            subtitle: [select.id, select.role, select.interviewer ? 'asks' : undefined]
              .filter(Boolean)
              .join(' · '),
          }),
        },
      }),
    ],
  })
}
