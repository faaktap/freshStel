<template>
<!--
The idea is to create a button, that will show a dialog when pressed.
Eventually the text could be read from the database?
Like helptext.
But we want to show a form in this one...
-->
<v-btn :color="color"
       :icon="(iconName.length > 3 && buttonText.length == 0) ? true : false"
       @click="show=!show"
       :title="header"
       :hidden="show"
       small
>
 <v-icon v-if="iconName.length > 3">
   {{ iconName }}
 </v-icon>
    {{ buttonText }}
    <v-dialog v-model="show"
             :max-width="maxWidth"
              width="600"
              max-height="500"
              xstyle="position:relative"
             :fullscreen="$vuetify.breakpoint.smAndDown || expand"
    >
     <v-card :max-width="maxWidth"
             :class="formTop"
             ref="vcard"
     >
      <v-toolbar dense
                 height="35px"
                 max-height="40px"
                 flat
                 color="#F1F3F4"
                 outlined tile
      >
          <v-btn icon
                 x-small
                 @click="expand = !expand"
          >
            <v-icon v-if="expand">
              mdi-arrow-collapse
            </v-icon>
            <v-icon v-if="!expand">
              mdi-drag-horizontal-variant
            </v-icon>
          </v-btn>
          <span v-if="cHeight"> {{ cHeight }} </span>,<span v-if="cWidth"> {{ cWidth }} </span>,<span> {{ expand }} {{ formSpace }} </span>
          <v-spacer/>
          <v-btn icon
                 x-small
                 @click="show=false"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
      </v-toolbar>

      <v-card-title :style="formSpace">
        <slot name="header">
          {{ header }}
        </slot>
      </v-card-title>
      <v-card-text :style="formSpace" >
        <slot name="info">
          {{ info }}
        </slot>
      </v-card-text>
      <v-card-actions :style="formSpace">
        <slot name="actions"></slot>
      </v-card-actions>
     </v-card>
    </v-dialog>
</v-btn>
</template>

<script>
export default {
    name:"BaseDialog",
    props:{
        buttonText:{type:String, default:'pressme'},
        iconName:{type:String, default:''},
        info:{type:String, default:'Please supply some text'},
        header:{type:String, default:'Please supply a title'},
        color:{type: String, default: ''},
        maxWidth:{default:900}
    },
    data: () => ({
     show:false,
     expand: false,
     cHeight: 0,
     cWidth: 0,
     paddingRight: '120px',
     imageRatio: 0.439
    }),
    methods:{
      test() {
        const element = document.getElementById("bdid")
        let text = "clientHeight: " + element.clientHeight + "px<br>"
        text += "clientWidth: " + element.clientWidth + "px"
        alert(text)
      },
      myResizeHandler() {
         if ('vcard' in this.$refs && '$el' in this.$refs.vcard) {
            this.cHeight = this.$refs.vcard.$el.clientHeight
            this.cWidth = this.$refs.vcard.$el.clientWidth
            console.log('Here we should fix our styling for formSpace - padding-right?')
         }
      }
    },
    computed:{
      formTop() {
        return this.$vuetify.breakpoint.mdAndUp ? 'thebox' : ''
      },
      formSpace() {
        let paddingRight = this.paddingRight
        if ('vcard' in this.$refs && '$el' in this.$refs.vcard) {
           // recalculate padding
           paddingRight = Number( (this.$refs.vcard.$el.clientHeight * this.imageRatio).toFixed(0) ) + 40
           paddingRight = paddingRight + 'px'
        }
        console.log('formspace:', this.cWidth, paddingRight)
        return this.$vuetify.breakpoint.mdAndUp || this.expand ? 'padding-right: ' + paddingRight : ''
      }
    },
    activated() {
      this.myResizeHandler()
    },
    created() {
       window.addEventListener("resize", this.myResizeHandler);
    },
    destroyed() {
      window.removeEventListener("resize", this.myResizeHandler);
    },
    watch: {
      expand() {
        this.myResizeHandler()
      },
      show() {
        if (this.show == true) {
          console.log(this.$options.name,this.show,  this.$refs)
          this.$nextTick(function () {
            this.myResizeHandler()
            console.log(this.$options.name,'after next tick',  this.$refs)
          })
        }
      }
    }
}
</script>

<style scoped>
div.thebox
{
  box-sizing: border-box;
  padding-right: 5px;
  background-image: url('~@/assets/Rect-Gray-Equality.svg');
  background-size: contain;
  background-repeat: no-repeat;
  background-origin: content-box;
  background-position: right;
}
</style>