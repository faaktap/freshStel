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
    <v-btn class="ma-2" small icon @click="showAs='list'" title="View as list"> <v-icon>mdi-view-list</v-icon> </v-btn>
    <v-btn class="ma-2" small icon @click="showAs='card'" title="View as cards"> <v-icon>mdi-id-card</v-icon> </v-btn>
 </base-tool>

    <v-card v-if="showAs=='list'" color="gray lighten-3" class="ma-0 pa-0" elevation="2" loading="!loading">
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
        <template v-slot:top>
         <v-card cols="12" class="row wrap text-center d-flex justify-space-between ma-0 mb-2">
          <base-search class="ma-2 pa-2 text-uppercase" v-model="searchString" @clear="searchString=''" />
          <v-text-field

             v-model="searchRoom"
             :label="placeObj.placeid ? placeObj.description : 'location'"
             class="ma-2 pa-2"
             clearable
             @input="(val) => (searchRoom = searchRoom.toUpperCase())"

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
             v-model="searchPeriod"
             label="Period"
             :items="['Admin','1','2','3','4','5','6','7','8','9','Late']"
             clearable
             append-icon="mdi-magnify"
          />
          <base-date v-model="searchDate" :curValue="searchDate" xinstructions="FA" label="Date" class="ma-2 pa-2"/>
         </v-card>
        </template>
        </v-data-table>

      <!-- </v-layout> -->
     </v-card-text>
   </v-card>

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
//import { infoSnackbar } from '@/api/GlobalActions';
export default {
    name:'StudentAttendanceView',
    transition: 'page-slide',
    components: {
      baseTool
    , BaseTitleExpand
    , baseSearch
    , BaseDate
    },
    data: () => ({
      getZml: getters.getState({ object: "gZml" }),
      loading: false,
      aHeader: [{text:'date', value:'date'}
               ,{text:'period', value:'period'}
               ,{text:'presenter', value:'presenter'}
               ,{text:'place', value:'place'}
               ,{text:'students', value:'students'}
               ,{text:'session', value:'sessionid'}
      ],
      aList: [],
      sessionID: null,
      searchString: '',
      searchDate:Intl.DateTimeFormat('af-ZA').format(new Date()), //create a default yyyy-mm-dd date for first search
      searchRoom:'',
      searchPeriod:'',
      showAs: 'list',
    }),
    computed: {
      filterTable() {
        if (this.aList.length == 0) return []
        let theList = this.aList
        if (this.searchString) theList = theList.filter(e =>
            e.presenter.substr(0,this.searchString.length).toUpperCase() == this.searchString.toUpperCase()
        )
        console.log(1)
        if (this.searchRoom)   theList = theList.filter(e =>
            e.place.substr(0,this.searchRoom.length).toUpperCase() == this.searchRoom.toUpperCase()
        )
        console.log(2)
        if (this.searchPeriod) theList = theList.filter(e => e.period.toUpperCase() == this.searchPeriod.toUpperCase())
        console.log(3)
        return theList

      },
      // Get the placeid, based on roomsearch, so we can use it in our sql or filter.
      placeObj() {
        if (!this.searchRoom) return {name:'', placeid:0}
        const roomObj =  this.getZml.place.filter(e => e.name == this.searchRoom) [0]
        if (!roomObj) return {name:'', placeid:0}
        if ('placeid' in roomObj) return roomObj
        return {name:'', placeid:0}
      }
    },
    methods: {
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
  FROM dkhs_attendance a, s_place p, dkhs_learner l  \
 where a.userid = l.userid \
   and p.placeid = a.placeid\
   and substr(a.attendancedate,1,10) = substr('${this.searchDate}',1,10) \
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
      loadSessionData(e1,e2) {
        console.log('going forward to session:',e2.item.sessionid, e1,e2)
        this.$router.push({ name: 'AttendanceSession', params: {sessionid: e2.item.sessionid, place:e2.item.place} })
      },
      errorLoading(err) {
        this.loading = false
        alert('something went wrong:'+ err.error)
        console.log(err)
      },
    },
    mounted() {
        this.searchString = this.getZml.login.username
        if (this.getZml.place.length < 5) alert('we have not loaded places yet! - please startat attload')
        this.refresh()
    },
    watch:{
      searchDate() {
        this.refresh()
      }
    },
    beforeDestroy() {
    }
}
</script>
