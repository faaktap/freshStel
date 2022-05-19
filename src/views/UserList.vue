<template>
 <v-container v-if="userList && getZml.login.isAuthenticated">
  <v-row>
   <v-col cols="12">
    <h1> Registered Users {{ userList.length}} </h1>
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
        />
       </v-flex>
       <v-flex>
         <v-btn @click="showResult = !showResult" small class="float-right ma-2">
           <v-icon small> mdi-export </v-icon>
          Export
         </v-btn>
         <v-btn @click="getLogs"
                      title="Click here to refresh all users who have logged in"
                      class="float-right ma-2"
                      small
         ><v-icon small>mdi-refresh</v-icon>
         Refresh
         </v-btn>
         </v-flex>
      </v-layout>
      <v-row dense>
       <v-col cols="12">
        <v-card color="purple lighten-5">
          <div>
           <v-data-table
            v-if="userList && userList.length > 0"
            :headers="userHeader"
            :items="userList"
            :items-per-page="15"
            :search="search"
            class="elevation-1"
            color="purple lighten-3"
            loading="tableLoading"
            loading-text="Loading... Please wait"
            multi-sort
            mobile-breakpoint="0"
            @dblclick:row.prevent="dblClickOnTableRow"
           >
           <template v-slot:[`item.action`]="{ item }">
             <v-btn class="mx-2"
              small
              title="Click here to reset password"
              @click="onButtonClick('reset password',item)">
              <v-icon dark>mdi-lock-reset</v-icon>
             </v-btn>
            </template>
            <template v-slot:top>
             <v-card color="green darken-1" align="center" class="ma-2 pa-2">
              First time and last time and how many times a user has created a log entry
             </v-card>
            </template>
            <!-- <template v-slot:[`footer.page-text`]>
             <v-card color="green darken-1" align="center" class="ma-2 pa-2">
             </v-card>
            </template> -->
           </v-data-table>
          </div>
        </v-card>
       </v-col>
      </v-row>
     </v-container>
    </v-card>
   </v-col>
  </v-row>

  <user-edit :u="curItem" />

  <v-dialog v-model="showResult" fullscreen>
     <v-card color="red" v-if="showResult && userList">
      <front-json-to-csv :json-data="userList"
                         :csv-title="'User List'"
                         @hideModal="showResult = false">
      </front-json-to-csv>
     </v-card>
  </v-dialog>

   <v-dialog v-model="showPasswordChange" :scrollable="false" persistent>
    <v-card v-if="curItem" elevation="12" color="white darken-1">
     <v-card-title>
      PASSWORD RESET
     </v-card-title>

     <v-card-actions>
      <v-btn title="Click here to reset password to the word 'password'"
             @click="passwordReset"
      > Reset password </v-btn>
      <v-spacer />
      <v-btn title="Close"
             @click="showPasswordChange = false"
      > Close </v-btn>
     </v-card-actions>

     <v-card-text>
      <v-card color="green" class="ma-2 pa-2">
      User : {{ curItem.user_name }}
      <br>Name : {{ curItem.user_fullname }}
      <br>Email : {{ curItem.user_email }}
      <br>CellPhone : {{ curItem.user_cell }}
      <br>Access : {{ curItem.type }}
      <br>Times : {{ curItem.times }}
      <br>Last Login : {{ curItem }}
      </v-card>
     </v-card-text>
    </v-card>
   </v-dialog>
  </v-container>
</template>


<script>
import { zmlFetch } from "@/api/zmlFetch";
import { zmlConfig } from '@/api/constants';
import { getters } from "@/api/store";
import { errorSnackbar, infoSnackbar } from '@/api/GlobalActions';
import UserEdit from '@/views/UserEdit.vue'
import { zmlLog } from '../api/zmlLog';
import FrontJsonToCsv from '@/api/csv/FrontJsonToCsv.vue'
export default {
    name:"UserList",
    props: [],
    components: {UserEdit, FrontJsonToCsv},
    data: () => ({
        getZml: getters.getState({ object: "gZml" }),
        showPasswordChange:false,
        curItem:{},
        search:null,
        userList:null,
        tableLoading:false,
        userHeader: [
          {text: 'User',             value: 'user_name' },
          {text: 'fullname',         value: 'user_fullname' },
          {text: 'Type',             value: 'user_type' },
          {text: 'first use',        value: 'first' },
          {text: 'last use',         value: 'last' },
          {text: 'times used',       value: 'times' },
          {text: 'Cell',       value: 'user_cell' },
          {text: 'Email',       value: 'user_email' },
          {text: "reset",             value: "action", sortable: false }
        ],
        showResult:false,
    }),
    methods:{
      dblClickOnTableRow(e1,e2) {
        //this.$cs.l(e1)
        this.$cs.l(e2.item)
        this.curItem = e2.item
      },
      onButtonClick(todo,data) {
        this.showPasswordChange = true
        this.curItem = data
        //this.$cs.l(data)
      },
      getLogs() {
        this.tableLoading = true
        let sl = { task: 'plainSql'
                 , sql: `SELECT u.userid,u.user_name\
     , u.user_fullname, user_type\
     , user_cell, user_email\
     , date_format(min(log_dte),'%Y-%m-%d') first\
     , date_format(max(log_dte),'%Y-%m-%d') last\
     , count(*) times \
  FROM dkhs_learner u \
left outer join dkhs_log as l on l.user = u.user_name \
group by u.userid, u.user_name, u.user_fullname, user_type, user_grade, user_cell, user_email  \
ORDER BY last DESC`}
        zmlFetch(sl, this.processAfterFetch, this.processError);
      },
      processAfterFetch(response) {
        if (!response.error) {
           this.userList = response
        } else {
          alert('we have an error:' + response.errorcode + ' on fetching users')
        }
        this.tableLoading = false
      },
      processError(response) {
        zmlConfig.cl('ERROR on USER RESET FORM : ' , response)
      },
      passwordReset() {
        let sl = { task: 'plainSql'
                 , sql: `update dkhs_learner \
                           set user_password = 'password' \
                          where userid = ${this.curItem.userid}`}
        zmlFetch(sl, this.processAfterReset, this.processError);
        zmlLog(this.getZml.login.username , "PasswordReset", this.curItem.user_name)
      },
      processAfterReset(response) {
        if (!response.error == 0) {
           infoSnackbar('Password for user ' + this.curItem.userid + ' was reset to "password"')
        } else {
           errorSnackbar('we have an error:' + response.errorcode + ' on password reset')
        }
        this.showPasswordChange = false
      }

    },
    mounted: function() {
      this.getLogs()
    },
    watch: {
    }
}
</script>

