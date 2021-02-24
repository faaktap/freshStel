<template>
  <v-container>
   <v-row><v-col cols="12">
    <v-card class="mx-auto">
       <v-container>
        <v-btn @click="getLogs"><v-icon>mdi-table-refresh</v-icon></v-btn>
        <v-text-field
           v-model="search"
           append-icon="mdi-magnify"
           label="Search"
           single-line
           hide-details
         ></v-text-field>

         <v-row dense>
           <v-col cols="12">
             <v-card color="purple lighten-5">
               <div>
   <v-data-table
    v-if="logList && logList.length > 0"
    :headers="logHeader"
    :items="logList"
    :items-per-page="15"
    :search="search"
    class="elevation-1"
    color="purple lighten-3"
    loading="tableLoading"
    loading-text="Loading... Please wait"
    multi-sort
  >
      <template v-slot:top>
        <v-card color="green darken-1" align="center" class="ma-2">
            First time and last time and how many times a user has created a log entry
        </v-card>
      </template>

  </v-data-table>       
               </div>
               
             </v-card>
           </v-col>
         </v-row>
       </v-container>
    </v-card>
   </v-col></v-row>
  </v-container>   
   
</template>


<script>
import { zmlFetch } from "@/api/zmlFetch";
export default {
    name:"ViewLog",
    props: [],
    data: () => ({
        search:null,
        logList:null,
        tableLoading:false,
        logHeader: [
          {text: 'User',             value: 'user' },
          {text: 'fullname',         value: 'user_fullname' },          
          {text: 'Type',             value: 'user_type' },
          {text: 'Grade',            value: 'user_grade' },
          {text: 'first use',        value: 'first' },
          {text: 'last use',         value: 'last' },
          {text: 'times used',       value: 'times' },

        ]      
    }),
    methods:{
      getLogs() {
        this.tableLoading = true
        let sl = { task: 'plainSql'
                 , sql: "SELECT l.user, u.user_fullname, user_type, user_cell, user_grade, min(log_dte) first, max(log_dte) last, count(*) times"
                      + " FROM dkhs_log l, dkhs_learner u"
                      + " WHERE referer like '%lear%' and l.user = u.user_name"
                      + " group by l.user, u.user_fullname, user_type, user_grade, user_cell order by last DESC"}
        zmlFetch(sl, this.processAfterFetch); 
      },
      processAfterFetch(response) {
          console.log(response)
          if (!response.error) {
             this.logList = response
          }
          this.tableLoading = false
      }

    },
    mounted: function() {
        console.log('LOG : Mount')
    },
    watch: {
    }
}
</script>

