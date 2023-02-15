<template>
 <v-card class="mx-auto"
         :color="color"
         elevation="2"
  >
   <v-card-title class="headline ma-1"> Attendance </v-card-title>
   <v-card-text v-if="AttendanceList">
     <v-data-table
         :headers="atendanceHeader"
         :items="AttendanceList"
         :items-per-page="5"
         class="elevation-1"
         @click:row="clickOnRow"
     />
   </v-card-text>
   <v-card-text v-else>
      Oops - no attendance found for {{ studentid }}
   </v-card-text>
   <v-card-actions v-if="AttendanceList">
     <v-btn @click="showResult = !showResult"
            small>
        Show Data for Export
    </v-btn>
   </v-card-actions>
    <v-dialog v-model="showResult" fullscreen>
     <v-card color="red" v-if="showResult && AttendanceList">
      <front-json-to-csv :json-data="AttendanceList"
                         :csv-title="`Attendance List ${studentid} ${studentSurname}`"
                         @hideModal="showResult = false">
      </front-json-to-csv>
     </v-card>
    </v-dialog>
 </v-card>
</template>
<script>
import { zmlFetch } from "@/api/zmlFetch";
import { getters } from "@/api/store";
import FrontJsonToCsv from '@/api/csv/FrontJsonToCsv.vue'
export default {
    name:"StudentAttendanceList",
    props: ['studentid','color'],
    components: {FrontJsonToCsv},
    data: () => ({
      getZml: getters.getState({ object: "gZml" }) ,
      AttendanceList:null,
      atendanceHeader: [
        //{text: 'id',       align: 'start',  value: 'attendanceid' },
          {text: 'Date and Time',  align: 'start',  value: 'attendancedate' },
          {text: 'Teacher',    align: 'start',  value: 'staff' },
          {text: 'Room',   align: 'start',  value: 'location' },
          {text: 'Period', align: 'start',  value: 'period' },
          {text: 'Class',    align: 'start',  value: 'gclass' },
          {text: 'Grade',    align: 'start',  value: 'grade' },
        ],
      showResult:false
    }),
    methods:{
      clickOnRow(e) {
        console.log('attendance clicked on row',e)
      },
      getAttendance() {
        if (this.studentid) {
           let sl = { task: 'plainSql'
                    , sql:`select * from v_attendance where studentid = ${this.studentid}`
// `select sessionid,attendancedate, staff, location, period, archived, surname, grade from (\
//   select attendancedate, a.staff,a.location,a.period,a.sessionid
//    , 'N' archived, s.surname, concat(grade, gclass) grade \
//    from dkhs_student s \
//       , a_attendance a \
//   where a.capture = s.studentid \
//     and a.active is null \
//     and a.capture = ${this.studentid} \
//   union all \
//   select attendancedate, a.staff,a.location,a.period,a.sessionid
//  , 'Y', s.surname, concat(grade, gclass) grade \
//    from dkhs_student s \
//       , a_attendance_back a \
//   where a.capture = s.studentid \
//     and a.active is null \
//     and a.capture = ${this.studentid} \
//     ) d \
//  order by attendancedate DESC`
           }
           zmlFetch(sl, this.processAfterFetch);
        }
      },
      processAfterFetch(response) {
        this.studentSurname = ''
        if (!response.error) {
           this.AttendanceList= response
           this.studentSurname = `: ${response[0].surname} : ${response[0].grade}`
        } else {
            this.AttendanceList = []
        }
      }

    },
    mounted: function() {
        console.log(this.$options.name,  this.studentid)
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