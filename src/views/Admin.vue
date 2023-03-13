<template>
<v-container fluid>
    <hero-section name="forDB"
              bgpicture="https://www.zmlrekenaars.co.za/test/img/wall098.jpg"
              :title="`Admin Menu : ${getZml.login.fullname}`"
              text=""
              breakup1="100"
              breakup2="20"
              color="green darken-1"
               />
<!-- ADMIN  -->
<div v-if="getZml.login.superUser">SuperUser! - Kyk Onder</div>
<v-toolbar color="primary" row  wrap :loading="loading">
      {{ getZml.login.fullname}} / {{ getZml.login.username}}
      <v-spacer />
      <base-tool-button
               class="mt-1 mr-2 mb-2 ml-2"
               label="Calendar"
               color="secondary"
               icon="mdi-calendar"
               xx:badge="meritCount"
               :loading="loading"
               :disabled="loading"
               xxbadgeTitle="`You have ${meritCount} merits to confirm`"
               to="/calteach"
      >Calendar</base-tool-button>
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
      <base-tool-button
               class="mt-1 mr-2 mb-2 ml-2"
               label="Home"
               color="secondary"
               icon="mdi-home"
               :loading="loading"
               :disabled="loading"
               to="/home"
      >Home</base-tool-button>
  </v-toolbar>

<!-- <test-composition-api /> -->

<v-row>
 <v-col cols="12">
     <base-title-expand openOrClose="open" heading="Functions for Admin, Staff and Students">
     <v-row><v-col cols="12" md="6" lg="4">
           <menu-list-old functiongroup="admin" />
           </v-col><v-col cols="12" md="6" lg="4">
           <menu-list-old functiongroup="teacher" />
           </v-col><v-col cols="12" md="6" lg="4">
           <menu-list-old functiongroup="student" />
           </v-col><v-col cols="12" md="6" lg="4">
           <menu-list-old functiongroup="other" />
           </v-col>
     </v-row>
     </base-title-expand>
 </v-col>
</v-row>

  <v-container fluid v-if="getZml.login.superUser">
    <super-user />
  </v-container>
</v-container>
</template>

<script>
import { zmlConfig } from '@/api/constants';
import { getters } from "@/api/store";
import { zmlFetch } from '@/api/zmlFetch.js'
import { doStuff } from '@/api/buttons'
import { infoSnackbar } from '@/api/GlobalActions';

import MenuListOld from '@/components/MenuListOld.vue';

//Superuser
import SuperUser from '@/components/SuperUser.vue';

//import ListTest from '@/components/ListTest.vue';

import BaseTitleExpand from '@/components/base/BaseTitleExpand.vue';
import BaseToolButton from '@/views/new/base/BaseToolButton.vue'
import HeroSection from "@/views/sections/HeroSection"

//import testCompositionApi from "@/components/testCompositionApi.vue";
export default {
    name:"Admin",
    components:{
        MenuListOld
      , BaseTitleExpand
      , BaseToolButton
      , HeroSection
      , SuperUser
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
    },
    created() {
      this.loadFunctions()
    },
    mounted() {
      console.log('Mounted', this.$options.name)

    }
}
</script>

