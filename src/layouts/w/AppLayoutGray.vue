<template>
 <v-container fluid class="ma-0 pa-0">
   <AppLayoutLinks />
   <v-main>
    <transition name="fade" mode="out-in">
    <slot />
    </transition>
   </v-main>

   <v-btn @click="$cs.scrollToTop()"
          fab
          x-small
          color="primary"
          title="Scroll to top"
          class="elevation-2"
          absolute bottom right
   >
     <v-icon> mdi-arrow-up</v-icon>
   </v-btn>

   <div class="d-none d-lg-block" >
   <v-footer app style="opacity:0.8">
    <v-row v-if="showFooter">
      <v-col cols="12">
      <v-card color="grey lighten-3" elevation="0" align="center" class="pt-0 pb-0 ma-0">

        <v-btn class="mx-3" dark icon bottom color="green darken-7"
               href="https://www.dekuilen.com"
               target="_blank"
               title="public website">
          <v-icon small> DK </v-icon>
        </v-btn>

        <v-btn class="mx-3" dark icon bottom color="blue"
               href="https://www.facebook.com/dekuilen"
               target="_blank"
               title="facebook - dekuilen">
          <v-icon small>mdi-facebook</v-icon>
        </v-btn>

        <v-btn class="mx-3" dark icon bottom color="blue darken-7"
               small left href="https://www.twitter.com/hsdekuilen"
               target="_blank"
               title="Twitter - DeKuilenHS">
          <v-icon small>mdi-twitter</v-icon>
        </v-btn>

        <v-btn class="mx-3" dark icon bottom color="purple"
               small href="https://www.instagram.com/dekuilenhighschool/"
               target="_blank"
               title="Instagram - DeKuilenHS">
          <v-icon small>mdi-instagram</v-icon>
        </v-btn>
        <v-btn class="mx-3" dark icon bottom color="purple"
               small href="https://www.instagram.com/truekuilies/"
               target="_blank" title="truekuilies">
          <v-icon small>mdi-instagram</v-icon>
        </v-btn>

        <v-btn class="mx-3" dark icon bottom color="tertiary" @click="nomail">
          <v-icon small >mdi-email</v-icon>
        </v-btn>
        <!-- Hide the footer -->
        <v-btn icon @click="showFooter = false" class="mx-3"
               ><v-icon small> mdi-close </v-icon> </v-btn>
      </v-card>

     </v-col>
    </v-row>
   </v-footer>
   </div>
 </v-container>
</template>

<script>
import AppLayoutLinks from '@/layouts/AppLayoutLinks'
import  {zmlConfig } from '@/api/constants.js'
import { infoSnackbar } from '@/api/GlobalActions';
export default {
  name: "AppLayoutGray",
  components: {
    AppLayoutLinks
  },
  data: () => ({
    appVar:'This is appVar',
    demo:1,
    showFooter: true
  }),
  methods: {
    nomail() {
      infoSnackbar("You can only send mail after you are identified on this platform");
    },
    whatever() {
      infoSnackbar("Click on the social buttons to access our communication channels");
    }

  },
  mounted: function () {
      this.demo = zmlConfig.demo;
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