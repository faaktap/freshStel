<template>
 <v-container class="ma-0 pa-0">
    <v-btn class="ml-2 mb-1" small @click="showDone = !showDone"> <v-icon small> mdi-thumb-up</v-icon>    Done    </v-btn>
    <v-card class="ma-0 pa-0">
        <v-card-text  v-if="showDone == false">
         <v-layout row wrap align-content-center justify-space-around>
          <video v-if="!imageData.image" ref="video" class="camera-stream" />
          <v-img v-else :src="imageData.image" v-bind:style="{transform: 'rotate(' + imageData.image_orientation + 'deg'}" class="camera-stream" contain/>
         </v-layout>
        </v-card-text>
        <v-card-actions class="icon-group" v-if="showDone == false">
            <v-layout row wrap align-content-center justify-space-between>
            <v-btn class="ml-2 mb-1" small @click="captureImage" color="primary"><v-icon small>mdi-camera</v-icon>       Snap </v-btn>
            <v-btn class="ml-2 mb-1" small @click="rotateImage"> <v-icon small>mdi-rotate-right</v-icon> Rotate  </v-btn>
            <v-btn class="ml-2 mb-1" small @click="showDone = true"> <v-icon small> mdi-thumb-up</v-icon>    Done    </v-btn>
            <v-btn class="ml-2 mb-1" small @click="cancelImage" color="warning"> <v-icon small>mdi-cancel</v-icon>       Cancel  </v-btn>
            </v-layout>
        </v-card-actions>
        <v-card-text v-if="showDone" width="90%">
            schema {{ schema }} objkeys {{ Object.keys(schema) }}
          <typical-edit-form
             v-if="schema && Object.keys(schema).length > 0"
             :model="currentRecord.model"
             :schema="schema"
             :col=12
             @click="getData"
             @blur="getData"
             @done="showDone=false"
             :closeButton="false"
          >
          </typical-edit-form>
        </v-card-text>
        <v-card-text class="text-center">
         <v-layout row wrap align-content-center justify-space-around>
          <v-img v-if="!imageData.image" class="camera-stream" src="/img/learner.png" contain />
          <v-img v-else :src="imageData.image" class="camera-stream" contain  />
         </v-layout>
        </v-card-text>

    </v-card>
 </v-container>


</template>

<script>
import TypicalEditForm from "@/components/vfbase/TypicalEditForm.vue"
import { studentUploadSchema} from "@/api/faqFormSchema.js";
export default {
    name: "CameraButton",
    data() {
        return {
            defaultImage: '/img/learner.png',
            mediaStream: null,
            imageData: {
                image: '',
                image_orientation: 0,
            },
            showDone:false,
            currentRecord: {},
            schema: {},
        }
    },
    components: {
        TypicalEditForm
      //, VBack
    },

    methods: {
        captureImage() {
            const mediaStreamTrack = this.mediaStream.getVideoTracks()[0]
            const imageCapture = new window.ImageCapture(mediaStreamTrack)
            let reader = new FileReader();
            return imageCapture.takePhoto().then(blob => {
                reader.readAsDataURL(blob)
                reader.onload = () => {
                    this.imageData.image = reader.result;
                }
            })
        },
        rotateImage() {
            this.imageData.image_orientation = this.imageData.image_orientation + 90;
        },
        cancelImage() {
            this.imageData.image = null;
            this.showCameraModal = true;
            navigator.mediaDevices.getUserMedia({video: true})
            .then(mediaStream => {
                    this.$refs.video.srcObject = mediaStream;
                    this.$refs.video.play()
                    this.mediaStream = mediaStream
            })
        },
        uploadImage() {
            alert('image upload : ' + this.imageData.length)
            // axios({ method: "POST", "url": API_IMAGE_ENDPOINT, "data": this.imageData})
            //         .then(response => {
            //             this.response = response.data;
            //          })
        },
        addNewOne() {
          this.schema = studentUploadSchema
          this.currentRecord.model = {}
          this.currentRecord = {}
          this.currentRecord.id = 0
          this.currentRecord.model = {}
          this.currentRecord.model.name = '' //getters.getState({ object: "gZml" }).login.fullname
          this.currentRecord.model.imgUpload = this.imageData.image
        },
        getData(msg) {
          cl('Data we got back:',msg)
          this.currentRecord.model = msg

        },
    },
    mounted() {
        this.addNewOne()
        navigator.mediaDevices.getUserMedia({video: true})
            .then(mediaStream => {
                    this.$refs.video.srcObject = mediaStream;
                    this.$refs.video.play()
                    this.mediaStream = mediaStream
            })
    },
}
</script>

<style>
    .icon-group {
        display: flex;
        flex-direction: row;
        justify-content: space-evenly;
        margin: 12px auto;
    }
    .camera-icon {
        width: 15%;
        vertical-align: middle;
        margin: auto;
    }
    .camera-stream {
        margin: 120px 170px;
        width: 90%;
    }

</style>