<template>
<v-dialog v-model="value"  transition="dialog-bottom-transition" >
  <v-card>
   <v-card-title>  Current Selection  </v-card-title>
   <v-card-text>
   <v-row dense v-if="filterVoteList.length > 0">
    <v-col><strong>Prefects ({{ filterVoteList.length }})</strong></v-col>
    <v-col dense v-for="item in filterVoteList" :key="item.id">
     <v-img :src="item.foto" max-height="60px" max-width="60px" ></v-img>{{ item.firstname.toLowerCase() }}
    </v-col>
   </v-row>
   <v-row><hr/></v-row>        
   <v-row dense v-if="filterSeniorList.length > 0">
    <v-col>
     <strong>Senior Council  ({{ filterSeniorList.length }})</strong></v-col>
    <v-col dense v-for="item in filterSeniorList" :key="item.id">
     <v-img :src="item.foto" max-height="60px" max-width="60px" ></v-img>{{ item.firstname.toLowerCase() }}
    </v-col>    
  </v-row>
   </v-card-text>    
   <v-card-actions>
       <v-btn v-on:click="submit"> Submit </v-btn>
       <v-btn v-on:click="reset" color="red"> Reset </v-btn>
       <v-btn v-on:click="close"> Close </v-btn>
   </v-card-actions>        
   </v-card>
</v-dialog>
</template>

<script>
import { getters } from "@/api/store";   //we need to recalc itemcount        
export default {
    name: 'ViewBox',
    props: {
        value: {required: true }, 
        candidateList: {required: true}
    },
    data() {
     return {
       vCardTitle: 'Show Votes',
       getZml: getters.getState({ object: "gZml" }),
     };
    },
    computed: {
        filterVoteList: function() {
             return this.candidateList.filter(item => this.getZml.voteList.includes(item.rvlselid) || '') ;
        },
        filterSeniorList: function() {
             return this.candidateList.filter(item => this.getZml.seniorList.includes(item.rvlselid) || '' );
        }

    },
    methods: {
        close() {
          this.$emit("input", !this.value);
        },    
        submit() {
          this.$emit("submit");
        },    
        reset() {
          this.$emit("reset");
        }            
    },
    watch: {
      vCardTitle: function(newValue, oldValue) {
         console.log('ViewBox:new,old',newValue, oldValue);
       },
  }          
};
</script>
    
