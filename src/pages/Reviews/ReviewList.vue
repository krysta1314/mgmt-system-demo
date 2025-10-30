<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h1 class="text-2xl font-bold text-gray-900">评价列表</h1>
    </div>

    <!-- Filters -->
    <div class="bg-white rounded-lg shadow p-4">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <select
          v-model="filterSatisfaction"
          class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        >
          <option value="">所有满意度</option>
          <option v-for="level in satisfactionLevels" :key="level" :value="level">
            {{ level }}
          </option>
        </select>
        <select
          v-model="filterStatus"
          class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        >
          <option value="">所有状态</option>
          <option v-for="status in statuses" :key="status" :value="status">
            {{ getStatusText(status) }}
          </option>
        </select>
        <button
          @click="clearFilters"
          class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
        >
          清除筛选
        </button>
      </div>
    </div>

    <!-- Reviews Table -->
    <Table
      :columns="columns"
      :data="filteredReviews"
    >
      <template #cell-satisfaction="{ value }">
        <span
          class="px-2 py-1 text-xs rounded-full"
          :class="{
            'bg-red-100 text-red-800': value === 'Dissatisfied',
            'bg-gray-100 text-gray-800': value === 'Neutral',
            'bg-green-100 text-green-800': value === 'Satisfied',
            'bg-emerald-100 text-emerald-800': value === 'Very Satisfied'
          }"
        >
          {{ value }}
        </span>
      </template>
      <template #cell-status="{ value }">
        <span
          class="px-2 py-1 text-xs rounded-full"
          :class="{
            'bg-green-100 text-green-800': value === 'resolved',
            'bg-yellow-100 text-yellow-800': value === 'pending',
            'bg-blue-100 text-blue-800': value === 'in_progress'
          }"
        >
          {{ getStatusText(value) }}
        </span>
      </template>
      <template #cell-remark="{ value }">
        <div class="max-w-xs">
          <span v-if="value" class="text-sm text-gray-700">{{ value }}</span>
          <span v-else class="text-sm text-gray-400">暂无备注</span>
        </div>
      </template>
      <template #cell-actions="{ row }">
        <button
          @click="openEditModal(row)"
          class="px-3 py-1 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors"
        >
          编辑
        </button>
      </template>
    </Table>

    <!-- Empty State -->
    <EmptyState
      v-if="filteredReviews.length === 0"
      title="未找到评价"
      message="请尝试调整筛选条件"
    />

    <!-- Edit Modal -->
    <div
      v-if="showEditModal"
      @click="closeEditModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <div @click.stop class="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <h2 class="text-xl font-bold text-gray-900 mb-4">编辑确认</h2>
        <p class="text-gray-600 mb-4">
          评价ID: <span class="font-semibold">{{ selectedReview?.review_id }}</span>
        </p>

        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            状态
          </label>
          <select
            v-model="statusInput"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="pending">待处理</option>
            <option value="in_progress">处理中</option>
            <option value="resolved">已解决</option>
          </select>
        </div>

        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            备注（选填）
          </label>
          <textarea
            v-model="remarkInput"
            placeholder="请输入备注信息..."
            rows="4"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
          ></textarea>
        </div>

        <div class="flex gap-3 justify-end">
          <button
            @click="closeEditModal"
            class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            取消
          </button>
          <button
            @click="confirmEdit"
            class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            确认提交
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import Table from '../../components/Table.vue'
import EmptyState from '../../components/EmptyState.vue'
import reviewsData from '../../mock/reviews.json'

const reviews = ref([])
const filterSatisfaction = ref('')
const filterStatus = ref('')

// Edit modal state
const showEditModal = ref(false)
const selectedReview = ref(null)
const remarkInput = ref('')
const statusInput = ref('pending')

const columns = [
  { key: 'review_id', label: '评价ID' },
  { key: 'user_id', label: '用户ID' },
  { key: 'email', label: '邮箱' },
  { key: 'satisfaction', label: '满意度' },
  { key: 'comment', label: '描述' },
  { key: 'created_at', label: '创建时间' },
  { key: 'status', label: '状态' },
  { key: 'remark', label: '备注' },
  { key: 'actions', label: '操作' }
]

const satisfactionLevels = computed(() => {
  return [...new Set(reviews.value.map(r => r.satisfaction))]
})

const statuses = computed(() => {
  return [...new Set(reviews.value.map(r => r.status))]
})

const filteredReviews = computed(() => {
  let result = reviews.value

  // Satisfaction filter
  if (filterSatisfaction.value) {
    result = result.filter(r => r.satisfaction === filterSatisfaction.value)
  }

  // Status filter
  if (filterStatus.value) {
    result = result.filter(r => r.status === filterStatus.value)
  }

  return result
})

const clearFilters = () => {
  filterSatisfaction.value = ''
  filterStatus.value = ''
}

// Status text translation
const getStatusText = (status) => {
  const statusMap = {
    'pending': '待处理',
    'in_progress': '处理中',
    'resolved': '已解决'
  }
  return statusMap[status] || status
}

// Edit modal functions
const openEditModal = (reviewItem) => {
  selectedReview.value = reviewItem
  remarkInput.value = reviewItem.remark || ''
  statusInput.value = reviewItem.status || 'pending'
  showEditModal.value = true
}

const closeEditModal = () => {
  showEditModal.value = false
  selectedReview.value = null
  remarkInput.value = ''
  statusInput.value = 'pending'
}

const confirmEdit = () => {
  if (selectedReview.value) {
    const index = reviews.value.findIndex(r => r.review_id === selectedReview.value.review_id)
    if (index !== -1) {
      reviews.value[index].status = statusInput.value
      reviews.value[index].remark = remarkInput.value
    }
  }
  closeEditModal()
}

onMounted(() => {
  reviews.value = [...reviewsData]
})
</script>
