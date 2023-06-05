<template>
 <v-autocomplete
        v-if="itemObj && itemObj.length > 0"
        cache-items
        clearable
        open-on-clear
        message
        outlined
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
    inputDone(e1) {
      this.$emit('input', e1);
      let obj = this.itemObj.find(e => e.user_name == e1  )
      this.what = obj
      this.$emit('objInput', obj)
    },
    lookup() {
      if (this.initialValue)
          this.what = this.itemObj.find(e => e.user_name == this.initialValue  )
    }
  },
  mounted() {
    //se if we got and id when we came in
    this.lookup()
    if (this.what !== undefined) {
       //console.log('our incoming id was good! - emiti it back', this.what)
       this.$emit('objInput', this.what)
    }
  },
  computed: {
    searchText() {  return this.itemObj[0] || ''    },
    itemDisplay() { return item => item.user_name + ' — ' + item.user_fullname    }
  },
  watch: {    initialValue() {   this.lookup()    }}
}
</script>