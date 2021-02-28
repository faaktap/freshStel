<template>
<div class="home">
 <v-container v-if="getZml.login.isAuthenticated==false">

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
 </v-container>


  <v-container v-if="getZml.login.type=='student'">
  <hero-section name="forDB" 
               bgpicture="https://www.zmlrekenaars.co.za/test/img/wall009.jpg" 
               title="Student's Home" 
               text="Here you can..."
               color="deep-purple lighten-2"               
               />
  <hr />
  <student-home />

  </v-container>


  <v-container v-show="getZml.login.type=='teacher'">
  <hero-section name="forDB" 
               bgpicture="https://kuiliesonline.co.za/img/vlaghys6842.jpg" 
               title="Teacher's Home" 
               color="indigo darken-2"
               text="Here you can..."/>
  <hr />
  <teacher-home />
  </v-container>




  <v-container v-show="getZml.login.type=='admin'">
  <hero-section name="forDB" 
               bgpicture="https://kuiliesonline.co.za/img/vlaghys6842.jpg" 
               title="Admin's Home" 
               color="indigo darken-2"
               text="Here you can..."/>
  <hr />
  <admin-home />
  </v-container>



  </div>
</template>

<script>
import { getters } from "@/api/store"
import { doStuff,buttons } from '@/api/buttons'
import HeroSection from "@/views/sections/HeroSection.vue"
import TeacherHome from "@/views/home/TeacherHome"
import StudentHome from "@/views/home/StudentHome"
import AdminHome from "@/views/home/AdminHome"
export default {
  name: 'Home',
  components: {
             HeroSection
           , AdminHome
           , TeacherHome
           , StudentHome    
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
    },
    doTask(task) {
      /* Boring tasks about router, done in buttons.js */
      if (!doStuff(this.$router,task)) { console.log(task) }
   }
  }
}
</script>
