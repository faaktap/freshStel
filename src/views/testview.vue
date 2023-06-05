<template>
 <div>
  <base-tool :toolbarName="toolbarName"
            :background="false"
            :back="true"
  >
      <!-- <v-btn icon @click="doPrint"><v-icon> mdi-printer</v-icon>  </v-btn> -->
      <!-- <v-btn class="ma-2" @click="showPrint = true"> Export </v-btn> -->
      <v-btn class="ma-2" @click="loadAllData"> Refresh </v-btn>
      <v-btn class="ma-2" @click="LoadLatestLookups"> Latest Lookups </v-btn>
  </base-tool>

      <v-progress-linear :active="progress" :indeterminate="progress" color="grey lighten-1" />
      <v-card>
         <base-table-edit
                     :tList="sqlData"
                     :tHeading="tHeading"
                     bHeading="Double click an item to delve deeper."
                     @update="tableDblClick"
                     @select="tableSelect"
         />
      </v-card>
         <base-table-edit
                     :tList="secTable"
                     :bHeading="curRec.name + ' ' + curRec.description"
         />
       ** END **
  </div>
</template>

<script>
import { getters } from  "@/api/store"
import { zmlFetch } from '@/api/zmlFetch'
import BaseTableEdit from    '@/components/base/baseTableEdit'
import baseTool from '@/components/base/baseTool.vue'
import { zData } from "@/api/zGetBackgroundData.js"
export default {
    components: {
        BaseTableEdit
      , baseTool
    },
    props: [],
    data () {
      return {
        toolbarName:"TestView",
        getZml: getters.getState({ object:"gZml" }),
        progress:false,
        sqlData:[],
        curRec:{},
        secTable:[]
       }

   },
   computed: {
    tHeading() {
        return `( Records :  ${this.sqlData.length || 0} )`
    },
   },
   created() {
    this.loadAllData()
   },
   methods: {
     LoadLatestLookups() {
         zData.quickLoadInitialData('QuickLoad')
     },
     loadAllData() {
       this.$cs.l('loadAllData')
       this.progress = true;
       let ts = {sql: 'select * from dkhs_table order by `order`'
                ,task: 'PlainSql'}
       zmlFetch(ts, this.processAllData)
     },
     processAllData(response) {             //processAllData(response,notused,queue)
       this.sqlData = response
       this.progress = false
     },

     tableDblClick(item) {
        //  this.$cs.l('back at base - dblClick:evt:', evt )
        this.$cs.l('tableDblClick - back at base - Edit:item:', item )
        //  this.$cs.l('Table Show Delivieries 3: ', item.item)
        if (item.sql) {
          this.curRec = item
          this.progress = true;
          this.secTable.length = 0
          let ts = {sql: item.sql ,task: 'PlainSql'}
          zmlFetch(ts, this.process2ndTableData, this.otherMessage)
        } else {
          alert('no sql found')
        }
     },
     otherMessage(response) {
       console.log('OtherMessage:', response)
       if ('error' in response) {
         alert(response.error + ' ' + response.errorcode)
       }

     },
     process2ndTableData(response) {
       console.log(response)
       this.progress = false
       if ('error' in response) {
         alert(response.error + ' ' + response.errorcode)
       } else {
         this.secTable = response
       }
     },

     tableSelect(evt,item) {
       //this.$cs.l('back at base - select:',item.item, evt)
       this.$cs.l('tableSelect : here we could have a popup form?', evt, item)
     },
   }
}
</script>
