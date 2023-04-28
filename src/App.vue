<template>
  <v-app id="app" >
   <app-layout :key="projectID" >
   <v-container fluid class="ml-sm-0 mr-sm-0 mr-md-2 ml-md-2  mt-2 mt-md-2 pa-0">
      <!-- <v-scroll-x-transition mode="in" hide-on-leave="true">    -->
     <!-- <v-fade-transition mode="in" xhide-on-leave="true"> -->
      <transition name="slide-fade" hide-on-leave="true">
      <!-- <transition name="slide-x-transition" hide-on-leave="true"> -->
       <keep-alive :max="10">
        <router-view />
      </keep-alive>
      </transition>
   </v-container>
   </app-layout>

    <v-snackbar
      top centered
      :color="snackbarColor"
      elevation="21"
      v-model="snackbar"
      timeout="1800">
      {{ snackbarMessage }}

      <template v-slot:action="{ attrs }">
        <v-btn color="indigo" text
          v-bind="attrs"  @click="snackbar = false"
        >Close</v-btn>
      </template>
    </v-snackbar>
    <confirm ref="confirm"></confirm>
  </v-app>
</template>


<script>
import { getters } from "@/api/store"
import { zmlConfig } from '@/api/constants'
import { zData } from "@/api/zGetBackgroundData.js"
import confirm from "@/api/DialogConfirm"
import EventBus, { ACTIONS } from '@/api/event-bus'
import { ls } from "@/api/localStorage.js"
export default {
  name: 'ZmlApp',
  components: {confirm},
  data: () => ({
    getZml: getters.getState({ object: "gZml" }),
    snackbarMessage: "",
    snackbarColor: "red accent-4",
    snackbar: false,
    projectID: zmlConfig.projectID
  }),
  methods: {
  },
  mounted: function () {
    console.log('StartApp : ',this.projectID)

   //Check if a reload is needed (if the version number changed)
   let curVersion = ls.load('zmlVersion')
   this.$cs.l(curVersion, '!=' , zmlConfig.projectID)
   if (curVersion != zmlConfig.projectID) {
      if (ls.test('zmllogin')) {
        let tmpSaveLogin = ls.load('zmllogin')
        localStorage.clear()
        ls.save('zmllogin',tmpSaveLogin)
      } else {
        localStorage.clear()
      }
      ls.save('zmlVersion', zmlConfig.projectID)
      this.$cs.l('Reload on new Version')
      location.reload();
      return
   } else {
      this.$cs.l('Version is good - continue')
   }

   zData.quickLoadInitialData('App.Vue: Load LocalStorage')

   //Cheat way to save user to windows...
   window.$aa = this.getZml.login


/* START External Programs that uses app.vue to make use of global stuff.    */
    this.$root.$confirm = this.$refs.confirm.open
    EventBus.$on(ACTIONS.SNACKBAR, (message, color) => {
        this.snackbarMessage = message;
        if (color) {
           this.snackbarColor = color
        }
        this.snackbar = true;
      });
/* END External Programs that uses app.vue to make use of global stuff.    */
  },
  destroyed () {
    EventBus.$off(ACTIONS.SNACKBAR)
  }
};
</script>

<style>
.hide {display:none;}
.noprint {display:none}

.slide-fade-enter-active {
  transition: all 1s ease;
}
.slide-fade-leave-active {
  transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active below version 2.1.8 */ {
  transform: translateY(30px);
  opacity: 0;
}



.slide-x-transition-enter-active {
  background-color: #b2fab2;
  transition: background-color 2s, all 2s;
}
.slide-x-transition-enter-to {
  background-color: white;
}
.slide-x-transition-leave-active {
  background-color: white;
  transition: background-color 2s, all 2s;
}
.slide-x-transition-leave-to {
  background-color: #fccece;
}
</style>
