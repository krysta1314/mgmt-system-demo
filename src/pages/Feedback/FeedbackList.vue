<template>
  <div class="space-y-4 md:space-y-6">
    <div class="flex justify-between items-center">
      <h1 class="text-xl md:text-2xl font-bold text-gray-900">反馈列表</h1>
    </div>

    <!-- Filters -->
    <div class="bg-white rounded-lg shadow p-3 md:p-4">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
        <!-- <select
          v-model="filterSatisfaction"
          class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        >
          <option value="">所有满意度</option>
          <option v-for="level in satisfactionLevels" :key="level" :value="level">
            {{ level }}
          </option>
        </select> -->
        <select v-model="filterStatus"
          class="px-3 md:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm md:text-base">
          <option value="">所有状态</option>
          <option v-for="status in statuses" :key="status" :value="status">
            {{ getStatusText(status) }}
          </option>
        </select>
        <button @click="clearFilters"
          class="px-3 md:px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm md:text-base">
          清除筛选
        </button>
      </div>
    </div>

    <!-- Feedback Table -->
    <Table :columns="columns" :data="filteredFeedback">
      <template #cell-media="{ value }">
        <div class="flex gap-1">
          <div v-for="(img, index) in (value || []).slice(0, 4)" :key="index"
            @click="openImagePreview(value, index)"
            class="w-12 h-12 rounded cursor-pointer hover:opacity-80 transition-opacity overflow-hidden border border-gray-200">
            <img :src="img" :alt="`反馈图片 ${index + 1}`" class="w-full h-full object-cover" />
          </div>
          <div v-if="!value || value.length === 0" class="text-gray-400 text-sm">无</div>
        </div>
      </template>
      <template #cell-status="{ value }">
        <span class="px-2 py-1 text-xs rounded-full" :class="{
          'bg-green-100 text-green-800': value === 'resolved',
          'bg-yellow-100 text-yellow-800': value === 'pending',
          'bg-blue-100 text-blue-800': value === 'in_progress'
        }">
          {{ getStatusText(value) }}
        </span>
      </template>
      <template #cell-editBy="{ value }">
        <div class="flex items-center gap-2">
          <img :src="value.avatar" :alt="value.name" class="w-8 h-8 rounded-full object-cover" />
          <span class="text-sm text-gray-900">{{ value.name }}</span>
        </div>
      </template>
      <template #cell-remark="{ value }">
        <div class="max-w-xs">
          <span v-if="value" class="text-sm text-gray-700">{{ value }}</span>
          <span v-else class="text-sm text-gray-400">暂无备注</span>
        </div>
      </template>
      <template #cell-actions="{ row }">
        <button @click="openResolveModal(row)"
          class="px-3 py-1 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors">
          编辑
        </button>
      </template>
      <template #cell-satisfaction="{ value }">
        <span class="px-2 py-1 text-xs rounded-full" :class="{
          'bg-red-100 text-red-800': value === 'Dissatisfied',
          'bg-gray-100 text-gray-800': value === 'Neutral',
          'bg-green-100 text-green-800': value === 'Satisfied',
          'bg-emerald-100 text-emerald-800': value === 'Very Satisfied'
        }">
          {{ value }}
        </span>
      </template>
    </Table>

    <!-- Empty State -->
    <EmptyState v-if="filteredFeedback.length === 0" title="未找到反馈" message="请尝试调整筛选条件" />

    <!-- Resolve Confirmation Modal -->
    <div v-if="showResolveModal" @click="closeResolveModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div @click.stop class="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <h2 class="text-xl font-bold text-gray-900 mb-4">编辑确认</h2>
        <p class="text-gray-600 mb-4">
          反馈ID: <span class="font-semibold">{{ selectedFeedback?.feedback_id }}</span>
        </p>

        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            状态
          </label>
          <select v-model="statusInput"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
            <option value="pending">待处理</option>
            <option value="in_progress">处理中</option>
            <option value="resolved">已解决</option>
          </select>
        </div>

        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            备注（选填）
          </label>
          <textarea v-model="remarkInput"
            placeholder="请输入解决方案或备注信息..."
            rows="4"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
          ></textarea>
        </div>

        <div class="flex gap-3 justify-end">
          <button @click="closeResolveModal"
            class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">
            取消
          </button>
          <button @click="confirmResolve"
            class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
            确认提交
          </button>
        </div>
      </div>
    </div>

    <!-- Image Preview Modal -->
    <div v-if="showImagePreview" @click="closeImagePreview"
      class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div class="relative max-w-5xl w-full" @click.stop>
        <!-- Close Button -->
        <button @click="closeImagePreview"
          class="absolute -top-10 right-0 text-white hover:text-gray-300 text-2xl font-bold">
          ✕
        </button>

        <!-- Main Image -->
        <div class="bg-white rounded-lg p-2">
          <img :src="previewImages[currentImageIndex]" alt="预览图片"
            class="max-w-full max-h-[70vh] mx-auto rounded" />
        </div>

        <!-- Navigation Arrows -->
        <button v-if="currentImageIndex > 0" @click="previousImage"
          class="absolute left-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-3 shadow-lg">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button v-if="currentImageIndex < previewImages.length - 1" @click="nextImage"
          class="absolute right-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-3 shadow-lg">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>

        <!-- Thumbnails -->
        <div class="flex gap-2 justify-center mt-4">
          <div v-for="(img, index) in previewImages" :key="index"
            @click="currentImageIndex = index"
            class="w-16 h-16 rounded cursor-pointer overflow-hidden border-2 transition-all"
            :class="currentImageIndex === index ? 'border-white' : 'border-transparent opacity-60 hover:opacity-100'">
            <img :src="img" :alt="`缩略图 ${index + 1}`" class="w-full h-full object-cover" />
          </div>
        </div>

        <!-- Image Counter -->
        <div class="text-center text-white mt-2">
          {{ currentImageIndex + 1 }} / {{ previewImages.length }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import Table from '../../components/Table.vue'
import EmptyState from '../../components/EmptyState.vue'
import feedbackData from '../../mock/feedback.json'

const feedback = ref([])
const filterSatisfaction = ref('')
const filterStatus = ref('')

// Image preview state
const showImagePreview = ref(false)
const previewImages = ref([])
const currentImageIndex = ref(0)

// Resolve modal state
const showResolveModal = ref(false)
const selectedFeedback = ref(null)
const remarkInput = ref('')
const statusInput = ref('pending')

const columns = [
  { key: 'feedback_id', label: '反馈ID' },
  { key: 'user_id', label: '用户ID' },
  { key: 'email', label: '邮箱' },
  { key: 'description', label: '描述' },
  { key: 'media', label: '图/视频' },
  { key: 'created_at', label: '创建时间' },
  { key: 'status', label: '状态' },
  { key: 'editBy', label: 'Edit by' },
  { key: 'remark', label: '备注' },
  { key: 'actions', label: '操作' }
]

const satisfactionLevels = computed(() => {
  return [...new Set(feedback.value.map(f => f.satisfaction))]
})

const statuses = computed(() => {
  return [...new Set(feedback.value.map(f => f.status))]
})

const filteredFeedback = computed(() => {
  let result = feedback.value

  // Satisfaction filter
  if (filterSatisfaction.value) {
    result = result.filter(f => f.satisfaction === filterSatisfaction.value)
  }

  // Status filter
  if (filterStatus.value) {
    result = result.filter(f => f.status === filterStatus.value)
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

// Resolve modal functions
const openResolveModal = (feedbackItem) => {
  selectedFeedback.value = feedbackItem
  remarkInput.value = feedbackItem.remark || ''
  statusInput.value = feedbackItem.status || 'pending'
  showResolveModal.value = true
}

const closeResolveModal = () => {
  showResolveModal.value = false
  selectedFeedback.value = null
  remarkInput.value = ''
  statusInput.value = 'pending'
}

const confirmResolve = () => {
  if (selectedFeedback.value) {
    const index = feedback.value.findIndex(f => f.feedback_id === selectedFeedback.value.feedback_id)
    if (index !== -1) {
      feedback.value[index].status = statusInput.value
      feedback.value[index].remark = remarkInput.value
    }
  }
  closeResolveModal()
}

// Image preview functions
const openImagePreview = (images, index) => {
  if (images && images.length > 0) {
    previewImages.value = images
    currentImageIndex.value = index
    showImagePreview.value = true
  }
}

const closeImagePreview = () => {
  showImagePreview.value = false
  previewImages.value = []
  currentImageIndex.value = 0
}

const nextImage = () => {
  if (currentImageIndex.value < previewImages.value.length - 1) {
    currentImageIndex.value++
  }
}

const previousImage = () => {
  if (currentImageIndex.value > 0) {
    currentImageIndex.value--
  }
}

onMounted(() => {
  feedback.value = [...feedbackData]
})
</script>
