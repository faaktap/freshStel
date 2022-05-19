<template>
<div>
  <v-btn @click="showList = !showList" :title="allAboutPers">
       {{ selected }}
  </v-btn>
  <v-dialog v-model="showList"
          :fullscreen="$vuetify.breakpoint.mobile" xmax-width="600" width="auto">
   <v-card color="primary" class="ma-4 pa-2">
    <v-card-title> Teacher/Staff List </v-card-title>
      <v-layout v-if="personelList.length && showList"
                row wrap align-center justify-space-between>
        <v-flex v-for="p in personelList"
                :key="p.persid" class="ma-1 pa-1">
         <v-btn @click="selectClick(p)"
               :title="p.surname +', '+ p.name +', ' + p.registerclass"
                class="ma-2"
          >
     {{ p.menemonic }}
    </v-btn>
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
    props:{

    },
    data: () => ({
        personelList:[],
        showList:false,
        selected:"Teacher",
        hover:null,
        allAboutPers:'',
    }),
    methods:{
      selectClick(pList) {
          this.$emit('input',pList.menemonic)
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
           ts.sql = "SELECT persid, username, menemonic, registergrade, registerclass, surname, name, room "
               + "FROM dkhs_personel WHERE length(menemonic) > 1 order by menemonic"
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