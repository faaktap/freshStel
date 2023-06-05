<template>
 <div>
    <v-combobox
        @input="updateValue"
        :value="value"
        :label="label"
        :items="periodList"
        outlined
        clearable
        append-icon="mdi-magnify"
        @click:append="showRooster = true"
    >
    </v-combobox>
    <v-dialog v-if="menemonic" v-model="showRooster" width="auto">
       <rooster :user_name="menemonic" @selected="roosterSelected" />
    </v-dialog>
 </div>
</template>

<script>
import { ls } from "@/api/localStorage.js"
import rooster from "@/components/learn/rooster.vue"
export default {
    name:"ZAutoPeriod",
    components:{rooster},
    props:{
       value:{}
      ,label: {type:String,default:"Period"}
      ,teacher: {type:String,default:""}
    },
    data: () => ({
      periodList: ['Admin','1','2','3','4','5','6','7','8','9','Late'],
      showRooster: false,
      saveIni: 'zmlLastPeriod',
      lastOneSelected:'',
      day:'',
      period:'',
      menemonic:'NONE'
    }),
    methods:{
      updateValue(e) {
        //console.log('update Value',this.$options.name, 'send value = ',e)
        this.$emit('input', e)
        ls.save(this.saveIni,this.value)
        this.lastOneSelected = this.value
      },
      roosterSelected(a,b,c,d,e) {
        this.$cs.l('day',a,'per',b,'grd',c,'row',d,'?',e)
        this.showRooster = false
        this.period = b
        this.day = a
        this.$emit('input', this.period)
        this.$emit('DayAndPeriod', {period:this.period, day:this.day})
      },


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