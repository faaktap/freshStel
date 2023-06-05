<template>
<!--                  :rules="reqrule ? rules.required : []"

<z-auto-pers label="Teacher"
             v-model="apersid"
             class="mx-7 pr-11 mt-4"
             @objectSelected="apersobj=$event"
/>
import ZAutoPers from '@/components/fields/ZAutoPers.vue'
-->
        <v-autocomplete
                ref="myPersAutoCompleteField"
                type="text"
               @input="updateValue"
               @change="testevt($event,'change----')"
               @update="testevt($event,'update----')"
               @blur="testevt($event,'blur----')"
                :value="value"
                :label="label"
               :items="searchPersonel"
                prepend-inner-icon="mdi-human"
                item-value="persid"
                item-text="user_fullname"
               :search-input.sync="searchInput"
               no-filter
               return-object
               clearable
               hide-no-data
               hide-details
               dense outlined
               validate-on="input"
              >
              <!-- "userid": "70", "persid": "178", "user_name": "TRUT", "user_fullname": "Me. M. Truter"
                , "surname": "Truter", "name": "Marnel", "title": "title", "workemail": "MTruter@dekhs.co.za"
                , "room": "D2", "user_type": "teacher" -->
              <template slot="selection" slot-scope="{item}">
                  {{ item.user_fullname }}
                  <!-- {{ item.user_fullname }} ( {{ item.room }} )  {{ item.user_name}} -->
              </template>
              <template slot="item" slot-scope="{item}">
                   {{ item.surname }}, {{ item.name}}  -   {{ item.user_name}} {{ item.user_type }}
              </template> -->
        </v-autocomplete>
</template>

<script>
import { getters } from "@/api/store";
import { ls } from "@/api/localStorage.js"
import { zData } from "@/api/zGetBackgroundData.js"

//Need to see if we can do something better here....
let kaka = {
  waitAndRun : function(f1) { setTimeout( function () {  if (f1) {f1();}   }, 50);},
  valueToReturn : ''
}


export default {
   name:"ZAutoPers",
   props:{
     value:{}
    ,label: {type:String,default:"Personel/Staff"}
   },
   data: () => ({
     persMenemonic: getters.getState({ object: "gZml" }).persMenemonic,
     searchInput: '',
     lastOneSelected:'',
     saveIni: 'zmlLastPersSelected'
  }),
  computed: {
      searchPersonel() {
        //console.log('searcPersonel: val=', this.searchInput)
        if (!this.searchInput) {
           return this.persMenemonic
        }
        //convert obj to array, join array, and uppercase it - then search for any text inside.
        let x = this.persMenemonic.filter(
          str => Object.values(str).join().toUpperCase().includes( this.searchInput.toUpperCase() )
        )
        return x
      }
  },
  methods:{
    testevt() {
      if (this.value) ls.save(this.saveIni,this.value)
    },
    updateValue(e) {
      //console.log(this.$options.name,'update and send Value ',e)
      this.$emit('input', e.persid)
      let index = this.persMenemonic.findIndex(ele => ele.persid == e)
      this.$emit('objectSelected',this.persMenemonic[index])
      ls.save(this.saveIni,this.value)
      this.lastOneSelected = this.value
    },
    doLookupOnStart() {
      //console.log('LOOKUPStart' , this.$options.name, 'lastone?',this.lastOneSelected)
      if (!this.lastOneSelected) return
      this.$refs.myPersAutoCompleteField.focus();
      let index = this.persMenemonic.findIndex(ele => ele.persid == this.lastOneSelected)
      //console.log(this.$options.name,'examing last one selected for a lookup index=',index, 'lastone',this.lastOneSelected)
      if (index > -1) {
        //console.log(this.$options.name, 'set searchInput to',this.persMenemonic[index].user_fullname, index, this.persMenemonic)
        this.searchInput =  this.persMenemonic[index].user_fullname
        this.value = this.persMenemonic[index]
        this.$emit('objectSelected',this.persMenemonic[index])
        this.$emit('input', this.lastOneSelected)
        //console.log('valudate',this.$refs.myPersAutoCompleteField.validate());
      }
    },
    loadData(resp) {
       console.log(this.$options.name,'Load Data = Response = ', resp)
       kaka.waitAndRun(this.doLookupOnStart)
    },

  },
  mounted() {
    if (this.value) {
        this.lastOneSelected = this.value
    } else {
        this.lastOneSelected = ls.load(this.saveIni)
    }
    if (this.persMenemonic.length == 0) this.persMenemonic = ls.load('zmlPersM')

    console.log('Start' , this.$options.name, 'lastone?',this.lastOneSelected)
    if (this.persMenemonic.length == 0) {
        zData.initialData('load new data - ini/ls is empty', this.loadData)
    } else {
      this.loadData()
    }
  }
}
</script>
