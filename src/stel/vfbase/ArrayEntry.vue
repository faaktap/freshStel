<template>
<div>
<v-row> <v-col cols="4">
 <v-card color="gray lighten-2" class="text-caption ma-2 pa-2" >

      <v-form-base
        id="myUniqueID"
        :model="myModel"
        :schema="mySchema"
        @input="processInput"
        @blur="itblurred"
      >
      </v-form-base>
<!--        @input="processInput"
        @click="processInput"
        @blur="processInput"
-->

 </v-card>
       </v-col></v-row>
 <v-card color="red">
     Answer(myModel) = {{ myModel }}
 </v-card>
</div>
</template>

<script>
import VFormBase from "@/components/vfbase/VFormBase.vue"
export default {
  name: "ArrayEntry",
  components: {VFormBase},
  props:{arrayOfValues:Array},
  data: () => ({
    propName:'heading',  // heading must be same as schema's heading
    myModel: {
       myArray: [],
       myArrayCount: 4
    },
    mySchema: {
      myArrayCount:{type:'number'
                  , label: 'Field Count'
                  , prependInnerIcon:"mdi-alpha-n-circle"
                  , solo:true
                  , tooltip:'Add the amount of entry fields'
      },
      myArray: {
        type: 'array',
        col: 12,
        key:"heading",
        schema: {
            heading:{ type:'text'
                     ,label:'enter something'
                  //   ,solo:true
                  //   ,tooltip:'Give the heading a name'
                     ,prependInnerIcon: "mdi-head"}
        }
      }

    }
  }),
  methods:{
      processInput(a) {
        let { on, key } = a
        //console.log('TEST A = ',this.myModel.myArray.length ,on, key)
        if (on=='input' && key=='myArrayCount') {
            if (this.myModel.myArray.length > this.myModel.myArrayCount) {
                this.myModel.myArray.splice(this.myModel.myArray.length-1,1)
            }
            if (this.myModel.myArray.length < this.myModel.myArrayCount) {
                this.myModel.myArray.push({heading: ''})
            }
            if (this.myModel.myArrayCount == 0) this.myModel.myArrayCount++
            if (this.myModel.myArrayCount == 15) this.myModel.myArrayCount--
        }

      },
      itblurred(e) {
        console.log('it blurred',e)
        this.$emit('feedback', this.myModel.myArray)
      }
  },
  mounted() {
      console.log('Start:' ,this.$options.name )
      if (this.arrayOfValues) {
        console.log('WE GOT SOME PROPS',this.arrayOfValues)
        this.arrayOfValues.forEach(e => {
        const obj = {}
        obj[this.propName] = e
        this.myModel.myArray.push(obj)
        })
        this.myModel.myArrayCount = this.arrayOfValues.length
      } else {
          //create demo data
          for(let i = 0; i < 4; i++) {
              const obj = {}
              obj[this.propName] = `Whatever - ${i}`
              this.myModel.myArray.push(obj)
          }

      }
  }
}
</script>