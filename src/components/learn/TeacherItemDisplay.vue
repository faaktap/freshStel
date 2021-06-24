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
                  @click.stop="test" > 
             <v-icon :small="$vuetify.breakpoint.smAndDown == true"
                     :color="getIconColor(item.icon)"
                     >
              {{ item.icon | repl}}
             </v-icon>
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
          <zml-preview :src="item.img"   
                      :type="attachment"  
                      >
          <zml-close-button @btn-click="showAttachment = !showAttachment"/>
         </zml-preview>
        </v-dialog>
    
</div>
</template>
<script>
import { look } from "@/api/Lookups.js"
import zmlPreview from '@/components/zmlPreview'
import zmlCloseButton from '@/components/zmlCloseButton'
import {getIconColor, getIcon, getFileType} from '@/api/fileUtils.js'
import { infoSnackbar } from '@/api/GlobalActions';
import TeacherFolderEdit from '@/components/learn/TeacherFolderEdit'
export default {
    name:"zmlContentButton",
    components: {zmlPreview, zmlCloseButton,TeacherFolderEdit},
    props: ['icon','btnFace','item'],
    data: () => ({
      look: look,
      getIconColor:getIconColor,
      src : null,
      showAttachment : false,
      attachment: null,
      expandStatus:[]
    }),    
    computed:{
    },
    filters:{
        repl(value) { 
            if (value == '') {
                return "mdi-coffee"
            }
            return value
        },
        icon(value) {
            if (value) return getIcon(value)
            return "mdi-link"

        },
        fileType(value) {
            return getFileType(getIcon(value))
        },
        icn : function (days) {
         //show color based on amount of days
         if (days < 8)  return "blue darken-"+days
         if (days < 30)  return "green"
         return "indigo"
       },

    },
    methods: {
        actionlink(type)  {
            if (type == 'link') {
                return this.item.name
            } else {
                return this.item.img
            }
        },
        doAttachment() { 
            if (!look.isAuthenticated) {
               infoSnackbar('You need to login to access the material!');
               return
            }
            let whatever = this.actionlink(this.item.type)    //fullname
            //whatever is something like https.../sdf/sdf/xyz.pdf 
            let icon = getIcon(whatever)
            this.attachment = getFileType(icon)  //ie. picture, pdf, movie
            this.ext = getIcon(whatever)
            this.src = whatever
            if (this.src.length){
              this.showAttachment = !this.showAttachment
            } else {
                alert('res is null')
            }
            this.expandStatus = []
        },
        test() {
          if (this.item.type == 'text' || this.item.type=='folder') {
            this.expandstatus = []
            return;
            }
          this.doAttachment()

        },
        btnClick() {
            console.log('zmlContentButton - Click')
        },
        iconClick() {
            console.log('zmlIconButton - Click')
        }

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