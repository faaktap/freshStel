<template>
<div>
<!--
    { "contentid": "185"
    , "sortorder": "1"
    , "name": "Christelle en Richard !!"
    , "description": "load:/Subjects/GR08/Physical Sciences_Fisiese Wetenskappe/DATA FOR FWET/ChristelleWiegandEnMan.jpg", "type": "file", "subjectid": "10", "grade": "8", "icon": "mdi-image", "folder": "DATA FOR FWET", "accesstype": "student", "persid": "1", "create_timestamp": "2021-02-19 15:11:54", "update_timestamp": "2021-02-19 16:35:50", "days": "1", "img": "https://www.kuiliesonline.co.za//Subjects/GR08/Physical Sciences_Fisiese Wetenskappe/DATA FOR FWET/ChristelleWiegandEnMan.jpg" } 
    , "type": "file"
    , "subjectid": "10"
    , "grade": "8"
    , "icon": "mdi-image"
    , "folder": "DATA FOR FWET"
    , "accesstype": "student"
    , "persid": "1"
    , "create_timestamp": "2021-02-19 15:11:54"
    , "update_timestamp": "2021-02-19 16:35:50"
    , "days": "1"
    , "img": "https://www.kuiliesonline.co.za//Subjects/GR08/Physical Sciences_Fisiese Wetenskappe/DATA FOR FWET/ChristelleWiegandEnMan.jpg" } 
    -->
   <v-expansion-panels rounded 
                       class="ma-2 mt-0 pa-2 xxlong-line"
                       v-model="expandStatus"
                       >
    <v-expansion-panel>
     <v-expansion-panel-header disable-icon-rotate 
                               class="no-uppercase text-caption text-sm-body-2 text-md-body-1 text-lg-h6 text-xl-h4"
                               color="deep-purple lighten-5" 
                               :title="item.days + ' day(s) ago'"
                               >
         <div class="text-lg-subtitle-2 text-sm-caption">   
          {{ btnFace }} 
         </div>
         <template v-slot:actions>
           <v-btn :x-small="$vuetify.breakpoint.smAndDown == true"
                   icon 
                  @click.stop="clicked" > 
             <v-icon v-if="item.icon" 
                     v-text="item.icon" 
                     :color="getIconColor(item.icon)" 
                     :small="$vuetify.breakpoint.smAndDown"
                     />
           </v-btn>
         </template>
     </v-expansion-panel-header>

    <v-expansion-panel-content>
      <teacher-folder-edit :item="item" />
    </v-expansion-panel-content>
   </v-expansion-panel>
  </v-expansion-panels>

        <v-dialog v-model="showAttachment"  
                  xmax-width="400" 
                  :fullscreen="$vuetify.breakpoint.smAndDown"
                  height="90%"
                  width="unset">
       <show-attachment-dialog :image="attachment.src" 
                               :imagetype="attachment.srctype" 
                               @close="showAttachment = !showAttachment" />                  
          <!--zml-preview :src="item.img"   
                      :type="attachment"  
                      >
          <zml-close-button @btn-click="showAttachment = !showAttachment"/>
         </zml-preview-->
        </v-dialog>
    
</div>
</template>
<script>
import { shFile } from '@/components/learn/ShFile.js'
import TeacherFolderEdit from '@/components/learn/TeacherFolderEdit'
import ShowAttachmentDialog from '@/components/ShowAttachmentDialog.vue'
export default {
    name:"TeacherItemDisplay",
    components: {TeacherFolderEdit,ShowAttachmentDialog},
    props: ['icon','btnFace','item'],
    data: () => ({
      showAttachment : false,
      expandStatus:[],
      attachment:{src:'', srctype:''}
    }),    
    computed:{
    },
    methods: {
        doAttachment() { 
           this.attachment = shFile.doAttachment(this.item)
           console.log('Atttt:::', this.attachment, 'item',this.item)
           this.showAttachment = true
           this.expandStatus = []
        },
        clicked() {
          if (this.item.type == 'text' || this.item.type=='folder') {
            this.expandstatus = []
            return;
            }
          this.doAttachment()
          this.expandstatus = []
        },
        getIconColor(xx) {
           return shFile.getIconColor(xx)
        },
        icn(days) {
           return shFile.icn(days)
        },        


    },
    mounted: function () {

    }

}
</script>
<style scoped>
.no-uppercase {
     text-transform: none;
}
.long-line {
    white-space: nowrap ;
    word-break: normal;
    overflow: hidden ;
    text-overflow: ellipsis;
}


.v-expansion-panels.condensed .v-expansion-panel-header {
  padding-top: 2px;
  padding-bottom: 2px;
  min-height: auto;
}
.v-expansion-panels.condensed
  .v-expansion-panel--active
  .v-expansion-panel-header {
  padding-top: 8px;
  padding-bottom: 8px;
}
.v-expansion-panels.condensed .v-expansion-panel--active:not(:first-child),
.v-expansion-panels.condensed .v-expansion-panel--active + .v-expansion-panel {
  margin-top: 4px;
}

</style>