<script setup lang="ts">
import type { Paste } from '~/composables/types'

const types = Array.from(languages.keys())

const expiredDaysOptions = {
  '1 Day': 1,
  '1 Week': 7,
  '1 Month': 30,
}

const paste = $ref({ expired_days: 7, type: 'Text' } as Paste)

function setCode(code: string) {
  paste.data = code
}

const router = useRouter()

function onPaste() {
  fetch(`${import.meta.env.VITE_API_BASE_URL}/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(paste),
  })
    .then(res => res.json(),
  )
    .then((res) => {
      router.push(`/${res.uuid}`)
    })
    .catch((err) => {
      console.error(err)
    })
}
</script>

<template>
  <div flex="~" flex-col items-center justify-center>
    <div flex="~" flex-row items-center justify-center space-x-5 pb-5>
      <div text-lg font-mono font-bold>
        <span>
          Type:
          <select rounded-md class="bg-gray-200/50 text-gray-800/90" v-model="paste.type">
            <option class="text-gray-800/80" v-for="type in types" :key="type" :value="type">{{  type  }}</option>
          </select>
        </span>
        <span>
          Expired Days:
          <select rounded-md class="bg-gray-200/50 text-gray-800/90" v-model="paste.expired_days">
            <option class="text-gray-800/80" v-for="[k, v] in Object.entries(expiredDaysOptions)" :key="k" :value="v">{{
               k  }}
            </option>
          </select>
        </span>
      </div>
      <button btn @click="onPaste">
        paste
      </button>
    </div>
    <CodeEditor :paste="paste" :readonly="false" @set-code="setCode" />
  </div>
</template>
