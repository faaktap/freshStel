<template>
  <v-container v-if="studentList && photoList">
   <v-row><v-col col="12">
    <v-card max-width="400" class="mx-auto">
     <v-container>
      <v-row dense>
       <v-col cols="12">
         <v-card>
           <div class="d-flex flex-wrap justify-space-between">
            <v-carousel
              show-arrows
              hide-delimiter-background
              xheight="200"
            >
             <v-carousel-item
                v-for="p in photoList" :key=p.uniqno> 
              <v-sheet
                  height="100%"
                  tile
              >
               <v-row
                class="fill-height"
                align="center"
                justify="center"
               >
               <div class="display-3">
                 <img :src="'https://kuiliesonline.co.za/' + p.photo" 
                        width="200" 
                       :title="p.type + ' ' +  p.photo" >
                </div>
               </v-row>
              </v-sheet>
             </v-carousel-item>
            </v-carousel>
           </div>
         </v-card>
        </v-col>
       </v-row>
      </v-container>
    </v-card>
   </v-col></v-row>
  </v-container>   
</template>
<script>
import { zmlFetch } from "@/api/zmlFetch";
export default {
    name:"StudentPhotoList",
    props: ['studentList'],
    data: () => ({
      photoList:null,
    }),
    methods:{
      getPhotos() {
        let sl = { task: 'plainSql'
                 , sql: 'select * from dkhs_photo where studentno = ' + this.studentList.data.studentid}
        zmlFetch(sl, this.processAfterFetch); 
      },
      processAfterFetch(response) {
          console.log(response)
          if (!response.error) {
             this.photoList = response
          } else {
              this.photoList = null
          }
      }

    },
    mounted: function() {
        console.log('SPL : Mount')
        if (this.studentList) {
           console.log('SNC : ', this.studentList.data.studentid)
           this.getPhotos()
        } else {
           console.log('SNC : NoName')
        }
    },
    watch: {
        studentList(n,o) {
            if (n != o) this.getPhotos()
        }
    }
}
</script>