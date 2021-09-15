<template>
<div>
 <v-layout v-if="contents.length > 0" row wrap align-center> 
   <v-flex>
   <v-data-table
    :headers="contentHeader"
    :items="filterContents"
    :items-per-page="50"
    class="elevation-1"
    color="purple lighten-3"
    loading="tableLoading"
    loading-text="Loading... Please wait"
    multi-sort
    @click:row="clicked"
  >
    <template v-slot:top>
      <v-card  align="center" class="ma-2 pa-2">
          <h3> Folder {{ displayFolder }} </h3> <!-- topFolder={{ topFolder }} - editM={{ editMode }} -->
      </v-card>
    </template>  
    <template v-slot:[`item.days`]="{ item }">
        <span :class="icn(item.days)"> 
            {{ item.days }}
        </span>
    </template>
    <template v-slot:[`item.update_timestamp`]="{ item }">
        {{ item.update_timestamp.substr(0,10) }}
    </template>
    <template v-slot:[`item.create_timestamp`]="{ item }">
        {{ item.create_timestamp.substr(0,10) }}
    </template>
    <template v-slot:[`item.persid`]="{ item }">
        {{ persMenemonic(item.persid) }}
    </template>
    <template v-slot:[`item.name`]="{ item }">
      <span class="long-line">
        <v-icon v-if="item.icon" v-text="item.icon" :color="getIconColor(item.icon)" />          
        {{ item.name }} 
      </span>
    </template>
    <template v-slot:[`item.icon`]="{ item }">
      {{ item.icon }} 
    </template>
  </v-data-table>
   </v-flex>
 </v-layout>
   <v-dialog v-model="showAttachment"  
                  xmax-width="400" 
                  :fullscreen="$vuetify.breakpoint.smAndDown"
                  height="90%"
                  width="unset">
       <show-attachment-dialog :image="attachment.src" 
                               :imagetype="attachment.srctype" 
                               @close="showAttachment = !showAttachment" />
   </v-dialog>
</div>
</template>

<script>
import { getters } from "@/api/store"
import { shFile } from '@/components/learn/ShFile.js'
import ShowAttachmentDialog from '@/components/ShowAttachmentDialog.vue'

export default {
    name: "SHubFile",
    components:{
         ShowAttachmentDialog

    },
    props: { contents:      {default: []} 
           , displayFolder: {default: ''}
           , topFolder:     {default:[]}
           , editMode:      {default:false}
           },
    data: () => ({
        getZml: getters.getState({ object: "gZml" }),
        contentHeader: [
          {text: 'ID',           value: 'contentid' },            
          {text: 'name'         ,value: 'name' },
          {text: "Owner",       value: "persid"},
          {text: "Days",         value: "days"},
          {text: "Updated",      value: "update_timestamp"},
          {text: "Created",      value: "create_timestamp"},
          //{text: "icon",         value: "icon"},
          //{text: 'displayfolder',value: 'displayfolder' },
          //{text: 'description'  ,value: 'description' }, //(real link)
          //{text: 'img'         ,value: 'img' },
          //{text: 'grade',        value: 'grade' },
          //{text: 'subjectid',    value: 'subjectid'},
          //{text: "type",         value: "type", sortable: true },
          //{text: "folder",       value: "folder"},
          //{text: "accesstype",   value: "accesstype"},
          {text: "Default Sort", value: "sortorder"},
        ],            
        wtest:1,
        showAttachment:false,
        attachment:{src:'', srctype:''}
    }),
    computed:{
       filterContents() {
           //Do not show the entry with topFolder in it.
          return this.contents.filter(element => element.contentid !== this.topFolder.contentid)
       },
    },
    methods:{
        clicked(e1) {
            if (e1.type == 'folder') {
              //Clicked on a folder, pass it back
              this.$emit('btn-click',e1.contentid)
            } else {
                //handle the file or link
                this.doAttachmentView(e1)
            }
       },
       doAttachmentView(e1) {
           this.attachment = shFile.doAttachment(e1)
           console.log(this.attachment.src,this.attachment.srctype)
           this.showAttachment = true
       },
       getIconColor(xx) {
           return shFile.getIconColor(xx)
       },
       icn(days) {
           return shFile.icn(days)
       },
       persMenemonic(persid) {
           return shFile.persMenemonic(persid)
       }
    },

}
</script>

<style scoped>
.long-line {
    white-space: nowrap ;
    word-break: normal;
    overflow: hidden ;
    text-overflow: ellipsis;
}
</style>