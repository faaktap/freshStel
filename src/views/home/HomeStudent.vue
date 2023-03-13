<template>
<div>
<!-- homestudent -->
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
         {{ getZml.login.fullname}} / {{ getZml.login.grade }}  ( {{ getZml.login.logins}} )
    </div>
        </div>
    </v-card>
</v-toolbar>
<v-dialog v-model="showPhotos" width="300" :scrollable="false" :fullscreen="$vuetify.breakpoint.smAndDown">
 <student-photo-list :studentid="studentid" @foundPhoto="weHaveIt" />
</v-dialog>

<v-row class="pa-5">
    <v-col cols="12" class="text-center">
        <v-btn @click="showAttendanceBadge"
               class="ma-2 pa-2">
            <v-icon>
              mdi-qrcode-scan
            </v-icon>
          Attendance Badge
        </v-btn>
        <v-btn @click="showWiFiUsername"
               class="ma-2 pa-2">
            <v-icon>
              mdi-wifi
            </v-icon>
          WCGSCHOOLS WiFi UserName
        </v-btn>
        <v-btn to="/calstud"
               class="ma-2 pa-2">
            <v-icon>
              mdi-calendar
            </v-icon>
          Calendar
        </v-btn>

    </v-col>
</v-row>
<!-- <iframe src="https://en.wikipedia.org/wiki/HTML_element#Frames"
            frameborder="0"
            marginheight="0"
            marginwidth="0"
            width="100%"
            height="100%"
            scrolling="auto" /> -->
            <!--(homestudent){{ studentid }} -->

<v-layout row wrap align-content-center justify-space-between class="ma-1 pa-1">
    <menu-list-old functiongroup="student" />
    <menu-list-old functiongroup="other" />
</v-layout>


 <v-layout row wrap align-content-center justify-space-between class="ma-1 pa-1">
  <v-expansion-panels v-if="getZml.login.isAuthenticated">
   <!-- <v-expansion-panel>
    <v-expansion-panel-header expand-icon="mdi-calendar"
       title="A calendar for your current day. If you notice the day is wrong, please inform Werner or ms. Wiegand">
       Calendar - ({{ getZml.login.grade }}
    </v-expansion-panel-header>
   <v-expansion-panel-content>
     <calendar-student v-show="showCal" />
   </v-expansion-panel-content>
   </v-expansion-panel> -->


   <v-expansion-panel>
       <v-expansion-panel-header title="Show Email Bulletins">
          Email Bulletins</v-expansion-panel-header>

       <v-expansion-panel-content>
        <email-bulletins emailSearch="ebull" /></v-expansion-panel-content>
   </v-expansion-panel>
   <v-expansion-panel>
       <v-expansion-panel-header title="Email Addresses for Newsletters.">
         Email Addresses for Newsletters.
       </v-expansion-panel-header>
       <v-expansion-panel-content>
         <student-email-list :studentid="studentid" color="primary" />
       </v-expansion-panel-content>
   </v-expansion-panel>
   <v-expansion-panel>
       <v-expansion-panel-header title="Link to subjects">
          Subjects</v-expansion-panel-header>
       <v-expansion-panel-content>
        <student-subject-list :studentid="studentid" color="primary" />
       </v-expansion-panel-content>
   </v-expansion-panel>


   <v-expansion-panel>
       <v-expansion-panel-header title="Show Email Bulletins">
          Merits</v-expansion-panel-header>
       <v-expansion-panel-content>
       <!-- <base-title-expand v-if="studentid" heading="Student Merits"> -->
        <student-merit :studentid="studentid"  xcolor="grey" />
       <!-- </base-title-expand> -->
       </v-expansion-panel-content>
   </v-expansion-panel>
  </v-expansion-panels>
    </v-layout>


 <!--student-name-card :studentList="studentList"  maybe add the current student namecard here.. -->

</div>
</template>

<script>
import { zData } from "@/api/zGetBackgroundData.js"
import { doStuff } from '@/api/buttons'
import { util } from '@/api/util'
import { infoSnackbar } from '@/api/GlobalActions';
import { getters } from "@/api/store";
import MenuListOld from '@/components/MenuListOld.vue';
//import CalendarStudent from '@/components/CalendarStudent';
import StudentEmailList from '@/components/student/StudentEmailList'
import StudentSubjectList from '@/components/student/StudentSubjectList'
import StudentPhotoList from '@/components/student/StudentPhotoList'
import StudentMerit from '@/components/student/StudentMerit'
import EmailBulletins from '@/components/email/EmailBulletins'
import Avatar from '@/components/base/Avatar'
export default {
    name:"StudentHome",
    components:{
          MenuListOld
        //, CalendarStudent
        , StudentEmailList
        , StudentSubjectList
        , StudentPhotoList
        , StudentMerit
        , Avatar
        , EmailBulletins
        //, StudentGrade
     },
    data: () => ({
        getZml: getters.getState({ object: "gZml" }),
         showCal:true,
         cards: ['Today', 'Yesterday'],
         gradeToShow:{g:'', c:''},
         photo:'',
         studentid:'',
         showPhotos:false,
    }),
    computed:{
       menuFilterList() {
            if (!this.getZml) return 0;
            return this.getZml.functions.filter(a => function()
            {
                if (a.accesstype == 'student' || a.accesstype == 'other')
                    return 1
                else
                    return 0
                }
            )
        }
    },
    methods:{
        showWiFiUsername() {
            this.$router.push({ name: 'wifi', params: {studentid: this.studentid, editmode: false} })
        },
        showAttendanceBadge(){
             window.open(`https://kuiliesonline.co.za/att/badge/${this.studentid}`)
        },
        showPhoto(ev) {
            //We only load the photo if he clicks on the avatar icon.
            //Then we replace the "initialicon" with a actual photo - if we have one.
            this.$cs.l('He clicked the icon - display photos if there are some', ev)
            this.showPhotos = true
        },
        weHaveIt(ev) {
            this.$cs.l('arrived!!', ev)
            this.photo=ev
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
        loadError(response) {
            alert(response)
        },
        showData(response) {
           this.getZml.functions = response
        },
        initialize() {
        this.$cs.l(util.getNum('009'), this.getZml.login.schoolno, this.getZml.login.username )
        this.gradeToShow.c = this.getZml.login.gclass
        this.$cs.l('home2:', this.gradeToShow.g + this.gradeToShow.c)
        this.showCal = true;
        //this.loadFunctions()
        }
    },
    created() {
         zData.quickLoadInitialData('Load Data for incase', this.initialize)
    },
    mounted() {
      console.log('mount', this.$options.name)
        this.$cs.l('home:', this.getZml.login.grade, this.getZml.login, this.getZml.login.grade.length)
        this.studentid = this.getZml.login.schoolno
        console.log('grade',this.getZml.login.grade,this.getZml.login.grade.length)
        if (this.getZml.login.grade.length == 3 ) {
           this.gradeToShow.g = this.getZml.login.grade
        } else {
           this.gradeToShow.g = 'G'.concat(this.getZml.login.grade)
        }

    }
}
</script>

