<template>
 <v-card color="white darken-1"
         class="text-center ma-0 pa-0" :loading="loading">

  <zml-close-button @btn-click="closeIt" />
<!-- For EPUB, epub we could try and get https://github.com/Treinetic/TreineticEpubReader started
     see https://stackoverflow.com/questions/16933086/how-to-read-epub-files-using-javascript#16950918
-->
  <v-card-title class="ma-1 pa-1 text-center text-caption text-sm-body-2 text-md-body-1 text-lg-h6">
    <v-btn
      class="ma-2"
      @click="launchOutside"
      title="Open in Browser/Download"
      >
      <v-icon> mdi-window-open </v-icon> Open
    </v-btn>

    <div class="mx-4 mb-0 mt-0 pa-0 text-center">
      Preview - {{ getFilenameNoExtension(src) }}
    </div>

    <v-hover v-if="['JHMEL','werner'].includes(getZml.login.username)"
          v-slot:default="{ hover }"
          class="float-right"
          >
     <v-badge
      :value="hover"
      color="deep-purple accent-4"
      :content="`Debug:ExtName=${typeExtName} httpsrc= ${httpsrc}`"
      right
      transition="slide-x-transition"
      @click="$emit('fullscreen', true)"
     >
      <v-icon>mdi-fountain-pen-tip</v-icon>
     </v-badge>
    </v-hover>

  </v-card-title>

<!-------------------------------------VIDEO-PLAYABLE------------->
  <v-card-text class="text-center ma-0 pa-0">
  <template v-if="['video-playable'].includes(typeExtName)">
    <video controls
           height="80%" width="70%"
           class="text-center"
           ref="video"
           :src="httpsrc"
              @loaded="loaded"
              @onload="onload"
              @load="load"

      >
      Sorry, your browser doesn't support embedded videos.
    </video>
    <small class="text-caption">1</small>
  </template>


<!-------------------------------------AUDIO-PLAYABLE------------->
  <template v-else-if="['audio-playable'].includes(typeExtName)">
  <small class="text-caption">2</small>
    <audio controls
           ref="audio"
           xwidth="350"
           :src="httpsrc"
           @loaded="loaded"
           @onload="onload"
           @load="load"

    >
    </audio>
    <small class="text-caption">2</small>
  </template>

<!-------------------------------------PICTURE or IMAGE------------->
  <template v-else-if="['picture','image'].includes(typeExtName)">
    <v-img ref="picture"
          :height="imageHeight"
          :src="httpsrc"
           contain
           @loaded="loaded"
           @onload="onload"
           @load="load"

    />
    <small class="text-caption">3</small>
  </template>

<!-------------------------------------GENERAL IFRAME for OTHERS------------->
  <template v-else-if="['movie','picture','audio','video','markup','text','html'].includes(typeExtName)">
      <iframe class="ma-0 pa-0" id="iframe" width="900" height="480" :title="title"
              ref="iframe"
              @loaded="loaded"
              @onload="onload"
              @load="load"
              :src="httpsrc" />
      <small class="text-caption">4</small>
  </template>


<!-------------------------------------GOOGLE READER------------->
  <template v-else-if="['document', 'doc','ebook','pdf'].includes(typeExtName)">
    <!--small class="ma-0 pa-0 text-caption"><br>5</small-->
      <iframe class="ma-0 pa-0" id="iframe" :width="screenwidth" :height="screenheight" :title="title"
            ref="google"
              @loaded="loaded"
              @onload="onload"
              @load="load"
            :src="httpSrcGoogleEmbed">
      </iframe>
      <small>{{ httpSrcGoogleEmbed }}.(5)</small>
  </template>

<!-------------------------------------TRY GOOGLE READER------------->
<template v-else-if="['link'].includes(typeExtName)">
  <small class="text-caption">6</small>
      <iframe class="ma-0 pa-0" id="iframe" width="900" height="480" :title="title"
              ref="iframe"
              @loaded="loaded"
              @onload="onload"
              @load="load"
              :src="httpsrc" />
  </template>

<template v-else-if="['presentation'].includes(typeExtName)">
  <small class="text-caption">7</small>
    {{httpSrcOfficeEmbed }}
    <iframe class="ma-0 pa-0" id="iframe" width="900" height="480" title="title"
            ref="office"
            frameborder="0"
              @loaded="loaded"
              @onload="onload"
            :src="httpSrcOfficeEmbed">
    </iframe>
  </template>

  <template v-else>

   <v-card class="ma-2 pa-2" color="warning">
     <v-card-title>
       (Click on Open)
     </v-card-title>
     <v-card-text>
       <small class="text-caption">8</small>
       <p>We cannot display this file - you need to download it</p>
       <p>If you are logged into google, or microsoft, you can try one of these links
              <br> <a :href="httpSrcOfficeEmbed" target="test"> MS Office Embed </a>
      , <a :href="httpSrcGoogleEmbed" target="test"> Google Docs Embed </a></p>
     </v-card-text>
   </v-card>

      <br><small class="text-caption">T={{ typeExtName }}</small>
  </template>
  </v-card-text>
    <small class="text-caption">
       <a :href="httpSrcOfficeEmbed" target="test"> Office Embed </a>
       <a :href="httpSrcGoogleEmbed" target="test"> Google Embed </a>
    </small>
 </v-card>
 </template>

<script>
import zmlCloseButton from '@/components/zmlCloseButton'
import { extNames } from '@/api/extensions.js'
import { zmlLog } from '@/api/zmlLog.js';
import { getters } from "@/api/store";

export default {
 name: "zmlPreview",
 props:{  src:  {type: String,default:"https://kuiliesonline.co.za/Subjects/GR12/Accounting_Rekeningkunde/Gr 12 - Mrs Wiegand/Budgets/14.10 Part 2.mp4"}
         ,type: {type: String, default:"movie"}
       },
 components: { zmlCloseButton },
 data: () => ({
    getZml : getters.getState({ object: "gZml" }),
    icon: null,
    title: '',
    loading:false
 }),
 computed:{
      screenwidth() {
        return screen.width+"px"
      },
      screenheight() {
        return screen.height+"px"
      },

      httpsrc() {
        if (this.src.includes('/home/')) {
           let cleanPath = this.src.replace('/home/kuilieso/public_html', '')
           return 'https://www.kuiliesonline.co.za' + cleanPath
        } else {
           return this.src
        }
      },
      httpSrcGoogleEmbed(){
        return `https://docs.google.com/gview?url=${this.httpsrc}&embedded=true`
      },
      httpSrcOfficeEmbed(){
        return `https://view.officeapps.live.com/op/embed.aspx?src=${this.httpsrc}`
      },
      typeExtName() {
        if (!this.type) return ''
        const keys = Object.keys(extNames)
        let k2 = {}
        let answer = ''
        keys.forEach((key) => {
          k2 = Object.keys(extNames[key])
          // k2 is video and x is array of extensions
          const ext = extNames[key][k2]
          if (ext.includes(this.type.toLowerCase())) {
            answer = k2[0]
          }
        })
        return answer

      },
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
   loaded(e) {this.loading = false;console.log('loaded:', e)},
   onload(e) {this.loading = false;console.log('onload:', e)},
   load(e) {this.loading = false;console.log('load:', e)},
      getFilenameNoExtension( fileName ) {
       const pieces =   fileName.split('/')
       const l = pieces.length - 1
       if (l >= 0) {
          return  pieces[l]
       } else {
         return ""
       }
      },
     launchOutside() {
       console.log('--launchOutside')
       this.stopIT()
       window.open(this.httpsrc,'_' + this.type)
     },
     closeIt() {
       // console.log('--closeIt')
       this.$emit('close')
       this.stopIT()
     },
     stopIT() {
       // console.log('--stopIt')
       let xx = this.$refs.iframe;
       if (!xx) xx = this.$refs.google;
       if (!xx) xx = this.$refs.video;
       if (!xx) xx = this.$refs.audio;
       if (!xx) xx = this.$refs.office;
       if (!xx) return
       let iframes = this.$refs.iframe;
       if (iframes) {
        Array.prototype.forEach.call(iframes, iframe => {
          console.log('iframe=')
          iframe.contentWindow.postMessage(JSON.stringify({ event: 'command', func: 'stopVideo' }), '*');
        });
        xx.src  = '';
       }
      }
 },
 mounted() {
   console.log('M:',this.$options.name)
   this.loading = true
 },
 watch: {
     src() {
       const user = getters.getState({ object: "gZml" }).login.username
       zmlLog(user , "ViewContent", this.src)
     }
 }
}

</script>