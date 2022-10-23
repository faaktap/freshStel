<template>
<div>

<base-title-expand color="white" heading="ATTENDANCE CLASS LIST">
   <p>
    Here is a list of all people you can mark as absent, late or as ignored.
    If there are students missing, you need to edit the list you selected at class lists.
    <br>
    You can add a new student here, but it will only last for this session.
   </p>
    <details color="primary"><summary>Absent</summary>
    If the student is sick, or absent for some reason from your class, use this one
    </details>
    <details color="primary"><summary>Ignore</summary>
    If this name is not supposed to be on the list, you can use ignore.
    </details>
    <details color="primary"><summary>Late</summary>
    If someone is late in class, ie. kids tell you he is on the way, you can mark hom as late.</details>

  </base-title-expand>

<v-container fluid v-if="['admin','teacher'].includes(getZml.login.type) == false">
    You are not logged in, or you are not a teacher!
</v-container>

<v-container v-else fluid>
 <v-toolbar  dense  row >
   Attendance for {{ attendanceDetail.staffSurname }} on Day/Period {{attendanceDetail.day}}-{{ attendanceDetail.period}} at Class {{ attendanceDetail.location}}
    from list {{ attendanceDetail.other.listname}}
    <v-spacer></v-spacer>
      <v-btn small @click="reset('Ignore')" class="ma-2" title="Mark all as ignore"> I </v-btn>
      <v-btn small @click="reset('Present')" class="ma-2" title="Mark all as Present"> P </v-btn>
      <v-btn icon small @click="showAdd = true" class="ma-2" title="Add a Student">
        <v-icon>mdi-database-plus </v-icon>
      </v-btn>

    <v-btn icon small class="ma-2" @click="showPhotoList = !showPhotoList" title="show Thumbnails"><v-icon>mdi-image</v-icon></v-btn>
    <v-back/>
 </v-toolbar>
</v-container>


<v-container class="mt-2" fluid>
 <v-row>
  <v-col cols="12" v-if="studentList && studentList.length">
   <v-card color="gray lighten-3" class="ma-2" id="x12345">
    <v-card-title v-if="'staffSurname' in attendanceDetail" class="heading text-center">
      <!-- <slot> </slot> -->

          <v-flex class="float-right">
          <span v-for="s in studentTally" :key="s.name" class="ml-2 text-caption"> {{s.name}}:{{s.value}}, </span>
          </v-flex>
          Total : {{ ss.length }}
     </v-card-title>
    <v-card-text>
      <v-row>

        <v-col cols="12" md="4" lg="3"
               v-for="(s,index) in studentListReal"
              :key="s.studentid">
           <v-card :color="studentCardColor(index)"
                  class="ma-1 pl-2"
                  @click="quickShow = s.studentid">
            <v-layout justify-space-between>
             <v-flex xs3 class="ma-1" v-show="showPhotoList==true">
              <z-show name="studentphoto" :id="s.studentid" height="88" />
             </v-flex>
             <span class="mt-2 ml-2 text-caption text-sm-body-2 text-md-body-1"> {{ index+1 }}  </span>
             <span class="ma-2">
              {{ s.surname }}, {{ s.firstname}} <span v-if="'grade' in s" class="text-caption"> {{ s.grade }}{{ s.gclass }} </span>
             </span>
             <span class="float-right mt-3 mr-4 text-caption">
              {{ ss[index] }}
             </span>
            </v-layout>
          </v-card>
            <v-card v-if="quickShow == s.studentid" color="gray lighten-3" class="ma-1" elevation="6">
            <v-radio-group dense v-model="ss[index]" class="ma-0 pl-5 pa-3">
            <v-radio v-for="c in checkList" :key="c"  :label="c"
                    :value="c" @click="quickShow=false"
                    class="ma-0 pa-0" />
           </v-radio-group>
          </v-card>
        </v-col>
      </v-row>
     </v-card-text>
     <v-card-actions class="ma-2">
      <v-btn @click="showAdd = true" class="ma-2">
        <v-icon>mdi-database-plus </v-icon>
        Add
      </v-btn>
      <v-spacer />
       <v-btn @click="commitChanges" class="ma-2" color="primary"><v-icon>mdi-content-save</v-icon> Commit Attendance </v-btn>

     </v-card-actions>
    </v-card>
   </v-col>
  </v-row>

<v-dialog v-model="showAdd" width="450" max-width="550" :fullscreen="$vuetify.breakpoint.smAndDown">
    <v-card  class="ma-2" elevation="2">
    <v-card-title> Add Student to this list </v-card-title>
    <v-card-text>
      <student-lookup
           @dataEntered="handCapture"
           :searchMore="true"
      />
      <!-- stud = {{ stud }} -->
      <v-card v-if="'data' in stud" class="pa-2">
       Name : {{  stud.data.surname }}, {{ stud.data.firstname }}
       <br>
       Grade : {{ stud.data.grade }} {{  stud.data.gclass }}
      <v-card-actions>
        <v-btn v-if="'data' in stud" @click="addStudent" color="primary"> Add </v-btn>
        <v-spacer />
        <v-btn @click="showAdd = false"> Ignore </v-btn>
      </v-card-actions>
     <v-card-text class="text-caption ma-2" color="secondary">
      *warning : if you add a student here, it will be only for this session
     </v-card-text>

     </v-card>
     </v-card-text>
    </v-card>
</v-dialog>

</v-container>
</div>
</template>

<script>
import { getters } from "@/api/store"
import StudentLookup from '@/components/student/StudentLookup.vue'
import BaseTitleExpand from '@/components/base/BaseTitleExpand.vue'
import ZShow from '@/components/base/ZShow.vue'
import VBack from '@/components/base/VBack.vue'
import { AttWork } from '@/components/student/AttWork.js'

export default {
    name:"StudentAttendanceList",
    props:["studentList", "attendanceDetail","checkList"],
    components:{
       ZShow
      ,VBack
      ,StudentLookup
      ,BaseTitleExpand
    },
    data: () => ({
        getZml: getters.getState({ object: "gZml" }),
        gradeClass:{},
        singleStudent:{data:''},
        showPhotoList:null,
        hover:null,
        hoverStart:null,
        showListPrint:false,
        classListHeader:'',
        ss: [],
        quickShow: false,
        //AttWork: AttWork
        stud:[],
        showAdd:false,
        addList:[],
        confirmSound:new Audio('sounds/Water drip.mp3'),
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
      studentListReal() {
        if (this.addList.length) {
          return this.studentList.concat(this.addList)
        } else {
          return this.studentList
        }
      }

    },
    methods:{
      reset(text) {
        this.ss.fill(text)
        console.log('fill=', this.ss)
        this.refreshKey++
      },
      commitChanges() {
         if (AttWork.saveAttendance(this.studentListReal, this.ss, this.attendanceDetail) == 'DONE')  this.confirmSound.play()
         this.$router.back()
      },
      studentCardColor(idx) {
        console.log(this.refreshKey)
        switch (this.ss[idx]) {
          case 'Present': return "green lighten-1"
          case 'Absent': return "red lighten-2"
          case 'Late': return "purple lighten-1"
          default : return 'gray lighten-4'
        }
      },
      handCapture(studentReceived) {
        this.stud = studentReceived
      },
      addStudent() {
        this.addList.push(this.stud.data)
        this.ss.push('Present')
        this.showAdd = false
      }
     },
    mounted() {
      console.log('ClassList(mounted) : ', this.studentList)
      this.ss = Array.from({ length: this.studentList.length }, () => ('Present'))
    },
    watch: {
    }
}
</script>