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

<!--v-parallax src="img/public.jpg" height="100vh">
<v-container grid-list-md text-xs-center>
      <v-layout row wrap>
        <v-flex >
          <student-name-card :studentList="studentList" color="green darken-3" />
          <student-subject-list :studentList="studentList" color="green darken-3" />
          <student-email-list v-if="studentList" :studentList="studentList" color="green darken-3"/>            
          <student-photo-list :studentList="studentList"  color="green darken-3" />
        </v-flex>
      </v-layout>
    </v-container>
</v-parallax-->

  <v-card>
      <v-card-text>
       <student-lookup @dataEntered="studentFound" :searchMore="searchMore" />
       <v-row v-if="studentList">
         <v-col cols="12" md="6">
          <student-name-card :studentList="studentList" color="green darken-3" />
         </v-col>
         <v-col cols="12" md="6">
          <student-subject-list :studentid="studentList.data.studentid" color="green darken-3" />
         </v-col>
         <v-col cols="12" md="6">
          <student-email-list v-if="studentid" :studentid="studentList.data.studentid" color="green darken-3"/>            
         </v-col>
         <v-col cols="12" md="6">
          <student-photo-list :studentid="studentList.data.studentid"  color="green darken-3" />
         </v-col>
        </v-row>
  
      </v-card-text>
  </v-card>

<!--
 <v-container grid-list-lg>
      <v-layout row wrap>
        <v-flex v-for="teacher in teachers" :key="teacher.firstName" xs12 sm6 md4>
          <v-card>
            <v-img :src="teacher.src" height="260px "></v-img>

            <v-card-title primary-title class='blue--text'>
              Dr. {{teacher.firstName}} {{teacher.lastName}}, {{teacher.specialty}}
            </v-card-title>

            <v-card-text class='body-1'>
              M.S at {{teacher.ms}} <br> M.S.C at {{teacher.msc}}
            </v-card-text>

            <v-card-actions>
              <v-btn outline color='blue'>
                More...
              </v-btn>
              <v-spacer></v-spacer>
              <v-btn outline color='green'>
                Appointments
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
-->
 </v-container>

  <router-link :to="{ name: 'PersonelInfo'}" > <v-icon> mdi-nature-people </v-icon> </router-link>
  
</div>
</template>

<script>
//import { zmlConfig } from '@/api/constants';
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
teachers:[
        {firstName:'Jon', lastName:'Doe', specialty:'PE', ms:' University of Georgia',
         msc:'University of Georgia', src:'https://source.unsplash.com/kmuch3JGPUM'},
        {firstName:'Maria', lastName:'Doe', specialty:'Philology', ms:'University of Atlanta',
         msc:'University of Atlanta ', src:'https://randomuser.me/api/portraits/women/3.jpg'},
        {firstName:'Jon', lastName:'Jon', specialty:'Mathematics', ms:'University of Michigan',
         msc:'University of Michigan', src:'https://source.unsplash.com/Jy4ELSGPHTc'},
        {firstName:'Peter', lastName:'Xavier', specialty:'Mathematics',
         ms:'University of Miami', msc:'University of Miami',
         src:'https://randomuser.me/api/portraits/men/71.jpg'},
        {firstName:'Peter', lastName:'Miros', specialty:'Mathematics', ms:'University of Miami',
         msc:'Georgetown University', src:'https://randomuser.me/api/portraits/men/20.jpg'},
      ]  
}),
methods: {
  IDs(value) {
    if (value.data == 'undefined') return;
    //this.$cs.l('ID = ' , value);
    this.studentIDs = value;
  },
  studentFound(value) {
    if (value.data == 'undefined') return;
    //this.$cs.l(value.data);
    this.studentList = value;
    console.log('zzzzzzzzzzzzzzzzzzzzzzzzzzzz', this.studentList)
  },
  ss() {
      infoSnackbar('hallo')
  }
},
mounted: function () {
    //this.$cs.l('SINF MOUNTED', zmlConfig.maxUploadSize)
}

}
</script>

<style scoped>
.my-toolbar >>> .v-toolbar__content {
  padding: 10px;
  justify-content: right;
}
</style>