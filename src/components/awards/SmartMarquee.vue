<template>
<div>
    <div>
    <dynamic-marquee
    direction="column"
    :reverse="istrue"
    :repeat="istrue"
    :hoverPause="istrue"
    :speed="speed"
     >
     xxxx
     yyy
        <v-btn>sdfj ;sadjf</v-btn>
        <div>dsfg</div>
        <div>dsfgdsfg</div>
    </dynamic-marquee>
     </div>
xx
 <v-card class="mt-9 rounded" color="rgba(105, 199, 71, 0.3)">
  <v-card-title primary-title class="justify-center">
    <v-card color="rgb(5, 101, 18, 0.4)" class="rounded pa-3">
      <h1 class="wordbreak text-justify"> {{ heading }}</h1>
    </v-card>
  </v-card-title>
  <v-card-text> 
     <v-row justify-lg="center">
       <v-col align="center" cols="12" lg="6" md="6">
         <v-sheet align-content-center  width="262">
           <v-img class="rounded"
            src="/img/trophyback5.jpg"
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
           <v-card  color="rgb(15, 1, 18, 0.8)"> 
            <div class="rounded koek1 yellow--text text--accent-2">
              <v-icon color="yellow"> mdi-star </v-icon>
  IETS BOAAN
              <v-icon color="yellow"> mdi-star </v-icon>
            </div>
            
            </v-card>
            <v-card color="rgb(15, 1, 18, 0.8)" class="rounded">
              <div v-for="a in ['aa','bb','Werner','WERNER SMIT','ee','ff']" :key="a">
            <div class="rounded koek yellow--text text--accent-2">
                
              <v-icon color="yellow"> mdi-star-face </v-icon>
                   ** {{ a }}  **
              <v-icon color="yellow"> mdi-star-outline </v-icon>                  
              <dynamic-marquee
                   direction="row"
               >
                  <div>sdfj ;sadjf</div>
                  <div>dsfg</div>
                  <div>dsfgdsfg</div>
              </dynamic-marquee>
            </div>

              </div>
            </v-card>
      </v-col>
    </v-row>
  </v-card-text>
 </v-card>
 cc
 </div>
</template>


<script>
//import DynamicMarquee from 'vue-dynamic-marquee'
import DynamicMarquee from '@/test/DynamicMarquee.ts'
export default {
    name: "smartDisplay",
    components: {DynamicMarquee},
    props: {
            panelIndex:Number},
    data () {
      return {
        show:false,
        heading:"dfsfs DDSDSD dfsdfsdf",
        currentPanel:null,
        istrue:true,
        speed:{type: 'pps', number: 100},
       } 
    },
    methods: {
        onKeyDown(){
            console.log('keydown')
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