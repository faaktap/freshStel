<template>
 <div
  style="background: rgb(97,121,110);background: radial-gradient(circle, rgba(97,121,110,0.5438550420168067) 3%, rgba(28,68,26,0.5634628851540616) 27%, rgba(25,37,24,0.865983893557423) 94%);"
 >
 <transition name="fade"
             mode="out-in"
             xxstyle="background: rgb(0,255,141);background: radial-gradient(circle, rgba(0,255,141,0.01724439775910369) 6%, rgba(28,68,26,0.06486344537815125) 46%, rgba(25,37,24,0.0984768907563025) 97%);">
   <slot />
 </transition>
 <v-card class="ma-1"
    xxstyle="background: rgb(0,255,141);background: radial-gradient(circle, rgba(0,255,141,1) 2%, rgba(25,37,24,0.835171568627451) 15%, rgba(14,57,13,1) 95%);"
    style="background: rgb(97,121,110);background: radial-gradient(circle, rgba(97,121,110,0.5438550420168067) 3%, rgba(28,68,26,0.5634628851540616) 27%, rgba(25,37,24,0.865983893557423) 94%);"
    align="center">
      Ho&euml;rskool XXXXXXXXXX High School</v-card>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition-duration: 3s;
  transition-property: opacity;
  transition-timing-function: ease;
}
.fade-enter,
.fade-enter-active {
  transition: all 3s ease;
}


</style>