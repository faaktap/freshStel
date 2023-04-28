<template>
<!--
Carousel of all photos linked to student. (awards and school photos)
-->
   <v-card max-width="300" class="mx-auto" v-if="studentid" :color="color" elevation="2">

     <v-card-title> Photos </v-card-title>
     <v-card-text v-if="photoList.length">
        <v-carousel
              :show-arrows="false"
              :hide-delimiter-background="false"
              >
          <v-carousel-item v-for="p in photoList" :key=p.uniqno>
           <v-sheet height="100%" tile>
            <v-row  class="fill-height"
                align="center"
                justify="center">
             <div>
              <img :src="'https://kuiliesonline.co.za/' + p.photo" max-width="300" contain :title="p.type + ' ' +  p.photo" >
             </div>
            </v-row>
           </v-sheet>
          </v-carousel-item>
          </v-carousel>
      </v-card-text>
      <v-card-text v-else>
        NO PHOTOS AVALIABLE
      </v-card-text>
     </v-card>

</template>
<script>
import { zmlFetch } from "@/api/zmlFetch";
export default {
    name:"StudentPhotoList",
    props: ['studentid','color'],
    data: () => ({
      photoList:[],
    }),
    methods:{
      getPhotos() {
          if (this.studentid) {
             let sl = { task: 'plainSql'
                      , sql: 'select * from dkhs_photo where studentno = ' + this.studentid}
             zmlFetch(sl, this.processAfterFetch);
          }
      },
      processAfterFetch(response) {
          if (!response.error) {
             this.photoList = response
             this.$emit('foundPhoto','https://kuiliesonline.co.za/' + response[0].photo)
          } else {
              this.photoList = []
          }
      }

    },
    mounted: function() {
        if (this.studentid) {
           this.getPhotos()
        }
    },
    watch: {
        studentid(n,o) {
            if (n != o) this.getPhotos()
        }
    }
}
</script>