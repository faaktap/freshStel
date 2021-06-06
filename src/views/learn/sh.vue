<template>
<div>
<v-progress-linear :active="progress" :indeterminate="progress" color="grey lighten-1" />
<!--

  <pre>
    1. getFolder - php - getLContentByFolderNo (benonog 'n folderid)
    2. prevFolder - php getLContentPrevFolder (benodig 'n folderid)
  </pre>
  <v-row  >
    <v-col cols="12">
       <v-toolbar flat color="primary" dark class="mb-2">
        <v-toolbar-title class="body-1">
            Quick display item(s) from folder: {{ displayFolder }}
        </v-toolbar-title>
       </v-toolbar>
    </v-col>
   </v-row>

<v-card color="blue" dark>
  <v-row><v-col>
    <v-text-field v-model="folderid" /> 
  </v-col><v-col>
    <v-btn @click="getFolder(folderid)"> load {{ folderid }} </v-btn>
  </v-col></v-row>
</v-card>
<v-row>
  <v-col>
    <template v-if="contents && contents.length"> {{ topFolder }} </template>
  </v-col>
</v-row>
-->
<v-container fluid v-if="getZml.login.isAuthenticated && getZml.login.username=='werner'">
FID:{{ folderid }} <br> TF:{{ topFolder }} <br> dpB:{{ displayFolderBack }}
<br> dp:{{ displayFolder }}
</v-container>

<v-sheet color="grey lighten-5" class="ma-2">
 <v-container v-if="(contents && contents.length) || topFolder.displayfolder"
                 fluid class="ma-2 mt-3" >
  <v-card color="blue lighten-2">
    <v-card-title>
      <template v-if="displayFolderBack != 'ROOT'">
        <v-btn @click="prevFolder(topFolder)" :title="topFolder.contentid"> UP TO {{ displayFolderBack }}  </v-btn>
      </template>  
      <template v-else>
        <v-btn v-if="folderid != 0" @click="getFolder(0)" :title="0"> UP .. {{ displayFolderBack }} </v-btn>
      </template>
      <v-row><v-col cols="12">
        <template v-if="displayFolder == 'Top'">
           <v-card class="text-center"
               color="white">
                Subject {{ subjectShortName() }} -  GR{{ topFolder.grade }}
           </v-card>           
        </template>
        <template v-else>
        <div class="text-center"> Folder {{ displayFolder }} </div>
        </template>
        <v-chip class="ma-2 float-right" 
               :color="subjectColor()">
                Grade {{ topFolder.grade }} Subject {{ subjectShortName() }} 
        </v-chip> 
        </v-col></v-row>
    </v-card-title>
    <v-card-text>           
      <v-layout v-if="contents.length > 0" row wrap>
        <v-flex 
         v-for="item in contents" :key="item.itemid"
         flex-row
         justify-space-around
         xs-12
         >
          <template v-if="item.type=='folder'" >
            <!-- sometime the folder to which the content belong is also in the contents list
                  so we stop them from displaying it as a folder.-->
            <template v-if="item.displayfolder != displayFolder">
             <student-folder-display @btn-click="getFolder(item.contentid)" :item="item" /> 
            </template>
          </template>
          <template v-else>
           <student-item-display :btnFace="item.name" :icon="item.icon" :item="item" />
          </template>
          <div v-if="getZml.login.isAuthenticated && getZml.login.username=='werner'">
            {{ item }}
          </div>
        </v-flex>
      </v-layout>
      <v-layout v-else>
        There are no contents in this folder yet.
      </v-layout>
     <div class="ma-2 text-center"> --- end --- </div>
    </v-card-text>
  </v-card>
 </v-container>
</v-sheet>

 <v-container fluid v-if="getZml.login.isAuthenticated && getZml.login.username=='werner'">
<v-row >
   <v-col cols="12" sm="6" v-show="contents.length > 0">
     <v-card color="deep-purple lighten-5">
       <base-table 
                  :tList="contents" 
                   tHeading="" 
                  bHeading="stuff" 
       /> 
      </v-card>
    </v-col>
</v-row> 
 </v-container>

<v-dialog v-model="showNoInfoDialog" eager max-width="600" width="auto">
    <v-card>
        <v-card-title> We did not find any Information! </v-card-title>
        <v-card-text> 
            This information is not available at the moment. ({{ folderid }})
         </v-card-text>
        <v-card-actions> 
            <v-btn @click="showNoInfoDialog = !showNoInfoDialog" color="info"> close </v-btn>
        </v-card-actions>
    </v-card>
</v-dialog>

</div>
</template>

<script>
import { getters } from "@/api/store"
//import { zmlLog } from '@/api/zmlLog.js';
import { zData } from "@/api/zGetBackgroundData.js"
import { infoSnackbar } from '@/api/GlobalActions';
import { sh } from "@/views/learn/sh.js"
import { subject } from "@/api/subject.js"

import StudentItemDisplay from '@/components/learn/StudentItemDisplay'
import StudentFolderDisplay from '@/components/learn/StudentFolderDisplay'
import BaseTable from    '@/components/base/baseTable'

export default {
    name: "SH",
    components: {
          StudentItemDisplay
        , StudentFolderDisplay
        , BaseTable
        },
    props: { propfolder: {default: 1358} },  //419
    data: () => ({
        getZml: getters.getState({ object: "gZml" }),
        showTextDialog:false,
        showNoInfoDialog:false,
        theItem:{},
        folderid:null,
        contents: [],
        topFolder: {grade:null, subjectid:null},  //this is the folder we requested, or the above folder if we request a file
        currentImage:'',  
        progress:false,
    }),
    activated: function () {
    },
    computed: {
      displayFolder() {
        if (this.topFolder && this.topFolder.displayfolder) {
          return this.topFolder.displayfolder
        }
        return "NO FOLDER"
      },
      displayFolderBack() {
        console.log(this.topFolder.description,this.topFolder.folder)
        if (this.topFolder && this.topFolder.description != this.topFolder.folder) {
          //return [this.topFolder.folder , this.folderid].join()
          return [this.topFolder.displayfolder , this.folderid].join()
        }
        return "ROOT"
      },
    },
    methods:{
      subjectShortName(sid = this.topFolder.subjectid) {
        return subject.shortName(sid)
      },
      subjectColor(sid = this.topFolder.subjectid) {
        return subject.color(sid)
      },
      getFolder(folderid = this.folderid) {
        this.folderid = folderid
        if (folderid < 1) { folderid = 0 }
        sh.contentData('folderdata', this.loadData, {folderid: folderid
                                                    ,grade:this.topFolder.grade || 0
                                                    ,subjectid:this.topFolder.subjectid || 0
                                                    })
      },        
      loadData(response) {
         //zmlLog('SH-FolderView' , "Platform", this.folderid)
         console.log('loadData  folderid:', this.folderid, 'response:',response)
         this.contents.length = 0
         this.topFolder = {}
         if (!Array.isArray(response) || (response.errorcode && response.errorcode != 0) ) {
           this.showNoInfoDialog = true
           return
         }
         let topid = response.findIndex(ele => ele.contentid == this.folderid)
         //if we do not find topid, we are at the top of grade/subject - root folder
         if (topid < 0) { topid = 0 }
         //Here we can check if we came in with a file rather than a folder, and maybe get the folder
         // like we do at latest.vue
         console.log('sLKJLKJLKJLKJLKJLKJLK', response[topid].displayfolder)
         this.topFolder = { name:response[topid].name
                          , displayfolder:response[topid].displayfolder
                          , contentid:response[topid].contentid
                          , grade:response[topid].grade
                          , subjectid:response[topid].subjectid
                          , folder:response[topid].folder
                          , description:response[topid].description}
         //if (topid != 0) { 
           //don't show the folder with the contents
         //   response.splice(topid,1) //fokfokfok - partykeer wel ander nie...
        // }
         if (this.folderid == 0 ) this.topFolder.displayfolder = 'Top'
         this.contents = response
         this.contents.forEach(item =>{
            item.img = ''
            item.expand = false
            if (item.type == 'file' && item.description.substr(0,4) == 'load') {
                item.img = 'https://www.kuiliesonline.co.za/' + item.description.substr(5)
            }                     
         })
         //Here we will know what the subjectid and grade is, if folder successfully read.
      },
      prevFolder(folderItem) {
         //ask for the information about the folder we need to go back to...
         if (folderItem.contentid) {
            sh.prevFolderData('prevFolder', this.prevFolderData, folderItem)
         } else {
            infoSnackbar('Not enought Folder info...')
         }
      },
      prevFolderData(response) {
        //console.log('PrevFolderData : received items : ', response.length, response)
        this.getFolder(response[0].contentid)
      },
      stillMounting() {
          this.progress = false;
          this.$cs.l('We are in MOUNTPLAT',this.getZml.login.type)
          this.allowEdit = false
          this.getFolder(this.propfolder)
      }
    },
    filters: {},
    mounted: function () {
      this.progress = true;
      zData.initialData('Load Subject Data')
      infoSnackbar(['Welcome ', this.getZml.login.fullname || 'Guest'].join(''))
      setTimeout(() => { this.stillMounting() }, 1100)
     
    }
  }
</script>  

<style scoped>
.wordbreak {
  overflow-wrap: break-word;
  word-wrap: break-word;
  word-break: break-all;
  word-break: break-word;
  hyphens: auto;
}
</style>