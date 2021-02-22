<template>
 <v-card xmax-width="400" color="grey lighten-3" class="text-center">
  <v-card-title>
       <v-btn  @click="launchOutside" title="Open in Browser/Download">
        <v-icon> mdi-window-open </v-icon> Open
      </v-btn>
      <span class="mx-2">
      Preview {{ type }}
      </span>
      <slot />
  </v-card-title>

  <v-card-text>
  <template v-if="type=='movie'">
    <video controls
           width="unset" 
           ref="video"
           :src="src"
      >
      Sorry, your browser doesn't support embedded videos.
    </video>
  </template>

  <template v-if="type=='audio'">
    <audio controls 
           ref="audio" 
           width="350"
           :src="src"
    >

    </audio>      
  </template>

  <template v-if="type=='picture'">
    <img ref="picture" 
         width="unset"
        :src="src"
    />
  </template>

  <template v-if="!['movie','picture','audio'].includes(type)">
        <iframe class="ma-0 pa-0" id="iframe" width="100%"
                ref="iframe" 
                :src="src" />
  </template>

  </v-card-text>
 </v-card>
</template>

<script>
//import {getIcon, getFilename} from '@/api/fileUtils.js'
//import { zmlFetch } from '@/api/zmlFetch';
export default {
 name: "about",
 props:{  src:  {type: String,default:"https://kuiliesonline.co.za/Subjects/GR12/Accounting_Rekeningkunde/Gr 12 - Mrs Wiegand/Budgets/14.10 Part 2.mp4"} 
         ,type: {type: String, default:"movie"}
       }, 
 components: {},
 data: () => ({
    icon: null,
    title: '',
 }),
 methods: {
     launchOutside() {
        window.open(this.src,'_' + this.type)
        /*
        const ts = {
            task: 'mime',
            photo: "Subjects/GR12/Accounting_Rekeningkunde/Gr 12 - Mrs Wiegand/Budgets/14.10 Part 2.mp4",
        }
        zmlFetch(ts, this.doneL, this.failL)
        */
     },
     doneL(response) {
       console.log(response)
     },
     failL(response) {
       console.log(response)
     }
 },
 mounted() {
        console.log('PRE Mounted')
    /*    
        this.icon = getIcon(this.src)
        this.title = getFilename(this.src)
        if (this.title.length > 40) {
            this.title = this.title.substr(50)
        }
      */  
 },
 watch: {
     src() {
     }
 }
}

</script>