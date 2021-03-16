<template>
<v-container fluid>

  <v-card class="mt-9 rounded" color="rgba(105, 199, 71, 0.3" v-show="show">
   <v-card-title primary-title class="justify-center">
     <v-card color="rgb(15, 101, 8, 0.4)" class="rounded koek1 pa-3">
        <div class="text-md-h4 font-weight-light wordbreak text-justify"> {{ title }} </div>
     </v-card>
   </v-card-title>
   <v-card-text> 
    <v-row justify-lg="center">
      <!--v-col cols="1"></v-col-->
      <v-col align="center" cols="12" md="6" lg="6">
        <v-card color="rgba(10, 19, 61, 0.5)">
         <v-container fill-height fluid >
          <v-row align="center" justify="center">
           <v-col >
             <p v-html="atext" class="text-lg-h6 font-weight-light wordbreak text-justify"></p>
            </v-col>
           </v-row>
          </v-container>
         </v-card>
         <!--v-divider v-if="$vuetify.breakpoint.mdAndUp"  vertical /-->
      </v-col>
       
      <v-col align="center" cols="12" md="6">
         
        <v-card color="rgba(15, 101, 8, 0.4)" class="rounded koek1 pa-3">
            <v-img src="https://kuiliesonline.co.za/img/CleanDKHS.png" height=100 contain></v-img><br>
          <div class="text-md-h4  d-xs-none d-sm-block wordbreak text-center"> {{ maintitle }} </div>
          
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
    name: "smartDisplay",
    components: {},
    props: {title:String, atext:String, maintitle:String},
    data () {
      return {
        show:true,
        currentPanel:null
       } 
    },
    methods: {
        sleep(ms) {
           console.log(ms);
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

</style>