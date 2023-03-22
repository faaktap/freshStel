<!--
<base-title-expand color="purple" >
<template v-slot:header>
  <v-btn @click="clicked"> click</v-btn>
</template>
Some stuff for the inside expansion slot
</base-title-expand>

or

<base-title-expand  heading="base-title-expand"
       explanation="base-title-expand is a component that allow so info to be carried in the title."
       color="purple" />
-->
<template>
<v-container fluid>
 <v-expansion-panels rounded class="pa-0 mx-0 mb-2"  v-model="panel" >
   <v-expansion-panel value="0">
    <v-expansion-panel-header  :color="color" :class="tclass">
        <slot name="header">
         <h2 :class="`${headingSize} text-center`">{{ heading }}</h2>
         </slot>
     </v-expansion-panel-header>
     <v-expansion-panel-content class="ma-0 pa-0">
         <slot>
         <p class="heading-4">{{ heading}} </p>
         <div v-html="explanation">
         </div>
         </slot>
     </v-expansion-panel-content>
    </v-expansion-panel>
 </v-expansion-panels>
</v-container>
</template>

<script>
export default {
    name:"BaseTitleExpansion",
    props:{heading: {default:"my heading"}
          ,explanation: {default:"Some explanation with <b>html</b> and maybe later pictures" }
          ,color: {default:"white"}
          ,openOrClose: {default:""}
          ,headsize: {default:2}
          ,tclass: {default:''}
    },
    data () {
      return {
        panel: [],
      }
    },
    computed:{
        headingSize() { return "text-xs-h" + this.headsize + " subtitle-md-1" }
    },
    methods:{},
    mounted() {
        // console.log('starting ', this.$options.name)
        if (this.openOrClose == '') {
            this.panel = []
        } else {
            this.panel = 0
        }
        // console.log(this.$options.name, this.panel, this.openOrClose)
    }
}
</script>