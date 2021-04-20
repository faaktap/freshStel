<template>
<observer @on-change="onChange">
  <v-card class="mt-9 rounded" color="rgba(115, 250, 1, 0.1)">
   <v-card-title primary-title class="justify-center">
     <v-card color="rgb(15, 101, 8, 0.4)" class="rounded pa-3">
        <h1> {{ title }} </h1>
     </v-card>
   </v-card-title>
   <v-card-text class="pa-2 d-flex justify-center"> 
    <v-row>
     <v-col cols="12" md="6">
      <v-sheet class="pa-8 ma-4 rcorners1" xcolor="grey lighten-3" color="rgba(1, 2, 1, 0.1)" elevation="4">
           <v-img class="rcorners1 ml-10"
            :src="photoPath + photoNo"
            lazy-src="img/lazyload.png" max-width="320px" contain>
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
           <p v-html="changeHeading ? changeHeading : caption" 
              class="font-italic"
              :class="textheading" 
              ></p>
          </v-col>
         </v-row>
        </v-container>
      </v-sheet>      
     </v-col>
    </v-row>
   </v-card-text>
  </v-card>
</observer>
</template>


<script>
import Observer from 'vue-intersection-observer'
export default {
    name: "smartDisplay",
    components: {Observer},
    props: {title:String,
            photoPath:String,  //'https://kuiliesonline.co.za/api/candid/candidates.php?task=photo&type=trophy&studentno='
            photoNo:String,
            caption:String,
            soundbyte:String},
    data () {
      return {
        show:true,
        currentPanel:null,
        textheading: 'text-h4',
        changeHeading:null,
       } 
    },
    computed: {
    },
    methods: {
      checkSize() {
        if (this.changeHeading !== null) return

        if (this.caption.includes("<b>") ) {
          const testBold = new RegExp("<b>" + "(.*)" + "</b>")
          let answer = this.caption.match( testBold ) 
        
          let rest = this.caption.slice(answer[0].length)
          let name = this.caption.slice(0, answer[0].length-1)
          this.changeHeading = ` <span class="text-h3"> ${name} </span> <span class="text-h6"> ${rest} </span> `
          return ''

        } else {
         if (this.caption.length < 20) {
           return 'text-h3'
         }
         if (this.caption.length < 30) {
           return 'text-h4'
         }
        }
         return 'text-h5'
      },

        onChange(entry, unobserve) {
          // When this is executed, we are onscreen!
          // After loading Cancel monitoring, optimise performance
          //this.textheading = this.checkSize()
          if (entry.isIntersecting) {
            unobserve()
            this.checkSize()
            if (this.title.substr(0,3).toUpperCase() == 'HIG' ||
                this.title.substr(0,3).toUpperCase() == 'HOO') {
              let s = this.randomSound()
              this.$playSound(s,0.15)
              console.log('SmartPhoto - observer alert & play sound...', this.title , entry )
            }
          }
        },      
        randomSound(){
          let r = Math.floor(Math.random() * 4)
          if (r <= 1) return 'https://kuiliesonline.co.za/img/applause4.mp3'
          if (r == 2) return 'https://kuiliesonline.co.za/img/applause5.mp3'
          return 'https://kuiliesonline.co.za/img/applause2.mp3'
        },
    },
    watch: {
    },
    mounted: function() {
      console.log('SmartPhotoA : ')
      if (this.photoPath === undefined) {
        this.photoPath = null 
      }
      if (this.title.substring(1,7)  == 'HIGHEST') {
        alert('highest!')
      }
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