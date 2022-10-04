<template>
 <v-app :dark="$vuetify.theme.dark">

  <!-- <AppLayoutLinks /> -->
  <!--
    Contain zml-nav-bar, v-app-bar
  -->

    <zml-nav-draw
      :drawer="drawer"
      @drawer="drawer = $event"
      @clipped="clipped = $event"
      @footerFixed="footerFixed = $event"
  />
   <v-app-bar
      :clipped-left="clipped"
      fixed
      app
      color="secondary"
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" >
        <z-show class="ma-3 pa-3" name="Hammie" />
        <!-- <z-show name="DKBadge40" />" -->
      </v-app-bar-nav-icon>
      {{ drawer}}
      <v-toolbar-title >
       <zml-title />
      </v-toolbar-title>
      <toolbar-buttons menuDisplay="horizontal" :buttonGroup="toolbars"/>
      <v-spacer />
      <login-button />
   </v-app-bar>
   <v-main id="zmlMain">
   <v-container fluid>
    <transition name="slide-fade" mode="out-in">
    <slot />
    </transition>
   <div class="ma-2">
     <v-btn @click="$cs.scrollToTop()"
          fab
          color="primary"
          title="Scroll to top"
          class="elevation-2"
          absolute bottom right
          id="scrolltotop"
     >
     <v-icon> mdi-arrow-up</v-icon>
    </v-btn>
   </div>
   </v-container>
   </v-main>



   <zml-footer />
 </v-app>
</template>

<script>
//import AppLayoutLinks from '@/layouts/AppLayoutLinks'
import zmlFooter from '@/layouts/zmlFooter.vue'
import  {zmlConfig } from '@/api/constants.js'
import { infoSnackbar } from '@/api/GlobalActions';
import zmlNavDraw from '@/components/nav/zmlNavDraw.vue'
import ZShow from '@/components/base/ZShow.vue'
import zmlTitle from '@/components/zmlTitle'
import LoginButton from '@/components/loginButton'
import ToolbarButtons from '@/components/toolbarButtons'
export default {
  name: "AppLayoutGray",
  components: {
     //AppLayoutLinks
     LoginButton
    ,ToolbarButtons
    ,zmlNavDraw
    ,zmlFooter
    ,zmlTitle
    ,ZShow
  },
  data: () => ({
    toolbars:['tool'],
    demo:1,
    clipped: true,
    drawer: true,
    footerFixed: false
  }),
  methods: {
    whatever() {
      infoSnackbar("Click on the social buttons to access our communication channels");
    }

  },
  mounted: function () {
     this.demo = zmlConfig.demo;
     console.log('mnt', this.$options.name)

  }
}
</script>

<style scoped>
.header {
  height: 15rem;
  background-color: green;
}
.info2 {
  height: 5rem;
  background-color: orchid;
}

</style>