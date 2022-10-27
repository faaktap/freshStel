<template>
 <v-container>
    <base-tool toolbarName="Email Delivery Report"
            :background="false"
            :back="true"
  >
      <!-- <v-btn icon @click="doPrint"><v-icon> mdi-printer</v-icon>  </v-btn> -->
      <!-- <v-btn class="ma-2" @click="showPrint = true"> Export </v-btn> -->
  </base-tool>

    <v-progress-linear
        :active="progress"
        :indeterminate="progress"
        color="grey lighten-1" />
        {{ timerHandle }}
    <base-table-edit
      :tList="emailDeliveryList"
      :tHeading="'Email Delivery Records : ' + emailDeliveryList.length"
      bHeading="Search for email above, Button for Delivery Report below, double click item for more."
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
import baseTool from '@/components/base/baseTool.vue'
import BaseTableEdit from    '@/components/base/baseTableEdit.vue'
import FrontJsonToCsv from '@/api/csv/FrontJsonToCsv.vue'
const  WAIT = 0, READY = 1,  BUSY = 2,  DONE = 3
export default {
    name:'EmailDeliveryReport',
    components: {
        BaseTableEdit
       ,FrontJsonToCsv
       ,baseTool
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
        emailDeliveryList:[],
        deliveryid:0,
        showResult:false
      }
   },
   computed: {
   },
   methods: {
     tableDblClick (evt,item) {
         console.log('back at dbase - dblClick:evt:', evt,item )
         console.log('back at dbase - Edit:item:',item.item.deliveryid )
         if (item.item.subscriberid) {
            this.$router.push({ name: 'emailssent', params: {subid: item.item.subscriberid, editmode: false} })
         }
     },
     tableSelect (evt,item) {
         console.log('back at base TS - select:',item.item, evt)

     },
     loadAllData () {
       this.progress = true;
       console.info('fetching in zmlFetchArray......:',this.getData.id, this.getData.desc)
       let ts = {sql: this.getData.sql
                ,task: 'PlainSql'}
       zmlFetch(ts, this.processAllData, this.loadError, this.getData);
     },
     processAllData (response,notused,queue) {
       console.log('emc',notused, queue)
       this.getData.workDone = READY
       this.getData.response = response
       if (!this.timerHandle) {
          this.startTimer( 2000, this.rollCall)
       }
     },
     startTimer (duration, funcToCall) {
       let loops = 5
          this.timerHandle = setInterval(function () {
            funcToCall('dummy')
            loops = loops - 1
            if (loops < 0) {
              clearInterval(this.timerHandle)
            }
          }, duration);
     },
     rollCall () {
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
     loadEmailStatus (e) {
       this.emailDeliveryList = e.response
       e.workDone = DONE
     },
   },
   mounted() {
       this.deliveryid = this.deliverid
       if ( this.$route.params.deliveryid ) this.deliveryid = this.$route.params.deliverid
       console.log('mounted ' , this.$options.name, this.deliveryid, this.deliverid, this.$route.params.deliverid)
       if (this.deliveryid) {
       this.getData.sql = `\
            SELECT sentid SentID
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
            LEFT JOIN m_out o on o.outid = s.outid\
            LEFT JOIN dkhs_student r on r.studentid = s.impnumber\
            WHERE deliveryid = ${this.deliveryid}\
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
