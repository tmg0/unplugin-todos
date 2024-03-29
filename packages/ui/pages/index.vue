<script setup lang="ts">
const { comments, refresh, send } = useComments()

const columns = [
  { key: 'tag', label: 'Tag' },
  { key: 'content', label: 'Content' },
  { key: 'action', label: 'Action' },
]

const tags = ref<string[]>(['TODO'])

const commentFilterResults = computed(() => {
  if (!tags.value.length)
    return comments.value
  return comments.value.filter(({ tag: _tag }) => tags.value.includes(_tag))
})

function patchComment(row: any, tag: 'DONE' | 'TODO') {
  send(`patch:comment`, { id: row.id, line: row.line, tag })
}
</script>

<template>
  <div class="w-full">
    <div class="w-full flex items-center justify-between">
      <div class="text-4xl font-bold flex gap-4">
        <span>🚧</span>
        <span>Todos</span>
      </div>

      <UButton
        icon="i-heroicons-arrow-path"
        color="gray"
        variant="link"
        @click="refresh"
      />
    </div>

    <div class="rounded-lg mt-6 bg-gray-100 dark:bg-white/10 p-4">
      <UTable :columns="columns" :rows="commentFilterResults" :empty-state="{ label: undefined }">
        <template #tag-header>
          <div class="flex items-center gap-2">
            <span>Tag</span>
            <TagFilter v-model:values="tags" />
          </div>
        </template>

        <template #tag-data="{ row }">
          <UBadge :color="row.tag === 'TODO' ? 'yellow' : 'green'" variant="soft" size="sm">
            {{ row.tag }}
          </UBadge>
        </template>

        <template #content-data="{ row }">
          <VSCodeLink :filename="row.id" :line="row.line">
            {{ row.content }}
          </VSCodeLink>
        </template>

        <template #action-data="{ row }">
          <UButton
            v-if="row.tag === 'TODO'"
            :ui="{ rounded: 'rounded-full' }"
            icon="i-heroicons-check"
            size="2xs"
            color="green"
            variant="outline"
            @click="patchComment(row, 'DONE')"
          />

          <UButton
            v-if="row.tag === 'DONE'"
            :ui="{ rounded: 'rounded-full' }"
            icon="i-heroicons-arrow-uturn-left"
            size="2xs"
            color="yellow"
            variant="outline"
            @click="patchComment(row, 'TODO')"
          />
        </template>
      </UTable>
    </div>
  </div>
</template>
