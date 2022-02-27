<template>
<div>
<v-row> <v-col cols="4">
 <v-card color="gray lighten-2" class="text-caption ma-2 pa-2" >
 inside
 <v-text-field solo dense type="number" v-model="myAC" label="FldCXont" />
 <div v-for="i in Number(myAC)" :key="i">
     <v-text-field dense  v-model="testArr[i-1]" :label="`Heading ${i}`"/>
 </div>
 </v-card>
 </v-col></v-row>


{{ testArr }}

  <array-entry
   :arrayOfValues="testArr"
   @feedback="feedback" />


</div>
</template>

<script>
import ArrayEntry from "@/components/vfbase/ArrayEntry.vue"
export default {
  name: "Bland2",
  components: {ArrayEntry},
  data: () => ({
       myAC : 2,
       testArr: ['hierisdit', 'ennogene' ]
  }),
  methods:{
    feedback(e) {
        console.log('feedback = ', e)
        // this.testComponent = e
    }
  },
  mounted() {
      console.log('Start:' ,this.$options.name )
      this.myAC = this.testArr.length
  }
}
</script>