<template>
  <div>
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
                      :initial-aspect-ratio="1"
                      :src="imgSrc"
                      preview=".preview"
                    />
                  </div>
                  <div class="actions mt-2">
                    <v-btn class="ma-1" small dark color="grey darken-3" @click.prevent="zoom(0.2)">
                      <v-icon> mdi-magnify-plus-outline</v-icon>
                    </v-btn>
                    <v-btn class="ma-1" small dark color="grey darken-3" @click.prevent="zoom(-0.2)">
                      <v-icon> mdi-magnify-minus-outline</v-icon>
                    </v-btn>
                    <v-btn class="ma-1" small dark color="grey darken-3" @click.prevent="rotate(90)">
                      <v-icon href="#">
                        mdi-axis-x-rotate-clockwise
                      </v-icon>
                    </v-btn>
                    <v-btn class="ma-1" small dark color="grey darken-3" @click.prevent="rotate(-90)">
                      <v-icon>
                        mdi-axis-x-rotate-counterclockwise
                      </v-icon>
                    </v-btn>
                    <v-btn class="ma-1" small dark color="grey darken-3" @click.prevent="move(10, 0)">
                      <v-icon>
                        mdi-arrow-left
                      </v-icon>
                    </v-btn>
                    <v-btn class="ma-1" small dark color="grey darken-3" @click.prevent="move(-10, 0)">
                      <v-icon>
                        mdi-arrow-right
                      </v-icon>
                    </v-btn>
                    <v-btn class="ma-1" small dark color="grey darken-3" @click.prevent="move(0, 10)">
                      <v-icon>
                        mdi-arrow-up
                      </v-icon>
                    </v-btn>
                    <v-btn class="ma-1" small dark color="grey darken-3" @click.prevent="move(0, -10)">
                      <v-icon>
                        mdi-arrow-down
                      </v-icon>
                    </v-btn>


                    <!--              <v-btn class="ma-1" small dark color="grey darken-3"  @click.prevent="cropImage">-->
                    <!--                <v-icon > mdi-crop</v-icon>-->
                    <!--              </v-btn>-->
                    <v-btn class="ma-1" small dark color="grey darken-3">
                      <v-icon @click.prevent="reset"> mdi-lock-reset</v-icon>
                    </v-btn>
                  </div>
                </section>
                <div class="text-right">
                  <v-btn small dark color="grey darken-3 mt-3" @click.prevent="submitImage">
                    <v-icon> mdi-send</v-icon>
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

export default {
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
      this.initialImageSetUp(value)
    }
  },
  mounted() {
    this.initialImageSetUp(this.image)
  },
  methods: {
    initialImageSetUp(value) {
      const self = this

      if (!value) {
        this.cropImg = ""
        this.$emit('close', true)
        return;
      }
      this.isAvatarUploadDialogOpen = true
      self.filename = value.name
      self.mimeType = value.type
      self.setImage(value)
    },
    async dataURLToFile(imageString, filename, mimeType) {
      const res = await fetch(imageString)
      const blob = await res.blob()
      return new File([blob], filename, { type: mimeType })
    },
    async submitImage() {
      await this.cropImage();
      const imageFileResponse = await this.dataURLToFile(this.cropImg, this.filename, this.mimeType)
      this.$emit('done', imageFileResponse)
      this.isAvatarUploadDialogOpen = false
    },
    setImage(file) {
      if (!file.type.includes("image/")) {
        alert("Please select an image file");
        return;
      }
      if (typeof FileReader === "function") {
        const reader = new FileReader();
        reader.onload = (event) => {
          this.imgSrc = event.target.result;
          // rebuild cropperjs with the updated source
          this.$refs.cropper.replace(event.target.result);
        };
        reader.readAsDataURL(file);
      } else {
        alert("Sorry, FileReader API not supported");
      }
    },
    cropImage() {
      // get image data for post processing, e.g. upload or setting image src
      this.cropImg = this.$refs.cropper.getCroppedCanvas().toDataURL();
    },
    // these are mostly called by controls and passed to real cropper
    getCropBoxData() {       this.data = JSON.stringify(this.$refs.cropper.getCropBoxData(), null, 4);    },
    getData() {              this.data = JSON.stringify(this.$refs.cropper.getData(), null, 4);    },
    move(offsetX, offsetY) { this.$refs.cropper.move(offsetX, offsetY);    },
    reset() {                this.$refs.cropper.reset();    },
    rotate(deg) {            this.$refs.cropper.rotate(deg);    },
    zoom(percent) {          this.$refs.cropper.relativeZoom(percent);    },
    setData() {              if (!this.data) return; this.$refs.cropper.setData(JSON.parse(this.data));    },
    setCropBoxData() {       if (!this.data) return; this.$refs.cropper.setCropBoxData(JSON.parse(this.data));  },
    // not used here at the moment
    showFileChooser() {
      this.$refs.input.click();
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