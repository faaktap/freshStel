<template>
<v-textarea
    v-model="editableValue"
    :maxlength="maxlength"
    outlined
    :label="label"
/>
</template>

<script>
export default {
  name: 'BaseTextArea',
  props: ['value','label','maxlength'],
  data: () => ({
      editableValue: ''
  }),
  mounted() {
    if (this.editableValue) this.editableValue = this.value
  },
  watch: {
    value (newValue) {
      this.editableValue = newValue
    },
    editableValue: {
      immediate: true,
      handler (newValue) {
        this.$emit('input', newValue)
        this.$emit('left-chars', this.leftChars)
      }
    }
  },
  computed: {
    leftChars () {
      if (!this.editableValue) return this.maxlength
      return this.maxlength - this.editableValue.length
    }
  }
}
</script>