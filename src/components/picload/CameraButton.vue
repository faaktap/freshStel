<template>
<!--
    I had a bit of difficulty converting the snapped image to a fileObject, so I can pass it to cropper.
    I changed cropper to allow for a base64 image to be accepted, but then I had to change it to return a base64 image as well.
    Decided eventually to "prep" my snapped image to look like a file, called internal.png, and then pass that to cropper (cropstart)
     then when I receive it back, it is a file object as well, which would make it the same as all my other uploaded files.
    I am still not sure of what everything do, but it's working
    Next step is to clean up, and show two buttons, one for camera and one for "gallery" or folder.
     Then user can either use his webcam (here) or have a standard file select interface.
    -->
<div class="ma-2 pa-2">
 <v-btn v-if="!showIt" @click="showIt = !showIt">   <v-icon>mdi-camera</v-icon> </v-btn>
 <v-layout v-if="showIt" justify-space-around>
    <v-card class="ma-2 pa-2 text-center" max-width="500">
        <v-card-text v-if="showDone == false" >
           <v-layout justify-space-around>
           <video v-if="!imageLoaded && !fileLoaded" ref="video" class="camera-stream" title="Video Stream">
           </video>
           <template v-else>
             <v-img v-if="cropped" :src="croppedImgSrc" contain title="Cropped Image" max-width="400" >
                <div style="position: absolute; left: 100px; bottom: 5px;">
                  Cropped Image
                </div>
             </v-img>
             <template v-else>
             <v-img v-if="videoSnapLoaded" :src="imageData" class="camera-stream" contain title="Snapped Image" max-width="400" >
                <v-layout justify-space-around>
                  Snapped Image
                </v-layout>
             </v-img>
             <div v-else>
                <v-layout justify-space-around>
                  Nothing loaded - click on the camera or file icon
                </v-layout>
             </div>
             </template>
           </template>
           </v-layout>
    <crop-start v-if="activateAvatarUpload"
       :image="fileObj"
       @doneOLD="(image) => {if (image) {form.image=image; setImage(form.image);activateAvatarUpload=false}}"
       @done="receivedCroppedFile"
    />

        </v-card-text>
        <v-card-actions v-if="showDone == false">
          <v-btn small class="ml-2 mb-1" @click="captureImage" title="Snap Video"><v-icon>mdi-camera</v-icon>   </v-btn>
          <v-btn small class="ml-2 mb-1" title="Load from Gallery">
              <v-file-input
                 v-model="file"
                 dense
                 label="Photo"
                 prepend-icon="mdi-folder"
                 hide-input
                 prefix="we are hiding the detail (wrapped in button)"
              ></v-file-input>
          </v-btn>
          <v-btn v-if="imageLoaded || fileLoaded" small class="ml-2 mb-1" @click="activateAvatarUpload = true" title="Cropper"><v-icon small>mdi-crop</v-icon> Crop </v-btn>
          <v-btn v-if="imageLoaded || fileLoaded" small class="ml-2 mb-1" @click="cancelImage" color="warning" title="Start Fresh"> <v-icon small>mdi-cancel</v-icon> Reset    </v-btn>
          <v-btn v-if="cropped"     small class="ml-2 mb-1" @click="done"        color="primary" title="All done"> <v-icon small> mdi-thumb-up</v-icon>    Done    </v-btn>
        </v-card-actions>
    </v-card>
 </v-layout>
</div>


</template>

<script>
import CropStart from "@/components/picload/CropStart.vue";
function clog(...args) {console.log('CameraButton:' ,...args)}
export default {
    name: "CameraButton",
    components: {CropStart},
    data: () => ({
        showIt: false,
        defaultImage: '/img/learner.png',
        mediaStream: null,
        file: null,
        fileObj:null,
        form:{
            image:null
        },
        croppedImgSrc: '',
        imageData:'',
        showDone:false,
        activateAvatarUpload: false,
    }),
    computed: {
       imageLoaded() {
        if (this.imageData) return true
        return false
       },
       cropped() {
        if (this.croppedImgSrc) return true
        return false
       },
       fileLoaded() {
        if (this.file) return true
        return false
       },
       videoSnapLoaded() {
        if (this.imageData) return true
        return false
       }

    },

    methods: {
        //The below two funcs convcert image to file obj to prep it for Cropper
       async dataURLToFile(imageString, filename, mimeType) {
        const res = await fetch(imageString)
        const blob = await res.blob()
        return new File([blob], filename, { type: mimeType })
       },
       async convertToFileObj() {
          this.fileObj = await this.dataURLToFile(this.imageData, 'internal.jpg', 'data:image/jpg;base64')
          clog('convertToFileObj:', this.fileObj)
          this.activateAvatarUpload = true
       },
       //The below func convert the cropped image for display
       setImage(file) {
          if (!file.type.includes("image/")) {
            this.cancelImage()
            alert("Please select an image file");
            return;
          }
          if (typeof FileReader === "function") {
            const reader = new FileReader();
            reader.onload = (event) => {
              this.croppedImgSrc = event.target.result;
            };
            reader.readAsDataURL(file);
          } else {
            alert("Sorry, FileReader API not supported");
          }
        },
        //The below capture an image from the video-stream
        captureImage() {
            const mediaStreamTrack = this.mediaStream.getVideoTracks()[0]
            const imageCapture = new window.ImageCapture(mediaStreamTrack)
            let reader = new FileReader();
            return imageCapture.takePhoto().then(blob => {
                reader.readAsDataURL(blob)
                reader.onload = () => {
                    this.imageData = reader.result;
                }
            })
        },
        //The below func reset images, and start the video-stream
        cancelImage() {
            this.imageData = null
            this.file = null
            this.croppedImgSrc = null
            navigator.mediaDevices.getUserMedia({video: true})
            .then(mediaStream => {
                    this.$refs.video.srcObject = mediaStream;
                    this.$refs.video.play()
                    this.mediaStream = mediaStream
            })
        },
        // this func catch thhe cropper emitter and save the file and display the image
        receivedCroppedFile(file) {
            if (file) {
                this.form.image=file;
                this.setImage(this.form.image)
                this.activateAvatarUpload = false
                this.fileObj = file
            } else {
                alert('no data received.')
            }
        },
        // this func will emit the cropped image back to the caller
        async done() {
            alert('image upload : ' + this.imageData.length + ' ' + this.croppedImgSrc.length)
            //this.$emit('done', this.croppedImgSrc)
            this.$emit('done', this.fileObj)
            this.showIt = false
            // axios({ method: "POST", "url": API_IMAGE_ENDPOINT, "data": this.imageData})
            //         .then(response => {
            //             this.response = response.data;
            //          })
        },
        // playWithBlob() {
        //     // create Blob from a string
        //     let blob1 = new Blob(["<html>..stuff..</html>"], {type: 'text/html'});
        //     // please note: the first argument must be an array [...]
        //     // create Blob from a typed array and strings
        //     let hello = new Uint8Array([72, 101, 108, 108, 111]); // "Hello" in binary form
        //     let blob2 = new Blob([hello, ' ', 'world'], {type: 'text/plain'})
        //     /*
        //     blob2.slice([byteStart], [byteEnd], [contentType]);
        //        byteStart – the starting byte, by default 0.
        //        byteEnd – the last byte (exclusive, by default till the end).
        //        contentType – the type of the new blob, by default the same as the source.
        //     */

        //     clog('play with blob', blob1, blob2, hello)
        // },
    },
    mounted() {

    },
    watch:{
        showIt() {
            if (this.showIt) {
               //ask user permission to show video.
               navigator.mediaDevices.getUserMedia(
               { video: {
                 minAspectRatio: 1.333,
                 minFrameRate: 60,
                 width: 1280,
                 heigth: 960
                }
               })
               .then(mediaStream => {
                    this.$refs.video.srcObject = mediaStream;
                    this.$refs.video.play()
                    this.mediaStream = mediaStream
               })
            }
        },
        imageData() {
           //prepare img for cropper
           if (this.imageData) this.convertToFileObj()
        },
        file() {
           // If he clicks on a file, we passed the file as fileobj, and activate cropper
           if (!this.file.type.includes("image/")) {
              this.cancelImage()
              alert("Please select an image file");
              return;
           }
           this.fileObj = this.file
           this.imageData = ''
           this.activateAvatarUpload = true
        }
    }
}
</script>

<style>
    .camera-stream {
        width: auto;
        max-height: 400px;
        max-width: 400px;
        object-fit: cover;
    }
</style>