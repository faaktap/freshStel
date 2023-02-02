<template>
<!--
  We only do and show count here, the actual select are passed to basetablereport
  -->
<div>
  <v-container fluid v-if="['admin','teacher'].includes(getZml.login.type) == false">
    You are not logged in, or you are not a teacher!
</v-container>
<v-container v-else fluid>
   <v-toolbar dense row color="primary" dark>
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
      <v-tabs v-model="tab"
              @change="tabSelected"
              align-with-title  show-arrows>
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
      <v-tab-item  v-for="rep in reports" :key="rep.id" :href="rep.id">
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
            <v-btn small @click="build(rep)"> showReport </v-btn>
          </v-card-actions>
        </v-card>
      </v-tab-item>
    </v-tabs-items>
  </v-card>
 <base-table-report  v-if="sqlSelect"
     :reportHeader="reportHeader"
     :sqlSelect="sqlSelect"
  />
  <div  v-if="getZml.login.username == 'WER'">
    {{ reports}}
  </div>
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
    curReport:{},
    reports: [{id:0, answer:'', ans:'', sqlCount:'', sqlReports:'', order:0}],
    reportValueToCount:[],
    sqlSelect:null,
    reportHeader:null
  }),
  computed:{},
  methods: {
    tabSelected(tabNo) {
      if (this.reports,length < 2) this.loadInitialData()
      this.tab = tabNo
      this.sqlSelect = ''
      this.curReport = this.reports[tabNo]
      this.reports[tabNo].answer = 'dd'
      this.curReport.answer = "cc"
      console.log('tab selected:',tabNo, this.curReport.name)
      this.getCount()
    },

    //Not used = but would be nice if we can have string interpolation call a function when we need it.
    //javascript template strings with string interpolation
    //also read https://stackoverflow.com/questions/22607806/defer-execution-for-es6-template-literals#comment112302403_22619256 aandagtig
    //also cool : https://www.sitepoint.com/community/t/string-template-literal-with-object-keys-map/385295/7
    template(strings, ...keys) {
        console.log('template: ', strings, keys)
        return (...values) => {
          const dict = values[values.length - 1] || {}
          const result = [strings[0]]
          keys.forEach((key, i) => {
            const value = Number.isInteger(key) ? values[key] : dict[key]
            result.push(value, strings[i + 1])
          });
          return result.join("");
        }
    },
    fmt([fisrt, ...rest], ...tags) {
     return values => rest.reduce((acc, curr, i) => {
       return acc + values[tags[i]] + curr;
     }, fisrt);
    },

    objectSelected(e) {
      console.log('objSelected = ',e)
      this.curReport.obj = e
    },
    saveToDatabase(o) {// only used once to populate DB (dkhs_reports)
      let ts = {}
      ts.task = 'PlainSql'
      ts.sql = `insert into dkhs_reports values (${o.id}, ${o.order}, "${o.name}", "${o.sql}", "${o.sqlReport}",null)`
      console.log(ts.sql)
      zmlFetch(ts, this.doneAdd )
    },
    getCount() {
      if (this.curReport.count == null) {
        this.loading = true
        let ts = {}
        ts.task = 'PlainSql'
        ts.sql = this.curReport.sqlcount
        zmlFetch(ts, this.updateCount)
        //this.saveToDatabase(this.curReport)
      } else {
        this.showCount()
      }
    },
    updateCount(response) {
      this.loading = false
      this.curReport.count = response[0].items
      this.showCount()
    },
    showCount() {
      this.reports[this.tab].answer = this.curReport.ans.replaceAll('**items**', this.curReport.count)
      console.log('replace items', this.curReport.answer, this.curReport.ans, this.curReport.count)

      //play
      // let a = this.fmt`Test with ${0}, ${1}, ${2} and ${0} again`(['A', 'B', 'C']);
      // console.log(a)
      // let s = 'Test with ${0}, ${1}, ${2} and ${0} again'
      // let b = this.fmt`${s}`(['A', 'B', 'C']);
      // console.log(b)
    },
    build(u1,u2) {
      console.log('build base on this.tab',u1,u2)
      this.sqlSelect = this.curReport.sqlreport.replaceAll('**username**', this.getZml.login.username)
      this.reportHeader = this.curReport.name
      console.log('sqlRep=',this.sqlSelect)
    },
    initialize(response) {
      response.forEach(e =>  e.answer = 'bb')
      this.reports = response
      this.reports.sort((a,b) => a.order - b.order)
      this.reports.forEach(e =>  e.answer = 'ee')
      this.getCount()
    },
    loadInitialData() {
      let ts = {task: 'PlainSql',sql: 'select * from dkhs_reports'}
      zmlFetch(ts, this.initialize )
    }

  },
  mounted() {
    if (this.getZml.place.length == 0 || this.getZml.owner.length == 0) {
      //They have been nowhere else = but should not be a problem
    }
    this.loadInitialData()

  },
  watch:{
    reportValueToCount() {
      this.curReport.f()
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