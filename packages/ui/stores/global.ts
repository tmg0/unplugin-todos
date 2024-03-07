import { defineStore } from 'pinia'

interface Comment {
  id: string
  type: 'line' | 'block'
  original: string
  start: number
  end: number
  line: number
}

export const useGlobalStore = defineStore('global', () => {
  const comments = ref<Comment[]>([])

  function syncComments(data: MaybeRef<Comment[]>) {
    comments.value = unref(data)
  }

  return { comments, syncComments }
})
