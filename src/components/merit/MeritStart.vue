<template>
<div>
<v-container fluid v-if="['admin','teacher'].includes(getZml.login.type) == false">
    You are not logged in, or you are not a teacher!
</v-container>


<v-container fluid>

<v-toolbar  dense  row  wrap :collapse="$vuetify.breakpoint.smAndDown">
    <v-app-bar-nav-icon  v-if="$vuetify.breakpoint.smAndDown" @click.stop="drawer = !drawer">
    </v-app-bar-nav-icon>
    <v-navigation-drawer v-model="drawer" absolute temporary >
      <base-tool-button @click="showMeritPoint"
               class="mt-1 mr-2 mb-2 ml-2"
               label="Merit Point Allocation"
               icon="mdi-calculator-variant"
      >Merit Point Allocation</base-tool-button>

      </v-navigation-drawer>
      Merit System Start
      <v-spacer />
      <base-tool-button @click="showMeritPoint"
               class="mt-1 mr-2 mb-2 ml-2"
               label="Merit Point Allocation"
               icon="mdi-calculator-variant"
      >Merit Point Allocation</base-tool-button>

  </v-toolbar>
  <v-card class="pa-3 mt-5">
    <v-card-title> Info </v-card-title>
    <v-card-text> About each objevg </v-card-text>
    <v-card-text>
      <v-simple-table>
        <tr><td>First optionsdf </td> <td> Descriptisodfnm ofdv sdf iuher xfv oprsdtds</td></tr>
        <tr><td>First optionsdf </td> <td> Descriptisodfnm ofdv sdf iuher xfv oprsdtds</td></tr>
        <tr><td>First optionsdf </td> <td> Descriptisodfnm ofdv sdf iuher xfv oprsdtds</td></tr>

      </v-simple-table>
    </v-card-text>
  </v-card>
</v-container>
</div>
</template>

<docs>
Here is some documentation
</docs>
<script>
import { getters } from "@/api/store"
//import { zData } from "@/api/zGetBackgroundData.js"
//import { infoSnackbar } from "@/api/GlobalActions"
import BaseToolButton from '@/views/new/base/BaseToolButton.vue'

export default {
    name: 'MeritTable',
    components:{
       BaseToolButton
    },
    data () {
      return {
        drawer: false,
        getZml: getters.getState({ object: "gZml" }),
    }},
    methods: {
      showMeritPoint() {
         this.$router.push({ name: 'MeritPoint'})
      }
    },
    computed: {    },
  }
</script>
