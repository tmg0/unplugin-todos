<script lang="ts" setup>
const props = defineProps<{
  filename: string
  line: string | number
}>()

const anchor = computed(() => `vscode://file/${props.filename}:${props.line}`)
</script>

<template>
  <UButton
    :to="anchor"
    target="_blank"
    :padded="false"
    color="gray"
    variant="link"
  >
    <slot />
  </UButton>
</template>
