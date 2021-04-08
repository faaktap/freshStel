<template>
<div>

 <v-container v-if="['admin','teacher'].includes(getZml.login.type)" fluid>
  <hero-section name="forDB" 
               bgpicture="https://www.zmlrekenaars.co.za/test/img/wall009.jpg" 
               title="Student Information" 
               text=""
               breakup1="100"
               breakup2="20"
               color="pink darken-3"               
               />
  <hr />

  <v-toolbar color="primary" class="my-toolbar">
    <v-toolbar-title> 
      <v-template v-if="!searchMore">
        Please enter a part of the student's surname
      </v-template>
      <v-template v-else>
        Please enter a studentid, name or surname
      </v-template>
    </v-toolbar-title>
    <v-spacer></v-spacer>
    <v-toolbar-items>
      <v-checkbox
          v-model="searchMore"
          color="secondary"
         :label="`Search more than Surname: ${searchMore}`"
      ></v-checkbox>  
    </v-toolbar-items>
  </v-toolbar>

  <v-card >
      <v-card-text>
       <student-lookup @dataEntered="studentFound" :searchMore="searchMore" />
       <v-row v-if="studentList">
         <v-col cols="12" md="6">
          <student-name-card :studentList="studentList" />
         </v-col>
         <v-col cols="12" md="6">
          <student-subject-list :studentList="studentList" />
         </v-col>
         <v-col cols="12" md="6">
          <student-email-list v-if="studentList" :studentList="studentList" />            
         </v-col>
         <v-col cols="12" md="3">
          <student-photo-list :studentList="studentList" />
         </v-col>
        </v-row>
  
      </v-card-text>
  </v-card>
 </v-container>

  <router-link :to="{ name: 'PersonelInfo'}" > <v-icon> mdi-nature-people </v-icon> </router-link>
  
</div>
</template>

<script>
import { zmlConfig } from '@/api/constants';
import { infoSnackbar } from '@/api/GlobalActions';
import { getters } from "@/api/store";
import HeroSection from "@/views/sections/HeroSection"
import StudentLookup from '@/components/student/StudentLookup'
import StudentNameCard from '@/components/student/StudentNameCard'
import StudentPhotoList from '@/components/student/StudentPhotoList'
import StudentEmailList from '@/components/student/StudentEmailList'
import StudentSubjectList from '@/components/student/StudentSubjectList'

export default {
name: "StudentInfo",
props:{},
components: {HeroSection
           , StudentLookup
           , StudentNameCard
           , StudentPhotoList
           , StudentEmailList    
           , StudentSubjectList       
           },
data: () => ({
  studentList:null,
  searchMore:false,
  getZml: getters.getState({ object:"gZml" }),
}),
methods: {
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
      infoSnackbar('hallo')
  }
},
mounted: function () {
    console.log('SINF MOUNTED', zmlConfig.maxUploadSize)
}

}
</script>

<style scoped>
.my-toolbar >>> .v-toolbar__content {
  padding: 10px;
  justify-content: right;
}
</style>