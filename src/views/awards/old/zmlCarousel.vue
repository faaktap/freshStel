<template>
<div>
    <!--ul v-for="page in awardList" :key="page.chapterid">
    <li>{{ page }}</li>
    </ul-->
   <v-parallax v-if="startSlideShow"
    src="https://www.kuiliesonline.co.za/img/vlaghys6842.jpg"
    height="1300px"
   >
 <v-container fluid>
  <v-layout row fill-height 
           justify-center 
           color="rgba(255, 0, 1, 0.5)" 
           xclass="grey lighten-5" 
           xstyle="'background-image:url('+bg[bgIndex]+');background-size:cover'">
            <input v-on:keyup.right="this.$panelIndex++">

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
                  <!--{{ page }} -->
         <smart-text v-if="page.type == 1" 
                    :title="page.detail1"
                    :atext="page.detail2" 
                    :maintitle="page.maintitle ? page.maintitle : 'Prysuitdeling 2020 / Prizegiving 2020'"
                    :image="page.image"
         />
         <smart-marquee v-if="page.type == 2"    
                       :panelIndex="panelIndex"
                       :xxxxxpropPassedList="page.winners"
                       :xxxpropPassedList="[]"
                       :propPassedString="page.detail2"
                       :heading="page.detail1"
                       @wearedone="nextOne"
        />
         <smart-photo v-if="page.type == 4" 
                     :title="page.detail1"
                     :caption="page.detail2"
                     :photoPath="page.photoPath"
                     :photoNo="page.studentID" 
         />
         <smart-display v-if="page.type == 3"    
                       :studentid="page.studentid"
                       :studentName="page.detail1"
                       :diplomaList="page.detail2"
                       :extraNote="page.extraNote"
                       :alles=page
                       :panelIndex=panelIndex 
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
</v-parallax>
 <v-container>
  <v-progress-linear stream
                     color="blue-grey"
                    :active="progress" 
                    :indeterminate="progress" />
 </v-container>

   <!--v-layout class="mx-auto"  v-if="getZml.login.isAuthenticated && getZml.login.username=='werner'"-->
   <v-layout class="mx-auto" v-if="getZml.login.isAuthenticated">
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
  <div v-if="getZml.login.isAuthenticated && getZml.login.username=='werner'">
      <front-json-to-csv v-if="awardList"
                   :json-data="awardList"
                   :csv-title="'My Test csv title'">
     </front-json-to-csv> 
    <v-card 
            v-for="page in awardList"
           :key="page.id"
           color="green darken-2">  
           <v-card-title>
             {{ page.chapterid }} - {{ page.id }}
           </v-card-title>
     {{ page }} 
     <v-card-actions> end </v-card-actions>
    </v-card>
  </div>
</div>
</template>

<script>
import { getters } from "@/api/store"
import { zmlFetch } from '@/api/zmlFetch'
import SmartDisplay from '@/components/awards/SmartDisplay'
import SmartText from '@/components/awards/SmartText'
import SmartPhoto from '@/components/awards/SmartPhoto'
import SmartMarquee from '@/components/awards/SmartMarquee'
import FrontJsonToCsv from '@/api/csv/FrontJsonToCsv.vue'
const  WAIT = 0, READY = 1,  BUSY = 2,  DONE = 3
export default {
    components: {SmartDisplay, SmartText, SmartPhoto, SmartMarquee,FrontJsonToCsv},
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
        uniqid:0,
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
        timerHandle:null,
        getData:[{id:0,desc:"first-one", workDone:WAIT, response:{}
                 ,processor:this.processTest
                 ,sql:"SELECT p.id,p.storyid,p.type,p.grade,p.position"
                     + " ,p.name,p.surname,p.prize, p.oncertificate, s.studentid"
                     + "  FROM a_prize p "
                     + " LEFT JOIN dkhs_student s "
                     + "    on p.surname like concat('%',s.surname,'%') "
                     + "   and p.name like concat('%',s.firstname,'%') "
                     + " where ( p.type = 'TOP10' and position in (10,9,8,7,6) )"
                     + "    or (p.type != 'TOP10' and position in (5,4,3,2,1) )"
                     + " ORDER BY p.grade, p.position desc, p.id desc"}

                 ,{id:1,desc:"2nd-one", workDone:WAIT, response:{}
                 , processor:this.processData
                 , sql:"select * from a_diploma order by grade, type , surname, name"}
                ],
        constantchapterid:22,
      }
   }, 
   /*
   */
   computed: {    

   }, 
   methods: {
     ordinal_suffix_of(i) {
         var j = i % 10,
             k = i % 100;
         if (j == 1 && k != 11) {
             return i + "st";
         }
         if (j == 2 && k != 12) {
             return i + "nd";
         }
         if (j == 3 && k != 13) {
             return i + "rd";
         }
         return i + "th";
     },
     addNewOneAfter() {

     },
     editThisOne() {

     },
     nextOne() {
         //this.panelIndex += 1
     },
     carouselDataFilter() {
         let arr = this.awardList.filter(a => (a.type == 1 || a.type == 2) );
         return arr;
     },
     loadAllData() {
       this.progress = true;
       //cheat on the first one - make it ready before we start...
       this.getData[0].workDone = READY
       this.getData.forEach(ele => {
         let ts = {sql: ele.sql, task: 'PlainSql'}
         zmlFetch(ts, this.processAllData, this.loadError, ele);
       })
     },
     processAllData(response,what,q) {
       q.workDone = READY
       q.response = response
       if (!this.timerHandle) {
          this.startTimer(200, this.rollCall)
       }
     },
     rollCall() {  
       //Convert to single, flat array for workDone - no objects - only for dispay
       console.info('RC Start ',this.getData.map( ({workDone}) =>  (workDone)  ).flat() )

       // Loop thru tasks, and do them in order...i hope
       let previousDone = true
       this.getData.forEach(ele => {
           if (ele.workDone == BUSY) return
           if (ele.workDone == WAIT) {
               console.log('nada!');return;
             } //might cause problems if one in queue not fired at all.
           if (ele.workDone == DONE) previousDone = true
           if (ele.workDone == READY && previousDone == true) {
             ele.workDone = BUSY
             ele.processor(ele)
             previousDone = false
             return
           }
       })
       if (this.getData.filter(element => element.workDone === DONE).length == this.getData.length) {
           //We are done with all, reset back to wait, and clear response
           this.getData.forEach(ele => {
             ele.workDone = WAIT 
             ele.response = ''
           })
           if (this.timerHandle) {
               clearInterval(this.timerHandle) 
               this.timerHandle = null
           }
           this.progress = false;
           this.startSlideShow = true    
        }
        console.info('RC - End ',this.startSlideShow ,this.getData.map( ({workDone}) =>  (workDone)  ).flat() )
        return "not used @the moment"
     },
     startTimer(duration, funcToCall) {
        let loops = 8
        this.timerHandle = setInterval(function () {
          //let x = funcToCall('dummy')
          funcToCall('dummy')
          loops = loops - 1
          if (loops < 0) {
            clearInterval(localtimehandle)
          }
        }, duration);
        let localtimehandle = this.timerHandle
     },
     uid() {
       this.uniqid += 10
       return this.uniqid
     },
     processTest(e) {
       //this.$cs.l('process data function - qNo = ', e.id)
       this.awardList.push(
             {storyid:this.uid()
             , chapterid:this.constantchapterid
             , type:1
             , detail1:'De Kuilen Akademiese Prysuitdeling / Academic Prizegiving'
             , detail2:'<br>Kort boodskappie van mnr mellet...<br><br>  The 2020 school year will not only be remembered for rewriting NSC Mathematics and Physical Sciences papers, beautiful face masks and wearing civvies to school. They will be remembered as the covid .... In that sense they tackled the sizeable problem of teaching and learning during Covid 19. Congratulations to every prize winner, you made us proud in 2020.'
             , maintitle:''
             , studentID:''
             , winners:''
}
       )
       let newGrade = 0
       e.response.forEach(ele => {
         //this.$cs.l('grade : ' , newGrade)
           if (newGrade != ele.grade) {
             this.awardList.push(
                   {storyid:this.uid()
                   , chapterid:this.constantchapterid
                   , type:1
                   , detail1:'GRADE ' + ele.grade + ' - TOP 10'  
                   , detail2:'<br><br>Our 10 learners in Grade ' + ele.grade + ' with the highest overall average.<br> The top 5 receives book prizes<br><br>Congratulations!'
                   , maintitle: '<br><br><br>GRADE ' + ele.grade + ' - TOP 10'
                   , studentID:''
                   , image: 'https://www.kuiliesonline.co.za/img/top10.png'}
             )
             newGrade = ele.grade
           } 
           this.awardList.push(
                 {storyid:this.uid()
                 , chapterid:this.constantchapterid
                 , type:4
                 , photoPath: "https://kuiliesonline.co.za/api/candid/candidates.php?task=photo&type=award&studentno="
                 , studentID: ele.studentid
                 , detail1: ele.oncertificate ? ele.oncertificate : 'GRADE ' + ele.grade + ' TOP 10 (' + this.ordinal_suffix_of(ele.position) + ')'
                 , detail2: ele.name + ' ' + ele.surname
                 })
       })
       e.workDone = DONE       
     },
     processData(e) {
         //this.$cs.l('process data function - qNo = ', e.id)
         let o = {storyid:0, chapterid:0, grade:0, type:'', winners:[], detail1:'', detail2:'', studentid:'', eletype:''}
         e.response.forEach(ele => {
           ////this.$cs.l(ele.grade, o.grade, ele.type, o.type, ele)
           if (o.grade == ele.grade && o.eletype == ele.type) {
               //Same grade and type winners, add them to queue list
               o.winners.push( {id:ele.id
                             , name: ele.name +' ' + ele.surname 
                             , pos:ele.position} )
           } else {
               if (o.grade !== 0 && o.eletype != ele.type ) {
                  //If the type changes, then we add the current winnerslist
                  this.newSlide(o.detail1, o.eletype,'', '')
                  o.detail2 = o.winners.flatMap(ele => ele.name)
                  this.awardList.push(o)
                  o = {storyid:0, chapterid:0, grade:0, type:'', winners:[], detail1:'', detail2:'', eletype:''}
               }
               o.chapterid = this.constantchapterid
               o.storyid = this.uid() //ele.id
               o.grade = ele.grade
               o.eletype = ele.type
               //o.detail2 = ele.type
               o.detail1 = 'GRADE ' + ele.grade + ' ' + ele.type.toUpperCase()
               o.type = 2
               o.position = ele.position
               o.winners.length = 0
               o.winners.push( {id:ele.id
                             , name: ele.name +' ' + ele.surname 
                             , pos:ele.position}  )
           }
       })
       this.awardList.push(o)
       e.workDone = DONE
     },
     newSlide(d1, d2,mtitle, img) {
       console.info(d1, d2,mtitle, img)
       /*
        this.awardList.push(
              {storyid:this.uid()
              , chapterid:this.constantchapterid
              , type:1
              , detail1: d1 //'(newtype) GRADE ' + ele.grade + ' - '  + ele.type
              , detail2: '<br><br>' +  d2  + '<br><br>'//'<br><br>Grade ' + ele.grade
              , maintitle:mtitle// '<br><br><br>GRADE ' + ele.grade + ele.type 
              , image: img ? img : 'https://www.kuiliesonline.co.za/img/awardBackgroundGreen.jpg'
              }
        )
        */
     },
     loadError(error) {
        this.$cs.l(error)
        this.progress = false;
     },   
     backgroundSound() {
        console.info('start backgroundsound', this.carouselSound);
        this.carouselSound.volume = 0.1;
        this.carouselSound.play;
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
     playSound(response) {
        this.$cs.l(response);
     },
     doCommand(e) {
       let cmd = String.fromCharCode(e.keyCode).toLowerCase();
       //this.$cs.l('keypress listener : ', cmd)
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
     //this.$cs.l('Mount:Story', this.chapterid, this.currentEditMode, this.getZml.login.isAuthenticated);
     this.loadAllData()
   },
   watch: {
     storyIndex: function() {
         //see what index of studIndex is in winnerNames...
         let ind = this.awardList.findIndex(e => e.detail1 == this.storyIndex);
         if (ind != -1) this.panelIndex = ind;
         
       },
    panelIndex: function(n) {
       if (n == 50 || n == 175) {
         this.schoolSongSound.volume = 0.02;
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