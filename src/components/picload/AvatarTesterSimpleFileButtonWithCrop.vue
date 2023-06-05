<template>
  <div>
    <v-container>
      <v-file-input
        v-model="avatarImage"
        label="File input"
      ></v-file-input>
      <crop-start :image="avatarImage" @done="(image) => form.image=image"/>
        <v-btn @click="showData"> showData </v-btn>
    </v-container>
  </div>
</template>


//we can try : var url = canvas.toDataURL();

<script>
import CropStart from "@/components/picload/CropStart.vue";

export default {
  components: {
    CropStart
  },
  data: () => ({
      avatarImage: null,
      form: {
        image: null
      }
  }),
  methods: {
    showData() {
      //console.log('data',this.form.image.reduce( (accum,item) => accum + item.size,0))
      console.log('value form.image is :', this.form.image)
    }
  }
}
</script>

<style scoped></style>