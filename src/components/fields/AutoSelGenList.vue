<template>
    <v-combobox
        @input="updateValue"
        :value="value"
        :label="label"
        v-model="what"
        :items="tickList"
        item-text="name"
        item-value="id"
        outlined
        clearable
    >
    </v-combobox>
</template>

<script>
export default {
    name:"AutoSelGenList",
    props:{
       value:{}
      ,label: {type:String,default:"Questions"}
    },
    data: () => ({
      tickList: [{id:1, name: "Homework", questions: ['Yes','No','Ignore']}
              ,{id:2, name: "Textbooks", questions: ['Yes','No','Ignore']}
              ,{id:3, name: "PATT/ASS", questions: ['0%','25%','50%','75%','100%','Submitted','Ignore']}
              ,{id:4, name: "Behaviour", questions: ['Conduct','Outburst','Disruptive','Discipline','Hyper','Noisy','Cellphone','Substance','Sleeping','Ignore']}
              ],

      what:'',
    }),
    methods:{
      updateValue(value) {
        //console.log('UpdateVakue',this.$options.name, value)
        if (!value) return
        let id = value.id
        this.$emit('input', id)
        this.$emit('objInput', value)
      },

    },
    mounted() {
      //console.log('Mount',this.$options.name)
      if (this.value) {
          this.what = this.tickList.find(el => el.id == this.value)
      } else {
          this.what = ''
      }
      if (this.tickList.length == 0) alert('we need a general List!! - call werner please')
      //console.log('FirstCall',this.$options.name, this.what)
      this.updateValue(this.what)

    },
    watch: {
      what() {
        if (this.what) {
          //console.log(this.$options.name, 'watch', this.what)
          this.updateValue(this.what)
        }
      }
    }
}
</script>