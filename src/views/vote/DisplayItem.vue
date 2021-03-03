<template>
 <div>
  <div>
    <v-row justify="center" class="fill-height" align="stretch">
     <v-col>
       <v-hover v-slot:default="{ hover }">
         <v-card
          min-width=250   max-width=250   
          min-height=350  max-height=350
          color=#F5F5F5
          style="xoverflow: auto;"
          :elevation="hover ? 12 : 2"
          :class="{'on-hover': hover,
                   'overwrite-hover': $vuetify.breakpoint.xsOnly}"
           class="ma-2"
          >
          <v-spacer></v-spacer>

          <br>
          <v-img :src="theItem.foto + '?x-1'" max-height=240px contain class="ma-1">
            <div v-if="hover">
              <v-btn v-if="theItem.video" :href="'data/' + theItem.video" target="video" fab left absolute title="video">
               <v-icon large color="green lighten-1"> mdi-video</v-icon>
              </v-btn>          


              <v-btn xfab bottom left absolute title="vote for prefect" 
                     @click="vote">
               <template v-if="!(inListVote)">
                <v-icon large color="green lighten-1"> mdi-vote</v-icon>
               </template>
               <template v-else>
                 <v-icon large color="red lighten-1"> mdi-vote</v-icon>
               </template>
              </v-btn>     
              <v-btn v-if="isSenior" 
                     xfab bottom right absolute title="senior council vote" 
                     @click="seniorvote">
               <template v-if="!(inListSenior)">
                <v-icon large color="green lighten-1"> mdi-shield-plus</v-icon>
               </template>
               <template v-else>
                <v-icon large color="red lighten-1"> mdi-shield-plus-outline</v-icon>
               </template>
              </v-btn>          
              
            </div>    
            <!--v-badge overlap :visibility="clicks"><span slot="badge">{{ clicks }}</span></v-badge-->
          </v-img>

          <v-card-actions> 
             <v-icon color="green" 
                  x-small
                  title="You have voted for candidate!" 
                  v-if="inListVote || inListSenior"> mdi-thumb-up 
              </v-icon>              
              <div class="wordbreak ma-1 myitem">
                <h3 class="text-center">{{ theItem.surname }}, {{ theItem.firstname }}  </h3>
                <span>Grade {{ theItem.gradename }}:{{ theItem.classname }}</span> 
            </div>            
            </v-card-actions>            
          </v-card>
         </v-hover>
        </v-col>
      </v-row>
  </div>

  <v-dialog v-model="showVideo" 
      transition="dialog-bottom-transition"
      xmax-width="320">
    <v-card>
     <video playsinline autoplay controls>
      <source :src="'data/' + theItem.video" type='video/mp4'>
     </video>
    </v-card>
    <v-btn @click="showHideVideo" title="close">
     <v-icon large color="green lighten-1"> mdi-close-box</v-icon>
    </v-btn> 
  </v-dialog>

 </div> 
</template>

<script>
import { getters } from "@/api/store";   
export default {
  name: "Item",
  props: { theItem:{} },
  data() {
    return {
      getZml: getters.getState({ object: "gZml" }),
      hover:1,
      showVideo: false,
      propertiesStock: [],
      propertyStock: [],
      propertyLength: 0,
      propertyPosition: 0,
      clicks: false,
      seniorclicks: false
   };
  },
  computed: {
    isSenior: function() {
      if (this.getZml.login.Grade == 'G11') return true;
      return false;
    },
    inListVote: function() {
       return this.getZml.voteList.includes(this.theItem.rvlselid);
    },
    inListSenior: function() {
       return this.getZml.seniorList.includes(this.theItem.rvlselid);
    }
  },
  methods: { 
    vote: function() {
      this.$emit('voteing',this.theItem.rvlselid ,!this.inListVote,this.theItem.gradename);
    },    
    seniorvote: function() {
      if (this.isSenior) {
         this.$emit('seniorvoteing',this.theItem.rvlselid ,!this.inListVote,this.theItem.gradename);
      }
    },    
    showHideVideo() {
       this.showVideo = !this.showVideo;
       console.log('Showvide dialog = ', this.showVideo);
    }
   },
  filters: {   },
  watch: {  }
};
</script>

<style scoped>
.wordbreak {
  overflow-wrap: break-word;
  word-wrap: break-word;
  word-break: break-all;
  word-break: break-word;
  hyphens: auto;
}

.myitem {
    font-size: 14px;
    color: #222;
    font-weight: 600;
    font-family: "Montserrat", sans-serif;
    text-transform: uppercase;
    margin-bottom: 10px;
}

.v-card--reveal {
    align-items: center;
    bottom: 0;
    justify-content: center;
    opacity: .9;
    position: absolute;
    width: 100%;
}

.grid-container {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: 0.2fr 1.6fr 0.2fr;
  gap: 1px 1px;
  grid-template-areas: 
  "title title title" 
  "bottle description description"
  "cart bottom button";
}
.title { grid-area: title;
/* background-color: rebeccapurple; */
 }
.cart { grid-area: cart; }
.bottom { grid-area: bottom; }
.button { grid-area: button; }
.bottle { grid-area: bottle; }
.description  {
 grid-area: description; 
 /*background-color: azure;*/
 }

.grid-dialog {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr 1fr;
  gap: 1px 1px;
  grid-template-areas: 
    "d-bottle d-award" 
    "d-bottle d-award" 
    "d-title d-title";
}
.d-bottle { grid-area: d-bottle; }
.d-award { grid-area: d-award; }
.d-title { grid-area: d-title; }

 </style>
