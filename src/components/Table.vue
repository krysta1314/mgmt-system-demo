<template>
  <div class="rounded-lg shadow overflow-hidden">
    <!-- Scrollable Table View (All Screen Sizes) -->
    <div class="overflow-x-auto bg-white">
      <table class="divide-y divide-gray-200 bg-white min-w-full">
        <thead class="bg-gray-50">
          <tr>
            <th
              v-for="column in columns"
              :key="column.key"
              class="px-3 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap"
            >
              {{ column.label }}
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr
            v-for="(row, index) in data"
            :key="index"
            @click="$emit('row-click', row)"
            class="hover:bg-gray-50 transition-colors cursor-pointer"
          >
            <td
              v-for="column in columns"
              :key="column.key"
              class="px-3 md:px-6 py-3 md:py-4 whitespace-nowrap text-xs md:text-sm text-gray-900"
            >
              <slot :name="`cell-${column.key}`" :row="row" :value="row[column.key]">
                {{ row[column.key] }}
              </slot>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
defineProps({
  columns: {
    type: Array,
    required: true
  },
  data: {
    type: Array,
    required: true
  }
})

defineEmits(['row-click'])
</script>
