<template>
<div>


  <v-container class="grey lighten-5 pa-4">
    <v-row  v-if="allStories">
        <v-col cols="12" col="4" v-for="s in allStories" :key="s.storyid">
            {{ s.storymainid }} - {{ s.storytitle }} {{ s.activedate.substr(0,10) }} 
            <v-btn @click="showStory(s.storymainid)"> show </v-btn>
        </v-col>
    </v-row>
    <v-row v-if="aw">
    <v-col cols="12" class="xs12" >
    <v-card class="mx-auto" max-height="600">
      awb = {{aw.background}}
    <v-img height="100%" :src="aw.background" xgradient="to top, #3a45394d, #FFFFFF4d">
      <v-row        align="end"        class="fill-height"      >
        <v-col          align-self="start"          class="pa-0"          cols="12"        >
         <v-responsive
           class="elevation-40 rounded-circle d-inline-flex align-center justify-center ma-3"
         
           height="164"
           width="164"
        >
        awp = {{aw.picture}}
        <v-img :src="aw.picture"> </v-img>
        
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
  <v-row v-if="aw">
    <v-col>
  <v-card xcolor="rgba(0, 90, 0, .9)" class="rounded">
    <v-card-text class="ma-4 black--text" v-html="aw.description">
  </v-card-text>
  </v-card>
  <v-spacer />
  <v-btn @click="startCarousel" color="green"> START CAROUSEL </v-btn>
    </v-col>
  </v-row>

<!-- ------------------------------------------------------------------------------------ -->
  </v-container>

  
</div>
</template>

//add a component for slideshow in here - or call it with a parameter...
<script>
import { zmlConfig } from '@/api/constants';
import { zmlFetch } from '@/api/zmlFetch';
export default {
    components: {},
    data () {
      return {
        startSlideShow: false,
        allStories:[],
        aw:{},
       } 
   }, 
   computed: {    
   }, 
   methods: {
     startCarousel() {
       console.log('start carousel for : ', this.aw)
       this.$router.push({ name: 'virtualawards'
                         , params:{chapterid: this.aw.storymainid
                                 , editmode: true}});
     },
     showStory(s) {
         //get story from s (sotroyid)
         //and load it into aw for display
         console.log ( 'lookup for storyid=',s)
         this.aw = this.allStories.filter(ele => ele.storymainid == s)[0]
         console.log ( 'lookup for storyid=',s, this.aw)
     },
     loadData() {
        let ts = {task:'getAllStories'};
        this.progress = true;
        zmlFetch(ts, this.processData, this.loadError);
     },
     processData(response) {
        this.allStories = response;
        this.progress = false;
     },
     loadError(error) {
        console.log(error);
        alert('Nothing loaded yet (possibly) - error : ' + error);
        this.progress = false;
     },   
   },
   mounted: function () {
      zmlConfig.cl('Mount:StoriesShow');
      this.loadData();
   },
}
</script>
<style scoped>
</style>