<template>
<v-container grid-list-lg v-if="subjectList.length" >

  <v-dialog max-width="400" v-model="showPers" scrollable>
  <personel-name-card-demo :initial="initial" :surname="surname" />
  </v-dialog>

   <v-toolbar dense row>
    <v-toolbar-title>
      <span class="d-none d-sm-block"> Student Subjects </span>
    </v-toolbar-title>
    <v-overlay v-if="loading" :value="loading">
      <v-progress-circular indeterminate size="84">
        Thinking ...
      </v-progress-circular>
    </v-overlay>
    <v-spacer />
     <v-btn class="ma-2" small icon @click="showAs='list'" title="View as list"> <v-icon>mdi-view-list</v-icon> </v-btn>
     <v-btn class="ma-2" small icon @click="showAs='card'" title="View as cards"> <v-icon>mdi-id-card</v-icon> </v-btn>
   </v-toolbar>

     <v-layout row wrap v-if="showAs == 'card'">
        <v-flex v-for="s in subjectList" :key="s.studsubid" xs12 sm6 md6 lg6>
          <v-card>
            <!--v-img src="img/logo.png" height="260px "></v-img-->
            <!-- <v-img class="float-right" width="100px" src="/img/logo.png" /> -->
            <v-card class="float-right ma-2" height="50" width="50"
                    @click="showIt(s.teachersurname, s.teacherinitial)" >
             <z-show name="persphoto"
                    :id="lookupPersid(s.teachersurname, s.teacherinitial)" />
            </v-card>

            <v-card-title primary-title class='blue--text wordbreak'>
              {{s.subjectname}}
            </v-card-title>
            <v-card-subtitle>
              {{s.teachersurname}}, {{s.teacherinitial}}
            </v-card-subtitle>
            <v-card-text class='body-2'>
              <span v-if="s.examdate"> ExamDate : {{ s.examdate }}<br>
                {{ s.subexam }}, {{ s.menemonic }}, venue: {{ s.venue }} </span>
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
      <v-simple-table v-if="showAs=='list'">
      <thead>
        <tr><th>teacher</th><th>subjectname</th><th>ckey</th><th>subjectid</th></tr>
      </thead>
      <tbody>
      <tr v-for="s in subjectList" :key="s.studsubid" xs12 sm6 md6 lg6>
        <td> {{ s.teachersurname}}, {{s.teacherinitial}}</td>
        <td> {{s.subjectname}}</td>
        <td> {{ s.ckey }}</td>
        <td> {{ s.subjectid }}</td>
      </tr>
      </tbody>
     </v-simple-table>
      <!-- {{ lookupPersid('smit','w') }} -->
 </v-container>
</template>

<script>
import { getters } from "@/api/store";
import { zmlConfig } from '@/api/constants';
import { zmlFetch } from '@/api/zmlFetch';
//import { finder } from '@/api/finder.js';
import ZShow from '@/components/base/ZShow.vue'
import PersonelNameCardDemo from '@/components/staff/PersonelNameCardDemo.vue'
export default {
    name:"StudentSubjectCard",
    props: ['studentid', 'color'],
    components: {
      PersonelNameCardDemo,
      ZShow
    },
    data: () => ({
      subjectList:{},
      persMenemonic: getters.getState({ object: "gZml" }).persMenemonic,
      loading: false,
      showAs: 'list',
      surname: '',
      initial: '',
      showPers:false
    }),
    computed: {
    },
    methods:{
      showIt(surname,initial) {
         this.showPers = true
         this.surname = surname
         this.initial = initial
      },
      lookupPersid(surname, initial) {
          let idx = this.persMenemonic.findIndex(e => {
              //console.log(e.surname.toLowerCase() , surname.toLowerCase() , e.name.substr(0,1).toLowerCase(), initial.toLowerCase())
              return e.surname.toLowerCase() == surname.toLowerCase() && e.name.substr(0,1).toLowerCase() == initial.toLowerCase()
          })
          if (idx > -1) {
            return this.persMenemonic[idx].persid
          } else {
            return this.persMenemonic[1].persid
          }
      },
      showTeacher(surnameAndInit) {
        console.log('pushing for ', surnameAndInit)
        this.$router.push({ name: 'PersonelCard', params: {persName: surnameAndInit, editmode: false} })
      },
      loadStudentSubject() {
            this.subjectList.length = 0
            if (this.studentid) {
               this.loading = true
               let ts = {}
               ts.task = 'PlainSql'
               ts.sql = `select ss.studentid,ss.ckey, ss.subjectname , ss.hodsubjectid, ss.menemonic, g.subjectname subexam , g.venue, g.examdate, g.teacher
               , ss.teacherinitial, ss.teachersurname
      from dkhs_studsub ss
      left join dkhs_student s on s.studentid = ss.studentid
      left join dkhs_subjectgroup g on s.grade = g.grade and concat(ss.subjectname,'.',ckey) = g.subjectname
        and ss.teacher = g.teacher
      where ss.studentid = ${this.studentid}`
               ts.api = zmlConfig.apiDKHS
               zmlFetch(ts, this.assignData);
            }
      },
      assignData(response){
        this.subjectList = response
        this.loading = false
      },
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