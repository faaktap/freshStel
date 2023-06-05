<template>
<!--
       :items="select"         
        item-value="text" 
-->
    <v-autocomplete class="mt-7 ml-8" 
        v-model="what"
        v-on:input="$emit('input', what)"
        v-if="subjects && subjects.length > 0"
        :value="searchText" 
        :search-input.sync="search" 
        :items="subjects"         
        :item-text="itemDisplay" 
        item-value="subjectdesc" 
        return-object 
        dense>

    </v-autocomplete>
</template>
  

<script>
export default {
   name: "dkhsPickList",
   props: {subjects:Array, language:String},
   data: () => ({
    search: "1",
    what: null,
  }),
  mounted() {  },

  computed: {
    searchText() {
      return this.subjects[0] || ''
    },
    itemDisplay() {
        if (this.language =='a') return "subjectafrname";
        if (this.language =='e') return "subjectengname";
        return "subjectname";
    }
  },

  methods: {
  },
  watch: {
    what() {
       this.$emit("dataEntered", this.what);
    },
    search(n, o) {
      // at some point search is set to null
      // reset it to the old value
      if (n === null) this.search = o;
    }
  }
}
</script>