<template>
        <v-autocomplete
               @input="updateValue"
                v-on:keyup.enter="$event.target.nextElementSibling.focus()"
                :value="value"
                :label="label"
               :items="itemList"
                prepend-inner-icon="mdi-coffin"
                color="blue"
                item-value="placeid"
                item-text="concatsearch"
               :search-input="searchInput"
                dense
              >
        </v-autocomplete>

</template>

<script>
import { getters } from "@/api/store";
import { zmlConfig } from '@/api/constants';
import { zmlFetch } from '@/api/zmlFetch';
export default {
   name:"ZAutoPlace",
   props:{
           value:{}
         , label: {type:String,default:""}
   },
   data: () => ({
     getZml: getters.getState({ object: "gZml" }),
     searchInput: null,
     placeTable: [],
  }),
  computed: {
      itemList() {
        if (!this.searchInput) {
           return this.placeTable
        }
        let si = this.searchInput.toUpperCase()

        let x = this.placeTable.filter(function(str) {
          return ( str.concatsearch.toUpperCase().indexOf(si) > -1);
        })

        return x
      }
  },
  methods:{
    updateValue(e) {
      console.log('updateValue-S_PLACE-...', e)
      let index = this.placeTable.findIndex(ele => ele.placeid == e)
      console.log('updateValue-index...', index)
      if (index > -1) {
        //console.log(this.$options.name, 'send object')
        //this.$emit('objectSelected',this.placeTable[index])
        console.log('updateValue-array object...', this.placeTable[index])
        console.log('emitting...', this.placeTable[index].concatsearch)
        this.$emit('input', this.placeTable[index].concatsearch)
        this.$emit('try', this.placeTable[index].concatsearch)
        return
      }
    },
    getData() {
      let ts = {}
      ts.task = 'PlainSql'
      ts.sql = "SELECT p.placeid, p.name, w.name workarea, p.description,p.ownerid "
           + "     , concat(p.name, ' - ',w.name) concatsearch"
           + "  FROM s_place p, s_workarea w "
           + " WHERE p.workareaid = w.workareaid "
           + "ORDER BY p.name"
      ts.api = zmlConfig.apiPath
      zmlFetch(ts, this.loadData)

    },
    loadData(response) {
      this.placeTable = response
    }
  },
  mounted() {
    console.log('Start' , this.$options.name,this.placeTable.length)
    if (this.placeTable.length == 0) this.getData()
  },
}
</script>
