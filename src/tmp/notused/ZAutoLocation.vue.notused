<template>
<!--                  :rules="reqrule ? rules.required : []"

<z-auto-location label="Teacher"
             v-model="alocid"
             class="mx-7 pr-11 mt-4"
             @objectSelected="alocobj=$event"
/>
import ZAutoLocation from '@/components/fields/ZAutoLocation.vue'
-->
        <v-autocomplete
                ref="myPlaceAutoCompleteField"
                type="text"
               @input="updateValue"
               @change="testevt($event,'change----')"
               @update="testevt($event,'update----')"
               @blur="testevt($event,'blur----')"
                :value="value"
                :label="label"
               :items="searchLocation"
                prepend-inner-icon="mdi-office-building-marker-outline"
                item-value="placeid"
               :item-text="itemDisplay"
               :search-input.sync="searchInput"
               no-filter
               return-object
               clearable
               hide-no-data
               hide-details
               dense outlined
               validate-on="input"
              >
              <!--  { "placeid": "86", "name": " 18", "workarea": "Gang 1 (17-24)", "description": "Me. A. Beneke - Teacher"
                    , "ownerid": "186", "concatsearch": " 18 - Gang 1 (17-24)" }, -->
              <template slot="selection" slot-scope="{item}">
                  {{ item.name }} - {{ item.workarea }}
              </template>
              <template slot="item" slot-scope="{item}">
                   {{ item.name }}, {{ item.workarea}}  -   {{ item.description }}
              </template> -->
        </v-autocomplete>
</template>

<script>
import { getters } from "@/api/store";
import { ls } from "@/api/localStorage.js"
import { zData } from "@/api/zGetBackgroundData.js"

//Need to see if we can do something better here....
let kaka = {
  waitAndRun : function(f1) { setTimeout( function () {  if (f1) {f1();}   }, 20);},
  valueToReturn : ''
}


export default {
   name:"ZAutoLocation",
   props:{
     value:{}
    ,label: {type:String,default:"Location/Class Room"}
   },
   data: () => ({
     place: getters.getState({ object: "gZml" }).place,
     searchInput: '',
     lastOneSelected:'',
     saveIni:'zmlLastPlaceSelected',
  }),
  computed: {
      searchLocation() {
        //console.log('searcPlace: val=', this.searchInput)
        if (!this.searchInput) {
           return this.place
        }
        //convert obj to array, join array, and uppercase it - then search for any text inside.
        let x = this.place.filter(
          str => Object.values(str).join().toUpperCase().includes( this.searchInput.toUpperCase() )
        )
        return x
      },
      itemDisplay() {
        return item => item.name + ' - ' + item.concatsearch + ' - ' + item.placeid
      }
  },
  methods:{
    testevt() {
      //console.log(this.$options.name,e2,e1)
      if (this.value && typeof(this.value) != 'object') {
        ls.save(this.saveIni,this.value)
        console.log(this.$options.name, 'saving to saveini ', this.value, this.lastOneSelected)
      }
    },
    updateValue(e) {
      //console.log('update Value',this.$options.name, 'send value = ',e)
      this.$emit('input', e.placeid)
      let index = this.place.findIndex(ele => ele.placeid == e)
      this.$emit('objectSelected',this.place[index])
      ls.save(this.saveIni,this.value)
      this.lastOneSelected = this.value
    },
    doLookupOnStart() {
      console.log('LOOKUPStart' , this.$options.name, 'lastone?',this.lastOneSelected)
      if (!this.lastOneSelected) return
      let index = this.place.findIndex(ele => ele.placeid == this.lastOneSelected)
      console.log('examing last one selected for a lookup index=',index, 'lastone',this.lastOneSelected)
      if (index > -1) {
        console.log('set searchInput to',this.place[index].concatsearch)
        this.$refs.myPlaceAutoCompleteField.focus();
        this.value = this.place[index]
        this.searchInput =  this.place[index].concatsearch

        console.log('sdffffffffffffffffffffffffffffff', this.value)
        this.$emit('objectSelected',this.place[index])
      }
    },
    loadData() {
       console.log(this.$options.name, 'Load Data')
       kaka.waitAndRun(this.doLookupOnStart)
    },

  },
  mounted() {
    if (this.value) {
        this.lastOneSelected = this.value
    } else {
        this.lastOneSelected = ls.load(this.saveIni)
    }
    if (this.place.length == 0) this.place = ls.load('lookupPlace')

    console.log('Start' , this.$options.name, 'lastone?',this.lastOneSelected)
    if (this.place.length == 0) {
        zData.initialData('load new data - ini/ls is empty', this.loadData)
    } else {
      this.loadData()
    }
  }
}
</script>
