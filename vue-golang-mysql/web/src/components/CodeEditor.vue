<script setup lang="ts">
import { Codemirror } from 'vue-codemirror'

import { oneDark } from '@codemirror/theme-one-dark'
import type { Paste } from '~/composables/types'

const { paste } = defineProps<{ paste: Paste, readonly: boolean }>()
const emits = defineEmits(['setCode', 'setType', 'setExpiredDays'])

function setCode(code: string) {
  emits('setCode', code)
}

const extensions = $computed(() => {
  const languagesFunction = languages.get(paste.type)
  const extensions = [oneDark]
  if (languagesFunction)
    extensions.push(languagesFunction)
  return extensions
})
</script>

<template>
  <Codemirror :model-value="paste.data" :disabled="readonly" placeholder="Code goes here..."
    :style="{ height: '400px', width: '900px', textAlign: 'left' }" :autofocus="true" :indent-with-tab="true"
    :tab-size="2" :extensions="extensions" @change="setCode" />
</template>

