<template>
<v-container fluid>
 <v-row>
   <v-col cols="12">
     <v-toolbar flat color="primary" dark class="mb-4">
       <v-toolbar-title>
           SL - Lists and Stuff. - still testing
       </v-toolbar-title>
        <v-spacer />
       </v-toolbar>
    </v-col> 
  </v-row>
  <v-row><v-col cols="12">
    <class-list />
  </v-col></v-row>


 <v-row>
   <v-col cols="12">
     <v-toolbar flat color="primary" dark class="mb-4">
       <v-toolbar-title>
           General Class Lists
       </v-toolbar-title>
        <v-spacer />
       </v-toolbar>
    </v-col> 
  </v-row>
 <v-row>
   <v-col cols="12">
     <student-class title="Click here to select a class"> 
     </student-class>
  </v-col>
 </v-row>

<v-dialog v-model="studentInfoShow" width="auto " :fullscreen="$vuetify.breakpoint.smAndDown">
  <zml-close-button @btn-click="studentInfoShow = !studentInfoShow" />
  <student-subject-list :studentList="studentInfo" />
</v-dialog> 

</v-container>
</template>

<script>

// We need a place where the teachers has access to lists of students.
// want them to create their own lists, and to see typical lists 

import StudentClass from '@/components/student/StudentClass.vue'
import ClassList from '@/components/homework/ClassList.vue'
import { getters } from "@/api/store";
import { zmlFetch } from '@/api/zmlFetch';
import { zmlConfig } from '@/api/constants';
import StudentSubjectList from '@/components/student/StudentSubjectList'
import { infoSnackbar } from '@/api/GlobalActions';

export default {
    name:"StudentLists",
    components:{
        StudentClass,
        ClassList,
        StudentSubjectList
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
        //this.$cs.l('IDs = ' , value);
        alert('ids' + this.currentListID)
      },
      studentFound(value) {
         if (value.data == 'undefined') return;
         //this.$cs.l('SF (student id received) = ', value.data.studentid);
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
        //this.$cs.l('Show List Data ', listID)
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
        //this.$cs.l(ts.sql)
        zmlFetch(ts, this.displayListData, this.errorLoading);          
      },
      displayListData(response) {
        this.studentClassList = response
        //this.$cs.l('We are DONE loading a list', this.currentListID, this.studentClassList.length)
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
         //this.$cs.l(payload)
         this.classList = []
         if (payload.error && payload.error.substr(0, 7) == 'no rows') {
             //this.$cs.l('no data found')
             return
         }
         this.classList = payload
      },
      errorLoading(response) {
        alert('We had an error loading your data!' + response)
        //this.$cs.l('We had an error loading your data!',response)
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
