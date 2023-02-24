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
   name: "AutoSelSubjects",
   props: {itemObj: {type: Array,required:true}
          ,asLabel: {type:String, default:'xxxx'}
          ,initialValue: {default:1}
          },
   data: () => ({
    search: null,
    what: null,
    itemValue: 'subjectid',
  }),
  methods: {
    inputDone(e1) {
      this.$emit('input', e1)
      let obj = this.itemObj.find(e => e.subjectid == e1  )
      this.what = obj
      this.$emit('objInput', obj)

    },
    lookup() {
      this.what = this.itemObj.find(e => e.shortname == this.initialValue  )
    }
  },
  mounted() {
    //on Mounted we searched for the id if we have an initialValue
    if (this.initialValue) this.what = this.itemObj.find(e => e.id == this.initialValue  )
    if (this.what !== undefined) {
        this.$emit('objInput', this.what)
    }

  },
  computed: {
    searchText() {  console.log(this.$options.name,'searchText');    return this.itemObj[0] || ''    },
    itemDisplay() {     return item => item.shortname + ' - ' + item.description  +  '/' + item.beskrywing  }
  },
  watch: {    initialValue() {   if (this.initialValue) this.lookup()    }   }
}
</script>