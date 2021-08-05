<template>
<div>
<v-toolbar color="primary">
    <v-card color="primary" width="100%" class="pa-3">
    <div class="float-left">
         AVAILABLE OPTIONS FOR
    </div>
    <div class="float-right">
         {{ getZml.login.fullname}} / G{{ getZml.login.grade }}{{ getZml.login.gclass }}
    </div>
    </v-card>
</v-toolbar>
<v-row> 
 <v-col cols="12">
  <v-expansion-panels v-if="getZml.login.isAuthenticated">
    <v-expansion-panel>
     <v-expansion-panel-header expand-icon="mdi-calendar" 
        title="A calendar for your current day. If you notice the day is wrong, please inform Werner or ms. Wiegand">
        Calendar - ({{ gradeToShow.g }} {{ gradeToShow.c }} / {{ weekOrDay }})
     </v-expansion-panel-header>
    <v-expansion-panel-content>
      <calendar-student v-if="gradeToShow.c" v-show="showCal" 
               :weekOrDay="weekOrDay" 
               :studentGradeClass="gradeToShow.g +  gradeToShow.c" />
    </v-expansion-panel-content>
    </v-expansion-panel>
    <v-expansion-panel>
        <v-expansion-panel-header
          title="A list of all the places you can go to on this webpage.">
          Functions
        </v-expansion-panel-header>
        <v-expansion-panel-content>
           <menu-list :list="getZml.functions" displayType="2" />      
        </v-expansion-panel-content>
    </v-expansion-panel>
    <v-expansion-panel>
        <v-expansion-panel-header
          title="A list of all the places you can go to on this webpage, presented in a different way.">
            Functions Same
        </v-expansion-panel-header>
        <v-expansion-panel-content>
            <menu-list :list="menuFilterList" displayType="1" /> 
        </v-expansion-panel-content>
    </v-expansion-panel>
  </v-expansion-panels>
</v-col>
<v-col cols="12">
    <student-subject-list :studentid="studentList.data.studentid" color="primary" />
    <student-email-list :studentid="studentList.data.studentid" color="primary" />
    
</v-col>
<!--
{ "functionid": "2", "sortorder": "50"
, "functionname": "Display Student Content"
, "shortname": "Teach"
, "payload": "/sh"
, "functiontype": "local"
, "functionaccess": "student"
, "tip": "Select a grade and subject, and display content for students.."
, "grade": null
, "icon": "mdi-school"
, "description": null}
{ "functionid": "10", "sortorder": "55", "functionname": "RCL Campaigns", "shortname": "Sign Up", "payload": "/campaigns", "functiontype": "local", "functionaccess": "student", "tip": "DKHS Candidates Register and Voting System", "grade": null, "icon": "mdi-vote", "description": "De Kuilen Candidates Register and Voting System", "create_timestamp": "2021-03-01 15:24:45", "update_timestamp": "2021-03-18 15:49:57" }
    -->
|</v-row> 

 <!--student-name-card :studentList="studentList"  maybe add the current student namecard here.. -->
 
    <div v-if="getZml.login.isAuthenticated && getZml.login.username=='werner'">
        <v-btn to="/viewfunctions"> functions </v-btn>
        <v-btn to="/dkhsawards"> awards </v-btn>
        <email-list />
    </div>
</div>
</template>

<script>
import { zmlConfig } from '@/api/constants';
import { zmlFetch } from '@/api/zmlFetch.js';
import { doStuff } from '@/api/buttons'
import { util } from '@/api/util'
import { infoSnackbar } from '@/api/GlobalActions';
import { getters } from "@/api/store";
import EmailList from '@/components/EmailList';
import MenuList from '@/components/MenuList';
import CalendarStudent from '@/components/CalendarStudent';
import StudentEmailList from '@/components/student/StudentEmailList'
import StudentSubjectList from '@/components/student/StudentSubjectList'
export default {
    name:"StudentHome",
    components:{
          EmailList
        , MenuList
        , CalendarStudent
        , StudentEmailList
        , StudentSubjectList
        //, StudentGrade
     },
    data: () => ({
        getZml: getters.getState({ object: "gZml" }),
         showCal:true,        
         cards: ['Today', 'Yesterday'],
         gradeToShow:{g:'', c:''},
         weekOrDay:"day",
         studentList:{ data: { studentid: '' }}
    }),
    computed:{
       menuFilterList() {
            if (!this.getZml) return 0;
            return this.getZml.functions.filter(a => function()
            {
                if (a.accesstype == this.getZml.login.type)
                    return 1
                else
                    return 0

                }
            )
        }
    },
    methods:{
       weekOrDayChange() {
           if (this.weekOrDay == 'day') {
               this.weekOrDay = 'week'
           } else {
               this.weekOrDay = 'day'
           }
       },        
       cardColor(type) {
           switch (type) {
               case 'teacher' : return "light-green lighten-3"
               case 'student' : return "green lighten-2"
               case 'admin' : return "green accent-3"
               default : return "orange lighten-4"
           }
       },        
        click(what) {
            if (doStuff(this.$router,what.payload) == 0) {
                if (what.payload.substr(0,4).toLowerCase() == 'http') {
                    window.open(what.payload,'_' + 'ko_external')
                } else {
                    infoSnackbar('Sorry, we do not handle ' + what.payload + ' yet!' )
                }
            }
              
        },
        loadFunctions() {
           let ts = {};
           ts.task = 'PlainSql';
           ts.sql = 'select * from dkhs_lfunction where functionaccess = "student" order by sortorder'
           ts.api = zmlConfig.apiDKHS
           zmlFetch(ts, this.showData, this.loadError)
        },
        loadError(response) {
            //this.$cs.l(response)
            alert(response)
        },
        showData(response) {
           this.getZml.functions = response
        }
    },
    mounted: function() {
        this.studentList.data =  { studentid: this.getZml.login.schoolno }
        console.log('zzzzzzzzzzzzzzzzzzzzzzzzzzzz', this.studentList)
        console.log('home:', this.getZml.login.grade, this.getZml.login, this.getZml.login.grade.length)
        if (this.getZml.login.grade.length == 2 ) {
           this.gradeToShow.g = 'G'.concat(this.getZml.login.grade)
        } else {
           this.gradeToShow.g = 'G0'.concat(this.getZml.login.grade)
        }
        
        
        console.log(util.getNum('009'), this.getZml.login.schoolno, this.getZml.login.username )
        


        this.gradeToShow.c = this.getZml.login.gclass
        console.log('home2:', this.gradeToShow.g + this.gradeToShow.c)
        this.showCal = true;
        this.loadFunctions()
        
    }
}
</script>

