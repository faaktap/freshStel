<template>
<div>
 <v-overlay
      :opacity=".5"
      :value="loading"> 
  <v-progress-circular indeterminate size="64">
     Loading...
  </v-progress-circular>
 </v-overlay> 

  <v-parallax src="/img/boSkool.jpg" height="1300px">
  <!-- src="/img/vlaghys6842.jpg" -->
  <v-container fluid>
   <v-layout row fill-height justify-center color="rgba(255, 0, 1, 0.5)"  style="height: 100vh" >
    <v-carousel v-model="panelIndex" 
                v-on:keyup.a="panelIndex++" 
                v-on:keyup.d="panelIndex--"
                :interval="interval" 
                height="100%"
                hide-delimiters show-arrows-on-hover                
               :continuous="false"
               :cycle="cycle"
               :touch="{left: () => panelIndex--, right: () => panelIndex++}">
      <v-carousel-item v-for="page in awardList"
                      :key="page.storyid"
                       color="rgba(255, 1, 7, 0.2)" 
                       contain 
                      :transition="page.transition"
                       style="height: 100vh"
                      >   
        <InsideTestRoute :page="page">
           
        </InsideTestRoute>

     </v-carousel-item>
    </v-carousel>
   </v-layout>
  </v-container>

  <v-layout class="mx-auto" >
     <div class="px-2 red--text text--accent-2"> DKHS Award Show  </div> 
        <v-btn  x-small color="secondary" @click="cycle = !cycle">
         <div v-if="cycle==true"><v-icon small title="busy playing"> mdi-play</v-icon></div>
         <div v-else><v-icon small title="paused"> mdi-pause</v-icon></div>
        </v-btn>
        <v-btn x-small color="secondary"  @click="panelIndex--">
         <v-icon small> mdi-minus</v-icon>
        </v-btn>       
        <v-btn x-small color="secondary"  @click="panelIndex++"
               title="Use A and S to move left and right">
         <v-icon small> mdi-plus</v-icon>
        </v-btn>       
        <v-btn x-small color="arrow-expand"  @click="showChapters = !showChapters">
         <v-icon small> mdi-arrow-expand</v-icon>
        </v-btn>      
        <v-btn x-small color="arrow-expand"  @click="backgroundSoundMute">
         <v-icon small> mdi-volume-mute</v-icon>
        </v-btn>      
        <!-- <v-card class="mt-0 mx-1 px-1" min-width=110px >
           this slider control speed the next few items up to much...
           <v-slider dense
           hint="faster to slower"
           v-model="interval"
           max="20000"
           min="1000"
           step="100"
           thumb-label
           ticks
           color="green"
         ></v-slider>
         {{ interval }}
         </v-card>
         -->
        <!-- <v-autocomplete v-model="storyIndex"       
        v-if="showChapters"
        :items="carouselDataFilter()"
        :search-input.sync="search" 
        item-text="detail1" 
        item-value="sortid"
        dense
        label="Select a Chapter" />  -->
  </v-layout> 

 </v-parallax>
</div>
</template>

<script>
import { zData } from "@/api/zGetBackgroundData.js"
import InsideTestRoute from './InsideTestRoute.vue'
import { awardStrFunc } from './awardStrFunc.js'
export default {
    components:{InsideTestRoute},
    props: {
      chapterid: { type: String,
                  default: '25' },
      orderid: { type: String,
                default: '1' },
    },
    data () {
      return {
        zData:zData,
        loading:false,
        localChapter:0,
        localItem:0,
        awardList:[] ,
        sqlStatement:'',
        currentEditMode: false,
        showChapters: false,
        startSlideShow: false,
        search:'',
        storyIndex: 0,
        panelIndex:null,
        cycle:true,
        interval: 9000,
        countDown: 0,
        bg:['img/trophyback1.jpg'
           ,'img/trophyback2.jpg'
           ,'img/trophyback3.jpg'
           ,'img/trophyback4.jpg'
           ,'img/trophyback5.jpg'
           ,'img/trophyback6.jpg'],
        bgIndex:2,
        schoolSongSound:new Audio('https://www.kuiliesonline.co.za/dkhs/data/sounds/SchoolSong.mp3'),
       } 
   }, 
   computed: {    
   }, 
   methods: {
     marqueeBusy() {
       //this.$cs.l('cycle stopped, marquee busy')
       this.cycle=false
     },
     marqueeDone() {
       //this.$cs.l('cycle started, marquee done')
       this.cycle=true
     },
     carouselDataFilter() {
         let arr = this.awardList.filter(a => (a.type == 1 || a.type == 5) );
         return arr;
     },
     processData(response) {
        this.localItem = 1
        if (response[0].chapterid) {
           this.localChapter = response[0].chapterid
        } else {
           this.localChapter = this.$route.params.chapterid
        }
        if ( this.$route.params.orderid ) this.localItem = this.$route.params.orderid
     //alert(this.localChapter + ' ' + this.localItem )
        if (this.localItem && this.localChapter) {
        this.sqlStatement = 'SELECT * FROM dkhs_story '
                          + ' WHERE chapterid = ' + this.localChapter
                          + ' and orderid >= ' + this.localItem
                          + ' order by orderid asc'
        }

       zData.loadSql(this.loading, this.sqlStatement, this.assignData)
     },
     assignData(response) {
        let transitions = ["slide-transition","fade-transition", "fab-transition","scale-transition","slide-transition","none","nono"]
        this.awardList = response
        this.awardList.forEach(e => {
          e.image = awardStrFunc.imageDisplay(e)
          if (e.type == 2) {
             //check if detail2 start with the word DIPLOMA: and of it does, build a list
             e.detail2 = awardStrFunc.convertTextToArray(e.detail2)
          }
          e.transition = transitions[Math.floor(Math.random() * (6) + 1)]
          console.log(e.transition)

        })
        this.loading =  false
        this.startSlideShow = true

     },
     loadError(error) {
        //this.$cs.l(error)
        alert(error)

     },   
     backgroundSound() {
        console.info('start backgroundsound', this.carouselSound);
     }, 
     backgroundSoundMute() {
        console.info('mute backgroundsound', this.schoolSongSound, this.schoolSongSound.volume);
        if (this.schoolSongSound.mutes == true) {
            this.schoolSongSound.mutes = false;
            this.schoolSongSound.volume = 0.02;            
        } else {
           //this.carouselSound.mutes = true;
           this.schoolSongSound.mutes = true;
           this.schoolSongSound.volume = 0
        }
     }, 
     doCommand(e) {
       let cmd = String.fromCharCode(e.keyCode).toLowerCase();
       ////this.$cs.l(cmd,e);
       switch (cmd) {
       case ",":
       case "<":
       case "a": this.panelIndex--;break
       case ".":
       case ">":
       case "x":       
       case "s": this.panelIndex++;break
       }
     }
   },
   created() {
     window.addEventListener('keypress', this.doCommand);
   },
   destroyed() {
     window.removeEventListener('keypress', this.doCommand);
   },
   mounted: function () {
     this.currentEditMode = (this.editmode === undefined) ? false : this.editmode;
     let sql = "select * from dkhs_storymain where activedate > NOW() - INTERVAL 30 DAY"
     this.loading = true
     zData.loadSql(this.loading, sql, this.processData)
   },
   watch: {
     storyIndex: function() {
         //see what index of studIndex is in winnerNames...
         let ind = this.awardList.findIndex(e => e.sortid == this.storyIndex);
         if (ind != -1) this.panelIndex = ind;
         
       },
    panelIndex: function(n) {
       if (n == 50 || n == 175) {
         this.schoolSongSound.volume = 0.2;
         this.schoolSongSound.play();  //this.backgroundSound();
       }
       this.countDown = this.interval/1000;
    }
   }
}
</script>
<style scoped>
.koek {font-family: 'Dancing Script', cursive;}
</style>