<template>
  <div>
    <small class="info1">Default Layout</small>
    <transition name="fade" mode="out-in">
    <slot />
    </transition>
    <small class="info1">Default Layout</small>
  </div>
</template>

<style scoped>
.info1 {
  background-color: thistle;
  text-align: center;
  height: 5rem;
}
</style>