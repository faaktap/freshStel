<template>
<v-container class="grey lighten-5 pa-4" fluid>
  <v-expansion-panels v-model="panelIndex">
    <v-expansion-panel>
      <v-expansion-panel-header>
        Awards (click here to open)
      </v-expansion-panel-header>
      <v-expansion-panel-content>
      <v-row v-if="allStories">
       <v-col cols="12">
       <simple-table style="tbody">
        <tr cols="12" col="4" v-for="s in allStories" :key="s.storyid">
           <td> <v-card class="ma-2 pa-2">{{ s.storymainid }} </v-card>
               
           </td>
           <td class="ma-4 pa-2"> {{ s.storytitle }} <br>
             
           </td>
           <!--td v-html="s.description">    </td-->
           <td class="ma-2 pa-2">
             <v-btn v-if="s.storymainid != 999"
                   @click="showStory(s.storymainid)"
                   color="secondary">
              Activate </v-btn>  
           </td>
        </tr>
       </simple-table>
       </v-col>
      </v-row>
    </v-expansion-panel-content>
   </v-expansion-panel>
  </v-expansion-panels>



  <v-row v-if="aw">
   <v-col cols="12" class="xs12" >
    <v-card class="mx-auto" max-height="600">
     <v-img height="100%" :src="aw.background" xgradient="to top, #3a45394d, #FFFFFF4d">
      <v-row             align="end"          class="fill-height">
        <v-col cols="12" align-self="start"   class="pa-0">
         <v-responsive
           class="elevation-40 rounded-circle d-inline-flex align-center justify-center ma-3"
           height="164"
           width="164">
             {{aw.picture}}
             <v-img :src="aw.picture"> </v-img>
         </v-responsive>
        </v-col>
        <v-col class="py-0">
          <v-list-item color="rgba(0, 0, 0, .4)" dark>
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
     <v-card-text class="ma-4 black--text" v-html="aw.description" />
    </v-card>
    <v-spacer />
    <v-btn @click="startCarousel" color="primary"> START CAROUSEL </v-btn>
   </v-col>
  </v-row>
</v-container>
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
        panelIndex:null
       } 
   }, 
   computed: {    
   }, 
   methods: {
     startCarousel() {
       this.$cs.l('start carousel for : ', this.aw)
       this.$router.push({ name: 'virtualawards'
                         , params:{chapterid: this.aw.storymainid
                                 , editmode: true}});
     },
     showStory(s) {
         //get story from s (storyid)
         //and load it into aw for display
         this.panelIndex = null
         this.aw = this.allStories.filter(ele => ele.storymainid == s)[0]
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