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
  <v-toolbar v-if="!$route.params.studentid" color="primary" class="my-toolbar">
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
      <v-switch v-model="searchMore"
                v-if="!$vuetify.breakpoint.smAndDown"
                class="mt-4"
                color="secondary"
                title="Search other data - like name and note"
                :label="`Search more than Surname `"
      />
      <v-back />
    </v-toolbar-items>
  </v-toolbar>
  <!-- <v-chip v-for="l in live" :key="l.desc" class="ma-2" :title="l.data.studentid" @click="quick(l.data.studentid)"> -->
  <v-chip v-for="l in live" :key="l.desc" class="ma-2" :title="l.data.studentid" @click="quickLoadStudent(l.data.studentid)">
    {{ l.data.firstname }} {{ l.data.surname }} {{ l.data.grade }}
  </v-chip>
  <v-container fluid>

       <student-lookup
          v-if="!$route.params.studentid"
          v-model="blahblah"
          @dataEntered="studentFound"
          @liveEntered="currentView"
          :searchMore="searchMore" />

      <base-tool
             v-if="studentList"
            :toolbarName="'Admin Number : ' + studentList.data.studentid"
            :background="false"
            :back="true"
      >
      </base-tool>
      <div id="printMe">

       <!-- <base-title-expand v-if="studentList" heading="Basic Student Info"> -->
          <student-name-card v-if="studentList" :studentList="studentList" color="blue lighten-2" />
       <!-- </base-title-expand> -->
       <base-title-expand v-if="studentList" heading="Student Subjects"
                          openOrClose="open">
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
       <base-title-expand v-if="studentList" heading="Prescribed Books on Loan" >
         <student-prescribed-books :studentid="studentList.data.studentid"  color="white darken-1" />
       </base-title-expand>
       <base-title-expand v-if="studentList" heading="Learn Assist">
          (We use this to mark examlists with "BUR" for separate exam venue)
          <student-learn-assist :studentid="studentList.data.studentid"  color="white darken-1" />
       </base-title-expand>
       <base-title-expand v-if="studentList" heading="Student Merits"
                          openOrClose="open">
          <student-merit :studentid="studentList.data.studentid"  color="white darken-1" />
       </base-title-expand>
      </div>
      <v-btn icon x-small @click="printIt" class="noprint"><v-icon>mdi-print</v-icon> print </v-btn>
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
              <v-btn outlined color='blue'>
                More...
              </v-btn>
              <v-spacer></v-spacer>
              <v-btn outlined color='green'>
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
import { zFetch } from '@/api/zmlFetch';
import { infoSnackbar } from '@/api/GlobalActions';
import { getters } from "@/api/store";
import HeroSection from "@/views/sections/HeroSection"
import BaseTitleExpand from '@/components/base/BaseTitleExpand.vue'
import baseTool from '@/components/base/baseTool.vue'
import StudentLookup from '@/components/student/StudentLookup'
import StudentNameCard from '@/components/student/StudentNameCard'
import StudentPhotoList from '@/components/student/StudentPhotoList'
import StudentEmailList from '@/components/student/StudentEmailList'
import StudentSubjectList from '@/components/student/StudentSubjectList'
import StudentAttendance from '@/components/student/StudentAttendance'
import StudentLearnAssist from '@/components/student/StudentLearnAssist'
import StudentMerit from '@/components/student/StudentMerit'
import StudentPrescribedBooks from '@/components/student/StudentPrescribedBooks.vue';
import VBack from '@/components/base/VBack.vue'

import { printHeader, printPage} from "@/api/zmlPrint.js"


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
           , StudentMerit
           , StudentPrescribedBooks
           , BaseTitleExpand
           , baseTool
           , VBack

           },
data: () => ({
  printHeader: printHeader,
  userHeader: "Student Info : ",
  studentList: null,
  searchMore: true,
  blahblah: '',
  getZml: getters.getState({ object:"gZml" }),
  live: [],
  teachers: [{firstName:'Jon', lastName:'Doe', specialty:'PE', ms:' University of Georgia',
              msc:'University of Georgia', src:'https://source.unsplash.com/kmuch3JGPUM'},
            ]
}),
activated()   {   this.$cs.l(this.$options.name,' - activated')  },
deactivated() {   this.$cs.l(this.$options.name,' - deactivated')  },
computed: {
  liveList() {
    if (!live) return []
    return
  }
},
methods: {
  currentView(list) {
    this.live = list.slice(0,18)
  },
   printIt() {
      printPage('printMe', true)
      this.$emit('printed')
  },
  IDs(value) {
    if (value.data == 'undefined') return;
    this.studentIDs = value;
  },
  quick(id) {
    this.$router.push({ name: 'StudentInfo', params: {studentid: id, editmode: false}})
  },
  studentFound(value) {
    if (value.data == 'undefined') return;
    this.studentList = value;
    //We call the same route, but with a new studentid.
    this.$router.push({ name: 'StudentInfo'
                      , params: {studentid: this.studentList.data.studentid, editmode: false}})
                      //, meta: {layout: 'AppLayoutGray'
                             //, authentication: "admin" } })
  },
  ss() {
      infoSnackbar('hallo')
  },
  quickLoadStudent(studentid) {
    this.$cs.l(studentid)
    let sql = `select * from dkhs_student\
               where studentid = ${studentid}`
    let p = zFetch({task:'PlainSql', sql:sql})
    p.then((r) => {
      if (r.status >= 200 && r.status <= 299) {
        return r.json();
      } else { throw Error(r.statusText) }
    })
    .then(data => {
     if ('error' in data && data.error.indexOf('no rows') > -1) {
       console.error('we have error on retrieve', data)
     } else {
      let s = data[0]
      this.studentList = {desc: `${s.surname}, ${s.firstname}  ${s.studentid} - ${s.grade}${s.gclass}  ${s.idno}`
                         ,data:s}
     }
    })
  }
},
mounted: function () {
    this.$cs.l('MOUNTED', this.$options.name, this.studentid)
    if (this.studentid  && this.studentid != 'undefined') {
       this.quickLoadStudent(this.studentid)
    }
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