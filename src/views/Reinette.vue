<template>
<v-container fluid>
 <v-row  v-if="showSelection">
  <v-col cols="12">
   <v-card elevation="-2">
    <v-container fluid color="gray--text text--lighten-5">
     <v-row >
      <v-col>
       <v-text-field
           v-model="search"
           append-icon="mdi-magnify"
           label="Search"
           single-line
           hide-details
       />
      </v-col>
      <v-col>
<!------------------SWITCH------------------------------------------->
       <v-card class="col wrap text-center d-flex justify-space-between ml-0 mt-1 mb-2 pl-1 pr-1">
           <v-switch v-model="g12" hide-details class="mt-1 mr-2 mb-2 ml-2" label="G12"></v-switch>
           <v-switch v-model="g11" hide-details class="mt-1 mr-2 mb-2 ml-2" label="G11"></v-switch>
           <v-switch v-model="g10" hide-details class="mt-1 mr-2 mb-2 ml-2" label="G10"></v-switch>
           <v-switch v-model="g9" hide-details class="mt-1 mr-2 mb-2 ml-2" label="G9"></v-switch>
           <v-switch v-model="g8" hide-details class="mt-1 mr-2 mb-2 ml-2" label="G8"></v-switch>
       </v-card>
<!-------------------TABLE------------------------------------------>
      </v-col>
     </v-row>
     <v-row dense>
      <v-col cols="12">
       <v-card color="blue lighten-5" class="ma-1">
        <div>
         <v-card class="text-center ma-2 pa-2" color="primary gray--text text--lighten-3">
            Eksamen Vraestel Afrol Klasse
         </v-card>
         <v-data-table class="elevation-1"
                 :headers="subjectHeader"
                 :items="subjectListFilter"
                 :items-per-page="30"
                 :search="search"
                 @dblclick:row="doubleClickOnTableRow"
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
          <v-icon small class="mr-2" @click="editItem(item)">mdi-pencil</v-icon>
          <v-icon small class="mr-2" @click="doubleClickOnTableRow(item)">mdi-printer</v-icon>
         </template>
         <template v-slot:no-data>
          <v-btn color="primary">No Data to display</v-btn>
         </template>
        </v-data-table>
        </div>
       </v-card>
      </v-col>
     </v-row>
    </v-container>
   </v-card>
  </v-col>
 </v-row>

  <v-row v-else>
   <v-col cols="12">
    <v-card class="text-center ma-2 pa-4" color="primary">
      <span class="text-md-h4 text-bold"> Spesifieke Eksamen Vraestel Studente Lys</span>
       <v-btn class="float-right" @click="showSelection = true"> Back to Selection </v-btn>
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
            <v-btn class="float-right" @click="showSelection = true"> Back to Selection </v-btn>
       </v-card>
    </v-col>
  </v-row>


</v-container>
</template>

<script>
import { getters } from "@/api/store"
import { zmlFetch } from '@/api/zmlFetch';
import { infoSnackbar, errorSnackbar } from '@/api/GlobalActions';
import ReportsTableSmall from '@/components/ReportsTableSmall.vue'
import AutoSelRoom from '@/components/AutoSelRoom.vue'
import BaseDate from "@/components/base/BaseDate.vue"
export default {
 name: "EksamenDruk",
  props:{},
  components: {
    ReportsTableSmall,
    //ZAutoPlace,
    AutoSelRoom ,
    BaseDate,
  },
  data: () => ({
   dialogEdit:false,
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
               <tr>
                <th>EDUCATOR:</th><td align=left>${this.selectedForPrint.teacher} :: ${this.selectedForPrint.totalstudents}</td>\
                <th>VENUE:</th><th align=left>${this.selectedForPrint.venue} </th>\
               </tr>\
               <tr>\
                <th>SUBJECT:${this.selectedForPrint.grade}</th><td align=left>${this.selectedForPrint.subject} </td>\
                <th width=20%>Checked By:</th><td width=30%></td>\
               </tr>\
               <tr>\
                <th>EXAMINATION DATE:</th><td align=left>${this.selectedForPrint.examdate}</td>\
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
      console.log('save it', e, this.editedIndex , this.editedItem)
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
         zmlFetch(ts, this.noNeedToDoAnything)
      }
      this.dialogEdit = false
    },
    noNeedToDoAnything(response) {
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
    // cancel () {
    //     this.updateNeeded = null
    //     return
    // },
    // open (e) {
    //     this.updateNeeded = {u1:e.examdate, u2:e.venue}
    //     return
    // },
    close() {
      this.dialog = false
      this.updateNeeded = null
      this.$nextTick(() => {
        //this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },
    doubleClickOnTableRow(i) {
      if (!i.venue) {
        infoSnackbar('Please provide a venue, by clicking on the venue button or column.')
        return
      }
      if (!i.examdate) {
        errorSnackbar('We need an examination date before we print, click on the examdate column or button')
        //return
      }
      this.selectedForPrint = {subject: i.subjectname
                             , grade: i.grade
                             , teacher: i.teacher
                             , examdate: i.examdate
                             , venue: i.venue
                             , totalstudents: i.totalstudents}
     this.hello(this.selectedForPrint)
    },
    loadData(response) {
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
   and s.grade = '${parms.grade}'\
   and g.grade = '${parms.grade}'`
      this.reportHeader = `ExamPrintList: ${parms.grade} ${parms.teacher} in ${parms.venue} on ${parms.examdate}`
      this.showSelection = false
    }
  },
  mounted: function() {
    let ts = {task: 'PlainSql',
               sql: 'select id, subjectname,teacher,examdate,venue,grade,totalstudents from dkhs_subjectgroup order by grade, subjectname, teacher'
             }
    zmlFetch(ts, this.loadData)
  }

}
</script>
