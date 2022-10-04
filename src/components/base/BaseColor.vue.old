<template>
<div>
 <v-text-field dense
          :label="label"
          :value="value"
          readonly
           append-icon="mdi-format-color-fill"
          @focus="showColor = !showColor"
          @click:append="showColor = !showColor"
          v-on:input="updateValue($event)"
          :required="required"
          :style="`bacgroundcolor:${value}`"
          :color="value"
          />
          <v-card v-if="showColor" elevation="5" class="ma-2">
           <v-color-picker
                   dot-size="25"
                   swatches-max-height="250"
                   hide-mode-switch
                   hide-inputs
                   @input="updateValue($event)"
                   @blur="blurEvent"
                   :value="value"
                   >
           </v-color-picker>
          </v-card>
</div>
</template>

<script>
export default {
  name: "BaseColor",
  props:{ label: {    type: String      },
          value: {    type: String },
          required: { type: Boolean,  default: false},
          instructions: {type: String, default:""}
        },
  data: () => ({
    showColor: false,
  }),
  methods:{
    blurEvent(e) {
        console.log('blur event:',e)
    },
    updateValue(pvalueT) {
        console.log('update event - ' , pvalueT)
      //this.showColor = false
      this.$emit('input', pvalueT)
    }
  },
  mounted() {
  }
};
</script>