import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useCounterStore = defineStore(
  'counter',
  () => {
    const user_id = ref(null)
    const count = ref(0)
    const doubleCount = computed(() => count.value * 2)
    function increment() {
      count.value++
    }
    function set_user_id(new_user_id) {
      user_id.value = new_user_id
    }
    return { user_id, count, doubleCount, increment, set_user_id }
  },
  { persist: true },
)
