<template>
  <nav>
    <!-- we re adding snackbar to show a message after we successfully added commission in out Dialog component -->
    <!-- timeout has to be bind becouse we pass the integer, not string. // top prop is to show on top of site / component?  -->
    <v-snackbar
      v-model="snackbar"
      :timeout="6000"
      top
      dark
      color="teal darken-1"
    >You successfully added a new commission.
      <v-btn text @click="snackbar = !snackbar">Close</v-btn>
    </v-snackbar>
    <!-- app daje position:fixed, flat-likwiduje cień -->
    <v-toolbar dark color="teal lighten-2 ">
      <v-btn small @click="drawerVisibility = !drawerVisibility"></v-btn>
      <v-toolbar-title class="text-uppercase">
        <span class="font-weight-light">Todo</span>
        <span>witcher</span>
      </v-toolbar-title>
      <!-- vspacer gives space between this two tags - title&iconlogout -->
      <v-spacer></v-spacer>
      <v-btn text color>
        <span>sign out</span>
        <v-icon right>exit_to_app</v-icon>
      </v-btn>
    </v-toolbar>
    <!-- zauważ że jest za toolbarem ale jeszcze w navie - bo to bedzie wyjezdzajaca szuflada troche oderwana od kontentu ale jednak element nawigacji -->
    <!-- by sterowac widzialnoscia szuflady musimy to robic za pomocą v-model i potem np przypisac do buttona -->
    <!-- zeby drawer sie wyswietlal to musi byc dodany prop : app. Inaczej wyświetla sie tylko ciemne podswietlenie backgroundu -->
    <!-- DRAWER FROM THE LEFT - START -->
    <v-navigation-drawer v-model="drawerVisibility" dark class="teal lighten-1">
      <!-- AVATAR ON TOP OF DRAWER START -->
      <v-layout column align-center>
        <v-flex class="mt-5">
          <v-avatar size="100">
            <img src="/avatar-3.png">
          </v-avatar>
          <p class="subheading mt-2 white--text text-xs-center">Witcher</p>
        </v-flex>
        <v-flex class="mb-0">
          <DialogDashboard @commissionAdded="snackbar = true"></DialogDashboard>
        </v-flex>
      </v-layout>
      <!-- AVATAR ON TOP OF DRAWER END -->
      <v-list class="mt-4">
        <!-- 1 item start -->
        <v-list-item
          v-for="link in links"
          :key="link.content"
          router
          :to="link.route"
          active-class="red--text"
        >

            <v-icon class>{{link.icon}}</v-icon>

          <v-list-item-content class="text-capitalize">{{link.content}}</v-list-item-content>
        </v-list-item>
        <!-- 1 item end -->
      </v-list>
    </v-navigation-drawer>
    <!-- DRAWER FROM THE LEFT - END -->
  </nav>
</template>

<script>
import DialogDashboard from "./DialogDashboard";
export default {
  name:'tmpNavBar',
  components: {
    DialogDashboard
  },
  data() {
    return {
      drawerVisibility: true,
      links: [
        { icon: "dashboard", content: "dashboard", route: "/" },
        { icon: "alarm", content: "important", route: "/important" },
        { icon: "face", content: "team", route: "/team" }
      ],
      snackbar: false
    };
  }
};
</script>

<style>
</style>
