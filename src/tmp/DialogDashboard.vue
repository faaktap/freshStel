<template>
  <v-dialog max-width="600" v-model="dialog">
    <template v-slot:activator="{ on }" max-width="100%">
      <v-btn flat dark v-on="on" class="text-capitalize" outlined>Add new commission</v-btn>
    </template>
    <v-card flat>
      <v-card-title class="headline teal white--text lighten-1">Add new commission:</v-card-title>
      <v-divider></v-divider>
      <v-form ref="form">
        <v-card-text class="pa-4">
          <v-textarea
            label="Content"
            color="teal"
            v-model="commissions.title"
            prepend-icon="title"
            :rules="inputRules"
          ></v-textarea>

          <v-text-field
            color="teal"
            label="From"
            v-model="commissions.person"
            prepend-icon="people"
            :rules="inputRules"
          ></v-text-field>

          <v-select
            color="teal"
            prepend-icon="sort"
            :rules="inputRules"
            item-text="status"
            item-value="id"
            :items="select"
            v-model="commissions.status"
          ></v-select>

          <v-menu>
            <v-text-field
              color="teal"
              slot="activator"
              label="Date"
              v-model="commissions.date"
              prepend-icon="date_range"
              :rules="inputRules"
            ></v-text-field>
            <v-date-picker color="teal lighten-2" v-model="commissions.date"></v-date-picker>
          </v-menu>
        </v-card-text>

        <v-spacer></v-spacer>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="teal lighten-2"
            class="mr-4 mb-4"
            outline
            flat
            @click="addCommission"
            :loading="loading"
          >Add</v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script>
//we import our database from external file

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
      select: [
        {
          id: "ongoing",
          status: "ongoing"
        },
        {
          id: "overdue",
          status: "overdue"
        },
        {
          id: "planned",
          status: "planned"
        }
      ],
      commissions: [
        {
          title: "",
          person: "",
          date: "",
          status: ""
        }
      ]
    };
  },
  methods: {
    addCommission() {
      if (this.$refs.form.validate()) {
        //starts loading animation on submit button
        this.loading = true;
        // console.log(
        //   this.commissions.title,
        //   this.commissions.person,
        //   this.commissions.date,
        //   this.commissions.status
        // );

        const commission = {
          //we assign values of keys to our data in component
          title: this.commissions.title,
          person: this.commissions.person,
          date: this.commissions.date,
          status: this.commissions.status
        };
        console.log(commission)
        //to metoda firebase, pierwszy arg to string z nazwa projektu który robilismy w firebase.
        //method add just adds new one item to collection, and as param we add this obj which we ve created above.
        //jako ze jest to asynchorniczna wysyłka, to nie wiemy ile czasu zajmie i dlatego musimy uzyc promises ktore robia cos kiedy juz tamto sie dokona. normalnie reszta pomyslow na napisanie czegos zamiast obietnic bedzie dalej validować kod synchronicznie i nie poczeka. a wiec bedzie błąd. then take a anon. func. as a callback.
      //   db.collection("commissions")
      //     .add(commission)
      //     .then(() => {
      //       //ends loading animation on submit button
      //       this.loading = false;
      //       //send to vmodel of v-dialog tag false value and closes a vdialog window
      //       this.dialog = false;
      //       // console.log("added to db");
      //       //we want to emit event to navbar component where just in that time! and there tell to show the snackbar:
      //       this.$emit("commissionAdded");
      //     });
      // } else {
      //   // console.log("submit error");
      // }
    }
  }
}
}
</script>


