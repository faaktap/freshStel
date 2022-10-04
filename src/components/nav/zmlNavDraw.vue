<template>
<!--Layout menu call
-->
<!--
    <zml-nav-draw
      :drawer="drawer"
      @drawer="drawer = $event"
      @clipped="clipped = $event"
      @footerFixed="footerFixed = $event"
  />
  There is two way talking for drawer and clipped, since we use clipped and drawer in the v-app
  component as well. So we send an event back if it changes. And we receive a change via v-bind
-->

<!------------------------------------------- N A V I G A T I O N  D R A W E R -->
    <v-navigation-drawer app
       v-if="getZml.login.type == 'admin' || getZml.login.userid == 38"
       v-model="localDrawer"
       :mini-variant="miniVariant"
       :clipped="localClipped"
       :fixed="fixedDrawer"
    >
    <zml-nav-menu :drawer="localDrawer"
                  :mini-variant="miniVariant"
                  @showSettingsDialog="showSettingsDialog = true"
                  @drawer="localDrawer = $event"
    />

<!------------------------------------------- D I A L O G - - S E T T I N G S  -->
 <v-dialog v-model="showSettingsDialog"
          :fullscreen="$vuetify.breakpoint.mobile"
           max-width="600"
           width="auto">
   <v-card class="pa-2">
  <v-card-title>
   <span> Settings </span>
   <v-spacer />
    <v-btn icon @click="showSettingsDialog = false" title="Go Back">
     <v-icon>mdi-close</v-icon>
    </v-btn>
  </v-card-title>

    <base-title-expand  color="gray" >
     <template v-slot:header>
       <v-layout>
         <v-btn icon @click.stop="$vuetify.theme.dark=!$vuetify.theme.dark"
            title="Change from Dark to Light"
         ><v-icon>mdi-moon-waning-crescent</v-icon></v-btn>

         <v-btn icon @click.stop="fixedDrawer = !fixedDrawer"
            title="Fixed Drawer"
         ><v-icon>mdi-drawing </v-icon></v-btn>

         <v-btn icon @click.stop="miniVariant = !miniVariant"
         ><v-icon>mdi-{{ `chevron-${miniVariant ? 'right' : 'left'}` }}</v-icon></v-btn>

         <v-btn icon @click.stop="localClipped = !localClipped"
                     title="Title clipped or not."
         ><v-icon>mdi-application</v-icon></v-btn>

         <v-btn icon  @click.stop="localFooterFixed = !localFooterFixed"
         ><v-icon>mdi-minus</v-icon></v-btn>
       </v-layout>
     </template>

     <v-simple-table>
     <tr>
      <td><v-btn icon  color="accent"
            :title="'Dark = ' + $vuetify.theme.dark"
            @click.stop="$vuetify.theme.dark=!$vuetify.theme.dark"
       ><v-icon>mdi-moon-waning-crescent</v-icon></v-btn>
       to change from dark to light  </td>
       <td> Dark : {{ $vuetify.theme.dark }}</td>
     </tr>

     <tr>
      <td><v-btn icon @click.stop="fixedDrawer = !fixedDrawer" color="accent">
                      <v-icon>mdi-drawing </v-icon>
      </v-btn> to change a fixed Drawer to a floating one.</td>
      <td> Fixed : {{ fixedDrawer }}</td>
     </tr>

     <tr class="ma-2 pa-2">
       <td><v-btn icon color="accent"
                @click.stop="miniVariant = !miniVariant"
         ><v-icon>mdi-{{ `chevron-${miniVariant ? 'right' : 'left'}` }}</v-icon>
         </v-btn> to make drawer smaller or larger </td><td>Smaller : {{ miniVariant}}
       </td>
      </tr>
      <tr><td>
        <v-btn icon color="accent" @click.stop="localClipped = !localClipped">
         <v-icon>mdi-application</v-icon>
        </v-btn> to make it clipped </td>
        <td> Clipped : {{ localClipped}}</td>
      </tr>

      <tr><td><v-btn icon  color="accent" @click.stop="localFooterFixed = !localFooterFixed"> <v-icon>mdi-minus</v-icon>
       </v-btn> to make the footer fixed </td>
       <td>Footer Fixed : {{ localFooterFixed }}</td>
      </tr>

      <tr><td colspan=2><v-text-field v-model="title" label="title"/></td></tr>
      <tr><td colspan=2><v-text-field v-model="getZml.login.username" label="username"/></td></tr>
     </v-simple-table>
    </base-title-expand>
   </v-card>
 </v-dialog>

    </v-navigation-drawer>

</template>

<script>
import BaseTitleExpand from '@/components/base/BaseTitleExpand.vue'
import zmlNavMenu from '@/components/nav/zmlNavMenu.vue'
import { getters } from "@/api/store";
export default {
  name:'zmlNavDraw',
  components:{
      BaseTitleExpand
     ,zmlNavMenu
  },
  props:['drawer', 'clipped'],
  data () {
    return {
      getZml: getters.getState({ object: "gZml" }),
      localClipped: true,
      localDrawer: null,
      localFooterFixed: false,
      miniVariant: false,
      right: true,
      fixedDrawer:false,
      menuBadgeHover:null,
      showSettingsDialog:false,
      navItems:[
      { icon: 'mdi-printer-wireless',    title: 'Reports',       to: '/reports'  },
      { icon: 'mdi-percent',    title: 'Devaluation',       to: '/Outline'  },
      { icon: 'mdi-bookshelf',  title: 'Journal',             to: '/Outline'  },
      { icon: 'mdi-warehouse',      title: 'Stock',             to: '/Outline'  },
      ],
      title: 'Kuilies Teact Test'
    }
  },
  methods: {},
  mounted() {
      this.localDrawer = this.drawer
      console.log('mnt', this.$options.name)
  },
  watch: {
      drawer() {
          this.localDrawer = this.drawer
      },
      localDrawer() {
        this.$emit('drawer', this.localDrawer)
      },
      localClipped() {
        this.$emit('clipped', this.localClipped)
      }
  }
}

</script>