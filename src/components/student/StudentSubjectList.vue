<template>
  <v-container v-if="studentList">
   <v-card v-if="subjectList" max-width="500" class="mx-auto pb-2" color="green darken-1">
       <v-card-title class="headline ma-1"> Subjects and Teachers </v-card-title>
       <div v-for="s in subjectList" :key="s.studsubid">
        <v-card class="pa-2 ml-1 mr-2">
         {{ s.subjectname }} 
         <div class="float-right">
           {{ s.teachersurname }},
           {{ s.teacherinitial }}
         </div>
        </v-card>
       </div>
    </v-card>
  </v-container>   
</template>

<script>
import { zmlConfig } from '@/api/constants';
import { zmlFetch } from '@/api/zmlFetch';
export default {
    name:"StudentSubjectCard",
    props: ['studentList'],
    data: () => ({
     subjectList:{},
    }),
    methods:{
        loadStudentSubject() {
            let ts = {}
            ts.task = 'PlainSql'
            ts.sql = "select * "
                   + " from dkhs_studsub where studentid = " + this.studentList.data.studentid
            ts.api = zmlConfig.apiDKHS
            zmlFetch(ts, this.assignData);
        },
        assignData(response){
            this.subjectList = response
        }
    },
    mounted: function() {
        console.log('SSC : Mounted')
        if (this.studentList && this.studentList.data.studentid) {   
           console.log('SNC : ', this.studentList.data.studentid)
           this.loadStudentSubject()
        }
    }
}
</script>