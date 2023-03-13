<template>
<div>
  <v-toolbar  dense  row  wrap color="primary">
      Class Lists Start
      <v-spacer />
    <base-tool-button
       v-if="studentList.length"
       icon="mdi-select-group"
       class="mr-2"
       title="Click to view attendance list"
       @click="attendancePrep"
    />
  </v-toolbar>
<v-container fluid v-if="['admin','teacher'].includes(getZml.login.type) == false">
    You are not logged in, or you are not a teacher!
</v-container>

<v-container v-else fluid>
<v-toolbar  dense  row  wrap color="primary">
    <v-spacer></v-spacer>
    <base-tool-button
       v-if="studentList.length"
       icon="mdi-select-group"
       class="mr-2"
       title="Click to view attendance list"
       @click="attendancePrep"
    >
      ATTENDANCE
    </base-tool-button>
    <base-tool-button
       v-if="studentList.length"
       icon="mdi-file-export"
       class="mr-2"
       title="Click to build an export list."
       @click="showListPrint=true"
    >
     EXPORT/PRINT
    </base-tool-button>
    <base-tool-button
       v-if="studentList.length"
       icon="mdi-toothbrush-paste"
       class="mr-2"
       title="Click to build a list of students with their photos."
       @click="showPhotoList=!showPhotoList"
    >
      SHOW PHOTO
    </base-tool-button>
   <base-tool-button v-if="studentList.length"
        title="Trying to get images to print"
        @click="doPrint('x12345')"
    >
     T
    </base-tool-button>
 </v-toolbar>

</v-container>
<v-container class="mt-2" fluid>

<v-card> student-grade, pick attendace</v-card>

 <v-row>
  <v-col cols="12">
   <student-grade v-model="gradeClass" gc="gradeClass" />
   <pick-attendance
    v-if="studentList.length && showAttendance == true"
    title="Pick Attendance Parameters"
    :gradeClass="gradeClass"
    @attendanceSelected="attSelected"
   />
  </v-col>
 </v-row>

<v-card> classListHeaderm studentlist-length</v-card>


 <v-row>
  <v-col cols="12" v-if="studentList.length">
   <v-card color="gray lighten-3" class="ma-2" id="x12345">
    <v-card-title class="heading text-center">
      {{ classListHeader }} (#{{studentList.length}}) {{ title }}
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
              <v-img :src="'https://kuiliesonline.co.za/api/candid/candidates.php?task=photo&studentno=' + s.studentid"
                      height="100"
                      contain
                     :title="s.studentid">
              </v-img>
             </v-flex>
             <v-flex xs8 class="ma-2">
              {{ s.surname }}, {{ s.firstname}}
             </v-flex>
             <div class="float-right"
                @mouseover="hover=s.studentid"
                v-show="hoverStart == 'R' + s.studentid">
                 <v-icon small color="gold darken-1" class="ma-1"> mdi-email </v-icon>
             </div>
            </v-layout>
          </v-card>
          <div v-if="hover == s.studentid">
              <v-card v-for="e in showEmails(s.studentid)"
                   :key="e"
                    color="gold lighten-1"
                    class="ma-2 pa-2">
                {{ e }}
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


<v-dialog v-model="showListPrint" xwidth="auto " :fullscreen="$vuetify.breakpoint.smAndDown" scrollable>
   <zml-close-button @btn-click="showListPrint = !showListPrint" />
  <front-json-to-csv v-if="studentList"
                    :jsonData="studentList"
                    :csvTitle="classListHeader"
                    @hideModal="showListPrint=false">
   <v-btn>
      Download with custom title
   </v-btn>
  </front-json-to-csv>
</v-dialog>

 <v-dialog v-model="showStudentCard"  max-width="500" :fullscreen="$vuetify.breakpoint.smAndDown" scrollable>
   <zml-close-button @btn-click="showStudentCard = false" />
   <student-name-card :studentList="singleStudent" />
 </v-dialog>

</v-container>
</div>
</template>

<script>
import { doPrint } from "@/api/DoPrint"
import { getters } from "@/api/store"
import { zmlConfig } from '@/api/constants.js';
import { zmlFetch } from '@/api/zmlFetch';
import StudentGrade from '@/components/student/StudentGrade'
import StudentNameCard from '@/components/student/StudentNameCard.vue'
import PickAttendance from '@/components/student/PickAttendance.vue'
import FrontJsonToCsv from '@/api/csv/FrontJsonToCsv.vue'
import zmlCloseButton from '@/components/zmlCloseButton.vue'
import BaseToolButton from '@/views/new/base/BaseToolButton.vue'


export default {
    name:"StudentClass",
    props:["title","gc"],
    components:{
        StudentGrade
       ,FrontJsonToCsv
       ,zmlCloseButton
       ,StudentNameCard
       ,BaseToolButton
       ,PickAttendance
    },
    computed: {},
    data: () => ({
        doPrint:doPrint,
        getZml: getters.getState({ object: "gZml" }),
        gradeClass:{},
        studentList:[],
        singleStudent:{data:''},
        showStudentCard:null,
        showPhotoList:null,
        hover:null,
        hoverStart:null,
        showListPrint:false,
        showAttendance:false,
        classListHeader:'',
        attendanceList:[],
    }),
    methods:{
      attendancePrep() {
        this.showAttendance = !this.showAttendance
        if (this.showAttendance == false) {
          this.attendanceList.length = 0
          this.classListHeader = `Student List for ${this.gradeClass.g}${this.gradeClass.c}`
        }
      },
      attSelected(aList,aProp) {
        //this.showAttendance = false
        this.attendanceList = aList
        this.classListHeader = `Student List for ${this.gradeClass.g}${this.gradeClass.c} \
                                Room (${aProp.location}) Period (${aProp.period}) - ${aProp.staff}`
        console.log('use',aList,' to do a fetch on all students', aProp)
      },
      studentCardColor(id) {
        if (this.attendanceList.length == 0) return 'gray lighten-4'
        console.log('List=',this.attendanceList)
        if (this.attendanceList.findIndex(a => a.studentid == id) > -1) {
          return "green darken-1"
        } else {
          return "red lighten-2"
        }
      },
      showEmails(id) {
        let em = this.studentList.find(e => e.studentid == id)
        console.log('show emails',em)
        if (!em.emails) {
          return ["No Emails Found"]
        }
        return em.emails.split(',')
      },
      loadData(response) {
        this.classListHeader = "Student List for Class " + this.gradeClass.g + ' ' + this.gradeClass.c
        this.studentList = response
      },
      loadError(error) {
        alert('S.C.' + error)
      },
      classListLoad() {
        let ts = {}
        ts.task = 'PlainSql'
        ts.sql = `SELECT s.studentid, surname, firstname, grade, gclass\
         , idno, GROUP_CONCAT(email) emails\
         FROM dkhs_student s\
         left join m_subscriber m on s.studentid = m.impnumber and m.outid is null\
         where grade = '${this.gradeClass.g}'\
         and gclass = '${this.gradeClass.c}'\
         group by studentid, surname, firstname, grade, gclass, idno\
         order by s.surname, s.firstname`
        ts.api = zmlConfig.apiDKHS
        ts.grade = this.gradeClass.g
        ts.class = this.gradeClass.c
        zmlFetch(ts, this.loadData, this.loadError);

      },
      showStudent(idx) {
        this.singleStudent.data = this.studentList[idx]
        this.showStudentCard = true
      }
     },
    mounted() {
      console.log('SC(mounted)1 : ', this.$options.name)
      console.log('SC(mounted)2 : ', this.$router.params)
      console.log('SC(mounted)3 : ', this.gc)
      if (this.gc && this.gc.c & this.gc.g) {
        // {"g": "G08", "c": "E1" }
        console.log('gc exist', this.gc)
        this.gradeClass = {g:this.gc.g, c:this.gc.c}
      }
    },
    watch: {
      gradeClass() {
        if (this.gradeClass) {
          this.classListLoad(this.gradeClass)
        }
      }
    }
}
</script>