<template>
<v-container fluid>
<v-row>
  <v-col cols="12">
    <v-toolbar   row  wrap color="primary">
      Merit Score Allocation Section
      <v-spacer />
      <v-btn icon @click="testprint"> <v-icon> mdi-printer </v-icon></v-btn>
      <v-back />
  </v-toolbar>
  </v-col>
</v-row>

 <v-row>
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
     </v-row>

     <v-row dense>
      <v-col cols="12">
       <v-card color="blue lighten-5" class="ma-1">
         <v-data-table class="elevation-1"
                 :headers="meritHeader"
                 :items="meritListFilter"
                 :items-per-page="30"
                 :search="search"
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
                  <v-text-field label="Points" v-model="editedItem.point" />
                </v-flex>
                <v-flex xs12>
                  <v-textarea v-model="editedItem.defaultdescription"
                               label="Default Description" />
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
          <!-- <v-icon small class="mr-2" @click="doubleClickOnTableRow(item)">mdi-spade</v-icon> -->
         </template>
         <template v-slot:no-data>
          <v-btn color="primary">No Data to display</v-btn>
         </template>
        </v-data-table>
       </v-card>
      </v-col>
     </v-row>
    </v-container>
   </v-card>
  </v-col>
 </v-row>




</v-container>
</template>

<script>
import { getters } from "@/api/store"
import { zmlFetch } from '@/api/zmlFetch';
//import { infoSnackbar, errorSnackbar } from '@/api/GlobalActions';
//import FrontJsonToCsv from '@/api/csv/FrontJsonToCsv.vue'
import { printJSON } from "@/api/zmlPrint.js"
import VBack from '@/components/base/VBack.vue'
export default {
 name: "meritTable",
  props:{},
  components: {
    VBack
//    FrontJsonToCsv
//    ReportsTableSmall
//   ReportsTable

  },
  data: () => ({
   dialogEdit:false,
   editedIndex: -1,
   editedItem: {},
   getZml: getters.getState({ object: "gZml" }),
   reportHeader: null,
   sqlSelect: null,
   search: '',
   meritList:[],
   meritHeader:[{text: 'meritNo', value: 'meritid'}
              //, {text: 'Teacher', value: 'defaultpersmenemonic'}
              , {text: 'Description', value: 'defaultdescription'}
              , {text: 'Points', value: 'point'}
              ],
   selectedForPrint: {},
   showPrint:false,
   updateNeeded: {},
   updateSql: null,

  }),
  computed: {
    filterMeritList() {
      return this.meritList
    },
    formTitle() {
      return this.editedIndex === -1 ? "New Item" : "Edit Item";
    },
    makeAFooter() {
      return `<br>`
    },
    meritListFilter() {
      return this.meritList;
    }
  },
  methods: {
    testprint() {
      printJSON(this.meritList, this.meritHeader, 'Merit List Point Range')
    },
    editItem(item) {
      console.log('editItem', item)
      this.open(item)
      this.editedIndex = this.meritList.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialogEdit = true;
    },
    open (e) {
      this.updateNeeded = {u1:e.point, u2:e.defaultdescription}
      console.log('backup before we start : ', this.updateNeeded)
      return
    },

    save () {
      let e = this.editedItem
      console.log('save it 1', e, this.editedIndex)
      console.log('save it 2', this.editedItem)
      console.log('save it 3', this.updateNeeded)
      this.updateSql = null
      //console.log('before update - point = ', e.point)
      if (this.updateNeeded !== null
          && (this.updateNeeded.u1 !== e.point || this.updateNeeded.u2 !== e.defaultdescription) ) {
          this.updateSql = `update dkhs_meritlink \
                           set point = ${e.point}\
                             , defaultdescription = "${e.defaultdescription}"\
                           where meritid = ${e.meritid}`
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
        let index = this.meritList.findIndex(ele => ele.id == this.editedItem.id)
        console.log('index = ', index)
        this.meritList[index].point =  this.editedItem.point
    },
    close() {
      this.dialog = false
      this.updateNeeded = null
      this.$nextTick(() => {
        //this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },
    loadData(response) {
      this.meritList = []
      if (response !== undefined && response.errorcode && response.errorcode != 0) {
        alert('we had a loading error :-(')
        return
      } else {
        this.meritList = response
        this.meritHeader.push({ text: "Actions", value: "actions", sortable: false })
      }
      //console.log(this.subjectHeader)
    },
    doubleClickOnTableRow(i) {
      this.selectedForPrint = {meritid: i.meritid
     }
     this.hello(this.selectedForPrint)
    },

    hello(parms) {
      console.log('Hello:',parms)
      //this.sqlSelect = `SELECT s.meritstudentid, s.meritid, s.studentid, s.meritdte, s.confirmdte, s.persmenemonic \
      this.sqlSelect = `SELECT s.meritstudentid, s.meritid, s.studentid, s.meritdte, s.confirmdte, s.persmenemonic \
      ,s.description, l.point \
 FROM dkhs_meritstudent s, dkhs_meritlink l \
WHERE s.meritid = l.meritid`
  //and l.meritid = ${parms.meritid}`
      this.reportHeader = `MeritPrintList: ${parms.meritid}`
      //this.showSelection = false
      alert('here we call next step')
    }
  },
  mounted: function() {
    let ts = {task: 'PlainSql',
               sql: 'select * from dkhs_meritlink'
             }
    zmlFetch(ts, this.loadData)
  },
  watch:{}

}
</script>
