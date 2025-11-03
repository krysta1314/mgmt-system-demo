<template>
  <div class="space-y-4 md:space-y-6">
    <div class="flex justify-between items-center">
      <h1 class="text-xl md:text-2xl font-bold text-gray-900">用户列表</h1>
    </div>

    <!-- Filters and Search -->
    <div class="bg-white rounded-lg shadow p-3 md:p-4">
      <div class="grid grid-cols-1 gap-3 md:gap-4" style="width: 300px;">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="按用户ID/邮箱搜索"
          class="w-full px-3 md:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm md:text-base"
        />
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
