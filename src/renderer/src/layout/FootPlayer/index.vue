<template>
  <!-- 底部栏播放器 -->
  <div
    class="flex items-center justify-between w-screen h-[70px] fixed bottom-0 z-99999 py-2 px-4 cursor-default bg-white border-t border-solid border-[#eee]"
  >
    <!-- 歌曲信息 -->
    <div
      class="flex shrink-0 items-center cursor-pointer gap-4"
      @click="store.showSongDetails = !store.showSongDetails"
    >
      <div class="w-12 h-12 rounded-full overflow-hidden">
        <el-image :src="store.curSongInfo.al.picUrl" class="w-full h-full" />
      </div>
      <div class="text-sm">
        {{ store.curSongInfo.name }}
      </div>
      <!-- 歌曲详情页 -->
      <el-drawer
        v-model="store.showSongDetails"
        :with-header="false"
        direction="btt"
        :append-to-body="true"
        :size="'100%'"
        :z-index="9000"
      >
        <PlayDetails />
      </el-drawer>
    </div>
    <!-- 歌曲控制 -->
    <div class="w-full h-full flex flex-col items-center">
      <PlayerControl />
    </div>
    <!-- 播放列表 -->
    <div class="flex items-center">
      <div
        class="absolute cursor-pointer right-10"
        @click="store.showPlaylist = !store.showPlaylist"
      >
        <el-badge :value="store.playlist.length">
          <IconPlaylist />
        </el-badge>
        <!-- 抽屉 -->
        <el-drawer
          v-model="store.showPlaylist"
          :with-header="false"
          :append-to-body="true"
          :size="320"
          :z-index="9000"
        >
          <Playlist />
        </el-drawer>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { usePlayerStore } from '@/stores/player'
import Playlist from './components/Playlist.vue'
import PlayDetails from './components/PlayDetails.vue'
import PlayerControl from './components/PlayerControl.vue'
import { ElDrawer } from 'element-plus'
import IconPlaylist from '@/assets/icon/IconPlaylist.vue'

const store = usePlayerStore()
</script>
