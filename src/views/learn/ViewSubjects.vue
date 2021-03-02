<template>
  <v-container>
   <v-row><v-col cols="12">
     <v-card class="ma-2 text-center" >
     <h1> School Subjects </h1>
     </v-card>

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
  >
      <template v-slot:[`item.action`]="{ item }">
        <v-btn class="mx-2" 
               icon
               title="Click here to reset password"
               @click="onButtonClick('Show Subject',item)">
          <v-icon dark>mdi-coffee</v-icon>
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
      </template>
  </v-data-table>       

                 </div>
               
             </v-card>
           </v-col>
         </v-row>
       </v-container>
    </v-card>
   </v-col></v-row>
<v-dialog v-model="showSubjectsChange" :scrollable="false" persistent width="50%">
  <v-card v-if="curItem">
    <v-card-title>
      PASSWORD RESET
    </v-card-title>
    {{ curItem }}
    <v-card-text>
   {{ curItem }}
    </v-card-text>
    <v-card-actions>
      <v-btn title="Click here to save the subject"
             @click="saveSubject"  
      > Save </v-btn>
      <v-spacer />
      <v-btn title="Close"
             @click="showSubjectsChange = false"  
      > Close </v-btn>
    </v-card-actions>
  </v-card>
</v-dialog>   
  </v-container>   
</template>


<script>
import { zmlFetch } from "@/api/zmlFetch";
import { errorSnackbar, infoSnackbar } from '@/api/GlobalActions';
import { getters } from "@/api/store";
export default {
    name:"ViewSubjects",
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
          {text: 'linkid',             value: 'linksubjectid' },
          {text: 'Sort',             value: 'sortorder' },
          {text: "edit",             value: "action", sortable: false }
        ]     
    }),
    methods:{
      onButtonClick(todo,data) {
        this.showSubjectsChange = true
        this.curItem = data
        console.log(todo,data)
      },
      saveSubject() {
          alert('save')
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
        console.log('ERROR on subject list : ' , response)
      },
      updateSubject() {
        let sl = { task: 'plainSql'
                 , sql: "update dkhs_learner "
                      + "   set user_password = 'password' "
                      + " where userid = " + this.curItem.userid
                 }
        zmlFetch(sl, this.processAfterReset, this.processError);
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
        console.log('LOG : Mount')
        this.getSubjects()
    },
    watch: {
    }
}
</script>

