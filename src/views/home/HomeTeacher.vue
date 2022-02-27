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
            Functions (Click here to see all available tasks)
        </v-expansion-panel-header>
        <v-expansion-panel-content>
           <list-test functiongroup="teacher" />
           <list-test functiongroup="admin" />
           <list-test functiongroup="student" />
           <list-test functiongroup="all" />
        </v-expansion-panel-content>
    </v-expansion-panel>
    <v-expansion-panel>
     <v-expansion-panel-header>
        Calendar (Click here to view your day!)
     </v-expansion-panel-header>
    <v-expansion-panel-content>
      <calendar weekOrDay="week" :menemonic="getZml.login.username" />
    </v-expansion-panel-content>
    </v-expansion-panel>
  </v-expansion-panels>
</v-col>
|</v-row>

    <div v-if="getZml.login.isAuthenticated && getZml.login.username=='wie'">
       <v-btn href="http://kuiliesonline.co.za/cw-mail/"> Online Mass Mail </v-btn>
    </div>
    <div v-if="getZml.login.isAuthenticated && getZml.login.username=='werner'">
        HT
        <v-btn to="/viewfunctions"> functions </v-btn>
        <v-btn to="/dkhsawards"> awards </v-btn>
        <v-btn to="/loadhomework"> loadhomework </v-btn>
    </div>
</div>
</template>

<script>
import { getters } from "@/api/store";
import Calendar from '@/components/Calendar.vue';
import ListTest from '@/components/ListTest.vue';
export default {
    name:"TeacherHome",
    components:{Calendar, ListTest},
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

