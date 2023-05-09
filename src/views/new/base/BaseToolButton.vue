<template>
 <v-btn @click="$emit('click',value)"
        class="pclass"
        small
        :color="color"
        :disabled="disabled"
        :loading="loading"
        :to="to"
        :icon="$vuetify.breakpoint.smAndDown"
 >

       <v-badge color="warning" v-if="badge.length > 0" :title="badgeTitle" left inline>
        <span slot="badge"> {{ badge }} </span>
        <!-- <v-icon x-small color="warning">mdi-information</v-icon> -->
      </v-badge>


   <v-icon v-if="icon" left>{{ icon }}</v-icon>
  <slot v-if="!$vuetify.breakpoint.smAndDown">
      {{ text }}
  </slot>

</v-btn>
</template>

<script>

export default {
  name: "BaseTButton",
  props: {
      color:{type:String, default:"blue lighten-1"}
    , pclass:{type:String, default:'text-caption mr-2 pa-0'}
    , loading:{type:Boolean, default:false}
    , disabled:{type:Boolean, default:false}
    , icon:{ type:String, default:''}
    , value:{type:String, default:''}
    , badge: {type:String, default: ''}
    , badgeTitle: {type:String, default: ''}
    , to: {type:String, default: ''}
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
