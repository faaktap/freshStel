<template>
<div v-if="getZml.login.isAuthenticated">
<!-- homeadmin -->
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
         title="Click here to refresh"
         @click="loadFunctions">
          Refresh
         </v-btn>
       </div>
      </div>
    </v-toolbar-title>
</v-toolbar>

<v-row>
 <v-col cols="12">
     <base-title-expand openOrClose="open" heading="Functions for Admin, Staff and Students">
     <v-container fluid>
           <list-test functiongroup="admin" />
           <!-- </v-col><v-col cols="12" md="6"> -->
           <list-test functiongroup="teacher" />
           <!-- </v-col><v-col cols="12" md="6"> -->
           <list-test functiongroup="student" />
     </v-container>
     </base-title-expand>

     <base-title-expand heading="Calendar (Click here to view your day!) ">
     <v-row>
         <v-col cols="10">
          <personel-menemonic v-model="wieOmTeWys" @click="showCal=false" />
        </v-col>
        <v-col cols="2">
         <v-btn @click="showCal = !showCal">
          <template v-if="!showCal">Show Calendar</template>
          <template v-else>Hide Calendar </template>
        </v-btn>

        </v-col></v-row>
      <v-container fluid>
      <calendar v-show="showCal"
               :menemonic="wieOmTeWys" />
      </v-container>

     </base-title-expand>

</v-col>
<v-col cols="12">

</v-col>
|</v-row>
  <div v-if="getZml.login.isAuthenticated && getZml.login.username=='WER'">
    {{ joke || 'no joke'}}
     <v-expansion-panels>
        <v-expansion-panel>
          <v-expansion-panel-header>
              Stuff that only Werner should be able to see (HA)
          </v-expansion-panel-header>
          <v-expansion-panel-content>

            <v-layout class="ma-1" row wrap justify-space-between>
            <v-btn to="/viewfunctions"> functions </v-btn>
            <v-btn to="/dkhsawards"> dkhs awards </v-btn>
            <v-btn to="/studentawards"> student awards </v-btn>
            <v-btn to="/about"> about </v-btn>
            <v-btn to="/hover"> hover </v-btn>
            <v-btn to="/loadhomework"> loadhomework </v-btn>
            <v-btn to="/checklog"> checklog </v-btn>
            <v-btn @click="dateTest"> dateTest </v-btn>
            <v-window>
            xs={{$vuetify.breakpoint.xs}} <br>
            sm={{$vuetify.breakpoint.sm}}<br>
            md={{$vuetify.breakpoint.md}}<br>
            lg={{$vuetify.breakpoint.lg}}<br>
            xl={{$vuetify.breakpoint.xl}}<br>
            </v-window>
             emailist:<email-list />
            </v-layout>
            <list-test functiongroup="all" />
          </v-expansion-panel-content>
        </v-expansion-panel>
        <v-expansion-panel>
          <v-expansion-panel-header>
              global tables
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-layout class="ma-1" col wrap justify-space-between>
              <v-tabs
                v-model="vtabs"
                slider-color="yellow"
               >
               <v-tab key="1"> grades </v-tab>
               <v-tab key="2"> subject </v-tab>
               <v-tab key="3"> folders </v-tab>
               <v-tab key="4"> funcs </v-tab>
               <v-tab key="5"> popi </v-tab>
               <v-tab key="6"> merits </v-tab>
               <v-tab key="7"> pers </v-tab>
               <v-tab-item key="1">
               <zml-data-table v-if="getZml.grades" :dataList="getZml.grades" userHeader="grades"/>
               </v-tab-item>
               <v-tab-item key="2">
               <zml-data-table v-if="getZml.subjects" :dataList="getZml.subjects" userHeader="subjects"/>
               </v-tab-item>
               <v-tab-item  key="3">
               <zml-data-table v-if="getZml.folders" :dataList="getZml.folders" userHeader="folders"/>
               </v-tab-item>
               <v-tab-item  key="4">
               <zml-data-table v-if="getZml.functions" :dataList="getZml.functions" userHeader="functions"/>
               </v-tab-item>
               <v-tab-item  key="5">
               <zml-data-table v-if="getZml.popi" :dataList="getZml.popi" userHeader="popi"/>
               </v-tab-item>
               <v-tab-item  key="6">
               <zml-data-table v-if="getZml.meritLevel" :dataList="getZml.meritLevel" userHeader="meritLevel"/>
               </v-tab-item>
               <v-tab-item  key="7">
               <zml-data-table v-if="getZml.persMenemonic" :dataList="getZml.persMenemonic" userHeader="persMenemonic" />
               </v-tab-item>
              </v-tabs>
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
import { zmlFetch, zFetch } from '@/api/zmlFetch.js'
import { doStuff } from '@/api/buttons'
import { infoSnackbar } from '@/api/GlobalActions';
import EmailList from '@/components/email/EmailList.vue';
import Calendar from '@/components/Calendar.vue';
import PersonelMenemonic from '@/components/staff/PersonelMenemonic.vue';
import zmlDataTable from '@/components/zmlDataTable.vue'
import { zData } from '@/api/zGetBackgroundData.js';
import ListTest from '@/components/ListTest.vue';
import BaseTitleExpand from '@/components/base/BaseTitleExpand.vue';

//Werner test
import { zDate } from '@/api/zDate.js';
//import { loadCalendar } from '@/api/loadCalendar.js';

export default {
    name:"AdminHome",
    components:{EmailList, Calendar,PersonelMenemonic, ListTest,BaseTitleExpand, zmlDataTable},
    data: () => ({
        getZml: getters.getState({ object: "gZml" }),
        wieOmTeWys:'Teacher',
        showCal:false,
        cards: ['Today', 'Yesterday'],
        today: new Date(),
        tomorrow: new Date(),
        schoolday: null,
        joke:'no joke',
        vtabs: '1'
    }),
    computed:{
    },
    methods:{
      dayNum(forDate) {
        let year = forDate.getFullYear();
        let month = forDate.getMonth() + 1; //JS month start at 0
        let day = forDate.getDate();
        console.log('-------------', year, month, day,forDate)
        zFetch({task: 'Plainsql',
          sql: `SELECT dayno, fulldate FROM dkhs_date WHERE fulldate = '${year}-${month}-${day}'`,
          api:zmlConfig.apiDKHS}
        ).then((r) => {
                      console.log(r)
                      if (r.status >= 200 && r.status <= 299) {
                        return r.json();
                      } else {
                        throw Error(r.statusText);
                      }
        })
        .then(data => {
          console.log('Assign to pb', data)
        })

      },
      dateTest() {
        let startDate = zDate.getMondayPast()
        console.log('Monday Past',startDate)
        //let dayCnt = zDate.curDay(startDate)
        this.dayNum(startDate)
        console.log('werner test : dayCnt =----------------- ')
        // let  date1 = zDate.setDateMDY('Jul-30-2021')
        // console.log('Date1 : ', date1.toLocaleString() )
        // let  date2 = zDate.setDateYMD('2022-01-01')
        // console.log('Date 2:', date2.toLocaleString() )

        let publicHolidays = []
        //let dayType, days
        let sql = 'select * from dkhs_holiday'
        console.log('start:',sql)
        zFetch({task:'PlainSql', sql:sql, api:zmlConfig.apiDKHS})
        .then((r) => {
                      console.log(sql, r)
                      if (r.status >= 200 && r.status <= 299) {
                        return r.json();
                      } else {
                        throw Error(r.statusText);
                      }
        })
        .then(data => {
          console.log('Assign to pb', data)
          publicHolidays = data
          publicHolidays.forEach(e => {
             e.realdate =  zDate.setDateYMD(e.fulldate)
             // console.log(e)
          });
          console.log(publicHolidays)
        })
        .catch(err => {
          console.log('Fetch Error:',err)
          if (err == "TypeError: Failed to fetch") alert('kuilies is away')
        })
        console.log('check check dayNum = ')
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
           let joke = await zData.randomChuckNorris();
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
               joke = await zData.randomChuckNorris();
               this.joke = joke.value
           }
          }
        },
    },
    mounted() {
        this.$cs.l('AdminHome Load Joke',this.today,this.tomorrow)
        this.CallAsyncFunction()

    }
}
</script>

