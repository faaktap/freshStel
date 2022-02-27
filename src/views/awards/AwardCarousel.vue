<template>
<!--
insert into dkhs_storymain
select 26,storytitle,icon,picture,background,now(), description, now(), now() from dkhs_storymain where storymainid = 25
-->
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
        <v-btn  x-small color="secondary" @click="cycle = !cycle" title="Play or pause">
         <div v-if="cycle==true"><v-icon small title="busy playing"> mdi-pause</v-icon></div>
         <div v-else><v-icon small title="paused"> mdi-play</v-icon></div>
        </v-btn>
        <v-btn x-small color="secondary"  @click="panelIndex--" title="go back">
         <v-icon small> mdi-minus</v-icon>
        </v-btn>
        <v-btn x-small color="secondary"  @click="panelIndex++"
               title="Use A and S to move left and right">
         <v-icon small> mdi-plus</v-icon>
        </v-btn>
        <v-btn x-small color="arrow-expand"  @click="showChapters = !showChapters" title="Show Chapters">
         <v-icon small> mdi-arrow-expand</v-icon>
        </v-btn>
        <v-btn x-small color="arrow-expand"  @click="backgroundSoundMute" title="Mute sound">
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
         </v-layout>
         </v-parallax>
<v-dialog v-model="showChapters"  :fullscreen="$vuetify.breakpoint.mobile" max-width="600" width="auto">
   <v-card>
      <v-card-title>
         Go to a specific chapter
      </v-card-title>
      <v-card-text>
        <v-autocomplete v-model="storyIndex"
        :items="carouselDataFilter()"
        :search-input.sync="search"
        item-text="detail1"
        item-value="sortid"
        dense
        label="Select a Chapter" />
      </v-card-text>
      <v-card-actions>
         <v-btn @click="showChapters = false"> Close </v-btn>
      </v-card-actions>
   </v-card>
</v-dialog>

  <v-data-table
       v-if="showAllPictures"
      :headers="awardListHeader"
      :items="awardList"
      :items-per-page="500"
      class="elevation-2"
      :loading="loading"
      @click:row="clickOnDiplomaRow" />


</div>
</template>

<script>
import { zData } from "@/api/zGetBackgroundData.js"
import InsideTestRoute from './InsideTestRoute.vue'
import { awardStrFunc } from './awardStrFunc.js'
import { zmlLog } from '@/api/zmlLog.js';
import { getters } from "@/api/store";
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
        getZml: getters.getState({ object: "gZml" }),
        zData:zData,
        loading:false,
        localChapter:0,
        localItem:0,
        awardList:[] ,
        awardListHeader:[
           { text: "Order", align: "start", value: "orderid" },
           { text: "student", align: "center", value: "studentid" },
           { text: "type", align: "center", value: "type" },
           { text: "detail1", align: "center", value: "detail1" },
           { text: "detail2", align: "center", value: "detail2" },
         ],
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
        codeWord:'',
        codeWordMatch:'werner',
        showAllPictures: false
       }
   },
   computed: {
   },
   methods: {
     clickOnDiplomaRow(e) {
        alert('Werner for Edit',e)
     },
     marqueeBusy() {
       this.cycle=false
     },
     marqueeDone() {
       this.cycle=true
     },
     carouselDataFilter() {
         let arr = this.awardList.filter(a => (a.type == 1 || a.type == 5) );
         return arr;
     },
     processData(response) {
        if ('error' in response && response.error.substr(0,7) == "no rows") {
           alert('No data available at the moment, check back soon!')
           this.loading =  false
           return
        }
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
        // console.log('assignData = ', response)
        let transitions = ["slide-transition","fade-transition", "fab-transition","scale-transition","slide-transition","none","nono"]
        this.awardList = response
        this.awardList.forEach(e => {
          // console.log('awardList Loop', e)
          e.image = awardStrFunc.imageDisplay(e, this.showAllPictures)
          // console.log('awardList Loop Image', e.image)
          if (e.type == 2) {
             //check if detail2 start with the word DIPLOMA: and of it does, build a list
             e.detail2 = awardStrFunc.convertTextToArray(e.detail2)
             e.extraNote = ""
             // console.log('AC AssignData : e.detail2 = ', e.detail2)
          }
          e.transition = transitions[Math.floor(Math.random() * (6) + 1)]
          // console.log('transistion', e.transition)

        })
        // console.log('list after conversion ' ,this.awardList)
        // alert('stop!!')
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
       switch (cmd) {
       case ",":
       case "<":
       case "a": this.panelIndex--;break
       case ".":
       case ">":
       case "x":
       case "s": this.panelIndex++;break
       case "w":
       case "e":
       case "r":
       case "n": this.codeWord += e.key;break
       }
       // console.log('doCommand:', cmd, ':',this.codeWord.substr(0,6) , ':', this.codeWordMatch.substr(0,6), this.showAllPictures)
       if (this.codeWord.substr(0,6) == this.codeWordMatch.substr(0,6)) this.showAllPictures = true;
     },
     savePopi(response) {
        // console.log('Saving popi values', response)
        this.getZml.popi = response
     }
   },
   created() {
      console.log('virtual awards created')
      window.addEventListener('keypress', this.doCommand);
   },
   destroyed() {
     window.removeEventListener('keypress', this.doCommand);
   },
   mounted () {
     console.log('virtual awards started')
     this.currentEditMode = (this.editmode === undefined) ? false : this.editmode;
     let sql = "select * from dkhs_storymain where activedate > NOW() - INTERVAL 90 DAY"
     this.loading = true
     zData.loadSql(this.loading, sql, this.processData)
     zmlLog({task:"dolog",user:"Public", pagename:"VirtualAwards", logdata: this.editmode});


     if (this.getZml.popi.length == 0) {
       let sql = "select studentid from dkhs_popi where bad = 'N'"
       this.loading = true
       // console.log('Loading popi values')
       zData.loadSql(this.loading, sql, this.savePopi)
     }


   //   let self = this; - otherway to catch keypresses
   //   window.addEventListener('keyup', function(ev) {
   //      self.testPoppi(ev); // declared in your component methods
   //   });
   },
   watch: {
     storyIndex: function() {
         //see what index of studIndex is in winnerNames...
         let ind = this.awardList.findIndex(e => e.detail1 == this.storyIndex);
         if (ind != -1) this.panelIndex = ind;
         // alert('new storyindix '+  ind + ' ' + this.storyIndex )

       },
    panelIndex: function(n) {
       if (n == 50 || n == 175) {
         this.schoolSongSound.volume = 0.2;
         this.schoolSongSound.play();  //this.backgroundSound();
       }
       this.countDown = this.interval/1000;
    },
    showAllPictures: function() {
       if (this.showAllPictures) {
         this.loading = true
         let sql = "select * from dkhs_storymain where activedate > NOW() - INTERVAL 90 DAY"
         zData.loadSql(this.loading, sql, this.processData)
         zmlLog({task:"dolog",user:"Public", pagename:"VirtualAwards", logdata: this.editmode});
       }

    }
   }
}
</script>
<style scoped>
.koek {font-family: 'Dancing Script', cursive;}
</style>