<template>
<!--
  https://github.com/fengyuanchen/cropperjs#getting-started
  https://agontuk.github.io/vue-cropperjs/
-->
  <div>
    <v-btn @click="showRefsCropper"> showRefs </v-btn>
    <div class="content">
      <v-dialog v-model="isAvatarUploadDialogOpen" persistent max-width="600">
        <v-card>
          <v-card-title class="headline"></v-card-title>

          <v-card-text>
            <v-row no-gutters>
              <v-col class="">
                <section class="cropper-area">
                  <div class="img-cropper">
                    <vue-cropper
                      ref="cropper"
                      :initial-aspect-ratio="9 / 16"
                      :src="imgSrc"
                      preview=".preview"
                    />
                  </div>
                  <div class="actions mt-2">
                    <v-btn class="ma-1" small dark color="grey darken-3" @click.prevent="zoom(0.2)"  title="zoom in">
                      <v-icon> mdi-magnify-plus-outline</v-icon>
                    </v-btn>
                    <v-btn class="ma-1" small dark color="grey darken-3" @click.prevent="zoom(-0.2)"  title="zoom out">
                      <v-icon> mdi-magnify-minus-outline</v-icon>
                    </v-btn>
                    <v-btn class="ma-1" small dark color="grey darken-3" @click.prevent="rotate(90)"  title="rotate">
                      <v-icon href="#">
                        mdi-axis-x-rotate-clockwise
                      </v-icon>
                    </v-btn>
                    <v-btn class="ma-1" small dark color="grey darken-3" @click.prevent="rotate(-90)"  title="rotate">
                      <v-icon>
                        mdi-axis-x-rotate-counterclockwise
                      </v-icon>
                    </v-btn>
                    <v-btn class="ma-1" small dark color="grey darken-3" @click.prevent="move(10, 0)"  title="move">
                      <v-icon>
                        mdi-arrow-left
                      </v-icon>
                    </v-btn>
                    <v-btn class="ma-1" small dark color="grey darken-3" @click.prevent="move(-10, 0)" title="move">
                      <v-icon>
                        mdi-arrow-right
                      </v-icon>
                    </v-btn>
                    <v-btn class="ma-1" small dark color="grey darken-3" @click.prevent="move(0, 10)"  title="move">
                      <v-icon>
                        mdi-arrow-up
                      </v-icon>
                    </v-btn>
                    <v-btn class="ma-1" small dark color="grey darken-3" @click.prevent="move(0, -10)"  title="move">
                      <v-icon>
                        mdi-arrow-down
                      </v-icon>
                    </v-btn>


                    <!--              <v-btn class="ma-1" small dark color="grey darken-3"  @click.prevent="cropImage">-->
                    <!--                <v-icon > mdi-crop</v-icon>-->
                    <!--              </v-btn>-->
                    <v-btn class="ma-1" small primary color="grey darken-3"  title="reset">
                      <v-icon @click.prevent="reset"> mdi-lock-reset</v-icon>
                    </v-btn>
                  </div>
                </section>
                <div class="text-right">
                  <v-btn small color="primary" class="mt-3" @click.prevent="F1submitImage"  title="submit">
                    <v-icon small> mdi-send</v-icon>
                    Submit
                  </v-btn>
                </div>


                <!--            <div class="mt-4">-->
                <!--              <v-btn small dark color="grey darken-3" @click.prevent="showFileChooser">-->
                <!--                <v-icon>-->
                <!--                  mdi-upload-->
                <!--                </v-icon>-->
                <!--                Upload Image-->
                <!--              </v-btn>-->
                <!--            </div>-->

                <!-- <textarea v-model="data" /> -->

              </v-col>

              <!--        <v-col cols="12" sm="6">-->
              <!--          <section class="preview-area">-->
              <!--            &lt;!&ndash;            <p>Preview</p>&ndash;&gt;-->
              <!--            <div class="preview"/>-->
              <!--            <div class="cropped-image">-->
              <!--              <img v-if="cropImg" :src="cropImg" alt="Cropped Image"/>-->
              <!--              <div v-else class="crop-placeholder"/>-->
              <!--            </div>-->
              <!--          </section>-->
              <!--        </v-col>-->
            </v-row>

          </v-card-text>
        </v-card>
      </v-dialog>

    </div>
  </div>
</template>

<script>
import VueCropper from "vue-cropperjs";
import "cropperjs/dist/cropper.css";
function clog(...args) {console.log('Cropping:' ,...args)}
const jpeg_Quality = 0.9
export default {
  name: "CropStart",
  components: {
    VueCropper,
  },
  props: {
    // eslint-disable-next-line vue/require-prop-types
    image: {
      required: true
    },

  },
  data() {
    return {
      imgSrc: "/assets/images/berserk.jpg",
      cropImg: "",
      data: null,
      filename: "",
      mimeType: "",
      isAvatarUploadDialogOpen: false,
    };
  },
  watch: {
    image(value) {
      this.Z1initialImageSetUp(value)
    }
  },
  mounted() {
    this.Z1initialImageSetUp(this.image)
  },
  methods: {
     showRefsCropper() {
        clog('show cropper refs', this.$refs.cropper)
     },
     checkCropperActive() {
         clog('Check If Cropper is online:', this.$refs.cropper)
         if(this.$refs.cropper === false) {
            window.setTimeout(this.checkCropperActive, 100); /* this checks the flag every 100 milliseconds*/
         } else {
           clog('cropper refs should be better?:', this.$refs.cropper, this.imgSrc)
           //this.$refs.cropper.replace(this.imgSrc);
           //this.$refs.cropper.src(this.imgSrc);
         }
     },
    Z1initialImageSetUp(value) {
      const self = this

      if (!value) {
        this.cropImg = ""
        this.$emit('close', true)
        return;
      }
    //   if (value.substr(0,10) == 'data:image') {
    //      alert('we have the correct image format already')
    //      this.isAvatarUploadDialogOpen = true
    //      this.imgSrc = value
    //      this.checkCropperActive()
    //      return
    //   }
      this.isAvatarUploadDialogOpen = true
      self.filename = value.name
      self.mimeType = value.type
      self.Z2setImage(value)
    },
    Z2setImage(file) {
      if (!file.type.includes("image/")) {
        alert("Please select an image file");
        return;
      }
      if (typeof FileReader === "function") {
        const reader = new FileReader();
        reader.onload = (event) => {
          this.imgSrc = event.target.result;
          clog('this.ImgSrc length after reader =', this.imgSrc.length)
          // rebuild cropperjs with the updated source
          this.$refs.cropper.replace(event.target.result);
        };
        reader.readAsDataURL(file);
      } else {
        alert("Sorry, FileReader API not supported");
      }
    },
    async F2dataURLToFile(imageString, filename, mimeType) {
      const res = await fetch(imageString);
      const blob = await res.blob();
      return new File([blob], filename+'.jpg', { type: mimeType });
    },
    async F1submitImage() {
      await this.cropImage();
      const imageFileResponse = await this.F2dataURLToFile(this.cropImg, this.filename, this.mimeType)
      this.$emit('done', imageFileResponse)
      clog('this.croppedImage after submit =', imageFileResponse)
      this.isAvatarUploadDialogOpen = false

    },
    cropImage() {
      // get image data for post processing, e.g. upload or setting image src
      this.cropImg = this.$refs.cropper.getCroppedCanvas().toDataURL("image/jpeg", jpeg_Quality)
    },
    // flipX() {
    //   const dom = this.$refs.flipX;
    //   let scale = dom.getAttribute("data-scale");
    //   scale = scale ? -scale : -1;
    //   this.$refs.cropper.scaleX(scale);
    //   dom.setAttribute("data-scale", scale);
    // },
    // flipY() {
    //   const dom = this.$refs.flipY;
    //   let scale = dom.getAttribute("data-scale");
    //   scale = scale ? -scale : -1;
    //   this.$refs.cropper.scaleY(scale);
    //   dom.setAttribute("data-scale", scale);
    // },
    getCropBoxData() {
      this.data = JSON.stringify(this.$refs.cropper.getCropBoxData(), null, 4);
    },
    getData() {
      this.data = JSON.stringify(this.$refs.cropper.getData(), null, 4);
    },
    move(offsetX, offsetY) {
      this.$refs.cropper.move(offsetX, offsetY);
    },
    reset() {
      this.$refs.cropper.reset();
    },
    rotate(deg) {
      this.$refs.cropper.rotate(deg);
    },
    setCropBoxData() {
      if (!this.data) return;

      this.$refs.cropper.setCropBoxData(JSON.parse(this.data));
    },
    setData() {
      if (!this.data) return;

      this.$refs.cropper.setData(JSON.parse(this.data));
    },

    showFileChooser() {
      this.$refs.input.click();
    },
    zoom(percent) {
      this.$refs.cropper.relativeZoom(percent);
    },
  },
};
</script>

<style>
input[type="file"] {
  display: none;
}

.cropped-image {
  padding: 0 .8rem;
}

.img-cropper {
  max-height: 400px;
  overflow: hidden;
}

</style>