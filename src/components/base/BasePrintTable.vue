<template>
 <v-container fluid>

  <base-tool :toolbarName="reportHeader"
            :background="false"
            :back="true"
            >
      <v-btn icon @click="doPrint"><v-icon> mdi-printer</v-icon>  </v-btn>
      <v-btn class="ma-2" @click="showPrint = true"> Export </v-btn>
  </base-tool>
  <v-data-table
          v-if="filterTable.length"
          :headers="labels"
          :items="filterTable"
          multi-sort
   />

<v-dialog v-model="showPrint" xwidth="auto" :fullscreen="$vuetify.breakpoint.smAndDown">
  <front-json-to-csv v-if="filterTable.length"
                   :json-data="filterTable"
                   :csv-title="reportHeader"
                   @hideModal="showPrint = false"
                   @printed="showPrint=false"
                   :footer="realFooter"
                   :unique="unique"
                   :small="true">
  </front-json-to-csv>
</v-dialog>

 </v-container>
</template>

<script>
import { printJSON } from "@/api/zmlPrint.js"
import baseTool from '@/components/base/baseTool.vue'
import FrontJsonToCsv from '@/api/csv/FrontJsonToCsv.vue'
export default {
  name: "PrintTable",
  props:{
         reportHeader:{type:String, default:"reportHeader"},
         footer:{type:String, default:""},
         unique:{type:String, default:""},
         orDTTable: {default: []}
         },
  components: {baseTool, FrontJsonToCsv},
  data: () => ({
      showPrint: false,
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
        printJSON(this.orDTTable, this.labels, this.reportHeader)
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
    if (this.footer) this.realFooter = this.footer
    this.buildHeaders()

  },
}
</script>
