<template>
  <v-container fluid>
   <h4>Choose fields for this student list</h4>
   <v-card>
<v-text-field solo dense type="number" v-model="myAC" label="FldCXont" />
 <div v-for="i in Number(myAC)" :key="i">
     <v-text-field @blur="sendBack" dense  v-model="testArr[i-1]" :label="`Heading ${i}`"/>
 </div>
    </v-card>
  </v-container>
</template>

<script>
export default {
  name: 'Params',
  components: { },
  props:{
    arrList:{type:Array}  //a json string for arrays
  },
  data () {
    return {
      myAC:3,
      testArr:[]
    }
  },
  methods: {
    sendBack() {
      let payload = []
      this.testArr.forEach(e => {
        payload.push({'heading' : e})
      })
      this.$emit('sendback',payload)
    }
  },
  mounted() {
    console.log('mount', this.$options.name , this.arrList)
    if (this.arrList) {
       let arrLocal = this.arrList
       console.log('WE GOT SOME PROPS',this.arrList, this.arrList.length)
       arrLocal.forEach(e => {
        this.testArr.push(e.heading)
        })
        this.myAC = this.testArr.length
        console.log('values assigned', this.testArr)
    } else {
      console.log('arrList is blank')
    }
  }
}
</script>
