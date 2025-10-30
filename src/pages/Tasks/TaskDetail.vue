<template>
  <div class="space-y-6">
    <!-- Back Button -->
    <button @click="$router.push('/tasks')" class="flex items-center gap-2 text-indigo-600 hover:text-indigo-700">
      <span>←</span>
      <span>返回任务列表</span>
    </button>

    <!-- Task Detail Card -->
    <div class="bg-white rounded-lg shadow p-6" v-if="task">
      <h1 class="text-2xl font-bold text-gray-900 mb-6">任务详情</h1>

      <!-- Main Content Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Right Column: Task Details -->
        <div class="space-y-4">
          <!-- User Info -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">用户ID</label>
              <div class="text-gray-900">{{ task.user_id }}</div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">用户名</label>
              <div class="text-gray-900">{{ task.username }}</div>
            </div>
            <!-- Task ID -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">任务ID</label>
              <div class="text-gray-900 font-mono text-sm">{{ task.task_id }}</div>
            </div>

            <!-- Module Type -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">功能类型</label>
              <div class="text-gray-900">{{ task.moduleType }}</div>
            </div>
          </div>

          <!-- Model Info -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">模型名称</label>
              <div class="text-gray-900">{{ task.modelName }}</div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">模型ID</label>
              <div class="text-gray-900 font-mono text-sm">{{ task.modelId }}</div>
            </div>
            <!-- Duration -->
            <div v-if="task.duration !== 'N/A'">
              <label class="block text-sm font-medium text-gray-700 mb-1">时长</label>
              <div class="text-gray-900">{{ task.duration }}</div>
            </div>
            <!-- Timestamps -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">创建时间</label>
              <div class="text-gray-900 text-sm">{{ task.createdAt }}</div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">更新时间</label>
              <div class="text-gray-900 text-sm">{{ task.updatedAt }}</div>
            </div>
          </div>
        </div>
        <!-- Left Column: Media Links -->
        <div class="space-y-4">
          <!-- Thumbnail URL -->
          <div v-if="task.thumbnailUrl" class="space-y-2">
            <label class="block text-sm font-medium text-gray-700">图地址</label>
            <a :href="task.thumbnailUrl" target="_blank"
              class="text-indigo-600 hover:text-indigo-700 text-sm break-all">
              {{ task.thumbnailUrl }}
            </a>
          </div>

          <!-- Video Links -->
          <div v-if="task.videoLink" class="space-y-2">
            <label class="block text-sm font-medium text-gray-700">视频地址</label>
            <a :href="task.videoLink" target="_blank" class="text-indigo-600 hover:text-indigo-700 text-sm break-all">
              {{ task.videoLink }}
            </a>
          </div>

          <!-- <div v-if="task.remixVideoLink" class="space-y-2">
            <label class="block text-sm font-medium text-gray-700">Remix视频地址</label>
            <a :href="task.remixVideoLink" target="_blank"
              class="text-indigo-600 hover:text-indigo-700 text-sm break-all">
              {{ task.remixVideoLink }}
            </a>
          </div> -->
        </div>
      </div>

      <!-- Full Width Sections -->
      <div class="mt-6 space-y-4">
        <!-- Prompt -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">提示词</label>
          <div class="p-4 bg-gray-50 rounded-lg text-gray-900">
            {{ task.prompt }}
          </div>
        </div>

        <!-- Input Parameters -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">输入参数</label>
          <div class="p-4 bg-gray-50 rounded-lg">
            <pre class="text-sm text-gray-900 whitespace-pre-wrap font-mono">{{ formatJSON(task.inputParams) }}</pre>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-else class="bg-white rounded-lg shadow p-6">
      <p class="text-gray-500 text-center">加载中...</p>
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
