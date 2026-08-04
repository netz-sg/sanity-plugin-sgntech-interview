import {PortableText} from '@portabletext/react'

import type {InterviewValue} from '../lib/types'
import {Interview, type InterviewProps} from './Interview'

type RenderOptions = Omit<InterviewProps, 'value' | 'children'>

/**
 * Portable Text block renderer for the `interviewBlock` object type.
 *
 * The answer is rendered with `@portabletext/react` unless the site passes its
 * own renderer through `answer`.
 *
 * @public
 */
export function InterviewBlock(props: {
  value: InterviewValue
  options?: RenderOptions & {answer?: (value: InterviewValue) => React.ReactNode}
}): React.JSX.Element | null {
  const {value, options} = props
  const {answer, ...rest} = options || {}

  return (
    <Interview value={value} {...rest}>
      {answer ? answer(value) : <PortableText value={value.answer ?? []} />}
    </Interview>
  )
}

/**
 * Drop-in `components` fragment for `@portabletext/react`.
 *
 * @public
 */
export const interviewPortableTextComponents = {
  types: {
    interviewBlock: ({value}: {value: InterviewValue}) => <InterviewBlock value={value} />,
  },
}

/**
 * Same as {@link interviewPortableTextComponents}, but for a custom type name
 * or with fixed options — the speaker list and the recording URL, typically.
 *
 * @public
 */
export function createInterviewPortableTextComponents(
  options?: RenderOptions & {
    typeName?: string
    answer?: (value: InterviewValue) => React.ReactNode
  },
): {types: Record<string, (props: {value: InterviewValue}) => React.JSX.Element | null>} {
  const {typeName = 'interviewBlock', ...rest} = options || {}

  return {
    types: {
      [typeName]: ({value}: {value: InterviewValue}) => (
        <InterviewBlock value={value} options={rest} />
      ),
    },
  }
}
