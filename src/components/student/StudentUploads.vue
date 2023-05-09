<template>
<!--
Carousel of all photos linked to student. (awards and school photos)
-->
   <v-card max-width="300" class="mx-auto" v-if="studentid" :color="color" elevation="2">

     <v-card-title> Photos </v-card-title>
     <v-card-text v-if="photoList.length">
           <v-sheet height="100%" tile>
            <v-row  class="fill-height"
                align="center"
                justify="center">
             <div v-for="(p,i) in photoList" :key="i">
              <v-img v-if="!p.model" :src="'https://kuiliesonline.co.za/' + p.photo" max-width="300" contain :title="p.type + ' ' +  p.photo" />

              <v-img v-else
                     @click="showUpload(i)"
                     :src="'https://kuiliesonline.co.za/' + p.model.imgUpload"
                     max-width="300" contain
                     :title="JSON.stringify(p.model)" />

             </div>
            </v-row>
           </v-sheet>
      </v-card-text>
      <v-card-text v-else>
        NO PHOTOS AVALIABLE
        {{ photoList }}
      </v-card-text>
     </v-card>

</template>
<script>
import { zmlFetch } from "@/api/zmlFetch";
export default {
    name:"StudentUploads",
    props: ['studentid','color'],
    data: () => ({
      photoList:[],
    }),
    methods:{
      showUpload(i)   {
        alert(JSON.stringify(this.photoList[i]))
      },
      getPhotos() {
          if (this.studentid) {
             this.photoList = []
             let sl = { task: 'plainSql'
                      , sql: 'select * from dkhs_photo where studentno = ' + this.studentid}
             zmlFetch(sl, this.processAfterFetch);
             sl = { task: 'plainSql'
                      , sql: 'select * from cr_upload where studentid = ' + this.studentid}
             zmlFetch(sl, this.processAfterCRUpload);
          }
      },
      processAfterFetch(response) {
          if (!response.error) {
            response.forEach(e => this.photoList.push(e))
            this.$emit('foundPhoto','https://kuiliesonline.co.za/' + response[0].photo)
          }
          this.$cs.l(this.$options.name, this.photoList)
      },
      processAfterCRUpload(response) {
        console.log(response)
        if (!response.error) {
             response.forEach(e => {
               e.model = JSON.parse(e.jdocstructure)
               this.photoList.push(e)
             })
        }
        this.$cs.l('2',this.$options.name, this.photoList)
      }
    },
    mounted() {
        this.$cs.l('mounted', this.$options.name, this.studentid)
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