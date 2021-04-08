<template>
  <div>
    <v-card class="ma-2" 
            xcolor="rgba(105, 199, 71, 0.3)" 
            color="green darken-4 yellow--text" 
            align="center">
      Ho&euml;rskool De Kuilen High School</v-card>
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