<div>
 <v-overlay
      :opacity=".5"
      :value="loading">
  <v-progress-circular indeterminate size="64">
     Loading...
  </v-progress-circular>
 </v-overlay>

 <v-parallax src="/img/boSkool.jpg" height="1300px">
  <v-container fluid>
   <v-layout row fill-height justify-center color="rgba(255, 0, 1, 0.5)"  style="height: 100vh" >
    <v-carousel v-model="panelIndex"
                :interval="interval"
                height="100%"
                hide-delimiters show-arrows-on-hover
               :continuous="false"
               :cycle="cycle"
               :touch="{left: () => panelIndex--, right: () => panelIndex++}">
      <v-carousel-item v-for="page in pictureList"
                      :key="page.name"
                       color="rgba(255, 1, 7, 0.2)"
                       contain
                      :transition="page.transition"
                       style="height: 100vh"
                      >
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
  </v-layout>
 </v-parallax>
         
<v-dialog v-model="showPictureList"  :fullscreen="$vuetify.breakpoint.mobile" max-width="600" width="auto">
   <v-card>
      <v-card-title>
         Go to a specific chapter
      </v-card-title>
      <v-card-text>
        <v-autocomplete v-model="pageIndex"
        :items="carouselDataFilter()"
        :search-input.sync="search"
        item-text="detail1"
        item-value="sortid"
        dense
        label="Select a Picture" />
      </v-card-text>
      <v-card-actions>
         <v-btn @click="showPictureList = false"> Close </v-btn>
      </v-card-actions>
   </v-card>
</v-dialog>

  <!-- Maybe make these cards that fill the screen? -->
  <v-data-table
       v-if="showAllPictures"
      :headers="awardListHeader"
      :items="awardList"
      :items-per-page="500"
      class="elevation-2"
      :loading="loading"
      @click:row="clickOnDiplomaRow" 
  />


</div>
</template>

<script>
export default {
    components:{InsideTestRoute},
    props: {
      pictureList:{default: () => []}
    },
    data () => ({
        getZml: getters.getState({ object: "gZml" }),
        zData:zData,
        loading:false,
        localChapter:0,
        localItem:0,
        sqlStatement:'',
        currentEditMode: false,
        showChapters: false,
        startSlideShow: false,
        search:'',
        storyIndex: 0,
        panelIndex:null,
        cycle:true,
        interval: 9000,
        showAllPictures: false
       }
   },
   computed: {
   },
}
</script>