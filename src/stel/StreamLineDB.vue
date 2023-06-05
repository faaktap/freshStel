<template>
  <div>
      <v-progress-linear :active="progress" :indeterminate="progress" color="grey lighten-1" />
      <loader v-if="progress"/>
      <v-expansion-panels>
       <v-expansion-panel v-for="a in getData" :key="a.id">
        <v-expansion-panel-header>
          {{ a.id }} - {{ a.desc }} - {{ a.response.length }} {{ zmlF.showDBError(a.response) }}
        </v-expansion-panel-header>
        <v-expansion-panel-content v-if="zmlF.isGoodData(a.response)">
         <v-spacer/> xx <v-btn x-small @click="a.processor('refresh',a)"> refresh </v-btn> yy
         <v-row>
          <v-col cols="6">
           <v-textarea v-model="a.sql" :label="a.desc + ' sql statement'" />
          </v-col><v-col cols="6">
           <h3> {{ a.desc }} - {{ a.response.length }}</h3>
         </v-col>
         </v-row>
         can we show data? : {{ zmlF.isGoodData(a.response) }}
         <base-table v-if="zmlF.isGoodData(a.response)"
                     :tList="a.response" :tHeading="`len=${a.response.length || 'error'}`"
                     :bHeading="a.desc" @bonga="bonga"
         />
        </v-expansion-panel-content>
       </v-expansion-panel>
      </v-expansion-panels>

      <v-btn @click="loadAllData"> loadAllData </v-btn>
      <hr>
      <v-simple-table dense>
        <tr v-for="d in getData" :key="d.id">
          <td> {{ d.id}} </td><td> {{ zmlF.statusText(d.workDone) }} </td><td>l={{ d.response.length || 'z'}}</td><td> {{d.sql.substr(0,20) }} </td>
          <td> <v-btn small @click="d.processor('refresh',d)"> refresh </v-btn></td>
        </tr>
      </v-simple-table>
      status: {{ zmlF.statusText(zmlF.Status) }}
{{ getData }}
  </div>
</template>

<script>

import BaseTable from    '@/components/base/baseTable'
import { zmlF } from '@/stel/zmlF.js'
import loader from '@/stel/loader.vue'
const  WAIT = 0,  DONE = 3
// const test =  { proc : (d) => {console.log('processor activated',d)}}  example function for processer

export default {
    components: {
       BaseTable
      ,loader
    },
    props: [],
    data () {
      return {
        zmlF:zmlF,
        uniqid:0,
        progress:false,
        timerHandle:null,
        getData:
        [ { id:0
          , desc: "ZML Constants"
          , workDone: WAIT
          , response: []
          , processor: (action,element) => {this.doSomething(action,element)}
          , sql:`SELECT * from zml_constant`}
          ,{id:1
          , desc: "Error Sql"
          , workDone: WAIT
          , response: []
          , processor: (e) => {this.tweedeEne(e)}
          , sql:"SELECT z,y,z from whatever"}
          ,{id:2
          , desc:"Ip Adresses in Log"
          , workDone:WAIT
          , response:[]
          , processor: (action,element) => {this.doSomething(action,element)}
          , sql:`SELECT ip , min(log_dte) firsttme, max(log_dte) lasttme, count(*) times\
                   FROM s_log \
                 where log_dte > DATE_SUB(now(), INTERVAL 31 DAY)\
                 group by ip\
                 ORDER BY lasttme desc, times`}
          ,{id:3
          , desc:"Surveys"
          , workDone:WAIT
          , response:[]
          , processor: (action,element) => {this.doSomething(action,element)}
          , sql:`SELECT surveyid, quizkey, max(quizdata) quizdatamax, count(*) cc from dkhs_quiz group by surveyid, quizkey`
          }],
       }

   },
   computed: {
   },
   methods: {
     bonga(e1,e2) {
        console.log('',e1,e2)
     },
     doSomething(action,dataObject) {
        console.warn('Here we can Do Something with object',action,dataObject)
        if (action=='refresh') {
          dataObject.response = ''
          zmlF.ZF(dataObject, this.processAllData, this.loadError);
        }
     },
     tweedeEne(e) {
      console.log('TWEEDE ENE: sql not worked:::', e)
      alert (zmlF.showDBError(e.response) )

     },
     loadAllData() {
       this.progress = true;
       if (!this.timerHandle) { this.startTimer( 2000, this.rollCall)}
       this.getData.forEach(ele => {
         zmlF.ZF(ele,this.processAllData, this.loadError);
       })
     },
     loadError(err) {
      console.log('tell them:',err)
      alert('tell them ?' + zmlF.showDBError(err))
     },
     startTimer(duration, funcToCall) {
       let loops = 5
       this.timerHandle = setInterval(function () {
            funcToCall(loops)
            loops = loops - 1
            if (loops < 0) {
              clearInterval(this.timerHandle)
            }
       }, duration);
     },
     processAllData(response) {
       console.warn('processAllData = Data was loaded in storage, and passed to me as well.',response.length||999)
     },
     rollCall(l) {
       console.log('RC: IN',l)
       let cnt = 0
       this.getData.forEach(e => { if (e.workDone == DONE) cnt+=1 })
       // If all are marked as done, kill the time and stop progressbar
       console.log('lengte van getData:;::::', this.getData.length)
       if (cnt == this.getData.length) {
           if (this.timerHandle) {
              clearInterval(this.timerHandle)
              this.timerHandle = null
           }
           this.progress = false;
        }
        this.getData.forEach(e => { console.log(e.workDone)})
        console.info('RollCall - End ',zmlF.statusText(this.getData[0].workDone)
                                ,zmlF.statusText(this.getData[1].workDone)
                                ,zmlF.statusText(this.getData[2].workDone))

     },
   }
}
</script>
