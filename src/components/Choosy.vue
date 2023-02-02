<template>

  <v-card>
<v-row>
 <v-col cols="3">
   <!-- <v-card  class="ma-2 pa-2 text-caption"> Main Categories.</v-card> -->
    <v-simple-table>
    <tr v-for="c in cat" :key="c.id">
      <td> <v-btn small class="ma-2" @click="show(c)">{{ c }}</v-btn></td>
    </tr>
    </v-simple-table>
</v-col>
<v-col cols="9">
    <!-- <v-card class="ma-2 pa-2 text-caption" >Items in {{ selectedCategory || 'Main Categories.'}}</v-card> -->
   Items in {{ selectedCategory || 'Main Categories.'}}
    <ul v-for="i in catItems" :key="i.id">
      <li class="text-caption"> <v-btn small @click="takeBack(i)" text :title="i.teacher">  {{ i.listname }} </v-btn> </li>
    </ul>
</v-col>
</v-row>
  </v-card>

</template>

<script>

export default {
   name:"ZAutoItemType",
   props:{
           value:{}
         , label: {type:String,default:"Item Type"}
         , items:[]
   },
   data: () => ({
     showHelp:true,
     itemTypeTable: [],
     cat:[],
     catItems:[],
     selectedCategory:''
  }),
  computed: {
    searchItemType() {
        if (!this.searchInput) {
           return this.itemTypeTable
        }
        // Wisdom ZML
        //filter does not work on null values, so we need a "inline if" to check for a null value
        //
        let x = this.itemTypeTable.filter(
          str => ( str.concatsearch.toUpperCase().includes(this.searchInput.toUpperCase()) )
        )
        return x
      }
  },
  methods:{
    takeBack(obj){
      console.log('obj: emit: ', obj)
      this.$emit('input', obj)
      this.$emit('objectSelected',obj)
    },
    show(c) {
      this.selectedCategory = c
      //Old way of doing it....
      // const filterArray = (array, fields, value) => {fields = Array.isArray(fields) ? fields : [fields]};
      // this.catItems = filterArray(this.itemTypeTable, 'category', c)
      this.catItems = this.items.filter(e => e.grade == c)

    },
  },
  mounted() {
     console.log('Start' , this.$options.name, this.items.length)
     this.cat.length = 0
     const distinctBy = (prop, arr) => [...new Set(arr.map(o => o[prop]))]
     this.cat = distinctBy('grade', this.items)
     alert(this.items.length)
     console.log(this.cat)

  }
}
</script>
