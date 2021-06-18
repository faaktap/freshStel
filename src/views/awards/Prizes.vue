<template>
<div>
  <v-container class="grey lighten-5 pa-4" 
              v-if="startSlideShow==false">
    <v-row>
      <v-col cols="12" class="xs12">
    <v-card class="mx-auto" max-height="600">
    <v-img height="100%" src="/img/prysUitdelingHerman.jpg" xgradient="to top, #3a45394d, #FFFFFF4d">
      <v-row        align="end"        class="fill-height"      >
        <v-col          align-self="start"          class="pa-0"          cols="12"        >
         <v-responsive
           class="elevation-40 rounded-circle d-inline-flex align-center justify-center ma-3"
         
           height="164"
           width="164"
        >
        <v-img src="/img/HermanMellet1.jpg"> </v-img>
        
         </v-responsive>
        </v-col>
        <v-col class="py-0">
          <v-list-item
            color="rgba(0, 0, 0, .4)"
            dark
          >
            <v-list-item-content>
              <v-list-item-title class="title">Herman Mellet</v-list-item-title>
              <v-list-item-subtitle>Principal</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-col>
      </v-row>
    </v-img>
  </v-card>
      </v-col>
  </v-row>
  <hr>
  <v-row>
    <v-col>
  <v-card xcolor="rgba(0, 90, 0, .9)" class="rounded">
    <v-card-text class="ma-4 black--text">
        2020 was the year of Covid 19. We faced so many challenges and now we can look back on a very successful academic year, 
<blockquote class="blockquote grey--text ma-4"><cite>John Maxwell said:</cite>
  “ Leaders can be evaluated by the size of the problem they are willing to tackle. The best leaders push beyond their comfort zones……….
  Making it happen requires risk; there is no escaping the possibility of failure”</blockquote>
The 2020 Matrics will not only be remembered for rewriting NSC Mathematics and Physical Sciences papers, 
beautiful face masks and wearing civvies to school. They will be remembered as the class with the most 
academic prize winners in the history of the school. In that sense they tackled the sizeable problem of 
teaching and learning during Covid 19. This class will produce many leaders in all spheres of society. 
Congratulations to every prize winner, you made us proud in 2020.  
<blockquote class="blockquote grey--text ma-4"> 
  <cite>‘n Woestynvader het eenmaal gesê: </cite>“Iemand wat ‘n vuur aan die gang wil kry, word eers deur rook gepla en die rook dryf hom tot trane, maar uiteindelik , as hy aanhou , kry hy sy vuur! “
</blockquote>
Elke pryswenner kry nou sy spreekwoordelike vuur in die vorm van ‘n pryswennerssertifikaat.
Mag die prys elkeen aanspoor om nog groter hoogtes te bereik na skool. 
Baie geluk aan elke pryswenner en onthou die volgende mooi woorde:
<blockquote class="blockquote"><div class="koek grey--text mb-2 text-center text-sm-h6 text-lg-h5">
“ Hoe sterk pyn ook is, U is altyd sterker;<br>
Hoe diep ‘n mens ook val, U is altyd dieper;<br>
Hoe donker die nag ook is,<br>
U is altyd die middagson daarin.<br>
U is ons Vader, ons Moeder, ons Broer en ons Vriend.<br>
Amen ”<br></div>
		<cite>Gebed van ‘n vrou uit Afrika</cite> </blockquote>
  </v-card-text>
  </v-card>
  <v-spacer />
  <v-btn v-if="startSlideShow==false" @click="startSlideShow=true" color="green"> START 2020 VIRTUAL AWARDS </v-btn>
    </v-col>
  </v-row>

<!-- ------------------------------------------------------------------------------------ -->
  </v-container>
   <v-parallax 
    v-if="startSlideShow"
    src="/img/vlaghys6842.jpg"
    height="1300px"
  >
<v-container fluid>
 <v-layout row fill-height 
           justify-center 
           color="rgba(255, 0, 1, 0.5)" 
           xclass="grey lighten-5" 
           xstyle="'background-image:url('+bg[bgIndex]+');background-size:cover'">
            <input type="text" v-on:keyup="this.$panelIndex++">
  <v-carousel v-model="panelIndex" 
            v-on:keyup.a="panelIndex++"
            v-on:keyup.d="panelIndex--"
             interval="8000"
             height="auto"
            :continuous="false"
            :cycle="cycle"
            hide-delimiters
            show-arrows-on-hover
            :touch="{left: () => panelIndex--,
                     right: () => panelIndex++}"
            >
  <v-carousel-item 
            v-for="page in awardList"
            color="rgba(255, 1, 7, 0.2)"
            contain
            :key="page.storyid">         
         <smart-text v-if="page.type == 1" 
                    :title="page.detail1"
                    :atext="page.detail2" />
                    <!-- Type 2 is a group, and change to type 3 -->
         <smart-display v-if="page.type == 3"    
                        :studentid="page.studentid"
                        :studentName="page.detail1"
                        :diplomaList="page.detail2"
                        :extraNote="page.extraNote"
                        :alles=page
                        :panelIndex=panelIndex />
         <smart-photo v-if="page.type == 4" 
                    :title="page.detail1"
                    :caption="page.detail2"
                    photoPath="https://kuiliesonline.co.za/api/candid/candidates.php?task=photo&type=trophy&studentno="
                    :photoNo="page.otherid" />
              

  </v-carousel-item>
 </v-carousel> 
 </v-layout>
</v-container>
<v-container>
       <v-progress-linear stream
                       color="blue-grey"
                      :active="progress" 
                      :indeterminate="progress" />
  
 </v-container>
  <v-layout class="mx-auto" >
     <div class="px-2 red--text text--accent-2"> DKHS Slideshow  </div> 
        <v-btn  x-small color="secondary" @click="cycle = !cycle">
         <div v-if="cycle==true"><v-icon small> mdi-play</v-icon></div>
         <div v-else><v-icon small> mdi-pause</v-icon></div>
        </v-btn>
        <v-btn x-small color="secondary"  @click="panelIndex--">
         <v-icon small> mdi-minus</v-icon>
        </v-btn>       
        <v-btn x-small color="secondary"  @click="panelIndex++">
         <v-icon small> mdi-plus</v-icon>
        </v-btn>       
        <v-btn x-small color="arrow-expand"  @click="showChapters = !showChapters">
         <v-icon small> mdi-arrow-expand</v-icon>
        </v-btn>      
        <v-btn x-small color="arrow-expand"  @click="backgroundSoundMute">
         <v-icon small> mdi-volume-mute</v-icon>
        </v-btn>      

        
        
        <v-autocomplete v-model="storyIndex"       
        v-if="showChapters"
        :items="carouselDataFilter()"
        :search-input.sync="search" 
        item-text="detail1" 
        item-value="sortid"
        dense
        label="Select a Chapter" /> 
        
  </v-layout> 
</v-parallax>

</div>
</template>

<script>
import { zmlConfig } from '@/api/constants';
import { zmlFetch } from '@/api/zmlFetch';
import SmartDisplay from '@/components/awards/SmartDisplay';
import SmartText from '@/components/awards/SmartText';
import SmartPhoto from '@/components/awards/SmartPhoto';
export default {
    components: {SmartDisplay, SmartText, SmartPhoto},
    data () {
      return {
        showChapters: false,
        startSlideShow: false,
        search:'',
        storyIndex: 0,
        awardList:[],
        panelIndex:null,
        cycle:true,
        interval: 8000,
        countDown: 0,
        bg:['img/trophyback1.jpg'
           ,'img/trophyback2.jpg'
           ,'img/trophyback3.jpg'
           ,'img/trophyback4.jpg'
           ,'img/trophyback5.jpg'
           ,'img/trophyback6.jpg'],
        bgIndex:2,
        progress:true,
        schoolSongSound:new Audio('https://www.kuiliesonline.co.za/dkhs/data/sounds/SchoolSong.mp3'),
        carouselSound:new Audio('https://kuiliesonline.co.za/dkhs/data/sounds/Musway Studio - 021-2 - Inspiring Carousel.mp3'),                       
       } 
   }, 
   computed: {    
   }, 
   methods: {
     carouselDataFilter() {
         let arr = this.awardList.filter(a => a.type == 1 );
         return arr;
     },
     loadData() {
        let ts = {chapterid: 1, task:'getFullStory'};
        this.progress = true;
        zmlFetch(ts, this.processData, this.loadError);
     },
     processData(response) {
        let incoming = response;
        incoming.sort((a, b) => a.sortid - b.sortid);
        let diplomaSubjectArr = [];
        for (let i=0; i<incoming.length; i++) {
           const row = incoming[i];
           ////this.$cs.l(i,row);
           //Skip all type 2's (since we added students below it as type 3)
           if (row.type == 2) { 
            continue;
           }
           //These are students with names, diplomas and bookprizes
           if (row.type == 3) {
             diplomaSubjectArr = [];
             if (row.otherid == 'SKIP') {
               //Ignore the book prizes that are alone
               continue;
             }

             //Load all data, sortit, and delete duplicate diploma names
             for (let j=0; j<row.diplomaNames.length; j++) {
               diplomaSubjectArr[j] = {dip: row.diplomaNames[j], sub: row.subjectNames[j]};
             }
             //Sort the diplomas
             diplomaSubjectArr.sort((a, b) => a.dip.localeCompare(b.dip));
             //Delete dup diploma names
             let prev = '';
             for (let j=0; j<diplomaSubjectArr.length; j++) {
               //there might be two dots for duplicate vakdiplomas
               diplomaSubjectArr[j].dip = diplomaSubjectArr[j].dip.replace('.','');
               diplomaSubjectArr[j].dip = diplomaSubjectArr[j].dip.replace('.','');
               if (prev == diplomaSubjectArr[j].dip) {
                    diplomaSubjectArr[j].dip = '';
               } else {
                    prev = diplomaSubjectArr[j].dip;
               }
             }
             this.awardList.push({storyid: row.storyid
                                 ,sortid: row.sortid
                                 ,chapterid: row.chapterid
                                 ,detail1: row.detail1       //a student name - correctly formatted
                                 ,detail2: diplomaSubjectArr //a list of awards
                                 ,diplomaid: row.diplomaid   //halfkleure, ens...
                                 ,subjectid: row.subjectid
                                 ,otherid: row.otherid
                                 ,studentid: row.studentid
                                 ,type: row.type
                                 ,extraNote: row.extranote                                 
                                 });
           ////this.$cs.l('note1:',row.extranote);
           }
           if (row.type != 3) {
             this.awardList.push({storyid: row.storyid
                                 ,sortid: row.sortid
                                 ,chapterid: row.chapterid
                                 ,detail1: row.detail1   //some title
                                 ,detail2: row.detail2   // some subtitle, or ref
                                 ,diplomaid: row.diplomaid   //some other instruction
                                 ,subjectid: row.subjectid
                                 ,studentid: row.studentid
                                 ,otherid: row.otherid  // photonumber if need be
                                 ,type: row.type
                                 ,extraNote: row.extranote
                                 });
           ////this.$cs.l('note2:',row.extranote);                                 
           }
        }
        this.progress = false;
     },
     loadError(error) {
        //this.$cs.l(error);
        alert('Nothing loaded yet (possibly) - error : ' + error);
        this.progress = false;
     },   
     backgroundSound() {
        zmlConfig.cl('start backgroundsound', this.carouselSound);
        this.carouselSound.volume = 0.2;
        this.carouselSound.play;
     }, 
     backgroundSoundMute() {
        zmlConfig.cl('mute backgroundsound', this.schoolSongSound, this.schoolSongSound.volume);
        this.schoolSongSound.volume = 0.1;
        this.carouselSound.volume = 0.1;
        this.carouselSound.mutes = true;
        this.schoolSongSound.mutes = true;

        //this.carouselSound.volume = this.carouselSound.volume - 0.2;
     }, 
     playSound(response) {
        //this.$cs.l(response);
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
      zmlConfig.cl('Mount:StoryEdit');
      this.loadData();
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