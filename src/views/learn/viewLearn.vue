<template>
<div>
 <v-card>
  <div class="text-center">
      Grade Content
   </div>
     <v-card-title>
      <v-spacer>title</v-spacer>
    </v-card-title>
    <edit_content />
 </v-card>

</div>
</template>
<script>
import { zmlConfig } from '@/api/constants.js';
import editContent from '@/views/learn/editContent.vue';
  export default {
      components: {edit_content:editContent},
    data: () => ({
    }),
    methods: {
    },
    mounted: function () {
        zmlConfig.cl('Mount:Edit');
    }
  }
</script>