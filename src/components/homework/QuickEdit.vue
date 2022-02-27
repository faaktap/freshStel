<template>
 <v-row>
  <v-col cols="12" md="6" v-for="i in testArr.length" :key="i">
      <v-layout row>
    <v-flex sm6>
      <v-subheader>{{ testArr[i-1].key }}</v-subheader>
    </v-flex>
    <v-flex sm6>
    <v-text-field @blur="sendBack" class="mx-2" solo dense  v-model="testArr[i-1].value" :label="testArr[i-1].key"/>
    </v-flex>
  </v-layout>

  </v-col>
 </v-row>
 </template>

<script>
export default {
  name: 'QuickEdit',
  components: { },
  props:{
    arrList:{type:Array}  //a json string for arrays
  },
  data () {
    return {
      testArr:[]
    }
  },
  methods: {
    sendBack() {
      let payload = []
      this.testArr.forEach(e => {
        payload.push(e)
      })
      this.$emit('sendback',payload)
      console.log('sendback', payload)
    }
  },
  mounted() {
    console.log('mount', this.$options.name , this.arrList)
    if (this.arrList) {
      this.arrList.forEach(ele => {
        for (const [key, value] of Object.entries(ele)) {
         console.log(`ssss = ${key}: ${value}`);
         this.testArr.push({ key : value})
       }
      })
    } else {
      console.log('arrList is blank')
    }
    console.log('array = ', this.testArr)
  }
}
</script>
