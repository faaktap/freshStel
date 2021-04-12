<template>
  <v-card class="mt-9 rounded" color="rgba(115, 250, 1, 0.1)">
   <v-card-title primary-title class="justify-center">
     <v-card color="rgb(15, 101, 8, 0.4)" class="rounded pa-3">
        <h1> {{ title }} </h1>
     </v-card>
   </v-card-title>
   <v-card-text class="pa-2 d-flex justify-center"> 
    <v-row>
     <v-col cols="12" md="6">
      <v-sheet class="pa-8 rcorners1" xcolor="grey lighten-3" color="rgba(1, 2, 1, 0.1)" elevation="4">
           <v-img class="rcorners1"
            :src="photoPath + photoNo"
            lazy-src="img/lazyload.png" max-width="340px" contain>
              <template v-slot:placeholder>
               <v-row class="fill-height ma-0"
                      align="center"
                      justify="center">
               <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
              </v-row>
             </template>             
           </v-img>
      </v-sheet>      
      <!--v-divider v-if="$vuetify.breakpoint.mdAndUp" class="mx-4" vertical /-->
     </v-col>
     <v-col cols="12" md="6">
      <v-sheet class="pa-8 rcorners1" xcolor="grey lighten-3" color="rgba(1, 2, 1, 0.1)" elevation="4">
        <v-container fill-height fluid>
         <v-row align="center" justify="center">
          <v-col>
           <p v-html="caption" 
              class="font-italic"
              :class="sizeCaption" 
              ></p>
          </v-col>
         </v-row>
        </v-container>
      </v-sheet>      
     </v-col>
    </v-row>
   </v-card-text>
  </v-card>
</template>


<script>
export default {
    name: "smartDisplay",
    components: {},
    props: {title:String,
            photoPath:String,  //'https://kuiliesonline.co.za/api/candid/candidates.php?task=photo&type=trophy&studentno='
            photoNo:String,
            caption:String},
    data () {
      return {
        show:true,
        currentPanel:null
       } 
    },
    computed: {
      sizeCaption() {
         if (this.caption.length < 20) {
           return 'text-h3'
         }
         if (this.caption.length < 30) {
           return 'text-h4'
         }
         return 'text-h5'
      }
    },
    methods: {
        sleep(ms) {
           console.log(ms);
           return new Promise(resolve => setTimeout(resolve, ms));
        },
    },
    watch: {
    },
    mounted: function() {
      if (this.photoPath === undefined) this.photoPath = null

      console.log('SmartPhoto : ', this.photoPath + this.photoNo)

    }
}
</script>

<style scoped>
.rounded{
    border-radius:50px;
}
.rcorners1 {
  border-radius: 55px;
  xpadding: 20px;
}

.koek1 { font-family: 'Noto Sans JP', sans-serif;}
.koek {font-family: 'Dancing Script', cursive;}
.slide-fade-enter-active {
  transition: all 3s ease;
}
.fade-enter-active,
.fade-leave-active {
  transition-duration: 3s;
  transition-property: opacity;
  transition-timing-function: ease;
}
.fade-enter, 
.fade-enter-active {
  transition: all 3s ease;
}

.v-carousel .v-window-item {
  position: absolute;
  top: 0;
  width: 100%;
}
</style>