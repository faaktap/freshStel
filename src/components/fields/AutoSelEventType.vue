<template>
    <v-combobox
        v-if="dataReady"
        @input="updateValue"
        :value="value"
        :label="label"
        :items="items"
        :item-text="showText"
        item-value="id"
        outlined
        clearable
        :disabled="disabled"
        return-object
    >
    </v-combobox>
</template>

<script>
import { ls } from "@/api/localStorage.js"
import { zmlF } from '@/api/zmlF.js'
export default {
    name:"ZEventType",
    components:{},
    props:{ value:{}
          , label: {type:String,default:"Event"}
          , disabled: { type: Boolean, default:false }
    },
    data: () => ({
      typeData:{},
      saveIni: 'zmlLastEvtType',
      lastOneSelected:'',
      dataReady: false,
      sortProb: []
    }),
    methods:{
      updateValue(e) {
        //console.log('update Value',this.$options.name, 'send value = ',e)
        this.$emit('input', e)
        ls.save(this.saveIni,this.value)
        this.lastOneSelected = this.value
      },

    },
    computed: {
      showText() { return item => item.description + ' : ' + item.eventtype  },
      items() {
        if (this.dataReady == false) return []
        return this.typeData.response  //this.sortProb  ///
      }
    },
    created() {
      if (ls.test('zmlEventTypes')) {
        this.typeData = ls.load('zmlEventTypes')
        this.dataReady = true
      } else {
        this.typeData.task = "PlainSql"
        this.typeData.action = "refresh"
        this.typeData.sql = 'select * from dkhs_eventtype'
        this.typeData.data = {}
        this.typeData.headers = [{text:'id', value:'id'}, {text:'type', value:'eventtype'}, {text:'Desc', value:'description'},{text:'color', value:'color'}]
        zmlF.ZQR(this.typeData, () => {
          this.typeData.response = this.typeData.response.sort((a, b) => a.eventtype.localeCompare(b.eventtype))
          this.sortProb = this.typeData.response.sort((a, b) => a.description.localeCompare(b.description))
          this.dataReady = true
          ls.save('zmlEventTypes',this.typeData)
          console.log('DATA WAS LOADED!!!!'); }
        )
      }

    },
    mounted() {
      if (this.value) {
          this.lastOneSelected = this.value
      } else {
          this.lastOneSelected = ls.load(this.saveIni)
      }
      if (this.periodList == 0) alert('we need a few periods!')

    },
    watch: {
      teacher(n) {
        if (n && n.length) { this.menemonic = this.teacher  }
      }
    }
}
</script>