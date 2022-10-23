<template>
<!--
  We only do and show count here, the actual select are passed to basetablereport
  -->
<div>
  <v-container fluid v-if="['admin','teacher'].includes(getZml.login.type) == false">
    You are not logged in, or you are not a teacher!
</v-container>
<v-container v-else fluid>
   <v-toolbar dense row>
    <v-toolbar-title>
      <span class="d-none d-sm-block"> Quick Reporting  </span>
    </v-toolbar-title>
    <v-overlay v-if="loading" :value="loading">
      <v-progress-circular indeterminate size="84">
        Thinking ...
      </v-progress-circular>
    </v-overlay>

   <v-spacer/>
   <template v-slot:extension>
      <v-tabs v-model="tab" align-with-title>
        <v-tabs-slider color="yellow"></v-tabs-slider>
        <v-tab v-for="rep in reports" :key="rep.id">
          {{ rep.name }}
        </v-tab>
      </v-tabs>
   </template>
   <v-spacer/>
   <v-back/>
 </v-toolbar>

 <v-card>
    <v-tabs-items v-model="tab">
      <v-tab-item v-for="rep in reports" :key="rep.id" :href="rep.id">
        <v-card flat>
          <v-card-actions>
            <!-- <template v-if="tab == 0">
               <z-auto-place v-model="reportValueToCount[item.id]"
                label="Place"
                @objectSelected="objectSelected" />
            </template>
            <template v-else-if="tab == 1">
              <z-auto-pers v-model="reportValueToCount[item.id]"
                  label="Owner"
                  @objectSelected="objectSelected" />
            </template>
            <template v-else>
              <z-auto-item-type v-model="reportValueToCount[item.id]"
                  label="Item Type"
                  @objectSelected="objectSelected" />
            </template> -->
          </v-card-actions>
          <v-card-title>
            {{ rep.answer }}
          </v-card-title>
          <v-card-actions>
            <v-btn small @click="build"> showReport </v-btn>
          </v-card-actions>
        </v-card>
      </v-tab-item>
    </v-tabs-items>
  </v-card>
 <base-table-report  v-if="sqlSelect"
     :reportHeader="reportHeader"
     :sqlSelect="sqlSelect"
  />
</v-container>
</div>
</template>

<script>
//import ReportsTable from '@/components/ReportsTable.vue'
import BaseTableReport from    '@/components/base/baseTableReport'
import VBack from '@/components/base/VBack.vue'
import { zmlFetch } from '@/api/zmlFetch.js'
import { getters } from "@/api/store";

export default {
  name: 'Report',
  components:{
    BaseTableReport,
    VBack
  },
  data: () => ({
    loading: false,
    getZml: getters.getState({ object: "gZml" }),
    show: false,
    tab:null,
    reports: [
          { id:0
          , name:'LearnAssist (Bursey) List'
          , f:null
          , sql:"SELECT count(*) items from dkhs_student s, dkhs_learnassist l WHERE l.studentid = s.studentid"
          , sqlReport:`SELECT s.schoolno, s.surname, s.firstname, s.grade, s.gclass from dkhs_student s, dkhs_learnassist l WHERE l.studentid = s.studentid ORDER BY s.grade, s.gclass`
          , answer:'', obj:{}, count:null
          },
          { id:1
          , name:'Students using KuiliesOnline',f:null
          , sql:"SELECT count(*) items FROM dkhs_learner l, dkhs_student s WHERE s.studentid = l.user_name"
          , sqlReport:`SELECT l.user_name,l.user_fullname,  s.surname , substr(firstlogindate,1,10) first, substr(lastlogindate,1,10) last , logins, s.grade\
 FROM dkhs_learner l, dkhs_student s \
 WHERE s.studentid = l.user_name`
            ,answer:'', obj:{}, count:null
          },
          { id:2
          , name:'Your Logs' ,f:null
          , sql:'SELECT count(*) items from dkhs_log'
          , sqlReport:`SELECT * FROM dkhs_log where user = **username** order by log_id desc`
          , answer:'', obj:{}, count:null
          },
          { id:3,name:'Test' ,f:null
          , sql:`SELECT count(*) items FROM s_stock s`
          , sqlReport:`SELECT s.stockid, s.typeid, s.name, s.userid, s.originalownerid FROM s_stock s`
          , answer:'Show All', obj:{}, count:null
          },
          { id:4, name:'Absentees', f:null
          , sql:'select count(*) items from a_attendance'
          , sqlReport:`select * from (\
 select staff\
     , location\
     , 0 period\
     , period status\
     , concat(s.surname,', ',s.firstname) student\
     , concat(s.grade,s.gclass) grade\
     , attendancedate \
 from a_attendance a, dkhs_student s\
 where substr(attendancedate ,1,8) = substr(now(),1,8)\
 and period = 'Late'\
 and s.studentid = a.capture \
union all \
 select menemonic staff\
     , sp.name\
     , period\
     , status\
     , concat(s.surname,', ',s.firstname) student\
     , concat(s.grade,s.gclass) grade\
     , attendancedate\
 from dkhs_attendance a, dkhs_learner l, dkhs_personel p, s_place sp, dkhs_student s\
 where substr(attendancedate ,1,8) = substr(now(),1,8)\
  and status not in ('Present','Ignore')\
  and a.userid = l.userid\
  and p.menemonic = l.user_name\
  and sp.placeid = a.placeid\
  and s.studentid = a.studentid ) aa \
order by attendancedate desc`
          , answer:'Show Them', obj:{}, count:null
          }
        ],
    reportValueToCount:[],
    sqlSelect:null,
    reportHeader:null
  }),
  computed:{},
  methods: {
    objectSelected(e) {
      console.log('objSelected = ',e)
      this.reports[this.tab].obj = e
    },
    getCount() {
      if (this.reports[this.tab].count == null) {
        this.loading = true
        let ts = {}
        ts.task = 'PlainSql'
        // assign the sql with 'placeid =' to sql, and add the id
        ts.sql = `${this.reports[this.tab].sql}` // ${this.reportValueToCount[this.tab]}`
        zmlFetch(ts, this.updateCount)
      } else {
        this.showCount()
      }
    },
    updateCount(response) {
      this.loading = false
      this.reports[this.tab].count = response[0].items
      this.showCount()
    },
    showCount() {
      switch (this.tab) {
        case 0:
          this.reports[this.tab].answer = `For learnassist report we found ${this.reports[this.tab].count} item(s)`
          break
        case 1:
          this.reports[this.tab].answer = `Students using KuiliesOnline : ${this.reports[this.tab].count} `
          break
        case 2:
          this.reports[this.tab].answer = `Show your logs : All : ${this.reports[this.tab].count}`
          break
        case 3:
          this.reports[this.tab].answer = `Eben List :  we found ${this.reports[this.tab].count} item(s)`
          break
        case 4:
          this.reports[this.tab].answer = `Absentees :  we found ${this.reports[this.tab].count} item(s)`
          break

      }
    },
    build(u) {
      console.log('build base on this.tab',u)
      switch (this.tab) {
        case 0:
         this.sqlSelect = this.reports[this.tab].sqlReport
         this.reportHeader = this.reports[this.tab].name
         break
        case 1:
         this.sqlSelect = this.reports[this.tab].sqlReport
         this.reportHeader = this.reports[this.tab].name
         break
        case 2:
         this.sqlSelect = `select log_id, log_dte, ip, referer, user, function, replace(replace(details,'\\/','/'),'"','') details from dkhs_log \
             where user = '${this.getZml.login.username}' ORDER BY log_id DESC`
         this.reportHeader = this.reports[this.tab].name + ' : ' + this.getZml.login.username
         break
        case 3:
         this.sqlSelect = this.reports[this.tab].sqlReport
         this.reportHeader = 'Eben Pretorius se Lys'
         break
        case 4:
         this.sqlSelect = this.reports[this.tab].sqlReport
         this.reportHeader = 'Absentees/Late/Etc'
         break
      }
    },

  },
  mounted() {
    this.getCount()
    if (this.getZml.place.length == 0 || this.getZml.owner.length == 0) {
      //They have been nowhere else = but should not be a problem
    }

  },
  watch:{
    tab() {
      console.log('new tab = ', this.tab)
      this.getCount()
    },
    reportValueToCount() {
      this.reports[this.tab].f()
    },

  }
}
</script>

<style scoped>

.fade-enter-active,
.fade-leave-active {
  transition-duration: 3s;
  transition-property: opacity;
  transition-timing-function: ease;
}
.fade-enter,
.fade-enter-active {
  transition: all 3s ease;
}

.v-carousel .v-window-item {
  position: absolute;
  top: 0;
  width: 100%;
}
</style>