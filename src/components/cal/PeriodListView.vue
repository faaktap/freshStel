<template>
<!-- this.$router.push({ name: 'GenListView' -->
 <div>
   <base-title-expand color="white" heading="DAY PERIOD VIEW">
   <p>
   General view of Period Types for each Day.
    </p>
  </base-title-expand>
  <base-tool :toolList="[]"
            :toolbarName="`General List View for ${getZml.login.fullname}`"
            :loading="loading"
  >
   <!-- <v-btn class="ma-2" small icon @click="showAs='list'" title="View as list"> <v-icon>mdi-view-list</v-icon> </v-btn>
   <v-btn class="ma-2" small icon @click="showAs='card'" title="View as cards"> <v-icon>mdi-id-card</v-icon> </v-btn> -->
  </base-tool>

  <v-card cols="12" class="row wrap text-center d-flex justify-space-between ma-0 mb-2">
    <base-search class="ma-2 pa-2" v-model="searchString" />
  </v-card>

    <v-card color="gray lighten-3" class="ma-0 pa-0" elevation="2" loading="!loading">
     <v-card-text>
      <v-row>
        <v-col cols="12" md="4" lg="3"
               v-for="s in filterTable"
              :key="s.description">
           <v-card :color="s.status == 'Yes' ? 'green lighten-1' : 'white darken-1'" class="ma-1 pl-2">
             <v-card-title> {{ s.description }} </v-card-title>
             <v-card-text class="text-caption">
               <span> Start - End : {{ s.minstarttime }} - {{ s.maxendtime }} </span>
               <br><span> Min and Max Length of Period : {{ s.minlength }}, {{ s.maxlength }}</span>
               <br>Periods:  {{ s.count }}

             </v-card-text>
             <v-card-actions>
                <v-btn small color="secondary" @click="copyPeriodData(s)"> Copy </v-btn>
                <v-spacer />
                <v-btn small color="primary" @click="loadPeriodData(s)"> View </v-btn>
             </v-card-actions>
           </v-card>
        </v-col>
      </v-row>
     </v-card-text>
    </v-card>
    <v-dialog v-model="showCopyForm"  :fullscreen="$vuetify.breakpoint.mobile" max-width="600" width="auto">
      <v-card><v-card-title> Creating a new Period List </v-card-title>
      <v-card-text>
        <v-text-field v-model="newPeriodDescription" label="Period Group Description" hint="Description like 'Special Day 2'" />
      </v-card-text>
      <v-card-actions>
        <v-btn color="secondary" @click="showCopyForm = false"> Cancel </v-btn>
        <v-spacer />
        <v-btn color="primary" @click="LaunchGroupAdd"> Create </v-btn>
      </v-card-actions>
      </v-card>
    </v-dialog>

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
    name:'PeriodListView',
    transition: 'page-slide',
    components: {
      baseTool
    , BaseTitleExpand
    , baseSearch
    },
    data: () => ({
      getZml: getters.getState({ object: "gZml" }),
      loading: false,
      searchString: '',
      aList:[],
      showCopyForm:false,
      newPeriodDescription: '?',
      currentPeriodDescription: '',
      currentMaxDow:0,
    }),
    computed: {
      filterTable() {
        if (this.aList.length == 0) return []
        let theList = this.aList
        if (this.searchString) theList = util.findMultipleSearch(theList,this.searchString)
        return theList

      },
    },
    methods: {
      copyPeriodData(s) {
        console.log('copy period session:',s.description, s)
        this.newPeriodDescription = s.description + '(3)'
        this.currentPeriodDescription = s.description
        this.showCopyForm = true
      },
      LaunchGroupAdd() {
        alert('create a new one : ' + this.newPeriodDescription)
        if (this.newPeriodDescription.length < 5) { alert('too short new'); return}
        if (this.currentPeriodDescription.length < 5) { alert('too short current'); return}
        this.loading = true
        this.showCopyForm = false
        let ts = {task: 'PlainSql'}
        ts.sql = `insert into dkhs_dayperiod SELECT null
                  ,'${this.newPeriodDescription}'
                  , ${this.currentMaxDow}+1
                  , periodname
                       , starttime, endtime, length from dkhs_dayperiod where description = '${this.currentPeriodDescription}'`
        zmlFetch(ts, this.refresh, this.errorLoading)
      },
      refresh() {
        console.log('Refresh Data')
        this.loading = true
        let ts = {task: 'PlainSql'}
        ts.sql = `SELECT description \
   , dow \
   , count(*) count \
   , min(starttime) minstarttime \
   , max(endtime) maxendtime \
   , min(length) minlength \
   , max(length) maxlength \
   , max(dow) maxdow \
  FROM dkhs_dayperiod \
  GROUP BY description, dow \
  ORDER BY dow, description`
        //   and g.userid = ${this.getZml.login.userid} \
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
        this.currentMaxDow = Math.max(...this.aList.map(e => e.maxdow))
        this.currentMaxDow += 1
        this.loading = false
      },
      loadPeriodData(s) {
        console.log('going forward to session:',s.description, s)
        this.$router.push({ name: 'PeriodTable', params: {periodDescription: s.description} })
      },
      errorLoading(err) {
        this.loading = false
        alert('something went wrong:'+ err.error)
        console.log(err)
      },
    },
    mounted() {
        this.searchString = ''
        this.refresh()
    },
    watch:{
    },
    beforeDestroy() {
    }
}
</script>
