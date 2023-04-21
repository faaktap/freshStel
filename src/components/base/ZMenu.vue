<template>
<!--
  https://v2.vuetifyjs.com/en/components/navigation-drawers
  mini-variant  (default 56px)
  mini-variant-width
  expand-on=hover Places the component in mini-variant mode and expands once hovered
  img : src="https://cdn.vuetifyjs.com/images/backgrounds/bg-2.jpg"
        Apply a custom background to your drawer via the src prop.
        If you need to customize v-img's properties you can use the img slot.
  permanent vs floating : By default, a navigation drawer has a 1px right border that separates it from content.
  right Navigation drawers can also be positioned on the right side of your application (or an element).
  absolute
  temporary  A temporary drawer sits above its application and uses a scrim (overlay) to darken the background.
             This drawer behavior is mimicked by default when on mobile. Clicking outside of the drawer will cause it to close.
  v-model : best to have a v-model like drawer when using Temporary and absolute
            <v-btn color="pink" dark @click.stop="drawer = !drawer" > Toggle </v-btn>
            make it null to start off with : see https://v2.vuetifyjs.com/en/components/navigation-drawers/#combined-drawer
  -->
<!--
    :dark="dark"
    :floating="true"
    :right="false"
    :temporary="false"
    :expand-on-hover="expandOnHover"
    -->

  <v-navigation-drawer
    :expand-on-hover="cexpandOnHover"
    :permanent="cpermanent"
    :floating="cfloating"
    :right="cright"
    :temporary="ctemporary"
    :absolute="ctemporary"
    :dark="cdark"

  >
        <v-list>
          <v-list-item class="px-2">
            <!-- <v-list-item-icon> -->
              <p-icon small :name="topIcon" :width="topIconWidth" />
            <!-- </v-list-item-icon> -->
              {{ topText }}
          </v-list-item>

        </v-list>

        <v-divider></v-divider>

        <v-list nav
               :dense="cdense"
        >
         <template v-if="show=='all'">
          <v-list-item link v-for="i in pwIconsDemo" :key="i.alias" @click="$emit('selected',i.alias)">
            <v-list-item-icon>
              <p-icon :name="i.alias" :width="iconWidth" />
            </v-list-item-icon>
            <v-list-item-title>{{ i.alias }}</v-list-item-title>
          </v-list-item>
         </template>

         <template v-if="show=='passed'">
          <v-list-item link v-for="i in passed" :key="i" @click="$emit('selected',i)">
            <v-list-item-icon>
              <p-icon :name="i" :width="iconWidth" />
            </v-list-item-icon>
            <v-list-item-title>{{ i }}</v-list-item-title>
          </v-list-item>
         </template>

        </v-list>

      <template v-slot:append>
        <slot  name="Bottom" >
          <!-- <span class="text-caption"> {{ allProps }} </span> -->
        </slot>
      </template>

  </v-navigation-drawer>
</template>


<script>
import { cl } from "@/api/util.js"
export default {
    name:"ZMenu",
    props:{
      permanent: {default: true},
      expandOnHover: {default: true},
      dark: { default: false},
      right: { default: false},
      temporary: { default: false},
      floating: { default: false},
      dense: { default: true},

      topText: {default: 'welcome'},
      topIcon: {default: 'pierre'},
      topIconWidth: { default: '25'},
      show: {default: 'all'},
      iconWidth: {default: '20'},
      passed: {default: () => ['brand', 'product']}
    },
    data:() => ({
       pwIconsDemo: [
      { alias: "brand"  , icon: "images/icon-brand.svg", type: "img" },
      { alias: "product", icon: "images/icon-bottle.svg", type: "img" },
      { alias: "company", icon: "images/icon-company.svg", type: "img" },
      { alias: "cancel" , icon: "images/icon-cancel.svg", type: "img" },
      { alias: "save"   , icon: "images/ic  on-save.svg", type: "img" },
      { alias: "load"   , icon: "images/icon-load.svg", type: "img" },
      { alias: "item-ok", icon: "images/icon-item-ok.svg", type: "img" },
      { alias: "items-ok", icon: "images/icon-items-ok.svg", type: "img" },
      { alias: "page-ok", icon: "images/icon-page-ok.svg", type: "img" },
      { alias: "poep"   , icon: "images/icon-poep.svg", type: "img" },
      { alias: "werner" , icon: "images/icon-werner.svg", type: "img" },
      { alias: "pierre" , icon: "images/icon-pierre.svg", type: "img" },
      { alias: "brain"  , icon: "mdi-brain", type: "icon" },
      { alias: "home"   , icon: "images/icon-home.svg", type: "img" },
      { alias: "qna"    , icon: "images/icon-qna.svg", type: "img" },
      { alias: "login"  , icon: "images/icon-login.svg", type: "img" },
      { alias: "register", icon: "images/icon-register.svg", type: "img" },
      { alias: "about"  , icon: "images/icon-about.svg", type: "img" },
      ],
    }),
    methods: {
      doAClick(e1) {
        cl('we got a click', e1)
      },
    },
    computed: {
          allProps() {
            return  `P${this.cpermanent}|E${this.cexpandOnHover} |D${this.cdark} |T${this.ctemporary}|F${this.cfloating}|R${this.cright}|D${this.cdense}`
          },
          cpermanent() {
            let t = this.permanent
            if (t == undefined) return false
            return t
          },
          cexpandOnHover() {
            let t = this.expandOnHover
            if (t == undefined) return false
            console.log('expanOnHover', this.expandOnHover)
            return t
          },
          cdark() {
            let t = this.dark
            if (t == undefined) return false
            return t
          },
          ctemporary() {
            let t = this.temporary
            if (t == undefined) return false
            return t
          },
          cfloating() { if (this.floating == undefined) return false;return this.floating },
          cright() { if (this.right == undefined) return false ;return this.right },
          cdense() { if (this.dense == undefined) return false; return this.dense },

    },
    mounted() {
        console.log('ons in in regte menu component', this.allProps)
    },
    watch:{
      allProps(newP) {
        console.log('ZMenu Change Detected : ',newP,this.allProps)
      }
    }
}
</script>