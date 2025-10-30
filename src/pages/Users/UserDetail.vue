<template>
  <div class="space-y-6">
    <!-- Back Button -->
    <button @click="$router.push('/users')" class="flex items-center gap-2 text-indigo-600 hover:text-indigo-700">
      <span>←</span>
      <span>返回用户列表</span>
    </button>

    <!-- Two Column Layout -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6" v-if="user">
      <!-- Left: User Info -->
      <div class="bg-white rounded-lg shadow p-6">
        <h2 class="text-xl font-bold text-gray-900 mb-4 border-b pb-2">用户信息</h2>
        <div class="space-y-4">
          <div>
            <h3 class="text-lg font-semibold text-gray-900">{{ user.username }}</h3>
            <p class="text-gray-600 text-sm mt-1">{{ user.email }}</p>
          </div>

          <div class="grid grid-cols-1 gap-3 text-sm">
            <div class="flex justify-between py-2 border-b border-gray-100">
              <span class="text-gray-500">用户ID:</span>
              <span class="font-medium text-gray-900">{{ user.user_id }}</span>
            </div>
            <div class="flex justify-between py-2 border-b border-gray-100">
              <span class="text-gray-500">国家:</span>
              <span class="font-medium text-gray-900">{{ user.country }}</span>
            </div>
            <div class="flex justify-between py-2 border-b border-gray-100">
              <span class="text-gray-500">设备:</span>
              <span class="font-medium text-gray-900">{{ user.device }}</span>
            </div>
            <div class="flex justify-between py-2 border-b border-gray-100">
              <span class="text-gray-500">浏览器:</span>
              <span class="font-medium text-gray-900">{{ user.browser }}</span>
            </div>
            <div class="flex justify-between py-2 border-b border-gray-100">
              <span class="text-gray-500">注册渠道:</span>
              <span class="font-medium text-gray-900">{{ user.channel }}</span>
            </div>
            <div class="flex justify-between py-2">
              <span class="text-gray-500">注册时间:</span>
              <span class="font-medium text-gray-900">{{ user.register_time }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Right: Subscription Info -->
      <div class="bg-white rounded-lg shadow p-6">
        <h2 class="text-xl font-bold text-gray-900 mb-4 border-b pb-2">订阅信息</h2>
        <div class="space-y-4">
          <!-- <div class="grid grid-cols-1 gap-3 text-sm">
            <div class="flex justify-between py-2 border-b border-gray-100">
              <span class="text-gray-500">订阅状态:</span>
              <span class="px-2 py-1 text-xs rounded-full font-medium" :class="{
                'bg-green-100 text-green-800': subscriptionInfo.status === 'active',
                'bg-gray-100 text-gray-800': subscriptionInfo.status === '未订阅',
                'bg-yellow-100 text-yellow-800': subscriptionInfo.status === 'trial'
              }">
                {{ subscriptionInfo.status }}
              </span>
            </div>
            <div class="flex justify-between py-2 border-b border-gray-100">
              <span class="text-gray-500">订阅类型:</span>
              <span class="font-medium text-gray-900">{{ subscriptionInfo.plan }}</span>
            </div>
            <div class="flex justify-between py-2 border-b border-gray-100">
              <span class="text-gray-500">开始日期:</span>
              <span class="font-medium text-gray-900">{{ subscriptionInfo.start_date }}</span>
            </div>
            <div class="flex justify-between py-2 border-b border-gray-100">
              <span class="text-gray-500">到期日期:</span>
              <span class="font-medium text-gray-900">{{ subscriptionInfo.end_date }}</span>
            </div>
            <div class="flex justify-between py-2 border-b border-gray-100">
              <span class="text-gray-500">自动续费:</span>
              <span class="font-medium text-gray-900">{{ subscriptionInfo.auto_renew ? '是' : '否' }}</span>
            </div>
            <div class="flex justify-between py-2">
              <span class="text-gray-500">价格:</span>
              <span class="font-medium text-gray-900">{{ subscriptionInfo.price }}</span>
            </div>
          </div> -->
        </div>
      </div>
    </div>

    <!-- Tabs -->
    <div class="bg-white rounded-lg shadow">
      <div class="px-6 pt-4">
        <Tabs :tabs="tabs" :active-tab="activeTab" @change="activeTab = $event" />
      </div>

      <div class="p-6">
        <!-- Tasks Tab -->
        <div v-if="activeTab === 'tasks'">
          <!-- <h3 class="text-lg font-semibold mb-4">任务</h3> -->
          <Table v-if="userTasks.length > 0" :columns="taskColumns" :data="userTasks" />
          <EmptyState v-else title="" message="该用户尚未创建任何任务。" />
        </div>

        <!-- Feedback Tab -->
        <div v-if="activeTab === 'feedback'">
          <!-- <h3 class="text-lg font-semibold mb-4">Feedback</h3> -->
          <Table v-if="userFeedback.length > 0" :columns="feedbackColumns" :data="userFeedback">
            <template #cell-status="{ value }">
              <span class="px-2 py-1 text-xs rounded-full" :class="{
                'bg-green-100 text-green-800': value === 'resolved',
                'bg-yellow-100 text-yellow-800': value === 'pending',
                'bg-blue-100 text-blue-800': value === 'in_progress'
              }">
                {{ value }}
              </span>
            </template>
          </Table>
          <EmptyState v-else title="" message="该用户尚未提交任何反馈。" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import Table from '../../components/Table.vue'
import Tabs from '../../components/Tabs.vue'
import EmptyState from '../../components/EmptyState.vue'
import usersData from '../../mock/users.json'
import tasksData from '../../mock/tasks.json'
import feedbackData from '../../mock/feedback.json'

const route = useRoute()
const user = ref(null)
const activeTab = ref('tasks')

// Mock subscription data
const subscriptionInfo = ref({
  status: '已订阅',
  plan: 'Premium',
  start_date: '2024-01-15',
  end_date: '2025-01-15',
  auto_renew: true,
  price: '$9.99/month'
})

const tabs = [
  { key: 'tasks', label: '任务' },
  { key: 'feedback', label: '反馈' }
]

const taskColumns = [
  { key: 'task_id', label: '任务ID' },
  { key: 'moduleType', label: '功能类型' },
  { key: 'modelName', label: '模型名称' },
  { key: 'duration', label: '时长' },
  { key: 'prompt', label: '提示词' },
  { key: 'createdAt', label: '创建时间' }
]

const feedbackColumns = [
  { key: 'feedback_id', label: '用反馈ID' },
  { key: 'feedback_type', label: '类型' },
  { key: 'satisfaction', label: '满意度' },
  { key: 'description', label: '描述' },
  { key: 'created_at', label: '创建时间' },
  { key: 'status', label: '状态' }
]

const userTasks = computed(() => {
  return tasksData.filter(task => task.user_id === route.params.id)
})

const userFeedback = computed(() => {
  return feedbackData.filter(feedback => feedback.user_id === route.params.id)
})

onMounted(() => {
  user.value = usersData.find(u => u.user_id === route.params.id)
})
</script>
