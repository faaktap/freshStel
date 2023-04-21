<template>
<!-- this.$router.push({ name: 'AttendanceView' -->
 <div>
   <base-title-expand color="white" heading="ATTENDANCE VIEW">
   <p>
   Attendance view show the current days' attendance entries for the logged in user.
    </p>
  </base-title-expand>

  <base-tool :toolList="[]"
            :toolbarName="`Attendance View for ${getZml.login.fullname}`"
            :loading="loading"
            >
    <v-btn class="ma-2" small icon @click="srch.showAs='list'" title="View as list"> <v-icon>mdi-view-list</v-icon> </v-btn>
    <v-btn class="ma-2" small icon @click="srch.showAs='card'" title="View as cards"> <v-icon>mdi-id-card</v-icon> </v-btn>
    <v-btn icon @click="doPrint"><v-icon> mdi-printer</v-icon>  </v-btn>
 </base-tool>

         <v-card cols="12" class="row wrap text-center d-flex justify-space-between ma-0 mb-2">
          <base-search class="ma-2 pa-2 text-uppercase" v-model="srch.searchString"  />  <!-- @clear="srch.searchString=''" -->
          <v-text-field

             v-model="srch.searchRoom"
             :label="placeObj.placeid ? placeObj.description : 'location'"
             class="ma-2 pa-2"
             clearable
             @input="(val) => (srch.searchRoom = srch.searchRoom.toUpperCase())"
             outlined

          >
          <template v-slot:append-outer>
            <v-icon @click="gotoLocations" title="go change the location assignments">mdi-file-document-edit</v-icon>
          </template>
          <template v-slot:prepend>
            <v-icon title="go change the location assignments">mdi-watch-export-variant</v-icon>
          </template>
          </v-text-field>
          <v-combobox
             class="ma-2 pa-2"
             v-model="srch.searchPeriod"
             label="Period"
             :items="['Admin','1','2','3','4','5','6','7','8','9','Late']"
             clearable
             append-icon="mdi-magnify"
             outlined
          />
          <base-date v-model="srch.searchDate" :curValue="srch.searchDate" xinstructions="FA" label="Date" class="mt-0 ma-2 pa-2" :outlined="true" />
         </v-card>


    <v-card v-if="srch.showAs=='list'" color="gray lighten-3" class="ma-0 pa-0" elevation="2" loading="!loading">
     <v-card-text>
      <!-- <v-layout wrap justify-space-between> -->
        <v-data-table
            v-if="aList && aHeader.length > 0"
            :headers="aHeader"
            :items="filterTable"
             class="elevation-1"
            color="purple lighten-3"
            @dblclick:row.prevent="loadSessionData"
        >
        </v-data-table>

      <!-- </v-layout> -->
     </v-card-text>
   </v-card>
   <v-card v-else color="gray lighten-3" class="ma-2 pa-2" elevation="2" loading="!loading">
    <v-layout row wrap align-content-start justify-space-around class="ma-2 pa-2">
     <v-card v-for="(a,i) in filterTable" :key="i"
             class="ma-2 pa-2" color="rgba(105, 199, 71, 0.3"
             @click="loadSessionDataFromCard(a)"
     >
     <v-card-text>
      <v-layout justify-space-between>
       <span class="font-weight-black">Day {{ a.day }}&nbsp;&nbsp;</span>
       <span>{{ a.date }} &nbsp;&nbsp;</span>
       <span class="font-weight-black">P {{ a.period }}</span>
      </v-layout>
      <v-layout justify-space-between>
       <span class="font-weight-black">{{ a.presenter }}</span>
       <span>Room {{ a.place }}</span>
      </v-layout>
      <v-layout justify-space-between>
        <span>{{ a.grade }}</span>
        <span> {{ a.students }} Students </span>
       </v-layout>
       <!-- <v-spacer /> <v-icon small> mdi-kettle </v-icon> -->
     </v-card-text>
     </v-card>
    </v-layout>
   </v-card>

<!-- <StudentAttendanceSession v-if="compSessionID && compPlace"
                          :sessionid="compSessionID"
                          :place="compPlace"
/> -->

 </div>
</template>

<script>
//import { zmlConfig } from '@/api/constants';
import { getters } from "@/api/store"
import { zmlFetch } from '@/api/zmlFetch.js';
import baseTool from '@/components/base/baseTool.vue'
import BaseTitleExpand from '@/components/base/BaseTitleExpand.vue'
import baseSearch from "@/components/base/baseSearch.vue"
import BaseDate from '@/components/base/BaseDate.vue'
import { printJSON } from "@/api/zmlPrint.js"
//import { infoSnackbar } from '@/api/GlobalActions';
import { ls } from "@/api/localStorage.js"
//import StudentAttendanceSession from '@/components/student/StudentAttendanceSession.vue'
export default {
    name:'StudentAttendanceView',
    transition: 'page-slide',
    components: {
      baseTool
    , BaseTitleExpand
    , baseSearch
    , BaseDate
    //, StudentAttendanceSession
    },
    data: () => ({
      getZml: getters.getState({ object: "gZml" }),
      loading: false,
      aHeader: [{text:'date', value:'date'}
               ,{text:'period', value:'period'}
               ,{text:'presenter', value:'presenter'}
               ,{text:'place', value:'place'}
               ,{text:'students', value:'students'}
               ,{text:'grade', value:'grade'}
               //,{text:'session', value:'sessionid'}
      ],
      aList: [],
      srch: {
        sessionID: null,
        searchString: '',
        searchDate: '',
        searchRoom:'',
        searchPeriod:'',
        showAs: 'list',
      },
      compSessionID:'',
      compPlace:'',
    }),
    computed: {
      filterTable() {
        if (this.aList.length == 0) return []
        let theList = this.aList
        if (this.srch.searchString) theList = theList.filter(e =>
            e.presenter.substr(0,this.srch.searchString.length).toUpperCase() == this.srch.searchString.toUpperCase()
        )
        //console.log(1)
        if (this.srch.searchRoom)
           theList = theList.filter(e => e.place.substr(0,this.srch.searchRoom.length).toUpperCase() == this.srch.searchRoom.toUpperCase()
        )
        //console.log(2)
        if (this.srch.searchPeriod) theList = theList.filter(e => e.period.toUpperCase() == this.srch.searchPeriod.toUpperCase()  )
        //console.log(3)
        return theList
      },
      // Get the placeid, based on roomsearch, so we can use it in our sql or filter.
      placeObj() {
        if (!this.srch.searchRoom) return {name:'', placeid:0}
        const roomObj =  this.getZml.place.filter(e => e.name == this.srch.searchRoom) [0]
        if (!roomObj) return {name:'', placeid:0}
        if ('placeid' in roomObj) return roomObj
        return {name:'', placeid:0}
      }
    },
    methods: {
      doPrint() {
        printJSON(this.filterTable, this.aHeader, '<h1>Attendance Session List </h1>')
      },
      gotoLocations() {
        let webLink = 'https://kuiliesonline.co.za/bates/class'
        window.open(webLink,'_' + 'ko_external')
      },
      refresh() {
        console.log('Refresh Data')
        this.loading = true
        let ts = {task: 'PlainSql',
                  sql: `SELECT substr(a.attendancedate,1,10) date \
     , SUBSTRING_INDEX(sessionid, ".", 1) day
     , period\
     , sessionid  \
     , l.user_name presenter  \
     , p.name place  \
     , count(*) students \
     , min(s.grade) grade \
  FROM dkhs_attendance a, s_place p, dkhs_learner l, dkhs_student s  \
 where a.userid = l.userid \
   and a.studentid = s.studentid
   and p.placeid = a.placeid\
   and substr(a.attendancedate,1,10) = substr('${this.srch.searchDate}',1,10) \
 group by substr(attendancedate,1,10)  \
         , SUBSTRING_INDEX(sessionid, ".", 1)
         , sessionid  \
         , l.user_name \
         , p.name  \
ORDER BY date DESC`
             }
        zmlFetch(ts, this.loadAttendanceData, this.errorLoading)
      },
      loadAttendanceData(response) {
        this.loading = false
        this.aList = []
        if ('error' in response && response.error.length > 10) {
          if (response.error.substr(0,6) != 'no rows') {
            this.aList = []
          } else {
            console.log(response)
            alert('some error', response.error)
          }
        } else {
          this.aList = response || []
        }
        this.loading = false
      },
      loadSessionDataFromCard(e) {
        console.log('going forward to session (from card):',e)
        this.compPlace = e.place
        this.compSessionID = e.sessionid
        this.$router.push({ name: 'AttendanceSession', params: {sessionid: this.compSessionID, place:this.compPlace} })
      },
      loadSessionData(e1,e2) {
        console.log('going forward to session:',e2.item.sessionid, e1,e2)
        //alert('here we can show component-and not router push')
        this.compPlace = e2.item.place
        this.compSessionID = e2.item.sessionid
        this.$router.push({ name: 'AttendanceSession', params: {sessionid: this.compSessionID, place:this.compPlace} })
      },
      errorLoading(err) {
        this.loading = false
        alert('something went wrong:'+ err.error)
        console.log(err)
      },
    },
    mounted() {
        if (this.getZml.place.length < 5) alert('we have not loaded places yet! - please startat attload')
        if (ls.test(this.$options.name)) this.srch = ls.load(this.$options.name)
        //if (!this.srch.searchString) this.srch.searchString = this.getZml.login.username
        //this.srch.searchDate = Intl.DateTimeFormat('af-ZA').format(new Date()), //create a default yyyy-mm-dd date for first search
        this.refresh()
    },
    watch:{
      srch: {
        deep: true,
        handler() {
          console.log('src changed.....', this.srch)
          if (this.srch.searchDate) this.refresh()
          ls.save(this.$options.name,this.srch)
        }
      }
    }
}
</script>
