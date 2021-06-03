<template>
  <div>
      <v-progress-linear :active="progress" :indeterminate="progress" color="grey lighten-1" />


      <h1> File activity in the past {{ previousDays }} days. </h1>
            <v-data-table 
                 v-if="getData[0].workDone == 3"
                 :headers="tHeader"
                 :items="getData[0].response"
                 :items-per-page="120"
                  group-by="grade"
                  hide-default-footer
                  hide-default-header
                  class="elevation-2"
                  color="purple lighten-3"
                  @click:row="clickOnTableRow"
            >
             <template v-slot:item.icon="{ item }">
              <v-icon :color="ic(item.icon)" > {{ item.icon }}</v-icon>
             </template>
             <template v-slot:item.folder="{ item }">
              <v-chip :color="ic(item.icon)" > {{ item.folder }}</v-chip>
             </template>
             <template v-slot:item.shortname="{ item }">
              <v-chip :color="ic(item.icon)" > {{ item.shortname }}</v-chip>
             </template>
            </v-data-table>
  </div>
</template>

<script>
import { getters } from  "@/api/store"
import { zmlConfig } from '@/api/constants.js';
import { zmlFetch } from '@/api/zmlFetch'
import { getIconColor } from '@/api/fileUtils.js'
const  WAIT = 0, READY = 1,  BUSY = 2,  DONE = 3
export default {
    components: {

    },
    props: ['days'],
    data () {
      return {
        getZml: getters.getState({ object:"gZml" }),
        uniqid:0,
        progress:false,
        timerHandle:null,
        dataSequence:false,
        getData:[{id:0
                 , desc: "Latest Content"
                 , workDone: WAIT
                 , response: {}
                 , processor: this.doneLoading
                 , task:"latestContent"
                 , data:{days:4}
                 }
                ],
        tHeader:[{ text:'Teacher', value: 'surname'}
                ,{ text:'Subject', value: 'shortname'}
                ,{ text:'Grade', value: 'grade'}
                ,{ text:'icon', value: 'icon'}
                ,{ text:'Folder', value: 'folder'}
                ,{ text:'File', value: 'name'}                
                ,{ text:'Date', value: 'update_timestamp'}
                ,{ text:'id', value: 'contentid'}
                ],
        previousDays:null,
       }
   }, 
   computed: {   
   }, 
   mounted() {
       //we pass the days as a parameter on route ie: /latest/5
       //If no param is passed, we default to 4
       this.previousDays = this.days || 4
       this.getData[0].data.days = this.previousDays
       this.loadAllData()
       //console.log('icons',this.$vuetify.icons)
   },
   methods: {
     ic(i) {
          return getIconColor(i)
     },
     loadAllData() {
       this.progress = true;
       this.getData.forEach(ele => {
          let ts = {}
          if (ele.task) ts.task = ele.task
          if (ele.data) ts.data = ele.data
          ts.api = zmlConfig.apiDKHS
          zmlFetch(ts, this.processAllData, this.loadError, ele);
       })
     },
     processAllData(response,what,queue) {
       this.getData[queue.id].workDone = READY
       this.getData[queue.id].response = response
       if (!this.timerHandle) {
          this.startTimer( 2000, this.rollCall)
       }
     },
     startTimer(duration, funcToCall) {
       let loops = 4
          this.timerHandle = setInterval(function () {
            funcToCall('dummy')
            loops = loops - 1
            if (loops < 0) {
              clearInterval(this.timerHandle)
            }
          }, duration);
     },
     rollCall() {  
        this.getData.forEach(work => {
            if (work.workDone == READY) {
                work.workDone = BUSY
                work.processor(work)
            }
        })
       //Check if all is done
       this.getData.forEach(e => e.workDone == 'DONE')
       if (this.timerHandle) {
               clearInterval(this.timerHandle) 
               this.timerHandle = null
       }
       this.progress = false;
       return
     },
     doneLoading(e) {
       e.workDone = DONE
     },
     clickOnTableRow(p1) {
       console.log(p1)
       //   let trow = this.tList.find(ele => ele.contentid == p1.contentid)
          let ts = {}
          ts.task = 'getLContentCurrentFolder'
          ts.data = p1
          ts.api = zmlConfig.apiDKHS
          zmlFetch(ts, this.callSH)
     },
     callSH(response) {
        //console.log(response)
        if (!Array.isArray(response) || (response.errorcode && response.errorcode != 0) ) {
         return
        }
        console.log(response[0].contentid)
        this.$router.push({name: 'sh' 
                           ,params:{propfolder:response[0].contentid}
                           ,meta: {layout: "AppLayoutGray" }});  

     }
   }
}
</script>
