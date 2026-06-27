<template>
  <div class="w-screen h-screen flex overflow-hidden">
    <!-- 左侧 aside -->
    <aside class="w-48 shrink-0 h-full overflow-y-auto border-r border-gray-200">
      <Aside />
    </aside>

    <!-- 右侧：header + main -->
    <div class="flex-1 flex flex-col overflow-hidden">
      <Header />
      <main ref="mainRef" class="flex-1 overflow-y-auto p-6 pb-21">
        <RouterView v-slot="{ Component }" :key="route.fullPath">
          <transition name="fade">
            <component :is="Component" />
          </transition>
        </RouterView>
      </main>
    </div>

    <!-- 固定底部播放器 -->
    <footer class="fixed bottom-0 left-0 w-full h-[70px] z-1100">
      <FootPlayer />
    </footer>

    <!-- 回到顶部按钮 -->
    <el-backtop :target="mainRef" :bottom="120"></el-backtop>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Header from './Header/index.vue'
import Aside from './Aside/index.vue'
import FootPlayer from './FootPlayer/index.vue'
import { useRoute } from 'vue-router'
const route = useRoute()
const mainRef = ref<HTMLElement>()
</script>
