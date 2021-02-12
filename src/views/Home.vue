<template>
  <div class="home">
    <!--img alt="DKHS" src="img/zmlrekenaars.png">
    <v-btn @click="setAuth"> Login </v-btn-->

 

    <div v-for="hero in heroButtons" 
              :key="hero.name">
        <hero-section 
            :bgpicture="hero.bgpicture" 
            :title="hero.title" 
            :text="hero.text" 
            :moretext="hero.more" 
            :color="hero.color"
            :button="hero.btn"
            :icon="hero.icon"
            :func="hero.func"
        />
        <!--v-card color="#45516b" class="ma-8">
          <v-card-subtitle> Parents </v-card-subtitle>
          <v-card-text>
          <p>here we will read from buttons.json and show all the information pertainong to this section
          and we will have a nice button as well</p>
          </v-card-text>
        </v-card-->
    </div>
  </div>
</template>

<script>
import { getters } from "@/api/store"
import HeroSection from "@/views/sections/HeroSection.vue"
import { doStuff,buttons } from '@/api/buttons'
export default {
  name: 'Home',
  components: {
    HeroSection
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
      console.log('Auth:',this.getZml.login.isAuthenticated)
       this.getZml.login.isAuthenticated = !this.getZml.login.isAuthenticated 
       console.log('Auth:',this.getZml.login.isAuthenticated)
       //this.isLoggedOn = true
    },
    doTask(task) {
      /* Boring tasks about router, done in buttons.js */
      if (!doStuff(this.$router,task)) { console.log(task) }
   }
  }
}
</script>
