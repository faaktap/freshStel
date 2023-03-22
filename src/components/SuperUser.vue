<template>
<v-container fluid>
    <hero-section name="forDB"
              bgpicture="https://www.zmlrekenaars.co.za/test/img/wall088.jpg"
              :title="`Superuser Menu : ${getZml.login.fullname}`"
              text=""
              breakup1="100"
              breakup2="20"
              color="blue darken-1"
               />


   <h2> Welcome SysAdmin! </h2>
      <v-layout class="ma-2 pa-2" row wrap justify-space-between>
               <v-btn small to="/loadhomework" class="ma-2"> loadhomework </v-btn>
               <v-btn small to="/vglist" class="ma-2"> vglist </v-btn>
               <v-btn small to="/jdoc" class="ma-2"> jdoc </v-btn>
               <v-btn small to="/basecalendaredit" class="ma-2"> calen edit/view </v-btn>
               <v-btn small to="/kalender" class="ma-2"> skool kalender </v-btn>
               <v-btn small to="/periodtable" class="ma-2"> Change/View Periods </v-btn>
               <v-btn small to="/ar" class="ma-2"> autoroute </v-btn>
               <v-btn small to="/checklog" class="ma-2"> checklog </v-btn>
               <v-btn small to="/werner" class="ma-2"> werner </v-btn>
               <v-btn small to="/wernertest" class="ma-2"> wernertest </v-btn>
               <v-btn small to="/viewfunctions" class="ma-2"> functions </v-btn>
            <v-btn small to="/dkhsawards" class="ma-2"> dkhs awards </v-btn>
            <v-btn small to="/studentawards" class="ma-2"> student awards </v-btn>
            <v-btn small to="/about" class="ma-2"> about </v-btn>
            <v-btn small to="/hover" class="ma-2"> hover </v-btn>
            <v-btn small to="/loadhomework" class="ma-2"> loadhomework </v-btn>
            <v-btn small to="/folderedit/GR08/Accounting_Rekeningkunde/" class="ma-2"> FE Gr8 Rek </v-btn>
            <v-btn small to="/register/:surveyidPassed" class="ma-2"> register </v-btn>
            <v-btn small @click="dateTest" class="ma-2"> dateTest </v-btn>
            <v-btn small to="/systemview" class="ma-2"> System Tests and Updates </v-btn>

            <v-card class="ma-2 pa-2">
              {{ joke }}
            xs={{$vuetify.breakpoint.xs}} <br>
            sm={{$vuetify.breakpoint.sm}}<br>
            md={{$vuetify.breakpoint.md}}<br>
            lg={{$vuetify.breakpoint.lg}}<br>
            xl={{$vuetify.breakpoint.xl}}<br>
            </v-card>
      </v-layout>
       <v-expansion-panels>
        <v-expansion-panel>
          <v-expansion-panel-header>
              list-test functiongroup="all"  Tester
          </v-expansion-panel-header>
          <v-expansion-panel-content>
              <list-test functiongroup="all" />
          </v-expansion-panel-content>
        </v-expansion-panel>

        <v-expansion-panel>
          <v-expansion-panel-header>
              global tables, v-layout, v-tabs
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            v-layout, v-tabs
            <v-layout class="ma-1" col wrap justify-space-between>
              <v-tabs
                v-model="vtabs"
                slider-color="yellow"
               >
               <v-tab key="1"> grades </v-tab>
               <v-tab key="2"> subject </v-tab>
               <v-tab key="3"> calendar </v-tab>
               <v-tab key="4"> funcs </v-tab>
               <v-tab key="6"> merits </v-tab>
               <v-tab key="7"> pers </v-tab>
               <v-tab key="8"> classlist </v-tab>
               <v-tab key="9"> ticklist </v-tab>
               <v-tab key="10"> login </v-tab>

               <v-tab-item key="1">
               <zml-data-table v-if="getZml.grades" :dataList="getZml.grades" userHeader="grades"/>
               </v-tab-item>
               <v-tab-item key="2">
               <zml-data-table v-if="getZml.subjects" :dataList="getZml.subjects" userHeader="subjects"/>
               </v-tab-item>
               <v-tab-item key="3">
               <zml-data-table v-if="getZml.calendar" :dataList="getZml.calendar" userHeader="calendar"/>
               </v-tab-item>
               <v-tab-item  key="4">
               <zml-data-table v-if="getZml.functions" :dataList="getZml.functions" userHeader="functions"/>
               </v-tab-item>
               <v-tab-item  key="6">
               <zml-data-table v-if="getZml.meritLevel" :dataList="getZml.meritLevel" userHeader="meritLevel"/>
               </v-tab-item>
               <v-tab-item  key="7">
               <zml-data-table v-if="getZml.persMenemonic" :dataList="getZml.persMenemonic" userHeader="persMenemonic" />
               </v-tab-item>
               <v-tab-item  key="8">
               <zml-data-table v-if="getZml.classList" :dataList="getZml.classList" userHeader="classLists" />
               </v-tab-item>
               <v-tab-item  key="9">
               <zml-data-table v-if="getZml.tickList" :dataList="getZml.tickList" userHeader="tickLists (General)" />
               </v-tab-item>
               <v-tab-item  key="10">
                 login---{{ getZml.login }}
                 <br> locale--{{ getZml.locale}}
                 <br> calendar---{{ getZml.calendar }}
                 <br> thisday--{{ getZml.thisday }}
               </v-tab-item>

              </v-tabs>
            </v-layout>
          </v-expansion-panel-content>
        </v-expansion-panel>
     </v-expansion-panels>
     <v-card v-for="(i,c) in [176,175,173,172,166,164,158,147,125,111,109,96,83,84,99,98,95,76,65,61,57,76,73,69,67,53,54,47,42,33,28,25,21,18,17,11,12,14,6,5]" :key="c"
            class="ma-2 pa-2"
            elevation="0">
         <hero-section name="test"
                 :bgpicture="bgPicture(i)"
                 :title="`Hero WallPaper : ${i}`"
               />
                 <!-- :moreText="` More and More text ${c}`"
                 :text="`some text ${c}${c}${c}`"
                 :button="` Button ${c}`"
                 icon="mdi-kettle"
                 func="/wernertest" -->

     </v-card>

     <!-- for some reason the below statement give warning  vue.runtime.esm.js?2b0e:4605 [Vue warn]: Duplicate keys detected: '3'. This may cause an update error.
     <v-img v-for="j of 3" :key="j"
           :src="bgPicture(j)" :id="`x${j}`" :ref="`x${j}`" >
           <span> {{ j }} </span>
     </v-img> -->
<!-- <test-composition-api /> -->


</v-container>
</template>

<script>
import { zmlConfig } from '@/api/constants';
import { getters } from "@/api/store";
import { zData } from "@/api/zGetBackgroundData.js"
import { zmlFetch, zFetch } from '@/api/zmlFetch.js'
import { doStuff } from '@/api/buttons'
import { infoSnackbar } from '@/api/GlobalActions';
import HeroSection from "@/views/sections/HeroSection.vue"

// import Calendar from '@/components/Calendar.vue';
// import PersonelMenemonic from '@/components/staff/PersonelMenemonic.vue';

// import BaseTitleExpand from '@/components/base/BaseTitleExpand.vue';
// import baseTool from '@/components/base/baseTool.vue'
//Werner test
import { zDate } from '@/api/zDate.js';
//import MenuListNew from '@/components/MenuListNew.vue';
//import { loadCalendar } from '@/api/loadCalendar.js';

import { leftPad } from '@/api/util.js'


export default {
    name:"SuperUser",
    components:{
            //    Calendar
            //  , PersonelMenemonic
            //  , BaseTitleExpand
            //  , baseTool
            //  MenuListNew
             HeroSection
    },
    data: () => ({

        getZml: getters.getState({ object: "gZml" }),
        wieOmTeWys:'Teacher',
        showCal:false,
        cards: ['Today', 'Yesterday'],
        today: new Date(),
        tomorrow: new Date(),
        schoolday: null,
        joke:'no joke',
        vtabs: '1',
        loading:false,
        menuInfo: false,
        menuSmall: false,
        menuType: 'all',
        menuSearch:false,
    }),
    computed:{
    },
    methods:{
      bgPicture(i) {
        let x = leftPad(i,3)
        return "https://www.zmlrekenaars.co.za/test/img/wall" + x + ".jpg"
      },
      changeType() {
        if (this.menuType == 'all') { this.menuType = 'admin'; return}
        if (this.menuType == 'admin') { this.menuType = 'teacher'; return}
        if (this.menuType == 'teacher') { this.menuType = 'student'; return}
        if (this.menuType == 'student') { this.menuType = 'other'; return}
        if (this.menuType == 'other') { this.menuType = 'all'; return}
      },
      dayNum(forDate) {
        this.loading = true
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
          this.loading = false
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
        this.loading = true
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
             this.loading = false
             // console.log(e)
          });
          console.log(publicHolidays)
        })
        .catch(err => {
          console.log('Fetch Error:',err)
          if (err == "TypeError: Failed to fetch") alert('kuilies is away')
          this.loading = false
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
           this.loading = true
           let ts = {};
           ts.task = 'PlainSql';
           ts.sql = 'select * from dkhs_lfunction order by sortorder'
           ts.api = zmlConfig.apiDKHS
           zmlFetch(ts, this.showData, this.loadError)
        },
        loadError(response) {
            //this.$cs.l(response)
            this.loading = false
            alert(response)
        },
        showData(response) {
           this.getZml.functions = response
           this.loading = false
        },
        async CallAsyncFunction() {
          if (this.getZml.login.isAuthenticated && this.getZml.login.username == 'werner') {
           this.loading = true
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
           this.loading = false
          }
        },
        initialize() {
          if (!this.getZml.functions.length) this.loadFunctions()
        }
    },
    created() {
      zData.quickLoadInitialData('HomeAdmin.vue : Load Data for incase', this.initialize)
    },
    mounted() {
        this.$cs.l('Mount',this.$options.name)
        //this.$cs.l('AdminHome Load Joke',this.today,this.tomorrow)
        this.CallAsyncFunction()
        this.menuType = this.getZml.login.type
        this.wieOmTeWys = this.getZml.login.username


    }
}
</script>

