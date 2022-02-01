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
 <v-expansion-panels rounded class="pa-0 mb-2">
   <v-expansion-panel>
    <v-expansion-panel-header  :color="color">
        <slot name="header">
         <h1 :class="headingSize" class="text-center">{{ heading }}</h1>
         </slot>
     </v-expansion-panel-header>
     <v-expansion-panel-content class="ma-4">
         <slot>
         <p class="heading-4">{{ heading}} </p>
         <div v-html="explanation">
         </div>
         </slot>
     </v-expansion-panel-content>
    </v-expansion-panel>
 </v-expansion-panels>

</template>

<script>
export default {
    name:"BaseTitleExpansion",
    props:{heading: {default:"my heading"}
          ,explanation: {default:"Some explanation with <b>html</b> and maybe later pictures" }
          ,color: {default:"primary"}
          ,headingSize: {default:"heading-1"}
    },
    methods:{},
    mounted() {
        console.log('starting ', this.$options.name)
    }
}
</script>