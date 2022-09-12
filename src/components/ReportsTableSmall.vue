<template>
 <v-container fluid>
   <h3 class="text-center ma-2"> {{ reportHeader }} </h3>
    <v-card cols="12" class="row wrap text-center d-flex justify-space-between ma-0 mb-2">
      <v-btn class="ma-2" @click="showPrint = true"> Export </v-btn>
    </v-card>
    <v-data-table
          v-if="filterTable.length"
          :headers="labels"
          :items="filterTable"
    />

<v-dialog v-model="showPrint" xwidth="auto" :fullscreen="$vuetify.breakpoint.smAndDown">
  <front-json-to-csv v-if="filterTable2.length"
                   :json-data="filterTable2"
                   :csv-title="reportHeader"
                   @hideModal="showPrint = false"
                   @printed="showPrint=false"
                   :footer="realFooter"
                   :unique="unique"
                   :small="true">
   <v-btn>
      Download with custom title
   </v-btn>
  </front-json-to-csv>
</v-dialog>

 </v-container>
</template>

<script>
import { zmlFetch } from '@/api/zmlFetch';
import FrontJsonToCsv from '@/api/csv/FrontJsonToCsv.vue'
import { errorSnackbar } from "@/api/GlobalActions"
export default {
  name: "ReportsTableSmall",
  props:{
         sqlSelect:{type:String, required:true},
         reportHeader:{type:String, default:"reportHeader"},
         entity:{type:String},
         footer:{type:String, default:""},
         unique:{type:String, default:""}
         },
  components: {FrontJsonToCsv},
  data: () => ({
      showPrint: true,
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
       //If the table is empty - return blank
       //console.log('check emp')
        if (!this.orDTTable.length) {
          return []
        }
        //console.log('check searc',this.orDTTable)
        if (this.search.length == 0) return this.orDTTable

        // now we apply all the switches, and then search for the searchstring
        //console.log('apply swi',this.orDTTable)
        return this.orDTTable.filter(ele => {
          //console.log(this.search.toLowerCase() , ele.grade.substr(0,this.search.length).toLowerCase())
          return this.search.toLowerCase() == ele.grade.substr(0,this.search.length).toLowerCase()
        })
    },
    filterTable2() {
      let prTab = []
      let id  = 1
      this.filterTable.forEach(e => {prTab.push({no: id++,
                                            studno: e.studentid,
                                            surname: e.surname,
                                            firstname: e.firstname,
                                            grade: e.grade,
                                            teacher: e.teacher,
                                            examdate: e.examdate,
                                            learnassist: e.learnassist,
                                            present: ''})
      })
      return prTab
    }
  },
  methods:{
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
      //console.log('start build headers')
      Object.keys(this.orDTTable[0]).forEach(ele => {
        //console.log(ele)
        this.labels.push( {text:ele, value:ele} )
      })
    }

  },
  mounted() {
    //console.log('started ', this.$options.name)
    if (this.sqlSelect) this.getData()
    if (this.footer) this.realFooter = this.footer
    //console.log('footer ', this.realFooter)

  },
  watch:{
      sqlSelect() {
        //console.log(this.$options.name,'watchers', this.sqlSelect)
        if (this.sqlSelect) this.getData()
      }
  }

}
</script>
