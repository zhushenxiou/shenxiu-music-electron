<template>
  <div v-loading="isLoading" class="flex flex-col gap-8 px-4">
    <!-- 推荐歌单 -->
    <div class="w-full">
      <!-- 标题 -->
      <div class="mb-2 text-xl font-bold">
        <span>推荐歌单</span>
        <el-icon class="relative top-[0.2rem]">
          <ArrowRight />
        </el-icon>
      </div>
      <!-- 推荐歌单列表 -->
      <Playlist :playlists="playlists" />
    </div>

    <!-- 最新专辑 -->
    <div class="w-full">
      <div class="mb-2 text-xl font-bold">
        <span>最新专辑</span>
        <el-icon class="relative top-[0.2rem]">
          <ArrowRight />
        </el-icon>
      </div>
      <Playlist :playlists="albums" type="album" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { ArrowRight } from '@element-plus/icons-vue'
import { personalizedPlaylistApi, newestAlbumApi } from '@/api/discovery'
import Playlist from '@/components/common/CPlaylist.vue'
import type { PlaylistType, NewestAlbumType } from '@/api/types'

const isLoading = ref(true)
/** 推荐歌单列表 */
const playlists = ref<PlaylistType[]>([])
/** 最新专辑列表 */
const albums = ref<NewestAlbumType[]>([])

async function getData() {
  isLoading.value = true
  const [playlistRes, albumRes] = await Promise.all([personalizedPlaylistApi(18), newestAlbumApi()])
  playlists.value = playlistRes.result
  albums.value = albumRes.albums
  isLoading.value = false
}

// 获取数据
onMounted(() => {
  getData()
})
</script>
