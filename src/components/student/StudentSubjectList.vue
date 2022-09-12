<template>
<v-container grid-list-lg v-if="subjectList.length" >
   <!-- <v-card v-if="subjectList.length" xmax-width="500" class="mx-auto" :color="color" elevation="2">
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
    </v-card> -->

      <v-layout row wrap>
        <v-flex v-for="s in subjectList" :key="s.studsubid" xs12 sm6 md6 lg6>
          <v-card>
            <!--v-img src="img/logo.png" height="260px "></v-img-->
            <v-img class="float-right" width="100px" src="/img/logo.png" />

            <v-card-title primary-title class='blue--text wordbreak'>
              {{s.subjectname}}
            </v-card-title>
            <v-card-subtitle>
              {{s.teachersurname}}, {{s.teacherinitial}}
            </v-card-subtitle>
            <v-card-text class='body-2'>
              We can place the next examdate and venue here..or some other note
              <!-- {{ s.ckey }} -->
                <!-- Next Exam : {{s.examdate}} -->
              <!-- M.S at {{teacher.ms}} <br> M.S.C at {{teacher.msc}} -->
            </v-card-text>

            <v-card-actions>
              <v-btn x-small outlined color='blue'
                     @click="showTeacher(`${s.teachersurname}, ${s.teacherinitial}`)"
                     :title="`Show ${s.teachersurname}, ${s.teacherinitial}`">
                More...
              </v-btn>
              <v-spacer></v-spacer>
              <v-btn x-small outlined color='green'>
                Appointments
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-flex>
      </v-layout>
 </v-container>
</template>

<script>
import { zmlConfig } from '@/api/constants';
import { zmlFetch } from '@/api/zmlFetch';
//import PersonelNameCardDemo from '@/components/staff/PersonelNameCardDemo.vue'
export default {
    name:"StudentSubjectCard",
    props: ['studentid', 'color'],
    //components: {PersonelNameCardDemo},
    data: () => ({
     subjectList:{},
    }),
    methods:{
      showTeacher(surnameAndInit) {
        console.log('pushing for ', surnameAndInit)
        this.$router.push({ name: 'PersonelCard', params: {persName: surnameAndInit, editmode: false} })
      },
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

<style scoped>
.wordbreak {
  overflow-wrap: break-word;
  word-wrap: break-word;
  word-break: break-all;
  word-break: break-word;
  hyphens: auto;
}
</style>