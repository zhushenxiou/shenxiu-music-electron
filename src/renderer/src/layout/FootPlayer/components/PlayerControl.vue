<template>
  <!-- 歌曲控制 -->
  <div class="w-[60%] h-full flex flex-col items-center">
    <!-- 控制 -->
    <div class="w-[60%] h-[60%] flex items-center justify-around">
      <!-- 循环模式 -->
      <div class="cursor-pointer text-xl" @click="switchLoopMode">
        <IconLoop v-if="loopMode == 'loop'" />
        <IconRandom v-if="loopMode == 'random'" />
        <IconSingleLoop v-if="loopMode == 'cycle'" />
      </div>
      <!-- 收藏 -->
      <div class="cursor-pointer text-xl">
        <IconCollect />
      </div>
      <!-- 上一首 -->
      <div class="cursor-pointer text-xl" @click="prevSong">
        <IconPrev />
      </div>
      <!-- 播放/暂停 -->
      <div id="isPlay" class="cursor-pointer text-3xl" @click="togglePlay">
        <IconPlay v-if="!store.isPlaying" />
        <IconPause v-else />
      </div>
      <!-- 下一首 -->
      <div class="cursor-pointer text-xl" @click="nextSong">
        <IconNext />
      </div>
      <!-- 音量控制 -->
      <div class="flex items-center cursor-pointer w-24">
        <!-- 是否静音 -->
        <div class="text-2xl mr-4" @click="toggleMute">
          <IconVolume v-if="!isMute" />
          <IconMute v-else />
        </div>
        <el-slider v-model="curVolume" :show-tooltip="false" :max="100" @change="changeVolume">
        </el-slider>
      </div>
    </div>
    <!-- 进度条 -->
    <div class="w-full h-8 flex items-center gap-3">
      <div class="text-xs text-[#888]">{{ curTime }}</div>
      <el-slider
        v-model="sliderValue"
        :max="duration"
        :show-tooltip="false"
        @change="changeDuration"
        @mousedown="isDragging = true"
      />
      <div class="text-xs text-[#888]">{{ endTime }}</div>
    </div>
    <!-- 播放音乐的核心组件 autoplay-->
    <audio
      ref="audioPlayer"
      :src="store.curSongUrl"
      :autoplay="store.isPlaying"
      @timeupdate="timeupdate"
    ></audio>
  </div>
</template>

<script setup lang="ts">
import { usePlayerStore } from '@/stores/player'
import { msToMinSeconed } from '@/utils/time'
import { ElMessage } from 'element-plus'
import { computed, ref, watch } from 'vue'
import IconLoop from '@/assets/icon/IconLoop.vue'
import IconRandom from '@/assets/icon/IconRandom.vue'
import IconSingleLoop from '@/assets/icon/IconSingleLoop.vue'
import IconCollect from '@/assets/icon/IconCollect.vue'
import IconPrev from '@/assets/icon/IconPrev.vue'
import IconPlay from '@/assets/icon/IconPlay.vue'
import IconPause from '@/assets/icon/IconPause.vue'
import IconNext from '@/assets/icon/IconNext.vue'
import IconVolume from '@/assets/icon/IconVolume.vue'
import IconMute from '@/assets/icon/IconMute.vue'

const store = usePlayerStore()

// 控制audio的Ref
const audioPlayer = ref()
// 循环模式 loop random cycle
const loopMode = ref('loop')
// 拖动进度条标志（防止 timeupdate 覆盖用户操作）
const isDragging = ref(false)
// 本地滑块值，隔离 timeupdate 的覆盖
const sliderValue = ref(0)

// 当前时间 字符串（跟随滑块值，拖动时不会跳动）
const curTime = computed(() => {
  return msToMinSeconed(sliderValue.value)
})
// 总时间 毫秒
const duration = computed(() => {
  return store.curSongInfo.dt || 0
})
// 总时间 字符串
const endTime = computed(() => {
  return msToMinSeconed(duration.value)
})

// 切换循环模式
function switchLoopMode() {
  if (loopMode.value == 'loop') {
    loopMode.value = 'random'
    ElMessage.success('切换为随机播放模式')
  } else if (loopMode.value == 'random') {
    loopMode.value = 'cycle'
    ElMessage.success('切换为单曲循环播放模式')
  } else {
    loopMode.value = 'loop'
    ElMessage.success('切换为顺序循环播放模式')
  }
}

// 播放/暂停
function togglePlay() {
  if (store.curSongUrl == '') {
    ElMessage.warning('当前无音乐播放')
    return
  }
  store.isPlaying = !store.isPlaying
}

// 拖动进度条（松开滑块时触发）
function changeDuration(val: number) {
  isDragging.value = false
  // 如果有播放音乐
  if (store.curSongUrl) {
    store.curDuration = val
    sliderValue.value = val
    audioPlayer.value.currentTime = val / 1000
  } else {
    store.curDuration = 0
    sliderValue.value = 0
    ElMessage.warning('无可播放歌曲，无法进行操作')
  }
}

// 上一首
function prevSong() {
  // 顺序循环和单曲循环都是单位1
  if (loopMode.value == 'loop' || loopMode.value == 'cycle') {
    // 如果是第一首的上一首就是最后一首
    store.index = store.index == 0 ? store.playlist.length - 1 : store.index - 1
  } else if (loopMode.value == 'random') {
    store.index = Math.floor(Math.random() * store.playlist.length)
  }
  store.updateCurSong()
}

// 下一首
function nextSong() {
  if (loopMode.value == 'loop' || loopMode.value == 'cycle') {
    // 如果是最后一首的下一首就是第一首
    store.index = store.index == store.playlist.length - 1 ? 0 : store.index + 1
  } else if (loopMode.value == 'random') {
    store.index = Math.floor(Math.random() * store.playlist.length)
  }
  store.updateCurSong()
}

// 监听切换歌曲
watch(
  () => store.curSongUrl,
  (val, oldVal) => {
    // 切换的歌曲，更新为0, 且默认播放
    if (val != oldVal) {
      store.curDuration = 0
      sliderValue.value = 0
      isDragging.value = false
      store.isPlaying = true
    }
  }
)

// 是否静音控制
const isMute = ref(false)
// 当前音量大小 默认100
const curVolume = ref(100)

//切换是否静音
function toggleMute() {
  isMute.value = !isMute.value
  if (isMute.value) {
    ElMessage.success('开启静音')
  } else {
    ElMessage.warning('关闭静音')
  }
}
// 拖动音量进度条
function changeVolume(val: number) {
  curVolume.value = val
  audioPlayer.value.volume = val / 100
}

// 监听是否是静音
watch(
  () => isMute.value,
  () => {
    if (isMute.value) {
      audioPlayer.value.volume = 0
    } else {
      audioPlayer.value.volume = curVolume.value / 100
    }
  }
)

// 统一控制 audio 播放/暂停，所有地方只需操作 store.isPlaying
watch(
  () => store.isPlaying,
  (playing) => {
    if (playing) {
      audioPlayer.value.play()
    } else {
      audioPlayer.value.pause()
    }
  }
)

// 监听 store.curDuration 同步到本地滑块（拖动期间不同步）
watch(
  () => store.curDuration,
  (val) => {
    if (!isDragging.value) {
      sliderValue.value = val
    }
  }
)

// 播放音乐自动触发
function timeupdate(e: Event) {
  const audio = e.target as HTMLAudioElement | null
  if (audio == null) {
    return
  }

  // 拖动进度条时不更新，避免覆盖用户操作
  if (!isDragging.value) {
    const val = audio.currentTime * 1000
    store.curDuration = val
    sliderValue.value = val // 同步更新，避免 watcher 异步延迟导致 ended 判断滞后
  }

  // 判断歌曲是否为试听歌曲
  if (audio.ended && curTime.value < endTime.value) {
    ElMessage.warning('VIP歌曲,试听结束！！！')
    // 暂停播放
    store.isPlaying = false
  }

  // 当歌曲播放完毕后，并根据歌曲的循环方式进行操作
  if (audio.ended && curTime.value == endTime.value) {
    store.isPlaying = false
    if (loopMode.value == 'cycle') {
      // 单曲循环自动下一首还是本首
      audio.currentTime = 0
      store.curDuration = 0
      store.isPlaying = true
    } else {
      nextSong()
    }
  }
}
</script>
