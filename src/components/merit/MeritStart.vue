<template>
<v-container fluid>

  <hero-section name="forDB"
              bgpicture="https://www.zmlrekenaars.co.za/test/img/wall006.jpg"
              title=" Merit System "
              text=""
              breakup1="100"
              breakup2="20"
              color="green darken-1"
              :loading="loading"
               />

<v-container fluid v-if="['admin','teacher'].includes(getZml.login.type) == false">
    You are not logged in, or you are not a teacher!
</v-container>
<v-container fluid>

<v-toolbar  dense  row  wrap color="primary">
      Merit System Start
      <v-spacer />
      <base-tool-button @click="showMerit"
               class="mt-1 mr-2 mb-2 ml-2"
               color="secondary"
               title="Merit View and Edit"
               icon="mdi-calculator-variant"
      >Merit View</base-tool-button>

      <base-tool-button
               class="mt-1 mr-2 mb-2 ml-2"
               color="secondary"
               @click="showMeritPers"
               :title="`You have ${meritCount} merits to confirm`"
               icon="mdi-trophy-award"
<<<<<<< HEAD
      >Merit Approval</base-tool-button>

      <base-tool-button @click="showMeritTable"
               class="mt-1 mr-2 mb-2 ml-2"
               color="secondary"
               title="Merit Text"
               icon="mdi-home-edit"
      >Merit Edit Text</base-tool-button>

=======
               :badge="meritCount"
               :loading="loading"
               :disabled="loading"
               :badgeTitle="`You have ${meritCount} merits to confirm`"
      >Merit Approval</base-tool-button>
>>>>>>> 121ea14dcce9c3f036da38d4cab97fb8f18a92e8
      <v-back />
  </v-toolbar>

  <v-card class="pa-3 mt-5">
    <v-card-title> Info </v-card-title>
    <v-card-text> Short note on each function (button above) </v-card-text>
    <v-card-text>
      <v-simple-table>
<<<<<<< HEAD
        <tr><td>Merit Points </td> <td> Adjust how much each merit is worth</td></tr>
        <tr><td>Merit Approval </td> <td> Confirm merits added by students themselves</td></tr>
        <tr><td>Merit Edit </td> <td> Edit the wording of merits.</td></tr>

=======
        <tr><td><v-card class="ma-2 pa-2"><v-btn @click="showMerit" >     Merit View      </v-btn></v-card>      </td><td>Merit View     </td> <td> View and Edit merit Information. Point allocation can be changed, and the wording of the merit can be altered.</td></tr>
        <tr><td><v-card class="ma-2 pa-2"><v-btn  @click="showMeritPers" > Merit Approval </v-btn></v-card></td> <td>Merit Approval </td> <td> Confirm merits added by students and teachers. At the moment any teacher can confirm any merit.
          (The person who add the merit can appoint a confirming teacher)</td></tr>
        <tr><td><merit-chip /></td>                                                            <td>Merit Add </td> <td> Add a merit for a student / Students can add their own merits, but it needs to be confirmed by a teacher.</td></tr>
>>>>>>> 121ea14dcce9c3f036da38d4cab97fb8f18a92e8
      </v-simple-table>
    </v-card-text>
  </v-card>

</v-container>
</v-container>
</template>

<script>
import { getters } from "@/api/store"
import { zmlFetch } from '@/api/zmlFetch.js'
import BaseToolButton from '@/views/new/base/BaseToolButton.vue'
import MeritChip from "@/components/merit/MeritChip"
import HeroSection from "@/views/sections/HeroSection"
export default {
    name: 'MeritTable',
    components:{
       BaseToolButton
     , MeritChip
     , HeroSection
    },
    data () {
      return {
        drawer: false,
        getZml: getters.getState({ object: "gZml" }),
        meritCount: '',
        loading: false
    }},
    methods: {
      showMerit() {
         this.$router.push({ name: 'MeritTable'})
      },
      showMeritPers() {
         this.$router.push({ name: 'PersMeritList'})
      },
      loadWorkToDo() {
        console.log('load merit chaps')
        this.loading = true
        let ts = {}
        ts.task = 'OneValueSql'
        ts.sql = `SELECT count(*) FROM dkhs_meritstudent WHERE confirmdte is null and persmenemonic = '${this.getZml.login.username}'`
        zmlFetch(ts, this.getMeritCount, this.loadError)
      },
      loadError(err) {
        alert(JSON.stringify(err))
      },
      getMeritCount(response) {
        console.log('Merit Count', response)
        this.meritCount = response
        this.loading = false
      },
    },
    computed: {    },
    mounted() {
      this.loadWorkToDo()
    }
  }
</script>
