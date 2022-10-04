<template>
  <v-dialog max-width="600" v-model="dialog">
    <template v-slot:activator="{ on }">
      <v-btn flat class="grey--text" v-on="on">
        <v-icon>note_add</v-icon>
        <span class="ml-2 subheading">Add</span>
      </v-btn>
    </template>
    <v-card flat>
      <v-card-title class="headline teal white--text lighten-1">Add new person:</v-card-title>
      <v-divider></v-divider>
      <v-form ref="form">
        <v-card-text class="pa-4">
          <v-text-field
            color="teal"
            label="Name"
            v-model="team.person"
            prepend-icon="people"
            :rules="inputRules"
          ></v-text-field>

          <v-text-field
            color="teal"
            label="Occupation"
            v-model="team.occupation"
            prepend-icon="fitness_center"
            :rules="inputRules"
          ></v-text-field>
          <v-select
            color="teal"
            prepend-icon="sort"
            :rules="inputRules"
            label="Avatar"
            item-text="name"
            item-value="address"
            :items="avatars"
            v-model="team.avatar"
          ></v-select>
          <v-menu>
            <v-text-field
              color="teal"
              slot="activator"
              label="Date"
              v-model="team.date"
              prepend-icon="date_range"
              :rules="inputRules"
            ></v-text-field>
            <v-date-picker color="teal lighten-2" v-model="team.date"></v-date-picker>
          </v-menu>
        </v-card-text>

        <v-spacer></v-spacer>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="teal lighten-2"
            class="mr-4 mb-4"
            outlined
            flat
            @click="addPerson"
            :loading="loading"
          >Add</v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script>
//we import our database from external file
//import db from "@/fb";
export default {
  data() {
    return {
      //variable to steer show/hide property on dialog window - binded by vmodel directive
      dialog: false,
      //steer loading icon on submit button
      loading: false,
      //validation of forms - at least 3 char. or error message
      inputRules: [
        //length is equal or more than 3 oraz show message: 'Type at least 3 characters'
        v => v.length >= 3 || "Type at least 3 characters"
      ],
      //   availableStatus: ["planned", "ongoing", "overdue"],
      team: [
        {
          person: "",
          occupation: "",
          date: "",
          avatar: ""
        }
      ],
      avatars: [
        {
          address: "/avatar-1.jpg",
          name: "Nobody"
        },
        {
          address: "/avatar-2.jpg",
          name: "Warrior"
        },
        {
          address: "/avatar-4.jpg",
          name: "Army leader"
        },
        {
          address: "/avatar-5.jpg",
          name: "Vampire"
        },
        {
          address: "/avatar-6.jpg",
          name: "Songster"
        },
        {
          address: "/avatar-7.jpg",
          name: "Witch"
        }
      ]
    };
  },
  methods: {
    addPerson() {
      if (this.$refs.form.validate()) {
        //starts loading animation on submit button
        this.loading = true;
        // tu mozna dac consolelog z this.team.person i.e.

        const person = {
          //we assign values of keys to our data in component
          person: this.team.person,
          occupation: this.team.occupation,
          date: this.team.date,
          avatar: this.team.avatar
        };
        console.log(person)
        //to metoda firebase, pierwszy arg to string z nazwa projektu który robilismy w firebase.
        //method add just adds new one item to collection, and as param we add this obj which we ve created above.
        //jako ze jest to asynchorniczna wysyłka, to nie wiemy ile czasu zajmie i dlatego musimy uzyc promises ktore robia cos kiedy juz tamto sie dokona. normalnie reszta pomyslow na napisanie czegos zamiast obietnic bedzie dalej validować kod synchronicznie i nie poczeka. a wiec bedzie błąd. then take a anon. func. as a callback.
  /*      db.collection("team")
          .add(person)
          .then(() => {
            //ends loading animation on submit button
            this.loading = false;
            //send to vmodel of v-dialog tag false value and closes a vdialog window
            this.dialog = false;
            // console.log("added to db");
            //we want to emit event to navbar component where just in that time! and there tell to show the snackbar:
            this.$emit("personAdded");
          });*/
      } else {
        // console.log("submit error");
      }
    }
  }
};
</script>


