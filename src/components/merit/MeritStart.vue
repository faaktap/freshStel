<template>
<div>
<v-container fluid v-if="['admin','teacher'].includes(getZml.login.type) == false">
    You are not logged in, or you are not a teacher!
</v-container>


<v-container fluid>

<v-toolbar  dense  row  wrap color="primary">
      Merit System Start
      <v-spacer />
      <base-tool-button @click="showMeritPoint"
               class="mt-1 mr-2 mb-2 ml-2"
               color="secondary"
               title="Merit Point Allocation"
               icon="mdi-calculator-variant"
      >Merit Point Allocation</base-tool-button>

      <base-tool-button @click="showMeritPers"
               class="mt-1 mr-2 mb-2 ml-2"
               color="secondary"
               title="Merit Confirmation"
               icon="mdi-trophy-award"
      >Merit Approval</base-tool-button>

      <base-tool-button @click="showMeritTable"
               class="mt-1 mr-2 mb-2 ml-2"
               color="secondary"
               title="Merit Text"
               icon="mdi-home-edit"
      >Merit Edit Text</base-tool-button>

      <v-back />
  </v-toolbar>

  <v-card class="pa-3 mt-5">
    <v-card-title> Info </v-card-title>
    <v-card-text> Short note on each function (button above) </v-card-text>
    <v-card-text>
      <v-simple-table>
        <tr><td>Merit Points </td> <td> Adjust how much each merit is worth</td></tr>
        <tr><td>Merit Approval </td> <td> Confirm merits added by students themselves</td></tr>
        <tr><td>Merit Edit </td> <td> Edit the wording of merits.</td></tr>

      </v-simple-table>
    </v-card-text>
  </v-card>
</v-container>
</div>
</template>

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
      },
      showMeritPers() {
         this.$router.push({ name: 'PersMeritList'})
      },
      showMeritTable(){
         this.$router.push({ name: 'MeritTable'})
      }
    },
    computed: {    },
  }
</script>
