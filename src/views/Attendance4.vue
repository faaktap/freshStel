<template>
<v-container v-if="['admin','teacher'].includes(getZml.login.type)" fluid>
  <hero-section name="forDB"
              bgpicture="https://www.zmlrekenaars.co.za/test/img/wall042.jpg"
              title="Create Attendance Session"
              text=""
              breakup1="100"
              breakup2="20"
              color="purple darken-1"
               />
  <!-- <hero-section name="forDB"
              bgpicture="https://www.zmlrekenaars.co.za/test/img/wall011.jpg"
              title="Create Attendance Session"
              breakup1="100"
              breakup2="20"
              color="purple darken-1"
               />
  <hero-section   bgpicture="https://www.zmlrekenaars.co.za/test/img/wall039.jpg"
              title="Create Attendance Session"
              color="white"/>
<hero-section   bgpicture="https://www.zmlrekenaars.co.za/test/img/wall032.jpg"
              title="Create Attendance Session"
              color="white"/>
<hero-section   bgpicture="https://www.zmlrekenaars.co.za/test/img/wall062.jpg"
              title="Create Attendance Session"
              color="white"/> -->

  <!-- <base-title-expand color="white" heading="ATTENDANCE CLASS LIST SELECT">
   <p>
    Attendance lists are beinge read from classlists. So whenever you add  a classlist, that list will be selectable here.
    Once you have selected a day, period, classroom, person and list, you will be taken to the list where you can mark students as absent, etc.
    <br>
    {{ persMenemonic}}
    </p>
  </base-title-expand> -->

  <base-tool :toolList="[]"
           :toolbarName="`Attendance 4 ${login.fullname} / ${ login.username}`"
           :loading="loading"
           :background="false"
           :back="true"
           class="ma-2"
  >
    <div v-if="period && tListObj && 'grade' in tListObj && $vuetify.breakpoint.smAndUp" class="text-caption text-center">
     {{ login.userid }}, {{ location }}-{{ placeid }}, {{ period }}, {{ day }}, {{ tListObj.grade }}, {{ tListObj.subjectname }}, sID={{ sessionID }}
    </div>
   <v-spacer />
            <v-btn  @click="viewAttendance"
                   title="View previous Attendance Records"
            > <v-icon>mdi-view-agenda-outline</v-icon>
              View Records
            </v-btn>


            <v-btn icon @click="playSound"> <v-icon>mdi-cellphone-sound</v-icon> </v-btn>
</base-tool>
<!-- {{place}} -->

  <v-row>
   <v-col cols="12" md="12">
    <v-card class="ma-2" elevation="2" loading="!loading">
     <v-card-title> Attendance Information Needed </v-card-title>
     <v-card-text>
      <v-layout wrap justify-space-around>

       <v-combobox
        class="ma-1"
        v-model="responsiblePerson"
        :items="staffList"
        item-value="persid"
        item-text="name"
        label="Responsible Person"
        prepend-inner-icon="mdi-human"
        outlined
        clearable
        dense
       />

       <v-autocomplete
        class="ma-1"
        v-if="locationList && locationList.length"
        v-model="location"
        :items="locationList"
        label="Location"
        :title="locationTitle"
        prepend-inner-icon="mdi-google-classroom"
        outlined
        clearable
        @blur="userSelectedLocation"
        @click.once="userSelectedSomething"
        dense
       >
        <template slot="selection" slot-scope="{item}">  <!-- DISPLAY , item-text -->
         {{ item }}
       </template>
       </v-autocomplete>

       <!-- <v-btn class="ma-1 mt-4"   @click="showRooster = true"> <v-icon> mdi-timetable</v-icon></v-btn> -->


       <v-combobox
        class="ma-1"
        v-model="period"
        label="Period"
        :items="periodList"
        outlined
        clearable
        append-icon="mdi-timetable"
        @click:append="showRooster = true"
        @click.once="userSelectedSomething"
        dense
       />
       <v-text-field
        class="ma-1"
        v-model="day"
        label="Day"
        outlined
        max-width="60" min-width="60"
        append-icon="mdi-timetable"
        clearable
        @click:append="showRooster = true"
        @click.once="userSelectedSomething"
        dense
       />


       <v-autocomplete
        class="ma-1"
        v-if="tList && tList.length"
        v-model="tListObj"
        :items="tList"
        label="Attendance List"

        item-text="listname"

        prepend-inner-icon="mdi-pen-plus"
        append-outer-icon="mdi-magnify"
        outlined

        @click:append-outer="showChoosy = true"
        @click.once="userSelectedSomething"
        dense
        return-object
       >
        <!-- <template slot="append-outer" >
        TL
        </template>
        -->
        <!-- ITEM DISPLAY (DROP DOWN ) -->
        <template slot="item" slot-scope="{item}">
          {{ item.listname }} - {{ item.grade }}
        </template>
        <!-- DISPLAY , item-text -->
        <!-- <template slot="selection" slot-scope="{item}">
         {{ item.listname }}
        </template> -->
       </v-autocomplete>

       <v-card v-else class="mt-3 pa-2" height="50" color="red lighten-2">
        <v-icon> mdi-info </v-icon>
        There are no teacherLists avaliable for {{ surname }} <v-btn small title="See all lists" @click="showAllLists"> More </v-btn>
       </v-card>

       <!-- <span> Allow Grade Selection, One student selection, other lists selection (non private) </span> -->
       <v-card v-if="showHelpForNewList" class="mt-3 pa-2" height="50" color="green lighten-2">
        <v-icon> mdi-info </v-icon>
        To add a new list, go to "Class Lists" There are no teacherLists avaliable for {{ surname }} <v-btn small title="See all lists" @click="showAllLists"> More </v-btn>
       </v-card>
      </v-layout>

     </v-card-text>
     <v-card-actions v-if="location && period && responsiblePerson && sessionID">
      <v-spacer />
      <v-btn @click="areWeReady" class="ma-2" color="primary"> Continue </v-btn>
     </v-card-actions>
     <v-card-text v-else> Be sure and fill all options, click <v-btn icon @click="showRooster=true"><v-icon>mdi-timetable</v-icon></v-btn>
     to set the day. CurrentSelection: S={{responsiblePerson.persid || 'e'}}, C={{placeid}}, D={{day}}, P={{period}}
     <v-btn icon @click="userSelectedSomething"><v-icon>mdi-glasses</v-icon></v-btn>
     </v-card-text>
   </v-card>
  </v-col>
  </v-row>

 <v-dialog v-if="menemonic" v-model="showRooster" width="auto">
  <keep-alive>
  <rooster :user_name="menemonic"
           @selected="roosterSelected" />
  </keep-alive>
</v-dialog>

<v-dialog v-model="showChoosy"  width="450" :fullscreen="$vuetify.breakpoint.smAndDown">
  <keep-alive>
     <choosy v-model="choosyStuff"
             :items="tList"
             @objectSelected="classListReceived" />
  </keep-alive>
</v-dialog>

</v-container>
</template>

<script>
//import { zmlConfig } from '@/api/constants';
import { zmlFetch } from '@/api/zmlFetch.js';
import { getters } from "@/api/store";
import  {zmlLog } from "@/api/zmlLog.js"
import { zData } from "@/api/zGetBackgroundData.js"
//import { ls } from "@/api/localStorage.js"
import HeroSection from "@/views/sections/HeroSection"
import baseTool from '@/components/base/baseTool.vue'
//import BaseTitleExpand from '@/components/base/BaseTitleExpand.vue'
import rooster from "@/components/learn/rooster.vue"
import Choosy from '@/components/Choosy.vue'
import { errorSnackbar, infoSnackbar } from '../api/GlobalActions';
export default {
    name:'Attendance4',
    transition: 'page-slide',
    components: {
      HeroSection
    , rooster
    , baseTool
    //, BaseTitleExpand
    , Choosy
    },
    data: () => ({
       loading: false,
       login: getters.getState({ object: "gZml" }).login,
       persMenemonic: getters.getState({ object: "gZml" }).persMenemonic,
       getZml:getters.getState({ object: "gZml" }),
       responsiblePerson:'',
       surname:'',
       menemonic:null,

       choosyStuff: '',
       showChoosy: false,

       place: getters.getState({ object: "gZml" }).place,
       curPlace: {},
       placeid: '',
       location: '',
       locationTitle: 'You can choose your classroom here',
       //locationList is read from personel file
       locationList: ['Hier','Daar'],

       period:'',
       day:'',
       counter:0,
       sessionID:0,
       staffList:['Wiegand','Pollie','Alex'],
       periodList:['Admin','1','2','3','4','5','6','7','8','9','Late'],
       tListObj: {grade:'', subjectname: '', ckey:0},
       tList: [],
       tLists: false,
       lastLoadedListTeacherName: '',
       studentData: [],
       lastScan:'',
       showRooster:false,
       scannedRow:'',
       confirmSound:new Audio('sounds/Water drip.mp3'),
       showStudentList: false,
       showHelpForNewList:false
    }),
    computed: {
    },
    methods: {
      classListReceived(e) {
        //console.log('set obj tListObj to ', e)
        this.showChoosy = false;
        this.tListObj=e
      },
      initialize() {
        this.loading = false
        if (this.persMenemonic.length < 10) {
          errorSnackbar('we are not done yet? - no personel loaded')
        }
        if (this.place.length < 4) {
          errorSnackbar('we are not done yet? - no locations loaded')
          this.$router.push({ name: 'HomeStart' , meta: {layout: "AppLayoutDefault" }})
          return
        }
        this.staffList = []
        this.locationList = []
        //console.log('ASSIGNING LOOKUP VALUES')
        this.persMenemonic.forEach(e => {
             this.staffList.push({name:e.user_name + ' ' + e.surname + ' ' + e.name.substr(0,1), persid: e.persid})
             if (e.user_name == this.login.username) {
                this.responsiblePerson = {name:e.user_name + ' ' + e.surname + ' ' + e.name.substr(0,1), persid: e.persid}
             }
             if (e.room && e.room != 'WEG') {
               this.locationList.push(e.room)
             }
        });
        this.locationList.sort()
        this.locationList.push('TEST')
        //console.log('assigned to responsible person on initialize : ', this.responsiblePerson)
        this.loadTeacherLists()
      },
      viewAttendance() {
        this.$router.push('/attview')
      },
      userSelectedStaff() {
         //console.log(this.responsiblePerson.name, 'was selected??')
         let persid = this.responsiblePerson.persid
         let idx = this.persMenemonic.findIndex(e => e.persid == persid)
         if (idx > -1) {
           this.menemonic = this.persMenemonic[idx].user_name
           this.surname = this.persMenemonic[idx].surname
           this.location = this.persMenemonic[idx].room
           //this.responsiblePerson = this.persMenemonic[idx].user_name
           this.loadTeacherLists()
           this.userSelectedLocation()
         } else {
          infoSnackbar('something went wrong with staff lookup, ' + idx + ', ' + persid)
         }
         this.checkIfAllSelected()
      },
      userSelectedLocation(){
        if (!this.location) return

        //console.log('userSelectedLocation : ', this.location, this.place)
        this.curPlace = this.place.find(e => {
          //console.log ('Link Class to Pers',e.name , e.name.trim().toUpperCase() ,'==', this.location.trim().toUpperCase())
          if (e.name && e.name.trim().toUpperCase() == this.location.trim().toUpperCase()) return true
        })
        if (!this.curPlace) {
          console.log('we did not get a lookup value!!!!', this.curPlace)
          errorSnackbar('That location is not in our lookuplist?', this.location)
          this.location = ''
          this.placeid = ''
          return
        }
        this.locationTitle = this.curPlace.workarea + ' ' + this.curPlace.name + ' (' + this.curPlace.description +')'
        this.location = this.curPlace.name
        this.placeid = this.curPlace.placeid
        this.checkIfAllSelected()
      },
       userSelectedSomething() {
      //   alert('do we get here?')
          this.checkIfAllSelected()
       },
      checkIfAllSelected() {
        if (this.day && this.period && this.placeid) {
          this.sessionID = `${this.day}.${this.period}.${this.placeid}-${Math.floor(Math.random()*1615).toString(5)}`
          // console.log('Saving our variables for later use!')
          // ls.save('attPeriod',this.period)
          // ls.save('attPlaceID',this.placeid)
          // ls.save('attDay',this.day)
        } else {
          // console.log(`All not selected yet ..  Day${this.day}.Per${this.period}.Place${this.placeid}-`)
        }
      },
      showAllLists() {
        this.loadTeacherListData(this.getZml.classList)
      },
      loadTeacherLists() {
        if (!this.surname) return
        if (this.lastLoadedListTeacherName == this.surname) return
        this.lastLoadedListTeacherName = this.surname
        this.loadTeacherListData(this.getZml.classList)
      },
      loadTeacherListData(response) {
        this.tList = response
        //Move current teachers list(s) to the top
        this.tList.forEach( (item,i) => {
          if (item.teacher.toUpperCase().indexOf(this.surname.toUpperCase()) > -1) {
            this.tList.splice(i, 1);
            this.tList.unshift(item);
          }
        });
        // Link to first item
        this.tListObj = response[0]
        infoSnackbar('Teacher list loaded')
        if (this.tList.length == 0) {
          //Try to fix it a final time....
          this.tList = this.getZml.classList
          this.tListObj = this.tList[0]
        }
        this.loading = false


      },
      roosterSelected(a,b,c,d,e) {
       //alert('selected day=' + a + 'per=' + b + "sel=" + c)
        console.log('day',a,'per',b,'grd',c,'row',d,'?',e)
        this.showRooster = false
        this.period = b
        this.day = a
        this.checkIfAllSelected()
        //let r = Math.floor(Math.random()*1615).toString(5)
        //this.sessionID = `${a}-${b}-${c}-${r}`
      },
      areWeReady() {
        // infoSnackbar('are we ready?')
        //Check all the details, and see if we have any students to display
        // we will use tListObj.ckey, tListObj.grade, tListObj.subjectname to extract students
        //console.log('sql for',this.tListObj.ckey, this.tListObj.grade, this.tListObj.subjectname)
        this.loading = true
        let ts = {task: 'PlainSql',
               sql: `SELECT l.studentid, l.surname, l.firstname, l.grade, l.gclass, l.studentid \
                      FROM hw_classliststudent s, dkhs_student l \
                     WHERE s.classlistid = '${this.tListObj.id}'\
                       AND s.studentid = l.studentid\
                    order by l.surname, l.firstname`
             }
        zmlFetch(ts, this.loadStudentData, this.errorLoading)
      },
      loadStudentData(response) {
        if ('error' in response && response.error.length > 5) {
          this.studentData = []
        } else {
          this.studentData = response
        }
        this.loading = false
        this.showStudentList = true
        this.$router.push({ name: 'AttendanceList'
              , params: {studentList: this.studentData
                       , attendanceDetail: {sessionID: this.sessionID
                                           ,staffSurname: this.surname
                                           ,placeid: this.placeid
                                           ,userid: this.login.userid
                                           ,location: this.location
                                           ,day: this.day
                                           ,period: this.period
                                           ,grade:this.tListObj.grade
                                           ,listname:this.tListObj.listname
                                           ,listid:this.tListObj.id
                                           ,other:this.tListObj}
                       , checkList: ["Present","Absent", "Late","AWR", "Bunk","Ignore"]
                       }
                      })
      },
      errorLoading(err) {
        this.loading = false
        alert('something went wrong:'+ err.error)
        console.log(err)
      },
      playSound () {
        this.confirmSound.play();
      },
      assignDayNo(response) {
        this.day = response.dayno
      }
    },
    created() {
      this.loading = true
      zData.quickLoadInitialData('Load Data for incase', this.initialize)
      zData.loadSql(this.loading, "SELECT dayno FROM dkhs_date WHERE fulldate = CURDATE()"
                  , this.assignDayNo)
    },
    mounted() {
      zmlLog(null, "Att5Tanya ", 'Started ' + this.login.username +' '+ this.login.userid)
      console.log('Attendance4 Started', this.tList)
      //Load lookups for place if not loaded yet....
      //if (this.place.length < 4 && ls.test('zmlLookupPlace')) this.place = ls.load('zmlLookupPlace')

      // console.log('CHECK SAVE BEFORE : ', ls.test('attPeriod'), ls.test('attDay'), ls.test('attPlaceID'))
      // if (!this.period && ls.test('attPeriod'))        this.period = ls.load('attPeriod')
      // if (!this.day && ls.test('attDay')) this.day = ls.load('attDay')
      // if (!this.placeid && ls.test('attPlaceID')) this.placeid = ls.load('attPlaceID')
      // console.log('CHECK SAVE AFTER : ', this.period, this.day, this.placeid)


    },
    watch:{
      responsiblePerson() {
        this.userSelectedStaff()
      },
      period() {
        if (this.period && this.day && this.placeid) {
            this.checkIfAllSelected()
        }
      },
      day() {
        if (this.period && this.day && this.placeid) {
            this.checkIfAllSelected()
        }
      },
    },
    beforeDestroy() {
    }
}
</script>

<wait>
ONS HET NIE PERSID in login nie - dalk maar daar insit, so ek moet dit van persMenemonic kry...
         let idx = this.persMenemonic.findIndex(e => e.menemonic == this.login.menemonic)
         if (idx > -1) {
           this.menemonic = this.persMenemonic[idx].user_name
           this.surname = this.persMenemonic[idx].surname
           this.location = this.persMenemonic[idx].room
           this.responsiblePerson = {name: this.persMenemonic[idx].name, persid: this.persMenemonic[idx].persid}
         }
</wait>
