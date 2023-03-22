<template>
<v-container fluid>
<v-btn @click="showWernerTest=!showWernerTest"> Swop to Other Visual tests (CARDS) </v-btn>
<v-container v-if="showWernerTest" fluid>
<v-card class="ma-2 pa-2">
 <v-card-title> Test Data Dialog </v-card-title>
 <v-row>
  <v-col cols="6">
   <base-date dense label="date" v-model="adate" />
  </v-col>
  <v-col cols="6">
   <base-date label="date" v-model="adate" />
  </v-col>
 </v-row>
</v-card>


<v-card elevation="4" class="ma-2 pa-2">
 <v-card-title> Testing a badge with hover </v-card-title>
 <v-row>
  <v-col>
 <v-card-text>
 <v-hover v-slot:default="{ hover }">
    <v-badge
     :value="hover"
     color="deep-purple accent-4"
     :content="`This is some content ${getZml.login.fullname}`"
     right
     transition="slide-x-transition"
    >
        <v-icon>mdi-fountain-pen-tip</v-icon>
    </v-badge>
 </v-hover>
 </v-card-text>
  </v-col>
  <v-col>
 <v-card-title> Testing same idea inside hover-icon component called hover-icon (using a badge) </v-card-title>
 <v-card-text>
<hover-icon text="some text on slide" icon="mdi-fountain-pen" color="red" class="ma-2 pa-2" x-large />
 </v-card-text>
  </v-col></v-row>
</v-card>


<v-card max-width="600px" elevation="4" class="ma-2 pa=2">
  <v-card-title> Using above icon on a v-text-field, adding 2 icons at back </v-card-title>

  <v-card-text>
    <p> Unfortunately @click does not work at the moment - only info displayed </p>
<v-text-field label="Answer (optional)" title="play with append icon" prepend-inner-icon="mdi-test-tube">
  <template slot="append">
    <v-icon @click="play('the kettle')">mdi-kettle</v-icon>
    <hover-icon @click="play('the hover button')" text="I am a human!" icon="mdi-human"  />
  </template>
</v-text-field>
  </v-card-text>
</v-card>


<v-card max-width="800px"
       :color="textCol"
       :class="`${ gfc(textCol) }--text`"
       class="ma-2 pa-2"
>
  <v-card-title>
     Get either white or black for text color
  </v-card-title>
  <v-card-subtitle>
    We have 3 ways of choosing a color at the moment.. the TextColorPicker is the best i think
  </v-card-subtitle>
  <!-- {{ `{background-color: ${textCol} ,color: ${gfc(textCol)} }` }}<br> {{ `${ gfc(textCol) }--text` }} -->
 <span> AutoSelColor
  <auto-sel-color v-model="autoSCol"
                  label="AutoSelColor"
                  outlined
 /></span>
 <span> TextColorPicker :
  <text-color-picker v-model="textCol"
                     label="TextColorPicker"
                     outlined
  /></span>
  <span> BaseColor
  <base-color v-model="acolor"
              label="some color"
  />
  </span>

</v-card>

<v-card class="ma-2 pa-2" elevation="2">
  <v-card-title>
     HoverButton Component - button with submenu - on hover, you see dropdown - not good for mobile
  </v-card-title>
  <v-card-subtitle>
    We have 3 ways of choosing a color at the moment.. the TextColorPicker is the best i think
  </v-card-subtitle>

   <hover-button :fab="false"
                  icon="mdi-kettle"
                 :dropItems="[{title:`Look at me, i'm a Title!`}
                             ,{title:`Another Entry`}
                             ,{title:`These will do nothing yet`}
                             ]"
                  title="XXX"
                  @mainclick="play($event)"
                  @dropclick="play($event)"
                  color="red darken-2" />
</v-card>

<base-title-expand heading="Testing a toolbar ">
<v-toolbar color="primary">
    <v-toolbar-title>
      <div class="d-flex flex-no-wrap justify-space-between pr-4 ">
       <div>
         Menu functions for  {{ getZml.login.fullname}} / {{ getZml.login.username}}
       </div>
       <div>
        <v-btn small absolute top right
         color="blue-grey"
         class="ma-2 white--text"
         title="Click here to refresh"  @click="loadFunctions"> Refresh </v-btn>
       </div>
      </div>
    </v-toolbar-title>
</v-toolbar>


<div v-if="getZml.login.superUser">
     <v-expansion-panels>
        <v-expansion-panel>
          <v-expansion-panel-header>
              Stuff that only Werner should be able to see *Admin.vue
          </v-expansion-panel-header>
          <v-expansion-panel-content>
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

</v-container>
<werner-visual v-else @close="showWernerTest=false" />

</v-container>
</template>

<script>
import { zmlConfig } from '@/api/constants';
import { getters } from "@/api/store";
import { zmlFetch } from '@/api/zmlFetch.js'
import { zData } from '@/api/zGetBackgroundData.js';
import { doStuff } from '@/api/buttons'
import { infoSnackbar } from '@/api/GlobalActions';

import BaseTitleExpand from '@/components/base/BaseTitleExpand.vue';
import WernerVisual from '@/test/WernerVisual.vue';

import BaseDate from '@/components/base/BaseDate.vue';
import BaseColor from '@/components/base/BaseColor.vue';
import AutoSelColor from '@/components/AutoSelColor.vue';
import HoverIcon from '@/components/fields/HoverIcon.vue';
import TextColorPicker from '@/components/TextColorPicker.vue';
import HoverButton from '@/components/HoverButton'
import { vuetifyColor } from '@/api/vuetifyColor.js'
export default {
    name:"WernerTest",
    components:{BaseTitleExpand, BaseDate, BaseColor,AutoSelColor, TextColorPicker
             , HoverIcon
             , HoverButton
             , WernerVisual
    },
    data: () => ({
        getZml: getters.getState({ object: "gZml" }),
        joke:'',
        acolor:'#EB25D5FA',
        adate:null,
        autoSCol:'',
        textCol:'indigo lighten-2',
        showWernerTest: true
    }),
    computed:{
      computedTest() {
        if (!this.$vuetify.breakpoint.mdAndUp) {
          return 'background-image:""'
        }
        return ''
      }
    },
    methods:{
      gfc(color) {
        if (!color) return ''
        return vuetifyColor.getBestColor(color)
      },
      play(msg) {
        alert('You clicked on ' + msg)
      },
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
<style scoped>

</style>
