import {defineArrayMember, defineField, defineType} from 'sanity'

import {SpeakerInput} from '../components/SpeakerInput'
import {InterviewIcon} from '../components/InterviewIcon'
import type {InterviewConfig} from '../lib/types'

const DEFAULT_DECORATORS = ['strong', 'em']

/**
 * The question-and-answer block.
 *
 * @public
 */
export function createInterviewBlockType(config: InterviewConfig = {}) {
  const {
    name = 'interviewBlock',
    title = 'Interview',
    timestamps = true,
    translation = true,
    answerMarks,
  } = config

  const decorators = (answerMarks?.decorators ?? DEFAULT_DECORATORS).map((value) => ({
    title: value === 'strong' ? 'Bold' : value === 'em' ? 'Italic' : value,
    value,
  }))

  const annotations =
    answerMarks?.link === false
      ? []
      : [
          defineArrayMember({
            type: 'object',
            name: 'link',
            title: 'Link',
            fields: [defineField({name: 'href', type: 'url', validation: (r) => r.required()})],
          }),
        ]

  return defineType({
    name,
    title,
    type: 'object',
    icon: InterviewIcon,
    fields: [
      defineField({
        name: 'speaker',
        title: 'Answered by',
        type: 'string',
        components: {input: SpeakerInput},
        validation: (rule) => rule.required(),
      }),

      defineField({
        name: 'question',
        type: 'string',
        validation: (rule) => rule.required(),
      }),

      defineField({
        name: 'answer',
        type: 'array',
        of: [
          defineArrayMember({
            type: 'block',
            styles: [{title: 'Normal', value: 'normal'}],
            lists: [],
            marks: {decorators, annotations},
          }),
        ],
        validation: (rule) => rule.required(),
      }),

      defineField({
        name: 'askedBy',
        title: 'Asked by',
        description: 'Only needed when somebody other than the usual interviewer asks.',
        type: 'string',
        components: {input: SpeakerInput},
      }),

      ...(timestamps
        ? [
            defineField({
              name: 'timestamp',
              description: 'Where this sits in the recording, as 12:34 or 1:02:33.',
              type: 'string',
              validation: (rule) =>
                rule.regex(/^\d{1,3}:\d{2}(:\d{2})?$/, {name: 'mm:ss or hh:mm:ss'}),
            }),
          ]
        : []),

      ...(translation
        ? [
            defineField({
              name: 'translated',
              title: 'Answer was translated',
              description: 'A translated answer is not a verbatim quote — say so.',
              type: 'boolean',
              initialValue: false,
            }),
            defineField({
              name: 'originalAnswer',
              title: 'Original wording',
              type: 'text',
              rows: 3,
              hidden: ({parent}) => parent?.translated !== true,
            }),
          ]
        : []),
    ],

    preview: {
      select: {question: 'question', speaker: 'speaker', timestamp: 'timestamp'},
      prepare: (select) => ({
        title: typeof select.question === 'string' ? select.question : 'Question',
        subtitle: [select.speaker, select.timestamp].filter(Boolean).join(' · '),
      }),
    },
  })
}
