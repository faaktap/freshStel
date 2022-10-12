<template>
<v-container fluid>
  <v-toolbar  dense  row  wrap color="primary">
      Student/Class Lists
     <v-spacer></v-spacer>
      <base-tool-button class="mr-2" icon="mdi-seat-legroom-reduced"
                         @click="toggleDisplay=0"
                         title="Select a grade below"
                         :color="toggleDisplay==0 ? 'green' : 'primary'">
        Class/Grade Lists
      </base-tool-button>
      <base-tool-button class="mr-2" icon="mdi-home-circle"
                         @click="toggleDisplay=2"
                         :color="toggleDisplay==2 ? 'green' : 'primary'">
        Teacher Lists <span v-if="toggleDisplay==2"> ** </span>
      </base-tool-button>
      <!-- <base-tool-button class="mr-2" icon="mdi-format-list-checkbox">
        Your Own Lists
      </base-tool-button> -->
      <base-tool-button class="mr-2" icon="mdi-school"
                       @click="toggleDisplay=1"
                       :color="toggleDisplay==1 ? 'green' : 'primary'">
        Grade 10 Subject Selections <span v-if="toggleDisplay==1"> ** </span>
      </base-tool-button>
      <!-- <base-tool-button class="mr-2" icon="mdi-brain">
        Werner Test
      </base-tool-button> -->
     <!-- </v-btn-toggle> -->
     <v-back />
  </v-toolbar>


<!-- THIS IS TEACHERS OWN LISTS -->
<v-container v-if="toggleDisplay == 2" fluid>
<teacher-class-list />
</v-container>

<!-- THIS IS NORMAL G10A2 or G12A1 lists -->
<v-container v-if="toggleDisplay == 0" fluid>
     <student-class title="dkhs" />
</v-container>

<!-- THIS IS GRADE 10 SUBJECT SELECTION LIST -->
 <v-container v-if="toggleDisplay == 1" fluid>
 <v-row>
  <v-col cols="12">
     <grade-10-list title="Grade 10 Subject selection for 2023" />
  </v-col>
 </v-row>
 </v-container>

</v-container>
</template>

<script>

// We need a place where the teachers has access to lists of students.
// want them to create their own lists, and to see typical lists
import { getters } from "@/api/store";
import { ls } from "@/api/localStorage.js"

import BaseToolButton from '@/views/new/base/BaseToolButton.vue'
import StudentClass from '@/components/student/StudentClass.vue'
import TeacherClassList from '@/components/student/TeacherClassList.vue'
//import { infoSnackbar } from '@/api/GlobalActions';
import Grade10List from '../../components/vfbase/Grade10List.vue';
import VBack from '@/components/base/VBack.vue'

export default {
    name:"MainStudentClassList",
    components:{
        StudentClass,
        Grade10List,
        BaseToolButton,
        VBack,
        TeacherClassList
       },
    data: () => ({
        getZml: getters.getState({ object: "gZml" }),
        drawer:false,
        //gradeClass:{},
        classList:[],
        classObj:{},
        showListUpdate:false,
        insertList:false,
        showStudentLookup:false,
        studentClassList:[],
        currentOne:null,
        toggleDisplay:0
    }),
    methods:{},
    mounted() {
      //this.loadData();
      //Check what was last toggleDisplay, and set it again
      this.toggleDisplay = ls.load('teacherToggleDisplay')
      console.log('this.toggleDispla' , this.toggleDisplay)

    },
    watch: {
      currentOne() {
        this.currentListID = null
        this.studentClassList.length = 0
      },
      toggleDisplay() {
        ls.save('teacherToggleDisplay', this.toggleDisplay)
      }
    }

}
</script>
