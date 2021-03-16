<template>
<div>
  
<h1>ABOUT</h1>


        <hero-section 
            title="About the Virtual School System" 
            text="About this" 
            moretext="It is an example" 
            color="purple"
            button=""
            icon=""
            func=""
        />

only werner:
<v-container v-if="getZml.login.isAuthenticated && getZml.login.username=='werner'">
<v-row>
  <v-col xs12>
   <v-card color="brown lighten-2" class="ma-3 pa-2" @click.self="showMovie = !showMovie">
    Stuff inside the v-card (v-col is xs12) <v-btn @click="showAudio = !showAudio"> Audio </v-btn>
   </v-card>
  </v-col>
</v-row>

len = {{ randomColors.length}}

<v-row xv-if="randomColors.length > 0">
  <h2> All the routes currently (March 2021) in here..</h2>
  <v-col  xs12 cols=2 v-for="(p,i) in paths" :key="i">
    <v-card :color="randomColors[i]" min-width="100" class="ma-2 pa-2">
    <router-link :to="p" :title="randomColors[i]">{{p}}</router-link>
    </v-card>
  </v-col>
</v-row>





  <student-lookup @dataEntered="studentFound" @idsEntered="IDs" />
    SL = {{ studentList }} <br>     SI = {{ studentIDs }}

<v-card class="ma-2"> <v-card-title> Basic Players </v-card-title>
<!--basic-player /-->
<v-btn @click="showMovie = !showMovie"> Toggle Video </v-btn>
<v-btn @click="showAudio = !showAudio"> Toggle Audio </v-btn>
<v-btn @click="showPicture = !showPicture"> Toggle Picture </v-btn>
</v-card>


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
  </v-container>
 
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
import zmlPreview from '@/components/zmlPreview.vue'
import zmlCloseButton from '@/components/zmlCloseButton.vue'
import zmlContentButton from '@/components/zmlContentButton.vue'

import StudentLookup from '@/components/student/StudentLookup.vue'
export default {
name: "about",
props:{},
components: {snackBarTest
           , ContactForm
           , HeroSection
           , zmlPreview
           , zmlCloseButton
           , zmlContentButton
           , StudentLookup
           },
data: () => ({
  studentList:null,
  studentIDs:null,
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
  paths:['/a', '/h','/1','/','/home','/about','/hover',
   '/virtualawards/1','/studentawards', '/learntree', '/viewlearn',
   '/grade',   '/grade/8',   '/studenthub',   '/subjects',   '/student',
   '/personel',   '/viewfunctions',   '/nested',    'dialog',    '/werner'
    ,'/werner/:id'    ,'route1/:rid'    ,'/flex'    ,'/campaigns'    ,'/candidates/101'
    ,'/applicant/11102'    ,'/expand'    ,'/userlist'    ,'/test'    ,'/sview'
    ,'/tcal'    ,'/ecal'    ,'/color','/dkhsawards'],        
    randomColors:[],           
}),
computed: {

},
methods: {
  anyColor(){
    let baseColors = ['red','green','blue','yellow','pink','purple','indigo','teal','lime','orange','brown','amber']
    let tint = ['darken','lighten','accent']
    let variant = [1,2,3,4]
    let b = Math.floor(Math.random() * baseColors.length) 
    let t = Math.floor(Math.random() * tint.length) 
    let v = Math.floor(Math.random() * variant.length) 

    return baseColors[b] + ' ' + tint[t] + '-' + variant[v]
  },

  IDs(value) {
    if (value.data == 'undefined') return;
    console.log('ID = ' , value);
    this.studentIDs = value;
  },
  studentFound(value) {
    if (value.data == 'undefined') return;
    console.log(value.data);
    this.studentList = value;
  },
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
mounted: function() {
  for (let i=0 ; i<40 ; i++) {
     this.randomColors[i] = this.anyColor()
  }
  console.log(this.randomColors)
}

}
</script>