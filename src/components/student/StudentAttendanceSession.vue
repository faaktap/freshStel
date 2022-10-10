<template>
<div>

<base-title-expand color="white" heading="ATTENDANCE VIEW SESSION">
   <p>Shall we allow them to edit? Might be a bit tricky, maybe just change status and allow delete?</p>
  </base-title-expand>

<v-container fluid v-if="['admin','teacher'].includes(getZml.login.type) == false">
    You are not logged in, or you are not a teacher!
</v-container>

<v-container v-else fluid>
 <v-toolbar  dense  row >
   Attendance session {{ sessionid }}
    <v-spacer></v-spacer>
    <v-btn icon small class="ma-2" @click="showPhotoList = !showPhotoList" title="show Thumbnails"><v-icon>mdi-image</v-icon></v-btn>
    <v-back/>
 </v-toolbar>
</v-container>

<v-container class="mt-2" fluid>
 <v-row>
  <v-col cols="12" v-if="studentList && studentList.length">
   <v-card color="gray lighten-3" class="ma-2" id="x12345">
    <v-card-text>
      <v-row>
        <v-col cols="12" md="4" lg="3"
               v-for="s in studentList"
              :key="s.studentid">
           <v-card :color="s.status == 'Present' ? 'green lighten-1' : 'purple lighten-3'"
                  class="ma-1 pl-2">
            <v-layout justify-space-between>
             <v-flex xs3 class="ma-1" v-show="showPhotoList==true">
              <z-show name="studentphoto" :id="s.studentid" height="88" />
             </v-flex>
             <span class="mt-2 ml-2 text-caption text-sm-body-2 text-md-body-1"> {{ s.studentid }}  </span>
             <span class="ma-2">
              {{ s.surname }}, {{ s.firstname}} <span v-if="'grade' in s" class="text-caption"> {{ s.grade }}{{ s.gclass }} </span>
             </span>
             <span class="float-right mt-3 mr-4 text-caption">
              {{ s.status }}
             </span>
            </v-layout>
          </v-card>
        </v-col>
      </v-row>
     </v-card-text>
     <v-card-actions class="ma-2">
      <v-spacer />
       <!-- <v-btn @click="commitChanges" class="ma-2" color="primary"><v-icon>mdi-content-save</v-icon> Commit Attendance </v-btn> -->
     </v-card-actions>
    </v-card>
   </v-col>
  </v-row>
</v-container>
</div>
</template>

<script>
import { zmlFetch } from '@/api/zmlFetch.js';
import { getters } from "@/api/store"
import BaseTitleExpand from '@/components/base/BaseTitleExpand.vue'
import ZShow from '@/components/base/ZShow.vue'
import VBack from '@/components/base/VBack.vue'
//import { AttWork } from '@/components/student/AttWork.js'

export default {
    name:"StudentAttendanceSession",
    props:["sessionid"],
    components:{
       ZShow
      ,VBack
      ,BaseTitleExpand
    },
    data: () => ({
        getZml: getters.getState({ object: "gZml" }),
        studentList:[],
        showPhotoList:null,
        showListPrint:false,
        classListHeader:'',
        quickShow: false,
        refreshKey: 0
    }),
    computed: {
      studentTally() {
        console.log(this.refreshKey)
        if (this.ss.length < 1) return []
        let tally = []

        //Build zero value tally array
        this.checkList.forEach(e => tally.push({name:e, value:0} ))

        //loop thru ss array, and add 1 to tally for each checklist that match
        this.ss.forEach(e => {
          const idx = tally.findIndex(t => t.name == e)
          if (idx == -1 ) console.log('we have a problem', idx)
          const i = tally.find(t => t.name == e)
          console.log(i)
          tally[idx].value += 1
        });
        return tally
      },
    },
    methods:{
      commitChanges() {
         //if (AttWork.saveAttendance(this.studentListReal, this.ss, this.attendanceDetail) == 'DONE')  this.confirmSound.play()
         this.$router.back()
      },
      refresh() {
        let ts = {task: 'PlainSql',
               sql: `SELECT * \
               from dkhs_attendance a, dkhs_student s \
               where a.sessionid = '${this.sessionid}'\
                 and s.studentid = a.studentid`
             }
        zmlFetch(ts, this.loadAttendanceData, this.errorLoading)
      },
      loadAttendanceData(response) {
        this.studentList = response
      },
      errorLoading(err) {
        this.loading = false
        alert('something went wrong:'+ err.error)
        console.log(err)
      },
     },
    mounted() {
      console.log('AttViewSes(mounted)')
      console.log('AttViewSes(mounted) : ', this.sessionid)
      this.refresh()
    },
    watch: {
    }
}
</script>