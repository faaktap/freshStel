<template>
<div>
  <v-btn @click="showList = !showList" :title="allAboutPers"> 
       {{ selected }}
  </v-btn>

 <v-row v-if="personelList.length && showList">
  <v-col cols="12" sm="2" md="2" lg="2" xl="1"  v-for="p in personelList" :key="p.persid" class="ma-1 pa-1">
    <!--student-grade v-model="gradeClass" /> you selected : {{ gradeClass}}-->
    <v-btn @click="selectClick(p)"
           @mouseover="hover = p.menemonic"
    >
     {{ p.menemonic }} 
    </v-btn>
    <div v-if="hover == p.menemonic"
        xclass="v-card--reveal display-3"
         >
          <v-card :elevation="hover ? 12 : 2" 
                   class="mx-auto"
                   color="light-blue ">
            <v-card-text class="my-1 text-center wordbreak" color="yellow--text">
               {{ p.surname }}, {{p.name}}, {{ p.registergrade}}{{p.registerclass}} </v-card-text>
          </v-card>



    </div>
  </v-col>
 </v-row>
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