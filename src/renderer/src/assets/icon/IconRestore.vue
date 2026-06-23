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
      x="2.5"
      y="0.5"
      width="8"
      height="8"
      fill="none"
      stroke="currentColor"
      stroke-width="1.2"
    />
    <rect
      x="0.5"
      y="2.5"
      width="8"
      height="8"
      fill="var(--header-bg-color, #f7f9fc)"
      stroke="currentColor"
      stroke-width="1.2"
    />
  </svg>
</template>

<script setup lang="ts">
withDefaults(defineProps<{ size?: number | string; className?: string }>(), { size: 12 })
</script>
