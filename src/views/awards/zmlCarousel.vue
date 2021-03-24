<template>
<div>
    <!--ul v-for="page in awardList" :key="page.storyid">
    <li>{{ page }}</li>
    </ul-->
   <!--v-parallax v-if="startSlideShow"
    src="https://www.kuiliesonline.co.za/img/vlaghys6842.jpg"
    height="1300px"
   -->
 <v-container fluid>
  <v-layout row fill-height 
           justify-center 
           color="rgba(255, 0, 1, 0.5)" 
           xclass="grey lighten-5" 
           xstyle="'background-image:url('+bg[bgIndex]+');background-size:cover'">
            <input type="text" v-on:keyup="this.$panelIndex++">
  <v-carousel v-model="panelIndex" 
             @keyup.a="panelIndex++"
             @keyup.d="panelIndex--"
              xinterval="8000"
              height="auto"
             :continuous="false"
             :cycle="cycle"
              hide-delimiters
              show-arrows-on-hover
              :touch="{left: () => panelIndex--,
                      right: () => panelIndex++}"
            >
  <v-carousel-item v-for="page in awardList"
                   color="rgba(255, 1, 7, 0.2)"
                   contain
                  :key="page.storyid">   
                  {{ page }}
         <smart-text v-if="page.type == 1" 
                    :title="page.detail1"
                    :atext="page.detail2" 
                    maintitle="Prysuitdeling 2020 / Prizegiving 2020"
         />
         <smart-photo v-if="page.type == 4" 
                     :title="page.detail1"
                     :caption="page.detail2"
                      photoPath="https://kuiliesonline.co.za/api/candid/candidates.php?task=photo&type=sportaward&studentno="
                     :photoNo="page.otherid" 
         />
         <smart-display v-if="page.type == 3"    
                       :studentid="page.studentid"
                       :studentName="page.detail1"
                       :diplomaList="page.detail2"
                       :extraNote="page.extraNote"
                       :alles=page
                       :panelIndex=panelIndex 
         />
         <smart-marquee v-if="page.type == 2"    
                       :panelIndex="panelIndex"
                       :list="page.winners"
                       :listHeading="page.listHeading"
                       :heading="page.heading"
                       @wearedone="nextOne"
        />
  <v-container v-if="currentEditMode" class="ma-3">
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
<!--/v-parallax-->
</div>
</template>

<script>
import { getters } from "@/api/store"
import { zmlFetch } from '@/api/zmlFetch'
import SmartDisplay from '@/components/awards/SmartDisplay'
import SmartText from '@/components/awards/SmartText'
import SmartPhoto from '@/components/awards/SmartPhoto'
import SmartMarquee from '@/components/awards/SmartMarquee'
export default {
    components: {SmartDisplay, SmartText, SmartPhoto, SmartMarquee},
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
        cycle:false,
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
     nextOne() {
         this.panelIndex += 1
     },
     carouselDataFilter() {
         let arr = this.awardList.filter(a => a.type == 1 );
         return arr;
     },
     loadData() {
        this.progress = true;
        let ts = {sql: 'select * from a_prize order by grade, type, position'
                , task:'PlainSql'};
        console.log('fetching.. ' , ts)
        zmlFetch(ts, this.processData, this.loadError);
     },
     processData(response) {
         //console.log(response)
         let o = {id:0, storyid:0, grade:0, type:'', winners:[], heading:'', listHeading:''}
         response.forEach(ele => {
             console.log(ele.grade, o.grade, ele.type, o.type, ele)
             if (o.grade == ele.grade || o.type == ele.type) {
                 o.winners.push( {id:ele.id
                               , name: ele.name +' ' + ele.surname 
                               , pos:ele.position} )
                 console.log('winners again = ' , o.winners.length)
             } else {
                 if (o.grade !== 0) {
                    this.awardList.push(o)
                    console.log('awardList = ' , this.awardList.length)
                     o = {id:0, storyid:0, grade:0, type:'', winners:[], heading:'', listHeading:''}
                 }
                 o.storyid = ele.id
                 o.id = ele.id
                 o.grade = ele.grade
                 o.listHeading = ele.type
                 o.heading = 'Grade ' + ele.grade + ' ' + ele.type
                 o.type = 2
                 o.position = ele.position
                 o.winners.length = 0
                 o.winners.push( {id:ele.id
                               , name: ele.name +' ' + ele.surname 
                               , pos:ele.position}  )
                 
                 console.log('winners = ' , o.winners.length)
             }
         })
         this.awardList.push(o)
         let ts = {sql: 'select * from a_diploma order by grade, type'
                , task:'PlainSql'};
        console.log('fetching.. ' , ts)
        zmlFetch(ts, this.processMoreData, this.loadError);
         this.progress = false;
         //add data here..
     },
     processMoreData(response) {
         let o = {id:0, storyid:0, grade:0, type:'', winners:[], heading:'', listHeading:''}
         response.forEach(ele => {
             console.log(ele.grade, o.grade, ele.type, o.type, ele)
             if (o.grade == ele.grade || o.type == ele.type) {
                 o.winners.push( {id:ele.id
                               , name: ele.name +' ' + ele.surname } )
                 console.log('winners again = ' , o.winners.length)
             } else {
                 if (o.grade !== 0) {
                    this.awardList.push(o)
                    console.log('awardList = ' , this.awardList.length)
                     o = {id:0, storyid:0, grade:0, type:'', winners:[], heading:'', listHeading:''}
                 }
                 o.storyid = ele.id * + Math.random() * 1000
                 o.id = ele.id
                 o.grade = ele.grade
                 o.listHeading = ele.type
                 o.heading = 'Grade ' + ele.grade + ' ' + ele.type
                 o.type = 2
                 o.winners.length = 0
                 o.winners.push( {id:ele.id
                               , name: ele.name +' ' + ele.surname 
                               , pos:ele.position}  )
                 
                 console.log('winners = ' , o.winners.length)
             }
         })
         this.awardList.push(o)         
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