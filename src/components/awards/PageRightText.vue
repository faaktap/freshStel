<template>
<!-- TYPE = 4 -->
<observer @on-change="onChange">
  <v-card class="mt-9 rounded" color="rgba(115, 250, 1, 0.1)" style="height: 100vh">
   <v-card-title primary-title class="justify-center">
     <v-card color="rgb(15, 101, 8, 0.8)" class="rounded pa-3 white--text">
        <h1> {{ title }} </h1>
     </v-card>
   </v-card-title>
   <v-card-text class="pa-2 d-flex justify-center">
    <v-row>
     <v-col cols="12" md="6">
      <v-sheet class="pa-sm-1 pa-md-8 ma-sm-1  ma-md-4 rcorners1" xcolor="grey lighten-3" color="rgba(1, 2, 1, 0.1)" elevation="4">

           <v-img class="rcorners1 ml-10 rounded-circle"
            :src="image"
            lazy-src="img/lazyload.png"
            max-width="562"
            :max-height="imageHeight"
            contain>

           </v-img>

      </v-sheet>
      <!--v-divider v-if="$vuetify.breakpoint.mdAndUp" class="mx-4" vertical /-->
     </v-col>
     <v-col cols="12" md="6" flex class="justify-content: center;align-items: center;">
      <template v-if="righttext.length < 50"> <br><br> </template>
      <v-sheet class="pa-sm-1 pa-md-8 rcorners1"
               color="rgba(1, 2, 1, 0.4)" elevation="4">

        <v-container fill-height fluid>
              <!-- {{ textheading}}             -->
           <p v-html="changeHeading ? changeHeading : righttext"
              class="font-italic white--text"
              :class="textheading"
              ></p>
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
            image:String,  //'https://kuiliesonline.co.za/api/candid/candidates.php?task=photo&type=trophy&studentno='
            righttext:String,
            soundbyte:String},
    data () {
      return {
        show:true,
        currentPanel:null,
        textheading: 'text-md-h4 text-sm-h6',
        changeHeading:null,
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
      checkSize() {
        if (this.changeHeading !== null) return

        if (this.righttext.includes("<b>") ) {
          const testBold = new RegExp("<b>" + "(.*)" + "</b>")
          let answer = this.righttext.match( testBold )

          let rest = this.righttext.slice(answer[0].length)
          let name = this.righttext.slice(0, answer[0].length-1)
          this.changeHeading = ` <span class="text-md-h3 text-sm-h6"> ${name} </span> <span class="text-md-h6 text-sm-body-1"> ${rest} </span> `
          return ''

        } else {
         if (this.righttext.length < 20) {
           return 'text-h3'
         }
         if (this.righttext.length < 30) {
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
      // if (this.image === undefined) {
      //   this.image = null
      // }
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