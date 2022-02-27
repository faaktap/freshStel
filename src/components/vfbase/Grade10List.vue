<template>

<div>
<v-container fluid v-if="['admin','teacher'].includes(getZml.login.type) == false">
    You are not logged in, or you are not a teacher!
</v-container>

<v-container v-else fluid>
  <v-row>
  <v-col cols="12" v-if="studentListFilter.length">
   <v-card color="blue lighten-2" class="ma-2">
    <v-card-title>
     <hr>
     <div class="heading text-center">{{ classListHeader }}</div>
    </v-card-title>
    <v-card-text>
      <v-row>
          <v-col cols="12">
              <v-text-field outlined filled v-model="studentListSearch" label="Search by Surname" />
          </v-col>
        <v-col cols="6" md="4" lg="3"
               v-for="(s,index) in studentListFilter"
              :key="s.schoolno">
          <v-card class="ma-1 pl-2"
                 @click="showStudent(index)">
           {{ index+1 }} {{ s.surname }}, {{ s.name}}
            <v-card class="ma-2 pa-2" xxcolor="green lighten-2">
                {{ s.email }}
            </v-card>
          </v-card>


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
</div>
</template>

<script>
import { getters } from "@/api/store"
import StudentNameCard from '@/components/student/StudentNameCard.vue'
import FrontJsonToCsv from '@/api/csv/FrontJsonToCsv.vue'
import zmlCloseButton from '@/components/zmlCloseButton.vue'
import { g10 } from '../../components/vfbase/Grade10List.js';

export default {
    name:"Grade10List",
    components:{
        FrontJsonToCsv
       ,zmlCloseButton
       ,StudentNameCard
       },
    data: () => ({
        getZml: getters.getState({ object: "gZml" }),
        studentList:[],
        singleStudent:{data:''},
        showStudentCard:null,
        hover:null,
        hoverStart:null,
        showListPrint:false,
        classListHeader:'',
        studentListSearch:'',
    }),
    computed:{
        studentListFilter() {
            if (!this.studentListSearch) return this.studentList
            return this.studentList.filter(e => e.surname.toLowerCase().includes(this.studentListSearch.toLowerCase()) )
        },
    },
    methods:{
      classListLoad() {
         g10.getAllQuiz('all',this.loadData)
      },
      loadData(response) {
        if (response == "[null]") {
          alert('No Data Yet!')
          return
        }
        this.classListHeader = "Student List for Grade 10's in 2022"
        this.studentList.length = 0
        this.studentList = JSON.parse( response )
      },
      loadError(error) {
        alert('S.C.A.' + error)
      },
      showStudent(idx) {
        this.singleStudent.data = this.studentListFilter[idx]
        this.singleStudent.data.studentid = this.studentListFilter[idx].schoolno
        this.showStudentCard = true
      }
    },
    mounted() {
        console.log('start : ', this.$options.name)
        this.classListLoad()
    },
}
</script>