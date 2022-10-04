<template>
 <div>
<v-toolbar color="primary" row  wrap :loading="loading">
      Attendance {{ login.fullname}} / {{ login.username}}
      <v-spacer />
</v-toolbar>
  <v-btn @click="playSound"> snd </v-btn>
  <v-row>
  <v-col cols="12" md="6">
    <h1 class="text-head-h1 text-center"> Attendance 3 </h1>
  </v-col>
  <v-col cols="12" md="6">
      <small> {{ capDataSaved }} </small>
  </v-col>
  </v-row>
  <v-row>
   <v-col cols="12" md="6">
    <div v-if="period && 'grade' in gradeObj" class="text-caption text-center">
     {{ responsiblePerson.name }}, {{ location }}, {{ period }}, {{ gradeObj.grade }}, {{ gradeObj.subjectname }}, {{ sessionID }}
    </div>
    <v-card class="ma-2" elevation="2" loading="!loading">
     <v-card-title> Attendance Information Needed </v-card-title>
     <v-card-text>
      <v-row>
       <v-combobox
        v-model="responsiblePerson"
        :items="staffList"
        item-value="persid"
        item-text="name"
        label="Responsible Person"
        outlined
        dense
       />
       <v-combobox
        v-model="location"
        :items="locationList"
        label="Location (free entry)"
        title="You can add new room here"
        outlined
        dense
        @click.once="userSelectedSomething"
       />
       <v-combobox
        v-model="period"
        :items="periodList"
        label="Period"
        outlined
        dense
        prepend-icon="mdi-timetable"
        append-icon="mdi-magnify"
        @click:prepend="showRooster = true"
        @click:append="showRooster = true"
        @click.once="userSelectedSomething"
       />
       <v-combobox
        v-if="period"
        v-model="gradeObj"
        :items="gradeList"
        label="Grade"
        outlined
        dense
        solo
        @click.once="userSelectedSomething"
       >
       <!-- <template slot="append">
        s--append--erfserwerwerwer
       </template> -->
       <template slot="append-outer">
        x ==
       </template>
       <template slot="item" slot-scope="{item}"> <!-- ITEM DISPLAY (DROP DOWN ) -->
          {{ item.grade }}, {{ item.subjectname}} - {{ item.ckey }} {{ item.mingc }} {{ item.maxgc }}
       </template>
       <template slot="selection" slot-scope="{item}">  <!-- DISPLAY , item-text -->
          {{ item.grade }} {{ item.subjectname}} {{ item.ckey }} {{ item.mingc }} {{ item.maxgc }} [ {{ item.students}} ]
       </template>
       </v-combobox>

      </v-row>

     </v-card-text>
     <v-card-actions v-if="location && period && responsiblePerson && sessionID">
        <v-btn @click="areWeReady"> Continue </v-btn>
        <small> ( {{ menemonic }} )</small>
     </v-card-actions>
   </v-card>
  </v-col>
  </v-row>

<v-dialog v-model="showStudentList"  :fullscreen="true">
  <student-basic-list v-if="studentData.length > 0"  :studentList="studentData">
   {{ responsiblePerson.name }}, {{ location }}, {{ period }}, {{ gradeObj.grade }}, {{ gradeObj.subjectname }}, {{ sessionID }}
  </student-basic-list>
</v-dialog>

 <v-dialog v-if="menemonic" v-model="showRooster" width="auto">
  <rooster :user_name="menemonic"
           @selected="roosterSelected" />
</v-dialog>

 </div>
</template>

<script>
//import { zmlConfig } from '@/api/constants';
import { zmlFetch } from '@/api/zmlFetch.js';
import { getters } from "@/api/store";
import  {zmlLog } from "@/api/zmlLog.js"
import { zData } from "@/api/zGetBackgroundData.js"
import rooster from "@/components/learn/rooster.vue"
import { infoSnackbar } from '../api/GlobalActions';
import StudentBasicList from "@/components/student/StudentBasicList.vue"
export default {
    name:'Attendance4',
    transition: 'page-slide',
    components: {
      rooster
     ,StudentBasicList
    },
    data: () => ({
       persMenemonic: getters.getState({ object: "gZml" }).persMenemonic,
       login: getters.getState({ object: "gZml" }).login,
       loading: false,
       responsiblePerson:'',
       surname:'',
       menemonic:null,
       location:'',
       period:'',
       showBottom: false,
       capDataSaved:'',
       counter:0,
       sessionID:0,
       autoselectMenu:false,
       staffList:['Wiegand','Pollie','Alex'],
       locationList:['Hier','Daar'],
       periodList:['Admin','1','2','3','4','5','6','7','8','9','Late'],
       gradeList: ['G10'],
       gradeObj: {grade:'', subjectname: '', ckey:0},
       studentData: [],
       lastScan:'',
       showRooster:false,
       scannedRow:'',
       confirmSound:new Audio('sounds/Water drip.mp3'),
       showStudentList: false
    }),
    computed: {
    },
    methods: {
      initialize() {
        if (this.persMenemonic.length < 10) {
          infoSnackbar('we are not done yet???')
        }
        this.staffList = []
        this.locationList = []
        console.log('ASSIGNING LOOKUP VALUES')
        this.persMenemonic.forEach(e => {
             this.staffList.push({name:e.user_name + ' ' + e.surname + ' ' + e.name.substr(0,1), persid: e.persid})
             if (e.room && e.room != 'WEG') {
               this.locationList.push(e.room)
             }
        });
        this.locationList.sort()
        this.locationList.push('Admin')
        this.locationList.push('TEST')
        if (this.login.userid) {
          this.responsiblePerson = this.persMenemonic.find(e => e.persid == this.login.userid)
        }

      },
      userSelectedStaff() {
         console.log(this.responsiblePerson.name, 'was selected??')
         let persid = this.responsiblePerson.persid
         let idx = this.persMenemonic.findIndex(e => e.persid == persid)
         if (idx > -1) {
           this.menemonic = this.persMenemonic[idx].user_name
           this.surname = this.persMenemonic[idx].surname
           this.location = this.persMenemonic[idx].room
           //this.responsiblePerson = this.persMenemonic[idx].user_name
           this.loadGrades()
         } else {
          infoSnackbar('something went wrong with staff lookup, ' + idx + ', ' + persid)
         }
      },
      loadGrades() {
        console.log('loading grades for', this.surname)
        this.loading = true
        let ts = {task: 'PlainSql',
               sql: `SELECT s.subjectname,s.ckey, l.grade, min(l.gclass) mingc, max(l.gclass) macgc, count(*) students
                      FROM dkhs_studsub s ,  dkhs_personel p, dkhs_student l
                     WHERE upper(substr(p.surname,1,length(teachersurname))) = upper(teachersurname)
                       AND substr(name,1,1) = substr(teacherinitial,1,1)
                       AND s.studentid = l.studentid
                       AND l.grade not like 'o%'
                       AND p.surname like '${this.surname}%'
                    GROUP BY p.surname, p.name, s.subjectname, ckey, l.grade
                    order by l.grade, count(*) desc`
             }
        zmlFetch(ts, this.loadGradeData, this.errorLoading)
      },
      loadGradeData(response) {
        this.gradeList = response
        this.gradeObj = response[0]
        this.loading = false
        console.log('grade loaded = ', response)

      },
      userSelectedSomething() {},
      roosterSelected(a,b,c,d,e) {
       //alert('selected day=' + a + 'per=' + b + "sel=" + c)
        console.log('day',a,'per',b,'grd',c,'row',d,'?',e)
        this.showRooster = false
        this.period = b
        let r = Math.floor(Math.random()*1615).toString(5)
        this.sessionID = `${a}-${b}-${c}-${r}`
      },
      loadStudentData(response) {
        console.log('students loaded = ', response.length)
        this.studentData = response
        this.loading = false
        this.showStudentList = true
      },
      areWeReady() {
        infoSnackbar('are we ready?')
        //Check all the details, and see if we have any students to display
        // we will use gradeObj.ckey, gradeObj.grade, gradeObj.subjectname to extract students
        console.log('sql for',this.gradeObj.ckey, this.gradeObj.grade, this.gradeObj.subjectname)
        this.loading = true
        let ts = {task: 'PlainSql',
               sql: `SELECT l.studentid, l.surname, l.firstname \
                      FROM dkhs_studsub s, dkhs_student l \
                     WHERE s.subjectname = '${this.gradeObj.subjectname}'\
                       AND s.ckey = '${this.gradeObj.ckey}'\
                       AND l.grade = '${this.gradeObj.grade}'\
                       AND s.studentid = l.studentid\
                    order by l.surname, l.firstname`
             }
        zmlFetch(ts, this.loadStudentData, this.errorLoading)
      },
      errorLoading(err) {
        this.loading = false
        console.log(err)
      },
      playSound () {
        this.confirmSound.play();
      },

    },
    mounted() {
      zData.initialData('Load Important Data', this.initialize)
      zmlLog('ATT3Start', JSON.stringify({vers:"latest4Wieg",staff: this.responsiblePerson}))
      this.loading = false
      //this.initialize()
    },
    watch:{
      responsiblePerson(n,o) {
        console.log('staff selected',n.persid,o.persid)
        this.userSelectedStaff()
      },
      period() {
        if (this.period && this.sessionID.length < 5) {
            this.sessionID = `${this.period}.${Math.floor(Math.random()*1615).toString(5)}`
        }
      },
    },
    beforeDestroy() {
    }
}
</script>
