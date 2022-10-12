<template>
<div>

<base-title-expand color="white" heading="ATTENDANCE VIEW SESSION">
   <p>Shall we allow them to edit? Might be a bit tricky, maybe just change status and allow delete?</p>
   {{ studentTally }}
  </base-title-expand>

<v-container fluid v-if="['admin','teacher'].includes(getZml.login.type) == false">
    You are not logged in, or you are not a teacher!
</v-container>

<v-container v-else fluid>
 <v-toolbar  dense  row >
   <span class="d-none d-sm-block"> Session {{ sessionid }}  </span>
   <v-spacer/>Day:{{ detail[0] }} Period:{{ detail[1] }} Room:{{ place.concatsearch }}
    <v-spacer></v-spacer>
    <v-btn icon small class="ma-2" @click="showPhotoList = !showPhotoList" title="show Thumbnails"><v-icon>mdi-image</v-icon></v-btn>
    <v-btn class="ma-2" small icon @click="showAs='list'" title="View as list"> <v-icon>mdi-view-list</v-icon> </v-btn>
    <v-btn class="ma-2" small icon @click="showAs='card'" title="View as cards"> <v-icon>mdi-id-card</v-icon> </v-btn>
    <v-back/>
 </v-toolbar>
</v-container>


<v-container class="mt-2" fluid>
 <v-row>
  <v-col cols="12" v-if="studentList && studentList.length">
   <v-card v-if="showAs=='card'" color="gray lighten-3" class="ma-2" id="x12345">
    <v-card-text>
      <v-row>
        <v-col cols="12" md="4" lg="3"
               v-for="s in studentList"
              :key="s.studentid">
           <v-card :color="s.status == 'Present' ? 'green lighten-1' : 'purple lighten-3'" class="ma-1 pl-2">
             <v-card-title class="text-caption">
              <v-layout justify-space-between>
               <span>{{ s.surname }}, {{ s.firstname}}</span>
               <span> {{ s.studentid }}  </span>
              </v-layout>
             </v-card-title>
             <v-card-text>
             <v-layout justify-space-between>
               <v-flex xs3 class="ma-1" v-show="showPhotoList==true">
                 <z-show name="studentphoto" :id="s.studentid" height="88" />
               </v-flex>
             <span class="ma-2">
               {{ s.attendancedate.substr(0,16) }} P{{ s.period }}
             </span>

            </v-layout>
             </v-card-text>
             <v-card-actions class="text-caption">
              <v-layout justify-space-between>
              <span class="ma-2" v-if="'grade' in s"> {{ s.grade }}{{ s.gclass }} </span>
              <v-spacer />
              <span class="ma-2"> {{ s.status }} </span>
              </v-layout>
             </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
     </v-card-text>
     <v-card-actions class="ma-2">
      <v-spacer />
       <!-- <v-btn @click="commitChanges" class="ma-2" color="primary"><v-icon>mdi-content-save</v-icon> Commit Attendance </v-btn> -->
     </v-card-actions>
    </v-card>
    <v-card v-if="showAs=='list'" color="gray lighten-3" class="ma-2">
      <v-simple-table>
        <thead>
        <tr class="ma-2">
          <th class="text-left">id</th>
          <th class="text-left">surname</th>
          <th class="text-left">name</th>
          <th class="text-left">adminno</th>
          <th class="text-left">date</th><th>period</th><th>status</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="s in studentList" :key="s.studentid" :style="s.status == 'Present' ? 'color:gray' : 'background-color:lavender'">
          <td class="ma-2"> {{ s.attendanceid }} </td>
          <td class="ma-2"> {{ s.surname}} </td>
          <td class="ma-2"> {{ s.firstname}} </td>
          <td class="ma-2"> {{ s.studentid}} </td>
          <td class="ma-2"> {{ s.attendancedate.substr(0,16) }} </td>
          <td class="ma-2"> {{ s.period }} </td>
          <td class="ma-2" :style="s.status == 'Present' ? 'color:green' : 'background-color:lavender'"> {{ s.status }} </td>
          <td  class="ma-2" v-show="showPhotoList==true"><z-show name="studentphoto" :id="s.studentid" height="44" /> </td>
        </tr>
        </tbody>
      </v-simple-table>
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
        refreshKey: 0,
        showAs: 'card',
        detail:'',
        place:{concatsearch:'', name:'?'}
    }),
    computed: {
      studentTally() {
        if (this.studentList.length < 1) return []
        let tally = []
        this.studentList.forEach(e => {
          let idx = tally.findIndex(t => t.status == e.status)
          if (idx == -1 ) {
            tally.push({status:e.status, value:0})
            idx = tally.findIndex(t => t.status == e.status)
          }
          tally[idx].value += 1
        });
        return tally
      },
    },
    methods:{
      commitChanges() {
         //if (AttWork.saveAttendance(this.studentListReal, this.studentList, this.attendanceDetail) == 'DONE')  this.confirmSound.play()
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
      console.log('AttViewSes(mounted) : ', this.sessionid)
      this.refresh()
      this.detail = this.sessionid.split(".");
      console.log(this.detail.length)
      if (this.detail.length == 3) {
        console.log (this.detail[2].indexOf('-') )
        console.log (this.detail[2].substr(0,2))
        this.detail[2] = this.detail[2].substr(0,this.detail[2].indexOf('-'))
        if (this.getZml.place.length > 0) {
          this.place = this.getZml.place.find(e => e.placeid == this.detail[2])
        }
      }
    },
    watch: {
    }
}
</script>