<template>
  <svg
    :width="size"
    :height="size"
    :class="className"
    viewBox="0 0 12 12"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect y="5.5" width="12" height="1" fill="currentColor" />
  </svg>
</template>

<script setup lang="ts">
withDefaults(defineProps<{ size?: number | string; className?: string }>(), { size: 12 })
</script>
