<template>
    <v-menu bottom left>
      <template v-slot:activator="{ on, attrs }">
        <v-btn icon v-bind="attrs" v-on="on" @click="$router.back()" title="Go Back">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </template>
    </v-menu>
</template>