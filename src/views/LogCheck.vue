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
                     csv-title="User Log List"
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
        // referer \
        // log_id \
        this.getData.sql = `select \
            concat(substring(log_dte, 3, 8) , ' ' , substring(log_dte, 11, 6)) date \
          , ip \
          , user \
          , function \
          , details \
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
       let colArr = ['']
       this.logList = this.filterColumns(response, colArr)
       this.progress = false
     },
     filterColumns(resp,colArray) {
       console.log(colArray)
       resp.forEach(e => {
         // if details was saved as json, unstringify it..
         if (e.details[0] == '"'  && e.details.length > 80  ) {
           try {
               e.details = JSON.parse(e.details)
           } catch {
               //keep details as is, not a json string
           }
         }
         e.details = e.details.replaceAll("\\/","/");
         e.details = e.details.replace("home/kuilieso/public_html/Subjects/", "");
         e.details = e.details.replace(`"\\"\\""`,"/");
         e.details = e.details.replace(`:[{"ignore":false,"done":false,"ext":"mp4","realname":"`,"")
         e.details = e.details.replace(`"}]`,"")
         if (e.details.length > 60 ) {
           e.details = e.details.substr(1,60) + '..'
         }
       });
       return resp
     }
   },
   mounted() {
     console.log('mount ' , this.$options.name)
     console.log('params = ', this.search)
     this.buildSelect()
   }
}
</script>
