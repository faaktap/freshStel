<template>
  <div class="ma-3 pa-4 grey lighten-3 caption">
    <h4>{{obj.schema.label}}</h4>
    <h4> "{{inp}}"  label="Basic" </h4>
    <hr>
    <br>
      type: {{type}}
    <br>
    value: {{value}}
    <br>
    obj: {{obj}}
  </div>
</template>

<script>
const outside = 'https://github.com/wotamann/vuetify-form-base/blob/master/example/src/components/customcomponent-basic.vue'
export default {
  name:"VCustom",
  props: ['type','value', 'obj'],
  data: () => ({
      outside
  }),
  computed:{
    inp:{
      get(){  return this.value},
      set(v){ this.$emit('input', v)}
    }
  }
}
</script>