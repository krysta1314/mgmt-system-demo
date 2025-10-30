<template>
  <div class="flex flex-col items-center justify-center py-12 px-4">
    <div class="text-gray-400 text-6xl mb-4">📭</div>
    <h3 class="text-lg font-medium text-gray-900 mb-2">{{ title }}</h3>
    <p class="text-sm text-gray-500">{{ message }}</p>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    default: 'No Data'
  },
  message: {
    type: String,
    default: 'There is no data to display.'
  }
})
</script>
