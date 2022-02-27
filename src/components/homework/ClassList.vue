<template>
<div>
<v-container fluid v-if="['admin','teacher'].includes(getZml.login.type) == false">
    You are not logged in, or you are not a teacher!
</v-container>

<v-container v-else fluid>
 <v-toolbar  dense  row  wrap :xxcollapse="$vuetify.breakpoint.smAndDown">
    <v-app-bar-nav-icon  v-if="$vuetify.breakpoint.smAndDown" @click.stop="drawer = !drawer">
    </v-app-bar-nav-icon>
    <v-navigation-drawer v-model="drawer" absolute temporary ></v-navigation-drawer>
    <v-spacer></v-spacer>
      <v-switch v-model="showStudentLists"
                label="Select Student List"
                class="mt-5 mr-2" inset />
      <base-tool-button class="mr-2" icon="mdi-view-list"
        @click="createClassList">
        Create a New Student List
      </base-tool-button>
      <base-tool-button class="mr-2" icon="mdi-format-list-checkbox">
        Change List Properties
      </base-tool-button>
      <base-tool-button class="mr-2" icon="mdi-school">
       Show Students
      </base-tool-button>
      <base-tool-button class="mr-2" icon="mdi-database-edit">
       Add Students to List
      </base-tool-button>

  </v-toolbar>



  <v-row>
   <v-col cols="12" v-if="getZml.login.type=='admin'">
     Since you are admin, you see all the lists..
   </v-col>
   <v-col cols="12">
     <h2> Current List : {{ this.classObj.listname }}</h2>   {{ this.classObj.update_timestamp }}
     - {{ this.classObj.students }} Students
   </v-col>
  </v-row>

  <v-row>
    {{ currentOne }}
   <v-col v-if="showStudentLists" cols="12" sm="12">
    <v-expansion-panels min-width="150"
                       rounded
                       class="ma-2 pa-2 long-line"
                       v-model="currentOne"
                       >
     <v-expansion-panel v-for="i in classList" :key="i.id">
      <v-expansion-panel-header disable-icon-rotate
                               class="no-uppercase "
                               color="deep-purple lighten-5"
                               >
        {{ i.id}} {{ i.listname }}  - (Entries : {{ i.students }})
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
         <v-card class="ma-2 px-3">
           <v-card-title> {{ i.listname }} </v-card-title>
           <v-card-text>
         <v-btn @click="showListData(i.id)"> Select it </v-btn>
        <v-btn class="ma-2" small @click="activateAddStudent(i.id)"> Add Student </v-btn>
        <v-btn class="ma-2" small @click="showListData(i.id)"> Show Students </v-btn>
        <v-btn class="ma-2" small @click="editClassList(i.id)"> Change List Properties </v-btn>
        <v-card class="ma-2 px-3">{{ i.students }} Entries </v-card>
        </v-card-text>
        </v-card>
       </v-col>
       </v-row>
      </v-expansion-panel-content>
     </v-expansion-panel>
    </v-expansion-panels>
   </v-col>

   <v-col cols="12" md="6" v-show="studentClassList.length > 0">
     <v-card color="deep-purple lighten-5">
       <student-list v-if="classObj"
          :tList="studentClassList"
           tHeading="Class List"
          :bHeading="classObj.listname"
          @changes="fixChangesOnSendBack"
       />
      </v-card>
    </v-col>
  </v-row>

<v-dialog v-if="classObj" v-model="showListUpdate"
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
</div>
</template>

<script>
// We need a place where the teachers has access to lists of students.
// want them to create their own lists, and to see typical lists

import ClassListEdit from '@/components/homework/ClassListEdit.vue'
import StudentList from    '@/components/homework/StudentList'
import StudentLookup from '@/components/student/StudentLookup'
import { getters } from "@/api/store";
import { zmlFetch } from '@/api/zmlFetch';
import { zmlConfig } from '@/api/constants';
import StudentSubjectList from '@/components/student/StudentSubjectList'
import { infoSnackbar } from '@/api/GlobalActions';
import BaseToolButton from '@/views/new/base/BaseToolButton.vue'

export default {
    name:"ClassList",
    components:{
        StudentLookup,
        ClassListEdit,
        StudentList,
        StudentSubjectList,
        BaseToolButton
       },
    data: () => ({
        getZml: getters.getState({ object: "gZml" }),
        drawer:false,
        gradeClass:{},
        classList:[],
        classObj:{},
        showListUpdate:false,
        showStudentLists:false,
        insertList:false,
        showStudentLookup:false,
        studentClassList:[],
        studentInfo:'',
        studentInfoShow:false,
        currentOne:null,
    }),
    methods: {
      showListData(listID) {
        this.currentListID = listID
        this.loadListData()
        this.showStudentLists = false
      },
      fixChangesOnSendBack(arrayResults,studentid) {
        console.log('update the current student ', studentid, ' with : ', arrayResults)
        let student = this.studentClassList.find(s => s.studentid == studentid)
        student.jsdoc = {}
        arrayResults.forEach(e => {
          console.log('result is ', student.surname, e.key, e.value, student.jdocstructure)
          student[e.key] = e.value
          student.jsdoc[e.key] = e.value
        })
        console.log('stud jsdoc = ',student)
        let ts = {
           task: 'PlainSql',
           sql: `update hw_classliststudent set jdoc = '${JSON.stringify(student.jsdoc)}' \
                   where id = ${student.id}`,
           api: zmlConfig.apiDKHS
        }
        zmlFetch(ts, this.updateStudentjsDocResult, this.errorLoading)
      },
      updateStudentjsDocResult(result) {
        console.log(result)
      },
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
                           , teacher:this.getZml.login.menemonic || this.getZml.login.username
                           , listname:'Please enter a listname in here!'
                           , share:'N'
                           , jdocstructure:[{"heading":"Test1"},{"heading":'test2'} ]
           }
           this.showListUpdate = true
           this.insertList = true
      },
      editClassList(listID) {
          this.classObj = this.classList.find(ele => ele.id == listID)
          console.log('start editing on ', this.classObj)
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
        ts.sql = `INSERT INTO hw_classliststudent \
                  VALUES(null, ${listid} , ${studentid} , NULL )`
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
      saveClassList(parm) {
        console.log('received and update/save from classlistedit to classlist', parm, this.classObj)
        this.classObj = parm
        if (this.classObj.listname == '' || this.classObj.listname == 'Please enter a listname in here!') {
          infoSnackbar('please enter a BETTER listname!!!')
          return
        }
        this.showListUpdate = false
        let ts = {}
        ts.task = 'PlainSql'
        if (this.insertList) {
            ts.sql = `INSERT INTO hw_classlist VALUES(null, \
               "${this.classObj.teacher}",
               "${this.classObj.listname}",\
               "${this.classObj.share}",
               '${JSON.stringify(this.classObj.jdocstructure)},null, null)`
        } else {
          console.log(JSON.stringify(this.classObj.jdocstructure))
            ts.sql = `UPDATE hw_classlist SET\
                        listname = "${this.classObj.listname}" ,\
                        share = "${this.classObj.share}",\
                        jdocstructure = '${JSON.stringify(this.classObj.jdocstructure)}' \
                      WHERE id = ${this.classObj.id}`
        }
        ts.api = zmlConfig.apiDKHS
        zmlFetch(ts, this.loadData, this.errorLoading);
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
        ts.sql = `SELECT s.surname, s.firstname, concat(s.grade, s.gclass) grade, l.jdoc, l.studentid, c.jdocstructure,l.id  \
                   FROM hw_classliststudent l, dkhs_student s, hw_classlist c\
                  WHERE l.studentid = s.studentid \
                    AND l.classlistid = c.id \
                    AND l.classlistid = ${this.currentListID} \
                  ORDER BY s.surname, s.firstname`
        ts.api = zmlConfig.apiDKHS
        zmlFetch(ts, this.displayListData, this.errorLoading);
      },
      displayListData(response) {
        this.studentClassList = response
        this.studentClassList.forEach(e => {
          if (!e.jdoc) {
            e.jdoc = JSON.parse(e.jdocstructure)
            //Object.entries(e.jdoc).forEach(([key, value]) => e[key] = value)
            for (let i=0; i < e.jdoc.length; i++) {
              // console.log('e.jdoc[i]', e.jdoc[i].heading )
              e[e.jdoc[i].heading] = ''
            }
          } else {
            //the structure has been filled aready -
            e.jdoc = JSON.parse(e.jdoc)
            Object.entries(e.jdoc).forEach(([key, value]) => e[key] = value)
          }
          console.log('student classlist after jdoc parsed', e.jdoc)
          // New one, assign values
          //e.jdoc = '' maybe clear it?
        })
        console.log('classlist after', this.studentClassList)
      },
      loadData() {
        let ts = {}
        ts.task = 'PlainSql'
        //let teacher = !this.getZml.login.menemonic ? this.getZml.login.username : this.getZml.login.menemonic
        let teacher = this.getZml.login.menemonic ?? this.getZml.login.username
        let where = `  where teacher = 'ADMIN' or teacher = '${teacher}'`
        if (this.getZml.login.username == 'werner') {
          //show all the list if we login as werner
          where = ''
        }
        ts.sql = `SELECT c.id, c.teacher, c.listname, c.share, c.jdocstructure \
                       , create_timestamp, update_timestamp \
                       , count(s.classlistid) students \
                   FROM hw_classlist c \
                   left join hw_classliststudent s on s.classlistid = c.id \
                   ${where}
                   group by s.classlistid`
        ts.api = zmlConfig.apiDKHS
        zmlFetch(ts, this.showData, this.errorLoading);
      },
      showData(payload) {
         this.classList = []
         if (payload.error && payload.error.substr(0, 7) == 'no rows') {
             return
         }
         this.classList = payload
         this.classList.forEach(e => {
           e.jdocstructure = JSON.parse(e.jdocstructure)
         })
         console.log('loaded classlists :', this.classList)
      },
      errorLoading(response) {
        alert('We had an error loading your data!' + response)
        console.error('We had an error loading your data!' , response)
      }
    },
    mounted() {
      console.log('start : ', this.$options.name)
      this.loadData();

    },
    watch: {
      currentOne(a,b) {
        console.log('currentone changed ', a,b)
        this.currentListID = null
        this.studentClassList.length = 0
      }
    }
}
</script>
