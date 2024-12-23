<script setup>
defineProps({
  icon: {
    type: String,
    required: false,
    default: "home",
  },
  size: {
    type: String,
    required: false,
    default: "text-2xl",
  },
  color: {
    type: String,
    required: false,
    default: "text-black",
  },
  handler: {
    type: Function,
    required: false,
    default: () => {},
  },
});
</script>

<template>
  <Icon
    @click="handler"
    :class="color"
    :size="size"
    class="material-symbols-outlined cursor-pointer"
    :name="icon"
  />
</template>
