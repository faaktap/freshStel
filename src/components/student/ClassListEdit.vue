<template>
  <v-card>
    <v-card-title> Edit/Insert LIST </v-card-title>
    <v-card-text>
      <v-row wrap align-content-start justify-space-between>
       <v-col>
        <v-card color="light-blue" class="ma-4 pa-4"> 
          Class List Basic Info
          <v-btn small class="mx-2 float-right" @click="saveClassList"> Save </v-btn>
          <v-btn small class="mx-2 float-right" @click="hideDialog"> Cancel </v-btn>
        </v-card>
       </v-col>
      </v-row>
      <v-row wrap align-content-start justify-space-between 
             class="ma-2">
        <v-col cols="12">
            <!-- base-breakpoint-display / -->
        </v-col>
        <v-col cols="12" md="12">
          <v-text-field  
                dense
                v-model="classObj.listname"
                label="List Name"  />
        </v-col>
        <v-col cols="12" md="12" >
          <v-radio-group 
                v-model="classObj.share" 
                row>
             Share this list
             <v-radio v-for="yn in ['Yes','No']" 
                     :key="yn"  
                     :label="yn"   
                     :value="yn.substr(0,1)"> 
             </v-radio>
          </v-radio-group>
        </v-col>    
        <v-col>    
            {{ classObj.teacher }} {{ classObj.create_timestamp }} {{ classObj.update_timestamp }}
        </v-col>
      </v-row>
    </v-card-text>
    <v-card-actions>
      <v-row wrap align-content-start justify-space-between>
       <v-col>
        <v-card color="light-blue" class="ma-4 pa-4"> 
          End of Form 
          <v-btn small class="mx-2 float-right" @click="saveClassList"> Save </v-btn>
          <v-btn small class="mx-2 float-right" @click="hideDialog"> Cancel </v-btn>
        </v-card>
       </v-col>
      </v-row>
    </v-card-actions>
  </v-card>    
</template>

<script>
import { getters } from "@/api/store";
//import BaseBreakpointDisplay from '@/components/base/BaseBreakpointDisplay.vue'
export default {
    name:"ClassListEdit",
    props:['classObj'],
    components:{
//        BaseBreakpointDisplay
    },
    data: () => ({
        getZml: getters.getState({ object: "gZml" }),        
    }),
    methods: {
      saveClassList() {
        this.$emit('saveClassList', this.classObj)
      },
      hideDialog() {
        this.$emit('hideDialog')  
      }
    }
}
</script>