<template>

 <v-card class="mt-9 rounded" color="rgba(105, 199, 71, 0.3)">
  <v-card-title primary-title class="justify-center">
    <v-card color="rgb(5, 101, 18, 0.4)" class="rounded pa-3">
      <h1 class="wordbreak text-justify"> {{ studentName }}</h1>
    </v-card>
  </v-card-title>
  <v-card-text> 
     <v-row justify-lg="center">
       <v-col align="center" cols="12" lg="6" md="6">
         <v-sheet align-content-center  width="262">
           <v-img class="rounded"
            :src="'https://kuiliesonline.co.za/api/candid/candidates.php?task=photo&type=aw&studentno='+studentid"
            lazy-src="img/lazyload.png"
             width=260 contain
             @load="show == true">
              <template v-slot:placeholder>
               <v-row class="fill-height ma-0"
                      align="center"
                      justify="center">
               <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
              </v-row>
             </template>             
           </v-img>
           
         </v-sheet>
         <!--v-divider v-if="$vuetify.breakpoint.mdAndUp" class="mx-4" vertical /-->
        </v-col>
        <v-col align="center" cols="12" lg="6" md="6">
           <v-card v-if="extraNote.length > 0" color="rgb(15, 1, 18, 0.8)"> 
            <div class="rounded koek1 yellow--text text--accent-2">
              <v-icon color="yellow"> mdi-star </v-icon>
              AVERAGE / GEMIDDELD – <b>{{ extraNote }}</b>
              <v-icon color="yellow"> mdi-star </v-icon>
            </div>
            
            </v-card>
            <v-list color="rgb(15, 1, 18, 0.8)" class="rounded">
             <v-list-item-group>
              <div v-for="awa in diplomaList" :key="awa.awardid">
               <v-list-item >
               <v-list-item-icon v-if="!$vuetify.breakpoint.smAndDown">
               <v-icon v-if="awa.dip.length > 0"> mdi-star </v-icon>
               <!--v-icon v-else>mdi-star-three-points-outline</v-icon-->
               </v-list-item-icon>
               <v-list-item-content>
                <div v-if="awa.dip.length > 0" class="mb-1 koek1">
                  {{ awa.dip }}
                  <v-divider  /> 
                </div>
                <v-list-item-title align="center" class="mt-2 koek">
                    <h2 v-if="awa.sub.length < 30">{{ awa.sub }} </h2>
                    <div class="text-caption" v-else>{{ awa.sub }} </div>
                </v-list-item-title>
               </v-list-item-content>
               </v-list-item>
              </div>
             </v-list-item-group>
            </v-list>
      </v-col>
    </v-row>
  </v-card-text>
 </v-card>
</template>


<script>
import {debounce, animateCss} from '@/api/externals'; 
export default {
    name: "smartDisplay",
    components: {},
    props: {studentid:String
           ,studentName:String 
           ,diplomaList:Array
           ,extraNote: {type: String, default: ""}
           ,alles:Object
           ,panelIndex:Number},
    data () {
      return {
        show:false,
        currentPanel:null,
       } 
    },
    methods: {
        onKeyDown(){
            debounce(function(){
                animateCss('#searchboxui-wrapper', 'fadeOutDown',function(){
                    document.querySelector('#searchboxui-wrapper').style.display = 'none';
                });
            });
        },      
        sleep(ms) {
           return new Promise(resolve => setTimeout(resolve, ms));
        },
    },
    watch: {
    }
}
</script>

<style scoped>
.deco1 {
text-decoration: underline wavy red
}

.rounded{
    border-radius:50px;
}

.rcorners1 {
  border-radius: 55px;
  xpadding: 20px;
}

.wordbreak {
  overflow-wrap: break-word;
  word-wrap: break-word;
  word-break: break-all;
  word-break: break-word;
  hyphens: auto;
}

.koek1 { font-family: 'Noto Sans JP', sans-serif;}
.koek {font-family: 'Dancing Script', cursive;}

/* always present */
.expand-transition {
  transition: all .3s ease;
  height: 30px;
  padding: 10px;
  background-color: #eee;
  overflow: hidden;
}
/* .expand-enter defines the starting state for entering */
/* .expand-leave defines the ending state for leaving */
.expand-enter, .expand-leave {
  height: 0;
  padding: 0 10px;
  opacity: 0;
}
.v-carousel .v-window-item {
  position: absolute;
  top: 0;
  width: 100%;
}
</style>