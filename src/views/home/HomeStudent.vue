<template>
<div>
<v-toolbar color="primary">
    <v-card color="primary" width="100%" class="pa-3">
    <div class="float-left">
         Available options for :
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
     <v-expansion-panel-header expand-icon="mdi-calendar">
        Calendar (Click here to view your day!)
     </v-expansion-panel-header>
    <v-expansion-panel-content>
      <calendar-student v-if="gradeToShow.c" v-show="showCal" 
               :weekOrDay="weekOrDay" 
               :studentGradeClass="gradeToShow.g + gradeToShow.c" />
    </v-expansion-panel-content>
    </v-expansion-panel>
    <v-expansion-panel>
        <v-expansion-panel-header expand-icon="mdi-menu">
            Menu Option
        </v-expansion-panel-header>
        <v-expansion-panel-content>
            some content
        </v-expansion-panel-content>
    </v-expansion-panel>
  </v-expansion-panels>
</v-col>
<v-col cols="12">
  <menu-list :list="menuFilterList" /> 
</v-col>
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
import { infoSnackbar } from '@/api/GlobalActions';
import { getters } from "@/api/store";
import EmailList from '@/components/EmailList';
import MenuList from '@/components/MenuList';
import CalendarStudent from '@/components/CalendarStudent';
export default {
    name:"StudentHome",
    components:{
          EmailList
        , MenuList
        , CalendarStudent
        //, StudentGrade
        },
    data: () => ({
        getZml: getters.getState({ object: "gZml" }),
         showCal:true,        
         cards: ['Today', 'Yesterday'],
         gradeToShow:{g:'', c:''},
         weekOrDay:"day",
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
        //this.$cs.l('MOUNT STUDENTHME', this.getZml)
        this.gradeToShow.g = 'G' + this.getZml.login.grade
        this.gradeToShow.c = this.getZml.login.gclass
        this.showCal = true;
        this.loadFunctions()
        
    }
}
</script>

