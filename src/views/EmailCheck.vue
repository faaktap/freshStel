<template>
  <v-container fluid>
    <base-tool toolbarName="Email Delivery Check"
            :background="false"
            :back="true"
  >
      <!-- <v-btn icon @click="doPrint"><v-icon> mdi-printer</v-icon>  </v-btn> -->
      <!-- <v-btn class="ma-2" @click="showPrint = true"> Export </v-btn> -->
  </base-tool>

      <v-progress-linear :active="progress" :indeterminate="progress" color="grey lighten-1" />
         <base-table-edit
                     :tList="emailStatusList"
                     :tHeading="'Email Status Summary  ( Records : ' + emailStatusList.length + ')'"
                     bHeading="Double click an item to delve deeper."
                     @delete="tableDelete"
                     @update="tableSelect"
         />
      <!-- <v-btn @click="loadAllData"
             title="Click here to load delivery summary."
      > Refresh Email List </v-btn> -->
  </v-container>
</template>

<script>
import { getters } from  "@/api/store"
import { zmlFetch } from '@/api/zmlFetch'
import BaseTableEdit from    '@/components/base/baseTableEdit'
import baseTool from '@/components/base/baseTool.vue'
const  WAIT = 0, READY = 1,  BUSY = 2,  DONE = 3
export default {
    components: {
        BaseTableEdit
      , baseTool
    },
    props: [],
    data () {
      return {
        getZml: getters.getState({ object:"gZml" }),
        uniqid:0,
        progress:false,
        timerHandle:null,
        dataSequence:false,
        getData:{id: 0
               , desc: "Emails Sent"
               , workDone: WAIT
               , response: {}
               , processor: this.loadEmailStatus
               , sql:`SELECT s.deliveryid, m.subject, s.status \
                          , min(s.sentdate) startdate , max(s.sentdate) enddate \
                         , datediff( max(s.sentdate), min(s.sentdate)) diff \
                         , count(*) \
                      FROM m_emailsent s, m_delivery m \
                     where m.deliveryid = s.deliveryid \
                     group by s.deliveryid desc, s.status`
                },
        emailStatusList:[],
       }

   },
   computed: {
   },
   mounted() {
    this.loadAllData()
   },
   methods: {
     tableDelete(item) {
        this.$cs.l('back at base - Edit:item:',item.deliveryid )
        this.$router.push({ name: 'EmailDeliveryReport', params: {deliverid: item.deliveryid} })
     },
     tableSelect(item) {
       this.$cs.l('back at base - Edit:item:',item.deliveryid )
       this.$router.push({ name: 'EmailDeliveryReport', params: {deliverid: item.deliveryid} })
     },
     loadAllData() {
       this.progress = true;
       //console.info('fetching in zmlFetchArray......:',this.getData.id, this.getData.desc)
       let ts = {sql: this.getData.sql
                ,task: 'PlainSql'}
       zmlFetch(ts, this.processAllData, this.loadError, this.getData);
     },
     processAllData(response) {             //processAllData(response,notused,queue)
       // this.$cs.l('emc',notused, queue)
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
        // console.info('RC - End ',this.getData.workDone)
        return "not used here"
     },
     loadEmailStatus(e) {
       this.emailStatusList = e.response
       e.workDone = DONE
     },
   }
}
</script>
