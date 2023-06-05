<template>
 <v-container fluid>

  <base-tool :toolbarName="reportHeader"
            :background="false"
            :back="true"
            >
      <v-btn icon @click="doPrint"><v-icon> mdi-printer</v-icon>  </v-btn>
      <!-- <v-btn class="ma-2" @click="showPrint = true"> Export </v-btn> -->
  </base-tool>
  <v-data-table
          v-if="filterTable.length"
          :headers="labels"
          :items="filterTable"
          multi-sort
   />

<!-- <v-dialog v-model="showPrint" xwidth="auto" :fullscreen="$vuetify.breakpoint.smAndDown">
  <front-json-to-csv v-if="filterTable2.length"
                   :json-data="filterTable2"
                   :csv-title="reportHeader"
                   @hideModal="showPrint = false"
                   @printed="showPrint=false"
                   :footer="realFooter"
                   :unique="unique"
                   :small="true">
  </front-json-to-csv>
</v-dialog>-->

 </v-container>
</template>

<script>
import { zmlFetch } from '@/api/zmlFetch';
import { errorSnackbar } from "@/api/GlobalActions"
import baseTool from '@/components/base/baseTool.vue'
export default {
  name: "BaseTableReport",
  props:{
         sqlSelect:{type:String, required:true},
         reportHeader:{type:String, default:"reportHeader"},
         entity:{type:String},
         footer:{type:String, default:""},
         unique:{type:String, default:""}
         },
  components: {baseTool},
  data: () => ({
      orDTTable: [],
      labels: [],
      realFooter: `<br><br>\
      <table BORDER=2 BORDERCOLOR="#4a6053" width=90% style='text-align: right; border-spacing: 2px;'>
       <tr><th>This is an example header for our footer</th>
       <tr><td>And some text</td></tr></table>`,
      search: ''

  }),
  computed: {
    filterTable() {
        return this.orDTTable
    }
  },
  methods:{
    doPrint() {
       this.$router.push({ name: 'BasePrintTable', params: {reportHeader: this.reportHeader, unique:this.unique, orDTTable: this.orDTTable} })
      // alert('check it out')
      // if (this.entity=='anyvalue-takeifout') {
      // printJSON(this.orDTTable, this.labels, this.reportHeader)
    },
    getData () {
      //console.log(this.$options.name,'getdata', this.sqlSelect)
      zmlFetch({task: 'PlainSql'
               ,sql: this.sqlSelect
               }, this.activityDone, this.loadError);
    },
    loadError(response) {
      //console.log(this.$options.name,'errdata', this.sqlSelect)
      errorSnackbar('Error:' + JSON.stringify(response))
    },
    activityDone(response) {
      //console.log(this.$options.name,'done', this.sqlSelect)
      if (!response.constructor === Array) {
          errorSnackbar('Error:' + JSON.stringify(response))
          this.orDTTable = []
          return
      }
      this.orDTTable = response
      //console.log('our length is ', this.orDTTable.length )
      if (this.orDTTable.length) {
         this.$playSound()
         this.buildHeaders()
      }
    },
    buildHeaders() {
      this.labels.length = 0
      Object.keys(this.orDTTable[0]).forEach(ele => {
        //console.log(ele)
        this.labels.push( {text:ele, value:ele} )
      })
    }

  },
  mounted() {
    if (this.sqlSelect) this.getData()
    if (this.footer) this.realFooter = this.footer

  },
  watch:{
      sqlSelect() {
        //console.log(this.$options.name,'watchers', this.sqlSelect)
        if (this.sqlSelect) this.getData()
      }
  }

}
</script>
