<template>
<div>
  <v-card v-if="sub">
    <v-card-title> EDIT SUBJECT {{ sub.description }} </v-card-title>

    <v-card-text>
      <v-layout row wrap align-content-start justify-space-between>
       <v-row>
        <v-col cols="12">
        <v-card color="light-blue" class="ma-4 pa-4">
          Subject Details <v-btn small class="float-right" @click="saveSubject"> Save </v-btn>
        </v-card>
        </v-col>
       </v-row>
      </v-layout>
      <v-layout row wrap align-content-start justify-space-between class="ma-4">
        <v-row>
        <v-col cols="12" md="6">
          <v-text-field v-model="sub.description"
                        dense
                        label="Description" />
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field v-model="sub.beskrywing"
                        dense
                        label="Beskrywing" />
        </v-col>
        <v-col cols="4" md="6">
          <v-text-field v-model="sub.shortname"
                        dense
                        label="Afkorting"  />
        </v-col>
        <v-col cols="4">
          <v-text-field v-model="sub.subjectid" label="Subject ID" disabled />
        </v-col>
        <v-col cols="4">
          <v-text-field v-model="sub.linksubjectid" label="Link ID"
          />
        </v-col>
        <v-col cols="4">
          <v-text-field v-model="sub.sortider" label="Sort Priority"
          />
        </v-col>
        <v-col cols="12">
          <!--v-text-field v-model="sub.color" label="Colour"/-->
         <text-color-picker
           v-model="sub.color"
           title="color of the background"
           label="background color"
           dense
           class="ma-1 pa-1"
         />
          {{ sub.color }}
        <!-- <auto-sel-color id="zyx1"
            :initialValue="sub.color"
             v-model="sub.color"/>
        <v-color-picker
          v-model="sub.color"
          mode="hexa"
          hide-mode-switch
          class="mb-2"
         /> -->
        </v-col>

        <v-col cols="12" md="5">
               <v-text-field v-model="sub.path"
                             label="Path" />
        </v-col>
        <v-col cols="12" md="6">
               <v-text-field v-model="sub.picture"
                             label="Picture" />
        </v-col>
       </v-row>
      </v-layout>

    </v-card-text>
    <v-card-actions>

      <v-layout row wrap align-content-start justify-space-between>
       <v-col>
        <v-card color="light-blue accent-1" class="ma-4 pa-4">
          End of Form <v-btn small class="float-right" @click="saveSubject"> Save </v-btn>(ESC to Exit)
        </v-card>
       </v-col>
      </v-layout>

    </v-card-actions>
  </v-card>
</div>
</template>

<script>
import { getters } from "@/api/store";
//import AutoSelColor from "@/components/AutoSelColor"
import TextColorPicker from "@/components/TextColorPicker.vue"
export default {
    name:"SubjectEdit",
    components: {TextColorPicker},
    props:['sub'],
    data: () => ({
      getZml: getters.getState({ object:"gZml" }),
      showColors:false
     }),
    methods:{
        saveSubject() {
            this.$emit('saveSubject', this.sub)
        }
    }
}
</script>