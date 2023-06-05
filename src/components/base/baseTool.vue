<template>
<!--
  Emitted event will go thru as toolclick
  and will emit either task if give, or name, or icon otherwise button position
  So: If there is no data on button, a number from0 to however button there are will be emitted
  See: $emit('toolClick',t.task||t.name||t.icon||i)

  The button name will be replaced with and icon, or a number if size is smaller than grootGenoe

  The color will be  "green" if no color is provided

  v-toolbar-items acts funny, so the buttons are not wrapped in it.

  Using a vertical menu does not want to work lekker, also could later fiddle with collapse on toolbar
  (don't think my users will understan collapse)
  -->
  <v-toolbar elevation="3"
             color="primary"
             :src="showImg ? 'img\\toolbar.jpg' : ''"
             :collapse="$vuetify.breakpoint.smAndDown"
             class="ml-0 mr-0 pl-0 pr-0 mb-4">
    <v-app-bar-nav-icon @click="appBar = !appBar"> </v-app-bar-nav-icon>
    <v-toolbar-title v-if="toolbarName">
      {{ toolbarName }}
    </v-toolbar-title>
<v-navigation-drawer
        floating
        v-model="appBar"
        absolute
        temporary
      >
      <v-card>
        <v-list
          dense
          rounded
        >
        <v-list-item v-for="(t,i) in toolList" :key="t.name" @click="$emit('toolClick',t.task||t.name||t.icon||i)">
         <v-list-item-content>
          <v-list-item-title>{{ t.task||t.name||t.icon||i }}</v-list-item-title>
        </v-list-item-content>

        </v-list-item>
        </v-list>
      </v-card>
</v-navigation-drawer>
    <v-overlay v-if="loading" :value="loading">
      <v-progress-circular indeterminate size="84">
        Thinking ...
      </v-progress-circular>
    </v-overlay>
    <v-spacer />
    <!-- <v-toolbar-items v-if="$vuetify.breakpoint.mdAndUp && toolList.length" class="ma-2 pa=2"> -->

         <v-btn small class="mr-1"
                v-for="(t,i) in toolList" :key="t.name"
                :color="t.color || 'white'"
                :icon="(!grootGenoeg || !t.name) ? true : false"
                @click="$emit('toolClick',t.task||t.name||t.icon||i)"
         >
          <v-icon v-if="t.icon || !grootGenoeg" color="t.color || 'white'">
            {{t.icon || i }}
          </v-icon>

          <v-badge v-if="t.badge" color="warning" left offset-y="3" offset-x="1" overlap>
           <span slot="badge"> {{ t.badge }} </span>
          </v-badge>

          <slot v-if="grootGenoeg && t.name">
            {{ t.name }}
          </slot>
         </v-btn>
         <slot>
         </slot>
         <v-back v-if="showBack"/>
  </v-toolbar>
</template>

<script>
import VBack from '@/components/base/VBack.vue'
export default {
    name:"baseTool",
    props:["toolList","toolbarName","loading","background","back"],
    components:{VBack},
    data: () => ({
        appBar: false
    }),
    computed: {
      grootGenoeg() {
        return this.$vuetify.breakpoint.smAndUp && this.toolList.length
      },
      showBack() {
        if (this.back == undefined) return true
        if (this.back == true) return true
        return false
      },
      showImg() {
        //console.log('what is background?' , this.background)
        if (this.background == undefined) return true
        if (this.background == true || this.background == false) return this.background
        return false
      }
    }
}
</script>
