<template>
<div>
<base-title-expand heading="...">
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
            <v-btn to="/folder/GR08/Accounting_Rekeningkunde/"> FE Gr8 Rek </v-btn>
            <v-btn @click="tryPushingIt"> Pushing .. via name => FE Gr8 Rek </v-btn>
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
</base-title-expand>
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

export default {
    name:"WernerTest",
    components:{ListTest,BaseTitleExpand},
    data: () => ({
        getZml: getters.getState({ object: "gZml" }),
        joke:''
    }),
    computed:{
    },
    methods:{
      tryPushingIt() {
        this.$router.push({ name: 'FolderEdit'
                          , meta: {layout: "AppLayoutDefault" }
                          , params: {grade: 'Gr08', subject: 'Accounting_Rekeningkunde'}
        })
        //<v-btn to="/folderedit/GR08/Accounting_Rekeningkunde/"> FE Gr8 Rek </v-btn>
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
          // this.$cs.l(response)
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
        },
    },
    mounted() {
        this.CallAsyncFunction()
        this.loadFunctions()

    }
}
</script>

