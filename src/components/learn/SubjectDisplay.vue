<template>
<div>
<v-row  justify="center" class="fill-height" align="stretch">
   <v-col>
    <v-hover v-slot:default="{ hover }">
    <v-card max-width=300 max-height="200"
            :elevation="hover ? 12 : 2"
            :class="{'on-hover': hover,'overwrite-hover': $vuetify.breakpoint.xsOnly}"
            class= "ma-2"
            color="deep-purple lighten-5"
            >

      <v-card-title class="text-h3-md wordbreak" align="center" > 
          {{ item.name }} 
      </v-card-title> 
       <!--h3 color="info" class="pa-2 ma-2 " align="center"> {{ item.name}} </h3-->
       
     <v-card-text align="center"> 
       {{ item.title}} - 
          {{ item.nameafr}} 
       </v-card-text>       

     <v-card-actions>
       <v-spacer />
       <v-btn small @click="subject(item)" color="primary"> {{ item.title}} </v-btn>
     </v-card-actions>
    </v-card>
    </v-hover>
   </v-col>
 </v-row>
 <!--material v-if="title" :heading="title" /-->
 </div>
</template>

<script>
import { getters } from "@/api/store"
import router from '@/router';
export default {
    name: "MaterialItem",    
    components: {
    },
    props: {
          item:Object
          , heading: {type: String, default: ""}
          , language: {default:"E"} 
        },
    data: () => ({
        getZml: getters.getState({ object: "gZml" }),
        title:''
    }),
    computed: { 
    },
    methods:{
        subject(xx) {
          console.log('selected item :' ,xx)
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