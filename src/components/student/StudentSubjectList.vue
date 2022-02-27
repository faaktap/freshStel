<template>
   <v-card v-if="subjectList.length" xmax-width="500" class="mx-auto" :color="color" elevation="2">
       <v-card-title class="headline ma-1"> Subjects </v-card-title>
       <div v-for="s in subjectList" :key="s.studsubid" class="ma-2">
        <v-card class="pa-2 ml-1 mr-2" :xcolor="color">
         {{ s.subjectname }}
         <div class="float-right">
           {{ s.teachersurname }},
           {{ s.teacherinitial }}
         </div>
        </v-card>
       </div>
       <v-card-text>
       </v-card-text>
    </v-card>
    <v-card v-else>
        We could not find any subjects for {{ this.studentid }}
    </v-card>
</template>

<script>
import { zmlConfig } from '@/api/constants';
import { zmlFetch } from '@/api/zmlFetch';
export default {
    name:"StudentSubjectCard",
    props: ['studentid', 'color'],
    data: () => ({
     subjectList:{},
    }),
    methods:{
        loadStudentSubject() {
            this.subjectList.length = 0
            if (this.studentid) {
               let ts = {}
               ts.task = 'PlainSql'
               ts.sql = "select *  from dkhs_studsub where studentid = " + this.studentid
               ts.api = zmlConfig.apiDKHS
               zmlFetch(ts, this.assignData);
            }
        },
        assignData(response){
            this.subjectList = response
        }
    },
    mounted: function() {
        if (this.studentid) {
           this.loadStudentSubject()
        } else {
           this.subjectList.length = 0
        }
    },
    watch: {
        studentid(n,o) {
            if (n != o) this.loadStudentSubject()
        }
    }
}
</script>