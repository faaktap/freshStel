<template>
<!-- this.$router.push({ name: 'GenListView' -->
 <div>
   <base-title-expand color="white" heading="GENERAL LIST (homework/handbooks) VIEW">
   <p>
   General view of Student Lists show entries for the logged in user.
    </p>
  </base-title-expand>

  <base-tool :toolList="[]"
            :toolbarName="`General List View for ${getZml.login.fullname}`"
            :loading="loading"
  >
   <v-btn class="ma-2" small icon @click="showAs='list'" title="View as list"> <v-icon>mdi-view-list</v-icon> </v-btn>
   <v-btn class="ma-2" small icon @click="showAs='card'" title="View as cards"> <v-icon>mdi-id-card</v-icon> </v-btn>
  </base-tool>
  <v-card cols="12" class="row wrap text-center d-flex justify-space-between ma-0 mb-2">
    <base-search class="ma-2 pa-2" v-model="searchString" />
    <v-text-field
       v-model="searchRoom"
       :label="placeObj.placeid ? placeObj.description : 'location'"
       class="ma-2 pa-2"
       clearable
       outlined
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
       outlined
    />
    <!-- <base-date v-model="searchDate" :curValue="searchDate" xinstructions="FA" label="Date" class="ma-2 pa-2"/> -->
  </v-card>

    <v-card v-if="showAs=='card'" color="gray lighten-3" class="ma-0 pa-0" elevation="2" loading="!loading">
     <v-card-text>
      <v-row>
        <v-col cols="12" md="4" lg="3"
               v-for="s in filterTable"
              :key="s.studentid">
           <v-card :color="s.status == 'Yes' ? 'green lighten-1' : 'white darken-1'" class="ma-1 pl-2">
             <v-card-subtitle> {{ s.sessionid }}  <span class="float-right">{{ s.date }} </span> </v-card-subtitle>
             <v-card-text class="text-caption">
              <v-layout justify-space-between>

               <span> {{ s.day }} : {{ s.period}}  </span>
               <span> {{ s.presenter }} {{ s.place }} </span>

              </v-layout>
             </v-card-text>
             <v-card-actions>
                <span> Students: {{ s.students }} </span> <v-spacer /> <v-btn small color="primary" @click="loadSessionDataFromCard(s)"> View </v-btn>
             </v-card-actions>
           </v-card>
        </v-col>
      </v-row>
     </v-card-text>
    </v-card>
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
        <!-- <template v-slot:top> -->
        <!-- </template> -->
        </v-data-table>

      <!-- </v-layout> -->
     </v-card-text>
   </v-card>

 </div>
</template>

<script>

import { getters } from "@/api/store"
import { zmlFetch } from '@/api/zmlFetch.js';
import baseTool from '@/components/base/baseTool.vue'
import BaseTitleExpand from '@/components/base/BaseTitleExpand.vue'
import baseSearch from "@/components/base/baseSearch.vue"
import { util } from '@/api/util.js'

export default {
    name:'StudentGenListView',
    transition: 'page-slide',
    components: {
      baseTool
    , BaseTitleExpand
    , baseSearch
//    , BaseDate
    },
    data: () => ({
      getZml: getters.getState({ object: "gZml" }),
      loading: false,
      aHeader: [{text:'date', value:'date'}
               ,{text:'session', value:'sessionid'}
               ,{text:'day', value:'day'}
               ,{text:'period', value:'period'}
               ,{text:'presenter', value:'presenter'}
               ,{text:'location', value:'place'}
               ,{text:'grade', value:'grade'}
               ,{text:'students', value:'students'}
      ],
      aList: [],
      sessionID: null,
      searchString: '',
      // searchDate:Intl.DateTimeFormat('af-ZA').format(new Date()), //create a default yyyy-mm-dd date for first search
      searchRoom:'',
      searchPeriod:'',
      showAs: 'list',
    }),
    computed: {
      filterTable() {
        if (this.aList.length == 0) return []
        let theList = this.aList

        //if (this.searchString) theList = util.findInObject(theList,this.searchString)
        if (this.searchString) theList = util.findMultipleSearch(theList,this.searchString)

        if (this.searchRoom)   theList = theList.filter(e =>
            e.place.substr(0,this.searchRoom.length).toUpperCase() == this.searchRoom.toUpperCase()
        )
        if (this.searchPeriod) theList = theList.filter(e => e.period.toUpperCase() == this.searchPeriod.toUpperCase())
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
      change(e)   { console.log('change:', e)},
      gotoLocations() {
        let webLink = 'https://kuiliesonline.co.za/bates/class'
        window.open(webLink,'_' + 'ko_external')
      },
      refresh() {
        console.log('Refresh Data')
        this.loading = true
        let ts = {task: 'PlainSql'}
        if (this.getZml.login.username.toUpperCase == 'WERNER' || this.getZml.login.username.toUpperCase() == 'WER') {
        ts.sql = `SELECT substr(g.changedate,1,10) date \
     , dayno day\
     , period\
     , sessionid  \
     , l.user_name presenter  \
     , p.name place  \
     , count(*) students \
     , max(s.grade) grade
  FROM dkhs_genlistdata g, s_place p, dkhs_learner l, dkhs_student s  \
 where g.userid = l.userid and p.placeid = g.placeid \
   and s.studentid = g.studentid
  group by substr(changedate,1,10), dayno, sessionid  , l.user_name , p.name \
ORDER BY date DESC`
        } else {
        ts.sql = `SELECT substr(g.changedate,1,10) date \
     , dayno day\
     , period\
     , sessionid  \
     , l.user_name presenter  \
     , p.name place  \
     , count(*) students \
     , max(s.grade) grade
  FROM dkhs_genlistdata g, s_place p, dkhs_learner l, dkhs_student s  \
 where g.userid = l.userid and p.placeid = g.placeid \
   and g.userid = ${this.getZml.login.userid} \
   and s.studentid = g.studentid
  group by substr(changedate,1,10), dayno, sessionid  , l.user_name , p.name \
ORDER BY date DESC`
        }
        zmlFetch(ts, this.loadGListData, this.errorLoading)
      },
      loadGListData(response) {
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
      loadSessionDataFromCard(s) {
        console.log('going forward to session:',s.sessionid, s)
        this.$router.push({ name: 'GenListSession', params: {sessionid: s.sessionid} })
      },
      loadSessionData(e1,e2) {
        console.log('going forward to session:',e2.item.sessionid, e1,e2)
        this.$router.push({ name: 'GenListSession', params: {sessionid: e2.item.sessionid} })
      },
      errorLoading(err) {
        this.loading = false
        alert('something went wrong:'+ err.error)
        console.log(err)
      },
    },
    mounted() {
        this.searchString = ''
        if (this.getZml.place.length < 5) alert('we have not loaded places yet! - please startat attload')
        this.refresh()
    },
    watch:{
    //   searchDate() {
    //     this.refresh()
    //   }
    },
    beforeDestroy() {
    }
}
</script>
