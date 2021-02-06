<template>
<!--
       :items="select"         
        item-value="text" 
-->
    <v-autocomplete class="mt-7 ml-8" 
        v-model="what"
        v-if="subjects && subjects.length > 0"
        :value="searchText" 
        :search-input.sync="search" 
        :items="subjects"         
        :item-text="itemDisplay" 
        item-value="subjectdesc" 
        return-object 
        rounded
        outlined
        dense
        autofocus>
       <!--template v-slot:item="data"-->
            <!--v-list-item-content v-text="data.item.subjectname"></v-list-item-content-->
            <!--v-list-item-content :v-text="itemDisplay"></v-list-item-content-->
            <v-list-item-content style="align:left"> {{ itemDisplay }} </v-list-item-content>
       <!--/template-->
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
      //return this.select[0] || ''
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
    what(v) {
      console.log("watch what", v);  
        this.$emit("dataEntered", this.what);
    },
    search(n, o) {
      console.log("watch search", n, o);
      // at some point search is set to null
      // reset it to the old value
      if (n === null) this.search = o;
    }
  }
}
</script>