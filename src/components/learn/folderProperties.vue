<template>
  <div class="text-center">
    <v-dialog v-show="showDialog">
     <template v-slot:activator="{ on, attrs }">
        <v-btn
          color="red lighten-2"
          dark
          v-bind="attrs"
          v-on="on"
        >
          Click Me
        </v-btn>
      </template>

        <v-btn text 
               color="primary" 
               @click="hideModal" 
               class="body-1"
        >
         Close
        </v-btn>
    </v-dialog>
  </div>
</template>

/* 
<folder-properties   @hideModal="showFolderProperties = false"
                    :showDialog.sync="showFolderProperties"
/>  (still get mutating a property)
*/ 

<script>
export default {
    name:'folderProperties',
    props:['showDialog'],
    methods:{
        hideModal() {
            this.$emit('hideModal')
        }
    },
    watch: {
     showDialog(val) {
      if(!val) {
         this.$emit('hideModal')
      }
   }
}
}
</script>