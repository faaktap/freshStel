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
    <v-col cols="11" md="5">
        {{ schoolday }}
          <v-list dense>
            <v-list-item-group  color="primary" class="text-center">Today:{{ today.toDateString() }}
            <v-list-item xclass="ma-0 pa-0" v-for="day in todayPieces"  :key="day.id">
                <v-list-item-icon>
                  <v-icon v-if="day.type.substr(1,1) == 'e'" small>  {{ day.type.substr(3,1) }}</v-icon>
                  <v-icon v-else small> mdi-pause-circle-outline </v-icon>
                </v-list-item-icon>
                <v-list-item-title>
            {{ day.start }}  
                </v-list-item-title>
                <v-list-item-subtitle>
            {{ day.type }} 
                </v-list-item-subtitle>
                <v-list-item-content>
            {{ day.type }} 
                </v-list-item-content>

            </v-list-item>
            </v-list-item-group>
        </v-list>
    </v-col>
    <v-col cols="1">
     <v-divider vertical />
    |</v-col>
    <v-col cols="11" md="5">
          <v-list dense>
            <v-list-item-group  color="primary" class="text-center">
                Next:{{ tomorrow.toDateString() }}
            
            <v-list-item xclass="ma-0 pa-0" v-for="day in tomorrowPieces"  :key="day.id">

                <v-list-item-icon>
                  <v-icon v-if="day.type.substr(1,1) == 'e'" small>  {{ day.type.substr(3,1) }}</v-icon>
                  <v-icon v-else small> mdi-pause-circle-outline </v-icon>
                </v-list-item-icon>
                <v-list-item-title>
            {{ day.start }}  
                </v-list-item-title>
                <v-list-item-subtitle>
            {{ day.type }} 
                </v-list-item-subtitle>
                <v-list-item-content>
            {{ day.type }} 
                </v-list-item-content>

            </v-list-item>
            </v-list-item-group>
        </v-list>
    </v-col>

</v-row>

     <menu-list :list="menuFilterList" 
     /> 

      <div v-if="getZml.login.isAuthenticated && getZml.login.username=='werner'">
        <v-btn to="/viewfunctions"> functions </v-btn>
        <v-btn to="/dkhsawards"> dkhs awards </v-btn>
        <v-btn to="/studentawards"> student awards </v-btn>
        <v-btn to="/about"> about </v-btn>
        <v-btn to="/hover"> hover </v-btn>
                
        <br>
        xs={{$vuetify.breakpoint.xs}} <br>
        sm={{$vuetify.breakpoint.sm}}<br>
        md={{$vuetify.breakpoint.md}}<br>
        lg={{$vuetify.breakpoint.lg}}<br>
        xl={{$vuetify.breakpoint.xl}}<br>
        <email-list />
      </div>
</div>
</template>

<script>
import { zmlConfig } from '@/api/constants';
import { zmlFetch } from '@/api/zmlFetch.js';
import { doStuff } from '@/api/buttons'
import { infoSnackbar } from '@/api/GlobalActions';
import { getters } from "@/api/store";
import EmailList from '@/components/EmailList.vue';
import MenuList from '@/components/MenuList.vue';
import { zDate } from '@/api/zDate.js'
export default {
    name:"AdminHome",
    components:{EmailList, MenuList},
    data: () => ({
        getZml: getters.getState({ object: "gZml" }),
        cards: ['Today', 'Yesterday'],
        today: new Date(),
        tomorrow: new Date(),
        schoolday: null
    }),
    computed:{
        todayPieces() {
            return zDate.dayType.filter(item => item.dayNo == this.today.getDay() )
        },
        tomorrowPieces() {
            return zDate.dayType.filter(item => item.dayNo == this.today.getDay() )
        },
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
    mounted() {
        console.log('MOUNT ADMINHME ITEMS=',this.today,this.tomorrow)
        this.tomorrow.setDate(this.today.getDate() + 1)
        this.schoolday = zDate.curDay(this.today)
        console.log('today=',this.today.toDateString() )
        console.log('tomorrow=',this.tomorrow.toDateString() )
    }
}
</script>

