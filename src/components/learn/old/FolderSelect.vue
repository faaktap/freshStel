<template>
<div>
  <v-card v-if="folders" class="ma-3 pa-2" color="light-blue darken-3">
      <v-btn class="caption" 
           style="color:white" 
           x-small
           text  
           title="Click to change form root folders to all folders"
          @click="showRootFolders = !showRootFolders"> 
          <v-icon x-small> mdi-folder</v-icon>
          <template v-if="showRootFolders">
            root folders              
          </template>
          <template v-else>
            all folders              
          </template>
       </v-btn>

      <div v-if="folderFilter.length < 1">
          The are no folders yet, please create a "New Folder"
       </div>
        <v-btn @click="selectFolder(f)" 
                v-for="f in folderFilter"
                :key="f.folderid"
                color="green darken-4"
                class="ma-2 no-uppercase"
                rounded
                >
         <strong>{{ f.name }}</strong>
        </v-btn>
  </v-card>
</div>
</template>


<script>
import { zmlConfig } from '@/api/constants.js';
import { zmlFetch } from '@/api/zmlFetch.js';
import { getters } from "@/api/store";
export default {
name: "FolderSelect",
props:['grade', 'subjectid'],
components: {},    
data: () => ({
    getZml: getters.getState({ object: "gZml" }),
    folders:[],
    contentFolders:[],
    showFolders:false,
    showRootFolders:true,
}),
methods:{
    selectFolder(f) {
        //alert('select folder ' + f.name)
        this.$emit('selected', f)
    },
    loadContent() {
          zmlFetch({task: 'getfolders',api: zmlConfig.apiDKHS}, this.afterFolders);
          zmlFetch({task: 'getcontentfolders',api: zmlConfig.apiDKHS}, this.afterContentFolders);
    },
    afterFolders(response) {
          this.folders = response;
    },    
    afterContentFolders(response) {
          this.contentFolders = response;
    },    
},
computed:{
      //Display a list of folders on dropdown
      folderFilter() {
        let tempT = []
        let ignore = false
          this.contentFolders.forEach(item => {
          ignore = false;
          if (item.grade != this.getZml.grade || 
             item.subjectid != this.getZml.subjectid ||
             item.sortorder == 0) {
             ignore = true
          }
          if (this.showRootFolders) {
              if (item.name != item.folder) {
                  ignore = true
              }
          }
          if (!ignore) {
             let newitem = item
             tempT.push(  newitem );
          }
        })
        return tempT
      },
},
mounted: function() {
       this.getZml.grade = this.grade
       this.getZml.subjectid = this.subjectid
       this.loadContent()
}
}
</script>

