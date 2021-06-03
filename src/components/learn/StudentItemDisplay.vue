<template>
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
   <v-expansion-panels min-width="150" 
                       rounded 
                       class="ma-2 pa-2 xxlong-line"
                       v-model="expandStatus"
                       >
    <v-expansion-panel>
     <v-expansion-panel-header disable-icon-rotate 
                               class="no-uppercase text-caption text-sm-body-2 text-md-body-1 text-lg-h6"
                               color="deep-purple lighten-5" 
                               :title="item.days + ' day(s) ago'"
                               >
         {{ btnFace }}
         <template v-slot:actions>
           <v-btn :x-small="$vuetify.breakpoint.smAndDown == true"
                   icon 
                  @click.stop="test" > 
             <v-icon :small="$vuetify.breakpoint.smAndDown == true"
                     :color="iconColor(item.icon)"
                     >
              {{ item.icon | repl}}
             </v-icon>
           </v-btn>
         </template>
     </v-expansion-panel-header>

    <v-expansion-panel-content>
     <v-hover v-slot:default="{ hover }">
      <v-card  xmin-width="300" 
               min-height="100"
               :elevation="hover ? 12 : 2"
               :class="{'on-hover': hover,'overwrite-hover': $vuetify.breakpoint.xsOnly}"
         dense
         class= "ma-2 ma-sm-1 pr-sm-2"
         color="deep-purple lighten-3"                  
      >
      <v-card-subtitle class="text-caption text-sm-body-2 text-md-body-1 text-lg-h6"> 
<!-- SHOW AMOUNT OF DAYS SINCE YOU EDIT -->        
        <v-badge 
               :value="bhover" 
               :content="item.days + 'day(s) ago'"
               transition="slide-x-transition"
               > 
         <v-hover v-model="bhover">
            <v-icon :color="item.days | icn"> {{ item.icon | repl}} </v-icon> 
          </v-hover>

        </v-badge>
       <div class="no-uppercase text-caption text-sm-body-2 text-md-body-1 text-lg-h6">
        <template v-if="['text','link'].includes(item.type)">
           {{ item.description }}
        </template>
        <template v-else>
           {{ item.name }} 
        </template>
       </div>
      </v-card-subtitle>        
      <v-card-text>
 
        <template v-if="['text'].includes(item.type)">
           <!-- do not think we need to show something for text -->
        </template>

       <template v-if="!['text'].includes(item.type)">
        <v-btn small 
              :xxxtitle="actionlink(item.type)"
              :title="item.days + 'day(s) ago'"
              @click="doAttachment">
          <v-icon> mdi-attachment </v-icon>
          View 
        </v-btn>
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
       </template>

<!--
            <br />  Last Edit : {{ item.days }}  days(s) ago
            <br />  Name : {{ item.name }}
            <br />  Description : {{ item.description }}
            <br />  Img : {{ item.img }}
            <br />  Created : {{ item.create_timestamp.substr(0,10) }}
            <br />  icon : {{ item.img | icon }}
            <br />  filetype : {{ item.img | fileType }}
            {{ item }}
-->
      </v-card-text>
     </v-card>
     </v-hover>
    </v-expansion-panel-content>
   </v-expansion-panel>
  </v-expansion-panels>
    

</template>
<script>
import { getters } from "@/api/store";
import zmlPreview from '@/components/zmlPreview'
import zmlCloseButton from '@/components/zmlCloseButton'
import {getIconColor, getIcon, getFileType} from '@/api/fileUtils.js'
import { infoSnackbar } from '@/api/GlobalActions';

export default {
    name:"zmlContentButton",
    components: {zmlPreview, zmlCloseButton},
    props: ['icon','btnFace','item'],
    data: () => ({
      getZml: getters.getState({ object: "gZml" }),      
      src : null,
      showAttachment : false,
      attachment: null,
      bhover: false,
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
        iconColor(iconname) {
          return getIconColor(iconname)
        },      
        actionlink(type)  {
            if (type == 'link') {
                return this.item.name
            } else {
                return this.item.img
            }
        },
        doAttachment() { 
            if (!this.getZml.login.isAuthenticated) {
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
        console.log('SID Mounted')

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