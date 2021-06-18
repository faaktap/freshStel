<template>
<v-container fluid>
 <v-row>
   <v-col cols="12">
     <v-toolbar flat color="primary" dark class="mb-4">
       <v-toolbar-title>
           Student/Class Lists. <small>( Click on the button below to select a class )</small>
       </v-toolbar-title>
        <v-spacer />
       </v-toolbar>
    </v-col> 
  </v-row>

  <v-row>
   <v-col cols="12" v-if="getZml.login.type=='admin'">
     Since you are admin, you see all the lists..
   </v-col>
   <v-col cols="12">
     <h2> Current Class Lists</h2>
   </v-col>
   <v-col cols="12">
       <v-btn small @click="createClassList"> Create a New Student List </v-btn>
   </v-col>
  </v-row>
  <v-row>
   <v-col cols="12">
     <v-card class="pa-4 ma-2" color="green" v-if="!classList.length"> 
        We have no classlists defined yet, click the button below to start
     </v-card>
   </v-col>
  </v-row>

  <v-row>
   <v-col cols="12" sm="6">
     {{ currentOne }}
    <v-expansion-panels min-width="150" 
                       rounded 
                       class="ma-2 pa-2 long-line"
                       v-model="currentOne"
                       >
     <v-expansion-panel v-for="i in classList" :key="i.id" 
     >
      <v-expansion-panel-header disable-icon-rotate 
                               class="no-uppercase "
                               color="deep-purple lighten-5"               
                               >
        {{ i.listname }}  - (Entries : {{ i.students }}) 
      </v-expansion-panel-header>
      <v-expansion-panel-content class="gray lighten-3">
       <v-row>
       <v-col class="my-2">
        <student-lookup v-if="showStudentLookup" 
                       @dataEntered="studentFound"
                       @idsEntered="IDs" 
                       :searchMore="true" />
        </v-col>
       </v-row>
       <v-row><v-col>
        <v-card class="ma-2 px-3"> {{ i.listname }}</v-card>
        <v-btn class="ma-2" small @click="activateAddStudent(i.id)"> Add Student </v-btn>
        <v-btn class="ma-2" small @click="showListData(i.id)"> Show Students </v-btn>            
        <v-btn class="ma-2" small @click="editClassList(i.id)"> Change List Name </v-btn>              
        <v-card class="ma-2 px-3">{{ i.students }} Entries </v-card>
       </v-col>
       </v-row>
      </v-expansion-panel-content>
     </v-expansion-panel>
    </v-expansion-panels>
   </v-col>

   <v-col cols="12" sm="6" v-show="studentClassList.length > 0">
     <!-- {{ classObj }} -- {{ studentClassList.length }} -->
     <v-card color="deep-purple lighten-5">
       <base-table 
                  :tList="studentClassList" 
                   tHeading="" 
                  :bHeading="classObj.listname" 
       /> 
      </v-card>
    </v-col>
  </v-row> 
   
<v-dialog v-model="showListUpdate" 
         :fullscreen="$vuetify.breakpoint.smAndDown" >
        <class-list-edit @saveClassList="saveClassList"
                         @hideDialog="showListUpdate=false"
                         :classObj="classObj" />
</v-dialog>

<v-dialog v-model="studentInfoShow" 
          width="auto " 
         :fullscreen="$vuetify.breakpoint.smAndDown">
  <zml-close-button @btn-click="studentInfoShow = !studentInfoShow" />
  <student-subject-list :studentList="studentInfo" />
</v-dialog> 

</v-container>
</template>

<script>

// We need a place where the teachers has access to lists of students.
// want them to create their own lists, and to see typical lists 

import ClassListEdit from '@/components/student/ClassListEdit.vue'
//import BaseBreakpointDisplay from '@/components/base/BaseBreakpointDisplay.vue'
import { getters } from "@/api/store";
import { zmlFetch } from '@/api/zmlFetch';
import { zmlConfig } from '@/api/constants';
import StudentLookup from '@/components/student/StudentLookup'
import BaseTable from    '@/components/base/baseTable'
import StudentSubjectList from '@/components/student/StudentSubjectList'
import { infoSnackbar } from '@/api/GlobalActions';

export default {
    name:"ClassList",
    components:{
        StudentLookup,
        ClassListEdit,
        BaseTable,
        StudentSubjectList,
       },
    data: () => ({
        getZml: getters.getState({ object: "gZml" }),        
        gradeClass:{},
        classList:[],
        classObj:{},
        showListUpdate:false,
        insertList:false,
        showStudentLookup:false,
        studentClassList:[],
        studentInfo:'',
        studentInfoShow:false,        
        currentOne:null,
    }),
    methods: {
      IDs(value) {
        if (value.data == 'undefined') return;
        alert('ids' + this.currentListID)
      },
      studentFound(value) {
         if (value.data == 'undefined') return;
         this.saveStudentinList(value.data.studentid, this.currentListID)
      },
      activateAddStudent(listID) {
        this.showStudentLookup = true
        this.currentListID = listID
      },
      createClassList() {
           this.classObj = { id:null
                           , teacher:!this.getZml.login.menemonic ? this.getZml.login.username : this.getZml.login.menemonic
                           , listname:'Please enter a listname in here!'
                           , share:'N' }
           this.showListUpdate = true               
           this.insertList = true
      },
      editClassList(listID) {
          this.classObj = this.classList.find(ele => ele.id == listID)
          this.showListUpdate = true               
          this.insertList = false
      },      
      saveStudentinList(studentid, listid) {
        if (studentid == 0 || listid == 0) {
           alert('we need a student and a list')
           return
        }
        let ts = {}
        ts.task = 'PlainSql'
        ts.sql = "INSERT INTO hw_classliststudent "
               + " VALUES(null, "
               +  listid + ", "
               +  studentid + ")"
        ts.api = zmlConfig.apiDKHS
        zmlFetch(ts, this.showInsertStudentResult, this.errorLoading);          
      },
      showInsertStudentResult(response) {
        if (response.errorcode && response.errorcode != 0) {
          infoSnackbar(response.error)
        } else {
          infoSnackbar("Record successfully added!")
        }
        this.loadListData()
      },
      saveClassList() {
        if (this.classObj.listname == '' || this.classObj.listname == 'Please enter a listname in here!') {
          infoSnackbar('please enter a BETTER listname!!!')
          return
        }
        this.showListUpdate = false 
        let ts = {}
        ts.task = 'PlainSql'
        if (this.insertList) {        
            ts.sql = "INSERT INTO hw_classlist "
               + " VALUES(null, "
               + "'" + this.classObj.teacher + "'" + ", "
               + "'" + this.classObj.listname + "'" + ", "
               + "'" + this.classObj.share + "'" + ", "
               + " null, null)"
        } else {
            ts.sql = "UPDATE hw_classlist SET "
               + "listname = '" + this.classObj.listname + "'" + ", "
               + "share = '" + this.classObj.share + "'" 
               + " where id = " + this.classObj.id
        }               
        ts.api = zmlConfig.apiDKHS
        zmlFetch(ts, this.loadData, this.errorLoading);
      },
      showListData(listID) {
        this.currentListID = listID
        this.loadListData()
      },
      loadListData() {
        if (this.currentListID < 1) {
          alert('we only load data if we have alist nuber')
          return
        }
        //Loading classObj for listheading display
        this.classObj = this.classList.find(ele => ele.id == this.currentListID)
        this.studentClassList.length = 0
        let ts = {}
        ts.task = 'PlainSql'
        ts.sql = "SELECT s.surname, s.firstname, s.grade, s.gclass "
               + "  FROM hw_classliststudent l, dkhs_student s "
               + " WHERE l.studentid = s.studentid"
               + "   AND l.classlistid = " + this.currentListID
               + " ORDER BY s.surname, s.firstname"
        ts.api = zmlConfig.apiDKHS
        zmlFetch(ts, this.displayListData, this.errorLoading);          
      },
      displayListData(response) {
        this.studentClassList = response
      },
      loadData() {
        let ts = {}
        ts.task = 'PlainSql'
        let teacher = !this.getZml.login.menemonic ? this.getZml.login.username : this.getZml.login.menemonic
        let where = "  where teacher = 'ADMIN' or teacher = '" + teacher + "'";
        if (this.getZml.login.username == 'werner') {
          //show all the list if we login as werner
          where = ''
        }
        ts.sql = "SELECT c.id, c.teacher, c.listname, c.share, create_timestamp, update_timestamp"
               + "     , count(s.classlistid) students "
               + "  FROM hw_classlist c "
               + "  left join hw_classliststudent s on s.classlistid = c.id "
               + where
               + " group by s.classlistid"
        ts.api = zmlConfig.apiDKHS
        zmlFetch(ts, this.showData, this.errorLoading);          
      },
      showData(payload) {
         this.classList = []
         if (payload.error && payload.error.substr(0, 7) == 'no rows') {
             return
         }
         this.classList = payload
      },
      errorLoading(response) {
        alert('We had an error loading your data!' + response)
      }
    },
    mounted() {
        this.loadData();

    },
    watch: {
      currentOne() {
        this.currentListID = null
        this.studentClassList.length = 0
      }
    }
}
</script>
