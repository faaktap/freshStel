<template>
 <v-card color="grey lighten-3" 
         class="text-center ma-0 pa-0">
  <zml-close-button @btn-click="closeIt" />
  <v-card-title class="text-center text-caption text-sm-body-2 text-md-body-1 text-lg-h6">
       <v-btn  @click="launchOutside" title="Open in Browser/Download">
        <v-icon> mdi-window-open </v-icon> Open
      </v-btn>
      <div class="mx-4 text-center">
      Preview - {{ getFilenameNoExtension(src) }} 
      </div>
      <slot />
  </v-card-title>

  <v-card-text>
  <!--template v-if="type=='movie'">
    <video controls
           height="80%" width="70%"
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
  </template-->

  <template v-if="type=='picture'">
    <img ref="picture" 
         :height="imageHeight"
        :src="src"
        contain
    />
  </template>
  <template v-if="['movie','picture','audio'].includes(type)">
      <iframe class="ma-0 pa-0" id="iframe" width="900" height="480" title="title" 
                ref="iframe" 
                :src="src" />
  </template>
  <template v-else>
      We cannot display this file - you need to download it {{ type }}
  </template>

  </v-card-text>
 </v-card>
 </template>

<script>
//import {getIcon, getFilename} from '@/api/fileUtils.js'
//import { zmlFetch } from '@/api/zmlFetch';
import zmlCloseButton from '@/components/zmlCloseButton'
export default {
 name: "about",
 props:{  src:  {type: String,default:"https://kuiliesonline.co.za/Subjects/GR12/Accounting_Rekeningkunde/Gr 12 - Mrs Wiegand/Budgets/14.10 Part 2.mp4"} 
         ,type: {type: String, default:"movie"}
       }, 
 components: { zmlCloseButton},
 data: () => ({
    icon: null,
    title: '',
 }),
 computed:{
      imageHeight () {
        switch (this.$vuetify.breakpoint.name) {
          case 'xs': return '100%'
          case 'sm': return '100%'
          case 'md': return '90%'
          case 'lg': return '80%'
          case 'xl': return '80%'
        }
        return "50%"
      },
 },
 methods: {
      getFilenameNoExtension( fileName ) {
       const pieces =   fileName.split('/') 
       console.log('pices:', pieces)
       const l = pieces.length - 1
       if (l >= 0) {
          console.log('pices:', pieces[l])
          return  pieces[l]
       } else {
         console.log('pices: nada')
         return ""
       }
      },   
     launchOutside() {
       console.log('launchOutside')
       this.stopIT()
        window.open(this.src,'_' + this.type)
        /*
        const ts = {
            task: 'mime',
            photo: "Subjects/GR12/Accounting_Rekeningkunde/Gr 12 - Mrs Wiegand/Budgets/14.10 Part 2.mp4",
        }
        zmlFetch(ts, this.doneL, this.failL)
        */
     },
     closeIt() {
       console.log('-------------------------closeIt')
       this.$emit('close')
       this.stopIT()
     },
     stopIT() {
       console.log('refs = ', this.$refs.iframe)
       const xx = this.$refs.iframe;
       xx.src  = '';

      let iframes = this.$refs.iframe;
      Array.prototype.forEach.call(iframes, iframe => {
        console.log('iframe=')
        iframe.contentWindow.postMessage(JSON.stringify({ event: 'command', func: 'stopVideo' }), '*');
      });
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