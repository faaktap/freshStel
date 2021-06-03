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
FID:{{ folderid }} <br> TF:{{ topFolder }} <br> dpB:{{ displayFolderBack }}
<br> dp:{{ displayFolder }}

<v-sheet color="grey lighten-5" class="ma-2">
 <v-container v-if="(contents && contents.length) || topFolder.name"
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
                Subject {{ shortName() }} -  GR{{ topFolder.grade }}
           </v-card>           
        </template>
        <template v-else>
        <div class="text-center"> Folder {{ displayFolder }} </div>
        </template>
        <v-chip class="ma-2 float-right" 
               :color="subjectColor()">
                Grade {{ topFolder.grade }} Subject {{ shortName() }} 
        </v-chip> 
        </v-col></v-row>
    </v-card-title>
    <v-card-text>           
      <v-layout row wrap>
        <v-flex 
         v-for="item in contents" :key="item.itemid"
         flex-row
         justify-space-around
         xs-12
         >
          <template v-if="item.type=='folder'">
           <student-folder-display @btn-click="getFolder(item.contentid)" :item="item" /> 
          </template>
          <template v-else>
           <student-item-display :btnFace="item.name" :icon="item.icon" :item="item" />
          </template>
          {{ item }}
        </v-flex>
      </v-layout>
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
//import { zmlConfig } from '@/api/constants.js';
//import { zmlLog } from '@/api/zmlLog.js';
import { zData } from "@/api/zGetBackgroundData.js"
import { errorSnackbar, infoSnackbar } from '@/api/GlobalActions';
import StudentItemDisplay from '@/components/learn/StudentItemDisplay'
import StudentFolderDisplay from '@/components/learn/StudentFolderDisplay'
import BaseTable from    '@/components/base/baseTable'
import { sh } from "@/views/learn/sh.js"
import { subject } from "@/api/subject.js"
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
        topFolder: [{grade:null, subjectid:null}],  //this is the folder we requested, or the above folder if we request a file
        currentImage:'',  
        progress:false,
    }),
    activated: function () {
    },
    computed: {
      displayFolder() {
        if (this.topFolder && this.topFolder.name) {
          return this.topFolder.name
        }
        return "NO FOLDER"
      },
      displayFolderBack() {
        console.log(this.topFolder.description,this.topFolder.folder)
        if (this.topFolder && this.topFolder.description != this.topFolder.folder) {
          return [this.topFolder.folder , this.folderid].join()
        }
        return "ROOT"
      },
    },
    methods:{
      shortName(sid = this.topFolder.subjectid) {
        return subject.shortName(sid)
      },
      subjectColor(sid = this.topFolder.subjectid) {
        return subject.color(sid)
      },
      getFolder(folderid = this.folderid) {
        this.folderid = folderid
        if (folderid < 1) {
          sh.contentData('folderdata', this.loadData, {folderid: 0
                                                      ,grade:this.topFolder.grade || 0
                                                      ,subjectid:this.topFolder.subjectid || 0})
        } else {
          sh.contentData('folderdata', this.loadData, {folderid: folderid, grade:this.topFolder.grade || 0
                                                      ,subjectid:this.topFolder.subjectid || 0})
        }
      },        
      loadData(response) {
         //zmlLog('SH-FolderView' , "Platform", this.folderid)
         console.log('loadData = ', this.folderid, response)
         this.contents.length = 0
         this.topFolder = {}
         if (!Array.isArray(response) || (response.errorcode && response.errorcode != 0) ) {
           if (response.errorcode == 5) {
             this.findFolder({contentid:this.folderid})
             return
           }
           this.showNoInfoDialog = true
           //console.log(Array.isArray(response) , response.errorcode, response)
           //alert('we have no data - response was ' + response);
           return
         }
         let topid = response.findIndex(ele => ele.contentid == this.folderid)
         //if (response.length != 1 && topid > -1) {
           if (topid > -1) {
            this.topFolder = {name:response[topid].name,
                             contentid:response[topid].contentid,
                             grade:response[topid].grade,
                             subjectid:response[topid].subjectid,
                             folder:response[topid].folder,
                             description:response[topid].description}
            response.splice(topid,1)
         } else {
            topid = 0
            this.topFolder = {name:response[topid].name,
                             contentid:response[topid].contentid,
                             grade:response[topid].grade,
                             subjectid:response[topid].subjectid,
                             folder:response[topid].folder,
                             description:response[topid].description}
           /* if (response.length == 1) {
              this.topFolder.name = 'Root'
              response.splice(0,1)
           } */
         }
         if (this.folderid == 0 ) this.topFolder.name = 'Top'
         this.contents = response
         console.log('topfolder is assigned and contents is assigned', this.topFolder, this.contents.length)         
         //zmlLog('SH-FolderView' , "Items", response.length)
         this.contents.forEach(item =>{
            item.img = ''
            item.expand = false
            if (item.type == 'file' && item.description.substr(0,4) == 'load') {
                item.img = 'https://www.kuiliesonline.co.za/' + item.description.substr(5)
            }                     
         })
         //Here we will know what the subjectid and grade is, if folder successfully read.
      },
      findFolder(xx) {
        //console.log('not a folder!', xx)
        alert('not a folder? xxx' + xx)
      },
      prevFolder(folderItem) {
         //ask for the information about the folder we need to go back to...
         if (folderItem.contentid) {
            //console.log('fetching folder : ', folderItem.contentid)
            sh.prevFolderData('prevFolder', this.prevFolderData, folderItem)
         } else {
            infoSnackbar('Not enought Folder info...')
         }
      },
      prevFolderData(response) {
        console.log('PrevFolderData : received items : ', response.length, response)
        this.getFolder(response[0].contentid)
      },
      displayItem(curitem) {
          this.$cs.l('Display Item ' , curitem)
          switch (curitem.type) {
            case 'text': 
                this.theItem = curitem
                this.showTextDialog = true
                break
            case 'folder'    :
              //infoSnackbar('View all content inside a folder' + curitem.folder)  
              this.filter = curitem.folder
              break
            case 'link': 
              this.$cs.l('OPENING LINK : ' , curitem.description)
              window.open(curitem.description, "_blank")
              break
            case 'file':
              window.open("https://www.kuiliesonline.co.za/" + curitem.description.substr(5)
                        , "_blank")
              break
            default:
              errorSnackbar('We do not understand:', curitem.type)  
          }
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
      setTimeout(() => { this.stillMounting() }, 2000)
     
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