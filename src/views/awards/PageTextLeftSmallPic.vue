<template>
<v-container fluid>
  <v-card class="mt-9 rounded" color="rgba(105, 199, 71, 0.3" v-show="show">
   <v-card-title primary-title class="justify-center">
     <v-card color="rgb(15, 101, 8, 0.4)" class="rounded koek1 pa-3">
        <div class="text-md-h4 font-weight-light wordbreak text-justify text--white"> 
          {{ title }} 
        </div>
     </v-card>
   </v-card-title>

   <v-card-text > 
    <v-row justify-lg="center">
      <v-col align="center" cols="12" md="6" lg="6">
        <v-card color="rgba(10, 19, 61, 0.5)" class="pa-sm-0 pa-lg-4 ma-sm-0 ma-lg-4">
                
         <v-container fill-height fluid 
                      class="d-flex flex-row align-center mb-6">
             <p v-html="lefttext" class="text-lg-h6 text-sm-caption font-weight-light wordbreak text-justify pa-sm-0 pa-lg-2 ma-sm-0 ma-lg-3">

             </p>

          </v-container>
         </v-card>
         <v-divider v-if="$vuetify.breakpoint.mdAndUp"  vertical />
      </v-col>
       
      <v-col align="center" cols="12" md="6">
         
        <v-card color="rgba(15, 101, 8, 0.4)" class="rounded koek1 pa-3">
            <v-img color="rgba(15, 101, 8, 0.9)" 
                   elevation="4" 
                  :src="image" 
                   class="swivelImage ma-3"
                   :max-height="imageHeight"
                   contain>
            </v-img>
            <br>
          <div class="text-md-h4  d-xs-none d-sm-block wordbreak text-center" v-html="maintitle">  </div>
          
        </v-card>
         
      </v-col>
      <!--v-col cols="1"></v-col-->
    </v-row>
    </v-card-text>
  </v-card>
</v-container>
</template>


<script>
export default {
    name: "pagetextleft",
    components: {},
    props: {title:String
          , lefttext:String
          , maintitle: {type:String, default:"Prysuitdeling / Prizegiving"}
          , image: {type:String, default:"https://www.kuiliesonline.co.za/img/CleanDKHS.png"}
          },
    data () {
      return {
        show:true,
        currentPanel:null
       } 
    },
    computed: {
       imageHeight () {
        switch (this.$vuetify.breakpoint.name) {
          case 'xs': return '150'
          case 'sm': return '200'
          case 'md': return '500'
          case 'lg': return '500'
          case 'xl': return '500'
        }
        return '550'
      },      
    },
    methods: {
        sleep(ms) {
           return new Promise(resolve => setTimeout(resolve, ms));
        },
    },
    watch: {
    }
}
</script>

<style scoped>
.rounded{
    border-radius:50px;
}

.koek1 { font-family: 'Noto Sans JP', sans-serif;}
.koek {font-family: 'Dancing Script', cursive;}
.wordbreak {
  overflow-wrap: break-word;
  word-wrap: break-word;
  word-break: break-all;
  word-break: break-word;
  hyphens: auto;
}

.v-carousel .v-window-item {
  position: absolute;
  top: 0;
  width: 100%;
}

.swivelImage {
  transform: rotateY(360deg);
  animation: turn 1.5s ease-out forwards 1s;
}

@keyframes turn {
  100% {
    transform: rotateY(0deg);
  }
}
</style>