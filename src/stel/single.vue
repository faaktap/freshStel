<template>
 <div>
    <h3> {{ a.desc }} - {{ a.id }}</h3>
    <br>response length : {{ a.response.length }}
    <br>showEror: {{ zmlF.showDBError(a.response) }}
    <br>Status: {{ zmlF.statusText(a.workDone) }}
    <br>isGood: {{ zmlF.isGoodData(a.response) }}
    <br>progress: {{ a.progress }}
    <v-btn x-small @click="a.processor('refresh',a)"> refresh </v-btn>
    <br>SQL:<v-textarea v-model="a.sql" :label="a.desc + ' sql statement'" />
    <hr>
    <base-table v-if="zmlF.isGoodData(a.response)"
                :tList="a.response" :tHeading="`len=${a.response.length || 'error'}`"
                :bHeading="a.desc" @bonga="bonga"
    />
 </div>
</template>

<script>

import BaseTable from    '@/components/base/baseTable'
import { zmlF } from '@/stel/zmlF.js'
export default {
    components: {
       BaseTable
    },
    props: [],
    data () {
      return {
        zmlF:zmlF,
        a:{ id:0
          , desc: "ZML Constants"
          , workDone: 0
          , response: []
          , processor: (action,element) => {this.doSomething(action,element)}
          , sql:`SELECT * from zml_constant`
          , progess:false
        }
       }
   },
   created() {
     zmlF.ZF(this.a)
   },
   mounted() {
   },
   computed: {
   },
   methods: {
     bonga(e1,e2) {
        console.log('he Clicked:',e1,e2)
     },
     doSomething(action,dataObject) {
        if (action=='refresh') {
          dataObject.response = ''
          zmlF.ZF(dataObject)
        }
     },
   }
}
</script>
