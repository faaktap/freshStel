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
           <v-text-field v-model="searchText"
                        label="DB Search"
                        dense
                        class="ma-2" />
           </v-col>
           <v-col cols="12" md="2">
           <v-btn @click="buildSelect"> Refresh Logs </v-btn>
           </v-col>
           <v-col cols="12" md="2">
          <v-btn @click="showResult = !showResult">
           E
          </v-btn>
          </v-col>

          </v-row>
         <base-table v-if="logList"
                     :tList="logListFilter"
                     :tHeading="'Log List - Records = ' + logListFilter.length"
                     bHeading="Show Logs"
                     @edit="tableDblClick"
                     @select="tableSelect"
                     @search="search=$event"
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
  <front-json-to-csv :json-data="logListFilter"
                     :csv-title="'User Log List ' + (searchText.length ? `(search: ${search} )` : '')"
                     @hideModal="showResult = false; search=''">
  </front-json-to-csv>
 </v-card>
</v-dialog>
<!-- {{ search }}  {{ searchText }}
{{ logListFilter }} -->
  </div>
</template>

<script>
import { getters } from "@/api/store.js"
import { zmlFetch } from '@/api/zmlFetch.js'
import { zDate } from '@/api/zDate.js'
import BaseDate from '@/components/base/BaseDate.vue'
import BaseTable from '@/components/base/baseTable.vue'
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
        search:'',
        searchText:''
       }

   },
   computed: {
    logListFilter() {
        if (!this.search) {
           return this.logList
        }
        //convert obj to array, join array, and uppercase it - then search for any text inside.
        let x = this.logList.filter(
          str => Object.values(str).join().toUpperCase().includes( this.search.toUpperCase() )
        )
        return x
    }
   },
   methods: {
     tableDblClick(evt,item) {
         console.log('Table Double Click: ', item.item)
     },
     tableSelect(evt,item) {
         console.log('Table select:',item.item, evt)
     },
     buildSelect () {
        if (this.searchText || this.logDate) {
          let searchWhere = '1 = 1'
          let dateWhere = '1 = 1'
          if (this.logDate) {
            dateWhere = this.logDate ? `log_dte like '%${this.logDate}%'` : ''
          }
          if (this.searchText) {
           searchWhere =  `(ip like '%${this.searchText}%'\
                 or details like '%${this.searchText}%'\
                 or function like '%${this.searchText}%'\
                 or user like '%${this.searchText}%'\
                 or referer like '%${this.searchText}%')`
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

       //this.logList.forEach - reduce to distinct users
       //Use loglines and add all users in an array
       let output = this.logList.map( (s) => (s.user) );
       //Use it to create ditinct users
       let distinctUsers = [...new Set(output)]
       console.log('Distinct Users',distinctUsers)
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
     console.log('params = ', this.search, this.searchText)
     this.buildSelect()
   }
}
</script>
