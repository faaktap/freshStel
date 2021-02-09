<template>
  <div>
   login:{{ getZml.login }}
   <hr />
   grade:{{ getZml.grade }}
   <hr />
   subject:{{ getZml.subject }} id : {{ getZml.subjectid }}
   <hr />
   subjects:{{ getZml.subjects }}
   <hr />
   local:{{ getZml.locale }}   

    <div
      @mouseover="hover = true"
      @mouseleave="hover = false"
      :class="{ active: hover }"    >
      Hover me to change the background! (active becomes true on hover <br> see style below)
    </div>

    <h1> Other (better) hover option - see style </h1>

   <v-row justify="center" class="fill-height" align="stretch"  color="green">
    <v-col color="red">
     <p class="subheading grey--text"> This is heading for v-hover </p>
     <div>
        <v-icon color="blue"> mdi-silverware </v-icon>
        <v-btn  @mouseover="hover = true"
                 @mouseleave="hover = false"
                 title="hover is used in a few places - but not working for v-hover"> 
          Doen Niks 
         </v-btn>
         <v-spacer />
         <span v-if="hover">This is a secret message.</span>
         <v-hover v-slot:default="{ hover }">
          <v-card color="green"
                 min-width=150
                 min-height=150
                 :elevation="hover ? 12 : 2"
                 :class="{'on-hover': hover,'overwrite-hover': $vuetify.breakpoint.xsOnly}"
          >
             green? <br>
          <v-card-title> some card heading </v-card-title>   
          <v-card-text> some card text </v-card-text>
          <v-icon x-large color="blue"> mdi-wardrobe-outline </v-icon>
          <v-icon x-large> mdi-wardrobe </v-icon>
          </v-card>
         </v-hover>

     </div>
   </v-col>
  </v-row>


<v-row  justify="center" class="fill-height" align="stretch">
    <v-col>
     <v-hover v-slot:default="{ hover }" open-delay="200">
      <v-card color="green"
             min-width=50
             min-height=50
             :elevation="hover ? 12 : 2"
             :class="{'on-hover': hover,'overwrite-hover': $vuetify.breakpoint.xsOnly}"
      >
       <v-card-subtitle> some card heading </v-card-subtitle>   
       <v-card-text> 
          some card text 
       <v-expand-transition>
          <div
            v-if="hover"
            class="d-flex transition-fast-in-fast-out purple darken-2 v-card--reveal display-3 white--text"
            style="height: 100%;"
          >
            $14.99
          </div>
       </v-expand-transition>
       </v-card-text>
      </v-card>
     </v-hover>
    </v-col>

    <v-col>
     <v-hover  
         v-slot:default="{ hover }"
         open-delay="200">
      <v-card :elevation="hover ? 12 : 2"
             :class="{'on-hover': hover,'overwrite-hover': $vuetify.breakpoint.xsOnly}">
       <v-img src="img/zmltest.svg" 
             max-height=140px 
             contain >
       </v-img>
      </v-card>
     </v-hover>
    </v-col>
  </v-row>
  
  <v-row justify="center" class="fill-height" align="stretch">
    <v-col>
      <div> start </div>
       <v-hover v-slot:default="{ hover }">
         <v-card
          max-width=250
          min-width=150
          min-height=250
          max-height=350
          color=#F5F5F5
          style="xoverflow: auto;"
          :elevation="hover ? 12 : 2"
          :class="{
          'on-hover': hover,
          'overwrite-hover': $vuetify.breakpoint.xsOnly
         }">
           <v-icon color="green" title="You have selected this product!">mdi-marker-check</v-icon>
           <v-icon color="purple" title="This product is part of a mix case!">mdi-marker-check</v-icon>
           <v-icon color="gray">10</v-icon>
           <v-spacer/><h3>h3</h3>
            <v-img src="img/zmltest.svg" max-height=240px contain class="ma-1">
             <v-expand-transition>
              <div v-if="hover" 
                   class="d-flex justify-center transition-fast-in-fast-out darken-2 v-card--reveal " 
                   style="align-items: center;">
                <v-img 
                          max-width="120px"
                          contain
                          src="zmlrekenaars.png"
                          > 
                </v-img>                
              </div>
             </v-expand-transition>
            </v-img>
            <div v-if="hover">
              <v-btn  fab left bottom absolute title="add 2 cart">
               <v-badge overlap :visibility="clicks">
                <span slot="badge"> {{ clicks }} </span>
                 <v-icon large
                        color="grey lighten-1">
                   mdi-shopping
                 </v-icon>
               </v-badge>
              </v-btn>
              <v-btn fab bottom right absolute title="detail">
               <v-icon large color="green lighten-1"> mdi-information</v-icon>
              </v-btn>          
            </div>              
            <div class="wordbreak ma-2 myitem text-center">
             <span> theItem.title <br>
              <center>R theItem.price <v-icon>  mdi-glass-wine </v-icon> theItem.unit x R theItem.price / theItem.unit</center>
             </span> 
            </div>
          </v-card>
         </v-hover>
    </v-col>
   </v-row>

<v-container>
    <v-row>
      <v-col col="12">
        <v-card max-width="400" class="mx-auto">
          <v-container>
            <v-row dense>
              <v-col v-for="(item, i) in items" :key="i" cols="12">
                <v-card :color="item.color" dark>
                  <div class="d-flex flex-no-wrap justify-space-between">
                    <div>
                      <v-card-title class="headline" v-text="item.title"></v-card-title>
                      <v-card-subtitle v-text="item.artist"></v-card-subtitle>
                    </div>
                    <v-avatar class="ma-3" size="125" tile>
                      <v-img :src="item.src"></v-img>
                    </v-avatar>
                  </div>
                </v-card>
              </v-col>
            </v-row>
          </v-container>
        </v-card>
      </v-col>
    </v-row>
  </v-container>

  <v-container>
    <v-row>
      <v-col col="12">
        <v-card class="mx-auto" max-width="344">
          <v-img src="https://cdn.vuetifyjs.com/images/cards/sunshine.jpg" height="200px"></v-img>
          <v-card-title>Sunshine</v-card-title>
          <v-card-subtitle>Lorem ipsum</v-card-subtitle>
          <v-card-actions>
            <v-btn text>Share</v-btn>
            <v-btn color="purple" text>Explore</v-btn>
            <v-spacer></v-spacer>
            <v-btn icon @click="show = !show">
              <v-icon>{{ show ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
            </v-btn>
          </v-card-actions>
          <v-expand-transition>
            <div v-show="show">
              <v-divider></v-divider>
              <v-card-text>Lorem ipsum.</v-card-text>
            </div>
          </v-expand-transition>
        </v-card>
      </v-col>
    </v-row>
  </v-container>

  <v-container>
    <v-row>
      <v-col col="12">
        <v-card class="mx-auto" color="#26c6da" dark max-width="400">
          <v-card-title>
            <v-icon large left>mdi-twitter</v-icon>
            <span class="title font-weight-light">Twitter</span>
          </v-card-title>
<v-card-text class="headline font-weight-bold">"hello world."</v-card-text>
          <v-card-actions>
            <v-list-item class="grow">
              <v-list-item-avatar color="grey darken-3">
                <v-img
                  class="elevation-6"
                  src="https://avataaars.io/?avatarStyle=Transparent&topType=ShortHairShortCurly&accessoriesType=Prescription02&hairColor=Black&facialHairType=Blank&clotheType=Hoodie&clotheColor=White&eyeType=Default&eyebrowType=DefaultNatural&mouthType=Default&skinColor=Light"
                ></v-img>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title>James Smith</v-list-item-title>
              </v-list-item-content>
              <v-row align="center" justify="end">
                <v-icon class="mr-1">mdi-heart</v-icon>
                <span class="subheading mr-2">100</span>
                <span class="mr-1">·</span>
                <v-icon class="mr-1">mdi-share-variant</v-icon>
                <span class="subheading">100</span>
              </v-row>
            </v-list-item>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

<div class="filter">
 <v-row> 
  <v-col cols="6">
   <auto-sel id="zyx2" 
            :asLabel="'Some Label for User (' + selectedFruit + ')'" 
            :initialValue="selectedFruit" 
            :itemArr="fruitOptions" 
             v-model="selectedFruit1">
   </auto-sel>
  </v-col>
  <v-col>
   <auto-sel id="zyx1" 
             asLabel="Select your Fruit!" 
            :initialValue="selectedFruit" 
            :itemArr="fruitOptions" 
             v-model="selectedFruit2">
   </auto-sel>
  </v-col>   

  <v-col>
   <auto-sel-obj id="zyx1" 
             asLabel="Select your Fruit!" 
            :initialValue="selectedFruitNo" 
            :itemObj="fruitObject" 
             v-model="selectedFruitNo" >
   </auto-sel-obj>
  </v-col>   


 </v-row>
</div>
SF = {{ selectedFruit }}{{ selectedFruit1 }}{{ selectedFruit2 }}{{ selectedFruitNo }}
  </v-container>

  
  </div>
</template>

<script>
import { getters } from "@/api/store"
import AutoSel from '@/components/AutoSel.vue'
import AutoSelObj from '@/components/AutoSelObj.vue'
export default {
  components: {
    AutoSel, AutoSelObj
  },  
 data: () => ({
  getZml: getters.getState({ object: "gZml" }),
  fruitOptions: ['appels','pere','tamaties','waatlemoen'],
  fruitObject: [{id:1,name:'appels'},{id:2,name:'pere'},
                {id:3,name:'tamaties'},{id:4,name:'waatlemoen'}],
  selectedFruit: "appels",
  selectedFruit1: "",
  selectedFruit2: "",
  selectedFruitNo:{id:4,name:'waatlemoen'}, //but 4 would work as well
  clicks: 1,
  hover: 1,
  show: false,
  items: [
      {
        color: "#1F7087",
        src: "http://placekitten.com/200/200",
        title: "Cat",
        artist: "James Smith",
      },
      {
        color: "#952175",
        src: "http://placekitten.com/200/200",
        title: "Cat",
        artist: "Ellie Jones",
      },
    ],  
 }),
}
</script>

<style scoped>
.active {
  background: purple;
}
h1:hover {
  background: green;
}
</style>