<template>
 <div>
   <v-card color=green>
     <v-card-title> snackBarTest.vue </v-card-title>
     <v-card-text>
      <v-text-field v-model="snackMessage"> </v-text-field>
     </v-card-text>
     <v-card-actions>
      <v-btn @click="testSnackbar">Test one arg snackbar</v-btn>
      <v-btn @click="testOldOne">Test Old One </v-btn>
      <v-btn @click="openSnackbar()">Show snackbar</v-btn>
     </v-card-actions>
  </v-card>
 </div>  
</template>

<script>
  import { infoSnackbar,errorSnackbar } from '@/api/GlobalActions';
  export default {
    data: () => ({
      snackMessage:"Hello from snackbar - default!"
    }),    
    methods: {
      testSnackbar() {
        errorSnackbar("should be red since its error ");
      },
      testOldOne() {
        infoSnackbar("only one parameter");
      },
      openSnackbar() {
        let col="deep-purple accent-4"
        infoSnackbar(this.snackMessage,col)
      },

    },
  };
</script>