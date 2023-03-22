<template>
<v-container fluid v-if="getZml.login.isAuthenticated">
<!-- homeadmin -->
  <base-tool :toolList="[]"
           toolbarName="Menu for Admin & Teachers"
           :loading="loading"
           :background="false"
           :back="true"
  >
        <v-btn
         icon class="ma-4 "
         title="Change menu listing (All, Student, Admin,Teacher)"
         @click="changeType"
        >
          <v-icon> {{menuType}} </v-icon>
        </v-btn>

        <v-btn
         icon class="ma-2"
         title="Allow search in menu"
         @click="menuSearch = !menuSearch"
        >
          <v-icon> mdi-card-search </v-icon>
        </v-btn>

        <v-btn
         icon class="ma-2"
         title="Make the menu listing appear smaller or larger"
         @click="menuSmall =! menuSmall"
        >
          <v-icon v-show="menuSmall"> S </v-icon>
          <v-icon v-show="!menuSmall"> L </v-icon>
        </v-btn>
        <v-btn
         icon class="ma-2"
         title="Show more information about menu items"
         @click="menuInfo = !menuInfo"
        >
          <v-icon> mdi-information </v-icon>
        </v-btn>
        <v-btn
         icon class="ma-2"
         title="Click here to refresh"
         @click="loadFunctions"
        >
          <v-icon> mdi-refresh </v-icon>
        </v-btn>

  </base-tool>

  <menu-list-new :info="menuInfo" :small="menuSmall" :type="menuType" :functionSearch="menuSearch" />

     <base-title-expand heading="Calendar">
     <v-row>
         <v-col cols="5">
          <personel-menemonic v-model="wieOmTeWys" />
          </v-col><v-col cols="5">
          <v-btn to="/calteach" class="float-right"> Full Screen </v-btn>
        </v-col>
        <v-col cols="2">
        </v-col></v-row>
      <v-container fluid>
      <calendar
               :menemonic="wieOmTeWys" />
      </v-container>

     </base-title-expand>


</v-container>
</template>

<script>
import { zmlConfig } from '@/api/constants';
import { getters } from "@/api/store";
import { zData } from "@/api/zGetBackgroundData.js"
import { zmlFetch } from '@/api/zmlFetch.js'
//import { doStuff } from '@/api/buttons'
//import { infoSnackbar } from '@/api/GlobalActions';
import MenuListNew from '@/components/MenuListNew.vue';
import Calendar from '@/components/Calendar.vue';
import PersonelMenemonic from '@/components/staff/PersonelMenemonic.vue';

import BaseTitleExpand from '@/components/base/BaseTitleExpand.vue';
import baseTool from '@/components/base/baseTool.vue'

export default {
    name:"HomeAdmin",
    components:{
               Calendar
             , PersonelMenemonic
             , BaseTitleExpand
             , MenuListNew
             , baseTool
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
      changeType() {
        if (this.menuType == 'all') { this.menuType = 'admin'; return}
        if (this.menuType == 'admin') { this.menuType = 'teacher'; return}
        if (this.menuType == 'teacher') { this.menuType = 'student'; return}
        if (this.menuType == 'student') { this.menuType = 'other'; return}
        if (this.menuType == 'other') { this.menuType = 'all'; return}
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
      this.CallAsyncFunction()
    },
    mounted() {
        this.$cs.l('Mount',this.$options.name)
        //this.$cs.l('AdminHome Load Joke',this.today,this.tomorrow)

        //this.menuType = this.getZml.login.type
        this.wieOmTeWys = this.getZml.login.username


    }
}
</script>

