<template>
<div>
<v-toolbar color="primary">
    <v-card color="primary" width="100%" class="pa-3">
        <div class="d-flex flex-no-wrap justify-space-between">
    <div class="float-left ma-2">
         AVAILABLE OPTIONS FOR
    </div>
    <div class="float-center ma-1">
        <avatar :username="getZml.login.fullname"
               @clickAvatar="showPhoto"
               :src="photo" />
    </div>
    <div class="float-right ma-2">
         {{ getZml.login.fullname}} / G{{ getZml.login.grade }}{{ getZml.login.gclass }}
    </div>
        </div>
    </v-card>
</v-toolbar>
<v-dialog v-model="showPhotos" width="300" :scrollable="false" :fullscreen="$vuetify.breakpoint.smAndDown">
 <student-photo-list :studentid="studentid" @foundPhoto="weHaveIt" />
</v-dialog>

<v-row>
 <v-col cols="12">
  <v-expansion-panels v-if="getZml.login.isAuthenticated">
   <!-- <v-expansion-panel>
    <v-expansion-panel-header expand-icon="mdi-calendar"
       title="A calendar for your current day. If you notice the day is wrong, please inform Werner or ms. Wiegand">
       Calendar - ({{ gradeToShow.g }} {{ gradeToShow.c }} / {{ weekOrDay }})
    </v-expansion-panel-header>
   <v-expansion-panel-content>
     <calendar-student v-if="gradeToShow.c" v-show="showCal"
              :weekOrDay="weekOrDay"
              :studentGradeClass="gradeToShow.g +  gradeToShow.c" />
   </v-expansion-panel-content>
   </v-expansion-panel> -->
   <v-expansion-panel>
       <v-expansion-panel-header
         title="A list of all the places you can go to on this webpage.">
         Functions (Click here to see available functions)
       </v-expansion-panel-header>
       <v-expansion-panel-content>
          <list-test functiongroup="student" />
          <list-test functiongroup="other" />
       </v-expansion-panel-content>
   </v-expansion-panel>
  </v-expansion-panels>
 </v-col>
 <v-col cols="12">
  <student-subject-list :studentid="studentid" color="primary" />
  <student-email-list :studentid="studentid" color="primary" />
 </v-col>

<!--
{ "functionid": "2", "sortorder": "50"
, "functionname": "Display Student Content"
, "shortname": "Teach"
, "payload": "/sh"
, "functiontype": "local"
, "functionaccess": "student"
, "tip": "Select a grade and subject, and display content for students.."
, "grade": null
, "icon": "mdi-school"
, "description": null}
{ "functionid": "10", "sortorder": "55", "functionname": "RCL Campaigns", "shortname": "Sign Up", "payload": "/campaigns", "functiontype": "local", "functionaccess": "student", "tip": "DKHS Candidates Register and Voting System", "grade": null, "icon": "mdi-vote", "description": "De Kuilen Candidates Register and Voting System", "create_timestamp": "2021-03-01 15:24:45", "update_timestamp": "2021-03-18 15:49:57" }
    -->
|</v-row>

 <!--student-name-card :studentList="studentList"  maybe add the current student namecard here.. -->

    <div v-if="getZml.login.isAuthenticated && getZml.login.username=='werner'">
        <v-btn to="/viewfunctions"> functions </v-btn>
        <v-btn to="/dkhsawards"> awards </v-btn>
        <email-list />
    </div>
</div>
</template>

<script>
import { zmlConfig } from '@/api/constants';
import { zmlFetch } from '@/api/zmlFetch.js';
import { doStuff } from '@/api/buttons'
import { util } from '@/api/util'
import { infoSnackbar } from '@/api/GlobalActions';
import { getters } from "@/api/store";
import EmailList from '@/components/EmailList';
import ListTest from '@/components/ListTest.vue';
//import CalendarStudent from '@/components/CalendarStudent';
import StudentEmailList from '@/components/student/StudentEmailList'
import StudentSubjectList from '@/components/student/StudentSubjectList'
import StudentPhotoList from '@/components/student/StudentPhotoList'
import Avatar from '@/components/base/Avatar'
export default {
    name:"StudentHome",
    components:{
          EmailList
        , ListTest
        //, CalendarStudent
        , StudentEmailList
        , StudentSubjectList
        , StudentPhotoList
        , Avatar
        //, StudentGrade
     },
    data: () => ({
        getZml: getters.getState({ object: "gZml" }),
         showCal:true,
         cards: ['Today', 'Yesterday'],
         gradeToShow:{g:'', c:''},
         weekOrDay:"day",
         photo:'',
         studentid:'',
         showPhotos:false,
    }),
    computed:{
       menuFilterList() {
            if (!this.getZml) return 0;
            return this.getZml.functions.filter(a => function()
            {
                if (a.accesstype == this.getZml.login.type)
                    return 1
                else
                    return 0
                }
            )
        }
    },
    methods:{
        showPhoto(ev) {
            //We only load the photo if he clicks on the avatar icon.
            //Then we replace the "initialicon" with a actual photo - if we have one.
            console.log('He clicked the icon - display photos if there are some', ev)
            this.showPhotos = true
        },
        weHaveIt(ev) {
            console.log('arrived!!', ev)
            this.photo=ev
        },
       weekOrDayChange() {
           if (this.weekOrDay == 'day') {
               this.weekOrDay = 'week'
           } else {
               this.weekOrDay = 'day'
           }
       },
       cardColor(type) {
           switch (type) {
               case 'teacher' : return "light-green lighten-3"
               case 'student' : return "green lighten-2"
               case 'admin' : return "green accent-3"
               default : return "orange lighten-4"
           }
       },
        click(what) {
            if (doStuff(this.$router,what.payload) == 0) {
                if (what.payload.substr(0,4).toLowerCase() == 'http') {
                    window.open(what.payload,'_' + 'ko_external')
                } else {
                    infoSnackbar('Sorry, we do not handle ' + what.payload + ' yet!' )
                }
            }

        },
        loadFunctions() {
           let ts = {};
           ts.task = 'PlainSql';
           ts.sql = 'select * from dkhs_lfunction where functionaccess = "student" order by sortorder'
           ts.api = zmlConfig.apiDKHS
           zmlFetch(ts, this.showData, this.loadError)
        },
        loadError(response) {
            //this.$cs.l(response)
            alert(response)
        },
        showData(response) {
           this.getZml.functions = response
        }
    },
    mounted: function() {
        console.log('home:', this.getZml.login.grade, this.getZml.login, this.getZml.login.grade.length)
        this.studentid = this.getZml.login.schoolno
        if (this.getZml.login.grade.length == 2 ) {
           this.gradeToShow.g = 'G'.concat(this.getZml.login.grade)
        } else {
           this.gradeToShow.g = 'G0'.concat(this.getZml.login.grade)
        }
        console.log(util.getNum('009'), this.getZml.login.schoolno, this.getZml.login.username )
        this.gradeToShow.c = this.getZml.login.gclass
        console.log('home2:', this.gradeToShow.g + this.gradeToShow.c)
        this.showCal = true;
        this.loadFunctions()

    }
}
</script>

