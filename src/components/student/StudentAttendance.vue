<template>
 <v-card xmax-width="500" class="mx-auto" :color="color" elevation="2">
   <v-card-title class="headline ma-1"> Attendance </v-card-title>
   <v-card-text v-if="AttendanceList">
   <v-data-table
         :headers="emailHeader"
         :items="AttendanceList"
         :items-per-page="15"
         :hide-default-footer="true"
         class="elevation-1"
         @click:row="clickOnRow"
       ></v-data-table>
   </v-card-text>
   <v-card-text v-else>
      Oops - no attendance found for {{ studentid }}
   </v-card-text>
 </v-card>
</template>
<script>
import { zmlFetch } from "@/api/zmlFetch";
import { getters } from "@/api/store";
export default {
    name:"StudentAttendanceList",
    props: ['studentid','color'],
    data: () => ({
      getZml: getters.getState({ object: "gZml" }) ,  
      AttendanceList:null,
      emailHeader: [
        //{text: 'id',       align: 'start',  value: 'attendanceid' },
          {text: 'Teacher',    align: 'start',  value: 'staff' },
          {text: 'Room',   align: 'start',  value: 'location' },
          {text: 'Period', align: 'start',  value: 'period' },
          {text: 'Date',  align: 'start',  value: 'attendancedate' },
          {text: 'Session',    align: 'start',  value: 'sessionid' },
        ]
    }),
    methods:{
      clickOnRow(e) {
        console.log('attendance clicked on row',e)
      },
      getAttendance() {
        if (this.studentid) {
           let sl = { task: 'plainSql'
                    , sql: `select attendancedate,a.sessionid,a.staff,a.location,a.period \
 from dkhs_student s     \
   , a_attendance a     \
   , (select distinct capture from a_attendance        group by capture, period      ) d  \
 where d.capture = s.studentid   \
 and s.studentid = a.capture    \
 and a.active is null  \
 and a.capture = ${this.studentid}\
 order by  a.attendancedate desc, a.period  ,a.staff, a.location \
 limit 20`}

           zmlFetch(sl, this.processAfterFetch);
        }
      },
      processAfterFetch(response) {
        console.log(response)
          if (!response.error) {
             this.AttendanceList= response
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