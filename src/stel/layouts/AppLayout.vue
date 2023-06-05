<template>
<!--
  Here we read the folder layouts, and get all the files in it.
  Then we match the filename as specified in layout
  -->
  <component :is="layout">
  <slot />
  </component>
</template>

<script>
import  {zmlConfig } from '@/stel/constants.js'
export default {
  name: "AppLayout",
  computed: {
    layout() {
      const layout = this.$route.meta.layout || zmlConfig.defaultLayout
      return () => import(`@/stel/layouts/${layout}.vue`)
    }
  },
  mounted: function () {
      console.log('appLO')
  }
}
</script>

<!--style scoped>
.info {
  background-color:gray;
  text-align: center;
  height: 5rem;
}
</style-->