<template>
<div>
<v-container fluid v-if="['admin','teacher'].includes(getZml.login.type) == false">
    You are not logged in, or you are not a teacher!
</v-container>

<v-container v-else fluid>
  {{ classObj}}
 <v-toolbar  dense  row  wrap :xxcollapse="$vuetify.breakpoint.smAndDown">
    <v-app-bar-nav-icon  v-if="$vuetify.breakpoint.smAndDown" @click.stop="drawer = !drawer">
    </v-app-bar-nav-icon>
    <v-navigation-drawer v-model="drawer" absolute temporary ></v-navigation-drawer>
    <v-spacer></v-spacer>
      <base-tool-button class="mr-2" icon="mdi-view-list"
        :color="showStudentLists ? 'green' : 'blue'"
        @click="showStudentLists = !showStudentLists">
        Student List
      </base-tool-button>
      <base-tool-button class="mr-2" icon="mdi-view-list"
        @click="createClassList">
        Create a New Student List
      </base-tool-button>
      <base-tool-button class="mr-2" icon="mdi-format-list-checkbox">
        Change List Properties
      </base-tool-button>
      <base-tool-button @click="showListData()" class="mr-2" icon="mdi-school">
       Show Students {{ showStudentLists }}
      </base-tool-button>

      <base-tool-button
              @click="showStudentLookup = !showStudentLookup"
              class="mr-2" icon="mdi-database-edit">
       Add Students to List
      </base-tool-button>

  </v-toolbar>

<br>
<v-row>
 <v-col cols="6">
  <student-lookup v-if="showStudentLookup"
                       @dataEntered="studentFound"
                       @idsEntered="IDs"
                       :searchMore="true" />
 </v-col>
</v-row>

  <v-row>
   <v-col cols="12" v-if="getZml.login.type=='admin'">
     Since you are admin, you see all the lists..
   </v-col>
   <v-col cols="12">
     <h2> Current List : {{ this.classObj.listname }}</h2>
     Date: {{ classObj.update_timestamp }}
     - {{ classObj.students }} Students
   </v-col>
  </v-row>

  <v-row>

   <v-col v-if="showStudentLists" cols="12">
    this is showStudentsList : There are to many information in this component.
    We need to split it.
     <v-data-table
     :items="classList"
     :headers="classListHeader"
     >
     <template v-slot:[`footer.page-text`]>
                   <v-btn icon @click="createClassList()"><v-icon >mdi-table-plus</v-icon></v-btn>
     </template>
     <template v-slot:[`item.actions`]="{ item }">
        <v-icon small class="mr-2" @click="editClassList(item)">mdi-pencil</v-icon>
        <v-icon small class="mr-2" @click="selectClassList(item)">mdi-select</v-icon>
     </template>
     </v-data-table>



        <!-- <v-btn class="ma-2" small @click="activateAddStudent(i.id)"> Add Student </v-btn>
        <v-btn class="ma-2" small @click="showListData(i.id)"> Show Students </v-btn>
        <v-btn class="ma-2" small @click="editClassList(i.id)"> Change List Properties </v-btn> -->

   </v-col>

   <v-col cols="12" v-show="studentClassList.length > 0">
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
import StudentSubjectList from '@/components/student/StudentSubjectList'
import BaseToolButton from '@/views/new/base/BaseToolButton.vue'

import { getters } from "@/api/store";
import { zmlFetch } from '@/api/zmlFetch';
import { zmlConfig } from '@/api/constants';
import { infoSnackbar } from '@/api/GlobalActions';

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
        classListHeader:[{text:'id', value:'id'},
                         {text:'teacher', value:'teacher'},
                         {text:'listname', value:'listname'},
                         {text:'students', value:'students'},
                         {text:'share', value:'share'},
                         {text:'actions', value:'actions'},
        ],
        classObj:{},
        showListUpdate:false,
        showStudentLists:false,
        insertList:false,
        showStudentLookup:false,
        studentClassList:[],
        studentInfo:'',
        studentInfoShow:false,
        //currentOne:null,
    }),
    methods: {
      selectClassList(e) {
        console.log(e)
        this.classObj = e
        this.showListData()
      },
      showListData() {
        if (this.classObj.id) {
            this.loadListData()
            //this.showStudentLists = false
            this.showStudentLists = true
        } else {
          alert('we have no classObj')
        }
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
           sql: `update hw_classliststudent set jdoc = '${JSON.stringify(student.jsdoc)}' /
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
      },
      studentFound(value) {
         if (value.data == 'undefined') return;
         this.saveStudentinList(value.data.studentid, this.classObj.id)
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
      editClassList(item) {
        let listID = item.id
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
        if (this.classObj.id < 1) {
          alert('we only load data if we have alist nuber')
          return
        }
        //Loading classObj for listheading display
        //We dont need this anymore, since we clicked on it.
        //this.classObj = this.classList.find(ele => ele.id == this.currentOne.id)
        this.studentClassList.length = 0
        let ts = {}
        ts.task = 'PlainSql'
        ts.sql = `\
SELECT s.surname, s.firstname, concat(s.grade, s.gclass) grade, l.jdoc, l.studentid, c.jdocstructure,l.id \
 FROM hw_classliststudent l, dkhs_student s, hw_classlist c \
 WHERE l.studentid = s.studentid \
   AND l.classlistid = c.id \
   AND l.classlistid = ${this.classObj.id} \
 ORDER BY s.surname, s.firstname`
        ts.api = zmlConfig.apiDKHS
        zmlFetch(ts, this.displayListData, this.errorLoading);
      },
      displayListData(response) {
        this.studentClassList = response
        if (!this.studentClassList.length) {
          //We have a problem iterating thru classlist
          console.log('PROBLEM WITH CLASSLIST',response)
        }
        this.studentClassList.forEach(e => {
          if (!e.jdoc) {
            try {
             e.jdoc = JSON.parse(e.jdocstructure)
            }
            catch (err) {
             console.log('error parsing JSON (displayListData:1) :', err)
            }

            //Object.entries(e.jdoc).forEach(([key, value]) => e[key] = value)
            for (let i=0; i < e.jdoc.length; i++) {
              // console.log('e.jdoc[i]', e.jdoc[i].heading )
              e[e.jdoc[i].heading] = ''
            }
          } else {
            //the structure has been filled aready -
            try { e.jdoc = JSON.parse(e.jdoc) }
            catch (err) {console.log('error parsing JSON (displayListData:2) :', err)}
            Object.entries(e.jdoc).forEach( ([key, value]) => e[key] = value)
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
        ts.sql = `\
SELECT c.id, c.teacher, c.listname, c.share, c.jdocstructure \
 , create_timestamp, update_timestamp \
 , count(s.classlistid) students \
 FROM hw_classlist c \
 LEFT JOIN hw_classliststudent s on s.classlistid = c.id \
 ${where} group by s.classlistid`
        ts.api = zmlConfig.apiDKHS
        zmlFetch(ts, this.showData, this.errorLoading);
      },
      showData(payload) {
         this.classList = []
         if (payload.error && payload.error.substr(0, 7) == 'no rows') {
             return
         }
         this.classList = payload
         console.log('xxxxxxxxxx', payload)
         this.classList.forEach(e => {
          try {
           e.jdocstructure = JSON.parse(e.jdocstructure)
          }
          catch (err) {
             console.log('error parsing JSON(CL:loadData) :', err)
          }
         })
         console.log('loaded classlists :', this.classList)
      },
      errorLoading(response) {
        alert('We had an error loading your data!' + response)
        console.error('We had an error loading your data!' , response)
      }
    },
    created() {
      console.log('MC:', this.$options.name)
      this.loadData();
    },
    mounted() {
    },
    watch: {
      showStudentLists() {
        if (this.showStudentLists == false && this.classObj.id) {
            //Show the list of students...
        }
      }
    }
}
</script>
