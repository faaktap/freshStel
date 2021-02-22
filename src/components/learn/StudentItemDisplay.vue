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
   <v-expansion-panels min-width="150" rounded class="ma-2 pa-2 long-line">
    <v-expansion-panel>
        <!-- item.expand --- we might use this later to close all exapned folders -->
     <v-expansion-panel-header disable-icon-rotate 
                               class="no-uppercase "
                               color="deep-purple lighten-5" 
                               v-model="item.expand"  
                               @:blur="expansionPanelOpen = false"
                               :title="item.days + 'day(s) ago'"
                               >
         {{ btnFace }} <span class="caption mx-1"> .. </span>
         <template v-slot:actions>
           <v-icon color="teal">
              {{ icon | repl}}
           </v-icon>
         </template>
         
     </v-expansion-panel-header>

    <v-expansion-panel-content>
     <v-hover v-slot:default="{ hover }">
      <v-card  min-width="300" 
               xmin-height="100"
               :elevation="hover ? 12 : 2"
               :class="{'on-hover': hover,'overwrite-hover': $vuetify.breakpoint.xsOnly}"
         dense
         class= "ma-2"
         color="deep-purple lighten-3"                  
      >
      <v-card-title> 
        <v-badge 
               :value="bhover" 
               :content="item.days + 'day(s) ago'"
               transition="slide-x-transition"> 
         <v-hover v-model="bhover">
            <v-icon :color="item.days | icn"> mdi-timelapse </v-icon> 
          </v-hover>
        </v-badge>
       <template v-if="['text','link'].includes(item.type)">
           {{ item.description }}
       </template>
       <template>
           {{ btnFace }}
       </template>

      </v-card-title>        
      <v-card-text>
 
        <template v-if="['text'].includes(item.type)">
           <!-- do not think we need to show something for text -->
        </template>

       <template v-else>
        <v-btn small 
              :title="actionlink(item.type)"
              @click="doAttachment">
          <v-icon> mdi-attachment </v-icon>
          View 
        </v-btn>

        {{ attachment }} <br> {{ item.img}}
        <v-dialog v-model="showAttachment" xmax-width="400" width="unset">
         <zml-preview :src="item.img"   
                      :type="attachment" 
                      >
           <zml-close-button @btn-click="showAttachment = !showAttachment"/>
         </zml-preview>
        </v-dialog>
       </template>                 
            <template v-if="['link'].includes(item.type)">
            <br />  Last Edit : {{ item.days }}  days(s) ago
            <br />  Name : {{ item.name }}
            <br />  Description : {{ item.description }}
            <br />  Img : {{ item.img }}
            <br />  Created : {{ item.create_timestamp.substr(0,10) }}
            <br />  icon : {{ item.img | icon }}
            <br />  filetype : {{ item.img | fileType }}
            {{ item }}
            </template>
      </v-card-text>
     </v-card>
     </v-hover>
    </v-expansion-panel-content>
   </v-expansion-panel>
  </v-expansion-panels>
    

</template>
<script>
import zmlPreview from '@/components/zmlPreview.vue'
import zmlCloseButton from '@/components/zmlCloseButton.vue'
import {getIcon, getFileType} from '@/api/fileUtils.js'
export default {
    name:"zmlContentButton",
    components: {zmlPreview, zmlCloseButton},
    props: ['icon','btnFace','item'],
    data: () => ({
      src : null,
      showAttachment : false,
      attachment: null,
      bhover: false,
      expansionPanelOpen: false,
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
            return "bollie"

        },
        fileType(value) {
            return getFileType(getIcon(value))
        },
        icn : function (days) {
         //show color based on amount of days
         if (days < 8)  return "red lighten-"+days
         return "green"
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
            console.log('doAttachment',1)
            let whatever = this.actionlink(this.item.type)
            this.attachment = getFileType(getIcon(whatever)) 
            this.ext = getIcon(whatever)
            console.log('doAttachment',4, this.ext)
            console.log('doAttachment',5, this.src)
            this.src = whatever
            if (this.src.length){
              this.showAttachment = !this.showAttachment
            } else {
                alert('res is null')
            }
        },
        doFixAtt() {
           //find out what type of attachment we have, and execute correctly
           //Check if there is an img, and a load in description, and all other shit.
           //Maybe change the icon to whatever...and load src with correct value
           //could maybe show photo if there is one

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