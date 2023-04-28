<template>
<!--
    vSelstudents
    List of user created students

     , studentid: {type: 'sel-students'
                  , label: 'Student Name'
                  , itemText: "name"
                  , itemValue: "id"
                  , outlined:true, ripple:false
                  , col:{cols:12}
                  , class:"ma-2 pa-2"
                  }
-->

      <v-autocomplete
        :label="label || ''"
        :title="title || ''"
        :value="value"
        :items="theList"
        :rules="rules"
        item-text="name"
        item-value="studentid"
        clearable
        class="ma-2 pa-2"
        v-on:input="$emit('input',$event)"
        :outlined="!!outlined || false"
        prepend-inner-icon="mdi-account"
       >
        <template v-slot:item="{ item }">
           {{ item.name }}  {{ item.grade }}
        </template>
      </v-autocomplete>

</template>

<script>
function cl(...args) {console.log('sel-stud:' ,...args)}
import { getters } from "@/api/store.js";
export default {
  name:'vSelStudents',
  //props: ['outlined','debug','nodata','title', 'entryType', 'items','value', ,'label', 'color', 'obj', 'type' ],
  props: {
    items: {type:Array, default: () => [] },
    value: {default:''},
    label: {default:''},
    color: {default:''},
    title: {default:''},
    outlined: {type:Boolean,default:true},
    rules: {default:''},
  },
  data: () => ({
      localItems: getters.getState({ object: "gZml" }).students,
      newValue: '',
      mainItem: ''
  }),
  methods:{
  },
  computed:{
    theList() {
        //We need items
        cl('theList() 0')
        if (this.localItems.length == 0) {
            alert('We have no students in list')
            return [{studentid:0, name: 'Anton', surname: 'Klamama'}]
        }
        return this.localItems
    },
  },
  watch: {
    value() {
        this.mainItem = this.value
    },
  }
}
</script>
