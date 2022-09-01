<template>
<v-container fluid>

<base-title-expand  heading="Test 1 auto-sel-obj">
<v-layout>
<v-flex xs6>
   initial value = {{ selectedFruitNo }}
   <br>v-model = {{ selectedFruitNo }}
   <br>asLabel = select your fruit
   <br>itemObj = fruitObj
</v-flex>
    <v-flex xs6>
   <auto-sel-obj id="zyx1"
             asLabel="Select your Fruit!"
            :initialValue="selectedFruitNo"
            :itemObj="fruitObject"
             v-model="selectedFruitNo" >
   </auto-sel-obj>
   </v-flex>
</v-layout>
</base-title-expand>
<base-title-expand  heading="Test 1 auto-sel-sub">
<v-layout row wrap align-center class="ma-2 pa-2">
   <v-flex xs4>
      selectedSubject = {{ selectedSubject }}
      <auto-sel-sub id="zyx4"
             asLabel="Subject"
            :initialValue="selectedSubject"
            :itemObj="getZml.subjects"
             v-model="selectedSubject"
      />
   </v-flex>
   <v-flex xs4>
      selectedPers = {{ selectedPers }}
      <auto-sel-pers id="zyx4"
             asLabel="Pers"
            :initialValue="selectedPers"
            :itemObj="getZml.persMenemonic"
             v-model="selectedPers"
      />
   </v-flex>
   <v-flex xs4>
      selectedRoom = {{ selectedRoom }}
      <auto-sel-room id="zyx4"
             asLabel="Room"
            :initialValue="selectedRoom"
            :itemObj="getZml.place"
             v-model="selectedRoom"
      />

   </v-flex>
   <v-flex xs12>
{{ getZml.persMenemonic }}
   </v-flex>
</v-layout>
</base-title-expand>

<base-title-expand>
   <auto-sel id="zyx2"
            :asLabel="'Some Label for User (' + selectedFruit + ')'"
            :initialValue="selectedFruit"
            :itemArr="fruitOptions"
             v-model="selectedFruit1">
   </auto-sel>
</base-title-expand>

</v-container>
</template>

<script>
import { getters } from "@/api/store"
import AutoSel from '@/components/AutoSel.vue'
import AutoSelObj from '@/components/AutoSelObj.vue'
import AutoSelSub from '@/components/AutoSelSub.vue'
import AutoSelPers from '@/components/AutoSelPers.vue'
import AutoSelRoom from '@/components/AutoSelRoom.vue'
//import OnFocus from '@/components/OnFocus.vue'

import { zData } from "@/api/zGetBackgroundData.js"
import BaseTitleExpand from '@/components/base/BaseTitleExpand.vue'
export default {
  components: {
      AutoSel
    , AutoSelObj, AutoSelSub, AutoSelPers
    , AutoSelRoom
    , BaseTitleExpand
  },
 data: () => ({
  uploadTitleMessage:"upload a file or files",
  uploadCardColor:"lightpink",
  uploadExtraPath:"Test/werner1",
  uploadPrependName:"prep-",
  uploadBtnColor:"primary",
  uploadStuffShow:false,
  getZml: getters.getState({ object: "gZml" }),
  classtest:'col-4 col-sm-6 col-md-8',
  fruitOptions: ['appels','pere','tamaties','waatlemoen'],
  fruitObject: [{id:1,name:'appels'},{id:2,name:'pere'},
                {id:3,name:'tamaties'},{id:4,name:'waatlemoen'}],
  selectedFruit: "appels",
  selectedFruit1: "",
  selectedFruit2: "",
  //selectedFruitNo:{id:4,name:'waatlemoen'}, //but 4 would work as well
  selectedFruitNo:{id:4}, //but 4 would work as well
  selectedSubject:201,
  selectedPers:'MOS',
  selectedRoom:'1F',
  subjectChanged:'',
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
 methods:{
   finished(e){
     console.log('agtergrond data klaar gelaai!!!', e)
   },
   processListOfFiles(e) {
     console.log('we have received a list of files to be done', e)
   },
   tellOfOneFile(e) {
     console.log('we have received one file done', e)
   },
   testzData() {
     zData.initialData('hallo', this.finished)
   },
 },
 mounted() {
  zData.initialData('hallo', this.finished)
 }
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