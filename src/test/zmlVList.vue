<template>

<v-list>
  <v-list-group :value="true" prepend-icon="mdi-account-circle"           no-action
          sub-group>
    <template v-slot:activator>
       <v-list-item-title>Users</v-list-item-title>
    </template>
  <v-list-item-group v-model="listSelection">
    <v-list-item :dense="isDense" v-for="(item, index) in items" :key="index" :value="item.id">
      <v-list-item-icon v-if="item.icon"><v-icon> {{ item.icon }} </v-icon></v-list-item-icon>
      <v-list-item-content v-if="item.text" :title="item.tip">{{ item.text }}</v-list-item-content>
    </v-list-item>
  </v-list-item-group>
       </v-list-group>
</v-list>

</template>

<script>
import { getters } from "@/api/store";
function cl(...args) { console.log('vlist:' ,...args) }
export default {
  name:"zmlVList",
  props: {
    value: Object
  },
  data: () => ({
    functions: getters.getState({ object: "gZml" }).functions,
  }),
  computed: {
    isDense: function() {
      if (this.value && this.value.dense) return true
      return false
    },
    items() {
      //create_timestamp,description, functionaccess=admin,functionid,functionname,functiontype=local,grade,icon,payload,shortname,sortorder,tip,update_timestamp
      let m = []
      this.functions.map(e => {
         if (e.functionaccess == 'teacher') {
           m.push({id: e.functionid, sort: e.sortorder, icon: e.icon, text: e.shortname, payload: e.payload, title:e.tip})
         }
      })
      return m.sort((a,b) => a.sort - b.sort)
      // return [{id:1, text:'some text'}
      //        ,{id:2, text:'some text2'}
      //        ,{id:3, text:'some text3'}
      //        ,{id:4, text:'some text4', icon: 'mdi-home'}
      // ]
    },
    listSelection: {
      get: function() {
        cl('get',this.value)
        if (this.value.id)  return this.value.id
      },
      set: function(newVal) {
        cl('set',newVal)
        if (newVal) this.$emit('input', this.items.find(item => item.id === newVal));
      }
    }
  },

}

</script>