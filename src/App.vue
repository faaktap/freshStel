<template>
  <v-app id="app">

   <AppLayout :key="projectID" >
    <v-container fluid>

      <!--transition name="fade" mode="out-in"-->
        <router-view/>
      <!--/transition-->

    <v-snackbar
      top centered
      :color="snackbarColor"
      elevation="21"
      v-model="snackbar"
      timeout="3500">
      {{ snackbarMessage }}

      <template v-slot:action="{ attrs }">
        <v-btn color="indigo" text
          v-bind="attrs"  @click="snackbar = false"
        >Close</v-btn>
      </template>
    </v-snackbar>

    </v-container>
   </AppLayout>

    <confirm ref="confirm"></confirm>
  </v-app>
</template>


<script>
import { getters } from "@/api/store";
import { zmlConfig } from '@/api/constants';
import confirm from "@/api/DialogConfirm";
import EventBus, { ACTIONS } from '@/api/event-bus';
export default {
  name: 'ZmlApp',
  components: {confirm},
  data: () => ({
    getZml: getters.getState({ object: "gZml" }),
    snackbarMessage: "",
    snackbarColor: "red accent-4",
    snackbar: false,
    projectID: zmlConfig.projectID
  }),
  methods: {
    locStore(item) {
      return localStorage.getItem(item)
    },
  },
  mounted: function () {
    console.log('StartApp : ',this.projectID)
    //Step thru our localstorage, and load all declared variables?
    const lval = this.locStore('currentLocale')
    if (lval) {
        this.$i18n.locale = lval;
        this.getZml.locale = lval;
    }

/* START External Programs that uses app.vue to make use of global stuff.    */
    this.$root.$confirm = this.$refs.confirm.open

    EventBus.$on(ACTIONS.SNACKBAR, (message, color) => {
        this.snackbarMessage = message;
        if (color) {
           this.snackbarColor = color
        }
        this.snackbar = true;
      });
/* END External Programs that uses app.vue to make use of global stuff.    */
  },
  destroyed () {
    EventBus.$off(ACTIONS.SNACKBAR)
  }
};
</script>
