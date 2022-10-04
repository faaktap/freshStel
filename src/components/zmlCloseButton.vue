<template>
 <v-btn  icon xxsmall
         absolute top right
         title="Click here to close"
         @click="$emit('btn-click')"
         >
         <v-icon color="indigo">
             mdi-close
         </v-icon>
 </v-btn>
</template>