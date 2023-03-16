<template>
<v-container fluid>
  <hero-section name="forDB"
              bgpicture="https://www.zmlrekenaars.co.za/test/img/wall042.jpg"
              title="Reinette se afrol lyste vir eksamen"
              text=""
              breakup1="100"
              breakup2="20"
              color="purple darken-1"
               />
<!-- <base-tool :toolList="[]"
            toolbarName="Reinette se afrol lyste vir eksamen"
           :loading="loading"
            >
            <v-btn icon @click="showExport = !showExport">
            E
           </v-btn>
</base-tool> -->


<v-container v-if="showSelection" fluid color="gray--text text--lighten-5">
<base-tool
            toolbarName="Options"
           :background="false"
           :loading="loading"
            back="false"
            class="ma-0 pa-0"
            >

       <v-text-field
           v-model="search"
           append-icon="mdi-magnify"
           label="Search"
           color="white"
           single-line
           class="mt-3"
           xxhide-details
           clearable
       />
       <v-spacer />
           <v-switch inset dense color="warning" v-model="g12" hide-details class="mr-2 ml-2" label="12" />
           <v-switch inset dense color="warning" v-model="g11" hide-details class="mr-2 ml-2" label="11" />
           <v-switch inset dense color="warning" v-model="g10" hide-details class="mr-2 ml-2" label="10" />
           <v-switch inset dense color="warning" v-model="g9"  hide-details class="mr-2 ml-2" label="9" />
           <v-switch inset dense color="warning" v-model="g8"  hide-details class="mr-2 ml-2" label="8" />
           <v-btn icon @click="showExport = !showExport">            E           </v-btn>

</base-tool>

      <v-data-table class="elevation-1"
                 :headers="subjectHeader"
                 :items="subjectListFilter"
                 :items-per-page="30"
                 :search="search"
                 @dblclick:row="doubleClickOnTableRow"
                  mobile-breakpoint="0"
      >
         <!--https://blog.devgenius.io/vuetify-edit-table-content-cd57d11ae850-->
         <template v-slot:[`top`]>
          <v-dialog v-model="dialogEdit" max-width="500px">
           <v-card>
            <v-card-title>
              <span class="headline">{{ formTitle }}</span>
            </v-card-title>
            <v-card-text>
              <v-layout row wrap align-content-start justify-space-around class="ma-2 pa-2">
                <v-flex xs12>
                  <auto-sel-room id="zyx4"
                     asLabel="Room"
                    :initialValue="editedItem.venue"
                    :itemObj="getZml.place"
                     v-model="editedItem.venue"
                  />
                </v-flex>
                <v-flex xs12>
                  <base-date v-model="editedItem.examdate"
                             label="ExamDate"
                             instructions="FA"
                  />
                </v-flex>
              </v-layout>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="dialogEdit=false">Cancel</v-btn>
              <v-btn color="blue darken-1" text @click="save">Save</v-btn>
            </v-card-actions>
          </v-card>
         </v-dialog>
         </template>
         <template v-slot:[`item.actions`]="{ item }">
          <v-icon sxxmall class="mr-2" @click="editItem(item)">mdi-pencil</v-icon>
          <v-icon smxxall class="mr-2" @click="printList(item)">mdi-printer</v-icon>
         </template>
         <template v-slot:no-data>
          <v-btn color="primary">No Data to display</v-btn>
         </template>
      </v-data-table>
  </v-container>


<!-- ----------------------------SUB SELECTION ----------------------------------------------- -->
  <v-row v-else>
   <v-col cols="12">
    <v-card class="text-center ma-2 pa-4" color="primary">
      <span class="text-md-h4 text-bold"> Spesifieke Eksamen Vraestel Studente Lys</span>
      <v-btn icon class="float-right"
            @click="showSelection = true"
            title="Go back to all entries..">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-card>

     <reports-table-small
        v-if="sqlSelect"
       :reportHeader="reportHeader"
       :sqlSelect="sqlSelect"
       :footer="makeAFooter"
        unique="exmPrintLst"
     />
       <v-card class="text-center ma-2 pa-4" color="primary">
            Spesifieke Eksamen Vraestel Studente Lys se Einde
            <v-btn icon class="float-right" @click="showSelection = true">
              <v-icon>mdi-close</v-icon>
            </v-btn>
       </v-card>
    </v-col>
  </v-row>

<v-dialog v-model="showExport">
 <v-card color="red" v-if="showExport">
  <front-json-to-csv :json-data="subjectListFilter"
                     :csv-title="'Reinette se Data vir Eksamen'"
                     @hideModal="showExport = false">
  </front-json-to-csv>
 </v-card>
</v-dialog>


</v-container>
</template>

<script>
import { getters } from "@/api/store"
import { zmlFetch } from '@/api/zmlFetch';
//import { infoSnackbar, errorSnackbar } from '@/api/GlobalActions';
import FrontJsonToCsv from '@/api/csv/FrontJsonToCsv.vue'
import ReportsTableSmall from '@/components/ReportsTableSmall.vue'
import AutoSelRoom from '@/components/fields/AutoSelRoom.vue'
import BaseDate from "@/components/base/BaseDate.vue"
import baseTool from '@/components/base/baseTool.vue'
import HeroSection from "@/views/sections/HeroSection"

export default {
 name: "EksamenDruk",
  props:{},
  components: {
    ReportsTableSmall,
    HeroSection,
    AutoSelRoom ,
    BaseDate,
    baseTool,
    FrontJsonToCsv
  },
  data: () => ({
   showExport: false,
   dialogEdit:false,
   loading:false,
   editedIndex: -1,
   editedItem: {},
   getZml: getters.getState({ object: "gZml" }),
   reportHeader: null,
   sqlSelect: null,
   search: '',
   subjectList:[],
   subjectHeader:[],
   selectedForPrint: {subject:'', grade:'', teacher:''},
   showSelection: true,
   updateNeeded: {},
   updateSql: null,
   g8:false,   g9:false,   g10:false,
   g11:true, g12:true
  }),
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "New Item" : "Edit Item";
    },
    makeAFooter() {
      return `<br><br>\
              <table class="table ma-2 pa-2" BORDER=2 BORDERCOLOR="#4a6053" width=96% style='text-align: right; border-spacing: 2px;'>\
               <tr >
                <th>EDUCATOR:</th><td align=left style="padding-left: 10px;">${this.selectedForPrint.teacher} :: ${this.selectedForPrint.totalstudents}</td>\
                <th>VENUE:</th><th align=left style="padding-left: 10px;">${this.selectedForPrint.venue || ''} </th>\
               </tr>\
               <tr>\
                <th>SUBJECT:${this.selectedForPrint.grade}</th><td align=left style="padding-left: 10px;">${this.selectedForPrint.subject} </td>\
                <th width=20%>Checked By:</th><td width=30%></td>\
               </tr>\
               <tr>\
                <th>EXAMINATION DATE:</th><td align=left style="padding-left: 10px;">${this.selectedForPrint.examdate || ''}</td>\
                <th width=20%>Invigilator/Toesighouer:</th><td width=30%></td>\
                </tr>\
              </table>`
    },
    subjectListFilter() {
      if (!this.subjectList.length) return [];
      if (this.g8 || this.g9 || this.g10 || this.g11|| this.g12) {
         let answer = this.subjectList.filter(ele => {
            if (this.g8 && ele.grade == 'G08') return true
            if (this.g9 && ele.grade == 'G09') return true
            if (this.g10 && ele.grade == 'G10') return true
            if (this.g11 && ele.grade == 'G11') return true
            if (this.g12 && ele.grade == 'G12') return true
            return false
          })
         return answer
      }
      return this.subjectList;
    }
  },
  methods: {
    editItem(item) {
      console.log('editItem', item)
      this.editedIndex = this.subjectListFilter.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialogEdit = true;
      if (this.editedItem.examdate && this.editedItem.examdate.indexOf('0000') > -1) {
           this.editedItem.examdate = ''
      }
    },
    isValidDate(d) {
      return d instanceof Date && !isNaN(d);
    },
    save () {
      //console.log('save it', e, this.editedIndex , this.editedItem) -- this gave "Reference Error: Cannot access e before inizialiation! (only in Okt 2022)"
      let e = this.editedItem
      this.updateSql = null
      if (e.venue && e.venue.length > 9) {
          const index = e.venue.lastIndexOf('(');
          e.venue = e.venue.substr(0,index)
      }
        //console.log('before update - venue = ', e.venue)
      if (this.updateNeeded !== null
          && (this.updateNeeded.u1 !== e.examdate || this.updateNeeded.u2 !== e.venue)) {
          this.updateSql = `update dkhs_subjectgroup \
                           set examdate = '${e.examdate}', venue = '${e.venue}' \
                           where id = ${e.id}`
      }
      if (this.updateSql) {
         let ts = {task: 'PlainSql',sql: this.updateSql}
         this.loading = true
         zmlFetch(ts, this.noNeedToDoAnything)
      }
      this.dialogEdit = false
    },
    noNeedToDoAnything(response) {
        this.loading = false
        if (response.errorcode !== 0) {
          alert('some error occured on update')
          console.error('after update error: ', response)
        }
        console.log('hewe we could do the final update to the memory list')
        console.log('replace this ids data', this.editedItem.id)
        let index = this.subjectList.findIndex(ele => ele.id == this.editedItem.id)
        console.log('index = ', index)
        this.subjectList[index].venue =  this.editedItem.venue
        this.subjectList[index].examdate =  this.editedItem.examdate

    },
    close() {
      this.dialog = false
      this.updateNeeded = null
      this.$nextTick(() => {
        //this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    doubleClickOnTableRow(i) {
      console.log(i)
      return  // do not allow double click at the moment
    },
    printList(i) {
      this.selectedForPrint = {subject: i.subjectname
                             , grade: i.grade
                             , teacher: i.teacher
                             , examdate: i.examdate
                             , venue: i.venue
                             , totalstudents: i.totalstudents}
     this.hello(this.selectedForPrint)
    },
    loadData(response) {
      this.loading = false
      this.subjectList = []
      if (response !== undefined && response.errorcode && response.errorcode != 0) {
        alert('we had a loading error :-(')
        return
      } else {
        this.subjectList = response

        Object.keys(this.subjectList[0]).forEach(name => {
            this.subjectHeader.push(
                 { text:name.charAt(0).toUpperCase() + name.slice(1), value: name} )
        })
        this.subjectHeader.push({ text: "Actions", value: "actions", sortable: false })

      }
      //console.log(this.subjectHeader)
    },
    hello(parms) {
      let cKeyIdx = parms.subject.indexOf('.')
      let cKey = ''
      if (cKeyIdx > -1) {
          cKey = parms.subject.substr(cKeyIdx+1,1)
      }
      this.sqlSelect = `select s.studentid\
 , s.surname\
 , s.firstname\
 , concat(s.grade,'.', s.gclass) grade\
 , g.venue\
 , g.examdate\
 , g.teacher\
 , IF( EXISTS(SELECT studentid FROM dkhs_learnassist WHERE studentid = s.studentid), 'BUR', '') learnassist\
 from dkhs_student s\
    , dkhs_subjectgroup g\
	, dkhs_studsub ss\
 where s.studentid = ss.studentid\
   and g.hodsubjectid = ss.hodsubjectid\
   and g.teacher = ss.teacher\
   and g.teacher = '${parms.teacher}'\
   and g.subjectname = '${parms.subject}'\
   and ss.ckey = '${cKey}'\
   and s.grade = '${parms.grade}'\
   and g.grade = '${parms.grade}'`
      this.reportHeader = `ExamPrintList: ${parms.grade} ${parms.teacher}` // in ${parms.venue} on ${parms.examdate}`
      this.showSelection = false
    }
  },
  created: function() {
    this.loading = true
    let ts = {task: 'PlainSql',
               sql: `select id, subjectname,teacher,examdate,venue,grade,totalstudents \
                    from dkhs_subjectgroup \
                    order by grade, subjectname, teacher`
             }
    zmlFetch(ts, this.loadData)
  },
  mounted: function() {
    console.log('Mounted:', this.$options.name)
  }

}
</script>