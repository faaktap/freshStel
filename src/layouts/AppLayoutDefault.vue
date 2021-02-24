<template>
  <div>
    <v-card class="ma-2" color="green darken-4" dark align="center">DKHS - Virtual Schooling</v-card>
    <transition name="fade" mode="out-in">
    <slot />
    </transition>
  </div>
</template>

<style scoped>
.info1 {
  background-color: thistle;
  text-align: center;
  height: 5rem;
}
</style>