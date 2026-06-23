<template>
  <svg
    :width="size"
    :height="size"
    :class="className"
    viewBox="0 0 12 12"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect
      x="1"
      y="1"
      width="10"
      height="10"
      fill="none"
      stroke="currentColor"
      stroke-width="1.2"
    />
  </svg>
</template>

<script setup lang="ts">
withDefaults(defineProps<{ size?: number | string; className?: string }>(), { size: 12 })
</script>
