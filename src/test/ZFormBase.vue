<template>
<v-container fluid>
     <v-form-base
        v-if="mySchema"
        autocomplete="off"
        id="zBaseForm"
        :model="myModel"
        :schema="mySchema"
        :col=12
        @click="test"
        @blur="blurtest"
     >
     </v-form-base>
 </v-container>
</template>

<script>
import VFormBase from "@/components/vfbase/VFormBase.vue"
export default {
    name:'ZFormBase',
    components:{VFormBase},
    props:['mySchema'],
    data: () => ({
      myModel: {},
    }),
    methods:{
      test(e) {
        console.log('test click on form', e)
        if (e.key == 'werner') {
           console.log('e.params.text', e.params.text)
        }
      },
      blurtest() {
        this.$emit('done', this.myModel)
      }

    },
    mounted() {
        console.log('start : ', this.$options.name)
    },
    watch: {}
}
</script>