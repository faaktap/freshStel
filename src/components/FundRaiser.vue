<template>
<v-card elevation="5" :color="color">
 <v-card-text>
  <v-row >
   <v-col cols="12" md="6"  ref="capture">
    <v-card elevation="2" :color="color" :dark="dark">

     <v-row align="start">
        <v-col>
          <v-card-title class="pa-0 justify-center heading-1">{{ txt.title }}</v-card-title>
        </v-col>
        <v-col class="shrink">
          <v-img src="DeK 60 Logo-200px.png" max-width="80" class="ml-3"></v-img>
        </v-col>
     </v-row>

     <v-card-text class="vue-thermometer d-flex flex-row" :class="customClass">
     <svg xmlns="http://www.w3.org/2000/svg" :width="width+10" :height="height" ref="myref">
     <g>
      <g id="11"> <!-- ticks/lines -->
        <path v-show="defaultOptions.thermo.ticksEnabled"
              v-for="(tick, index) in ticks"
              :key="index" :stroke="defaultOptions.thermo.tickColor"
              :stroke-width="defaultOptions.thermo.tickWidth"
              :stroke-miterlimit="defaultOptions.thermo.tickWidth"
              :id="'12' + index"
              :d="offsetLine(index)"
        />
      </g>
      <!-- Frame round thermo black/white-->
      <circle :cx="roundDotPositionX" :cy="glassHeight" :r="(glassWidth * 0.9) + 2"
              :stroke="defaultOptions.thermo.frameColor" stroke-width="4"
              :fill="defaultOptions.thermo.color"
      />
      <rect :fill="defaultOptions.thermo.frameColor"
             fill-rule="nonzero" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"
             stroke-miterlimit="4" stroke-dashoffset="0"
             ry="16" rx="16" :y="glassOffset - 2" :x="baseXOffset - 2"
             :height="glassHeight + 4"
             :width="glassWidth + 4"
             id="14"
      />
      <rect :fill="defaultOptions.thermo.backgroundColor" fill-rule="nonzero"
             stroke-width="4" stroke-linecap="round" stroke-linejoin="round"
             stroke-miterlimit="4"  stroke-dashoffset="0"
             ry="16" rx="16" :y="glassOffset" :x="baseXOffset"
             :height="glassHeight"
             :width="glassWidth" id="15"
      />
      <!-- this is the round buttom thing center of it (red) -->
      <circle :cx="roundDotPositionX" :cy="glassHeight" :r="glassWidth * 0.9"
              :stroke="defaultOptions.thermo.backgroundColor"
              stroke-width="4" :fill="defaultOptions.thermo.color" />

      <!-- this is the bar/temp height -->
      <rect :fill="defaultOptions.thermo.color" stroke="#000000" stroke-width="0"
                                                stroke-linecap="round" stroke-linejoin="round"
                                                stroke-miterlimit="4" stroke-dashoffset="0"
                                                ry="8" rx="8"
                                                :x="baseXOffset + 3" :y="thermoOffset"
                                                :width="thermoWidth" :height="thermoHeight"
                                                id="svg_18"
      />
      <!-- this is the temperature values -->
      <text v-show="defaultOptions.text.textEnabled"
            v-for="(tick, index) in ticks" :key="index"
            :id="'svg_19' + index"
            :fill="defaultOptions.text.color"
            :stroke="defaultOptions.text.color"
            stroke-width="0"
            :x="textSpacing" :y="offsetText(index)"
            :font-size="defaultOptions.text.fontSize"
            :font-family="defaultOptions.text.fontFamily"
            text-anchor="middle"
            xml:space="preserve">
            {{ scaleAndTick(tick) }}
      </text>
     </g>
     </svg>
     <v-card color=":color"> <p>&nbsp;</p> </v-card>
     <v-card elevation="0" :color="color">
       <v-row>
        <v-col  cols="12">
            {{ txt.para1 }}
        </v-col>
        <v-col cols="12" height="100px">
        </v-col>
        <v-col  cols="12">
            {{ txt.para2 }}
        </v-col>
       </v-row>
    </v-card>

  </v-card-text>
    <v-row align="start">
        <v-col> <br> </v-col>
         <v-col class="shrink">
          <drop description="Drop it!" @dataDropped="receiveDroppedFiles">
           <v-img ref="myImg" :src="imgSrc" max-width="80" class="ml-3"></v-img>
          </drop>
        </v-col>
    </v-row>

    </v-card>
  </v-col>
  <v-col cols="12" md="6">
   <v-card>
    <v-card-text>
     <v-row>
      <v-col cols="12" md="6">
       <v-btn @click="saveIt" class="mr-3 pl-1"
            x-small
            title="Save the thermometer as is">
           save thermometer
       </v-btn>
       <v-btn @click="printADiv" x-small class="ml-1 pl-1"> save block </v-btn>
      </v-col>
      <v-col cols="12" md="3">
         <v-switch v-model="defaultOptions.thermo.ticksEnabled"
                   label="tick lines" dense flat
                   title="show small ticks on thermometer" />
        </v-col>
        <v-col cols="12" md="3">
         <v-switch v-model="scaleTick" label="scale tick" dense
                   title="Reverse (R 100) to (100 R)" />
         <v-switch v-model="dark" label="dark or light" dense
                   title="color of text" />
        </v-col>

        <v-col cols="12" md="6">
         <v-text-field v-model="scale" label="scale" type="string" dense class="ma-2"  />
         <v-text-field v-model="defaultOptions.thermo.ticks" label="ticks" type="number" dense class="ma-2" />
        </v-col>
        <v-col cols="12" md="6">
         <v-text-field v-model="defaultOptions.layout.width" label="width" type="number" dense class="ma-2"
                       title="make the width and heigt bigger, for better picture" />
         <v-text-field v-model="defaultOptions.layout.height" label="height" type="number" dense class="ma-2"
                       title="make the height bigger, for better picture" />
        </v-col>
        <v-col cols="12" md="6">
         <v-text-field v-model="min" label="minimum" type="number" dense class="ma-2"  />
         <v-text-field v-model="max" label="max" type="number" dense class="ma-2"  />
        </v-col>
        <v-col cols="12" md="6">
         <v-text-field v-model="value" label="current" type="number" dense class="ma-2"  />
        </v-col>
        <v-col cols="12" md="6">
         <base-color
           v-model="color"
           title="color of the background"
           label="background color"
         />
         <base-color
           v-model="defaultOptions.thermo.color"
           title="color of the thero"
           label="Thermo color"
         />
         <base-color
           v-model="defaultOptions.thermo.backgroundColor"
           title="background thermo"
           label="Thermo background color"
         />
         <base-color
           v-model="defaultOptions.thermo.frameColor"
           title="frame of thermo"
           label="Thermo Frame color"
         />


        </v-col>
        <v-col cols="12" md="6">
         <v-text-field v-model="defaultOptions.text.fontSize" label="fontsize" type="number" />
         <v-text-field v-model="defaultOptions.text.textAdjustmentY" label="text Adjustment Y-axis" type="number" />
        </v-col>
        <v-col cols="12" md="6">
            <v-text-field v-model="txt.title" label="title" />
            <v-textarea v-model="txt.para1" label="paragraph 1" />
        </v-col>
        <v-col cols="12" md="6">
            <v-textarea v-model="txt.para2" label="paragraph 2" />
        </v-col>
        </v-row>
     </v-card-text>
    </v-card>
   </v-col>
  </v-row>
 </v-card-text>
  </v-card>
</template>

<script>
const _textOffset = 0.85
import BaseColor from '@/components/base/BaseColor.vue'
import Drop from '@/components/Drop.vue'
export default {
  name: 'NewThermo',
  components:{BaseColor,Drop},
  props: {
    customClass: {type: String, required: false}
  },
  created () {
    this.defaultOptions = {
      text: {
        color: 'black',
        fontSize: 10,
        textAdjustmentY: 12,
        fontFamily: 'Verdana',
        textEnabled: true
      },
      thermo: {
        color: '#FF0000',
        backgroundColor: '#fcf9f9',
        frameColor: 'black',
        ticks: 10,
        ticksEnabled: true,
        tickColor: 'black',
        tickWidth: '1'
      },
      layout: {
        height: 400,
        width: 110
      }
    }
  },
  mounted () {
    if (this.options !== null && this.options !== undefined) {
      this.mergeDefaultOptionsWithProp(this.options)
    }
  },
  data () {
    return {
      defaultOptions: Object,
      value: 50,
      min: 10,
      max: 100,
      scale: 'R',
      color:'green',
      scaleTick:true,
      txt:{title:'Title', para1:'Paragraph 1 - some text', para2:'Paragraph 2 - some more text'},
      dark:false,
      imgSrc:"DeK 60 Logo-200px.png"
    }
  },
  computed: {
    baseXOffset () {
      return this.defaultOptions.layout.width / 5
    },
    width () {
      return this.defaultOptions.layout.width
    },
    height () {
      return this.defaultOptions.layout.height
    },
    textSpacing () {
      return this.width * _textOffset
    },
    tickStep () {
      return (Math.abs(this.max - this.min)) / (this.defaultOptions.thermo.ticks - 1)
    },
    ticks () {
      let ticks = []
      let maxValue = this.max
      for (let i = 0; i < (this.defaultOptions.thermo.ticks - 1); i++) {
        ticks.push(Math.round(maxValue))
        maxValue -= this.tickStep
      } ticks.push(this.min)
      return ticks
    },
    thermoWidth () {
      return this.defaultOptions.layout.width / 6
    },
    glassWidth () {
      return (this.defaultOptions.layout.width / 6) + 6
    },
    tickWidth () {
      return Math.ceil((this.defaultOptions.layout.width) / 12)
    },
    glassOffset () {
      return this.defaultOptions.layout.height * 0.02
    },
    glassHeight () {
      let height = this.defaultOptions.layout.height * 0.95
      while ((this.defaultOptions.layout.height - height) < 30) {
        height -= 1
      }
      return height
    },
    tickStepSize () {
      return (this.glassHeight / this.defaultOptions.thermo.ticks)
    },
    thermoOffset () {
      let offset = Math.ceil(this.glassHeight - this.thermoHeight)
      return (this.glassOffset + offset)
    },
    level () {
      return Math.ceil(((this.value - this.min) * 100) / (this.max - this.min))
    },
    thermoHeight () {
      return (this.level * ((this.glassHeight) / 100)) + ((((100 - this.level) / 100) * this.glassHeight) * 0.075)
    },
    roundDotPositionX () {
      return this.baseXOffset + this.glassWidth * 0.5
    },
    roundDot () {
      return 'm74.829132,' + this.glassHeight + 'a33.41457,32 0 1 1 -66.829132,0a33.41457,32 0 1 1 66.829132,0z'
    }
  },
  methods: {
    receiveDroppedFiles(dropItems) {
        if (dropItems[0].type == 'files') {
            console.log('DROPITEMS FILES info is om data :: ', dropItems[0].data)
        }
        console.log('receiveDroppedFiles 1',dropItems[0].data)
        let files = dropItems[0].data
        let file = files[0];
        console.log(file.type)

      // a seed img element for the FileReader
      let img = document.createElement("img");
      img.classList.add("obj");
      img.file = file;

      let reader = new FileReader();
      reader.onload = (function(aImg) {
        return function(e) {
          aImg.onload = function() {
              // draw the aImg onto the canvas
              var canvas = document.createElement("canvas");
              var ctx = canvas.getContext("2d");
              canvas.width = aImg.width;
              canvas.height = aImg.height;
              ctx.drawImage(aImg, 0, 0);

              // make the jpeg image
               let newImg = new Image();
               newImg.onload = function() {
                  newImg.id = "newest";
            //     document.body.appendChild(newImg);
               }
               newImg.src = canvas.toDataURL('image/jpeg');
            }
            // e.target.result is a dataURL for the image
          aImg.src = e.target.result;
        };
      })(img)
      .then(this.imgSrc = img.src);
      reader.readAsDataURL(file);


    },
    printADiv() {
      console.log(this.$refs.capture)
      this.$html2canvas(this.$refs.capture
                     , {logging: true,
//                        type: 'dataURL',
                        letterRendering: true,
                        allowTaint: false,
                        useCORS: true,
                        scale: 1920*2/window.innerWidth,
                        backgroundColor: this.color })
      .then(canvas => {
       this.saveAs(canvas.toDataURL('image/png'), 'FastTest.png');
      }).catch((error) => {
        console.log("ERROR SAVING FESTIVAL IMAGE", error)
      })
    },
    scaleAndTick (tick) {
        if (this.scaleTick) {
           return this.scale + ' ' + tick
        } else {
           return tick + ' ' + this.scale
        }
    },
    testSavetoClipboard(value) {
      if (navigator.clipboard) {
          navigator.clipboard.writeText(value).then(function () {
                alert('Copied to Clipboard')
          }, function (err) {
              console.log('error',err)
          });
      } else {
          console.log('Browser do not support Clipboard API')
      }
    },
    saveIt() {
      let xml = this.$refs.myref.outerHTML
      let imgSrc = 'data:image/svg+xml;base64,' + window.btoa(unescape(encodeURIComponent(xml)))
      this.saveAs(imgSrc, 'thermo1.png')
      console.log(imgSrc)
    },
    saveAs(imgSrc, filename) {
      let image = new Image();
      image.src = imgSrc
      console.log('do the saveAs')
      image.onload = function() {
         let canvas = document.createElement('canvas');
         canvas.width = image.width;
         canvas.height = image.height;
         let context = canvas.getContext('2d');
// /https://stackoverflow.com/questions/26540520/how-does-context-drawimage-remember-the-original-0-0-canvas-coordinates-afte#26671644
         context.clearRect(0, 0,canvas.width, canvas.height);
         context.drawImage(image, 0, 0);
         var a = document.createElement('a');
         a.download = filename;
         a.href = canvas.toDataURL('image/png');
         document.body.appendChild(a);
         a.click();
      }
    },
    mergeDefaultOptionsWithProp (options) {
      let result = this.defaultOptions
      for (var option in options) {
        if (options[option] !== null && typeof (options[option]) === 'object') {
          for (var subOption in options[option]) {
            if (options[option][subOption] !== undefined && options[option][subOption] !== null) {
              result[option][subOption] = options[option][subOption]
            }
          }
        } else {
          result[option] = options[option]
        }
      }
      this.defaultOptions = result
    },
    offsetText (index) {
      let base = (this.tickStepSize / this.defaultOptions.thermo.ticks) + this.glassOffset + this.defaultOptions.text.textAdjustmentY
      let offset = index * this.tickStepSize
      return (Number(offset) + Number(base))
    },
    offsetLine (index) {
      let base = (this.tickStepSize / this.defaultOptions.thermo.ticks) + this.glassOffset
      let offsetY = index * this.tickStepSize
      let length = index % 2 === 0 ? 'l' + Math.ceil(this.tickWidth * 1.4) : 'l' + Math.ceil(this.tickWidth + this.tickWidth)
      offsetY = Number(offsetY) + Number(base) + length
      let offsetX = 'm' + Number(this.defaultOptions.layout.width * 0.4) + '.121861,'
      //console.log(index,'offsetX, offsetY, ', offsetX , offsetY ,'return=', offsetX + offsetY + '.121853,0')
      return offsetX + offsetY + '.121853,0' // todo this fix x offset
    }
  },
  watch: {
    options: function (val) {
      if (val !== null && val !== undefined) {
        this.mergeDefaultOptionsWithProp(val)
      }
    }
  }
}
</script>

<style scoped>
.vue-thermometer {
  display: flex;
}
</style>