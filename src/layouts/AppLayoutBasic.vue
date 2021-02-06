<template>
  <div>
   <v-app-bar app color="primary" title="info about AppLayoutLinks">
    <zml-title :maintitle="test" />
    <toolbar-buttons vertical buttonType="tool"/>
    <toolbar-buttons vertical buttonType="test" />    
    <v-spacer />
    <login-button/>
   </v-app-bar>

  <v-main>
    <div v-if="demo == 1" class="info5"> AppLayoutBasic Slot Start </div>
    <!--transition name="fade" mode="out-in"-->
    <slot />
    <!--/transition-->
    <div v-if="demo == 1"  class="info5"> AppLayoutBasic Slot End</div>
  </v-main>

    <v-footer app>
    This is a basic footer
    </v-footer>

  </div>
</template>

<script>
import  {zmlConfig } from '@/api/constants.js'
import ToolbarButtons from '@/components/toolbarButtons'
import LoginButton from '@/components/loginButton'
import zmlTitle from '@/components/zmlTitle'

export default {
  name: "AppLayoutBasic",
  components: {LoginButton, zmlTitle, ToolbarButtons},
  data: () => ({
    demo:0,
    test: "Basic"
  }),
  mounted: function () {
      this.demo = zmlConfig.demo
  }
}
</script>

<style scoped>
.info5 {
  height: 5rem;
  background-color: blue;
}

</style>