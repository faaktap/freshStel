<template>
  <v-card elevation="0" :title="obj.schema.label"
          color="transparent" class="text-center">

  <v-img
    @click="dada"
    @blur="dodo"
    :class="hover ? 'move zoom' : ''"
    :src="realImage"
    :contain="contain"
    :cover="cover"
    :width="obj.schema.width"
  />

  <!-- {{ hover }} {{ cover }} {{ contain }} <br><span class="text-caption"> i={{ inp }}</span> -->
    <!-- <v-img :src="inp" :contain="obj.schema.contain" :width="obj.schema.width" /> -->
    <!-- <h4> "{{inp}}"  label="Basic" </h4>
    <hr>
    <br>
      type: {{type}}
    <br>
    value: {{value}}
    <br>
    obj: {{obj}} -->
  </v-card>
</template>

<script>
const outside = 'https://github.com/wotamann/vuetify-form-base/blob/master/example/src/components/customcomponent-basic.vue'
export default {
  name:"VImage",
  props: ['type','value', 'obj'],
  data: () => ({
      outside,
      hover:false
  }),
  computed:{
    realImage() {
        if (!this.value) return ''
        if ( this.value.indexOf('/') == 0 ) {
            return "https://kuiliesonline.co.za/" + this.value
        }
        return this.value
    },
    cover() {
        if (this.hover == true) return true
        return false
    },
    contain() {
        if (this.hover == true) return false
        return true
    },
    inp:{
      get(){  return this.value},
      set(v){ this.$emit('input', v)}
    }
  },
  methods: {
    dodo(e) {
       console.log(e,'dodo')
       this.hover = false
    },
    dada(e) {
        console.log(e, 'xxxx')
        this.hover = !this.hover
    }
  }
}
</script>

<style scoped>
/*
transform: translate(10px, 10px) scale(0.95) rotate(10deg)
https://css-tricks.com/how-they-fit-together-transform-translate-rotate-scale-and-offset/
*/
.zoom {
         transform: translate(65px, 0px) scale(1.9);
         transition: all 0.4s;
         transform-origin: top left;
}
</style>