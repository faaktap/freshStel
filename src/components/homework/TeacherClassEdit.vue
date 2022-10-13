<template>
<v-container fluid>
   <base-title-expand color="white" heading="CLASS LISTS">
   <p>
    Na ek die attendance program vir die hoveelste keer oorgeskryf het, het ek Reinette se eksamenlyste gedoen, en besef hierdie
    klas lyste kan vir attendance gebruik word!
    <br>Maar die goed verval aan die einde van die jaar, so ek het besluit terwyl ons nou in 'n "state of flux" is aan begin van die jaar, gaan ek die
    onderwysers toelaat om self klaslyste in te sleutel. Sodra ek dan lyste van Heidi kry, kan ek dit korrigeer.
    <br>
    </p>
  </base-title-expand>
   <v-toolbar  dense  dark row  wrap color="primary">
      List created for : <span v-if="'teacher' in listInfo"> {{listInfo.teacher }}, {{listInfo.listname }} </span>
     <v-spacer></v-spacer>
     <v-btn class="ma-2" small icon @click="showAs='list'" title="View as list"> <v-icon>mdi-view-list</v-icon> </v-btn>
     <v-btn class="ma-2" small icon @click="showAs='card'" title="View as cards"> <v-icon>mdi-id-card</v-icon> </v-btn>
     <v-btn class="ma-2" small icon @click="showAdd=true" title="Add a Student"> <v-icon>mdi-database-plus</v-icon> </v-btn>
     <v-btn class="ma-2" small icon @click="showResult = !showResult" title="Export data" > <v-icon> mdi-database-export</v-icon> </v-btn>
     <v-btn class="ma-2" icon @click="getStudents" title="Refresh list"> <v-icon>mdi-refresh</v-icon> </v-btn>
     <v-back />
   </v-toolbar>
 <v-card class="mx-auto"
         elevation="2"
         loading="!loading"
  >
   <!-- <v-card-title class="headline ma-1"> Teacher Class List   </v-card-title> -->
   <v-card-text v-if="studentList">
     <!-- <v-data-table
         :headers="listHeader"
         :items="studentList"
         :items-per-page="5"
         class="elevation-1"
         @click:row="clickOnRow"
     /> -->

     <v-layout row wrap justify-space-between v-if="showAs=='card'">
      <v-card v-for="sl in studentList" :key="sl.studentid" class="ma-2">
        <v-card-title>
          {{ sl.surname }}
        </v-card-title>
        <v-card-text>
         {{ sl.firstname }}
         <span class="caption-text">{{ sl.grade }} {{ sl.gclass }}</span>
        </v-card-text>
         <v-card-actions>
         <v-btn x-small @click="remove(sl.studentid)" title="Remove from list" color="primary" class="ma-2"> <v-icon small> mdi-database-minus </v-icon> Delete </v-btn>
         </v-card-actions>
      </v-card>
     </v-layout>


     <v-simple-table v-if="showAs=='list'">
      <tbody>
      <tr v-for="sl in studentList" :key="sl.studentid">
        <td> {{ sl.studentid }}</td>
        <td> {{ sl.surname }}</td>
        <td> {{ sl.firstname }}</td>
        <td> {{ sl.grade }}, {{ sl.gclass }}</td>
      </tr>
      </tbody>
     </v-simple-table>
   </v-card-text>
   <v-card-text v-else>
      Oops - no students found for this list : {{ listID }}
   </v-card-text>
   <v-card-actions v-if="studentList">

   </v-card-actions>
    <v-dialog v-model="showResult" fullscreen>
     <v-card color="red" v-if="showResult && studentList">
      <front-json-to-csv :json-data="studentList"
                         :csv-title="`Student List ${listName}`"
                         @hideModal="showResult = false">
      </front-json-to-csv>
     </v-card>
    </v-dialog>

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
     </v-card>
     </v-card-text>
    </v-card>
</v-dialog>

    <!-- {{ studentList }} -->
 </v-card>
</v-container>
</template>
<script>
import { zmlFetch } from "@/api/zmlFetch";
import { getters } from "@/api/store";
import { clWork } from "@/components/homework/ClassListWork.js"
import BaseTitleExpand from '@/components/base/BaseTitleExpand.vue'
import StudentLookup from '@/components/student/StudentLookup.vue'
import FrontJsonToCsv from '@/api/csv/FrontJsonToCsv.vue'
import VBack from '@/components/base/VBack.vue'
export default {
    name:"TeacherClassEdit",
    props: ['listID'],
    components: {FrontJsonToCsv, VBack, StudentLookup, BaseTitleExpand},
    data: () => ({
      getZml: getters.getState({ object: "gZml" }) ,
      listHeader:[ {value: 'studentid', text:'admin no'}
                  ,{value: 'surname', text: 'Surname'}
                  ,{value: 'firstname', text: 'Firstname'}
                  ,{value: 'grade', text: 'Grade'}
                  ,{value: 'gclass', text: 'Class'}
                  ],
      studentList:null,
      showResult:false,
      listInfo: [],
      showAdd: false,
      stud: [],
      showAs: "card",
      deleteList: "",
      loading: false
    }),
    methods:{
      clickOnRow(e) {
        console.log('clicked on a student row',e)
      },
      remove(sid) {
        let idx = this.studentList.findIndex(e => e.studentid == sid)
        if (idx > -1) {
          this.studentList.splice (idx, 1)
          clWork.deleteStudentFromList(this.listID, sid)
        }

      },
      getStudents() {
        if (this.listID) {
           this.loading = true
           let sn = { task: 'plainSql'
                    , sql:`select * from  hw_classlist \
                          where id = ${this.listID}`
                   }
           zmlFetch(sn, this.processListDetail)
           let sl = { task: 'plainSql'
                    , sql:`select l.studentid,s.*   \
                          from dkhs_student s, hw_classliststudent l \
                          where l.classlistid = ${this.listID} \
                           and l.studentid = s.studentid
                           order by s.surname, s.firstname, s.studentid`
                   }
           zmlFetch(sl, this.processAfterFetch);
        }
      },
      processListDetail(response) {
        this.listInfo = response[0]
      },
      processAfterFetch(response) {
        if (!response.error) {
           this.studentList= response
        } else {
            this.studentList = []
        }
        this.loading = false
      },
      handCapture(studentReceived) {
        this.stud = studentReceived
      },
      addStudent() {
        clWork.addToList(this.listID, this.stud.data.studentid)
        this.showAdd = false
      }
    },
    mounted() {
        console.log(this.$options.name,  this.listID)
        if (this.listID) {
           this.getStudents()
        }
    },
    watch: {
        listID(n,o) {
            if (n != o) this.getStudents()
        }
    }
}
</script>