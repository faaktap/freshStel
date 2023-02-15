<template>
    <v-autocomplete
        v-if="itemObj && itemObj.length > 0"
        cache-items
        clearable
        open-on-clear
        message
        v-model="what"
        v-on:input="inputDone"
        :value="searchText"
        :search-input.sync="search"
        :items="itemObj"
        :item-text="itemDisplay"
        :item-value="itemValue"
        xxreturn-object
        :label="asLabel">
    </v-autocomplete>
</template>


<script>
export default {
   name: "AutoSelPers",
   props: {itemObj: {type: Array,required:true}
          ,asLabel: {type:String, default:'xxxx'}
          ,initialValue: {default:1}
          },
   data: () => ({
    search: null,
    what: null,
    itemValue: 'user_name'
  }),
  methods: {
    inputDone() {
      this.$emit('input', this.what);
      this.$emit('objInput', this.itemObj[0])
    },
    finished() {
      //The role of what is somewhat f**cked - here when we return it, it is an object
      //but in inputDone function we return it as "itemValue" which is username
      this.what = this.itemObj.find(e => e.user_name.toUpperCase() == this.initialValue.toUpperCase())
      if (this.what !== undefined) {
        this.$emit('objInput', this.what)
      }
    }
  },
  mounted() {
    this.finished()
  },
  computed: {
    searchText() {      return this.itemObj[0] || ''    },
    itemDisplay() {     return item => item.user_name + ' — ' + item.user_fullname    }
  },
  watch: {    initialValue() {       this.finished()    }   }
}
</script>