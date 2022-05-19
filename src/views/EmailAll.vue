<template>
  <div>
      <v-progress-linear :active="progress" :indeterminate="progress" color="grey lighten-1" />
      <v-card>
        <v-card-text>
         <base-table-edit v-if="allEmailsList"
                     :tList="allEmailsList"
                     :tHeading="'EMail Master List - Records = ' + allEmailsList.length"
                     bHeading="Show All Email"
                     @edit="tableDblClick"
                     @select="tableSelect"
         />
        </v-card-text>
        <v-card-actions>

      <v-btn @click="loadAllData"> Refresh Email Subscriber List </v-btn>
      <v-btn @click="showResult = !showResult">
        Show Data for Export
      </v-btn>
      </v-card-actions>
      </v-card>

<v-dialog v-model="showResult">
 <v-card color="red" v-if="showResult && allEmailsList">
  <front-json-to-csv :json-data="allEmailsList"
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
import BaseTableEdit from    '@/components/base/baseTableEdit'
import FrontJsonToCsv from '@/api/csv/FrontJsonToCsv.vue'
const  WAIT = 0, READY = 1,  BUSY = 2,  DONE = 3
export default {
    name:'EmailAll',
    components: {
        BaseTableEdit
       ,FrontJsonToCsv
    },
    props: ['search'],
    data () {
      return {
        getZml: getters.getState({ object:"gZml" }),
        uniqid:0,
        progress:false,
        timerHandle:null,
        dataSequence:false,
        showResult:false,
        getData:{id:0
                 , desc: "Email Master List"
                 , workDone: WAIT
                 , response: {}
                 , processor: this.loadEmailStatus
                 , where:''
                 , sql:''
                },
        allEmailsList:[],
       }

   },
   computed: {
   },
   methods: {
     tableDblClick(evt,item) {
         this.$cs.l('back at base - dblClick:evt:', evt )
         this.$cs.l('back at base - Edit:item:',item.item.deliveryid )
         this.$cs.l('Table Show Delivieries 3: ', item.item)
     },
     tableSelect(evt,item) {
         this.$cs.l('back at base - select:',item.item, evt)

     },
     loadAllData() {
       this.progress = true;
       console.info('fetching in zmlFetchArray......:',this.getData.id, this.getData.desc)
       let ts = {sql: this.getData.sql
                ,task: 'PlainSql'}
       zmlFetch(ts, this.processAllData, this.loadError, this.getData);
     },
     processAllData(response,notused,queue) {
       this.$cs.l('emc',notused, queue)
       this.getData.workDone = READY
       this.getData.response = response
       if (!this.timerHandle) {
          this.startTimer( 2000, this.rollCall)
       }
     },
     startTimer(duration, funcToCall) {
       let loops = 5
          this.timerHandle = setInterval(function () {
            funcToCall('dummy')
            loops = loops - 1
            if (loops < 0) {
              clearInterval(this.timerHandle)
            }
          }, duration);
     },
     rollCall() {
       console.info('Start of RollCall')
       if (this.getData.workDone == READY) {
           this.getData.workDone = BUSY
           //Call the assignor
           this.getData.processor(this.getData)
        }
       //Check if all is done
       if (this.getData.workDone == DONE)  {
           this.getData.workDone = WAIT
           if (this.timerHandle) {
               clearInterval(this.timerHandle)
               this.timerHandle = null
           }
           this.progress = false;
        }
        console.info('RC - End ',this.getData.workDone)
        return "not used here"
     },
     loadEmailStatus(e) {
       this.allEmailsList = e.response
       e.workDone = DONE
     },
   },
   mounted() {
     this.$cs.l('mount ' , this.$options.name)
     this.$cs.l('params = ', this.search)
     if (this.search) {
         this.getData.where =  `where s.studentid like '%${this.search}%'\
              or s.surname like '%${this.search}%'\
              or s.firstname like '%${this.search}%'\
              or p.surname like '%${this.search}%'\
              or p.name like '%${this.search}%'\
              or m.email like '%${this.search}%'\
              or grade like '%${this.search}%'`
     } else {
       this.getData.where = ''
     }

     this.getData.sql = `SELECT IFNULL(s.studentid, IFNULL(p.persid,IFNULL(p1.persid,m.subid))  ) gpmid\
     , m.subid subid\
     , IFNULL(s.surname,   IFNULL(p.surname,IFNULL(p1.surname,IFNULL(m.name,''))) ) surname\
     , IFNULL(s.firstname, IFNULL(p.name,IFNULL(p1.name,'*'))    ) firstname\
     , IFNULL(CONCAT(grade,gclass), IFNULL(p.workarea,IFNULL(p1.workarea,'Nix')) ) area\
     , LOWER(m.email) email\
     , IFNULL(m.outid,'G') active\
     FROM m_subscriber m\
     LEFT JOIN dkhs_student s ON s.studentid = m.impnumber\
     LEFT JOIN dkhs_personel p ON LOWER(p.email) = LOWER(m.email)\
     LEFT JOIN dkhs_personel p1 ON LOWER(p1.workemail) = LOWER(m.email) \
     ${this.getData.where}
     ORDER BY gpmid DESC, s.surname, s.firstname`
     this.$cs.l(' sql = ', this.getData.sql)
     this.loadAllData()
   }
}
</script>
