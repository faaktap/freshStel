<template>
<div>
  <v-layout v-show="getZml.login.type=='student'">
  <hero-section name="forDB" 
               bgpicture="https://www.zmlrekenaars.co.za/test/img/wall009.jpg" 
               title="Student's Home" 
               text="Here you can..."
               breakup1="255"
               breakup2="150"
               color="deep-purple lighten-2"               
               />
  <hr />
  <hero-section />

  </v-layout>

  <v-layout v-show="getZml.login.type=='teacher'">
  <hero-section name="forDB" 
               bgpicture="https://kuiliesonline.co.za/img/vlaghys6842.jpg" 
               title="Teacher's Home" 
               breakup1="255"
               breakup2="150"
               color="indigo darken-2"
               text="Here you can..."/>
  <hr />
  <hero-section />

  </v-layout>

<v-card color="brown lighten-2" class="ma-3 pa-2" @click.self="showMovie = !showMovie">
  Stuff inside the card <v-btn @click="showAudio = !showAudio"> Audio </v-btn>
</v-card>
<br /><br /><br /><br />

<!--basic-player /-->
<v-btn @click="showMovie = !showMovie"> Toggle Video </v-btn>
<v-btn @click="showAudio = !showAudio"> Toggle Audio </v-btn>
<v-btn @click="showPicture = !showPicture"> Toggle Picture </v-btn>

<v-layout row>
  <v-flex v-for="m in menuItems" :key="m.title">
<zmlContentButton :btnFace="m.title" :icon="m.icon" />
  </v-flex>
</v-layout>


<v-dialog v-model="showMovie" max-width="400">
<zml-preview  :src="src" type="movie"  >
  <zmlCloseButton @btn-click="showMovie = !showMovie"/>
</zml-preview>
</v-dialog>

<v-dialog v-model="showAudio" max-width="400">
 <zml-preview   :src="src" type="audio"  >
   <zmlCloseButton @btn-click="showAudio = !showAudio"/>
 </zml-preview>
</v-dialog>

<v-dialog v-model="showPicture" max-width="400" color="blue">
 <zml-preview   :src="src" type="Picture"  >
   <zmlCloseButton @btn-click="showPicture = !showPicture"/>
 </zml-preview>
</v-dialog>

<br /><br /><br /><br /><br /><br />
 <v-row>
  <v-col>
   <v-card class="about" color=blue>
    <h1>This is an about page</h1>
    tryme : {{ tryme }}
    <v-card-actions>
    <v-btn @click="ss()"> kliek my </v-btn>
    <v-btn @click="confirm()"> kliek my vir confirmation </v-btn>
    </v-card-actions>
   </v-card>
  </v-col>
  <v-col>
    <v-btn @click="getZml.atester = !getZml.atester"> open contact </v-btn> {{getZml.atester }}
    <contact-form>
    </contact-form>
  </v-col>
  <v-col>
    <snack-bar-test />  
  </v-col>
  

 </v-row>
 

 
</div>
</template>

<script>
import { zmlConfig } from '@/api/constants';
import { infoSnackbar } from '@/api/GlobalActions';
import snackBarTest from '@/components/snackBarTest';
import ContactForm from "@/components/ContactForm";
import { getters } from "@/api/store";
import HeroSection from "@/views/sections/HeroSection.vue"
import {halloWorld,test} from "./About.js"
//import basicPlayer from '@/video/basicPlayer.vue'
import zmlPreview from '@/components/zmlPreview.vue'
import zmlCloseButton from '@/components/zmlCloseButton.vue'
import zmlContentButton from '@/components/zmlContentButton.vue'
export default {
name: "about",
props:{},
components: {snackBarTest,ContactForm, HeroSection,zmlPreview, zmlCloseButton,zmlContentButton},
data: () => ({
  getZml: getters.getState({ object:"gZml" }),
  atester : false,
  tryme : zmlConfig.extra,
  src : "https://kuiliesonline.co.za/Subjects/GR12/Accounting_Rekeningkunde/Gr 12 - Mrs Wiegand/Budgets/14.10 Part 2.mp4",
  showMovie : false,
  showAudio : false,
  showPicture : false,
        menuItems:[ 
                   {title:'Select Folder',icon:'mdi-folder'},
                   {title:'New Folder', icon:'mdi-folder-plus-outline'},
                   {title:'New File', icon:'mdi-file'},
                   {title:'New dinges', icon:''},
                   {title:'Something very longins and weird', icon:'mdi-ambulance'},
                   {title:'Test1 woordd', icon:'mdi-coffee'},
                   {title:'Empty Folder',icon:'mdi-delete'},
                   {title:'Delete Folder',icon:'mdi-delete-empty'},
                   {title:'Refresh Folder',icon:'mdi-database-refresh'},
                   ],  
}),
methods: {
  ss() {
     infoSnackbar('Hello from snackbar in About.vue!','cyan');
     alert( halloWorld)
     console.log( test )
  },
  confirm() {
    this.$root.$confirm("Heading for User to Read"
                      , "Longer message about what the action is supposed to be"
                      , { color: 'deep-purple accent-4' })
  }
},

}
</script>