<template>
<div>
   <v-parallax v-if="startSlideShow"
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
                    :atext="page.detail2" 
                    maintitle="Prysuitdeling 2020 / Prizegiving 2020"
                    />
                    <!-- Type 2 is a group, and change to type 3 -->

         <smart-photo v-if="page.type == 4" 
                    :title="page.detail1"
                    :caption="page.detail2"
                    photoPath="https://kuiliesonline.co.za/api/candid/candidates.php?task=photo&type=sportaward&studentno="
                    :photoNo="page.otherid" />

         <smart-display v-if="page.type == 3"    
                        :studentid="page.studentid"
                        :studentName="page.detail1"
                        :diplomaList="page.detail2"
                        :extraNote="page.extraNote"
                        :alles=page
                        :panelIndex=panelIndex />

<v-container v-if="currentEditMode">
   {{page}}
   <v-btn @click="addNewOneAfter"> Add New One After </v-btn>
   <v-btn @click="editThisOne"> Edit This One </v-btn>
</v-container>  

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
import { getters } from "@/api/store"
//import { zmlConfig } from '@/api/constants'
import { zmlFetch } from '@/api/zmlFetch'
import SmartDisplay from '@/components/awards/SmartDisplay'
import SmartText from '@/components/awards/SmartText'
import SmartPhoto from '@/components/awards/SmartPhoto'
export default {
    components: {SmartDisplay, SmartText, SmartPhoto},
    props: [ 'chapterid','editmode' ],
    data () {
      return {
        getZml: getters.getState({ object:"gZml" }),
        currentEditMode: false,
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
        let ts = {chapterid: this.chapterid, task:'getFullStory'};
        this.progress = true;
        console.log('fetching.. ' , ts)
        zmlFetch(ts, this.processData, this.loadError);
     },
     processData(response) {
       console.log(response)
        let incoming = response;
        incoming.sort((a, b) => a.sortid - b.sortid);
        let diplomaSubjectArr = [];
        for (let i=0; i<incoming.length; i++) {
           const row = incoming[i];
           //console.log(i,row);
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
           //console.log('note1:',row.extranote);
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
           //console.log('note2:',row.extranote);                                 
           }
        }
        this.progress = false;
        this.startSlideShow = true
     },
     loadError(error) {
        console.log(error)
        this.progress = false;
     },   
     backgroundSound() {
        console.info('start backgroundsound', this.carouselSound);
        this.carouselSound.volume = 0.2;
        this.carouselSound.play;
     }, 
     backgroundSoundMute() {
        console.info('mute backgroundsound', this.schoolSongSound, this.schoolSongSound.volume);
        this.schoolSongSound.volume = 0.1;
        this.carouselSound.volume = 0.1;
        this.carouselSound.mutes = true;
        this.schoolSongSound.mutes = true;

        //this.carouselSound.volume = this.carouselSound.volume - 0.2;
     }, 
     playSound(response) {
        console.log(response);
     },
     doCommand(e) {
       let cmd = String.fromCharCode(e.keyCode).toLowerCase();
       //console.log(cmd,e);
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
     console.log('Mount:Story', this.chapterid, this.currentEditMode, this.getZml.login.isAuthenticated);
     //if (this.editmode == undefined) this.editmode = false
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