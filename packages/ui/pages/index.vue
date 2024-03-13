<script setup lang="ts">
const { comments, refresh } = useComments()

const columns = [
  { key: 'original', label: 'Task name' },
  { key: 'type', label: 'Type' },
]
</script>

<template>
  <div>
    <div class="w-full flex items-center justify-between">
      <div class="text-4xl font-bold flex gap-4">
        <span>🚧</span>
        <span>Daily Tasks</span>
      </div>

      <UButton
        icon="i-heroicons-arrow-path"
        color="gray"
        variant="link"
        @click="refresh"
      />
    </div>

    <div class="rounded-lg mt-6 bg-gray-100 p-4">
      <UTable :columns="columns" :rows="comments" :empty-state="{ label: undefined }">
        <template #type-data="{ row }">
          <span class="capitalize">{{ row.type }}</span>
        </template>
      </UTable>
    </div>
  </div>
</template>
