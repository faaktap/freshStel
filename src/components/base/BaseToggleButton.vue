<docs>
Add all the fancy stuff we want toggle button to do.
</docs>

<template>
  <v-btn-toggle small v-model="value" >
         <v-btn v-for="(t,i) in texts" :key="i"  :x-small="!$vuetify.breakpoint.mdAndUp" color="color" @click="$emit('click', $event)">
          <span v-if="$vuetify.breakpoint.mdAndUp">
            {{ t }}
          </span>
          <span v-else>{{ t.substring(0,1)} </span>
         </v-btn>
  </v-btn-toggle>
</template>

<script>
export default {
    name:"BaseToggleButton,
    props:{
        value:{type:Number, required:true},
        icons:{type:Array, default:['mdi-kettle', 'mdi-kettle'], required:true},
        texts:{type:Array, default:['b1','b2'], required:true},
        color:{type: String, default: 'primary'}
    },
    data: () => ({
     toggleView:false
    })
}
</script>