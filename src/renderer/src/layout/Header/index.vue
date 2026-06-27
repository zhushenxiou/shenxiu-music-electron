<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <header
    class="h-15 px-4 pt-2 flex items-center justify-between relative z-1000 select-none [-webkit-app-region:drag]"
  >
    <!-- 左侧：前进后退 -->
    <div class="flex gap-2 mr-3 [-webkit-app-region:no-drag]">
      <el-button
        :icon="ArrowLeft"
        circle
        class="bg-transparent! border! border-gray-200! text-[#333]! hover:bg-gray-50! hover:border-gray-300! transition-all duration-200"
        @click="router.back()"
      />
      <el-button
        :icon="ArrowRight"
        circle
        class="bg-transparent! border! border-gray-200! text-[#333]! hover:bg-gray-50! hover:border-gray-300! transition-all duration-200"
        @click="router.forward()"
      />
    </div>

    <!-- 搜索模块（拖拽排除） -->
    <div class="flex-1 max-w-100 mr-5 [-webkit-app-region:no-drag]">
      <Search />
    </div>

    <!-- 右侧：登录 + 窗口控制 -->
    <div class="flex items-center h-full ml-auto">
      <div class="mr-3 [-webkit-app-region:no-drag]">
        <ToLogin />
      </div>
      <!-- 窗口控制按钮 -->
      <div class="flex h-full">
        <button
          title="最小化"
          class="w-12 h-full border-0 bg-transparent text-[#333] cursor-pointer flex items-center justify-center [-webkit-app-region:no-drag] transition-colors duration-150 hover:text-black"
          @click="minimize"
        >
          <IconMinimize />
        </button>
        <button
          :title="isMaximized ? '还原' : '最大化'"
          class="w-12 h-full border-0 bg-transparent text-[#333] cursor-pointer flex items-center justify-center [-webkit-app-region:no-drag] transition-colors duration-150 hover:text-black"
          @click="toggleMaximize"
        >
          <IconMaximize v-if="!isMaximized" />
          <IconRestore v-else />
        </button>
        <button
          title="关闭"
          class="w-12 h-full border-0 bg-transparent text-[#333] cursor-pointer flex items-center justify-center [-webkit-app-region:no-drag] transition-colors duration-150 hover:text-black"
          @click="closeWin"
        >
          <IconClose />
        </button>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { ArrowLeft, ArrowRight } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import Search from './components/Search.vue'
import ToLogin from './components/ToLogin.vue'
import IconMinimize from '@/assets/icon/IconMinimize.vue'
import IconMaximize from '@/assets/icon/IconMaximize.vue'
import IconRestore from '@/assets/icon/IconRestore.vue'
import IconClose from '@/assets/icon/IconClose.vue'

const router = useRouter()
const isMaximized = ref(false)

function minimize(): void {
  window.electron.ipcRenderer.send('window:minimize')
}

function toggleMaximize(): void {
  window.electron.ipcRenderer.send('window:maximize')
}

function closeWin(): void {
  window.electron.ipcRenderer.send('window:close')
}

function onMaximizeChange(_event: unknown, maximized: boolean): void {
  isMaximized.value = maximized
}

onMounted(async () => {
  isMaximized.value = await window.electron.ipcRenderer.invoke('window:isMaximized')
  window.electron.ipcRenderer.on('window:maximize-change', onMaximizeChange)
})

onUnmounted(() => {
  window.electron.ipcRenderer.removeAllListeners('window:maximize-change')
})
</script>
