<template>
<div>

   <v-col>
    <v-hover v-slot:default="{ hover }">
    <v-card xmax-height="100"
            :elevation="hover ? 12 : 2"
            :class="{'on-hover': hover,'overwrite-hover': $vuetify.breakpoint.xsOnly}"
            class= "ma-2"
            color="deep-purple lighten-5"
            >

      <v-card-title class="wordbreak text-md-caption font-weight-light text-justify " align="center" > 
          {{ item.name }}  <br>     {{ item.nameafr}}  <v-spacer />
      </v-card-title> 
          <v-card-actions v-if="hover"><br>
           <v-btn small @click="subject(item)" color="primary"> {{ item.title}} </v-btn>
          </v-card-actions>
    
    </v-card>
    </v-hover>
   </v-col>



 </div>
</template>

<script>
//import Material from "@/views/Material"
import { getters } from "@/api/store"
import router from '@/router';
export default {
    name: "MaterialItem",    
    components: {
 //      Material: () => import('@/views/Material.vue')
    },
    props: {
          item:Object
          , heading: {type: String, default: ""}
          , language: {default:"E"} 
        },
    data: () => ({
        getZml: getters.getState({ object: "gZml" }),
        title:'',
        hover:null
    }),
    computed: { 
    },
    methods:{
        subject(xx) {
          this.getZml.grade = xx.gid
          this.getZml.subject = xx.name
          this.getZml.subjectid = xx.id
          router.push({name:'StudentHub' 
                     , params:{currentSubjectID:this.getZml.subjectid, grade:this.getZml.grade}
                     , meta: {layout: "AppLayoutGray" }})
         }
    }
}
</script>

<style scoped>
.wordbreak {
  overflow-wrap: break-word;
  word-wrap: break-word;
  word-break: break-all;
  word-break: break-word;
  hyphens: auto;
}
</style>