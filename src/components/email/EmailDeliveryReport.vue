<template>
<v-container>
      <v-progress-linear :active="progress" :indeterminate="progress" color="grey lighten-1" />
         <v-row>
          <v-col cols="12">
           <h3> EMail Status List </h3>
         </v-col>
         </v-row>
         <base-table
                     :tList="emailDeliveryList"
                     :tHeading="'EMail Delivery Records = ' + emailDeliveryList.length"
                     bHeading="How did delivery go?"
                     @edit="tableDblClick"
                     @select="tableSelect"
         />

<v-btn @click="showResult = !showResult">
    Show Data for Export
</v-btn>

<v-dialog v-model="showResult">
 <v-card color="red" v-if="showResult && emailDeliveryList">
  <front-json-to-csv :json-data="emailDeliveryList"
                     :csv-title="'Email Delivery List ' + deliveryid"
                     @hideModal="showResult = false">
  </front-json-to-csv>
 </v-card>
</v-dialog>

</v-container>
</template>

<script>
import { getters } from  "@/api/store"
import { zmlFetch } from '@/api/zmlFetch'
import BaseTable from    '@/components/base/baseTable'
import FrontJsonToCsv from '@/api/csv/FrontJsonToCsv.vue'
const  WAIT = 0, READY = 1,  BUSY = 2,  DONE = 3
export default {
    name:'EmailDeliveryReport',
    components: {
        BaseTable
       ,FrontJsonToCsv
    },
    props: ['deliverid'],
    data () {
      return {
        getZml: getters.getState({ object:"gZml" }),
        uniqid:0,
        progress:false,
        timerHandle:null,
        dataSequence:false,
        getData:{id:0
                 , desc: "Emails Delivered"
                 , workDone: WAIT
                 , response: {}
                 , processor: this.loadEmailStatus
                 , sql:''
                },
        emailDeliveryList:{},
        deliveryid:0,
        showResult:false
       }

   },
   computed: {
   },
   methods: {
     tableDblClick(evt,item) {
         console.log('back at base - dblClick:evt:', evt )
         console.log('back at base - Edit:item:',item.item.deliveryid )
         console.log('Table Show Delivieries 3: ', item.item)
     },
     tableSelect(evt,item) {
         console.log('back at base - select:',item.item, evt)

     },
     loadAllData() {
       this.progress = true;
       console.info('fetching in zmlFetchArray......:',this.getData.id, this.getData.desc)
       let ts = {sql: this.getData.sql
                ,task: 'PlainSql'}
       zmlFetch(ts, this.processAllData, this.loadError, this.getData);
     },
     processAllData(response,notused,queue) {
       console.log('emc',notused, queue)
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
       this.emailDeliveryList = e.response
       e.workDone = DONE
     },
   },
   mounted() {
       this.deliveryid = this.deliverid
       if ( this.$route.params.deliveryid ) this.deliveryid = this.$route.params.deliverid
       console.log('mounted ' , this.$options.name, this.deliveryid, this.deliverid, this.$route.params.deliverid)
       if (this.deliveryid) {
       this.getData.sql = `SELECT sentid SentID
     , deliveryid DeliveryID\
     , impnumber AdminNo\
     , name SubName\
     , r.surname StuSurname\
     , r.grade StuGrade\
     , email\
     , insertdate DateInserted\
     , sentdate sent\
     , s.subid subscriberid\
     , changedate DateChanged\
     , ifnull(o.description,'Subscribed') SubStatus\
     , extra GradeNote\
     , status emailStatus\
                     FROM m_emailsent e, m_subscriber s\
                     left join m_out o on o.outid = s.outid\
                     left join dkhs_student r on r.studentid = s.impnumber
                    WHERE deliveryid = ${this.deliveryid}
                    and e.subid = s.subid  \
                    ORDER BY name, email`
           this.loadAllData()
       }
       console.log(this.getData.sql)
   },
   watch:{
       deliveryid(n,o) {
        console.log('change !!! ', this.deliveryid, this.deliverid, n, o)
        if (this.deliveryid) {
       this.getData.sql = `SELECT sentid SentID
     , deliveryid DeliveryID\
     , impnumber AdminNo\
     , name SubName\
     , r.surname StuSurname\
     , r.grade StuGrade\
     , email\
     , insertdate DateInserted\
     , sentdate sent\
     , s.subid subscriberid\
     , changedate DateChanged\
     , ifnull(o.description,'Subscribed') SubStatus\
     , extra GradeNote\
     , status emailStatus\
                     FROM m_emailsent e, m_subscriber s\
                     left join m_out o on o.outid = s.outid\
                     left join dkhs_student r on r.studentid = s.impnumber
                    WHERE deliveryid = ${this.deliveryid}
                    and e.subid = s.subid  \
                    ORDER BY name, email`
           this.loadAllData()
       }



       }
   }
}
</script>
