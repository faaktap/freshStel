<template>
<div>
   <v-text-field dense
    class="ma-2"
    :background-color="value"
    :label="label"
    :value="value"
    prepend-icon="mdi-select-color"
    @focus="showColor = !showColor"
    @click:prepend="showColor = !showColor"
    v-on:input="updateValue($event)"
  >
   </v-text-field>

 <v-container class="ma-1 pa-2" fluid v-if="showColor">
   <!-- <v-container class="grey lighten-5" fluid> -->
     <v-row xno-gutters>
     <v-layout v-for="(c,i) in baseColors" :key="i" >
     <v-card xcolor="yellow" class="text-center ma-0" elevation="0">
      <v-card-title>
        <v-btn small class="ml-2 pa-2" :class="c" outlined width="80%" :title="c" :dark="dark" @click="colorSelected(c)">
           {{ c }}
        </v-btn>
        <v-spacer/>
        <v-chip :color="col" class="ma-1 pa-1" width="8%" max-width=70 :dark="dark" :title="`Current Selection is ${col}`">
           Selection
        </v-chip>
      </v-card-title>
     <v-row no-gutters>
      <v-layout v-for="(t,j) in tint" :key="j" row wrap align-content-start justify-space-between class="mx-2 pa-1">
       <v-card color="gray lighten-5" class="text-center ml-1 mb-0" elevation="0">
         <!-- on small it is 4 columsn, on md it is taken up 3 cols and on large it is 2 columns-->
         <v-row no-gutters>
          <v-layout v-for="(v,k) in variant" :key="k" class="ma-1 pa-1" row wrap align-content-start justify-space-between>
           <template v-if="v=='1' && t=='darken'">
             <v-card min-width=70 class="pa-1 text-center" :color="c + ' ' + t + '-' + v" @click="colorSelected(c + ' ' + t + '-' + v)" :dark="dark">
              {{t}} {{v}}
             </v-card>
           </template>
           <template v-else>
            <v-card min-width=70 class="pa-1 text-center" :color="c + ' ' + t + '-' + v" @click="colorSelected(c + ' ' + t + '-' + v)" :dark="dark">
               {{ t }} {{ v }}
            </v-card>
           </template>
         </v-layout>
        </v-row>
       </v-card>
      </v-layout>
     </v-row>
     </v-card>
    </v-layout>
     </v-row>
     <v-btn small  icon @click="dark = !dark" width="5%"><v-icon> mdi-theme-light-dark </v-icon>  </v-btn>
 </v-container>
 </div>
</template>


<script>
export default {
   name:"TextColorPicker",
   props:{
    label: {    default: "Color" },
    value: {    default: "" }
   },
   data: () => ({
    showColor: false,
    loading:false,
    baseColors:['red','green','teal','lime'
                ,'amber'
                ,'magenta'
                ,'indigo','blue', 'lightblue','darkblue', 'darkblueshade'
                ,'gray','neutralgray'
                ,'lightgray'
                ,'lightpink','yellow','amber','orange','purple','pink','white'
               ],
    tint:['darken','lighten','accent'],
    variant:[1,2,3,4],
    col:null,
    dark:false,
   }),
   computed: {
        interface: {
          get() {
              return this.value
            },
            set(val) {
              this.$emit('input', val)
            }
        }
    },
    mounted() {
      this.col = this.value
    },
    methods:{
      updateValue: function (pvalueT) {
        console.log('update color start : ', pvalueT)
        this.showColor = false
        this.$emit('input', pvalueT )
        console.log('update color end : ', pvalueT )
    }      ,
    colorSelected(color) {
          this.col = color
          this.updateValue(this.col)
          this.$emit('input', color)
    }
   },
}
</script>