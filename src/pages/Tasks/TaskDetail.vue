<template>
  <div class="space-y-4 md:space-y-6">
    <!-- Back Button -->
    <button @click="$router.push('/tasks')" class="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 text-sm md:text-base">
      <span>←</span>
      <span>返回任务列表</span>
    </button>

    <!-- Task Detail Card -->
    <div class="bg-white rounded-lg shadow p-4 md:p-6" v-if="task">
      <h1 class="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6">任务详情</h1>

      <!-- Main Content Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <!-- Right Column: Task Details -->
        <div class="space-y-3 md:space-y-4">
          <!-- User Info -->
          <div class="grid grid-cols-2 gap-3 md:gap-4">
            <div>
              <label class="block text-xs md:text-sm font-medium text-gray-700 mb-1">用户ID</label>
              <div class="text-gray-900 text-sm md:text-base break-all">{{ task.user_id }}</div>
            </div>
            <div>
              <label class="block text-xs md:text-sm font-medium text-gray-700 mb-1">用户名</label>
              <div class="text-gray-900 text-sm md:text-base">{{ task.username }}</div>
            </div>
            <!-- Task ID -->
            <div>
              <label class="block text-xs md:text-sm font-medium text-gray-700 mb-1">任务ID</label>
              <div class="text-gray-900 font-mono text-xs md:text-sm break-all">{{ task.task_id }}</div>
            </div>

            <!-- Module Type -->
            <div>
              <label class="block text-xs md:text-sm font-medium text-gray-700 mb-1">功能类型</label>
              <div class="text-gray-900 text-sm md:text-base">{{ task.moduleType }}</div>
            </div>
          </div>

          <!-- Model Info -->
          <div class="grid grid-cols-2 gap-3 md:gap-4">
            <div>
              <label class="block text-xs md:text-sm font-medium text-gray-700 mb-1">模型名称</label>
              <div class="text-gray-900 text-sm md:text-base">{{ task.modelName }}</div>
            </div>
            <div>
              <label class="block text-xs md:text-sm font-medium text-gray-700 mb-1">模型ID</label>
              <div class="text-gray-900 font-mono text-xs md:text-sm break-all">{{ task.modelId }}</div>
            </div>
            <!-- Status -->
            <div>
              <label class="block text-xs md:text-sm font-medium text-gray-700 mb-1">状态</label>
              <span
                class="inline-block px-2 py-1 text-xs rounded-full font-medium"
                :class="{
                  'bg-green-100 text-green-800': task.status === 'success',
                  'bg-red-100 text-red-800': task.status === 'failed'
                }"
              >
                {{ task.status === 'success' ? '成功' : '失败' }}
              </span>
            </div>
            <!-- API Source -->
            <div>
              <label class="block text-xs md:text-sm font-medium text-gray-700 mb-1">API源</label>
              <span class="inline-block px-2 py-1 text-xs rounded-full font-medium uppercase">
                {{ task.apiSource }}
              </span>
            </div>
            <!-- Duration -->
            <div v-if="task.duration !== 'N/A'">
              <label class="block text-xs md:text-sm font-medium text-gray-700 mb-1">时长</label>
              <div class="text-gray-900 text-sm md:text-base">{{ task.duration }}</div>
            </div>
            <!-- Timestamps -->
            <div>
              <label class="block text-xs md:text-sm font-medium text-gray-700 mb-1">创建时间</label>
              <div class="text-gray-900 text-xs md:text-sm break-all">{{ task.createdAt }}</div>
            </div>
            <div>
              <label class="block text-xs md:text-sm font-medium text-gray-700 mb-1">更新时间</label>
              <div class="text-gray-900 text-xs md:text-sm break-all">{{ task.updatedAt }}</div>
            </div>
          </div>
        </div>
        <!-- Left Column: Media Links -->
        <div class="space-y-3 md:space-y-4">
          <!-- Thumbnail URL -->
          <div v-if="task.thumbnailUrl" class="space-y-2">
            <label class="block text-xs md:text-sm font-medium text-gray-700">图地址</label>
            <a :href="task.thumbnailUrl" target="_blank"
              class="text-indigo-600 hover:text-indigo-700 text-xs md:text-sm break-all block">
              {{ task.thumbnailUrl }}
            </a>
          </div>

          <!-- Video Links -->
          <div v-if="task.videoLink" class="space-y-2">
            <label class="block text-xs md:text-sm font-medium text-gray-700">视频地址</label>
            <a :href="task.videoLink" target="_blank" class="text-indigo-600 hover:text-indigo-700 text-xs md:text-sm break-all block">
              {{ task.videoLink }}
            </a>
          </div>
        </div>
      </div>

      <!-- Full Width Sections -->
      <div class="mt-4 md:mt-6 space-y-3 md:space-y-4">
        <!-- Prompt -->
        <div>
          <label class="block text-xs md:text-sm font-medium text-gray-700 mb-2">提示词</label>
          <div class="p-3 md:p-4 bg-gray-50 rounded-lg text-gray-900 text-sm md:text-base">
            {{ task.prompt }}
          </div>
        </div>

        <!-- Input Parameters -->
        <div>
          <label class="block text-xs md:text-sm font-medium text-gray-700 mb-2">输入参数</label>
          <div class="p-3 md:p-4 bg-gray-50 rounded-lg overflow-x-auto">
            <pre class="text-xs md:text-sm text-gray-900 whitespace-pre-wrap font-mono">{{ formatJSON(task.inputParams) }}</pre>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-else class="bg-white rounded-lg shadow p-4 md:p-6">
      <p class="text-gray-500 text-center text-sm md:text-base">加载中...</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import tasksData from '../../mock/tasks.json'

const route = useRoute()
const task = ref(null)

const formatJSON = (jsonString) => {
  try {
    const parsed = JSON.parse(jsonString)
    return JSON.stringify(parsed, null, 2)
  } catch (e) {
    return jsonString
  }
}

onMounted(() => {
  const taskId = route.params.id
  task.value = tasksData.find(t => t.task_id === taskId)
})
</script>
