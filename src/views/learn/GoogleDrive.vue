<template>
<div    v-cloak 
        @drop.prevent="addFile" 
        @dragover.prevent
        @dragenter="dragEnter" 
        @dragend="dragEnd"
        v-show="getZml.grade && getZml.subjectid"
>


<!-- MAIN MENU -->    
  <v-card class="ma-1 px-2">
   <v-row>
    <v-col cols=4>
      <base-drop-down  
      :disabled="getZml.subjectid > 0 && getZml.grade > 0"
      :items="mainMenuItems" 
       menuName="Menu"
       v-bind:value="mainMenuItemselected"
       v-on:input="doMainMenuStuff($event)"
       @changeIT="doMainMenuStuff($event)"
     />
    
    </v-col>
    <v-col cols=8>

<!-- SHOW INTERFACE FOR FOLDER LIST and OTHER ITEMS like ADD FILES-->              
  <v-card  v-if="mainMenuItemselected=='New File'" class="ma-3 pa-2" color="blue lighten-2">
        <v-icon> S </v-icon> elected folder : <strong>{{ folderObj.name }}</strong>
        <br>
        <i v-if="files.length == 0">You are welcome to drag your files from explorer,
               and drop them on this blue pad for further processing, or click on the paperclip below
               to upload a single file.
         <v-file-input
            v-model="inputFiles"
             show-size
             counter
             :accept="addFile" 
             label="File input"
             :rules="fileRules"
         ></v-file-input> 
         <v-btn v-if="inputFiles" @click="addInputFile(inputFiles)"> 
         <v-icon> mdi-file-check </v-icon>Check 
         </v-btn>
        </i> 
        <div v-else v-for="(f,index) in files" :key="index">
          <v-card class="ma-2" :loading="loadStatus">
           {{ f.name }} - {{ f.size / 1024 | decimal }} kb - {{ f.done }}
          </v-card>
        </div>
        <v-btn v-if="files.length > 0" small @click="uploadTheFilesCheck" :loading="loadStatus">
            <v-icon> mdi-upload </v-icon>
             Upload ( {{files.length }})
        </v-btn>
        <v-btn v-if="files.length > 0" small @click="uploadCancel">
            <v-icon> mdi-cancel </v-icon>
            Cancel Upload 
        </v-btn>
  </v-card>


<!-- SHOW INTERFACE FOR ADD A FOLDER -->      
  <v-card v-if="mainMenuItemselected=='New Folder'" class="ma-3 pa-2" color="blue lighten-4">
    <div class="caption" style="color:white"> create a new folder </div>
    <v-flex>
        <v-text-field label="New Folder Name" v-model="newFolder" clearable dense :rules="nameRules" />
    </v-flex>
    <v-flex >
        <v-spacer />
       <v-btn small  @click="saveNewFolder" color="primary"> <v-icon small > mdi-content-save </v-icon></v-btn>
       <v-btn small  @click="mainMenuItemselected=null" color="red">  <v-icon small > mdi-cancel </v-icon></v-btn>
    </v-flex>
  </v-card>


<!-- SHOW INTERFACE FOR SELECT OR DELETE A FOLDER (FOLDERSLIST) -->    
  <v-card v-if=" mainMenuItemselected=='Select Folder' || mainMenuItemselected==null " class="ma-3 pa-2" color="light-blue darken-3">
      <!--div class="caption" style="color:white"> folder selection </div-->

      <v-btn class="caption" 
           style="color:white" 
           x-small
           text  
           title="Click to change from root folders to all folders"
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
          There are no folders yet, please create a "New Folder"
       </div>
        <v-btn @click="selectFolder(f)" 
                v-for="f in folderFilter"
                :key="f.folderid"
                color="green lighten-4"
                class="ma-2 no-uppercase"
                rounded
                >
         <strong>{{ f.name }}</strong>
        </v-btn>
  </v-card>


   </v-col>
   </v-row>
  </v-card>

<!-- ----------------- SHOW FOLDER NAME ON CHIP ----------------------- -->
<v-container fluid v-show="!!folderObj.name">
  <v-layout class="ma-1" row wrap>
    <v-flex>
      <base-drop-down  
      :disabled="!folderObj.name"
      :items="folderMenuItems" 
      :menuName="folderObj.name"
       v-bind:value="mainMenuItemselected"
       v-on:input="doFolderMenuStuff($event)"
     />

    </v-flex>
  </v-layout>
</v-container>


<!-- MAIN CANVAS ------------(Show Files, text, links and folders for selected folder --->
<google-drive-items :itemList="filterContent" 
                    :folderObj="folderObj" 
                   @iconClick="iconClick"
                   @contentProperties="contentProperties" />
<br /> <br /> 


<!-- DIALOG WINDOWS --------------------->
<!-- SHOWING FOLDER PROPERTIES -->
 <v-dialog v-model="showFolderProperties" max-width="500" >
   <v-layout row class="ma-2">
     <v-flex>
  <v-card color="blue lighten-5" class="ma-2">
    <v-card-title>
      Folder Properties
    </v-card-title>
    <v-card-text>
        <v-text-field v-model="folderObj.name" label="Name"></v-text-field>
        {{ folderObj }}
    </v-card-text>
      <v-card-actions>
      <v-spacer />
              <v-spacer />
        <v-btn @click="showFolderProperties = false" 
               color="red" 
               small>
          <v-icon small > mdi-cancel </v-icon>
          Cancel
        </v-btn>      

        <v-btn @click="updateFolderName" 
               color="primary"
               small
               :disabled="loadStatus" >
          <v-icon small > mdi-content-save </v-icon> 
          Rename
        </v-btn>
      </v-card-actions>
  </v-card>
     </v-flex><v-flex>
       <v-card color="blue lighten-4" class="ma-2">
    <v-card-title>
      Folder Operations
    </v-card-title>
    <v-card-text>
      <v-btn small class="ma-2 no-uppercase"
         @click="doMainMenuStuff('New Link')">        
         Add a URL to the folder 
      </v-btn>
      <v-btn small class="ma-2 no-uppercase" 
             @click="doMainMenuStuff('New Text')">
         Add Text Message to the folder 
      </v-btn>
      <v-btn small class="ma-2 no-uppercase" 
             @click="doMainMenuStuff('New File')"> 
             Add more Files to the folder 
      </v-btn>
      <v-btn small class="ma-2 no-uppercase" 
             @click="doMainMenuStuff('Add Folder to Folder')"> 
             Experimental - Add a folder to the folder 
      </v-btn>

    </v-card-text>
       </v-card>
     </v-flex>
   </v-layout>
 </v-dialog>

<!-- SHOWING FILE PROPERTIES -->
 <v-dialog v-if="curContent" v-model="showFileProperties" max-width="500" >
  <v-card>
    <v-card-title>
       <v-icon> {{ curContent.icon }} </v-icon>  
         Properties for: 
       <v-card color="blue lighten-5" class="caption ma-2 pa-2">
         {{ curContent.name | shorten }} ( {{ curContent.type }} )
       </v-card>
    </v-card-title>
    <v-card-text>
        <template v-if="curContent && curContent.type == 'file'">      
          <v-text-field dense v-model="curContent.name" label="Name" />
        </template> 
        <template v-if="curContent && curContent.type == 'link'">
          <v-text-field dense v-model="curContent.name" label="URL/Link" />
          <v-textarea dense v-model="curContent.description" label="Link Description" />
        </template>
        <template v-if="curContent && curContent.type == 'text'">
          <v-text-field dense v-model="curContent.name" label="Text Heading" />
          <v-textarea dense 
                      v-model="curContent.description" 
                      label="Text" 
                      xstyle="width:200px;"
                      xheight="60"
                      append-icon="mdi-text-box"
                      xclass="ml-5"                      
                      />
        </template>
           <v-row>
             <v-col cols="6" md="5">        
                <v-select
                v-model="curContent.folder"
                :items="folderFilter"
                item-text="name"
                item-value="name"
                chips dense
                label="Folder"
                title="Move the file to a different folder"
                />       
             </v-col>
             <v-col cols="6" md="5">     
               <v-select
               v-model="curContent.accesstype"
               :items="['teacher','student']"
               chips dense
               label="Access type"
               title="Would you like the students to see this?"
              />       
             </v-col>
              <v-col cols="3" md="2" xclass="pt-9">
              <v-text-field v-show="curContent.mode != 'add'" dense v-model="curContent.sortorder" label="Sort" />
             </v-col>
           </v-row>
        <v-card class="ma-2 pa-2" v-if="curContent.showDescription">
        Original Filename : {{ curContent.showDescription | file }}
        <!--
        <div class="caption">folder:{{curContent.folder}}</div>
        <div class="caption">access:{{curContent.accesstype}}</div>
        <div class="caption">created:{{curContent.create_timestamp}}
                          , updated:{{curContent.update_timestamp}}</div>
        -->
        </v-card>
    </v-card-text>
      <v-card-actions>
        <v-btn @click="deleteContent" 
               color="red lighten-4"  
               small>
          <v-icon small > mdi-delete </v-icon>
          Delete
        </v-btn>      
        <v-btn @click="iconClick" 
               color="blue-grey lighten-5"
               icon
               small>
          <v-icon small > mdi-view-compact </v-icon>
        </v-btn>      

      <v-spacer />
        <v-btn @click="showFileProperties = false" 
               color="red darken-2" 
               small>
          <v-icon small > mdi-cancel </v-icon>
          Cancel
        </v-btn>      

        <v-btn @click="updateContent" 
               color="primary"
               small
               :disabled="loadStatus" >
          <v-icon small > mdi-content-save </v-icon> 
          Update
        </v-btn>

      </v-card-actions>
  </v-card>
 </v-dialog>

 
<!-- Create a new folder, inside current folder (or other folder) -->
<v-dialog v-model="showFolderInFolderProperties" xmax-width="500" >
  {{ folderFilter }}
  <v-card color="blue lighten-5" class="ma-2">
    <v-card-title>
      Folder Properties
    </v-card-title>
    <v-card-text>
        <v-text-field v-model="curContent.name" label="Name"></v-text-field>
        <v-select
             v-model="curContent.folder"
             :items="folderFilter"
             item-text="name"
             item-value="realfoldername"
             label="Folder"
             title="Folder where this one can live."
        />            
        <!--v-textarea v-model="curContent.description" label="Description"></v-textarea-->
        
    </v-card-text>
      <v-card-actions>
      <v-spacer />
              <v-spacer />
        <v-btn @click="showFolderInFolderProperties = false" 
               color="red" 
               small>
          <v-icon small > mdi-cancel </v-icon>
          Cancel
        </v-btn>      

      </v-card-actions>
  </v-card>
</v-dialog>


<!-- Create a new folder, inside current folder (or other folder) -->
<v-dialog v-model="showMoveFolder" max-width="350" >
  <v-card color="blue lighten-5" class="ma-1 pa-2 text-center">
    <v-card-text class="ma-2 pa-2">
      <v-card class="ma-2 pa-2" color="green">
      Move {{ curContent.name }} underneath another folder or select {{ curContent.name }} to keep it in root.      
      </v-card>
        <!--v-text-field v-model="curContent.name" label="Name" disabled></v-text-field-->
        <v-select
             v-model="curContent.folder"
             :items="folderFilter"
             item-text="name"
             item-value="description"  
             label="Folder"
             title="Folder where this one can live."
        />            
        <!--//description is the REAL foldername! above, so we send that as value-->
    </v-card-text>
      <v-card-actions>

        <v-btn @click="showMoveFolder = false" 
               color="red" 
               small>
          <v-icon small > mdi-cancel </v-icon>
          Cancel
        </v-btn>      
              <v-spacer />
        <v-btn @click="moveToFolder" 
               color="primary"
               small
               :disabled="loadStatus" >
          <v-icon small > mdi-content-save </v-icon> 
          Move
        </v-btn>
      </v-card-actions>
  </v-card>
</v-dialog>


<!-- -----------------  PREVIEW DIALOGS ---------------------- -->
<v-dialog v-model="showMovie" xmax-width="400"  :fullscreen="$vuetify.breakpoint.mobile">
  <zml-preview :src="src" type="movie">
    <zml-close-button @btn-click="showMovie = !showMovie" />
  </zml-preview>
</v-dialog>
<v-dialog v-model="showAudio" xmax-width="400">
  <zml-preview :src="src" type="audio">
    <zml-close-button @btn-click="showAudio = !showAudio" />
  </zml-preview>
</v-dialog>

<v-dialog v-model="showTestDialog" :fullscreen="$vuetify.breakpoint.mobile">
  folder OBJ = {{ folderObj}} <br>
  curContent = {{ curContent }}
</v-dialog>

<v-dialog v-model="showPicture" xmax-width="400" :fullscreen="$vuetify.breakpoint.mobile">
  <zml-preview   :src="src" type="picture"  >
    <zml-close-button @btn-click="showPicture = !showPicture" />
  </zml-preview>  
</v-dialog>

<v-dialog v-model="showOther" xmax-width="400" :fullscreen="$vuetify.breakpoint.mobile">
<zml-preview   :src="src" type="Other"  >
  <zml-close-button @btn-click="showOther = !showOther" />
</zml-preview>
</v-dialog>

<template v-if="getZml.login.isAuthenticated && getZml.login.username=='werner'">
  <v-card color=blue>
   <v-row>
    <v-col cols="4" v-for="(f,i) in content" :key="i">
     <v-card class="ma-2 pa-1">
      {{i}} {{ f }} <br>
     </v-card>
    </v-col>
   </v-row>
  </v-card>
  <v-card color=green>
   <table color="light-green" v-for="(f,i) in folderObj" :key="i"> <tr><td>{{ f }}</td></tr> </table>
   <hr>folderFilter {{folderFilter.length}} <br>
   <v-row>
    <v-col cols="4"  v-for="(f,i) in folderFilter" :key="i" class="ma-2 pa-2">
     <v-card> 
        {{f.contentid }} {{f.name}} <br> {{f.description}} g & s = {{ f.grade }}, {{ f.subjectid }} 
     </v-card>
    </v-col>
   </v-row>
   getZml.folders : {{ getZml.folders.length }} Subs : {{ getZml.subjects.length }}
   <v-row>
    <v-col cols="6" v-for="(f,i) in getZml.folders" :key="i">
     <v-card class="ma-2 pa-1">
      {{f.contentid }} {{f.name}} <br> {{f.description}} g & s = {{ f.grade }}, {{ f.subjectid }}
     </v-card>
    </v-col>
   </v-row>
  </v-card>
  
</template>

</div>
</template>
<script>
import { zmlConfig } from '@/api/constants.js';
import { zmlFetch } from '@/api/zmlFetch.js';
import { zmlLog } from '@/api/zmlLog.js';
import { getters } from "@/api/store";
import { errorSnackbar, infoSnackbar } from '@/api/GlobalActions';
import baseDropDown from '@/components/base/baseDropDown.vue'
import getIcon from '@/api/fileUtils.js'
import zmlPreview from '@/components/zmlPreview.vue'
import zmlCloseButton from '@/components/zmlCloseButton.vue'

import GoogleDriveItems from '@/components/learn/GoogleDriveItems.vue'
  export default {
    name: "viewContent",
    props: ['subjectid','grade'],
    components: {baseDropDown, zmlPreview, zmlCloseButton,GoogleDriveItems},
    data: () => ({
        showFolderProperties:false,
        showFileProperties:false,
        showFolderInFolderProperties:false,
        showMoveFolder:false,
        showTestDialog: false,
        mainMenuItemselected:null,        
        mainMenuItems:[ 
                   {title:'Select Folder',icon:'mdi-folder'},
                   {title:'New Folder', icon:'mdi-folder-plus-outline'},
                   {title:'New File', icon:'mdi-file'},
                   /*{title:'Move Folder',icon:'mdi-folder-move'},*/
                   /*{title:'Empty Folder',icon:'mdi-delete'},*/
                   {title:'Delete Folder',icon:'mdi-delete-empty'},
                   {title:'Refresh Folder',icon:'mdi-database-refresh'},
                   ],
        folderMenuItemselected:null,                   
        folderMenuItems:[
                   /*{title:'Rename Folder',icon:'mdi-folder'},*/
                   {title:'Move Folder', icon:'mdi-folder-move'},
                   //{title:'Include New Folder', icon:'mdi-folder-move-outline'},
                   {title:'New File', icon:'mdi-file'},
                   {title:'New Link', icon:'mdi-link'},
                   {title:'New Text',icon:'mdi-note-text'},
                   ],
                   /*
        fileMenuItemselected:null,                   
        fileMenuItems:[{title: 'Rename Content', icon:'mdi-rename-box'},
                       {title: 'Properties',icon:'mdi-propane-tank-outline'}
                      ],
                      */
        curContent:{},
        nameRules: [
         v => !!v || 'Path is required',
         v => v.length <= 20 || 'Path must be less than 80 characters',
        ],
        fileRules: [
          value => !value || value.size < 20000000 || 'File size should be less than 20 MB!',
        ],
        getZml: getters.getState({ object: "gZml" }),
        loadingAddFolder: false,
        newFolder:'',
        oldFolderName:'',        
        folderObj:{},
        newFolderObj:{},
        showRootFolders:false,
        edit: {},
        dummyObj:{},
        editMode: null,
        loadStatus:false,
        search: '',
        searchInput: '',
        accesstypeitems: [{id:1,text:"student"},{id:2,text:"pers"},{id:3,text:"hidden"}],
        content: [],
        files: [],
        inputFiles: [],
        sortName: false,
        showMovie:false,
        showAudio:false,
        showPicture:false,
        showOther:false,
        src:'',
    }),
    methods: {
        iconClick(c) {
          //iconClick is for showing a review of the current content
          //console.log('iconclick received', c.type,c)
          if (c.type == 'text') return
          this.curContent = c
          if (c.type == 'folder') {
             this.getReadyToSelectFolder(c)
             return
          }
          if (this.curContent.description.substr(0,4) == 'load'){          
            this.src = "https://kuiliesonline.co.za/" + this.curContent.description.substr(5)
            switch (getIcon(this.src)) {
            case 'mdi-file-image' : this.showPicture = true; break;
            case 'mdi-image' : this.showPicture = true; break;
            case 'mdi-movie' : this.showMovie = true; break;
            case 'mdi-music-note' : this.showAudio = true; break;
            case 'mdi-file-music' : this.showAudio = true; break;
            default : this.showOther = true;
            }
          } else {
            this.src = this.curContent.name
            this.showOther = true;
          }
        },
        contentProperties(c) {
            console.log('GD:content Properties:', c)
            this.curContent = c
            this.curContent.showDescription = ''
            /*
            if (c.type == 'folder') {
              this.getReadyToSelectFolder(c)
              return
            }
            */
            if (c.description.substr(0,5) == 'load:') {
                this.curContent.showDescription = c.description.substr(6)
            } else if (c.description.substr(0,7) == 'folder:') {
                this.curContent.showDescription = c.description.substr(8)
            }
            this.showFileProperties = true;
                 
        },
        getReadyToSelectFolder(c) {
          console.log('GD:GETREADYTOSELECTFOLDER',c.name, c)
            //get the folder from folderObj and pass it to selectFolder
            //But we cannot use folderfilter, since it might onlu contain rootfolders
            //let fIdx = this.folderFilter.findIndex(p => p.foldername == c.name);
            let fIdx = this.getZml.folders.findIndex(p => 
              p.name == c.name 
              && p.grade == this.getZml.grade
              && p.subjectid == this.getZml.subjectid
            )

            if (fIdx != -1) {
              console.log('passing : ', this.getZml.folders[fIdx])
               this.selectFolder(this.getZml.folders[fIdx])
            }
            console.log('GD:Result : We could not find it ', fIdx,this.getZml.folders)
            return
        },
        selectFolder(folder) {
          console.log('GD:SELECTFOLDER')
           console.log('selectFolder ', folder)
           this.folderObj = folder
           this.oldFolderName = folder.name
           this.mainMenuItemselected = null
           console.log('folder selected:', this.folderObj)
        },
        moveToFolder() {
          this.curContent.mode == 'update'
          if (this.curContent.folder == '') {
            alert('no update')
            return
          }
          console.log('moving to folder:',this.curContent.folder)
          this.showMoveFolder = false
          this.updateContent()
        },
        doFolderMenuStuff(e) {
            console.log('folder menu Item = ', e)
            this.showFolderProperties = false
            this.folderMenuItemselected = e
            if (this.folderMenuItemselected == "New File") {
              //console.log('activeate new file')
                this.mainMenuItemselected = this.folderMenuItemselected
                this.folderMenuItemselected = null

            }

            if (this.folderMenuItemselected == "New Text") {
              this.curContent = this.fillContentDefaultFile()
              this.curContent.mode ='add'
              this.curContent.sortorder = 50
              this.curContent.type ='text'
              this.curContent.description =''

              this.folderMenuItemselected = null
              this.showFolderProperties = false
              this.showFileProperties = true
           }
           if (this.folderMenuItemselected == 'Rename Folder') {
              //console.log('renaming folder popup')
              this.folderMenuItemselected = null
              this.showFolderProperties = true;
           }
           if (this.folderMenuItemselected == "New Link") {
              this.curContent = this.fillContentDefaultFile()
              this.curContent.mode ='add'
              this.curContent.sortorder = 50
              this.curContent.type ='link'
              this.curContent.description =''
              this.curContent.name ='https://'

              this.mainMenuItemselected = null                  
              this.showFolderProperties = false
              this.showFileProperties = true
           }
           if (this.folderMenuItemselected == 'Move Folder') {
              this.mainMenuItemselected = null        
              //we find the content for the current selected folder, and load in curContent
              // then we display moveFolder, and allow them to select another folder
              this.curContent = this.content.find(ele => ele.name == this.folderObj.name)
              this.showMoveFolder = true
           }

           if (this.folderMenuItemselected == 'Include New Folder') {
              this.mainMenuItemselected = null                  
              this.showFolderInFolderProperties = true
              this.fixUpForAddFolder()
           }



        },
        doMainMenuStuff(e) {
          console.log('main menu Item = ', e)
          this.showFolderProperties = false
           this.mainMenuItemselected = e

           if (this.mainMenuItemselected == "Delete Folder" 
            || this.mainMenuItemselected == "New File" 
            || this.mainMenuItemselected == "Move Folder" 
            || this.mainMenuItemselected == "Empty Folder") {
               if (!this.folderObj.name) {
                  infoSnackbar('You need to select a folder before you use "' + this.mainMenuItemselected + '"')
                  this.mainMenuItemselected = null                  
                  return
               }
           }
           if (this.mainMenuItemselected == "Select Folder" && this.folderFilter.length == 0) {
               //infoSnackbar('You need to create folder first!')
               return
           }
           if (this.mainMenuItemselected == "Empty Folder") {
               this.mainMenuItemselected=='Select Folder'  //we use this to still display folders on screen
               //console.log('start empty folder', this.folderObj.foldername)               
               if (!this.folderObj.name) {
                   infoSnackbar('we have no selected folder')
                   return
               }
               this.confirmEmptyFolder(this.folderObj)
           }
           if (this.mainMenuItemselected == "Delete Folder") {
               this.mainMenuItemselected=='Select Folder'  //we use this to still display folders on screen
               //console.log('delete folder', this.folderObj.foldername)
               if (!this.folderObj.name) {
                   infoSnackbar('we have no selected folder')
                   return
               }
               this.confirmDeleteFolder(this.folderObj)
           }
           if (this.mainMenuItemselected == "Refresh Folder") {
               //console.log('refresh - loadfolders and the data')
               this.loadFolders()
           }
           //-------------------------------------------------- INSIDE FOLDER STUFF===========
        },
        fixUpForAddFolder() {
          console.log('GD:FIXUPFORADDFOLDER')
          this.curContent = {name: ''
                   , description:''
                   , type:'folder'
                   , folder:'new folder name'
                   , realfolder:''
                   , accesstype: 'student'
                   , grade: this.getZml.grade.toString()
                   , subjectid:this.getZml.subjectid
                   , subject:this.getZml.subject
                   , persid: this.getZml.login.userid
                   , icon: 'mdi-folder'
                   , sortorder: 90}
          this.curContent.mode = 'add'

        },
        folderProperties() {
           this.showFolderProperties = true;
        },
        updateFolderName() {
           //console.log('Start rename folder ' + this.folderObj.folderid + ' to ' + this.folderObj.foldername)
           if (this.oldFolderName == this.folderObj.name) {
               infoSnackbar('the two names are the SAME!!!!')
               return
           }
           if (this.oldFolderName == '') {
               infoSnackbar('We do not have the old folder name')
               return
           }
           if (this.folderObj.name == '') {
               infoSnackbar('Folder cannot be blank')
               return
           }

           let ts = {};
           ts.data = this.folderObj
           ts.data.persid = this.getZml.login.userid
           ts.data.oldfoldername = this.oldFolderName
           ts.api = zmlConfig.apiDKHS
           ts.task = 'renameFolder';
           this.progress = true;
           
           zmlFetch(ts, this.afterRenameFolder);               
           this.showFolderProperties = false;
        },
        afterRenameFolder(response) {
            console.log('after rename :' , response)
            this.loadFolders();
        },
        chipColor(ctype) {
            if (ctype == 'file') return "green lighten-2"
            if (ctype == 'link') return "orange darken-4"
            if (ctype == 'text') return "grey lighten-5"
            return "deep-orange accent-4"
        },
        deleteContent() {
            //console.log('asking permission to delete : ' , this.curContent)
            this.myConfirm('Are you sure about deleteing this file ?'
                         , this.curContent
                         , this.deleteContentConfirmed
            )
        },
        deleteContentConfirmed() {
          this.curContent.mode == 'update'
          this.showFileProperties = false
          this.curContent.sortorder = 0
          this.updateContent()
        },
        updateContent() {
          console.log('GD:UPDATECONTENT')
          //console.log('Update Content:', this.curContent) 
          if (this.curContent.mode == 'add') {
             console.log('HERE We ADD CONTENT STUFF') 
             //Check if data is good.
             if (this.curContent.type == 'link') {
               if (this.curContent.name.length < 5) {
                   infoSnackbar('A link should be longer than 5 characters.')
                   return
               }
               if (this.curContent.name.substr(0,4) != 'http') {
                   infoSnackbar('A link should start with https://, please try again')
                   return
               }
               if (this.curContent.description == '') {
                 this.curContent.description = this.curContent.name
               }

             }
             let ts = {}
             ts.data = this.curContent
             ts.data.persid = this.getZml.login.userid
             ts.task = 'insertlcontent'
             ts.api = zmlConfig.apiDKHS
             this.progress = true;
             this.showFileProperties = false
             zmlFetch(ts, this.afterSaveData);   
             this.loadFolders();
             return
          } else {
             console.log('HERE WE UPDATE CONTENT', this.curContent) 
             let ts = {}
             ts.task = 'updatelcontent'
             ts.data = this.curContent
             ts.data.persid = this.getZml.login.userid
             ts.api = zmlConfig.apiDKHS
             this.progress = true;
             this.showFileProperties = false
             zmlFetch(ts, this.afterSaveData);   
          }
        },
      saveNewFolder() {
        console.log('GD:SAVENEWFOLDER')
        if (this.newFolder == '') return
        if (this.getZml.grade == '') { errorSnackbar('We need a grade'); return;}
        if (this.getZml.subjectid == '') { errorSnackbar('We need a subject'); return;}
        this.loadingAddFolder = true
        let obj = {foldername: this.newFolder
                  ,realfoldername: this.newFolder
                  ,grade: this.getZml.grade
                  ,subjectid: this.getZml.subjectid
                  ,sortorder: 22
                  ,icon: 'mdi-folder'
        }
        zmlFetch({task: 'addfolders', data: obj ,api: zmlConfig.apiDKHS}, this.afterFolderUpdate, this.errorAddFolder);
        this.mainMenuItemselected = null
      },
      confirmEmptyFolder(folder) {
            this.myConfirm('Are you sure about deleting all files for this folder ?'
                           ,folder
                           ,this.emptyFolder)
      },
      emptyFolder(folder) {
          console.log('inside emptyFolder', folder)
          alert('stop!!!')
          /*
          let ts = {};
          ts.data = folder;
          ts.api = zmlConfig.apiDKHS
          ts.task = 'emptyFolder';
          this.progress = true;
          zmlFetch(ts, this.afterFolderUpdate);   
          */
      },
      confirmDeleteFolder(folder) {
            this.myConfirm('Are you sure about deleting all files and  this folder ?'
                           ,folder
                           ,this.deleteFolder)
      },
      deleteFolder(folder) {
           let ts = {};
           ts.data = folder;
           ts.api = zmlConfig.apiDKHS
           ts.task = 'deleteFolder';
           this.progress = true;
           zmlFetch(ts, this.afterFolderDeleteUpdate);
      },      
      afterFolderDeleteUpdate(response) {
           this.folderObj = {}
           zmlConfig.cl(response)
           zmlFetch({task: 'getfolders',api: zmlConfig.apiDKHS}, this.updateFoldersAfterAdd)
      },
      afterFolderUpdate(response){
        if (response.errorcode > 0) {
           errorSnackbar('Error on Folder: ' + response.errorcode)
        }
        zmlConfig.cl(response)
        zmlFetch({task: 'getfolders',api: zmlConfig.apiDKHS}, this.updateFoldersAfterAdd);
      },
      updateFoldersAfterAdd(response){
        this.folderObj = {};
        this.getZml.folders = response
        this.showAddFolder = false;
        this.loadingAddFolder = false
        this.mainMenuItemselected = null
        console.log('FOLDERS SHOULD BE UPDATED NOW!!')
        this.doMainMenuStuff("Select Folder")
      },
      errorAddFolder(response){
         //console.log('AddFolderError:',response);
         errorSnackbar('Error on Folder: ' + response)
      },
      

      dragEnd(ev) {
        //ev.target.style.backgroundColor = 'primary'
        console.log('dend',ev)
      },
      dragEnter(ev) {
        //ev.target.style.backgroundColor = 'green'
        console.log('dent',ev)
      },
      //Handle single file for upload...
      addInputFile(e) {
        if (!e.size) return   
        if (e.size > zmlConfig.maxUploadSize || e.size == 0)  {
           errorSnackbar('Your file is too big - put on memory stick and leave at reception for Werner, please try again.' + e.size)                
           return
        }
        //We are hapy with these files, mark them all as not done.
        e.done = false
        this.files.push(e);
        infoSnackbar('We have ' + this.files.length + ' files, ready for upload. Press the upload button')
        this.inputFiles = []
        this.uploadTheFilesCheck() 
      },
      //Handle multiple files for upload...
      addFile(e) {
        let lfiles = e.dataTransfer.files
        let toobig = false
        lfiles.forEach(file => {
          if (file.size > zmlConfig.maxUploadSize)  {
             toobig = true
          }
        })
        if (toobig == true) {
           errorSnackbar('Your file is too big - put on memory stick and leave at reception for Werner, please try again')                
           return
        }
        let dup = 0
        lfiles.forEach(file => {
          this.files.forEach(already => {
              console.log(already.name, file.name)
              if (file.name == already.name)  {
                dup += 1
              }
          })
        })
        if (dup > 0)  {
            errorSnackbar('We have a duplicate filename - please try again')
            return
        }
        //We are hapy with these files, mark them all as not done.
        lfiles.forEach(file => {
            file.done = false
            this.files.push(file);
        })
        infoSnackbar('We have ' + this.files.length + ' files, ready for upload. Press the upload button')
      },
      uploadCancel() {
            this.myConfirm('Are you sure about cancelling the file upload process ?'
                         , null
                         , function () {
                             this.files = []
                             this.loadStatus=false
                             infoSnackbar('If this was a big file, it would be best to refresh your browser.')
                         })
        },
      uploadTheFilesCheck() {
        let edit = this.fillContentDefaultFile()
        if (!edit.folder) {
           errorSnackbar('You need to select a folder before we can upload')
           return
        }        
        if (edit.folder.length < 2) {
           errorSnackbar('You need to select a folder before we can upload')
           return
        }
        if (edit.grade < 8) {
           infoSnackbar('You need to select a grade before we can upload')
           return
        }
        if (edit.subject < 1) {
           infoSnackbar('You need to select a subject before we can upload')
           return
        }
        if (edit.type != 'file') {
           infoSnackbar('filetype is wrong')
           return
        }
        this.dummyObj = edit;
            
        this.$root.$confirm("Loading files to " + edit.folder, "If you press YES, we will start loading", { color: 'red' })
              .then((confirm) => {
                if (confirm) { 
                  let fdet = edit;
                  this.uploadFiles(this.upload1, fdet)
                } else {
                  this.files = []
                  return
                }
            })
      },
      uploadFiles(nextProc,fdet) {
        this.files.forEach(file => {
         this.loadStatus = true;
         this.dummyObj.name = file.name
         let fr = new FileReader()
         fr.onload = function(response) {
           fdet.name = file.name
           nextProc(response,fdet)
         };
         fr.onerror = function(response) {
           console.log('res - Some Error!' ,response);
         };
         fr.readAsDataURL(file);

        });
      },
      upload1(fileData,fdet) {
         fileData.task = 'upload'; 
          let GR = fdet.grade.toString()
          GR = 'GR' + GR.padStart(2, '0')
          const idx = this.getZml.subjects.findIndex(ele => ele.subjectid == fdet.subjectid)
          const subjectpath = this.getZml.subjects[idx].path
         fileData.extrapath =  "/Subjects/" + GR + "/" + subjectpath + "/" + fdet.realfolder
         //console.log('EXTRAPATH = ', fileData.extrapath)
         fileData.name = fdet.name
         fileData.realname = fdet.name
         //////fileData.drag = this.files[0]
         fileData.prebase64 = fileData.target.result.split(',')[0];
         fileData.base64 = fileData.target.result.split(',')[1];
         fileData.size = fileData.total
         fileData.api = zmlConfig.apiUpload; 
         console.log('start upload with ', fileData);
         zmlFetch(fileData,this.doneWithUpload, this.errorWithUpload)
      },    
      doneWithUpload(response) {
         console.log('Done with upload ' , response.filename  )
         this.files.forEach(file => {
            if (response.filename == file.name)  {
              file.done = true
            }
         })
         //this.loadStatus = false;
         this.dummyObj.description = 'load:' + response.fileName;
         this.dummyObj.name = response.filename;
         //get the good icon here..
         this.dummyObj.icon = getIcon(response.filename)
         console.log('insert content :::::' , this.dummyObj)
         let ts = {};
           ts.data = this.dummyObj;
           ts.task = 'insertLContent';
           ts.api = zmlConfig.apiDKHS
           zmlFetch(ts, this.afterUpload);   
      },
      afterUpload() {
        //see if we have any left...and clean array if done
        //also be carefull of syncing problems - if loadstatus is false we are done...
        if (this.loadStatus == false) return; 
        let cnt = 0;
        this.files.forEach(file => {
           if (file.done == true)  cnt += 1
        })
        //console.log('Check for Finish:',cnt,this.files.length)
        if (cnt == this.files.length) {
            this.files = [];
            this.mainMenuItemselected = null
            console.log('Finished with upload, doing a refresh')
            this.loadStatus = false;
            this.loadData();
        }
      },
      errorWithUpload(response) {
         errorSnackbar('Error with upload ' + JSON.stringify(response) )
         this.loadStatus = false;
      },
      fillContentDefaultFile() {
          console.log('GD:FILLCONTEXTDEFAULT')
          //console.log(this.folderObj)
          let edit = {name: ''
                   , description:''
                   , type:'file'
                   , folder:this.folderObj.name
                   , realfolder:this.folderObj.realfoldername
                   , accesstype: 'student'
                   , grade: this.getZml.grade.toString()
                   , subjectid:this.getZml.subjectid
                   , subject:this.getZml.subject
                   , persid: this.getZml.login.userid
                   , icon: 'mdi-file'
                   , sortorder: 90}
           return (edit)            
        }, 
        afterSaveData(response) {
            if (this.loadStatus == true) return
            zmlConfig.cl('AfterSaveData:',response);
            this.curContent = {}
            this.loadData();
            zmlLog(this.getZml.login.username , "EditContent", JSON.stringify(this.edit).substr(0,250))
        },
// Here we handle all the loading of lcontent, subjects and folders.
        showData(response) {
          console.log('GD:SHOWDATA')
            zmlConfig.cl('content=' , response);
            this.progress = false;
            if (response == '') {
              alert('no data received');
            } else if (response.error) {
              this.content = []
            } else {
              this.content = response;
            }

            this.doMainMenuStuff("Select Folder")
        },
        loadFolders() {
          console.log('GD:LOADFOLDERS')
          if (this.grade && this.subjectid) {
            zmlFetch({task: 'getfolders',api: zmlConfig.apiDKHS}, this.afterFolders);
          }
        },
        loadSubjects(response) {
          console.log('GD:LOADSUBJECTS')
            this.getZml.subjects = response;
            if (this.getZml.folders.length == 0) {
               this.getZml.folders.push({id:1, name:'default'})
               this.loadFolders()
            } else {
               this.loadData();
            }
        },
        afterFolders(response) {
          console.log('GD:AFTERFOLERS')
          this.getZml.folders = response;
          this.loadData();
        },
        loadData() {
           console.log('GD:LOADDATA')
           if (!this.grade || !this.subjectid) {
             this.content = []
             return
           }
           if (this.getZml.login.type != 'student' && this.getZml.login.isAuthenticated) {
              let ts = {};
              ts.sql = 'select * from dkhs_lcontent '
                     + ' where sortorder != 0 '
                     + ' and subjectid = ' + this.subjectid
                     + ' and grade = ' + this.grade
                     + ' order by sortorder, name';
              ts.task = 'PlainSql';
              ts.api = zmlConfig.apiDKHS
              zmlConfig.cl(ts);
              zmlFetch(ts, this.showData);
           } else {
             alert('you are not allowed!')
             this.$router.push({ name: 'Home'}); // ,meta: {layout: "AppLayoutGray" }});
           }
        },
       async myConfirm(message,passedParameter, nextProc) {
        if (await this.$root.$confirm(message,message ,{ color: 'red' })) {
            //console.log('launch payload')
            nextProc(passedParameter)
          } else {
            return
          }
        }
    },
    computed:{
      //Display a list of folders on dropdown
      folderFilter() {
        console.log('GD:FOLDERFILTER')
        let tempT = []
        if (typeof this.getZml.folders === 'undefined' || this.getZml.folders.length == 0) {
          console.log('folders are ZERO LENGTH')
          return ['temp']
        }
        this.getZml.folders.filter(ele => ele.grade == this.getZml.grade && ele.subjectid == this.getZml.subjectid).forEach(item => {
          console.log('folder filter : ', item.folder, item.name, item)
          if (this.showRootFolders) {
              console.log(item.folder, item.name, item)
              if (item.folder == item.description) {
                  const newitem = item
                  tempT.push(  newitem );
              }
          } else {
             const newitem = item
             tempT.push(  newitem );
          }
        })
        console.log('GD:FOLDERFILTER 3', tempT.length)
        return tempT
      },
      filterContent() {
        //return this.content;
         //c.folder == folderObj.foldername && c.type!='folder'
        console.log('GD:FILTERCONTENT')
        console.log('GD:FILTERCONTENT',this.folderObj)
        let res = []         
        if (this.folderObj.name) {
            //take out all foldernames
            this.content.forEach(ele => {
                if (ele.folder == this.folderObj.name) {
                   // if (ele.type != 'folder') {
                      if (ele.name != this.folderObj.name) 
                        res.push(ele);
                   // }
                }
            })
            if (this.SortName == true) { 
               // res.sort((a, b) => a.name.localeCompare(b.name));
               res.sort(function(a, b) {
                 console.log(a.name, b.name)
                 return (a.name.toLowerCase() < b.name.toLowerCase() ? -1 : (a.name.toLowerCase() > b.name.toLowerCase() ? 1 : 0))
               })
            }
            console.log('Length : ', res.length)
            return res
        } else {
           console.log('wys alles Length : ', this.content.length)
           return this.content;
        }
      }
    },  
    filters:{ 
       file : function (filename) {
         if (!filename) return ""
         const pieces =   filename.split('/') 
         if (pieces) {
            return pieces[pieces.length-1] //filename.split('/').pop()
         }
       },
       shorten: function(val) {
         if (!val) return ""
         const valStr = val.toString
         if (valStr.length > 20) {
           return valStr.substr(0,20)
         }
         return val
       },
       uppercase: function(val) {
          if (!val) return "";
          val = val.toString();
          return val.toUpperCase();
       },
       lowercase: function(val) {
          if (!val) return "";
          val = val.toString();
          return val.toLowerCase();
       },
       // We have sat here {{ x.days | plural(x.days,'day')}
       plural: function(val, singular) {
           let s = 's'
           if (val == 1) s = ''
           return val + ' ' + singular + s
       },
       subjectLookup: function(val) {
         return "s " + val // this.getZml.subjects.find(a => a.subjectid == val).shortname
       }
    },      
    mounted: function () {
        zmlConfig.cl('Mount:Edit-2-package');
        //If subjects is empty, load them , if folders empty, load them, and then loadData, else loadData
        console.log('MOUNT GDRV : ', this.getZml.login)
        if (this.getZml.login.type != 'student' && this.getZml.login.isAuthenticated) {
          if (this.getZml.subjects.length == 0) {
             let ts = {}
             ts.api = zmlConfig.apiDKHS
             ts.task = 'getlsubjects'
             zmlFetch(ts, this.loadSubjects);
          } else if (this.getZml.folders.length == 0) {
             zmlFetch({task: 'getfolders',api:zmlConfig.apiDKHS}, this.afterFolders);
          } else {
            this.loadData();
          }
        } else {
          infoSnackbar('You need to login to access this information '+
                        this.getZml.login.type +' '+this.getZml.login.isAuthenticated)
        }
    },
    watch: {
      subjectid() {
        //reset our folders if a new subject is selected
        if (this.folderObj) {
            this.folderObj.name = ''
        }
        this.files = []
        this.mainMenuItemselected = null
        this.loadFolders()
      },
      grade() {
        //reset our folders if a new grade is selected
        if (this.folderObj) {
            this.folderObj.name = ''
        }
        this.files = []
        this.mainMenuItemselected = null
        this.loadFolders()
      }      
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
</style>