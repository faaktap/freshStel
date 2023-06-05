<template>
<v-container fluid v-if="getZml.login.isAuthenticated">
<!-- homeadmin -->

      <v-layout row wrap align-content-start justify-space-between>
        <!-- <v-btn small class="ma-2" @click="goToCalendar">
         <v-icon> mdi-calendar </v-icon>
          calendar
        </v-btn> -->

        <!-- <v-btn small class="ma-2"  to="/quanda">
          <v-icon> mdi-frequently-asked-questions </v-icon>
          FAQ
        </v-btn> -->

        <!-- <v-btn small class="ma-2"  to="/attload">
          <v-icon> mdi-store-clock-outline </v-icon>
          Attendance
        </v-btn> -->
        <base-tool-button @click="goToCalendar"
               class="mt-1 mr-2 mb-2 ml-2" color="primary" icon="mdi-calendar"
               title="FAQ"
        >Calendar</base-tool-button>
        <base-tool-button to="/quanda"
               class="mt-1 mr-2 mb-2 ml-2" color="primary" icon="mdi-frequently-asked-questions"
               title="FAQ"
        >FAQ</base-tool-button>
        <base-tool-button to="/addphoto"
               class="mt-1 mr-2 mb-2 ml-2" color="primary" icon="mdi-camera"
               title="Add sport id Photo for someone"
        >Sport ID Photo</base-tool-button>
        <base-tool-button to="/addphoto"
               class="mt-1 mr-2 mb-2 ml-2" color="primary" icon="mdi-store-clock-outline"
               title="Attendance"
        >Attendance</base-tool-button>
      </v-layout>

  <base-tool :toolList="[]"
           toolbarName="Menu for Admin & Teachers"
           :loading="loading"
           :background="false"
           :back="true"
  >
        <v-btn
         icon class="ma-4 "
         title="Change menu listing (All, Student, Admin,Teacher)"
         @click="menuChangeType"
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
        <!-- <v-btn
         icon class="ma-2"
         title="Click here to refresh"
         @click="loadFunctions"
        >
          <v-icon> mdi-refresh </v-icon>
        </v-btn> -->

  </base-tool>

  <menu-list-new :info="menuInfo" :small="menuSmall" :type="menuType" :functionSearch="menuSearch" />

  <most-used-functions />

</v-container>
</template>

<script>
//import { doStuff } from '@/api/buttons'
//import { infoSnackbar } from '@/api/GlobalActions';
//import Calendar from '@/components/Calendar.vue';
//import PersonelMenemonic from '@/components/staff/PersonelMenemonic.vue';
//import { zmlConfig } from '@/api/constants';
import { getters } from "@/api/store";
import { zData } from "@/api/zGetBackgroundData.js"
import { zmlFetch } from '@/api/zmlFetch.js'
import MenuListNew from '@/components/MenuListNew.vue';
import baseButtonDialog from "@/components/base/baseButtonDialog.vue"
import baseTool from '@/components/base/baseTool.vue'
import BaseToolButton from '@/views/new/base/BaseToolButton.vue'
import MostUsedFunctions from '@/components/MostUsedFunctions.vue'

export default {
    name:"HomeAdmin",
    components:{
             //  Calendar
             //, PersonelMenemonic
             //, BaseTitleExpand
               baseButtonDialog
             , BaseToolButton
             , MenuListNew
             , baseTool
             , MostUsedFunctions
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
        menuType: 'teacher',
        menuSearch:false,
    }),
    computed:{
    },
    methods:{
<<<<<<< HEAD
      menuChangeType() {
        if (this.getZml.login.type == '' || this.getZml.login.type == 'student') {
          if (this.menuType == 'student') { this.menuType = 'other'; return}
          if (this.menuType == 'other') { this.menuType = 'student'; return}
        } else {
          if (this.menuType == 'all') { this.menuType = 'admin'; return}
          if (this.menuType == 'admin') { this.menuType = 'teacher'; return}
          if (this.menuType == 'teacher') { this.menuType = 'student'; return}
          if (this.menuType == 'student') { this.menuType = 'other'; return}
          if (this.menuType == 'other') { this.menuType = 'all'; return}
        }
=======
      goToCalendar() {
        this.$router.push({ name: 'CalendarTeacher', params: {menemonic: this.wieOmTeWys} })
      },
      changeType() {
        if (this.menuType == 'all') { this.menuType = 'admin'; return}
        if (this.menuType == 'admin') { this.menuType = 'teacher'; return}
        if (this.menuType == 'teacher') { this.menuType = 'student'; return}
        if (this.menuType == 'student') { this.menuType = 'other'; return}
        if (this.menuType == 'other') { this.menuType = 'all'; return}
>>>>>>> 121ea14dcce9c3f036da38d4cab97fb8f18a92e8
      },
        // loadFunctions() {
        //    this.loading = true
        //    let ts = {};
        //    ts.task = 'PlainSql';
        //    ts.sql = 'select * from dkhs_lfunction order by sortorder'
        //    //ts.api = zmlConfig.apiDKHS
        //    zmlFetch(ts, this.showData, this.loadError)
        // },
        // loadError(response) {
        //     //this.$cs.l(response)
        //     this.loading = false
        //     alert(response)
        // },
        // showData(response) {
        //    this.getZml.functions = response
        //    this.loading = false
        // },
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
          //if (!this.getZml.functions.length) this.loadFunctions()
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

