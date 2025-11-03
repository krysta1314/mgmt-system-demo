<template>
  <div class="space-y-4 md:space-y-6">
    <div class="flex justify-between items-center">
      <h1 class="text-xl md:text-2xl font-bold text-gray-900">内容反馈列表</h1>
    </div>

    <!-- Filters -->
    <div class="bg-white rounded-lg shadow p-3 md:p-4">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
        <select
          v-model="filterContentType"
          class="px-3 md:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm md:text-base"
        >
          <option value="">所有内容类型</option>
          <option v-for="type in contentTypes" :key="type" :value="type">
            {{ type }}
          </option>
        </select>
        <select
          v-model="filterStatus"
          class="px-3 md:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm md:text-base"
        >
          <option value="">所有状态</option>
          <option v-for="status in statuses" :key="status" :value="status">
            {{ getStatusText(status) }}
          </option>
        </select>
        <button
          @click="clearFilters"
          class="px-3 md:px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm md:text-base"
        >
          清除筛选
        </button>
      </div>
    </div>

    <!-- Content Feedback Table -->
    <Table
      :columns="columns"
      :data="filteredContentFeedback"
    >
      <template #cell-action="{ value }">
        <span
          class="px-3 py-1 text-sm rounded-full inline-flex items-center gap-1"
          :class="{
            'bg-green-100 text-green-800': value === 'like',
            'bg-red-100 text-red-800': value === 'dislike'
          }"
        >
          <span v-if="value === 'like'"></span>
          <span v-else></span>
          {{ value === 'like' ? 'Like' : 'Dislike' }}
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
      <template #cell-editBy="{ value }">
        <div class="flex items-center gap-2">
          <img :src="value.avatar" :alt="value.name" class="w-8 h-8 rounded-full object-cover" />
          <span class="text-sm text-gray-900">{{ value.name }}</span>
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
      v-if="filteredContentFeedback.length === 0"
      title="未找到内容反馈"
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
          反馈ID: <span class="font-semibold">{{ selectedFeedback?.content_feedback_id }}</span>
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
import Table from '../../components/Table.vue'
import EmptyState from '../../components/EmptyState.vue'
import contentFeedbackData from '../../mock/content-feedback.json'

const contentFeedback = ref([])
const filterContentType = ref('')
const filterStatus = ref('')

// Edit modal state
const showEditModal = ref(false)
const selectedFeedback = ref(null)
const remarkInput = ref('')
const statusInput = ref('pending')

const columns = [
  { key: 'content_feedback_id', label: '反馈ID' },
  { key: 'user_id', label: '用户ID' },
  { key: 'task_id', label: '任务ID' },
  { key: 'content_type', label: '内容类型' },
  { key: 'action', label: 'Action' },
  { key: 'comment', label: '评论' },
  { key: 'created_at', label: '创建时间' },
  { key: 'status', label: '状态' },
  { key: 'editBy', label: 'Edit by' },
  { key: 'remark', label: '备注' },
  { key: 'actions', label: '操作' }
]

const contentTypes = computed(() => {
  return [...new Set(contentFeedback.value.map(cf => cf.content_type))]
})

const statuses = computed(() => {
  return [...new Set(contentFeedback.value.map(cf => cf.status))]
})

const filteredContentFeedback = computed(() => {
  let result = contentFeedback.value

  // Content type filter
  if (filterContentType.value) {
    result = result.filter(cf => cf.content_type === filterContentType.value)
  }

  // Status filter
  if (filterStatus.value) {
    result = result.filter(cf => cf.status === filterStatus.value)
  }

  return result
})

const clearFilters = () => {
  filterContentType.value = ''
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
const openEditModal = (feedbackItem) => {
  selectedFeedback.value = feedbackItem
  remarkInput.value = feedbackItem.remark || ''
  statusInput.value = feedbackItem.status || 'pending'
  showEditModal.value = true
}

const closeEditModal = () => {
  showEditModal.value = false
  selectedFeedback.value = null
  remarkInput.value = ''
  statusInput.value = 'pending'
}

const confirmEdit = () => {
  if (selectedFeedback.value) {
    const index = contentFeedback.value.findIndex(cf => cf.content_feedback_id === selectedFeedback.value.content_feedback_id)
    if (index !== -1) {
      contentFeedback.value[index].status = statusInput.value
      contentFeedback.value[index].remark = remarkInput.value
    }
  }
  closeEditModal()
}

onMounted(() => {
  contentFeedback.value = [...contentFeedbackData]
})
</script>
