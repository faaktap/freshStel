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
   name: "AutoSelAttList",
   props: {itemObj: {type: Array,required:true}
          ,asLabel: {type:String, default:'xxxx'}
          ,initialValue: {default:1}
          },
   data: () => ({
    search: null,
    what: null,
    itemValue: 'id',
    showChoosy:false,
  }),
  methods: {
    inputDone(e1) {
      this.$emit('input', e1);
      let obj = this.itemObj.find(e => e.id == e1  )
      this.what = obj
      this.$emit('objInput', obj)

    },
    lookup() {
       console.log('wat is hier in?  ', this.initialValue)
      //The role of what is somewhat f**cked - here when we return it, it is an object
      //but in inputDone function we return it as "itemValue" which is username
      this.what = this.itemObj.find(e => e.listname == this.initialValue  )
      // if (this.what !== undefined) {
      //   this.$emit('objInput', this.what)
      // }
    }
  },
  mounted() {
    //se if we got and id when we came in
    this.what = this.itemObj.find(e => e.id == this.initialValue  )
    if (this.what !== undefined) {
      console.log('our incoming id was good! - emiti it back', this.what)
        this.$emit('objInput', this.what)
    }

  },
  computed: {
    searchText() {  console.log('searchText');    return this.itemObj[0] || ''    },
    itemDisplay() {     return item => item.grade + ' — ' + item.listname  +  ' - ' + item.teacher  }
  },
  watch: {    initialValue() {   if (this.initialValue) this.lookup()    }   }
}
</script>