<template>
  <div class="space-y-4 md:space-y-6">
    <div class="flex justify-between items-center">
      <h1 class="text-xl md:text-2xl font-bold text-gray-900">任务列表</h1>
    </div>

    <!-- Filters and Search -->
    <div class="bg-white rounded-lg shadow p-3 md:p-4">
      <div class="grid grid-cols-1 md:grid-cols-5 gap-3 md:gap-4">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="按任务ID/用户ID搜索"
          class="px-3 md:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm md:text-base"
        />
        <select
          v-model="filterModuleType"
          class="px-3 md:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm md:text-base"
        >
          <option value="">所有功能类型</option>
          <option v-for="type in moduleTypes" :key="type" :value="type">
            {{ type }}
          </option>
        </select>
        <select
          v-model="filterModelName"
          class="px-3 md:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm md:text-base"
        >
          <option value="">所有模型</option>
          <option v-for="model in modelNames" :key="model" :value="model">
            {{ model }}
          </option>
        </select>
        <select
          v-model="filterStatus"
          class="px-3 md:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm md:text-base"
        >
          <option value="">所有状态</option>
          <option value="success">成功</option>
          <option value="failed">失败</option>
        </select>
        <button
          @click="clearFilters"
          class="px-3 md:px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm md:text-base"
        >
          清除筛选
        </button>
      </div>
    </div>

    <!-- Tasks Table -->
    <Table
      :columns="columns"
      :data="filteredTasks"
      @row-click="goToTaskDetail"
    >
      <template #cell-status="{ value }">
        <span
          class="px-2 py-1 text-xs rounded-full font-medium"
          :class="{
            'bg-green-100 text-green-800': value === 'success',
            'bg-red-100 text-red-800': value === 'failed'
          }"
        >
          {{ value === 'success' ? '成功' : '失败' }}
        </span>
      </template>
      <template #cell-apiSource="{ value }">
        <span class="px-2 py-1 text-xs rounded-full font-medium uppercase">
          {{ value }}
        </span>
      </template>
    </Table>

    <!-- Empty State -->
    <EmptyState
      v-if="filteredTasks.length === 0"
      title="未找到任务"
      message="请尝试调整搜索或筛选条件"
    />

    <!-- Pagination (Mock) -->
    <div class="flex justify-center items-center gap-2 flex-wrap">
      <button class="px-3 md:px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 text-sm md:text-base">
        上一页
      </button>
      <span class="text-xs md:text-sm text-gray-600">第 1 页，共 1 页</span>
      <button class="px-3 md:px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 text-sm md:text-base">
        下一页
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Table from '../../components/Table.vue'
import EmptyState from '../../components/EmptyState.vue'
import tasksData from '../../mock/tasks.json'

const router = useRouter()
const tasks = ref([])
const searchQuery = ref('')
const filterModuleType = ref('')
const filterModelName = ref('')
const filterStatus = ref('')

const columns = [
  { key: 'task_id', label: '任务ID' },
  { key: 'user_id', label: '用户ID' },
  { key: 'username', label: '用户名' },
  { key: 'moduleType', label: '功能类型' },
  { key: 'modelName', label: '模型' },
  { key: 'status', label: '状态' },
  { key: 'apiSource', label: 'API源' },
  { key: 'prompt', label: '提示词' },
  { key: 'createdAt', label: '创建时间' }
]

const moduleTypes = computed(() => {
  return [...new Set(tasks.value.map(t => t.moduleType))]
})

const modelNames = computed(() => {
  return [...new Set(tasks.value.map(t => t.modelName))]
})

const filteredTasks = computed(() => {
  let result = tasks.value

  // Search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(t =>
      t.task_id.toLowerCase().includes(query) ||
      t.user_id.toLowerCase().includes(query) ||
      t.prompt.toLowerCase().includes(query)
    )
  }

  // Module type filter
  if (filterModuleType.value) {
    result = result.filter(t => t.moduleType === filterModuleType.value)
  }

  // Model name filter
  if (filterModelName.value) {
    result = result.filter(t => t.modelName === filterModelName.value)
  }

  // Status filter
  if (filterStatus.value) {
    result = result.filter(t => t.status === filterStatus.value)
  }

  return result
})

const clearFilters = () => {
  searchQuery.value = ''
  filterModuleType.value = ''
  filterModelName.value = ''
  filterStatus.value = ''
}

const goToTaskDetail = (task) => {
  router.push(`/tasks/${task.task_id}`)
}

onMounted(() => {
  tasks.value = tasksData
})
</script>
