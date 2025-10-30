<template>
  <div class="h-14 bg-slate-800 fixed top-0 right-0 left-60 flex items-center justify-between px-6 shadow-lg z-10">
    <div class="text-slate-300 text-sm font-medium">
      {{ currentPageTitle }}
    </div>

    <div class="flex items-center gap-4">
      <div class="text-slate-400 text-sm">Admin</div>
      <div class="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
        A
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const currentPageTitle = computed(() => {
  const path = route.path
  if (path.includes('/users')) return 'User Management'
  if (path.includes('/orders')) return 'Order Management'
  if (path.includes('/feedback')) return 'Feedback Management'
  if (path.includes('/reviews')) return 'Reviews Management'
  return 'Dashboard'
})
</script>
