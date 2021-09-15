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

<v-row> 
 <v-col cols="12">
  <v-expansion-panels v-if="getZml.login.isAuthenticated">
    <v-expansion-panel>
        <v-expansion-panel-header>
            All Functions
        </v-expansion-panel-header>
        <v-expansion-panel-content>
           <list-test functiongroup="admin" />
           <list-test functiongroup="teacher" />
           <list-test functiongroup="student" />
        </v-expansion-panel-content>
    </v-expansion-panel>

    <v-expansion-panel>
     <v-expansion-panel-header>
        Calendar (Click here to view your day!) 
     </v-expansion-panel-header>
    <v-expansion-panel-content>
        <v-row><v-col cols="10">
        <!--v-text-field v-model="wieOmTeWys" /--> 
        <personel-menemonic v-model="wieOmTeWys" @click="showCal=false" />
        </v-col><v-col cols="2">
        <v-btn @click="weekOrDayChange">  {{ weekOrDay }} </v-btn>
        <v-btn @click="showCal = !showCal"> 
          <template v-if="!showCal">Show Calendar</template>
          <template v-else>Hide Calendar </template>
        </v-btn>
        </v-col></v-row>
      <calendar v-show="showCal" 
               :weekOrDay="weekOrDay" 
               :menemonic="wieOmTeWys" />
    </v-expansion-panel-content>
    </v-expansion-panel>

  </v-expansion-panels>
</v-col>
<v-col cols="12">
  
</v-col>
|</v-row>



  <div v-if="getZml.login.isAuthenticated && getZml.login.username=='werner'">
     <v-expansion-panels>
        <v-expansion-panel>
          <v-expansion-panel-header>
              Stuff that only Werner should be able to see 
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <list-test functiongroup="all" />
            <v-layout class="ma-1" row wrap justify-space-between>
            <v-btn to="/viewfunctions"> functions </v-btn>
            <v-btn to="/dkhsawards"> dkhs awards </v-btn>
            <v-btn to="/studentawards"> student awards </v-btn>
            <v-btn to="/about"> about </v-btn>
            <v-btn to="/hover"> hover </v-btn>
            <!--{{ joke }}            -->
            <v-window>
            xs={{$vuetify.breakpoint.xs}} <br>
            sm={{$vuetify.breakpoint.sm}}<br>
            md={{$vuetify.breakpoint.md}}<br>
            lg={{$vuetify.breakpoint.lg}}<br>
            xl={{$vuetify.breakpoint.xl}}<br>
            </v-window>
             <email-list />
            </v-layout>
          </v-expansion-panel-content>
        </v-expansion-panel>
     </v-expansion-panels>
      </div>
</div>
</template>

<script>
import { zmlConfig } from '@/api/constants';
import { getters } from "@/api/store";
import { zmlFetch } from '@/api/zmlFetch.js'
import { zData } from '@/api/zGetBackgroundData.js';
import { doStuff } from '@/api/buttons'
import { infoSnackbar } from '@/api/GlobalActions';
//import { zData } from "@/api/zGetBackgroundData.js"
import EmailList from '@/components/EmailList.vue';
import Calendar from '@/components/Calendar.vue';
import PersonelMenemonic from '@/components/student/PersonelMenemonic.vue';

import ListTest from '@/components/ListTest.vue';

export default {
    name:"AdminHome",
    components:{EmailList, Calendar,PersonelMenemonic, ListTest},
    data: () => ({
        getZml: getters.getState({ object: "gZml" }),
        wieOmTeWys:'Teacher',
        showCal:false,
        cards: ['Today', 'Yesterday'],
        today: new Date(),
        tomorrow: new Date(),
        schoolday: null,
        weekOrDay:"day",
        joke:''
    }),
    computed:{
    },
    methods:{
        weekOrDayChange() {
            if (this.weekOrDay == 'day') {
                this.weekOrDay = 'week'
            } else {
                this.weekOrDay = 'day'
            }
        },
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
           ts.sql = 'select * from dkhs_lfunction order by sortorder'
           ts.api = zmlConfig.apiDKHS
           zmlFetch(ts, this.showData, this.loadError)
        },
        loadError(response) {
            //this.$cs.l(response)
            alert(response)
        },
        showData(response) {
           this.getZml.functions = response
        },
        async CallAsyncFunction() {
          if (this.getZml.login.isAuthenticated && this.getZml.login.username == 'werner') {

           const joke = await zData.randomChuckNorris();
           this.joke = joke.value 
           if  (this.joke && ( this.joke.indexOf('sex') 
                            || this.joke.indexOf('prince albert')
                            || this.joke.indexOf('condom')
                            || this.joke.indexOf('placen')
                            || this.joke.indexOf('fuck')
                            || this.joke.indexOf('anal')
                            || this.joke.indexOf('pregna')
                            || this.joke.indexOf('bondag')  
                            || this.joke.indexOf('gay'))) {
               this.joke = await zData.randomChuckNorris().value;
           }
          }
        }
    },
    mounted() {
        //this.$cs.l('MOUNT ADMINHME ITEMS=',this.today,this.tomorrow)
        this.CallAsyncFunction()
        
    }
}
</script>

