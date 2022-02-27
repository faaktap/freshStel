<template>
 <v-container>
     <v-row justify="space-around">
      <v-col cols="12" md="6">
        <v-file-input
          accept="image/png, image/jpeg, image/bmp"
          placeholder="Pick an Image"
          prepend-icon="mdi-camera"
          show-size
          label="Avatar"
          @change="readURL"
        />
        <v-card v-if="showSettings">
          <v-text-field
             class="ma-2 pa-2"
             v-model="imgSize"
             title="Quality of image max height or width"
             label="Image Size"
          />
          <v-text-field
             class="ma-2 pa-2"
             v-model="realName"
             title="Name that will be stored on the server"
             label="upload FileName"
          />
          <v-text-field
             class="ma-2 pa-2"
             v-model="extraPath"
             title="Path that will be prepended to the filename"
             label="extraPath"
          />
        </v-card>
      </v-col>
      <v-col v-if="originalImg"
             cols="12" md="6">
        <v-card>
          <v-card-title>
            Resized Image
            <v-btn text @click="showSettings = !showSettings">..</v-btn>
          </v-card-title>
          <v-card-text class="text-center">
            <img :src="resizedImg" ref="testImg" />
          </v-card-text>
          <v-card-actions>
            <v-btn @click="originalImg = ''"> Cancel </v-btn>
            <v-spacer />
            <v-btn @click="saveFile"
                  :loading="loading"
                  color="primary"
            > Save </v-btn>
          </v-card-actions>
        </v-card>
       </v-col>
     </v-row>
  </v-container>
 </template>

<script>
import { resizeImage,getBase64Image } from "@/api/resizeImage.js"
import { makeID } from "@/api/makeID.js"
import { zmlConfig } from '@/api/constants';
import { zmlFetch } from '@/api/zmlFetch';
export default {
  name:"UploadResizedImage",
  layout: 'default',
  props:{
         imgSize: {default:300 },
         extraPath: {default: '/home/zmlreken/test'}
         },
  data: () => ({
      originalImg: '',
      resizedImg: '',
      showSettings: false,
      fileName: 'someTest.png',
      realName: '',
      loading:false
  }),
  methods: {
    saveFile() {
        // assign the data needed for zmlFetch "upload" function
        this.loading = true
        let fileData = {}
        fileData.realname = this.realName;
        //fileData.name = this.fileName
        fileData.task = 'upload';
        fileData.extrapath =  this.extraPath
        fileData.base64 = getBase64Image(this.$refs.testImg)
        fileData.size = fileData.base64.length
        fileData.api = zmlConfig.apiUpload //"https://kuiliesonline.co.za/api/fileUpload/fileUpload.php"
        // console.log('Data sent', fileData)
        zmlFetch(fileData,this.doneWithUpload, this.errorWithUpload)
    },
    errorWithUpload(error) {
        this.loading = false
        alert('an error happened on upload of file' + error.error)
    },
    doneWithUpload(response) {
        // Information we get back..
        // fileName: "/home/zmlreken/test/DSC_7753.ewhR.jpg"
        // filePath: "/home/zmlreken/test/DSC_7753.ewhR.jpg"
        // filename: "DSC_7753.ewhR.jpg"
        // result: "ok"
        // size: 212875
        this.$emit('file-saved',response)

        // Hide the resized image after upload and switch loading off
        this.originalImg = ''
        this.loading = false
    },
    readURL(file) {
      // START: preview original
      // you can remove this section if you don't like to preview original image
      if (!file.type.match(/image.*/)) {
        alert('Not an image : ' + file.type);
      //  return;
      }
      const reader = new FileReader();
      reader.onload = (e) => this.originalImg = e.target.result;
      reader.readAsDataURL(file); // convert to base64 string
      // END: preview original

      // START: preview resized
      // make the widest part equal to "imgSize"
      resizeImage({ file: file, maxSize: this.imgSize }).then((resizedImage) => {
        this.resizedImg = URL.createObjectURL(resizedImage);
      }).catch((err) => {
        console.error(err);
      });
      // END: preview resized

      // Assign the filename for upload, make it unique via makeID
      // ie. werner.jpg become werner.sdfg.jpg
      this.fileName = file.name
      const pieces = this.fileName.split(/[\s.]+/)
      this.realName = pieces[0]
                    + '.'
                    + makeID(4)
                    + '.'
                    + pieces[pieces.length - 1].toLowerCase()

    },
  },
  mounted() {
    //   console.log('started/Mounted UploadResizedImage')
  }
}
</script>
