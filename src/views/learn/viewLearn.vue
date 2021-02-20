<template>
<v-layout>
 <v-card>
   <v-row>
     <v-col cols="12">
  <div class="text-center">
     <v-toolbar dark color="primary" dense flat>
        <v-toolbar-title class="white--text"> Content for Grade {{ getZml.grade }} - {{ getZml.subject }} </v-toolbar-title>
      </v-toolbar>    
   </div>
     </v-col>
   </v-row>
   <v-row>
     <v-col xs-12>

       <v-btn v-for="g in groups" :key="g" 
              @click="getZml.grade = g" 
              :color="gradeColor(g)" 
              class="ma-2">
          Grade {{ g}} 
       </v-btn>          

     </v-col>
     <v-col xs-12>
       <v-btn v-for="s in getZml.subjects" :key="s.subjectid" 
              @click="setSubject(s)" 
              :title="s.description + '/' + s.beskrywing"
              :color="subjectColor(s.subjectid)"
              class="ma-2"
              small>
          {{ s.name }} 
       </v-btn>

     </v-col>
   </v-row>
   <template v-show="getZml.grade > 0 && getZml.subjectid > 0">
   <google-drive :grade="getZml.grade" :subjectid="getZml.subjectid" />

   <template v-if="getZml.login.userid == 1">
   <view-content :grade="getZml.grade" :subjectid="getZml.subjectid" />
   </template>

   </template>
 </v-card>

</v-layout>
</template>
<script>
import { zmlConfig } from '@/api/constants.js';
import viewContent from '@/views/learn/viewContent.vue';
import GoogleDrive from '@/views/learn/GoogleDrive.vue';
import { getters } from "@/api/store";
  export default {
      components: {viewContent, GoogleDrive},
    data: () => ({
      getZml: getters.getState({ object: "gZml" }),      
      groups:[8,9,10,11,12]

    }),
    methods: {
      subjectColor(sid){
        if (sid == this.getZml.subjectid) return "red"
        return ""
      },
      setSubject(subject) {
        this.getZml.subjectid = subject.subjectid
        this.getZml.subject = subject.description
      },
      gradeColor(gid){
        if (gid == this.getZml.grade) return "red"
        return ""
      }
    },
    mounted: function () {
        zmlConfig.cl('Mount:Edit');
    }
  }
</script>