<template>
  <div class="layout">
    <!-- 第一行：顶部 header 独占一行 -->
    <Header />

    <!-- 第二行：左侧 aside + 右侧 main -->
    <div class="body-row">
      <aside class="layout-aside">
        <Aside />
      </aside>

      <main class="layout-main">
        <RouterView v-slot="{ Component }" :key="route.fullPath">
          <transition name="fade">
            <component :is="Component" />
          </transition>
        </RouterView>
      </main>
    </div>

    <!-- 固定底部播放器 -->
    <footer class="layout-footer">
      <FootPlayer />
    </footer>

    <!-- 回到顶部按钮 -->
    <el-backtop target=".layout-main" :bottom="120"></el-backtop>
  </div>
</template>

<script setup lang="ts">
import Header from './Header/index.vue'
import Aside from './Aside/index.vue'
import FootPlayer from './FootPlayer/index.vue'
import { useRoute } from 'vue-router'
const route = useRoute()
</script>

<style lang="less">
.layout {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  // --- 第一行：header ---

  // --- 第二行：aside + main ---
  .body-row {
    flex: 1;
    display: flex;
    overflow: hidden;
    margin-top: 0;
  }

  .layout-aside {
    width: 12rem;
    flex-shrink: 0;
    height: 100%;
    overflow-y: auto;
    border-right: 1px solid #e4e7ed;
  }

  .layout-main {
    flex: 1;
    height: 100%;
    overflow-y: auto;
    padding: 16px;
    padding-bottom: 86px; // 避开底部播放器
    background: #f7f9fc;
  }

  // --- 固定底部播放器 ---
  .layout-footer {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 70px;
    z-index: 1100;
  }
}
</style>
