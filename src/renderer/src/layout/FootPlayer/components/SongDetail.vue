<template>
  <!-- 歌曲详情页 -->
  <div class="relative h-full w-full">
    <!-- 主题色模糊背景 -->
    <div
      v-if="themeColor"
      class="absolute inset-0 pointer-events-none"
      :style="{
        background: themeColor,
        opacity: 0.25,
        filter: 'blur(80px)'
      }"
    />
    <div class="w-full h-200 flex relative z-1">
      <!-- 收起抽屉 -->
      <el-icon
        class="absolute cursor-pointer top-4 left-8 text-2xl z-1"
        @click="store.showSongDetails = false"
      >
        <ArrowDownBold />
      </el-icon>
      <!-- 歌曲信息和图片 -->
      <div class="w-[40%] h-full flex flex-col items-center pt-12">
        <!-- 歌曲图片 -->
        <div class="w-40 h-40 mb-8">
          <img
            :src="store.curSongInfo.al?.picUrl || ''"
            alt="歌曲封面"
            crossorigin="anonymous"
            class="w-full h-full object-cover rounded-2xl"
            @load="onCoverLoad"
          />
        </div>
        <!-- 歌曲信息 -->
        <div class="w-full text-center px-8">
          <p class="font-semibold text-2xl mb-3 line-clamp-2">{{ store.curSongInfo.name }}</p>
          <p class="text-base text-[#666] mb-3 line-clamp-2">
            <template v-for="(ar, index) in store.curSongInfo.ar" :key="ar.id">
              <span v-if="index > 0">/</span>{{ ar.name }}
            </template>
          </p>
          <p class="text-sm text-[#999]">{{ store.curSongInfo.al?.name || '' }}</p>
        </div>
      </div>
      <!-- 歌词部分 -->
      <div class="w-[60%] h-full pt-12 pr-8">
        <div ref="lyric" class="w-full h-150 py-4 text-center overflow-y-auto">
          <p
            v-for="(item, index) in store.lyric"
            :key="index"
            class="mb-6 text-base leading-relaxed transition-all duration-300"
            :class="{
              'text-[#ec4141] text-lg font-medium':
                store.curDuration >= item.time && store.curDuration <= item.next
            }"
          >
            {{ item.lrc }}
          </p>
        </div>
      </div>
    </div>
    <!-- 歌曲评论 -->
    <div v-show="store.curSongInfo.id" class="relative z-1 px-6">
      <CComments :id="String(store.curSongInfo.id)" :key="store.curSongInfo.id" :type="'song'" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { usePlayerStore } from '@/stores/player'
import { onMounted, onUnmounted, ref } from 'vue'
import CComments from '@/components/common/CComments.vue'
import { ArrowDownBold } from '@element-plus/icons-vue'
import { extractColorFromImage } from '@/utils/img'

const store = usePlayerStore()

// 歌词
const lyric = ref()

// 主题色
const themeColor = ref('')

/** 封面加载完成后提取主题色 */
async function onCoverLoad(e: Event) {
  const img = e.target as HTMLImageElement
  const color = await extractColorFromImage(img)
  if (color) {
    themeColor.value = color
  }
}

let timer: number | undefined = undefined

// 歌词滚动逻辑
onMounted(() => {
  // 歌词滚动1s刷新一次
  timer = window.setInterval(() => {
    // 获取播放到的歌词元素
    const p: HTMLElement | null = document.querySelector('p.active')
    if (p && p.offsetTop > 300) {
      // 改变父元素的顶部位置
      lyric.value.scrollTop = p.offsetTop - 300
    }
  }, 1000)
})

// 销毁前破坏定时器
onUnmounted(() => {
  clearInterval(timer)
})
</script>
