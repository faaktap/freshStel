<template>
<div>
<v-toolbar color="primary" row  wrap :loading="loading">
      Menu functions for  {{ getZml.login.fullname}} / {{ getZml.login.username}}
      <v-spacer />
      <base-tool-button
               xv-if="meritCount > 0"
               class="mt-1 mr-2 mb-2 ml-2"
               label="Merit Approval"
               color="secondary"
               icon="mdi-trophy-award"
               :badge="meritCount"
               :loading="loading"
               :disabled="loading"
               badgeTitle="`You have ${meritCount} merits to confirm`"
               @click="loadYourMeritWork"
      >Merit Approval</base-tool-button>
  </v-toolbar>



<v-row>
 <v-col cols="12">
     <base-title-expand openOrClose="open" heading="Functions for Admin, Staff and Students">
     <v-row><v-col cols="12" md="6" >
           <list-test functiongroup="admin" />
           </v-col><v-col cols="12" md="6">
           <list-test functiongroup="teacher" />
           </v-col><v-col cols="12" md="6">
           <list-test functiongroup="student" />
           </v-col>
     </v-row>
     </base-title-expand>
 </v-col>
</v-row>


  <div v-if="getZml.login.isAuthenticated && getZml.login.username=='werner'">
     <v-expansion-panels>
        <v-expansion-panel>
          <v-expansion-panel-header>
              Stuff that only Werner should be able to see *Admin.vue
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <list-test functiongroup="all" />
            <v-layout class="ma-1" row wrap justify-space-between>
            <v-btn to="/viewfunctions"> functions </v-btn>
            <v-btn to="/dkhsawards"> dkhs awards </v-btn>
            <v-btn to="/studentawards"> student awards </v-btn>
            <v-btn to="/about"> about </v-btn>
            <v-btn to="/hover"> hover </v-btn>
            <v-btn to="/loadhomework"> loadhomework </v-btn>
            <v-btn to="/folderedit/GR08/Accounting_Rekeningkunde/"> FE Gr8 Rek </v-btn>
            {{ joke }}
            <v-window>
            xs={{$vuetify.breakpoint.xs}} <br>
            sm={{$vuetify.breakpoint.sm}}<br>
            md={{$vuetify.breakpoint.md}}<br>
            lg={{$vuetify.breakpoint.lg}}<br>
            xl={{$vuetify.breakpoint.xl}}<br>
            </v-window>
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

import ListTest from '@/components/ListTest.vue';
import BaseTitleExpand from '@/components/base/BaseTitleExpand.vue';
import BaseToolButton from '@/views/new/base/BaseToolButton.vue'
export default {
    name:"AdminHome",
    components:{
      ListTest
      ,BaseTitleExpand
      ,BaseToolButton
      },
    data: () => ({
        getZml: getters.getState({ object: "gZml" }),
        wieOmTeWys: 'Teacher',
        showCal: false,
        cards: ['Today', 'Yesterday'],
        today: new Date(),
        tomorrow: new Date(),
        schoolday: null,
        weekOrDay: "day",
        joke: '',
        meritCount: '',
        loading: false
    }),
    computed:{
    },
    methods:{
       click(what) {
          if (doStuff(this.$router,what.payload) == 0) {
              if (what.payload.substr(0,4).toLowerCase() == 'http') {
                  window.open(what.payload,'_' + 'ko_external')
              } else {
                  infoSnackbar('Sorry, we do not handle ' + what.payload + ' yet!' )
              }
          }

        },
        loadWorkToDo() {
          this.loading = true
          let ts = {}
          ts.task = 'OneValueSql'
          ts.sql = `SELECT count(*) FROM dkhs_meritstudent WHERE confirmdte is null and persmenemonic = '${this.getZml.login.username}'`
          ts.api = zmlConfig.apiDKHS
          zmlFetch(ts, this.getMeritCount, this.loadError)
        },
        getMeritCount(response) {
          console.log('Merit Count', response)
          this.meritCount = response
          this.loading = false
        },
        loadYourMeritWork() {
          this.$router.push({ name: 'PersMeritList'})
        },
        loadError(response) {
          this.$cs.l(this.$options.name,'ErrorA', response)
          this.loading = false
        },
        showData(response) {
          this.getZml.functions = response
          this.loadWorkToDo()
          this.loading = false
        },
        loadFunctions() {
           if (this.getZml.functions.length) return
           this.loading = true
           let ts = {};
           ts.task = 'PlainSql';
           ts.sql = 'select * from dkhs_lfunction order by sortorder'
           ts.api = zmlConfig.apiDKHS
           zmlFetch(ts, this.showData, this.loadError)
        },
        async CallAsyncFunction() {
          if (this.getZml.login.isAuthenticated && this.getZml.login.username == 'werner') {
            this.loading = true
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
              this.loading = false
           }
          }
        },
    },
    mounted() {
        this.CallAsyncFunction()
        this.loadFunctions()

    }
}
</script>

