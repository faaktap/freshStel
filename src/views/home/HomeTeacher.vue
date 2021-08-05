<template>
<div>

<v-toolbar color="primary">
    <v-toolbar-title> 
      <div class="d-flex flex-no-wrap justify-space-between pr-4 ">
       <div>
         Menu functions for  {{ getZml.login.fullname}} / {{ getZml.login.username}}
       </div>
      </div>
    </v-toolbar-title>
</v-toolbar>
 
 <v-row> <v-col cols="12">
  <v-expansion-panels v-if="getZml.login.isAuthenticated">
    <v-expansion-panel>
     <v-expansion-panel-header>
        Calendar (Click here to view your day!)
     </v-expansion-panel-header>
    <v-expansion-panel-content>
      <calendar weekOrDay="week" :menemonic="getZml.login.username" />
    </v-expansion-panel-content>
    </v-expansion-panel>
    <v-expansion-panel>
        <v-expansion-panel-header>
            Functions
        </v-expansion-panel-header>
        <v-expansion-panel-content>
           <menu-list :list="getZml.functions" displayType="2" />      
        </v-expansion-panel-content>
    </v-expansion-panel>
    <v-expansion-panel>
        <v-expansion-panel-header>
            Functions Same
        </v-expansion-panel-header>
        <v-expansion-panel-content>
            <menu-list :list="menuFilterList" displayType="1" /> 
        </v-expansion-panel-content>
    </v-expansion-panel>
  </v-expansion-panels>
</v-col>
|</v-row>

    <div v-if="getZml.login.isAuthenticated && getZml.login.username=='wie'">
       <v-btn href="http://kuiliesonline.co.za/cw-mail/"> Online Mass Mail </v-btn>
    </div>
    <div v-if="getZml.login.isAuthenticated && getZml.login.username=='werner'">
        <v-btn to="/viewfunctions"> functions </v-btn>
        <v-btn to="/dkhsawards"> awards </v-btn>
        <email-list />
    </div>
</div>
</template>

<script>
import { getters } from "@/api/store";
import EmailList from '@/components/EmailList.vue';
import MenuList from '@/components/MenuList.vue';
import Calendar from '@/components/Calendar.vue';
export default {
    name:"AdminHome",
    components:{EmailList, MenuList, Calendar},
    data: () => ({
        getZml: getters.getState({ object: "gZml" }),
         cards: ['Today', 'Yesterday'],
    }),
    computed:{
        menuFilterList() {
            if (!this.getZml) return 0;
            return this.getZml.functions.filter(a => function()
            {
                if (a.accesstype == this.getZml.login.type)
                    return 1
                else
                    return 0

                }
            )
        }
    },
    methods:{

    },
    mounted: function() {
        //this.$cs.l('MOUNT ADMINHME ITEMS=')
    }
}
</script>

