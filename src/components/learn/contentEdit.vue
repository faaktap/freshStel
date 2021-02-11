<template>
    <v-card color="white" class="ma-4 pa-4">

        <v-text-field 
            v-model="item.description" />
        here we edit the content..
        {{ item }}
        <v-card-actions>
          <v-spacer />
          <v-btn small @click="close" color="primary">  close </v-btn>
        </v-card-actions>
    </v-card>
</template>



<script>
//import { zmlConfig } from '@/api/constants.js';
//import { zmlFetch } from '@/api/zmlFetch.js';
//import { infoSnackbar } from '@/api/GlobalActions';
export default {
name: "PlatformEdit",
    //components: {AutoList},
    props: { item:Object },
    data: () => ({
        //getZml: getters.getState({ object: "gZml" }),
        editObj: {},
        changed: false
    }),
    methods: {
      close() {
          this.item.changed = true
          this.$emit("hide",this.changed);
      },
      mes(s) { console.log(s) }
    },
    mounted:  function () {
        console.log ('WE MOUNTED COMPEDUT')
    }
}
</script>