<template>
<v-container>
  <v-card class="ma-2 pa-2">
    <v-card-title>
      <h2 class="text-center">Enroll</h2>
    </v-card-title>
    <v-card-text>
        This is a button


      to get some image data.
    </v-card-text>
    <v-card-actions>
     <v-btn @click="doit()" color="primary"> Upload to Server </v-btn>
     <camera-button @done="imageSelected" /> <v-btn class="ma-2 pa-2"> click me </v-btn>
    </v-card-actions>
  </v-card>
</v-container>
</template>

<script>
import CameraButton from '@/components/picload/CameraButton.vue'
import {uploads} from '@/api/uploads.js'
function clog(...args) {console.log('Enroll:' ,...args)}
export default {
  name: "Enroll",
  components: {CameraButton},
  props:[],
  data() {
    return {
      model:{
       IDNo: null,
       firstname: null,
       surname: null,
       email: null,
      },
      fileObj:null,
    };
  },
  methods: {
    imageSelected(e) {
      alert('We received an image!')
      clog('fileObj - ', e)
      //this.convertToFileObj(e, 'whatever.jpg')
      this.fileObj = e
      this.fileObj.id = 1004
      this.fileObj.pre = 'qck'
      this.fileObj.realname = 'qck' + 'whatever.jpg'
      this.fileObj.extrapath = 'xxxx'
      clog('start uplaod')
      uploads.addSingleFile(this.fileObj)
      uploads.makeAWait(1200, uploads.uploadStart,this.checkFileQ)
    },
    checkFileQ(resp) {
      clog('checkQ')
      if (resp && resp.filename) {
         clog('THE SINGLE FILE was LoAded.....')
         uploads.files = []
         uploads.fieldnames = []
         alert('upload done!')
      }
    },
    async dataURLToFile(imageString, filename, mimeType) {
        const res = await fetch(imageString)
        const blob = await res.blob()
        return new File([blob], filename, { type: mimeType })
    },
    async convertToFileObj(imageData,filename) {
        this.fileObj = {}
        this.fileObj = await this.dataURLToFile(imageData, filename, 'data:image/jpg;base64')
        clog('convertToFileObj:', this.fileObj)

    },

  },
  mounted: function () {
  },
  watch:{
  }
}
</script>
<style>
</style>