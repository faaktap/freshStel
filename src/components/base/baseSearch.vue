<template>
   <v-text-field class="pt-2 xmt-2"
                 single-line hide-details
                :clearable="clearable"
                :outlined="outlined"
                 placeholder="search"
                :value="value"
                @input="updateValue"
   />
</template>

<script>
export default {
  name: "baseSearch",
 props: {
      value: {
        type: String,
        default: ''
      },
      outlined:{type:Boolean, default:true},
      clearable:{type:Boolean, default:true},
    },
  methods: {
      updateValue: function (event) {
        this.$emit('input', event)
      }
  }
}
</script>
