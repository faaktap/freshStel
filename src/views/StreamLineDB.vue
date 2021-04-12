<template>
  <div>
      <v-progress-linear :active="progress" :indeterminate="progress" color="grey lighten-1" />
      <v-btn @click="loadAllData"> loadAllData </v-btn>
      {{ rfo.length }} {{ rso.length }} {{ rto.length }}
      <h1> First One </h1>
      <base-table :tList="rfo" :tHeading="getData[0].sql" bHeading="Data & Names from a_prize for Top10" />
      <h1> 2nd One </h1>
      <base-table :tList="rso" :tHeading="getData[1].sql" bHeading="All Data from a_prize" />
      <h1> Third One </h1>
      <base-table :tList="rto" :tHeading="getData[2].sql" bHeading="Diplomas and Subjects" />
  </div>
</template>

<script>
import { getters } from  "@/api/store"
import { zmlFetch } from '@/api/zmlFetch'
import BaseTable from    '@/components/base/baseTable'
const  WAIT = 0, READY = 1,  BUSY = 2,  DONE = 3
export default {
    components: {
        BaseTable
    },
    props: [],
    data () {
      return {
        getZml: getters.getState({ object:"gZml" }),
        uniqid:0,
        progress:false,
        timerHandle:null,
        dataSequence:false,
        getData:[{id:0,desc:"first-one", workDone:WAIT, response:{}
                 ,processor:this.firstone
                 ,sql:"SELECT p.id,p.storyid,p.type,p.grade,p.position"
                     + " ,p.name,p.surname,p.prize, p.oncertificate, s.studentid"
                     + "  FROM a_prize p "
                     + " LEFT JOIN dkhs_student s "
                     + "    on p.surname like concat('%',s.surname,'%') "
                     + "   and p.name like concat('%',s.firstname,'%') "
                     + " where ( p.type = 'TOP10' and position in (10,9,8,7,6) )"
                     + "    or (p.type != 'TOP10' and position in (5,4,3,2,1) )"
                     + " ORDER BY p.grade, p.position desc, p.id desc"}

                 ,{id:1,desc:"2nd-one", workDone:WAIT, response:{}
                 , processor:this.secondone
                 , sql:"select * from a_diploma order by grade, type , surname, name"}
                 ,{id:2,desc:"3rd-one", workDone:WAIT, response:{}
                 , processor:this.thirdone
                 , sql:"select * from a_diploma order by grade, surname, name"}
                ],
        rfo:{},
        rso:{},
        rto:{},        
       } 
       
   }, 
   computed: {    
   }, 
   methods: {
     loadAllData() {
       this.progress = true;
       this.getData.forEach(ele => {
         console.info('fetching in zmlFetchArray......:',ele.id, ele.desc)
         let ts = {sql: ele.sql, task: 'PlainSql'}
         zmlFetch(ts, this.processAllData, this.loadError, ele);
       })
     },
     processAllData(response,what,queue) {
       console.log('process All Data ....' , queue.id,this.getData[queue.id].workDone,what)
       this.getData[queue.id].workDone = READY
       this.getData[queue.id].response = response
       if (!this.timerHandle) {
          this.startTimer( 2000, this.rollCall)
       }
     },
     startTimer(duration, funcToCall) {
       let loops = 5
          this.timerHandle = setInterval(function () {
            let x = funcToCall('dummy')
            console.log('feedback in timer after function -- from rollcall ' , x,loops)
            loops = loops - 1
            if (loops < 0) {
              clearInterval(this.timerHandle)
            }
          }, duration);
     },
     rollCall() {  
       console.info('Start of RC ',this.getData[0].workDone,this.getData[1].workDone,this.getData[2].workDone)
       if (this.dataSequence == false) {
           console.log('RC Any Sequence')
            this.getData.forEach(work => {
              if (work.workDone == READY) {
                  work.workDone = BUSY
                  work.processor(work)
               }
           })
       } else {
           console.log('RC SPECIFIC Sequence')
           if (this.getData[0].workDone == READY) {
              this.getData[0].workDone = BUSY
              this.getData[0].processor(this.getData[0])
           }
           if (this.getData[1].workDone == READY) {
             if (this.getData[0].workDone == DONE) {
                 this.getData[1].workDone = BUSY
                 this.getData[1].processor(this.getData[1])
             }
           }
           if (this.getData[2].workDone == READY) {
             if (this.getData[1].workDone == DONE) {
                 this.getData[2].workDone = BUSY
                 this.getData[2].processor(this.getData[2])
             }
           }
       }  
       //Check if all is done
       console.info('RC - middle ',this.getData[0].workDone,this.getData[1].workDone,this.getData[2].workDone)
       this.getData.forEach(e => e.workDone == 'DONE')
       if (this.getData[0].workDone == DONE 
        && this.getData[1].workDone == DONE  
        && this.getData[2].workDone == DONE )  {
           console.log('We are done with all, reset back to wait, and clear response')
           this.getData.forEach(ele => {
             ele.workDone = WAIT 
             ele.response = ''
           })
           console.log('Stop the timer interval:', this.timerHandle)
           if (this.timerHandle) {
               clearInterval(this.timerHandle) 
               this.timerHandle = null
           }
           this.progress = false;
        }
        console.info('RC - End ',this.getData[0].workDone,this.getData[1].workDone,this.getData[2].workDone)        
        return "not used here"
     },
     firstone(e) {
         console.log('firstone------------------------')
       this.rfo = e.response
       e.workDone = DONE
     },
     secondone(e) {
         console.log('secondone---------------------')
       this.rso = e.response
       e.workDone = DONE
     },
     thirdone(e) {
         console.log('thirdone------------------------')
       this.rto = e.response
       e.workDone = DONE
     },
   }
}
</script>
