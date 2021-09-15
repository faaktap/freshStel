<template>
<v-container fluid>

 <student-grade v-model="gradeClass" /> 

 <v-row>
  <v-col cols="12" v-if="studentList.length">
   <v-card color="blue" class="ma-2">
    <v-card-title>
     <hr>
     <div class="heading text-center">{{ classListHeader }}</div>
    </v-card-title>
    <v-card-text>
      <v-row>
        <v-col cols="6" md="4" lg="3" 
               v-for="(s,index) in studentList" 
              :key="s.studentid">
          <v-card color="light-pink" 
                  class="ma-1 pl-2"
                  @click="showStudent(index)"
                  @mouseout="hoverStart = null; hover = null" 
                  @mouseover="hoverStart = 'R' + s.studentid">  
           {{ index+1 }} {{ s.surname }}, {{ s.firstname}} 
           <div class="float-right" 
                @mouseover="hover = s.studentid" 
                v-show="hoverStart == 'R' + s.studentid">
                 <v-icon small color="green lighten-1" class="ma-1"> mdi-email </v-icon>
           </div>
          </v-card>
          <div v-if="hover == s.studentid">
            <v-card v-for="e in s.email" 
                   :key="e" 
                    color="green lighten-2">
                {{ e }}
            </v-card>
          </div>
          <div v-if="hover == s.studentid && s.email.length==0">
            <v-card color="red"> No email! </v-card>
          </div>
        </v-col>
      </v-row>
     </v-card-text>
     <v-card-actions>
       <v-btn v-if="studentList.length" 
           @click="showListPrint=true"
           small
           title="Click to build an export list."> 
           export 
       </v-btn>
     </v-card-actions>
    </v-card>
   </v-col>
  </v-row>

<v-container fluid v-if="getZml.login.isAuthenticated && getZml.login.username=='werner'">  
  (werner) studentList  :  
  <div v-for="s in studentList" :key="s.studentid">
  <br> {{ s }}
  </div>
</v-container>

<v-dialog v-model="showListPrint" xwidth="auto " :fullscreen="$vuetify.breakpoint.smAndDown">
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
 
 <v-dialog v-model="showStudentCard"  max-width="500" :fullscreen="$vuetify.breakpoint.smAndDown">
   <zml-close-button @btn-click="showStudentCard = false" />
   <student-name-card :studentList="singleStudent" />
 </v-dialog>

</v-container>
</template>

<script>
import { getters } from "@/api/store"
import { zmlConfig } from '@/api/constants.js';
import { zmlFetch } from '@/api/zmlFetch';
import StudentGrade from '@/components/student/StudentGrade'
import StudentNameCard from '@/components/student/StudentNameCard.vue'
import FrontJsonToCsv from '@/api/csv/FrontJsonToCsv.vue'
import zmlCloseButton from '@/components/zmlCloseButton.vue'

export default {
    name:"StudentClass",
    components:{
        StudentGrade
       ,FrontJsonToCsv
       ,zmlCloseButton
       ,StudentNameCard
       },
    data: () => ({
        getZml: getters.getState({ object: "gZml" }),
        gradeClass:{},
        studentList:[],
        singleStudent:{data:''},
        showStudentCard:null,
        hover:null,
        hoverStart:null,
        showListPrint:false,
        classListHeader:'',
    }),
    methods:{ 
      loadData(response) {
        this.classListHeader = "Student List for Class " + this.gradeClass.g + ' ' + this.gradeClass.c
        this.studentList.length = 0
        let sid = 0;  
        //You sometimes need to declare an empty project with properties if there is an array in there - otherwise the push will fail
        let obj = {studentid:0, surname:'', email:[], firstname:'', idno:''}
        response.forEach(ele => {
           if (sid == ele.studentid) {
              obj.email.push(ele.email)
           } else {
              if(sid != 0) {
                  this.studentList.push(obj)
                  obj = {studentid:0, surname:'', email:[], firstname:'', idno:''}
              }  
              obj.studentid = ele.studentid
              obj.firstname = ele.firstname
              obj.surname = ele.surname
              obj.idno = ele.idno
              if (ele.email) obj.email.push(ele.email)
           }
           sid = ele.studentid
        })
        this.studentList.push(obj)
      },
      loadError(error) {
        alert('S.C.' + error)
      },  
      classListLoad() {
        let ts = {}
        ts.task = 'PlainSql'
        ts.sql = "SELECT studentid, surname, firstname, grade, gclass, idno, email"
               + "  FROM dkhs_student s"
               + "  left join m_subscriber m on s.studentid = m.impnumber"
               + "  where grade = '" + this.gradeClass.g + "'" 
               + "    and gclass = '" + this.gradeClass.c + "'"
               + "    and m.outid is null"
               + "  order by s.surname, s.firstname" 
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