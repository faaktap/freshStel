<template>
<div>
<v-text-field
          :label="label"
          :value="value"
           append-icon="mdi-calendar"
          @click:append="showDate = !showDate"
          v-on:input="updateValue($event)"
          :required="required"
          class="ma-2"
          :disabled="disabled"
          :dense="dense"
          >
          </v-text-field>
          <!-- <template v-slot:clearable> -->
          <v-dialog v-model="showDate" max-width="300" max-height="350" >
          <v-card elevation-3>
           <v-date-picker dense
                   picker-date
                   no-title
                   close-on-content-click
                   @change="showDate = false"
                   @input="updateValue($event)"
                   :value="value">
           </v-date-picker>
          </v-card>
          </v-dialog>
          <!-- </template> -->


</div>
</template>

<script>
//https://paulund.co.uk/use-v-model-on-custom-vue-component
//NB Werner!!! https://vuejs.org/v2/guide/components.html#Using-v-model-on-Components
//https://vuejs.org/v2/guide/forms.html
export default {
  name: "BaseDate",
  props:{ label: {    type: String, default:'date'},
          value: {    type: String },
          dense: {    type: Boolean,  default: false },
          disabled: { type: Boolean,  default:false },
          required: { type: Boolean,  default: false },
          instructions: {type: String, default:""}
        },
  data: () => ({
    showDate: false,
    current:{dd:0, mm:0, yyyy:0},
    cheatValue: null,
  }),
   computed:{
    inp:{
      get(){  return this.value},
      set(v){ this.$emit('input', v)}
    }
  } ,
  methods:{
    updateValue: function (pvalueT) {
      this.showDate = false
      this.$emit('input', pvalueT)
    }
  },
  mounted() {
    let today = new Date()
    this.current.dd = String(today.getDate()).padStart(2, '0');
    this.current.mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    this.current.yyyy = today.getFullYear();

    this.cheatValue = this.value
    if (this.value == '')  this.cheatValue = this.current.yyyy + '-' + this.current.mm + '-' + this.current.dd
  },
  watch: {
    value() {
    }
  }
}
</script>