<template>
  <div class="w-60 bg-slate-900 h-screen fixed left-0 top-0 flex flex-col">
    <!-- Logo Section -->
    <div class="p-6 border-b border-slate-700">
      <div class="flex items-center gap-3">
        <div class="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center font-bold text-white">
          G
        </div>
        <span class="text-white font-semibold text-lg">Genmi管理系统</span>
      </div>
    </div>

    <!-- Navigation Menu -->
    <nav class="flex-1 py-4 overflow-y-auto">
      <div v-for="section in menuSections" :key="section.title" class="mb-6">
        <!-- Section Header -->
        <div class="px-6 py-2">
          <h3 class="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            {{ section.title }}
          </h3>
        </div>

        <!-- Section Items -->
        <router-link
          v-for="item in section.items"
          :key="item.path"
          :to="item.path"
          class="flex items-center gap-3 px-6 py-3 text-slate-200 hover:bg-slate-700 transition-colors"
          :class="{
            'bg-slate-800 border-l-4 border-indigo-500': isActive(item.path)
          }"
        >
          <span class="text-xl">{{ item.icon }}</span>
          <span class="text-sm font-medium">{{ item.label }}</span>
        </router-link>
      </div>
    </nav>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { computed } from 'vue'

const route = useRoute()

const menuSections = [
  {
    title: '用户',
    items: [
      { icon: '👥', label: '用户列表', path: '/users' }
    ]
  },
  {
    title: '任务',
    items: [
      { icon: '🎬', label: '任务列表', path: '/tasks' }
    ]
  },
  {
    title: '反馈',
    items: [
      { icon: '💬', label: '反馈列表', path: '/feedback' },
      { icon: '⭐', label: '评价列表', path: '/reviews' },
      { icon: '👍', label: '内容反馈列表', path: '/content-feedback' }
    ]
  },
  {
    title: 'SEO',
    items: [
      { icon: '📝', label: '文章管理'},
    ]
  }
]

const isActive = (path) => {
  return route.path.startsWith(path)
}
</script>
