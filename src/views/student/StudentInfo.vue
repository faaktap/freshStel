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
      <template v-if="!searchMore">
        Please enter a part of the student's surname
      </template>
      <template v-else>
        Please enter a studentid, name or surname
      </template>
    </v-toolbar-title>
    <v-spacer></v-spacer>
    <v-toolbar-items>
      <v-switch
          v-model="searchMore"
          color="secondary"
         :label="`Search more than Surname: ${searchMore}`"
      ></v-switch>
    </v-toolbar-items>
  </v-toolbar>


  <v-container>

       <student-lookup
          v-model="blahblah"
          @dataEntered="studentFound"
          :searchMore="searchMore" />
       {{ blahblah }}
       <div v-if="studentList"> Admin Number : {{ studentList.data.studentid }} </div>

       <base-title-expand v-if="studentList" heading="Basic Student Info">
          <student-name-card :studentList="studentList" color="blue lighten-2" />
       </base-title-expand>
       <base-title-expand v-if="studentList" heading="Student Subjects">
           <student-subject-list :studentid="studentList.data.studentid" color="white darken-1" />
       </base-title-expand>
       <base-title-expand v-if="studentList" heading="Student Email Contacts">
          <student-email-list :studentid="studentList.data.studentid" color="white darken-1"/>
       </base-title-expand>
       <base-title-expand v-if="studentList" heading="Student Photos">
          <student-photo-list :studentid="studentList.data.studentid"  color="white darken-1" />
       </base-title-expand>
       <base-title-expand v-if="studentList" heading="Student Attendance">
          <student-attendance :studentid="studentList.data.studentid"  color="white darken-1" />
       </base-title-expand>
       LearnAssis
       <base-title-expand v-if="studentList" heading="Learn Assist">
          <student-learn-assist :studentid="studentList.data.studentid"  color="white darken-1" />
       </base-title-expand>

  </v-container>

<!--   another nice card layout we might use...
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
import BaseTitleExpand from '@/components/base/BaseTitleExpand.vue'
import StudentLookup from '@/components/student/StudentLookup'
import StudentNameCard from '@/components/student/StudentNameCard'
import StudentPhotoList from '@/components/student/StudentPhotoList'
import StudentEmailList from '@/components/student/StudentEmailList'
import StudentSubjectList from '@/components/student/StudentSubjectList'
import StudentAttendance from '@/components/student/StudentAttendance'
import StudentLearnAssist from '@/components/student/StudentLearnAssist'

export default {
name: "StudentInfo",
props:['studentid'],
components: {HeroSection
           , StudentLookup
           , StudentNameCard
           , StudentPhotoList
           , StudentEmailList
           , StudentSubjectList
           , StudentAttendance
           , StudentLearnAssist
           , BaseTitleExpand
           },
data: () => ({
  studentList: null,
  searchMore: true,
  blahblah: '',
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
    this.studentIDs = value;
  },
  studentFound(value) {
    if (value.data == 'undefined') return;
    this.studentList = value;
  },
  ss() {
      infoSnackbar('hallo')
  },
},
mounted: function () {
    //this.$cs.l('SINF MOUNTED', zmlConfig.maxUploadSize)
    // maybe call same function with adminnumber?

    // need to work on this, move student retrieval to a js file, so we can  make a call on a studentnumber
    // if (this.$route.params.studentid !== "undefined") {
    //   alert(this.studentid)
    //   this.searchMore = true
    //   this.blahblah = this.$route.params.studentid
    // }

}

}
</script>

<style scoped>
.my-toolbar >>> .v-toolbar__content {
  padding: 10px;
  justify-content: right;
}
</style>