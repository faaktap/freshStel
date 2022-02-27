<template>
 <v-btn @click="$emit('click')"
        class="pclass"
        small
        :color="color"
        :disabled="disabled"
        :loading="loading"
 >
   <v-icon v-if="icon" left>{{ icon }}</v-icon>
  <slot v-if="!$vuetify.breakpoint.smAndDown">
      {{ text }}
  </slot>

</v-btn>
</template>

<script>

export default {
  name: "BaseButton",
  props: {
      color:{type:String, default:"blue lighten-1"}
    , pclass:{type:String, default:'text-caption mr-2 pa-0'}
    , loading:{type:Boolean, default:false}
    , disabled:{type:Boolean, default:false}
    , icon:{ type:String, default:''}
  },
  computed: {
     testSmall() {
        if (this.$vuetify.breakpoint.smAndDown == true) {
          return true
        } else {
          return false
        }
     }
  },
  methods: {}
}
</script>
