<template>
  <v-app id="app">
   <app-layout :key="projectID" >
   <v-container fluid>
     <keep-alive :max="10">
      <router-view>
      </router-view>
     </keep-alive> 
   </v-container>
   </app-layout>

    <v-snackbar
      top centered
      :color="snackbarColor"
      elevation="21"
      v-model="snackbar"
      timeout="3500">
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
    /*
    let payload = "WERNER SMIT"
    this.$cs.l(payload.toString('base64'))
    const data = {test:"test", num:"number"};
    console.log('---ORIGINAL-----', data)
    // Encode String
    const encode = Buffer.from(JSON.stringify(data)).toString('base64')
    console.log('\n---ENCODED-----', encode)
    // Decode String
    const decode = JSON.parse(Buffer.from(encode, 'base64').toString('utf-8'))
    console.log('\n---DECODED-----', decode)
    ls.save('zmlForWerner',[{some:'data', num:1234}])
    let t = ls.load('zmlForWerner')
    console.log('answer = ', t)
    */

   //Check if a reload is needed (if the version number changed)
   let curVersion = ls.load('zmlVersion')
   this.$cs.l(curVersion, '!=' , zmlConfig.projectID)
   if (curVersion != zmlConfig.projectID) {
    ls.save('zmlVersion', zmlConfig.projectID)
    this.$cs.l('Reload on new Version')
    location.reload();
   } else {
    this.$cs.l('Version is good - continue')
   }

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
</style>
