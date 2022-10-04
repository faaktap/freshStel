<template>
<div>
<v-container fluid v-if="['admin','teacher'].includes(getZml.login.type) == false">
    You are not logged in, or you are not a teacher!
</v-container>

<v-container v-else fluid>
 <v-toolbar  dense  row  wrap>
    <v-spacer></v-spacer>
 </v-toolbar>
</v-container>

<v-container class="mt-2" fluid>
 <v-row>
  <v-col cols="12" v-if="studentList && studentList.length">
   <v-card color="gray lighten-3" class="ma-2" id="x12345">
    <v-card-title class="heading text-center">
      <slot> </slot>
     </v-card-title>
    <v-card-text>
      <v-row>
        <v-col cols="6" md="4" lg="3"
               v-for="(s,index) in studentList"
              :key="s.studentid">
          <v-card :color="studentCardColor(s.studentid)"
                  class="ma-1 pl-2"
                  @click="showStudent(index)"
                  @mouseout="hoverStart = null; hover = null"
                  @mouseover="hoverStart = 'R' + s.studentid">
            <v-layout>
             <v-flex xs1 class="ml-2"> {{ index+1 }}  </v-flex>
             <v-flex xs3 v-show="showPhotoList==true">
              <z-show name="studentphoto" :id="s.studentid" />
             </v-flex>
             <v-flex xs8 class="ma-2">
              {{ s.surname }}, {{ s.firstname}}
             </v-flex>
            </v-layout>
          </v-card>
          <div v-if="hover == s.studentid">
              <v-card color="gold lighten-1"
                    class="ma-2 pa-2">
                Show something interesting here...
            </v-card>
          </div>
        </v-col>
      </v-row>
     </v-card-text>
     <v-card-actions>
     </v-card-actions>
    </v-card>
   </v-col>
  </v-row>

 <v-dialog v-model="showStudentCard"  max-width="250" :fullscreen="$vuetify.breakpoint.smAndDown">
   <zml-close-button @btn-click="showStudentCard = false" />
   <student-name-card :studentList="singleStudent" />
 </v-dialog>

</v-container>
</div>
</template>

<script>
import { getters } from "@/api/store"
//import { zmlConfig } from '@/api/constants.js';
//import { zmlFetch } from '@/api/zmlFetch';
//import StudentGrade from '@/components/student/StudentGrade'
import StudentNameCard from '@/components/student/StudentNameCard.vue'
//import PickAttendance from '@/components/student/PickAttendance.vue'
//import FrontJsonToCsv from '@/api/csv/FrontJsonToCsv.vue'
import zmlCloseButton from '@/components/zmlCloseButton.vue'
//import BaseToolButton from '@/views/new/base/BaseToolButton.vue'
import ZShow from '@/components/base/ZShow.vue'


export default {
    name:"StudentBasicList",
    props:["studentList"],
    components:{
        zmlCloseButton
       ,StudentNameCard
       //,BaseToolButton
       ,ZShow
    },
    computed: {},
    data: () => ({
        getZml: getters.getState({ object: "gZml" }),
        gradeClass:{},
        singleStudent:{data:''},
        showStudentCard:null,
        showPhotoList:null,
        hover:null,
        hoverStart:null,
        showListPrint:false,
        classListHeader:'',
    }),
    methods:{
      studentCardColor(id) {
        console.log(id)
        return 'gray lighten-4'
        /*
        console.log('List=',this.attendanceList)
        if (this.attendanceList.findIndex(a => a.studentid == id) > -1) {
          return "green darken-1"
        } else {
          return "red lighten-2"
        }
        */
      },
      showStudent(idx) {
        this.singleStudent.data = this.studentList[idx]
        this.showStudentCard = true
      }
     },
    mounted() {
      console.log('ClassList(mounted) : ', this.studentList)
    },
    watch: {
    }
}
</script>