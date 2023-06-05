<template>
<div>
<<<<<<< HEAD
<v-text-field
          :label="label"
          :value="value"
           append-icon="mdi-calendar"
=======
 <v-text-field
          :label="label"
          :value="value"
           append-icon="mdi-calendar"
          @xxfocus="showDate = !showDate"
>>>>>>> 121ea14dcce9c3f036da38d4cab97fb8f18a92e8
          @click:append="showDate = !showDate"
          v-on:input="updateValue($event)"
          :required="required"
          class="ma-2"
          :disabled="disabled"
          :dense="dense"
<<<<<<< HEAD
          >
          </v-text-field>
          <!-- <template v-slot:clearable> -->
=======
          :outlined="outlined"
          clearable
          />
>>>>>>> 121ea14dcce9c3f036da38d4cab97fb8f18a92e8
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
<<<<<<< HEAD
          <!-- </template> -->


=======
>>>>>>> 121ea14dcce9c3f036da38d4cab97fb8f18a92e8
</div>
</template>

<script>
//https://paulund.co.uk/use-v-model-on-custom-vue-component
//NB Werner!!! https://vuejs.org/v2/guide/components.html#Using-v-model-on-Components
//https://vuejs.org/v2/guide/forms.html
export default {
  name: "BaseDate",
<<<<<<< HEAD
  props:{ label: {    type: String, default:'date'},
          value: {    type: String },
          dense: {    type: Boolean,  default: false },
=======
  props:{ label: {    type: String},
          value: {    type: String },
          dense: {    type: Boolean,  default: false },
          outlined: {    type: Boolean,  default: false },
>>>>>>> 121ea14dcce9c3f036da38d4cab97fb8f18a92e8
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
<<<<<<< HEAD
    updateValue: function (pvalueT) {
=======
    checkIfInFuture(dte) {
      // console.log(this.instructions, 'before check', this.instructions == 'FA')
      // if (this.instructions == 'FA') return false;
      // console.log(this.instructions, 'fall thru')
      let selected = {}
      selected.yyyy= dte.substr(0,4)
      selected.mm = dte.substr(5,2)
      selected.dd = dte.substr(8,2)
      if (selected.yyyy > this.current.yyyy) return false;
      if (selected.mm > this.current.mm) return false;
      if (selected.dd > this.current.dd) return false;
      return true
    },
    updateValue: function (pvalueT) {
      // if (this.checkIfInFuture(pvalueT)) {
      //   infoSnackbar('RW - Not allowed to choose date in future.')
      //   this.$emit('input', this.current.yyyy + '-' + this.current.mm + '-' + this.current.dd)
      //   return
      // }
      console.log('basedate selected:', pvalueT)
>>>>>>> 121ea14dcce9c3f036da38d4cab97fb8f18a92e8
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