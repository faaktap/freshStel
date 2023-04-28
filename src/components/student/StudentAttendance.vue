<template>
<v-container v-if="['admin','teacher'].includes(getZml.login.type)" fluid>

 <v-card class="mx-auto"
         :color="color"
         elevation="2"
  >
   <v-card-title class="headline ma-1"> Attendance </v-card-title>
   <v-card-text v-if="showCalendar == false">
     <v-data-table
         :headers="atendanceHeader"
         :items="AttendanceList"
         :items-per-page="5"
         class="ma-1 pa-2"
         @click:row="clickOnRow"
         mobile-breakpoint="0"
     />
     </v-card-text>
     <v-card-text v-if="showCalendar == true">
     <quick-calendar-display  class="ma-1 pa-2"
       v-if="showCalendar && attEvt && attEvt.length"
       :heading="`Attendance ${studentid}, ${studentSurname}`"
       :passedEvents="attEvt"
     />
   </v-card-text>
   <v-card-actions v-if="AttendanceList">
     <v-btn @click="showResult = !showResult" small>
        Show Data for Export
    </v-btn>
    <v-btn @click="showCalendar = !showCalendar" small>
        <span v-if="!showCalendar">Calendar</span><span v-else> Columns </span>
    </v-btn>
    <v-btn @click="showTimetable = !showTimetable" small>
        TimeTable  <!-- :to="`/calstud/${studentid}`" -->
    </v-btn>
   </v-card-actions>
  </v-card>

    <v-dialog v-model="showResult" fullscreen>
     <v-card color="red" v-if="showResult && AttendanceList">
      <front-json-to-csv :json-data="AttendanceList"
                         :csv-title="`Attendance List ${studentid} ${studentSurname}`"
                         @hideModal="showResult = false">
      </front-json-to-csv>
     </v-card>
    </v-dialog>

    <v-dialog v-model="showTimetable" max-width="900">
      <v-btn small color="primary" @click="showTimetable = false"> close </v-btn>
      <calendar-student :studentid="studentid" />
    </v-dialog>

</v-container>
</template>
<script>
import { zmlFetch } from "@/api/zmlFetch";
import { getters } from "@/api/store";
import FrontJsonToCsv from '@/api/csv/FrontJsonToCsv.vue'
import QuickCalendarDisplay from '@/components/cal/QuickCalendarDisplay.vue'
import CalendarStudent from '@/components/CalendarStudent.vue';
export default {
    name:"StudentAttendanceList",
    props: ['studentid','color'],
    components: {
        QuickCalendarDisplay
      , CalendarStudent
      , FrontJsonToCsv
    },
    data: () => ({
      getZml: getters.getState({ object: "gZml" }) ,
      AttendanceList:null,
      showCalendar: true,
      showTimetable: false,
      atendanceHeader: [
        //{text: 'id',       align: 'start',  value: 'attendanceid' },
          {text: 'Date and Time',  align: 'start',  value: 'attendancedate' },
          {text: 'Teacher',    align: 'start',  value: 'staff' },
          {text: 'Room',   align: 'start',  value: 'location' },
          {text: 'Period', align: 'start',  value: 'period' },
          //{text: 'Class',    align: 'start',  value: 'gclass' },
          //{text: 'Grade',    align: 'start',  value: 'grade' },
          {text: 'Status',    align: 'start',  value: 'status' },
        ],
      showResult:false,
      attEvt:[]
    }),
    methods:{
      clickOnRow(e) {
        console.log('attendance clicked on row',e)
      },
      getAttendance() {
        if (this.studentid) {
           let sl = { task: 'plainSql'
                    , sql:`select * from v_attendance_all where studentid = ${this.studentid} and length(status) > 2 order by attendancedate DESC`
           }
           zmlFetch(sl, this.processAfterFetch);
        }
      },
      processAfterFetch(response) {
        this.studentSurname = ''
        if (!response.error) {
           this.AttendanceList= response
           this.studentSurname = `: ${response[0].surname} : ${response[0].grade}`
           this.loadEvents()
        } else {
            this.AttendanceList = []
        }
      },
      loadEvents() {
        let sql =  `SELECT DAYNAME(substr(attendancedate,1,10)) day_name\
     , substr(attendancedate,1,10) fulldate\
     , attendancedate start\
     , a.status  name\
     , concat(ifnull(concat(p.surname,',',p.name),a.staff),' Room:', a.location,', Per:', a.period) detail\
   FROM v_attendance_all a \
 left join dkhs_personel p on a.staff = p.menemonic\
  WHERE DAYNAME(substr(attendancedate,1,10)) not in ('Sunday','Saturday')\
    AND a.studentid = ${this.studentid}\
    AND substr(attendancedate,1,10) > now() - INTERVAL 300 DAY\
 ORDER BY a.attendancedate`

// SELECT DAYNAME('2022-06-01' + INTERVAL (seq) DAY) day_name\
//      , ('2022-06-01' + INTERVAL (seq) DAY) fulldate\
//      , seq\
//      , ifnull(attendancedate,concat(('2022-06-01' + INTERVAL (seq) DAY), ' 08:00' )) start\
//      , ifnull(a.status ,'No Entry') name\
//      , ifnull(concat(a.staff,', ', a.location,', ', a.period) ,'No Entry') detail\
//    FROM seq_0_to_400 d \
// LEFT JOIN v_attendance_all a ON substr(attendancedate,1,10) = ('2022-06-01' + INTERVAL (seq) DAY) AND a.studentid = ${this.studentid}\
//   WHERE DAYNAME('2022-06-01' + INTERVAL (seq) DAY) not in ('Sunday','Saturday')\
//     AND ('2022-06-01' + INTERVAL (seq) DAY) < now()\
// ORDER BY a.attendancedate `
      zmlFetch({task:'plainSql', sql:sql} , this.afterwards)
      },
      afterwards(response) {
        this.attEvt = response
      },
    },
    mounted() {
        this.$cs.l('Mounted',this.$options.name,  this.studentid)
        if (this.studentid) {
           this.getAttendance()
        }
    },
    watch: {
        studentid(n,o) {
            if (n != o) this.getAttendance()
        }
    }
}
</script>