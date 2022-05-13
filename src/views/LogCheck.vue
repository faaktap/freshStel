<template>
  <div>
      <v-progress-linear :active="progress" :indeterminate="progress" color="grey lighten-1" />
      <v-card>
        <v-card-text>
          <v-row>
          <v-col cols="12" md="4">
           <base-date v-model="logDate"
                      instructions=""
                      label="Log Date" />
           </v-col>
          <v-col cols="12" md="4">
           <v-text-field v-model="search"
                        label="Search"
                        dense
                        class="ma-2" />
           </v-col>
           <v-col cols="12" md="4">
           <v-btn @click="buildSelect"> Refresh Logs </v-btn>
           </v-col>
          </v-row>
         <base-table v-if="logList"
                     :tList="logList"
                     :tHeading="'Log List - Records = ' + logList.length"
                     bHeading="Show Logs"
                     @edit="tableDblClick"
                     @select="tableSelect"
         />
        </v-card-text>
        <v-card-actions>


      <v-btn @click="showResult = !showResult">
        Show Data for Export
      </v-btn>
      </v-card-actions>
      </v-card>

<v-dialog v-model="showResult">
 <v-card color="red" v-if="showResult && logList">
  <front-json-to-csv :json-data="logList"
                     csv-title="Email Master List"
                     @hideModal="showResult = false">
  </front-json-to-csv>
 </v-card>
</v-dialog>

  </div>
</template>

<script>
import { getters } from  "@/api/store"
import { zmlFetch } from '@/api/zmlFetch'
import { zDate } from '@/api/zDate.js'
import BaseDate from    '@/components/base/BaseDate'
import BaseTable from    '@/components/base/baseTable'
import FrontJsonToCsv from '@/api/csv/FrontJsonToCsv.vue'

export default {
    name:'LogCheck',
    components: {
        BaseTable
       ,BaseDate
       ,FrontJsonToCsv
    },
    data () {
      return {
        getZml: getters.getState({ object:"gZml" }),
        uniqid:0,
        progress:false,
        timerHandle:null,
        dataSequence:false,
        showResult:false,
        getData:{id:0
                 , where:''
                 , sql:''
                },
        logList:[],
        logDate:null,
        search:''
       }

   },
   computed: {
   },
   methods: {
     tableDblClick(evt,item) {
         console.log('Table Double Click: ', item.item)
     },
     tableSelect(evt,item) {
         console.log('Table select:',item.item, evt)
     },
     buildSelect () {
        if (this.search || this.logDate) {
          let searchWhere = '1 = 1'
          let dateWhere = '1 = 1'
          if (this.logDate) {
            dateWhere = this.logDate ? `log_dte like '%${this.logDate}%'` : ''
          }
          if (this.search) {
           searchWhere =  `(ip like '%${this.search}%'\
                 or details like '%${this.search}%'\
                 or function like '%${this.search}%'\
                 or user like '%${this.search}%'\
                 or referer like '%${this.search}%')`
          }
          this.getData.where = ' where ' + dateWhere + ' and ' + searchWhere
        } else {
          // show info for today if no search items
          let today = new Date()
          today.setHours(0,0,0,0)
          zDate.format(today,'yyyy-MM-dd')
          this.getData.where = ` where log_dte like '${zDate.format(today,'yyyy-MM-dd')}%'`
        }
        this.getData.sql = `select log_id\
          , substring(log_dte, 3, 8)  date\
          , substring(log_dte, 11, 6) time\
          , ip \
          , referer\
          , user\
          , function\
          , details\
           from dkhs_log\
        ${this.getData.where}\
        ORDER BY log_id DESC`
        console.log(' sql = ', this.getData.sql)
        this.loadLogs()
     },
     loadLogs() {
       this.progress = true
       let ts = {sql: this.getData.sql
                ,task: 'PlainSql'}
       zmlFetch(ts, this.processAllData, this.loadError)
     },
     processAllData(response) {
       this.logList = response
       this.progress = false
     },
   },
   mounted() {
     console.log('mount ' , this.$options.name)
     console.log('params = ', this.search)
     this.buildSelect()
   }
}
</script>
