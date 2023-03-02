<template>
<!--
use for a class - called form StudentClass
-->

<v-card>
  <v-card-title> {{ title }} </v-card-title>
  <v-card-text>
   <v-row>
    <v-col cols="12" md="6">
     <base-date v-model="aDate"  label="Date" instructions="FA" />
     <v-card elevation="4" class="ma-2  pa-3" color="deep-purple lighten-5">
       If more than one period is listed, all of them will be shown.
       ie: If the class split up to two or three teachers, and you click on
       any of the teachers, all attendance for that period will be shown
     </v-card>
    </v-col>
    <v-col cols="12" md="6">
      <v-data-table
        :items="listOfPeriods"
        :headers="listOfPerHeading"
        dense
       :items-per-page="nine"
        mobile-breakpoint="0"
        hide-default-footer
        @click:row="selectPeriod"
      />
    </v-col>
    </v-row>
  </v-card-text>
  <v-card-actions>
    <v-btn color="primary" @click="clearSelect"> Clear </v-btn>
    <v-spacer />
    <!-- <v-btn color="primary" @click="doneSelect"> Select </v-btn> -->
  </v-card-actions>
 </v-card>
</template>


<script>
import BaseDate from '@/components/base/BaseDate.vue'
import { zmlFetch } from '@/api/zmlFetch.js'

export default {
    name:"PickAttendance",
    props:{
      title: {type: String},
      gradeClass: {type:Object}
    },
    components: {
        BaseDate
    },
    computed: {
        periodList() {
          return this.listOfPeriods.map( function(obj){  return {"period": obj['period'] } })
        },
        // showSelection() {
        //   if (this.listOfPeriods.length)
        //             return this.listOfPeriods.find(e => e.period == this.period)
        //   return false
        // }
    },
    data: () => ({
        nine:9,
        aDate:null,
        listOfPeriods:[],
        listOfPerHeading:[{text:'staff', value:'staff'},{text:'per', value:'period'},{text:'count', value:'count'}],
        showSelection:{}
    }),
    methods:{
      clearSelect() {
        this.listOfPeriods.length = 0
        this.$emit('attendanceSelected', [], null)
      },
      selectPeriod(e) {
        console.log(e)
        this.showSelection = e
        this.doneSelect()
      },
      doneSelect() {
        //Fetch a list of all the id's and send it over..
        const period = this.showSelection.period
        let ts = {
            sql:`SELECT distinct a.studentid \
  FROM dkhs_student s, v_attendance a \
 where s.studentid = a.studentid \
  and a.attendancedate like '${this.aDate}%' \
  and a.period = '${period}' \
  and s.grade = '${this.gradeClass.g}' and s.gclass = '${this.gradeClass.c}'`,
            task:'PlainSql'
        }
        zmlFetch(ts, this.emitResult);
      },
      emitResult(response) {
        this.$emit('attendanceSelected', response, this.showSelection)
      },
      getNewPeriodList() {
        if (this.aDate.length < 8) return
        let ts = {
            sql:`SELECT grade, gclass, a.staff, a.location,a.period, count(*) count\
              FROM dkhs_student s\
              left join v_attendance a on s.studentid = a.studentid and attendancedate like '${this.aDate}%' \
              where grade = '${this.gradeClass.g}' and gclass = '${this.gradeClass.c}'\
              group by grade, gclass, a.staff, a.location,a.period
              order by a.period`,
            task:'PlainSql'
        }
        zmlFetch(ts, this.buildTheList);
      },
      buildTheList(response) {
        this.listOfPeriods = response //.sort((a,b) => a.period - b.period)
      },
      now() {
        const today = new Date()
        const dd = String(today.getDate()).padStart(2, '0');
        const mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        const yyyy = today.getFullYear();
        return `${yyyy}-${mm}-${dd}`
        }
    },
    mounted() {
      this.aDate = this.now()
    },
    watch: {
      aDate(){
        this.getNewPeriodList()
      }
    }

 }
</script>