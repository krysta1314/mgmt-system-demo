<template>
  <div class="flex h-screen bg-slate-100">
    <Sidebar />
    <div class="flex flex-col flex-1 ml-60">
      <!-- <Topbar /> -->
      <main class="flex-1 p-6 overflow-auto">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<script setup>
import Sidebar from './layout/Sidebar.vue'
import Topbar from './layout/Topbar.vue'
</script>
