<template>
<!-- this.$router.push({ name: 'AttendanceView' -->
 <div>
   <base-title-expand color="white" heading="ATTENDANCE VIEW">
   <p>
   Attendance view show the current days' attendance entries for the logged in user.
    </p>
  </base-title-expand>

<base-tool :toolList="[]"
           :toolbarName="`Attendance View for ${getZml.login.fullname}`"
           :loading="loading"
            >
</base-tool>
  <v-row>
   <v-col cols="12" md="12">
    <v-card class="ma-2" elevation="2" loading="!loading">
     <v-card-text>
      <v-layout wrap justify-space-between>
        <v-data-table
            v-if="aList && aHeader.length > 0"
            :headers="aHeader"
            :items="aList"
             class="elevation-1"
            color="purple lighten-3"
            @dblclick:row.prevent="loadSessionData"
        >
        </v-data-table>

      </v-layout>
     </v-card-text>
   </v-card>
  </v-col>
  </v-row>

 </div>
</template>

<script>
//import { zmlConfig } from '@/api/constants';
import { getters } from "@/api/store"
import { zmlFetch } from '@/api/zmlFetch.js';
import baseTool from '@/components/base/baseTool.vue'
import BaseTitleExpand from '@/components/base/BaseTitleExpand.vue'
//import { infoSnackbar } from '@/api/GlobalActions';
export default {
    name:'StudentAttendanceView',
    transition: 'page-slide',
    components: {
      baseTool
    , BaseTitleExpand
    },
    data: () => ({
      getZml: getters.getState({ object: "gZml" }),
      loading: false,
      aHeader: [{text:'date', value:'date'}
               ,{text:'day', value:'day'}
               ,{text:'period', value:'period'}
               ,{text:'presenter', value:'presenter'}
               ,{text:'place', value:'place'}
               ,{text:'entries', value:'student'}
               ,{text:'s', value:'sessionid'}
      ],
      aList: [],
      sessionID: null
    }),
    computed: {
    },
    methods: {
      refresh() {
        console.log('Refresh Data')
        this.loading = true
        let ts = {task: 'PlainSql',
               sql: `SELECT substr(attendancedate,1,10) date \
 , SUBSTRING_INDEX(sessionid, ".", 1) day \
 , SUBSTRING( SUBSTRING_INDEX(sessionid, ".", 2), instr(sessionid,'.')+1) period \
 , sessionid \
 , l.user_name presenter \
 , p.name place \
 , count(*) student \
  FROM dkhs_attendance a, s_place p, dkhs_learner l \
 where a.userid = l.userid and p.placeid = a.placeid \
   and substr(attendancedate,1,7) = substr(now(),1,7) \
 group by substr(attendancedate,1,10) \
 , SUBSTRING_INDEX(sessionid, ".", 1) \
 , SUBSTRING( SUBSTRING_INDEX(sessionid, ".", 2), instr(sessionid,'.')+1) \
 , sessionid \
 , l.user_name  \
 , p.name order by attendancedate desc`
             }
        zmlFetch(ts, this.loadAttendanceData, this.errorLoading)
      },
      loadAttendanceData(response) {
        this.loading = false
        this.aList = []
        if ('error' in response && response.error.length > 10) {
          alert('some error')
        } else {
          this.aList = response
        }
        this.loading = false

      },
      loadSessionData(e1,e2) {
        console.log('going forward to session:',e2.item.sessionid, e1,e2)
        this.$router.push({ name: 'AttendanceSession', params: {sessionid: e2.item.sessionid} })
      },
      errorLoading(err) {
        this.loading = false
        alert('something went wrong:'+ err.error)
        console.log(err)
      },
    },
    mounted() {
        this.refresh()
    },
    watch:{
    },
    beforeDestroy() {
    }
}
</script>
