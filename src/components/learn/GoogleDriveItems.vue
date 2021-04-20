<template>
<v-container fluid>
  <!--folderObj:{{ folderObj }}<br> 
   itemList: {{ itemList }}-->
 <v-card color="blue lighten-5" class="ma-2 pa-1" v-if="itemList && itemList.length > 0 && folderObj.name">
  <v-layout fluid 
        v-show="folderObj.name" 
        row 
        class="ma-1" 
        align-content-start 
        align-baseline 
        justify-space-between
  >  
    <v-flex v-for="item in itemList" :key="item.contentid" class="ma-1" align-self-start>
     <v-card color="grey lighten-3" min-width="150" class="pa-2">
       <v-icon :color="chipColor(item.type)" 
                class ="mx-2"
                title="Click to Preview"
               @click="iconClick(item);" >
                {{ item.icon }} 
       </v-icon>
       <v-btn class="no-uppercase wordbreak text-truncate" 
             right
             @click="contentProperties(item)"
             :title="item.update_timestamp + '(' + item.description + ')'"
             min-width="150"
             xmax-width="450"
             text
             draggable="btndrag"
             >
        <div class="no-uppercase wordbreak text-truncate">  {{ item.name }}  </div>
       </v-btn>
     </v-card>
    </v-flex>
  </v-layout>    
  </v-card>
  <v-card v-else color="blue lighten-5" class="ma-2 pa-1">
      NO ITEMS TO DISPLAY
  </v-card>
</v-container>
</template>

<script>
export default {
    name:"GoogleDriveItems",
    props:['folderObj', 'itemList'],
    methods:{
        contentProperties(c) {
            //console.log('emitting contentP',c)
            this.$emit('contentProperties',c)
        },
        iconClick(c) {
            //console.log('emitting iconClic',c)
            this.$emit('iconClick',c)
        },
        chipColor(ctype) {
            if (ctype == 'file') return "green lighten-2"
            if (ctype == 'link') return "orange darken-4"
            if (ctype == 'text') return "grey lighten-5"
            return "deep-orange accent-4"
        },
    }
}
</script>

<style scoped>
.no-uppercase {
     text-transform: none;
  overflow-wrap: break-word;
  word-wrap: break-word;
  hyphens: auto;     
}
.wordbreak {
  overflow-wrap: break-word;
  word-wrap: break-word;
  word-break: break-all;
  hyphens: auto;
}

</style>