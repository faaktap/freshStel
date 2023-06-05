<template>
<v-container  v-if="staffList" fluid>
 <!-- See https://grid.layoutit.com/ for gridlayouts -->

  <v-toolbar v-if="allowEdit==true" dense  row  wrap color="primary">
    Actions
      <v-spacer />
        <v-btn small class="ma-2" @click="addPersonel">
         Add
        </v-btn>
        <v-btn small class="ma-2" @click="printPersonel">
         Print
        </v-btn>
  </v-toolbar>

  <v-data-table
    v-if="staffList"
    :headers="staffHeaders"
    :items="staffList"
    :items-per-page="15"
    class="elevation-1"
    color="purple lighten-3"
    loading="tableLoading"
    loading-text="Loading... Please wait"
    multi-sort
    @click:row="updatePersonel"
  >
      <template v-slot:[`item.data.heidiid`]="{ item }">
        <v-btn class="mx-2"
               small
               title="Click here to edit"
               @click="updatePersonel(item)">
          <v-icon dark>mdi-account-edit</v-icon>
        </v-btn>
      </template>
      <template v-slot:top>
        <v-card color="green darken-1" align="center" class="ma-2 pa-2">
            {{ staffList.length }} entries
        </v-card>
      </template>
  </v-data-table>


<v-dialog v-model="showPersPrint" xwidth="auto " :fullscreen="$vuetify.breakpoint.smAndDown">
  <front-json-to-csv v-if="jsonList"
                   :json-data="jsonList"
                   @hideModal="showPersPrint = false"
                   :csv-title="'My Test csv title'">
   <v-btn>
      Download with custom title
   </v-btn>
  </front-json-to-csv>
</v-dialog>

 <v-dialog v-model="showPersUpdate"
          v-if="showPersUpdate && pers"
          xwidth="auto " :fullscreen="$vuetify.breakpoint.smAndDown" >
  <personel-edit @savePers="savePers" :pers="pers.data">   </personel-edit>
 </v-dialog>

 </v-container>
</template>

<script>
import { zmlConfig } from '@/api/constants';
import { zmlFetch } from '@/api/zmlFetch.js';
import PersonelEdit from '@/components/staff/PersonelEdit';
import FrontJsonToCsv from '@/api/csv/FrontJsonToCsv.vue'
export default {
    name:"PersonelNameList",
    components:{PersonelEdit, FrontJsonToCsv},
    props: ['staffList','allowEdit'],
    data: () => ({
      showPersUpdate:false,
      showPersPrint:false,
      pers:null,
      titles:['Mnr','Mr','Mev','Me','Ms','Mej','Miss','Dr','Prof','Rev'],
      workarea:['Finance','Admin','Teacher','Support','Graadhoof','Ontvangs','Sport'],
      staffHeaders: [
          {text: 'id',              value: 'data.persid' },
          {text: 'username',        value: 'data.menemonic' },
          {text: 'Work Area',   value: 'data.workarea' },
          {text: 'Menemonic',   value: 'data.menemonic' },
          {text: 'Surname',         value: 'data.surname' },
          {text: 'Name',            value: 'data.name' },
          {text: 'Room',            value: 'data.room' },
          {text: 'Email',           value: 'data.email' },
          {text: 'Contact Number',  value: 'data.contactnumber' },
          {text: 'Grade',       value: 'data.registergrade' },
          {text: "action",          value: "data.heidiid", sortable: false }
        ],
       jsonList:[],
   }),
    methods:{
      printPersonel(){
         this.showPersPrint = true
      },
      addPersonel(){
           this.pers = { data: { persid: null
                   , username: null
                   , menemonic: null
                   , staffid: null
                   , heidiid: 123
                   , registergrade: null
                   , registerclass: null
                   , subjectid: null
                   , gender : 'male'
                   , surname: null
                   , name: null
                   , title: null
                   , contactnumber: null
                   , workarea: null
                   , room: null
                   , photo: null
                   , workemail: null
                   , email: null
                   , wcgschoolsid: null
                   , description: "First Load/Created in Fresh"
                   , public_preferredname: null
                   , public_vakke: null
                   , public_ander: null
                   , public_history: null
                   , public_email: null
                   , address: null
                   , IDNumber: null
                   , changedate: null
            }}
            this.showPersUpdate = true
      },
      updatePersonel(item) {
        this.pers = item
        this.showPersUpdate = true
      },
      savePers() {
        let ts = {};
        ts.task = 'updateStaff';
        ts.data = this.pers.data
        ts.api = zmlConfig.apiDKHS
        zmlFetch(ts, this.afterUpload, this.errorSave);

      },
      afterUpload(response) {
        if (response.error) {
           alert(response.error)
        } else {
           this.showPersUpdate = false
        }
      },
      errorSave(error) {
          alert(error.error)
      }
    },
   watch:{
      staffList: function() {
          this.jsonList = []
          this.staffList.forEach(ele => {
              this.jsonList.push(ele.data)
          });
      }
   },
    mounted: function() {
      if (this.staffList) {
          this.jsonList = []
          this.staffList.forEach(ele => {
              this.jsonList.push(ele.data)
          });
      }
    },
}
</script>