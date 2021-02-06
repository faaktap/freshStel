<template>
<div>
<v-row justify="center" class="fill-height" xalign="stretch">
   <v-col>
    <v-hover v-slot:default="{ hover }">
    <v-card max-width=200 min-width=200
            :elevation="hover ? 12 : 2"
            :class="{'on-hover': hover,'overwrite-hover': $vuetify.breakpoint.xsOnly}">
     <v-card-title align="center"> {{ item.title}} </v-card-title>
     <v-card-text class="ma-2"> {{ item.name }} </v-card-text>
     <v-card-actions>
       <v-btn @click="subject(item)" icon> Open </v-btn>
     </v-card-actions>
    </v-card>
    </v-hover>
   </v-col>
 </v-row>
 <!--material v-if="title" :heading="title" /-->
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
    props: {item:Object, heading: {type: String, default: ""} },
    data: () => ({
        getZml: getters.getState({ object: "gZml" }),
        title:''
    }),
    methods:{
        subject(xx) {
          switch (this.heading) {
          case 'Grade': this.getZml.grade = xx.name; break;
          case 'Subject': this.getZml.subject = xx.name; break;
          }
          router.push({ name: 'Material',params:{heading:xx.name} ,meta: {layout: "AppLayoutGray" }})
        }
    }

}
</script>