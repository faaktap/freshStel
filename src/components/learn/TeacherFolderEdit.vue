<template>
      <v-card  min-height="100"
              :elevation="12"
         dense
         class= "ma-2 ma-sm-1 pr-sm-2"
         color="blue lighten-3"
      >
      <v-card-text class="text-caption text-sm-body-2 text-md-body-1 text-lg-h6 text-xl-h4"> 
       <strong>Properties & Actions</strong>
       <v-row>
         <v-col cols="12" class="d-flex flex-wrap">
           <v-radio-group v-model="editing" v-for="eo in editoptions" :key="eo" 
                          row
                          class="ma-0 pa-0 text-caption text-sm-body-2 text-md-body-1 text-lg-h6 text-xl-h4">
               <v-radio class="ma-0" :label="eo" :value="eo"></v-radio>
           </v-radio-group>    
       </v-col>
       </v-row>
       <v-row>
       <v-col cols="12" xmd="8" lxg="8" xxl="8">
       <v-card color="purple lighten-3" class="pa-1 ma-2 text-caption text-sm-body-2 text-md-body-1">
        <template v-if="['properties'].includes(editing)">           
           <sml class="mx-2 my-1" head="Type" :val="item.type" />
           <sml class="mx-2 my-1 text-caption text-sm-body-2 text-md-body-1" 
                head="Owner" 
               :val="look.persMenemonic(item.persid)" />           
           <sml class="mx-2 my-1" head="Access" :val="item.accesstype" />
           <sml class="mx-2 my-1 text-caption text-sm-body-2 text-md-body-1" head="Name" :val="item.name" />
           <sml class="mx-2 my-1 text-caption text-sm-body-2 text-md-body-1" head="Age" :val="item.days + ' days'" />
           <sml class="mx-2 my-1" head="Updated" :val="item.update_timestamp" />
           <sml class="mx-2 my-1" head="Created" :val="item.create_timestamp" />           
        </template>
        <template v-if="['delete'].includes(editing)">
           <v-card-text> 
               DELETE
           </v-card-text>
           <v-card-actions> 
               <v-btn x-small> sdf </v-btn> 
               <v-btn x-small> sdf </v-btn> 
           </v-card-actions>
        </template>
        <template v-if="['move'].includes(editing)">
           MOVE
        </template>
        <template v-if="['upload'].includes(editing)">
           UPLOAD
        </template>
        <template v-if="['name'].includes(editing)">
           <v-text-field solo v-model="item.name" />
           <v-btn x-small>save</v-btn>
        </template>
       </v-card>
       </v-col>
       </v-row>
<!--
            <br />  Last Edit : {{ item.days }}  days(s) ago
            <br />  Name : {{ item.name }}
            <br />  Description : {{ item.description }}
            <br />  Img : {{ item.img }}
            <br />  Created : {{ item.create_timestamp.substr(0,10) }}
            <br />  icon : {{ item.img | icon }}
            <br />  filetype : {{ item.img | fileType }}
            {{ item }}
-->
      </v-card-text>
     </v-card>
</template>

<script>
import sml from '@/components/base/BaseSmall'
import { look } from "@/api/Lookups.js"
export default {
    name:"TeacherFolderEdit",
    props:['item'],
    components:{ sml },
    data: () => ({
        bhover:null,
        look:look,
        editing:"properties",
        editoptions:["properties","name","move","delete","upload"],
    }),
    filter: {
    },
    methods: {
    },
    watch: {
    }
}
</script>