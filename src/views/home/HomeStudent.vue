<template>
<div>
<!-- homestudent -->

<!-- <z-menu
                :permanent="true"
                :expandOnHover="true"
                :floating="true"
                :passed="['cancel', 'save', 'load']"
        /> -->

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

<v-toolbar  dense  row  wrap color="primary">
      <v-spacer />
      <base-tool-button to="/addphoto"
               class="mt-1 mr-2 mb-2 ml-2" color="secondary" icon="mdi-camera"
               title="Add sport id Photo for someone"
      >Sport ID Photo</base-tool-button>
      <base-tool-button @click="showAttendanceBadge"
               class="mt-1 mr-2 mb-2 ml-2" color="secondary" icon="mdi-wifi"
               title="Attendance badge for scanning"
      >Attendance Badge</base-tool-button>
      <base-tool-button @click="showWiFiUsername"
               class="mt-1 mr-2 mb-2 ml-2" color="secondary" icon="mdi-qrcode-scan"
               title="Show and Explain Wi-fi username/password"
      >WCGSCHOOLS WiFi</base-tool-button>
      <base-tool-button to="/calstud"
               class="mt-1 mr-2 mb-2 ml-2" color="secondary" icon="mdi-calendar"
               title="Your Calendar"
      >Calendar</base-tool-button>
</v-toolbar>

<v-dialog v-model="showPhotos" width="300" :scrollable="false" :fullscreen="$vuetify.breakpoint.smAndDown">
 <v-card>
  <v-btn icon absolute top right title="Click here to close" @click="showPhotos=false">
    <v-icon color="indigo">mdi-close</v-icon>
 </v-btn>

 <student-photo-list :studentid="studentid" @foundPhoto="weHaveIt" />

 </v-card>
</v-dialog>


<!-- <iframe src="https://en.wikipedia.org/wiki/HTML_element#Frames"
            frameborder="0"
            marginheight="0"
            marginwidth="0"
            width="100%"
            height="100%"
            scrolling="auto" /> -->
            <!--(homestudent){{ studentid }} -->

<v-row>
   <v-col cols="12" md="6">
    <v-layout row wrap align-content-center justify-space-between class="ma-2 pa-2">
     <menu-list-old functiongroup="student" />
     <menu-list-old functiongroup="other" />
    </v-layout>
   </v-col>
   <v-col cols="12" md="6">
    <v-card><v-card-title>Emails we use for newsletters </v-card-title>
     <student-email-list :studentid="studentid" color="primary" />
    </v-card>
   </v-col>
</v-row>


 <v-layout row wrap align-content-center justify-space-between class="ma-1 pa-1">
  <v-expansion-panels v-if="getZml.login.isAuthenticated">

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
        <student-merit :studentid="studentid"  xcolor="grey" />
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
import StudentEmailList from '@/components/student/StudentEmailList'
import StudentPhotoList from '@/components/student/StudentPhotoList'
import StudentSubjectList from '@/components/student/StudentSubjectList'
import StudentMerit from '@/components/student/StudentMerit'
import BaseToolButton from '@/views/new/base/BaseToolButton.vue'
import Avatar from '@/components/base/Avatar'
import { zmlLog } from '@/api/zmlLog.js';
//import ZMenu from '@/components/base/ZMenu.vue'
export default {
    name:"StudentHome",
    components:{
          MenuListOld
        , StudentEmailList
        , StudentSubjectList
        , StudentMerit
        , StudentPhotoList
        , Avatar
        , BaseToolButton
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
      zmlLog('Home', this.getZml.login.fullname, `${this.getZml.login.schoolno}`)
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

