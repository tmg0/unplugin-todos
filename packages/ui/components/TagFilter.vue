<script setup lang="ts">
import { useVModel } from '@vueuse/core'

const props = defineProps<{
  values: string[]
}>()

const emit = defineEmits(['update:values'])

const values = useVModel(props, 'values', emit)

const hasFilters = computed(() => values.value.length > 0)

function toggleFilters() {
  if (hasFilters.value)
    values.value = []
  else
    values.value = ['TODO']
}
</script>

<template>
  <UButton
    :icon="hasFilters ? 'i-heroicons-funnel-solid' : 'i-heroicons-funnel'"
    size="2xs"
    color="gray"
    variant="link"
    @click="toggleFilters"
  />
</template>
