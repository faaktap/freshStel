<template>
<div>
  <observer @on-change="onChange">
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
              
              <v-btn x-small  @click="pause = !pause">
                 <v-icon color="light-green"> mdi-star </v-icon>
                 <template v-if="!pause">
                    pause
                 </template>
                 <template v-else>
                    continue
                 </template>
                 <v-icon color="light-green"> mdi-star </v-icon>
              </v-btn>
            </div>
            
            </v-card>
            <v-card color="rgb(15, 1, 18, 0.8)" class="rounded  pb-1" height="300">
              <transition-group xname="list-complete" name="list" tag="div">
              <div v-for="a in listFilter" :key="a.name">
                <!-- {{ passedList.length }} {{ list.length }} -->
                <div class="koek lightgray--text">
                   <!--h2> <v-icon color="yellow"> mdi-star-outline </v-icon>  {{ a.name }}  </h2-->
                   <h2 class="pt-2 ml-3 xtext-justify"> {{ a.name }} </h2><br>
                </div>
              </div>
              </transition-group>
            </v-card>
               
      </v-col>
      
    </v-row>
    
  </v-card-text>
 </v-card>
 <!--v-row>
   <v-col cols="6">
     {{ passedList}}
   </v-col>
   <v-col cols="6">
     {{ listFilter }}
     <hr>
     {{ list }}
   </v-col>
 </v-row-->
  </observer>
 </div>
</template>


<script>
//import DynamicMarquee from 'vue-dynamic-marquee'
//import DynamicMarquee from '@/test/DynamicMarquee.ts'
import Observer from 'vue-intersection-observer'
export default {
    name: "smartDisplay",
    components: {Observer},
    props: {
            panelIndex:Number,
            propPassedList:Array,
            propPassedString:String,  //allow them to pass a string with commas
            listHeading:String,
            heading:String,
            size:String,
            },
    data () {
      return {
        list:[],
        passedList:[],
        show:false,
        currentPanel:null,
        istrue:true,
        speed:{type: 'pps', number: 100},
        //list: [{id:1 ,name:'Caterina Malbel'},{id:2 ,name:'Caterina Malbsek'},{id:3 ,name:'Caty Malbek'},{id:4 ,name:'Karet Zofar'}],
        timerHandle:null,      
        pause:false,
        indexList:0,
        firstIteration:true,

       } 
    },
    computed:{
      listFilter(){
        if (this.list.length < 7) return this.list;
        return this.list.slice(0, 7)
      },
    },
    methods: {
        onChange(entry, unobserve) {
          // When this is executed, we are onscreen!
          // After loading Cancel monitoring, optimise performance
          if (entry.isIntersecting) {
            unobserve()
            console.log('entry - not observing anymore..', entry)
          }
          
        },
        onKeyDown(){
            console.log('keydown')
        },      
        sleep(ms) {
           return new Promise(resolve => setTimeout(resolve, ms));
        },
        doSomething(param) {
          if (this.pause == true) return;
          if (param == '') return;  //we dont use the param - can take it out
          if (this.list.length == this.passedList.length) {
            this.list.length = 0
            //Starting fresh
            //console.log('we are done - but are continuing the display for effect')
            if (this.firstIteration == true) {
              this.$emit('wearedone')
              this.firstIteration = false
            }
          } else {
            const currentOne = this.list.length
            this.list.unshift(this.passedList[currentOne])
          }
        },
        startTimer(duration, funcToCall) {
          let timer = duration, minutes, seconds;
          this.timerHandle = setInterval(function () {
            minutes = parseInt(timer / 60, 10);
            seconds = parseInt(timer % 60, 10);
            minutes = minutes < 10 ? "0" + minutes : minutes;
            seconds = seconds < 10 ? "0" + seconds : seconds;
            funcToCall(minutes + ':' + seconds)
            if (--timer < 0) {
              timer = duration;
            }
          }, 2000);
        },
        startTheProcess() {
           console.log('We are activated = len:', this.list.length)
           this.pause = false
           if (this.passedList.length) {
              this.startTimer( 60 * 5, this.doSomething)
              this.$emit('wearebusy')
           }
        },
        stopTheProcess() {
          console.log('We are DEactivated = len:', this.list.length)
          this.pause = true
        }
    },
    activated: function() {

    },
    deactivated: function()  {
    },
    mounted: function() {
      this.startTheProcess()
    },
    watch: { 
      propPassedString: {
        immediate: true,
        handler() {
          if (this.propPassedString) {  
            //this.passedList = this.propPassedString.split(',')    
            if (this.propPassedString.length > 1 ) {
              //this is one long string with commas, put it in a single array
              let test  = this.propPassedString.split(',')
              test.forEach(a => this.passedList.push({ name:a }))
            } else {
              this.passedList = Array.from(this.propPassedString, a => ({ name:a }) )
            }
          } else {
            this.passedList = this.propPassedList
          }
        }
      },
      propPassedList: {
        immediate: true,
        handler(newval) { 
          console.log('watch handler for propPassedLIST' , newval)
          if (this.propPassedList && this.propPassedList.length > 0) {
             this.passedList = this.propPassedList
          }
          console.log('passedList = (from[])', this.passedList)
        }
      }
   },
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

.koek1 { font-family: 'Noto Sans JP', sans-serif; }
.koek {font-family: 'Dancing Script', cursive; font-size:3.8vh ;}

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