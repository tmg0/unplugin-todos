<script setup lang="ts">
const items = [{ label: 'All' }, { label: 'Board' }, { label: 'Upcoming' }]

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

    <div class="mt-6">
      <UTabs :items="items" />
    </div>

    <div class="bg-white rounded-lg">
      <UTable :columns="columns" :rows="comments">
        <template #type-data="{ row }">
          <span class="capitalize">{{ row.type }}</span>
        </template>
      </UTable>
    </div>
  </div>
</template>
