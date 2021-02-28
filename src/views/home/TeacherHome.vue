<template>
<div>

<v-toolbar color="primary">
    <v-toolbar-title> 
      <div class="d-flex flex-no-wrap justify-space-between pr-4 ">
       <div>
         Menu functions for  {{ getZml.login.fullname}} / {{ getZml.login.username}}
       </div>
       <div>
        <v-btn   small 
         absolute top right
         color="blue-grey"
         class="ma-2 white--text"
         title="Click here to refresh"  @click="loadFunctions"> Refresh </v-btn>
       </div>
      </div>
    </v-toolbar-title>
</v-toolbar>
 
 

      <v-container v-if="getZml.login.isAuthenticated">
        <v-row>
          <v-col
            v-for="menu in getZml.functions"
            :key="menu.functionid"
            cols="4"
          >
            <v-card height="200" :color="cardColor(menu.functionaccess)" >
                <v-card-title>
                    {{ menu.functionname }}
                </v-card-title>
                <v-card-text>
                    {{ menu.tip }}
                </v-card-text>
             <v-card-actions>
              <zml-button-tool 
                 bottom 
                :btnFace="menu.shortname" 
                color="primary" 
                :toolTip="menu.tip"
                :icon="menu.icon"
              @clicked="click(menu)" /> <small> ( {{menu.functionaccess}}) </small>
             </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>

      <div v-if="getZml.login.isAuthenticated && getZml.login.username=='werner'">
        <v-btn to="/viewfunctions"> only for werner </v-btn>
        <email-list />
      </div>
</div>
</template>

<script>
import { zmlConfig } from '@/api/constants';
import { zmlFetch } from '@/api/zmlFetch.js';
import { doStuff } from '@/api/buttons'
import { infoSnackbar } from '@/api/GlobalActions';
import zmlButtonTool from '@/components/zmlButtonTool'
import { getters } from "@/api/store";
import EmailList from '@/components/EmailList.vue';
export default {
    name:"AdminHome",
    components:{zmlButtonTool, EmailList},
    data: () => ({
        getZml: getters.getState({ object: "gZml" }),
         cards: ['Today', 'Yesterday'],
    }),
    computed:{

    },
    methods:{
       cardColor(type) {
           switch (type) {
               case 'teacher' : return "light-green lighten-3"
               case 'student' : return "green lighten-2"
               case 'admin' : return "green accent-3"
               default : return "orange lighten-4"
           }
       },        
        click(what) {
            if (doStuff(this.$router,what.payload) == 0) {
                if (what.payload.substr(0,4).toLowerCase() == 'http') {
                    window.open(what.payload,'_' + 'ko_external')
                } else {
                    infoSnackbar('Sorry, we do not handle ' + what.payload + ' yet!' )
                }
            }
              
        },
        loadFunctions() {
           let ts = {};
           ts.task = 'PlainSql';
           ts.sql = 'select * from dkhs_lfunction'
           ts.api = zmlConfig.apiDKHS
           zmlFetch(ts, this.showData, this.loadError)
        },
        loadError(response) {
            console.log(response)
            alert(response)
        },
        showData(response) {
           this.getZml.functions = response
        }
    },
    mount: function() {
        console.log('MOUNT ADMINHME ITEMS=')
    }
}
</script>

