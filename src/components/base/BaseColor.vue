<template>
<div>
 <v-text-field dense
    class="ma-2"
    :background-color="value"
    :label="label"
    :value="value"
    prepend-icon="mdi-select-color"
    append-icon="mdi-close"
    @focus="showColor = !showColor"
    @click:prepend="showColor = !showColor"
    @click:append="updateValue(0)"
    v-on:input="updateValue($event)"
    :required="required"
  >
 </v-text-field>
        <v-card elevation-6 v-if="showColor">
          <v-color-picker
              close-on-content-click
              @change="showColor = false"
              v-on:input="updateValue($event)"
              :value="value"
           show-swatches
           swatches-max-height="100"
         />
         <!-- hide-canvas hide-inputs hide-mode-switch hide-sliders -->
        </v-card>
</div>
</template>

<script>
//https://paulund.co.uk/use-v-model-on-custom-vue-component
//NB Werner!!! https://vuejs.org/v2/guide/components.html#Using-v-model-on-Components
//https://vuejs.org/v2/guide/forms.html
export default {
  name: "BaseColor",
  props:{ label: {    type: String      },
          value: {    type: String },
          required: { type: Boolean,  default: false},
          instructions: {type: String, default:""}
        },
  data: () => ({
     showColor: false
    }),
  methods:{
    updateValue: function (pvalueT) {
      console.log('update color start : ', pvalueT)
      this.showColor = false
      this.$emit('input', pvalueT )
      console.log('update color end : ', pvalueT )
    }
  },
  mounted() {
  }
};
</script>