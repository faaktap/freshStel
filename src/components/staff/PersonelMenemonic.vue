<template>
<div>
  <v-btn @click="showList = !showList" :title="allAboutPers">
       {{ selected }} {{ value }}
  </v-btn>
  <v-dialog v-model="showList"
          :fullscreen="$vuetify.breakpoint.mobile" xmax-width="600" width="auto">
   <v-card color="light-blue" class="ma-1 pa-1">
    <v-card-title>
      Teacher List  <v-spacer /><small>{{ toggle }}</small>
      <v-btn-toggle v-model="toggle" mandatory>
      <v-btn small icon> <v-icon>mdi-file-image</v-icon> </v-btn>
      <v-btn small icon> <v-icon>mdi-file-document</v-icon> </v-btn>
      <v-btn small icon> <v-icon>mdi-image</v-icon> </v-btn>
      </v-btn-toggle>
    </v-card-title>
      <v-layout v-if="personelList.length && showList"
                row wrap align-center justify-space-around>
        <v-flex v-for="p in personelList"
                :key="p.persid" class="ma-1 pa-1">

         <v-btn v-if="toggle == 0" @click="selectClick(p)"
               :title="p.surname +', '+ p.name +', ' + p.registerclass"
                class="ma-1"
          >
           {{ p.menemonic }}
         </v-btn>
         <v-btn v-if="toggle == 1" @click="selectClick(p)"
                small
               :title="p.surname +', '+ p.name +', ' + p.registergrade + p.registerclass"
                style="border-radius:50px"
                class="ma-1"
          >
          {{ p.surname }}, {{ p.name }}, {{ p.registerclass }} [{{ p.menemonic }}]
         </v-btn>
         <v-card color="blue" v-if="toggle == 2"  class="text=center">
         <v-img @click="selectClick(p)"
               :title="p.surname +', '+ p.name +', ' + p.registergrade + p.registerclass"
                class="ma-0 text-center"
                position="center center"
                max-width="70"
                max-height="70"
                contain
          :src="'https://kuiliesonline.co.za/bib/assets/staff/' + p.photo + '?'+Math.random()"
          ><div>
          {{ p.menemonic }}
          </div>
         </v-img>
         </v-card>

   </v-flex>
  </v-layout>

 </v-card>
</v-dialog>
</div>
</template>

<script>
import { zmlFetch } from '@/api/zmlFetch';
import { zmlConfig } from '@/api/constants';
export default {
    name:"PersonelMenemonic",
    components:{},
    props:[
     'value'
    ],
    data: () => ({
        personelList:[],
        showList:false,
        selected:"Teacher",
        hover:null,
        allAboutPers:'',
        toggle:0
    }),
    methods:{
      selectClick(pList) {
          this.$emit('input',pList.menemonic)
          this.$emit('userid',pList.userid)
          this.selected=pList.menemonic
          this.showList=false
          this.allAboutPers = pList.surname + ', ' + pList.name
      },
      loadData(response) {
        this.personelList = response
      },
      loadError(response) {
        alert('P.M.' + response)
      },
     },
    mounted() {
        if (this.personelList.length == 0) {
           let ts = {}
           ts.task = 'PlainSql'
           ts.sql = `SELECT l.userid, p.persid, p.username, menemonic, registergrade, registerclass, surname, name, room, photo \
                     FROM dkhs_personel p,  dkhs_learner l \
                     WHERE p.menemonic = l.user_name \
                       AND workarea != 'WEG' \
                       AND room != 'WEG' \
                     ORDER by menemonic`
           ts.api = zmlConfig.apiDKHS
           zmlFetch(ts, this.loadData, this.loadError);
        }
    },
    watch: {
      personelList() {
      }
    }
}
</script>
<style scoped>
.v-card--reveal {
    align-items: center;
    bottom: 0;
    justify-content: center;
    opacity: .7;
    position: absolute;
    width: 100% ;
}
.wordbreak {
  overflow-wrap: break-word;
  word-wrap: break-word;
  word-break: break-all;
  word-break: break-word;
  hyphens: auto;
}
</style>