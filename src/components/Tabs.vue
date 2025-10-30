<template>
  <div class="border-b border-gray-200">
    <nav class="-mb-px flex space-x-8">
      <button
        v-for="tab in tabs"
        :key="tab.key"
        @click="$emit('change', tab.key)"
        class="py-4 px-1 border-b-2 font-medium text-sm transition-colors"
        :class="
          activeTab === tab.key
            ? 'border-indigo-500 text-indigo-600'
            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
        "
      >
        {{ tab.label }}
      </button>
    </nav>
  </div>
</template>

<script setup>
defineProps({
  tabs: {
    type: Array,
    required: true
  },
  activeTab: {
    type: String,
    required: true
  }
})

defineEmits(['change'])
</script>
