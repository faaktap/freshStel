<template>
  <v-dialog v-model="value" 
            @click:outside="close"
            transition="dialog-bottom-transition"  max-width="320">
        <v-card>
          <v-card-title> {{ vCardTitle }} </v-card-title>
          <v-card-text>
            <v-spacer></v-spacer>
            <v-text-field v-model="IDNo" label="IDNo" autofocus required></v-text-field>
           </v-card-text>  
           <v-card-actions>
            <v-btn v-on:click="accept"> Accept </v-btn>
           </v-card-actions>
        </v-card>
  </v-dialog>
</template>
    
 <script>
import { getters } from "@/api/store";   //we need to recalc itemcount        
export default {
    name: 'InputBox',
    data() {
     return {
       vCardTitle: 'Enter',
       getZml: getters.getState({ object: "gZml" }),
       IDNo: '',
     };
    },
    props: {
        value: {
            required: true
        }
    },
    methods: {
        close() {
          this.$emit("input", !this.value);
        },           
        accept() {
          this.$emit("dataEntered", this.IDNo);
        }            
    },
    watch: {
      value: function() {
       },
  }          
};
</script>
    
