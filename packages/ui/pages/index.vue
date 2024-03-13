<script setup lang="ts">
const { comments, refresh, send } = useComments()

const columns = [
  { key: 'tag', label: 'Tag' },
  { key: 'content', label: 'Task' },
  { key: 'action', label: 'Action' },
]

function patchComment(row: any, tag: 'DONE' | 'TODO') {
  send(`patch:comment:${row.id}|${row.line}`, { tag })
}
</script>

<template>
  <div class="w-full">
    <div class="w-full flex items-center justify-between">
      <div class="text-4xl font-bold flex gap-4">
        <span>🚧</span>
        <span>Daily Todos</span>
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
        <template #tag-data="{ row }">
          <UBadge color="yellow" variant="soft" size="sm">
            {{ row.tag }}
          </UBadge>
        </template>

        <template #action-data="{ row }">
          <UButton
            :ui="{ rounded: 'rounded-full' }"
            icon="i-heroicons-check"
            size="2xs"
            color="primary"
            variant="outline"
            @click="patchComment(row, 'DONE')"
          />
        </template>
      </UTable>
    </div>
  </div>
</template>
