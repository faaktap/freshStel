<template>
  <v-container>
   <v-row><v-col cols="12">

<v-toolbar  dense  row  wrap color="primary">
      School Subjects
      <v-spacer />
      <v-back />
</v-toolbar>

     <!-- <v-card class="ma-2 text-center" >
     <h1> School Subjects </h1>
     </v-card> -->

    <v-card class="mx-auto">
       <v-container>
         <v-layout>
         <v-flex>
        <v-text-field
           v-model="search"
           append-icon="mdi-magnify"
           label="Search"
           single-line
           hide-details
         ></v-text-field>
         </v-flex>
         </v-layout>
         <v-row dense>
           <v-col cols="12">
             <v-card color="purple lighten-5">
               <div>
   <v-data-table
    v-if="subjectList && subjectList.length > 0"
    :headers="logHeader"
    :items="subjectList"
    :items-per-page="15"
    :search="search"
    class="elevation-1"
    color="purple lighten-3"
    loading="tableLoading"
    loading-text="Loading... Please wait"
    multi-sort
    @click:row="onButtonClick"
  >
      <template v-slot:[`item.action`]="{ item }">
        <v-btn class="mx-2"
               icon
               :title="item.color"
               @click="onButtonClick(item)">
          <template v-if="item.color.length==0">
          <v-icon dark>mdi-coffee</v-icon>
          </template>
          <template v-else>
            <v-icon dark :color="item.color">mdi-heart-box</v-icon>
          </template>
        </v-btn>
      </template>
      <template v-slot:top>
        <v-card color="green darken-1" align="center" class="ma-2 pa-2">
            A list of all subjects presented in subject list for students
        </v-card>
      </template>
      <template v-slot:[`footer.page-text`]>
         <v-btn @click="getSubjects"
                title="Click here to refresh subjects"
         ><v-icon>mdi-table-refresh</v-icon></v-btn>
       <v-btn icon @click="insertSubject">
           <v-icon >mdi-table-plus</v-icon>
        </v-btn>
      </template>
  </v-data-table>

                 </div>

             </v-card>
           </v-col>
         </v-row>
       </v-container>
    </v-card>
   </v-col></v-row>
<v-dialog v-model="showSubjectsChange" width="50%">
  <subject-edit
      :sub="curItem"
      @saveSubject="saveSubject"
      />
</v-dialog>
  </v-container>
</template>


<script>
import { getters } from "@/api/store"
import { zmlConfig } from '@/api/constants'
import { zmlFetch } from "@/api/zmlFetch"
import { errorSnackbar, infoSnackbar } from '@/api/GlobalActions'
import SubjectEdit from '@/components/learn/SubjectEdit'
//import VBack from '@/components/base/VBack.vue'
export default {
    name:"ViewSubjects",
    components:{
      SubjectEdit
    //  , VBack
    },
    props: [],
    data: () => ({
        getZml: getters.getState({ object: "gZml" }),
        showSubjectsChange:false,
        curItem:{},
        search:null,
        subjectList:null,
        tableLoading:false,
        logHeader: [
          {text: 'Shortname',             value: 'shortname' },
          {text: 'Description',         value: 'description' },
          {text: 'Beskrywing',         value: 'beskrywing' },
          {text: 'color',             value: 'color' },
          {text: 'linkid',             value: 'linksubjectid' },
          {text: 'Sort',             value: 'sortorder' },
          {text: "edit",             value: "action", sortable: false }
        ]
    }),
    methods:{
      onButtonClick(data) {
        this.showSubjectsChange = true
        this.curItem = data
        //this.$cs.l(data)
      },
      insertSubject() {
        for (const key of Object.entries(this.curItem)) {
          this.curItem[key] = ''
        }
        this.showSubjectsChange = true
      },
      saveSubject(data) {
        let ts = {}
        ts.data = data
        ts.task = 'saveSubject'
        ts.api = zmlConfig.apiDKHS
        zmlFetch(ts, this.getSubjects, this.processError)
        this.showSubjectsChange = false
      },
      getSubjects() {
        this.tableLoading = true
        let sl = { task: 'plainSql'
                 , sql: "SELECT * "
                      + " FROM dkhs_lsubject s"
                      + " order by sortorder DESC"}
        zmlFetch(sl, this.processAfterFetch, this.processError);
      },
      processAfterFetch(response) {
          if (!response.error) {
             this.subjectList = response
          } else {
            alert('we have an error:' + response.errorcode + ' on fetching subjects')
          }
          this.tableLoading = false
      },
      processError(response) {
        this.$cs.l('ERROR on subject list : ' , response)
      },
      updateSubject() {
        alert('no used')
        // let sl = { task: 'plainSql'
        //          , sql: "update dkhs_learner "
        //               + "   set user_password = 'password' "
        //               + " where userid = " + this.curItem.userid
        //          }
        // zmlFetch(sl, this.processAfterReset, this.processError);
      },
      processAfterReset(response) {
          if (!response.error == 0) {
             infoSnackbar('Update was done')
          } else {
             errorSnackbar('we have an error:' + response.errorcode + ' on update subject')
          }
          this.showSubjectsChange = false
      }

    },
    mounted: function() {
        //this.$cs.l('LOG : Mount')
        this.getSubjects()
    },
    watch: {
    }
}
</script>

