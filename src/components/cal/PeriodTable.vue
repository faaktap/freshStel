<template>
  <div>
    <base-tool :toolbarName="toolbarName"
            :background="false"
            :back="true"
  >
      <!-- <v-btn icon @click="doPrint"><v-icon> mdi-printer</v-icon>  </v-btn> -->
      <!-- <v-btn class="ma-2" @click="showPrint = true"> Export </v-btn> -->
      <v-btn class="ma-2" @click="loadAllData"> Refresh </v-btn>
  </base-tool>

      <v-progress-linear :active="progress" :indeterminate="progress" color="grey lighten-1" />
      <v-card>
         <base-table-edit
                     :tList="sqlData"
                     :tHeading="tHeading"
                     bHeading="Double click an item to delve deeper."
                     @update="tableAction('update',$event)"
                     @delete="tableAction('delete',$event)"
                     @insert="tableAction('insert')"

         />
      </v-card>
   <v-dialog v-model="showRecord" width="auto">
    <v-card class="pa-4">
      <v-card-title> {{ action }} on Period </v-card-title>
      <v-text-field label="id" v-model="curRec.id" />
      <v-text-field label="description" v-model="curRec.description" />
      <v-text-field label="day of week" v-model="curRec.dow" />
      <v-text-field label="start" v-model="curRec.starttime" />
      <v-text-field label="end" v-model="curRec.endtime" />
      <v-text-field label="len" v-model="curRec.length" />
      <v-card-actions>
         <v-btn small @click="showRecord = false"> Close </v-btn>
         <v-spacer />
         <v-btn small @click="saveRec"> {{ action }} </v-btn>
      </v-card-actions>
    </v-card>
   </v-dialog>
       ** END **
  </div>
</template>

<script>
import { getters } from  "@/api/store"
import { zmlFetch } from '@/api/zmlFetch'
import BaseTableEdit from    '@/components/base/baseTableEdit'
import baseTool from '@/components/base/baseTool.vue'

export default {
    name:"PeriodTable",
    components: {
        BaseTableEdit
      , baseTool
    },
    props: [],
    data () {
      return {
        toolbarName:"Periods",
        getZml: getters.getState({ object:"gZml" }),
        progress:false,
        sqlData:[],
        curRec:{},
        showRecord:false,
        action:'',
        updateSql:''
       }

   },
   computed: {
    tHeading() {
        return `( Period Records :  ${this.sqlData.length || 0} )`
    },
   },
   created() {
    this.loadAllData()
   },
   methods: {
     loadAllData() {
       this.$cs.l('loadAllData')
       this.progress = true;
       let ts = {sql: 'select * from dkhs_dayperiod order by dow, description, starttime'
                ,task: 'PlainSql'}
       zmlFetch(ts, this.processAllData)
     },
     processAllData(response) {             //processAllData(response,notused,queue)
       console.log(response)
       this.sqlData = response
       this.progress = false
     },

     tableAction(evt,item) {
        this.action = evt
        //  this.$cs.l('back at base - dblClick:evt:', evt )
        this.$cs.l('tableDblClick - back at base - Edit:item:',evt, item )
        this.$cs.l('Table : ', item, evt)
        this.showRecord = true
        if (this.action == 'insert') {
          this.curRec = {id:'', description:'Test Day 2023',dow:'1',periodname:'Admin',starttime:'07:45', endtime:'08:00', length:15}
        } else {
          this.curRec = item
        }
     },
     saveRec() {
      if (this.action == 'update') {
        this.updateSql = `update dkhs_dayperiod set description = "${this.curRec.description}"
        , dow = ${this.curRec.dow}
        , starttime = "${this.curRec.starttime}"
        , endtime = "${this.curRec.endtime}"
        , length = ${this.curRec.length}
         where id = ${this.curRec.id}`
      }
      if (this.action == 'insert') {
        this.updateSql = 'insert into dkhs_dayperiod (id, description, dow, periodname, starttime, endtime, `length`) values ' +
        `(null, "${this.curRec.description}", ${this.curRec.dow}, "${this.curRec.periodname}", "${this.curRec.starttime}", "${this.curRec.endtime}", "${this.curRec.length}")`
      }
      if (this.action == 'delete') {
        this.updateSql = `delete from dkhs_dayperiod where id = ${this.curRec.id}`

      }
      this.showRecord = false
      this.dbUpdate()
     },
     dbUpdate() {
      alert(this.updateSql)
      let ts = {sql: this.updateSql
               ,task: 'PlainSql'}
       zmlFetch(ts, this.UpdateDone)
     },
     UpdateDone(response) {
      console.log('response : ' , response)
     }
   }
}
</script>
