<template>
<div>
 <v-card>
   <v-row>
     <v-col cols="6">
  <div class="text-center">
     <v-toolbar dark color="primary" dense flat>
        <v-toolbar-title class="white--text"> Grade Content </v-toolbar-title>
      </v-toolbar>    
   </div>
     </v-col>
   </v-row>
    <view-content />
 </v-card>

</div>
</template>
<script>
import { zmlConfig } from '@/api/constants.js';
import viewContent from '@/views/learn/viewContent.vue';
  export default {
      components: {viewContent},
    data: () => ({
    }),
    methods: {
    },
    mounted: function () {
        zmlConfig.cl('Mount:Edit');
    }
  }
</script>