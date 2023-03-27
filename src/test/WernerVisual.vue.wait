<template>
<div>


  <v-btn @click="$emit('close')"> Close </v-btn>




<z-form-base :mySchema="mySchema2" @done="play" />


<!-- --------------------------------------------------------------- -->

<base-dialog class="ma-2"
             iconName="mdi-printer"
             buttonText="ButtonDialog1"
             info="this is the body of the card and coild ne quite long, then we put it in a template."
             header="This is a Heading"
             paddingRight="130px"
>
</base-dialog>

<base-dialog class="ma-2"
             iconName="mdi-kettle"
             buttonText="ButtonDialog2"
             paddingRight="130px"
>
 <template v-slot:header>
  This is a heading
 </template>
 <template v-slot:info>
  <z-form-base :mySchema="mySchema1" />
  </template>
 <template v-slot:actions>
 <v-btn small> btn </v-btn> <v-spacer/> <v-btn small > Close </v-btn></template>
</base-dialog>


</div>
</template>

<script>
import BaseDialog from '@/components/base/BaseDialog.vue'
import ZFormBase from '@/test/ZFormBase.vue'
export default {
    name:"WernerTest",
    components:{
        BaseDialog
      , ZFormBase
    },
    data: () => ({
        showForm:false,
        mySchema1: {},
        mySchema2: {}
    }),
    computed:{},
    methods:{
      play(msg) {
        console.log('play: ' + JSON.stringify(msg))
      },
    },
    mounted() {
      console.log(this.$vuetify)
      console.log(this.$vuetify.breakpoint.md)
      console.log(this.$vuetify.breakpoint.lg)
      console.log(this.$vuetify.breakpoint.height)
      console.log(this.$vuetify.breakpoint.width)
      this.mySchema2 = {
           email: { type: 'email'
              , label: 'Parent/Guardian Email'
              , prependInnerIcon:"mdi-email"
              , tooltip: "Parent or guardian's email address."
              , hint:'email'
           },
           subject: { type: 'text'
              , label: 'Email Subject'
              , prependInnerIcon:"mdi-yoga"
              , readonly:false
              , tooltip: 'Email Subject'
            },
            someField:{ type: 'text'
              , label: 'someField'
              , appendIcon:"mdi-kabaddi"
              , hint:"kababdi..."},
            otherField:{ type: 'text'
               , label: 'This is the label for some other field'
            },
            other1Field:{type: 'text'
               , prependInnerIcon:"mdi-wikipedia"
               , class:'pa-2 elevation-4'
            },
      }
       this.mySchema1 = {
           email: { type: 'email'
              , label: 'Parent/Guardian Email'
              , prependInnerIcon:"mdi-email"
              , tooltip: "Parent or guardian's email address."
              , hint:'email'
           },
           subject: { type: 'text'
              , label: 'Email Subject'
              , prependInnerIcon:"mdi-yoga"
              , readonly:false
              , tooltip: 'Email Subject'
            },
            someField:{ type: 'text'
              , label: 'someField'
              , appendIcon:"mdi-kabaddi"
              , hint:"kababdi..."},
            otherField:{ type: 'text'
               , label: 'This is the label for some other field'
            },
            other1Field:{type: 'text'
               , prependInnerIcon:"mdi-wikipedia"
               , class:'pa-2 elevation-4'
            },
            teach:{ type: 'autocomplete'
               , label: 'AutoComplete'
               , prependInnerIcon:'mdi-wiper'
               , items:['piet','koos']
               , class:'pa-2 rounded'
            },
            name1:{ type: 'text', prependInnerIcon:'mdi-wind-turbine'  },
            name2:{ type: 'text', prependInnerIcon:'mdi-weight-kilogram'  },
            name3:{ type: 'text', prependInnerIcon:'mdi-web-clock'  },
            name4:{ type: 'text', prependInnerIcon:'mdi-weather-windy'  },
            name5:{ type: 'text', prependInnerIcon:'mdi-water-polo'  },
            name6:{ type: 'text', prependInnerIcon:'mdi-wallpaper'  },
            }
       let icons = this.$vuetify.icons
       console.log(icons)
      //  icons.values.forEach(e => {
      //    console.log(e)
      //  });
    }

}
</script>
<style scoped>

.cardbg{
      width: 200px;
      display: block;
      background-color: #808;
      background-image: url( '/assets/Rect-Gray-Equality.svg');
      /*   url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='100%25' viewBox='0 0 1600 800'%3E%3Cg %3E%3Cpolygon fill='%23740074' points='1600 160 0 460 0 350 1600 50'/%3E%3Cpolygon fill='%235f005f' points='1600 260 0 560 0 450 1600 150'/%3E%3Cpolygon fill='%234b004b' points='1600 360 0 660 0 550 1600 250'/%3E%3Cpolygon fill='%23360036' points='1600 460 0 760 0 650 1600 350'/%3E%3Cpolygon fill='%23220022' points='1600 800 0 800 0 750 1600 450'/%3E%3C/g%3E%3C/svg%3E"); */
      background-repeat: no-repeat;
      background-size: cover;
      background-position: bottom center, 50%, 50%;
   }
.dotted-line {
    background-image: linear-gradient(
      to right,
      black 33%,
      rgba(255, 255, 255, 0) 0%
    );
    background-position: bottom;
    background-size: 3px 1px;
    background-repeat: repeat-x;
  }
.right-side-line {
    background-image: linear-gradient(
      to right,
      black 33%,
      rgba(255, 255, 255, 0) 0%
    );
    background-position: right;
    background-size: 3px 1px;
    background-repeat: repeat-y;
  }
.left-side-line {
    background-image: linear-gradient(
      to right,
      black 33%,
      rgba(255, 255, 255, 0) 0%
    );
    background-position: left;
    background-size: 3px 1px;
    background-repeat: repeat-y;
  }

.side-image {
    background-image: url( '~@/assets/GreenStripe.svg');
    background-position: right;

    background-repeat: none;
  }
.x-lines {
  border-top: 1px blue;
  border-left: 1px blue;
}

.zcontainer {
  display: flex;
  }
.red {
  background: orangered;
  display: flex;
  flex-direction: column;
}
.green {
  background: yellowgreen;
  display: flex;
  flex-direction: row; /* we don't need this - it is default */

}
.blue {
  background: steelblue;
}
.zcontainer div {
  flex: 1;
  padding: 5px;
}
</style>
