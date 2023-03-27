<template>

  <v-btn  @click="showList = !showList"
         :x-small="xSmall"
         :title="allAboutPers || selected"
         color="primary"
  >
    <v-icon :small="xSmall">
      mdi-human-male-board
    </v-icon>
    <slot>
    </slot>
  <v-dialog v-model="showList"
          :fullscreen="$vuetify.breakpoint.mobile" max-width="900" width="auto" >
   <v-card class="ma-1 pa-1">
    <v-card-title>
      Teacher List
      <v-spacer />
      <!-- <small class="text-caption">{{ toggle }}</small> -->
      <v-btn-toggle v-model="toggle" mandatory>
      <v-btn small icon> <v-icon>mdi-file-image</v-icon> </v-btn>
      <v-btn small icon> <v-icon>mdi-image</v-icon> </v-btn>
      <v-btn small icon> <v-icon>mdi-file-document</v-icon> </v-btn>
      </v-btn-toggle>
    </v-card-title>
      <v-layout v-if="personelList.length && showList"
                row wrap align-center justify-space-around>
        <v-flex v-for="p in personelList"
                :key="p.persid" class="ma-1 pa-1">

<!------------------------------------------------ Toggle = 0 -------------------->
         <v-btn v-if="toggle == 0"
                @click="selectClick(p)"
                :title="`${p.surname}, ${p.name} , ${p.grade || p.workarea}`"
                class="ma-0 pa-0"
                :color="workareaColor(p.workarea)"
          >
           {{ p.menemonic }}
         </v-btn>
<!------------------------------------------------ Toggle = 2 -------------------->
         <v-btn v-if="toggle == 2" @click="selectClick(p)"
                small
               :title="`${p.surname}, ${p.name} , ${p.registergrade}`"
                style="border-radius:50px"
                class="ma-1"
                :aspect-ratio="9/16"
                :color="workareaColor(p.workarea)"
          >
          {{ p.surname }}, {{ p.name }}, {{ p.grade || p.workarea }} [{{ p.menemonic }}]
         </v-btn>
<!------------------------------------------------ Toggle = 1 -------------------->
         <v-card :color="workareaColor(p.workarea)" v-if="toggle == 1"  class="text=center px-1 pt-1">
         <!-- <v-avatar> -->
         <v-img @click="selectClick(p)"
               :title="`${p.surname}, ${p.name} , ${p.grade || p.workarea}`"
                class="text-center"
                position="center center"
                max-width="50"
                min-width="50"
               :aspect-ratio="9/16"
               style="border-radius:20px"
          :src="'https://kuiliesonline.co.za/bib/assets/staff/' + p.photo + '?'+Math.random()"
          >

         </v-img>
         <span>          {{ p.menemonic }}          </span>
         <!-- </v-avatar> -->
         </v-card>

   </v-flex>
  </v-layout>

 </v-card>
</v-dialog>
</v-btn>

</template>

<script>
import { zmlFetch } from '@/api/zmlFetch';
import { zmlConfig } from '@/api/constants';
export default {
    name:"PersonelMenemonic",
    components:{},
    props:{
      value:{default: ''},
      xSmall:{type:Boolean, default: false}
    },
    data: () => ({
        personelList:[],
        showList:false,
        selected:"Teacher",
        hover:null,
        allAboutPers:'',
        toggle:0
    }),
    methods:{
      workareaColor(workarea) {
        switch (workarea.toLowerCase()) {
          case 'teacher' : return "primary";
          case 'graadhoof' : return "gold";
          case 'principal' : return "orange";
          case 'support' : return "green lighten-1";
          case 'sport' : return "green";
          case 'finance' : return "indigo";
          case 'admin' : return "orange lighten-1";
          case 'ontvangs' : return "orange lighten-2";
          default : return "cyan"
        }
      },
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
           ts.sql = `SELECT l.userid, p.persid, p.username, menemonic \
                          , registergrade, registerclass, surname, name, room, workarea, photo \
                          , concat('G',registergrade,registerclass) grade
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