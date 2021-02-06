<template>
<div>
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
 <hero-section name="forDB" 
               bgpicture="https://www.zmlrekenaars.co.za/test/img/wall009.jpg" 
               title="sdfsdf" 
               text="sdfs text dfsdf"/>
 <hr />
 <hero-section />

 
</div>
</template>

<script>
import { zmlConfig } from '@/api/constants';
import { infoSnackbar } from '@/api/GlobalActions';
import snackBarTest from '@/components/snackBarTest';
import ContactForm from "@/components/ContactForm";
import { getters } from "@/api/store";
import HeroSection from "@/views/sections/HeroSection.vue"
export default {
name: "about",
props:{},
components: {snackBarTest,ContactForm, HeroSection},
data: () => ({
  atester : false,
  tryme : zmlConfig.extra,
  getZml: getters.getState({ object: "gZml" }),
}),
methods: {
  ss() {
     infoSnackbar('Hello from snackbar in About.vue!','cyan');
  },
  confirm() {
    this.$root.$confirm("Heading for User to Read"
                      , "Longer message about what the action is supposed to be"
                      , { color: 'deep-purple accent-4' })
  }
},

}
</script>