<template>
<!--
       Copied from TableAttendance under nuxt-attendance (freshNuxt)
-->
  <v-container fluid>

  <v-toolbar  dense  row  wrap color="primary">
      Attendance Data
     <v-spacer />
     <v-btn class="ma-2" @click="refresh"> Refresh </v-btn>
     <v-btn class="ma-2" @click="showTablePrint = true"> Export </v-btn>
     <v-back />
  </v-toolbar>

<!------------------SEARCH, ADD, REFRESH, EXPORT------------------------------------------->
   <v-card cols="12" class="row wrap text-center d-flex justify-space-between ma-0 mb-2">
      <base-search @clear="search=''" v-model="search" />
      <v-text-field
        v-model="room"
        label="Location"
        outlined
        dense
        class="ma-2"
        append-icon="mdi-close"
        @click:append="room = ''" />
      <v-text-field
        v-model="period"
        label="Period"
        outlined
        dense
        class="ma-2"
        append-icon="mdi-close"
        @click:append="period = ''" />

       <base-date v-model="searchDate" :curValue="searchDate" label="" />
    </v-card>

    <v-progress-linear
      v-show="loading"
      indeterminate
      color="grey darken-2"
    ></v-progress-linear>

<!-------------------TABLE------------------------------------------>
    <v-row>
       <v-col cols="12">
         <v-card  elevation="6">
           <v-data-table v-if="entityTableFilter.length"
                 :headers="entityTableHeader"
                 :items="entityTableFilter"
                 :search="search"
                 :items-per-page="30"
                 mobile-breakpoint="0"
                 :footer-props="{
                    'items-per-page-options': [10, 20, 30, 40, 50]
                  }"
           >
            <template v-slot:[`item.attendanceid`]>
            </template>
            <template v-slot:[`item.sessionid`]="{ item }">
             <div class="float-right">
              <v-btn icon class="mx-2" x-small  @click="markNotActive(item)">
                  <v-icon small color="red" class="my-1">mdi-delete</v-icon>
                  <!-- <template v-if="!$vuetify.breakpoint.mobile"> Delete </template> -->
              </v-btn>
             </div>
            </template>

           </v-data-table>
           {{ periodTable }}
         </v-card>
       </v-col>
    </v-row>
<!------------------TABLE END------------------------------------------->
  <v-card color="green" class="mt-2 pa-2 text-center">
     End Of {{ entity }} View Table
  </v-card>
<!------------------EXPORT------------------------------------------->
   <v-dialog v-model="showTablePrint"
             width="auto"
            :fullscreen="$vuetify.breakpoint.smAndDown">
    <front-json-to-csv v-if="entityTableFilter"
                   :json-data="entityTableFilter"
                   :csv-title="'Presensie Lys/Attendance Table'"
                   @hideModal="showTablePrint = false">
     <v-btn>
      Download with custom title
     </v-btn>
    </front-json-to-csv>
   </v-dialog>
<!------------------------------------------------------------->
  </v-container>
</template>

<script>
import { getters } from "@/api/store"
import { tableWork } from "@/views/AttendanceView.js"
//import { crudTask } from "@/viewcomponents/crud/crudTask.js"

// import TableStockCategoryForm from "@/components/crud/TableStockCategoryForm"
import FrontJsonToCsv from '@/api/csv/FrontJsonToCsv.vue'
import BaseSearch from '@/components/base/baseSearch.vue'
import BaseDate from '@/components/base/BaseDate.vue'
import VBack from '@/components/base/VBack.vue'

export default {
  name: "TableAttendance",
  props: ['entity'],
  components: {FrontJsonToCsv
            , BaseSearch
            , VBack
            , BaseDate
            },

  data: () => ({
      getZml: getters.getState({ object: "gZml" }),
      showAddTable: false,
      showTablePrint:false,
      search:'',
      updateMessage:'Create',
      periodTable:[],
      entityTable:[],
      entityTableHeader:[
           { value: 'attendanceid' }
          ,{ text: 'Staff', value: 'staff' }
          ,{ text: 'Location', value: 'location'}
          ,{ text: 'Period', value: 'period', align:'center'}
          ,{ text: 'Admin No', value: 'capture'}
          ,{ text: 'Date/Time', value: 'attendancedate', align:'center'}
          ,{ text: 'Student', value: 'student', align:'left'}
          ,{ text: 'Grade', value: 'grade', align:'left'}
          ,{ text: 'Session', value: 'sessionid', align:'center'}

      ],
      editTable:{attendanceid:'',name:'', staff:''},
      room:'',
      searchDate:'',
      period:'',
      loading:false,
  }),
  computed: {
    entityTableFilter() {
      //If the table is empty - return blank
      if (!this.entityTable.length) return []
      let workTable = this.entityTable
      let dlen = this.searchDate.length

      //Search for multiple queries in one loop - fast as possible
      workTable = this.entityTable.filter(e =>
        (!this.period || e.period == this.period)
        &&
        (!this.room || e.location == this.room)
        &&
        (!this.searchDate || e.attendancedate.substring(0,dlen) === this.searchDate)
      )

      // if (this.room && this.period && this.searchDate) {
      //   workTable = this.entityTable.filter(e => e.period == this.period
      //                                         && e.location == this.room
      //                                         && e.attendancedate.substring(0,dlen) === this.searchDate)
      // } else if (this.room && this.searchDate) {
      //   workTable = this.entityTable.filter(e => e.location == this.room
      //                                         && e.attendancedate.substring(0,dlen) === this.searchDate)
      // } else if (this.room && this.period) {
      //   workTable = this.entityTable.filter(e => e.location == this.room
      //                                         && e.period == this.period )
      // } else if (this.room ) {
      //   workTable = this.entityTable.filter(e => e.location == this.room)
      // } else if (this.searchDate ) {
      //   workTable = this.entityTable.filter(e => e.attendancedate.substring(0,dlen) === this.searchDate)
      // }
      return workTable
    }
  },
  methods: {
    retrieveForEditing(item) {
      console.log('retrie4edit',item)
      let index = tableWork.getIndex(item.attendanceid,this.entityTable)
      if (index !== -1) {
        this.updateMessage = 'Edit'
        this.editTable = this.entityTable[index]
        console.log('loaded:', this.editTable)
        this.showAddTable = true
      }
    },
    markNotActive(item) {
      tableWork.deleteData(item,this.refresh)
    },
    tableDone(response) {
      this.loading = false
//      if (crudTask.reportError(response)) return
      this.entityTable = response
    },
    tableDonePeriod(response) {
      this.loading = false
      this.PeriodTable = response
    },
    //--------------------------------------------------------------------------------
    clickOnForm(editTable,method){
      console.log(editTable, method)
      switch (method) {
       //  case 'cancel':
       //       console.log('we cancel')
       //       break
        default:
              alert('wat?')
             //crudTask.showError('We do not know about ' + method)
      }
      this.showAddTable = false
    },
    loadError(response) {
       console.log('loaderror',response)
    },
    refresh(response) {
      //If we have an error, report and wait.
      console.log('reponse error?',response)
      this.loading = true
      tableWork.getData('load'+this.$options.name, this.tableDone)
      tableWork.getPeriod('loadPer'+this.$options.name, this.tableDonePeriod)
    },
  },
  mounted() {
     console.log('Start' , this.$options.name)
     let today = new Date()
     let dd = String(today.getDate()).padStart(2, '0');
     let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
     let yyyy = today.getFullYear();
     this.searchDate = `${yyyy}-${mm}-${dd}`
     this.refresh()
  }
}
</script>