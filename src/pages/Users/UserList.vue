<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h1 class="text-2xl font-bold text-gray-900">用户列表</h1>
    </div>

    <!-- Filters and Search -->
    <div class="bg-white rounded-lg shadow p-4">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="按用户ID/邮箱搜索"
          class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
        <!-- <select
          v-model="filterCountry"
          class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        >
          <option value="">All Countries</option>
          <option v-for="country in countries" :key="country" :value="country">
            {{ country }}
          </option>
        </select> -->
        <!-- <select
          v-model="filterChannel"
          class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        >
          <option value="">All Channels</option>
          <option v-for="channel in channels" :key="channel" :value="channel">
            {{ channel }}
          </option>
        </select> -->
        <!-- <button
          @click="clearFilters"
          class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
        >
          Clear Filters
        </button> -->
      </div>
    </div>

    <!-- Users Table -->
    <Table
      :columns="columns"
      :data="filteredUsers"
      @row-click="goToUserDetail"
    />

    <!-- Empty State -->
    <EmptyState
      v-if="filteredUsers.length === 0"
      title="未找到用户"
      message="请尝试调整搜索或筛选条件"
    />

    <!-- Pagination (Mock) -->
    <div class="flex justify-center items-center gap-2">
      <button class="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50">
        上一页
      </button>
      <span class="text-sm text-gray-600">第 1 页，共 1 页</span>
      <button class="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50">
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
import usersData from '../../mock/users.json'

const router = useRouter()
const users = ref([])
const searchQuery = ref('')
const filterCountry = ref('')
const filterChannel = ref('')

const columns = [
  { key: 'user_id', label: '用户ID' },
  { key: 'username', label: '用户名' },
  { key: 'email', label: '邮箱' },
  { key: 'country', label: '国家' },
  { key: 'browser', label: '浏览器' },
  { key: 'device', label: '设备' },
  { key: 'channel', label: '注册渠道' },
  { key: 'register_time', label: '注册时间' }
]

const countries = computed(() => {
  return [...new Set(users.value.map(u => u.country))]
})

const channels = computed(() => {
  return [...new Set(users.value.map(u => u.channel))]
})

const filteredUsers = computed(() => {
  let result = users.value

  // Search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(u =>
      u.user_id.toLowerCase().includes(query) ||
      u.username.toLowerCase().includes(query) ||
      u.email.toLowerCase().includes(query)
    )
  }

  // Country filter
  if (filterCountry.value) {
    result = result.filter(u => u.country === filterCountry.value)
  }

  // Channel filter
  if (filterChannel.value) {
    result = result.filter(u => u.channel === filterChannel.value)
  }

  return result
})

const clearFilters = () => {
  searchQuery.value = ''
  filterCountry.value = ''
  filterChannel.value = ''
}

const goToUserDetail = (user) => {
  router.push(`/users/${user.user_id}`)
}

onMounted(() => {
  users.value = usersData
})
</script>
