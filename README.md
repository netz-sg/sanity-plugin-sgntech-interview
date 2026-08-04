<!-- Social preview / OpenGraph image -->
<p align="center">
  <img src="https://raw.githubusercontent.com/netz-sg/sanity-plugin-sgntech-interview/main/assets/og-image.png" alt="sanity-plugin-sgntech-interview — question and answer blocks for Sanity Studio" width="640" />
</p>

<h1 align="center">sanity-plugin-sgntech-interview</h1>

<p align="center">
  Interviews as Portable Text: question and answer pairs with speakers, timestamps and a note when an answer was translated.
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/sanity-plugin-sgntech-interview"><img alt="npm version" src="https://img.shields.io/npm/v/sanity-plugin-sgntech-interview.svg?style=flat-square" /></a>
  <a href="./LICENSE"><img alt="license" src="https://img.shields.io/npm/l/sanity-plugin-sgntech-interview.svg?style=flat-square" /></a>
</p>

---

## What you get

- **One block per turn**, so intros, photos and section headings sit between the questions the way a printed interview does.
- **Speakers defined once** on the document. Blocks pick from the list, so renaming somebody fixes every turn at once.
- **Answers take bold, italic and links** — enough for the album someone is talking about, without an editor inside the editor.
- **Timestamps** into the recording, turned into a link that starts at the right second on YouTube and Vimeo.
- **A translation note.** A translated answer is not a verbatim quote, and the original wording can be kept alongside it.
- **A renderer that carries no design** — two columns by default, one CSS variable away from the classic `NAME: text` form.

## Installation

```sh
npm install sanity-plugin-sgntech-interview
```

Sanity Studio v5 or v6, React 18 or 19. `@portabletext/react` is an optional peer — only the
renderer needs it, and only when the site does not pass its own.

## Usage

```ts
// sanity.config.ts
import {defineArrayMember, defineConfig, defineField, defineType} from 'sanity'
import {createSpeakersField, interview} from 'sanity-plugin-sgntech-interview'

export default defineConfig({
  plugins: [interview()],
  schema: {
    types: [
      defineType({
        type: 'document',
        name: 'post',
        fields: [
          defineField({type: 'string', name: 'title'}),
          createSpeakersField(),
          defineField({
            type: 'array',
            name: 'body',
            of: [
              defineArrayMember({type: 'block'}),
              defineArrayMember({type: 'interviewBlock'}),
            ],
          }),
        ],
      }),
    ],
  },
})
```

`createSpeakersField()` adds the list the blocks read from. Fill it in first — name, a short id
like `till`, an optional role, and a tick on whoever asks the questions. Blocks without their own
asker fall back to the first one ticked.

### Options

```ts
interview({
  name: 'interviewBlock', // block type name
  title: 'Interview',
  speakersField: 'interviewSpeakers', // where the speakers live
  speakerTypes: [], // e.g. ['author', 'bandMember'] to link real documents
  answerMarks: {decorators: ['strong', 'em'], link: true},
  timestamps: true,
  translation: true,
})
```

`createSpeakersField()` takes the same `speakersField` and `speakerTypes`, so pass the config to
both when you change them.

## Rendering

```tsx
import {PortableText} from '@portabletext/react'
import {
  createInterviewPortableTextComponents,
  ensureInterviewStyles,
} from 'sanity-plugin-sgntech-interview/render'

ensureInterviewStyles() // or paste `interviewStyles` into your own CSS

export function Article({post}) {
  return (
    <PortableText
      value={post.body}
      components={createInterviewPortableTextComponents({
        speakers: post.interviewSpeakers,
        source: post.videoUrl, // makes the timestamps clickable
      })}
    />
  )
}
```

The speakers are passed in because they live on the document, not on the block — one GROQ
projection away:

```groq
*[_type == "post"][0]{..., interviewSpeakers}
```

### Styling

Two columns by default: speaker left, text right, stacking below 30rem. Every value is a custom
property with its default at the point of use, so setting one on any ancestor works:

```css
.article {
  --sgn-interview-speaker-width: 6rem;
  --sgn-interview-pair-gap: 2.5rem;
  --sgn-interview-question-weight: 700;
}
```

The full list is in [`src/render/styles.ts`](./src/render/styles.ts).

## What is stored

```json
{
  "_type": "interviewBlock",
  "speaker": "till",
  "askedBy": "seb",
  "question": "How did the album come about?",
  "answer": [{"_type": "block", "children": [{"_type": "span", "text": "It took a while…"}]}],
  "timestamp": "12:34",
  "translated": true,
  "originalAnswer": "Das hat gedauert…"
}
```

## No JSON-LD

There is no correct schema.org type for a journalistic interview. `QAPage` describes pages where
users submit answers, and marking an interview up as one would be a false declaration with a real
risk in search results. So this plugin emits none — unlike the
[review plugin](https://github.com/netz-sg/sanity-plugin-sgntech-review), where a correct type
exists.

## Develop

```sh
npm install
npm test            # speaker resolution and timestamp parsing
npm run lint
npm run build
npm run link-watch
```

Built with [@sanity/plugin-kit](https://github.com/sanity-io/plugins/tree/main/packages/@sanity/plugin-kit).

## License

MIT © SGNTech
