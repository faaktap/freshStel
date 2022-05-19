<template>
  <!-- https://github.com/SortableJS/Sortable for draggable options this looks like the best. -->
  <v-container fluid>

   <v-card color="silver" class="ma-2 pa-2">
      <v-card width="100%">
        <base-bread
          v-if="curDir"
          divider="/"
          :item="curDir"
          :ignore-dir="ignoreDir"
          class="mb-1 pb-1"
          @changeFolder="changeBreadcrumbFolder"
        />
      </v-card>

      <v-toolbar
        dense
        row
        wrap
        :collapse="$vuetify.breakpoint.smAndDown"
        v-if="allowEdit">
        <v-app-bar-nav-icon
          v-if="$vuetify.breakpoint.smAndDown"
          @click.stop="drawer = !drawer"
        >
        </v-app-bar-nav-icon>
        <v-navigation-drawer
          v-model="drawer"
          absolute
          temporary
        >
        <v-dialog v-model="drawer">
        <v-card class="ma-2 pa-2">
        <v-btn @click="getFiles(ignoreDir)">
          Reset          </v-btn>
        <v-btn          @click="moveStart">
          Select
          <template v-if="moving.length > 0">            + {{ moving.length }}          </template>        </v-btn>
        <v-btn          @click="deleteStart"          class="ma-2">
           Delete        </v-btn>
        <v-btn          @click="createFolderStart"          class="ma-2">
          Create Folder        </v-btn>
        <v-btn            @click="renameStart"            class="ma-2">
         Rename Item        </v-btn>
        <v-checkbox v-model="showFoldersInFileList"  label="Show Folders"        />
        <v-btn            @click="uploadStart"       class="ma-2">
          Upload Files        </v-btn>
        </v-card>
        </v-dialog>
        </v-navigation-drawer>

<!-- Above is toolbar for small and mobile, below is toolbar for normal devices -->

        <base-tool-button
           class="mr-2"
           icon="mdi-lock-reset"
           @click="getFiles(ignoreDir)">
          Reset
          <template
            v-if="loading == true"
          >
          </template>
        </base-tool-button>
        <base-tool-button
          @click="moveStart"
          icon="mdi-select"
          >
          Select
          <template v-if="moving.length > 0">
            + {{ moving.length }}
          </template>
        </base-tool-button>
         <!-- :disabled="curFile.filename == '' || moving.length == 0" -->
        <base-tool-button
          @click="deleteStart"
          class="ma-2"
          icon="mdi-delete"
        >
           Delete
        </base-tool-button>
        <!-- :disabled="curDir != ''" -->
        <base-tool-button
          @click="createFolderStart"
          class="ma-2"
          icon="mdi-folder-plus"
        >
          Create Folder
        </base-tool-button>

        <!-- :disabled="curFile.filename != ''" -->
        <base-tool-button
            @click="renameStart"
            class="ma-2"
            icon="mdi-rename-box"
        >
         Rename Item
        </base-tool-button>

        <v-switch
          v-model="showFoldersInFileList"
          class="ml-2 pt-5"
          label="Folders"
        />

        <loading-ball :loading="loading">
          <span class="ml-2"> <v-icon> mdi-reload</v-icon> loading... </span>
        </loading-ball>
        <!-- <template v-if="loading == true">loading...</template> -->
        <v-spacer />

         <base-tool-button
            @click="uploadStart"
            class="ma-2"
            icon="mdi-cloud-upload">
          Upload Files
        </base-tool-button>


      </v-toolbar>
      <v-row  v-if="allowEdit">
        <v-col cols="12">
          <v-card color="silver" class="ma-0 pa-1 text-caption">
            <v-card v-if="operation" class="ma-2 pa-2" color="green lighten-1">
              Our current operation is <code>select</code> and we have {{ moving.length }} files selected .
              <template v-if="operation == 'move'">
                Click on all files you want to select for the {{ operation }} operation.<br>
              </template>
              <template v-if="operation == 'moveFolder'">
                Click on te folder you want to move these {{ moving.length }}  files to
              </template>
              <v-btn
                :disabled="!(moving.length !== 0 && operation === 'move')"
                small
                @click="moveWaitForFolder"
              >
                Click here to select a Folder to move {{ moving.length }} files to
              </v-btn>
              <v-btn
                :disabled="!(moving.length !== 0 && operation === 'moveFolder')"
                small
                @click="operation = 'move'"
              >
                Click here to cancel select a Folder operation
              </v-btn>
              <base-title-expand color="green lighten-1">
                <template #header>
                  <template
                    v-if="moving.length==0"
                  >
                    Click on file you want to move
                  </template>
                  <template
                    v-if="moving.length==1"
                  >
                    Select More Files
                  </template>
                  <template
                    v-if="moving.length>1"
                  > <v-card class="ma-0 pa-0 text-center">
                    Select even More Files - Click here to see/hide current file list
                    </v-card>
                  </template>
                </template>
                <!-- <h3>Files selected so far ... {{ moving.length }} </h3>
                <span v-for="(m,i) in moving" :key="m.filename">
                  {{ i }} {{ m.filename }},
                </span> -->

     <v-simple-table dense class="ma-0 pa-0" v-if="moving">
     <tbody class="text-caption">
     <th colspan="2">File</th><th>Extension</th>
     <tr v-for="(m,i) in moving"  :key="m.filename"
         color="blue lighten-4"
         class="text-caption">
     <td class="text-left ma-1 pa-1 text-caption"> {{i}} </td>
     <td class="text-left ma-0 pa-0 text-caption">
            {{ m.filename }}
     </td>
     <td> {{ m.ext }}   </td>
     </tr>
     </tbody>
    </v-simple-table>


              </base-title-expand>
            </v-card>
            <div v-else>
              <small class="text-caption"> no operation active </small>
            </div>
          </v-card>
        </v-col>
      </v-row>

      <v-row row wrap>
        <v-col cols="12" sm="6" md="4">
            <v-card
              class="ma-2 pa-2 overflow-y-auto"
            >
              <v-card-actions class="ma-0 pa-0">
                <base-tool-button
                  title="go Back one folder"
                  @click="back"
                  icon="mdi-backspace"
                >
                  back
                </base-tool-button>
                <v-spacer />
                <v-btn v-if="$vuetify.breakpoint.smAndDown || showMobile"
                       @click="showMobile = true"
                       small
                       >
                       folders
                  <v-icon right color="yellow"> mdi-folder </v-icon>
                </v-btn>
              </v-card-actions>
              <v-card-text>
<!-- Show folders, either in a dialog for small, or standard display --->
              <v-dialog v-model="showMobile">
               <folders
                :directory-display-records="directoryDisplayRecords"
                :folder-load-url="folderLoadUrl"
                :current-path="curDir"
                :accessTree="usertype"
                @folder="loadFolder"
                @moreFolder="checkPathBeforeLoadFolder"
                @folderSelected="folderSelected = $event"
               />
              </v-dialog>
               <folders
                class="hidden-sm-and-down"
                :directory-display-records="directoryDisplayRecords"
                :folder-load-url="folderLoadUrl"
                :current-path="curDir"
                @folder="loadFolder"
                @moreFolder="checkPathBeforeLoadFolder"
                @folderSelected="folderSelected = $event"
               />
             </v-card-text>
            </v-card>
        </v-col>

<!-- Show the files --->
        <v-col cols="12" sm="6" md="8">
          <!-- FILES DISPLAY -->
        <drop-zone @activateDrop="activateDrop" description="OK, I've got it - let go of the mousebutton..">
          <v-card class="ma-2 pa-2">
            <files
              :file-display-records="fileDisplayRecords"
              :selected-records="moveList"
              :cur-dir="curDir"
              :ignore-dir="ignoreDir"
              :show-folders="showFoldersInFileList"
              :moving="moving"
              :loading="loading"
              @clickRow="clickFile"
              @clickDblRow="clickDblFile"
              @clickIcon="clickFileIcon"
            />
          </v-card>
        </drop-zone>
        </v-col>
      </v-row>
    </v-card>

<!---------------- SHOW CREATE FOLDER --------------------------------------->
    <v-dialog
      v-model="showCreateFolder"
      width="auto"
      max-width="600"
      :scrollable="false"
      :fullscreen="$vuetify.breakpoint.smAndDown"
    >
    <v-card>
     <v-card-text>
      Create a new folder in : {{ curDir }}
      <v-text-field v-model="newFolderName" label="Folder Name" class="ma-4" />
     </v-card-text>
     <v-card-actions>
      <v-btn small @click="showCreateFolder=false"> Cancel </v-btn>
      <v-spacer />
      <v-btn small color="primary" @click="createFolder"> Create </v-btn>
     </v-card-actions>
     </v-card>
    </v-dialog>


<!---------------- SHOW RENAME ITEM --------------------------------------->
    <v-dialog
      v-model="showRenameItem"
      width="auto"
      max-width="600"
      :scrollable="false"
      :fullscreen="$vuetify.breakpoint.smAndDown"
    >
     <v-card>
      <v-card-text>
       Rename  : {{ curFile.filename }}
       <v-text-field v-model="newRenameItem" label="Item Name" class="ma-4" />
      </v-card-text>
      <v-card-actions>
       <v-btn small @click="showRenameItem=false"> Cancel </v-btn>
       <v-spacer />
       <v-btn small color="primary" @click="renameItemDone"> rename </v-btn>
      </v-card-actions>
     </v-card>
    </v-dialog>

<!---------------- SHOW DELETE ITEM --------------------------------------->
    <v-dialog
      v-model="showDeleteItem"
      width="auto"
      :scrollable="false"
      max-width="600"
      :fullscreen="$vuetify.breakpoint.smAndDown"
    >
     <v-card  color="warning">
      <v-card-title> You are about to delete... </v-card-title>
      <v-card-text  v-if="this.moving.length == 0" class="ma-2 pa-4">
       <v-card class="ma-2 pa-2">
        Delete  : {{ curFile.filename }}
       </v-card>
     </v-card-text>
     <v-card-text  v-if="this.moving.length != 0"  class="ma-2 pa-4">
        {{ this.moving.filename }} <br>
     </v-card-text>
     <v-card-actions>
      <v-btn small
             @click="showDeleteItem=false">
        CANCEL
      </v-btn>
      <v-spacer />
      <v-btn small
             color="primary"
             @click="deleteItemsDone">
         DELETE
      </v-btn>
      </v-card-actions>
     </v-card>
    </v-dialog>

<!---------------- FILE UPLOAD --------------------------------------->
    <v-dialog
      v-model="showUpload"
      :scrollable="false"
      :fullscreen="$vuetify.breakpoint.smAndDown"
    >
      <file-upload
        @filesUploaded="reportBack"
        @uploadFinished="closeAndRefresh"
        :uploadPath="curDir" />
    </v-dialog>

<!---------------- SHOW FILE --------------------------------------->
    <v-dialog v-model="showAttachment"
                  :fullscreen="$vuetify.breakpoint.lgAndDown"
                  height="90%"
                  :scrollable="false"
                  width="unset">
      <show-attachment-dialog :image="attachment.src"
                              :imagetype="attachment.srctype"
                              @close="showAttachment = !showAttachment"
      />
   </v-dialog>
    <!-- Add some space at the bottom, so that page does not jump around on new file load-->
    <br><br><br><br><br>
  </v-container>
</template>

<script>
import { feh } from './FolderEdit.js'
import { zmlFetch } from '@/api/zmlFetch'
import { zmlFile } from '@/api/zmlFile'

import { getters } from "@/api/store";
const usertype = getters.getState({ object: "gZml" }).login.type;

import BaseBread from '@/views/new/base/BaseBread.vue'
import BaseToolButton from '@/views/new/base/BaseToolButton.vue'
import BaseTitleExpand from '@//views/new/base/BaseTitleExpand.vue'
import Files from '@/views/new/folder/Files.vue'
import Folders from '@/views/new/folder/Folders.vue'
import FileUpload from '@/views/new/folder/FileUpload'

import LoadingBall from '@//views/new/comp/LoadingBall.vue'
import { infoSnackbar } from '@/api/GlobalActions'
import { zmlLog } from '@/api/zmlLog.js';
import ShowAttachmentDialog from '@/components/ShowAttachmentDialog.vue'

import DropZone from '@/components/DropZone.vue'

export default {
  name: 'FolderEdit',
  components: {
    BaseBread,
    BaseToolButton,
    BaseTitleExpand,
    Files,
    Folders,
    FileUpload,
    LoadingBall,
    ShowAttachmentDialog,
    DropZone
  },
  data: () => ({
    usertype:usertype,
    getZml: getters.getState({ object:"gZml" }),
    fileDisplayRecords: [],
    directoryDisplayRecords: [],
    curDir: '/home/kuilieso/public_html/Subjects/',
    curFile: {},
    domain: 'kuiliesonline',
    fileLoadUrl: 'https://kuiliesonline.co.za/api/file/file.php',
    actionLoadUrl: 'https://kuiliesonline.co.za/api/file/actions.php',
    folderLoadUrl: 'https://kuiliesonline.co.za/api/file/fileDir.php',
    ignoreDir: '/home/kuilieso/public_html/Subjects/',
    folderItems: [],
    folderSelected: null,
    moveList: [],
    operation: '',
    moving: [],
    showFoldersInFileList: false,
    loading: false,
    showMobile: false,
    showCreateFolder: false,
    newFolderName:'',
    newRenameItem:'',
    showRenameItem:false,
    showDeleteItem:false,
    showUpload:false,
    showAttachment: false,
    attachment:{src:'', srctype:''},
    allowEdit: false,
    drawer: false
  }),
  methods: {
    activateDrop() {
      this.showUpload = true
    },
    uploadStart() {
      this.showUpload = true
    },
    reportBack(e1) {
      this.$cs.l('Report Back...........',e1)
      zmlLog(this.getZml.login.username , "UploadContent", this.curDir + ':' + JSON.stringify(e1).substr(0,250))
    },
    closeAndRefresh() {
      this.showUpload = false
      this.getFiles(this.curDir)
    },
    renameStart() {
      if (this.curFile.filename) {
      this.showRenameItem = true
      this.newRenameItem = this.curFile.filename
      } else {
        infoSnackbar('no file/folder selected')
      }
    },
    renameItemDone() {
      let ts = {}
      ts.api = this.actionLoadUrl
      ts.task = 'renameFile'
      ts.data = {}
      ts.data.newName = this.curFile.dirpath + '/' + this.newRenameItem
      ts.data.oldName = this.curFile.dirpath + '/' + this.curFile.filename
      this.snack('renaming to ' + ts.data.newName)
      this.loading = true
      zmlFetch(ts, this.doneAction, this.errorLoading)
      // cleanup
      this.newRenameItem = ''
    },
    deleteStart() {
      if (this.curFile.filename || this.moving.length > 0) {
         this.showDeleteItem = true
      } else {
        infoSnackbar('no files or folders selected')
      }
    },
    deleteItemsDone() {
        //delete the current file
        let ts = {}
        ts.api = this.actionLoadUrl
        ts.task = 'delete'
        ts.data = {}
        ts.data.fileList = []
        if (this.moving.length == 0) {
           ts.data.fileList.push(this.curFile)
        } else {
           ts.data.fileList = this.moving
        }
        this.snack('deleting..')
        this.loading = true
        zmlFetch(ts, this.doneAction, this.errorLoading)

    },
    // move operations start here
    moveStart () {
      if (this.operation === 'move' || this.operation === 'moveFolder') {
        this.operation = ''
        this.showFoldersInFileList = false
      } else {
        this.operation = 'move'
        this.showFoldersInFileList = true
      }
      this.moving = []
    },
    moveWaitForFolder () {
      this.operation = 'moveFolder'
    },
    checkOperation (newFolder) {
      // if we end up here, see if our operation is expecting a folder click.
      // if it is, use it, and return true else return false
      // this.$cs.l('Check if we need this folder for an operation ending', newFolder, this.operation)
      // confirm('do somethinh?')
      if (this.operation === 'moveFolder') {
        this.doTheMoveAtLast(newFolder, this.moving)
        this.operation = ''
        return true
      }
      return false
    },
    doTheMoveAtLast (newFolder, moveList) {
      // alert(`we will be moving ${moveList.map(i => i.filename)} to ${newFolder}`)
      let ts = {}
      ts.api = this.actionLoadUrl
      ts.task = 'moveGroup'
      ts.data = {}
      ts.data.newPath = newFolder
      ts.data.fileList = moveList
      this.snack('moving to' + ts.data.newFolder)
      this.loading = true
      zmlFetch(ts, this.doneAction, this.errorLoading)
      // cleanup
      moveList = []
    },
    // move operation end here

    // create folder operation start here
    createFolderStart () {
      this.showCreateFolder = true
    },
    createFolder () {
      // alert('do the action creation!')
      const ts = {}
      ts.api = this.actionLoadUrl
      ts.task = 'create'
      ts.data = {}
      ts.data.newPath = this.newFolderName
      ts.data.curDir = this.curDir
      this.snack('creating ' + ts.data.newPpath)
      this.loading = true
      zmlFetch(ts, this.doneAction, this.errorLoading)
    },
    // create folder operation end here
    doneAction (result) {
      if (result.errorcode && result.errorcode == true) {
        this.snack('Action completed')
      } else {
        this.snack('Action not completed : ' +  result.error)
      }
      this.loading = false
      this.showRenameItem = false
      this.showCreateFolder = false
      this.showDeleteItem = false
      this.moving = []
      this.operation = ''
      this.getFiles(this.curDir)
    },
    clickDblFile (fileObj) {
      // Here we can assign an event like rename - so we have it automatic,
      // Or we have some sort of small menu popup?
      this.clickFileIcon (fileObj)
    },
    clickFile (fileObj) {
      //this.$cs.l('cccccclickFile : received an emit for rowclick on ', fileObj.filename , fileObj.dirpath)
      // Check here to see if we want are selecting a folder for moving
      if (fileObj.dir === true) {
        // he clicked a folder
        if (this.checkOperation(fileObj.dirpath + '/' + fileObj.filename)) {
          return
        }
      }

      // OK, we are working with a file (or folder), possibly display it, download it, or select it.
      this.curFile = {}
      const idx = this.fileDisplayRecords.findIndex(e => e.filename === fileObj.filename)
      if (idx !== -1) {
        this.curFile = this.fileDisplayRecords[idx]
      } else {
        alert('we could not find that file.' + fileObj.filename)
      }

      if (this.operation) {
        this.snack('operation = ' + this.operation + this.curFile.filename)
        const idx = this.moving.findIndex(e => e.filename === fileObj.filename)
        if (idx > -1) {
          // hy is klaar daar, vee hom uit
          this.moving.splice(idx, 1)
        } else {
          // this.$cs.l('added : ' , this.curFile)
          this.moving.push({dirpath: this.curFile.dirpath
                           ,filename: this.curFile.filename
                           ,ext: this.curFile.ext
                           ,dir: this.curFile.dir
                          })
        }
      }
    },
    clickFileIcon (fileObj) {
      // this.$cs.l(this.$options.name, 'received an emit for iconclick on ', fileObj)
      // this.snack('we should view the file here')
      if (fileObj.dir == true) {
        this.getFiles(fileObj.dirpath + '/' + fileObj.filename)
        return
      }
      this.prepareAttachment(fileObj)
    },
    prepareAttachment(fileObj) {
      if (fileObj.ext == 'link') {
        this.$cs.l('We need to read (getfilecontents):' + fileObj.dirpath + '/' + fileObj.filename)
        this.getFileFromServer(fileObj.dirpath + '/' + fileObj.filename)
      } else {
        this.attachment.src = fileObj.dirpath + '/' + fileObj.filename
        this.attachment.srctype =  fileObj.ext
        this.showAttachment = true
      }

      this.$cs.l('show Attach:', this.attachment.src, this.attachment.srctype)
    },
    getFileFromServer(serverfilename) {
      this.$cs.l('asking for : ' , serverfilename)
      let ts = {}
      ts.data = {path:serverfilename}
      zmlFile(ts, this.gotFile)
    },
    gotFile(response) {
      this.$cs.l(response)
      alert('we gt file!')
      //
      //Put this one in as a test..
      //this.attachment.src = 'https://docs.google.com/spreadsheets/d/1d3HciexwZQndqHULEILwk_g4F1RRwUMlQjVVPc80BsI/edit?usp=sharing'
      this.attachment.src = response.link
      this.attachment.srctype =  'mp4'
      this.showAttachment = true
    },
    back () {
      let backFolder = this.ignoreDir
      // stop them from going futher back than Subjects.
      if (this.curDir) {
        backFolder = this.curDir.slice(0, this.curDir.lastIndexOf('/'))
        backFolder = backFolder.slice(0, backFolder.lastIndexOf('/'))
      }
      if (backFolder.length < this.ignoreDir.length) backFolder = this.ignoreDir
      // this.$cs.l(backFolder, this.ignoreDir)
      this.getFiles(backFolder)
    },
    changeBreadcrumbFolder (foldername) {
      // This is a quick way of changing folders (click on a breadcrumb)
      // We need to remove the end slash before calling breadcrumbs.
      this.getFiles(foldername)
    },
    checkPathBeforeLoadFolder (longFolderName) {
      // this.$cs.l('checkPathBeforeLoadFolder', longFolderName)
      const newFolder = this.ignoreDir + longFolderName
      this.getFiles(newFolder)
    },
    loadFolder (shortfoldername) {
      // this.$cs.l('loadFolder', shortfoldername)
      const newFolder = this.curDir + '/' + shortfoldername
      // Check here to see if we want are selecting a folder for moving
      if (this.checkOperation(newFolder)) {
        return
      }
      this.getFiles(newFolder)
    },
    getFiles (foldername) {
      // this.$cs.l(this.$options.name, 'getFiles', foldername)
      const ts = {}
      ts.api = this.fileLoadUrl
      ts.task = 'whatever' // not needed
      ts.data = {}
      ts.data.path = foldername
      this.loading = true
      zmlFetch(ts, this.doneLoadingFiles, this.errorLoading)
    },
    errorLoading (result) {
      this.snack(`We had an error load the data:RealError:\n${result}`)
      this.loading = false
    },
    doneLoadingFiles (result) {
      // this.$cs.l('doneloading:1', result.error, result)
      if (result.error) {
        // this.$cs.l('doneloading:1')
        this.snack('Error on load:', result.error)
        // we might need to return here, if we add stuff at bottom
      } else if (!result) {
        // this.$cs.l('doneloading:2')
        this.snack('we found no files')
      } else {
        [this.fileDisplayRecords, this.directoryDisplayRecords] = feh.processReadDirectoryResult(result)
        // this.$cs.l(result.length, this.fileDisplayRecords.length, this.directoryDisplayRecords.length)
        this.curDir = feh.fixSlash(result[0].dirpath)
        this.loading = false
        // this.$cs.l('doneLoading 4 : New curDir::::', this.curDir)
      }
    },
    getExtensionInfo (fileExt) {
      return feh.getExtensionInfo(fileExt)
    },
    snack (txt) {
      //this.$notifier.showMessage({content: txt, color: 'info' })
      infoSnackbar(txt)
    },
    checkForANewRoute() {
      if (this.$route.params.grade) {
        if (this.$route.params.grade.toUpperCase() == 'ALL') {
          this.getFiles(this.curDir)
        } else {
          if ( ["GR08","GR09","GR10","GR11","GR12","GRINFO","MUSIC_MUSIEK"].includes(this.$route.params.grade.toUpperCase()) ) {
            this.curDir += '/' + this.$route.params.grade.toUpperCase()
          } else {
            if (this.$route.params.grade) {
              this.curDir  += '/' + this.$route.params.grade.toUpperCase()
            }
          }
          if (this.$route.params.subject) {
            this.curDir  += '/' + this.$route.params.subject
          }
          if (this.$route.params.level1) {
            this.curDir  += '/' + this.$route.params.level1
          }
          if (this.$route.params.level2) {
            this.curDir  += '/' + this.$route.params.level2
          }
          this.getFiles(this.curDir)
        }
      } else {
        this.getFiles(this.curDir)
      }
    }

  },
  mounted () {
    this.checkForANewRoute()
    this.allowEdit = ['teacher','admin'].includes(this.getZml.login.type)
    // this.$cs.l('access:', this.getZml.login.type)
  },

}
</script>
