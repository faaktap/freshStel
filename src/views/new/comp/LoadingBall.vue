<template>
  <div v-if="loading" class="ball" />
</template>

<script>
export default {
  name: 'Loadingball',
  props: ['loading']
}
</script>
<style  scoped>
.ball {
  position: relative;
  border-radius: 50%;
  background: red;
  height: 2vmin;
  width: 2vmin;
  animation: slide-right 2s infinite, slide-right-pause 2s infinite;
}
@keyframes slide-right {
0% {
   transform: translateX(0);
}
50% {
  transform: translateX(50px);
  }
100% {
  transform: translateX(0);
  }
}
@keyframes slide-right-pause {
50% {
 left: 0;
 }
75% {
 left: -50px;
 }
100% {
  left: 0;
 }
}
</style>
