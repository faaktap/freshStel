<template>
<div>
  <v-layout>
  <hero-section name="forDB" 
               bgpicture="https://www.zmlrekenaars.co.za/test/img/wall009.jpg" 
               title="Student Information" 
               text=""
               breakup1="100"
               breakup2="20"
               color="pink darken-3"               
               />
  <hr />
  </v-layout>

  <v-container v-if="['admin','teacher'].includes(getZml.login.type)">

  <v-card >
      <v-card-title>
          Please enter a few characters of the student's surname
      </v-card-title>
      <v-card-text>
       <student-lookup @dataEntered="studentFound"  />
       <v-layout row v-if="studentList">
         <v-flex>
            <student-name-card :studentList="studentList" />
         </v-flex>
         <v-flex>
            <student-photo-list :studentList="studentList" />
         </v-flex>
        </v-layout>
  
      </v-card-text>
  </v-card>
 </v-container>
 <v-row>
   <v-col xs12 cols="12">
 <student-email-list v-if="studentList" :studentList="studentList" />
   </v-col>
 </v-row>

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

export default {
name: "StudentInfo",
props:{},
components: {HeroSection
           , StudentLookup
           , StudentNameCard
           , StudentPhotoList
           , StudentEmailList           
           },
data: () => ({
  studentList:null,
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