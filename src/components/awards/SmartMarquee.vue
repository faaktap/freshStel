<template>
<div>
    <!--div>
    <dynamic-marquee
    direction="column"
    :reverse="istrue"
    :repeat="istrue"
    :hoverPause="istrue"
    :speed="speed"
     >
        <v-btn>sdfj ;sadjf</v-btn>
        <div>dsfg</div>
        <div>dsfgdsfg</div>
    </dynamic-marquee>
     </div-->

 <v-card class="mt-9 rounded" color="rgba(105, 199, 71, 0.3)">
  <v-card-title primary-title class="justify-center">
    <v-card color="rgb(5, 101, 18, 0.4)" class="rounded pa-3">
      <h1 class="wordbreak text-justify"> {{ heading }}</h1>
    </v-card>
  </v-card-title>
  <v-card-text> 
     <v-row justify-lg="center">
       <v-col align="center" cols="12" lg="6" md="6">
         <v-card  color="rgb(15, 1, 18, 0.8)" class="mt-2"> 
           <v-img class="rounded"
              src="/img/trophyback5.jpg"
              lazy-src="img/lazyload.png"
              cover
             @load="show == true">
              <template v-slot:placeholder>
               <v-row class="fill-height ma-0"
                      align="center"
                      justify="center">
               <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
              </v-row>
             </template>             
           </v-img>
         </v-card>

        </v-col>
        <v-col align="center" cols="12" lg="6" md="6">
           <v-card  color="rgb(15, 1, 18, 0.8)"> 
            <div class="rounded koek1 white--text ma-2">
              <v-icon color="light-green"> mdi-star </v-icon>
                 {{ listHeading }}
              <v-icon color="light-green"> mdi-star </v-icon>
            </div>
            
            </v-card>
            <v-card color="rgb(15, 1, 18, 0.8)" class="rounded" height="300">
              <transition-group xname="list-complete" name="list" tag="div">
              <div v-for="a in listFilter" :key="a.id">
                <div class="koek lightgray--text">
                   <!--h2> <v-icon color="yellow"> mdi-star-outline </v-icon>  {{ a.name }}  </h2-->
                   <h2 class="ml-4 xtext-justify"> {{ a.name }} </h2><br>
                </div>
              </div>
              </transition-group>
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
//import DynamicMarquee from '@/test/DynamicMarquee.ts'
export default {
    name: "smartDisplay",
   // components: {DynamicMarquee},
    props: {
            panelIndex:Number,
            list:Array,
            listHeading:String,
            heading:String,
            size:String,
            },
    data () {
      return {
        show:false,
        currentPanel:null,
        istrue:true,
        speed:{type: 'pps', number: 100},
        //list: [{id:1 ,name:'Caterina Malbel'},{id:2 ,name:'Caterina Malbsek'},{id:3 ,name:'Caty Malbek'},{id:4 ,name:'Karet Zofar'}],
        timerHandle:null,      
       } 
    },
    computed:{
      listFilter(){
        if (this.list.length < 7) return this.list;
        return this.list.slice(this.list.length-7, this.list.length)
      },
    },
    methods: {
        onKeyDown(){
            console.log('keydown')
        },      
        sleep(ms) {
           return new Promise(resolve => setTimeout(resolve, ms));
        },
        doSomething(param) {
          console.log('ds', param)
          //this.list.unshift({id: Math.floor(Math.random() * (1000 + 1)) ,name:"New Name " +  Math.floor(Math.random() * (1000 + 1)) })
          //this.list.pop()
          //this.list.pop()
          this.list.pop()
          if (this.list.length == 6) {
            clearInterval(this.timerHandle);
            console.log('we are done!')
            this.$emit('wearedone')
          }

        },
        startTimer(duration, funcToCall) {
          let timer = duration, minutes, seconds;
          console.log(duration, minutes, seconds,timer)
          this.timerHandle = setInterval(function () {
            minutes = parseInt(timer / 60, 10);
            seconds = parseInt(timer % 60, 10);
            minutes = minutes < 10 ? "0" + minutes : minutes;
            seconds = seconds < 10 ? "0" + seconds : seconds;
            console.log(minutes + ":" + seconds)
            //display.textContent = minutes + ":" + seconds;
            funcToCall('param')
            if (--timer < 0) {
              timer = duration;
            }
          }, 2000);
        }        
    },
    mounted: function() {
      console.log('start marquee timer')
      if (this.list.length) {
         this.startTimer( 60 * 5, this.doSomething)
      }
    }
}
</script>

<style scoped>
.flip-list-move {
  transition: transform 1s;
}

.list-enter-active,
.list-leave-active {
  transition: all 1s;
}
.list-enter,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.list-item {
  transition: all 1.8s ease;
  display: inline-block;
  margin-right: 10px;
}
.list-enter-from,
.list-leave-active,
.list-leave-to {
  transition: all 0.8s ease;
  opacity: 0;
  transform: translateX(30px);
}
.list-move {
  transition: transform 1s;
}



.list-complete-item {
  transition: all 0.8s ease;
  display: inline-block;
  margin-right: 10px;
}

.list-complete-enter-from,
.list-complete-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

.list-complete-leave-active {
  position: absolute;
}

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