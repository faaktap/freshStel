<template>
<v-container fluid>
  <v-row  v-if="showSelection">
   <v-col cols="12">
    <v-card xcolor="deep-purple lighten-4">
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
      </v-row>
      <v-row dense>
       <v-col cols="12">
        <v-card color="blue lighten-5" class="ma-1">
         <div>
          <v-card class="text-center ma-2 pa-2" color="primary gray--text text--lighten-3">
            Eksamen Vraestel Afrol Klasse
          </v-card>
          <v-data-table
                 :headers="subjectHeader"
                 :items="subjectList"
                 :items-per-page="30"
                 :search="search"
                  class="elevation-1"
                  color="purple lighten-3"
                 @dblclick:row="doubleClickOnTableRow"
           >
      <template v-slot:[`item.venue`]="props">
        <v-edit-dialog
          :return-value.sync="props.item.venue"
          @save="save(props.item)"          @cancel="cancel(props.item)"
          @open="open(props.item)"          @close="close(props.item)">
          {{ props.item.venue }}
          <template v-slot:input>
            <div class="mt-4 text-h6"> Update Venue {{props.item.id}}</div>
            <z-auto-place :value="props.item.venue"
                          v-model="props.item.venue"
                         @input="props.item.venue = $event.target.value"
                         @try="value = $event.target.value"
                           />
            <!-- <v-text-field
              v-model="props.item.venue"
              label="Edit"
              single-line
              counter
            ></v-text-field> -->
            <div class="mb-4">Press Enter to save, esc to cancel </div>
          </template>
        </v-edit-dialog>
      </template>
      <template v-slot:[`item.examdate`]="props">
        <v-edit-dialog
          :return-value.sync="props.item.examdate"
          @save="save(props.item)"          @cancel="cancel(props.item)"
          @open="open(props.item)"          @close="close(props.item)"
        >
          {{ props.item.examdate }}
          <template v-slot:input>
            <div class="mt-4 text-h6"> Update Examination Date  {{props.item.id}}</div>
          <v-date-picker v-model="props.item.examdate" dense
                   picker-date  no-title  close-on-content-click
           >
           </v-date-picker>
            <div class="mb-4">Press Enter to save, esc to cancel </div>
          </template>
        </v-edit-dialog>
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

     <reports-table v-if="sqlSelect"
     :reportHeader="reportHeader"
     :sqlSelect="sqlSelect"
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
import { zmlFetch } from '@/api/zmlFetch';
import ReportsTable from '@/components/ReportsTable.vue'
import ZAutoPlace from '@/components/fields/ZAutoPlace.vue'
export default {
 name: "EksamenDruk",
  props:{},
  components: {
    ReportsTable,
    ZAutoPlace
  },
  data: () => ({
   reportHeader: null,
   sqlSelect: null,
   search: '',
   subjectList:[],
   subjectHeader:[],
   selectedForPrint: {subject:'', grade:'', teacher:''},
   showSelection: true,
   updateNeeded: {},
   updateSql: null
  }),
  computed: {
  },
  methods: {
      save (e) {
        this.updateSql = null
        if (this.updateNeeded !== null && (this.updateNeeded.u1 !== e.examdate || this.updateNeeded.u2 !== e.venue)) {
          this.updateSql = `update dkhs_subjectgroup set examdate = '${e.examdate}', venue = '${e.venue}' \
                      where id = ${e.id}`
        }
        if (this.updateSql) {
            let ts = {task: 'PlainSql',
               sql: this.updateSql
             }
          zmlFetch(ts, this.noNeedToDoAnything)
        }
      },
      noNeedToDoAnything(response) {
        if (response.errorcode !== 0) {
          alert('some error occured on update')
          console.error('after update error: ', response)
        }
      },
      cancel () {
        this.updateNeeded = null
      },
      open (e) {
        this.updateNeeded = {u1:e.examdate, u2:e.venue}
      },
      close () {
        this.updateNeeded = null
      },



    doubleClickOnTableRow(e,i) {
      console.log('e1.item.grade', i.item.grade, e.clientX)
      this.selectedForPrint = {subject: i.item.subjectname
                             , grade: i.item.grade
                             , teacher: i.item.teacher}
     this.hello(this.selectedForPrint)
    },
    loadData(response) {
      this.subjectList = []
      if (response !== undefined && response.errorcode && response.errorcode != 0) {
        alert('we had a loading error :-(')
      } else {
        this.subjectList = response
        Object.keys(this.subjectList[0]).forEach(name => {
            this.subjectHeader.push(
                 { text:name.charAt(0).toUpperCase() + name.slice(1), value: name} )
        })
      }
      console.log(this.subjectHeader)
    },
    hello(parms) {
      this.sqlSelect = `select s.studentid \
   , s.surname\
	 , s.firstname\
	 , concat(s.grade,'.', s.gclass) grade\
	 , g.venue\
	 , g.examdate\
	 , g.teacher\
 from dkhs_student s\
    , dkhs_subjectgroup g\
	, dkhs_studsub ss\
 where s.studentid = ss.studentid\
   and g.hodsubjectid = ss.hodsubjectid\
   and g.teacher = ss.teacher\
   and g.teacher = '${parms.teacher}' \
   and g.subjectname = '${parms.subject}' \
   and s.grade = '${parms.grade}'
   and g.grade = '${parms.grade}'`
      this.reportHeader = `Eksamen Lys vir ${parms.grade} ${parms.teacher} ${parms.subject}`
      this.showSelection = false
    }
  },
  mounted: function() {
    let ts = {task: 'PlainSql',
               sql: 'select * from dkhs_subjectgroup order by grade, subjectname, teacher'
             }
    zmlFetch(ts, this.loadData)
  }

}
</script>
