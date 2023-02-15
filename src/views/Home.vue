<template>
<div class="home">

  <v-container fluid v-if="getZml.login.isAuthenticated && (getZml.login.username=='WER' || getZml.login.username=='JHMEL')">
   <h2> Welcome Werner! </h2>
               <v-btn to="/loadhomework"> loadhomework </v-btn>
               <v-btn to="/werner"> werner </v-btn>
 </v-container>


<!-- homeMain -->
 <v-container v-if="getZml.login.isAuthenticated==false" fluid>


    <hero-section name="forDB"
       bgpicture="https://www.zmlrekenaars.co.za/test/img/wall009.jpg"
       title="Virtual School Gateway"
    >
    </hero-section>
    <v-card class="text-center ma-3 pa-3">
    <login />
    </v-card>

 </v-container>


 <v-container v-if="getZml.login.type=='student'" fluid>
  <hero-section name="forDB"
               bgpicture="https://www.zmlrekenaars.co.za/test/img/wall009.jpg"
               title="Student's Home"
               />
  <hr />

  <student-home />

  </v-container>


  <v-container v-show="getZml.login.type=='teacher' || getZml.login.type=='admin'">
  <hero-section name="forDB"
               bgpicture="https://kuiliesonline.co.za/img/vlaghys6842.jpg"
               title="Teacher & Admin Home"
               color="indigo darken-2"
               />
  <admin-home />
  </v-container>


  </div>
</template>

<script>
import { getters } from "@/api/store"
import { doStuff,buttons } from '@/api/buttons'
import HeroSection from "@/views/sections/HeroSection.vue"
import StudentHome from "@/views/home/HomeStudent"
import AdminHome from "@/views/home/HomeAdmin"
import Login from '@/components/Login'
import { zData } from '@/api/zGetBackgroundData.js';
export default {
  name: 'Home',
  components: {
             HeroSection
           , AdminHome
           , StudentHome
           , Login
  },
  data: () => ({
    buttons: buttons,
    getZml: getters.getState({ object: "gZml" })
  }),
  computed: {
    hb() { return this.buttons['heroes'] },
    //we need to copy the array with ..., otherwise we mutate original array - rather sort it before..
    heroButtons() {
     return [...this.buttons['heroes']].sort(function(a, b) {
       if (a.name < b.name) {         return -1;      }
       if (a.name > b.name) {         return 1;       }
       return 0
      })
   }
  },
  methods: {
    setAuth() {
       this.getZml.login.isAuthenticated = !this.getZml.login.isAuthenticated
    },
    doTask(task) {
      /* Boring tasks about router, done in buttons.js */
      if (!doStuff(this.$router,task)) { console.log(task) }
   }
  },
  mounted() {
    zData.initialData('Load all the Data')
  }
}
</script>
