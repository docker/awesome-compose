<script setup lang="ts">
import type { Paste } from '~/composables/types'
import { unsecuredCopyToClipboard } from '~/composables/utils';

const { id } = defineProps<{ id: string }>()

let paste = $ref({} as Paste)

const router = useRouter()

function fetchPaste(id: string) {
  fetch(`${import.meta.env.VITE_API_BASE_URL}/read/${id}`)
    .then(res => res.json())
    .then((res) => {
      paste = res
    })
    .catch((err) => {
      console.error(err)
      router.push('/')
    })
}

function copyToClipboard() {
  const content = paste.data
  if (window.isSecureContext && navigator.clipboard) {
    navigator.clipboard.writeText(content)
  } else {
    unsecuredCopyToClipboard(content);
  }
  alert('Successfully copied to clipboard!')
}

onMounted(() => {
  fetchPaste(id)
})
</script>

<template>
  <div flex="~" flex-col items-center justify-center>
    <div flex="~" flex-row items-center justify-center space-x-5 pb-5>
      <div text-lg font-mono font-bold>
        <span>
          Type:
          <select rounded-md class="bg-gray-200/50 text-gray-800/90" disabled>
            <option class="text-gray-800/80" value="paste.type">{{  paste.type  }}</option>
          </select>
        </span>
        <span>
          ExpiredAt:
          <select rounded-md class="bg-gray-200/50 text-gray-800/90" disabled>
            <option class="text-gray-800/80" value="UTC2Local(paste.expired_at)">{{  UTC2Local(paste.expired_at)  }}
            </option>
          </select>
        </span>
      </div>
      <button btn @click="copyToClipboard()">copy</button>
    </div>
    <CodeEditor :paste="paste" :readonly="true" />
  </div>
</template>
