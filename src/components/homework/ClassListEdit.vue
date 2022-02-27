<template>
 <div>
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
      <v-row v-if="classObj" wrap align-content-start justify-space-between
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
        <v-col cols="12" md="6" >
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
         <v-col cols="12" md="6">
          <Params
             :arrList="classObj.jdocstructure"
             @sendback="receiveStructChanges"
             />
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
  </div>
</template>

<script>
import { getters } from "@/api/store";
import  Params  from "@/components/homework/Params.vue"

export default {
    name:"ClassListEdit",
    props:['classObj'],
    components:{
     Params
    },
    data: () => ({
        getZml: getters.getState({ object: "gZml" }),
     }),
    methods: {
      receiveStructChanges(e) {
         this.classObj.jdocstructure = e
      },
      saveClassList() {
        this.$emit('saveClassList', this.classObj)
      },
      hideDialog() {
        this.$emit('hideDialog')
      }
    },
    mounted() {
      console.log(this.$options.name, 'mounted')
    },
    watch: {}
}
</script>