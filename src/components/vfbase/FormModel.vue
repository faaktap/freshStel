<template>
    <v-form-base
      v-if="displayIt"
        autocomplete="off"
        id="modelform"
        :model="myModel"
        :col=12
        @input="log"
        @click="test"
        @blur="test"
    />
</template>

<script>

import VFormBase from "@/components/vfbase/VFormBase"

export default {
  name: "formModel",
  props: ['passed'],
  components: {
              VFormBase
              },

  data: () => ({
    myModel: {surname:'', name:''},
    displayIt:false
  }),
  computed:{
  },
  methods:{
      log(a) {
          console.info('LOG A = ', a.value)
      },
      test(a) {
        // eslint-disable-next-line
        let { on, id, index, key, value, obj } = a
        console.log('TEST A = ',a)
      },
  },
  activated: function() {
    console.log('Activated : model form:', this.passed)
  },
  mounted: function() {
    if (this.passed) {
      console.log('We got new model:', this.passed)
      this.myModel = this.passed
      this.displayIt = true
    } else {
      this.displayIt = false
    }
  },
  watch: {
    passed() {
      console.log('Watch: We got new model:', this.passed)
      this.myModel = this.passed
      this.displayIt = true
      }
  }

}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Lato:wght@300&display=swap');

.wordbreak {
  overflow-wrap: break-word;
  word-wrap: break-word;
  word-break: break-all;
  word-break: break-word;
  hyphens: auto;
}

.test:hover {
  transform: scaleX(1.5);
}

</style>