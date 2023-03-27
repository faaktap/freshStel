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
   <span v-if="!iconName || !$vuetify.breakpoint.smAndDown"> {{ buttonText }} </span>
    <v-dialog v-model="show"
             :max-width="localMaxWidth"
              width="auto"
              max-height="500"
              style="position:relative"
             :fullscreen="$vuetify.breakpoint.smAndDown || expand"
    >
     <v-card :max-width="localMaxWidth"
             :class="formTop"
             ref="vcard"
     >
      <v-toolbar dense
                 height="35px"
                 max-height="40px"
                 flat
                 color="smalltoolbargray"
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
          <v-spacer/>
          {{ formTop }}
         <!-- We can use the + nad - to allow user to make dialog bigger and smaller
          {{ formTop }} {{ formSpace }} - {{ localMaxWidth }}
          <v-btn icon
                 x-small
                 @click="localMaxWidth -= 12"
          >
            <v-icon>mdi-minus</v-icon>
          </v-btn>
          <v-btn icon
                 x-small
                 @click="localMaxWidth += 12"
          >
            <v-icon>mdi-plus</v-icon>
          </v-btn> -->

          <v-btn icon
                 x-small
                 @click="show=false"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
      </v-toolbar>

      <v-card-title :style="formSpace">
        <slot name="header">
          {{ header }} {{ formTop }}
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
        maxWidth:{default:900},
        paddingRight:{type: String,default:'120px'}
    },
    data: () => ({
     show:false,
     expand: false,
     localMaxWidth: 900,
     images:['Rect-Gray-Respect.svg','Rect-Gray-DKHSLogo.svg','Rect-Gray-Integrity.svg','Rect-Gray-KlasGee.svg','Rect-Gray-StudentRead.svg',
             'Rect-Gray-StudentComputerHome.svg','Rect-Gray-BlueStudentWithLaptop.svg','Rect-Gray-WIFI.svg','Rect-Gray-Stats.svg','Rect-Gray-Hiking.svg',
             'Rect-Gray-Message.svg','Rect-Gray-CalendarAdd.svg','Rect-Gray-USB.svg','Rect-Gray-Internet.svg','Rect-Gray-Equality.svg',
             'Rect-Gray-AttendanceHandInLug.svg'],
    }),
    methods:{
      test() {
        const element = document.getElementById("bdid")
        let text = "clientHeight: " + element.clientHeight + "px<br>"
        text += "clientWidth: " + element.clientWidth + "px"
        alert(text)
      },
    },
    computed:{
     formTop() {
  //       let thebox =   `box-sizing: border-box;
  // padding-right: 5px;
  // background-image: url('~@/assets/${this.imageUrl}');
  // background-size: 120px auto;
  // background-repeat: repeat-y;
  // background-attachment: scroll, local;
  // background-origin: content-box;
  // background-position: top right;`
        let thebox = 'thebox' + Math.floor(Math.random() * 5)
        return this.$vuetify.breakpoint.mdAndUp ? thebox : ''
      },
      formSpace() {
        //if (this.expand) return ''
        return this.$vuetify.breakpoint.mdAndUp  ? 'padding-right: ' + this.paddingRight : ''
      }
    },
    mounted() {
      this.localMaxWidth = this.MaxWidth || 600
      this.$cs.l('bd',' mounted', this.localMaxWidth, this.formTop)
    },
    activated() {
      this.$cs.l('bd',' activated', this.localMaxWidth, this.formTop)
    },
    created() {
      this.$cs.l('bd',' created', this.localMaxWidth, this.formTop)
    },
    destroyed() {
      this.$cs.l('bd',' destryed', this.localMaxWidth, this.formTop)
    },
    watch: {
      show() {
        this.$cs.l('bd','show',this.formTop)
      }
    }
}
</script>

<style scoped>
div.thebox0
{
  fill: currentColor;
  box-sizing: border-box;
  padding-right: 5px;
  /* background-image: url('~@/assets/Rect-Gray-Equality.svg'); */
  /* background-image: url('~@/assets/Rect-Gray-KlasGee.svg'); */
  background-image: url('https://kuiliesonline.co.za/img/upload/Rect-Gray-Equality.svg');
  background-size: 120px auto;
  background-repeat: repeat-y;
  background-attachment: scroll, local;
  background-origin: content-box;
  background-position: top right;
}
div.thebox1
{
  fill: currentColor;
  box-sizing: border-box;
  padding-right: 5px;
  background-image: url('https://kuiliesonline.co.za/img/upload/Rect-Gray-AttendanceHandInLug.svg');
  /* background-image: var(--url1); */
  background-size: 120px auto;
  background-repeat: repeat-y;
  background-attachment: scroll, local;
  background-origin: content-box;
  background-position: top right;
}
div.thebox2
{
  box-sizing: border-box;
  padding-right: 5px;
  background-image: url('https://kuiliesonline.co.za/img/upload/Rect-Gray-Integrity.svg');
  background-size: 120px auto;
  background-repeat: repeat-y;
  background-attachment: scroll, local;
  background-origin: content-box;
  background-position: top right;
}
div.thebox3
{
  box-sizing: border-box;
  padding-right: 5px;
  background-image: url('https://kuiliesonline.co.za/img/upload/Rect-Gray-KlasGee.svg');
  background-size: 120px auto;
  background-repeat: repeat-y;
  background-attachment: scroll, local;
  background-origin: content-box;
  background-position: top right;
}
div.thebox4
{
  box-sizing: border-box;
  padding-right: 5px;
  background-image: url('https://kuiliesonline.co.za/img/upload/Rect-Gray-Message.svg');
  background-size: 120px auto;
  background-repeat: repeat-y;
  background-attachment: scroll, local;
  background-origin: content-box;
  background-position: top right;
}
div.thebox5
{
  box-sizing: border-box;
  padding-right: 5px;
  background-image: url('https://kuiliesonline.co.za/img/upload/Rect-Gray-BlueStudentWithLaptop.svg');
  background-size: 120px auto;
  background-repeat: repeat-y;
  background-attachment: scroll, local;
  background-origin: content-box;
  background-position: top right;
}
</style>