<template>
   <v-text-field class="pt-2 xmt-2"
                 single-line hide-details
                 clearable
                 outlined
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
      }
    },
  methods: {
      updateValue: function (event) {
        this.$emit('input', event)
      }
  }
}
</script>
