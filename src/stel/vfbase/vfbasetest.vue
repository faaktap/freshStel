<template>
<div>
    <BaseBreakpointDisplay />

     <v-card color="blue" class="mx-6 pa-4">
       myschema length = {{  Object.keys(mySchema).length }}
        <v-form v-if="mySchema &&  Object.keys(mySchema).length > 1"
                class="border-frame" color="red"
        >
      <!-- FORM-BASE-COMPONENT -->
      <v-form-base
        id="myform"
        :model="myModel"
        :schema="mySchema"
        :col="{ cols:12, sm:8, md:6, lg:4 }"
        @input="log"
        @click="test"
        @blur="test"
      >
      <template #slot-top-myform>
          <v-card class="slot"><v-row>
           <v-col cols="12">
            Top Slot of 'Form'
           </v-col></v-row>
          </v-card>
      </template>
      <template #slot-bottom-myform>
          <v-row class="slot text-center"><v-col cols="12">
            Bottom Slot of 'Form'
          </v-col></v-row>
      </template>
      <!--
      <template #slot-top-key-myform-radioX="{obj,id,index}">
          <h4 class="slot">SlotreplacesItem with Key
             '{{obj.key}}'
            <div>Formbase: {{id}}</div>
            <div>Index: {{index}}</div>
            <div>Obj:{{obj}}</div>  {{ obj.key }}
          </h4>
      </template>
      <template #slot-top-key-myform-group1-name1>
          <p class="slot caption">This is a short summary about name1
          </p>
      </template>

      <template #slot-top-type-myform-group="{obj}">
          <h4 v-if="obj.key=='group1'" class="slot">
            Slot at Top of Type Group {{ obj.schema.label }}
          </h4>
          <h4 v-else class="slot">
            {{ obj }}
          </h4>
      </template>
      -->
      </v-form-base>
 <!--
        // compose listener to one or more of following Events:
        @focus= "log"
        @input= "log"
        @click= "log"
        @blur=  "log"
        @resize= "log"
        @intersect="log"      // intersect - https://vuetifyjs.com/en/directives/intersect
        @clickOutside= "log"  // clickOutside - https://vuetifyjs.com/en/directives/click-outside/
        @swipe=  "log"        // touch events
        @mouseleave="log"
        @mouseenter="log"
        @dragstart="dragstart"
        @dragover="dragover"
        @drop="drop"
      -->
</v-form>
     </v-card>
     <base-date v-model="myModel.custom4" label="my date label" />
     {{ myModel }}
</div>
</template>

<script>

import VFormBase from "@/components/vfbase/VFormBase"
import BaseBreakpointDisplay from "@/components/base/BaseBreakpointDisplay"

//part of schema
//const mask = '####-####-####-####'
const accept = 'image/*'
const options = ['A', 'B', 'Ccccccc']
const subject1 = ['Afrikaans HL', 'Afrikaans 2nd', 'Afrikaans 3rd']
export default {
  name: "vfbasetest",

  components: {BaseBreakpointDisplay
            , VFormBase
            },

  data: () => ({
    myModel: {
      radioX:null,
      radioS1:null,
      radioS2:null,
      name1:'Taleb',
      name2:'Taleb',
      custom4:'',
      check1:true,
          btnToggleSingle: ['B'],
          slider:33,
          radio: 'A',
          switch: true,
      name3: 'Base',
      password: 'abcdefgh',
      file: [], // array of File objects
      a1: false,
      a2: false,
    },
    /*
      SCHEMA
      Order of Props in Schema defines Order of Controls in Form
      Most controls are based on vuetify and therefore the properties of these controls can be used in

      schema:{ type:'text', hint:'myHint', prependIcon:'print'... }
      maps to <v-text-fields hint="myHint" prepend-icon="print" >
      -> https://vuetifyjs.com/en/components/text-fields/
    */
   mySchema: {
    top: { type:'group',
           color: "blue  lighten-4",
           title: "Top OF FORM - As group Declaered need to add a dummy",
           class: "text-center",
     schema:{
      dummy1:{type:'text',col: 12, class:"ma-2", hidden:true},
     },

    },
    names: {
      type:'wrap',
      label:'Names............................',
      class: "",
      color:"orange--text text--lighten-3 indigo lighten-4",
      col: { cols : 12, md: 6  , xl:4},
      title: "Name of wrapped Group (Ttitle)" ,
      subtitle: "Names (Subtitle) color?",
      ripple: false,
      tile: true,
     schema:{
      name1:{type:'text',col: { cols : 12, md: 6  }, class:"ma-2", label:'Firstname'},
      name2:{type:'text',col: { cols : 12, md: 6  }, class:"ma-2", label: "lastname"},
      custom4: { type: 'base-date'
               , label:'External - Component'
               , hint: "select a date"
               , tooltip: "select a date"
               , class:'ma-3 pa-4 grey lighten-3 caption' },
     },
    },
    top2: { type:'group',
           color: "blue  lighten-3",
           title: "Before the radio buttons and the range",
           class: "text-center",
           ripple:false,
     schema:{
    radioX: { type: 'radio'
            , spacer:true
            , label: 'RadioX'
            , options
            , row:true },
    radioS1: { type: 'radio'
             , label: 'Subject - Aligned in row'
             , options: ['Afr 1', 'Afri 2', 'Afrik 3'
                        ,'English Home L1'
                        ,'English Home L2'
                        ,'English Home L3' ]
             , col:12
             , row:true },
    range: { type: "number"
            ,ext: "range"
            ,label: "Range:25"
            ,outline:false
            ,rounded:true
            ,col: {cols:12, md:4}
            ,ripple:true,
   },
    radioS2: { type: 'radio'
             , label: 'Subject22'
             , options: subject1
             , col:12
             , md:6
             , row:false },
     },
    },
    group1: { type:'group'
            , title:'The long naaaame'
            , col:{cols:12, md:6}
            , ripple:false
            , color:"green orange--text text--darken-3"
            , class:'title pa-2 rounded elevation-4 text-h2',
     schema:{
              name1: { type: 'text',
                       label:'Naaaaaaame 1' ,
                       color:"green orange--text text--darken-3"
                     },
              check1: { type: 'checkbox',
                       label: 'Checkbox 1',
                       solo:true,
                       color: 'red' },
        controls: {
          btnToggleSingle: { type: 'btn-toggle',
                             options,
                             color:'purple',
                             multiple: false,
                             cols:12,
                             class:"col-md-6",
                             tooltip: 'Choose one - Btn Toggle Single' },
           // v-slider doesn't work with col:{ cols='auto' }
          slider: { type: 'slider',
                    color: 'green',
                    tooltip: 'Slider to check',
                    ripple:false,
                    col:6,
                    thumbSize:18,
                    thumbLabel:'always' },
          radio: { type: 'radio', label: 'Radio', options, row:true },
          switch: { type:'switch', name:'TurnItInOrOf', label:'TurnItInOrOf'}
        }

     }
    },
    group2: { type:'wrap', title:'Another Group width blue--text',
              col:12,
              class:'title pa-2 rounded elevation-4 blue--text',
              ripple:false,
     schema:{
      name3: {
        type: 'text',
        clearable:true,
        solo:true,
        label:'Label4Name2',
        tooltip:"Can we ass a tooltp here???",
      },
      password: {
        type: 'password',
        clearable: true,
        solo:true,
        class:'mx-1 mt-1'
      },
      file: {
        type: 'file',
        label: 'Images',
        showSize:true,
        counter:true,
        accept,
        multiple: true,
      },
      a1: { type:'checkbox',
             label:'A-1',
             col:12,
             tooltip: 'Checkboxxxxxxx x x xxxxx'
          },
      a2: { type: 'switch',
            label: 'B-D-B',
            value: 'checked',
            tooltip: 'Tooltip for switch BDB - see explanations',
            color: 'red' },
       }
    }},

  }),
  methods:{
      log(a) {
          console.log('LOG A = ', a)
      },
      test(a) {
        let { on, id, index, key, value, obj } = a
        console.log('on,id,index...', on, id, index, key, value, obj)
      }
  },
  mounted() {
    console.log('Mounted: vfbasetest' )
  }
}
</script>