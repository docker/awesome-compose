import { javascript } from '@codemirror/lang-javascript'
import { html } from '@codemirror/lang-html'
import { json } from '@codemirror/lang-json'
import { rust } from '@codemirror/lang-rust'
import { cpp } from '@codemirror/lang-cpp'
import { java } from '@codemirror/lang-java'
import { python } from '@codemirror/lang-python'
import { markdown } from '@codemirror/lang-markdown'

export const languages = new Map(Object.entries({
  'JavaScript': javascript(),
  'HTML': html(),
  'JSON': json(),
  'Rust': rust(),
  'C++': cpp(),
  'Java': java(),
  'Python': python(),
  'Markdown': markdown(),
  'Text': undefined,
}))

