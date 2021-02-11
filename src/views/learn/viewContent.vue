<template>
<div>
 <v-card>
  <div class="text-center">
   <v-progress-linear stream
                       color="blue-grey"
                      :active="progress" 
                      :indeterminate="progress" 
                      ></v-progress-linear>
   </div>
     <v-card-title color="primary">

       <v-row><v-col cols=4>
      DKHS CONTENT EDITING (teachers)
      </v-col>
      <v-col cols=4>
      <v-text-field v-model="search" label="Search"></v-text-field>
      </v-col>
      <v-col cols=4 align="right">
      <v-btn @click="loadData" > Refresh </v-btn>
      </v-col>
      </v-row>

    </v-card-title>
  <v-data-table 
    :headers="headers"
    :items="content"
    :items-per-page="7"
    :search="search"
    class="elevation-1">

    <template v-slot:[`pageText`]="props">
      ITEMS {{ props.pageStart }} - {{ props.pageStop }} OF {{ props.itemsLength }} // Edit this
      // ^this is what you need
    </template>

    <template v-slot:footer>
      <v-card class="ma-4"> 
          <v-card-text class="green lighten-4">
              Kliek op die klein ronde dingetjie om data te verander en die 
              snaakse + teken onder regs om iets by te voeg.
          </v-card-text>
      </v-card>
    </template>
    <template v-slot:[`footer.page-text`]>
       <v-btn icon @click="allocate()"> 
           <v-icon >mdi-table-plus</v-icon>
        </v-btn>

    </template>
    <template v-slot:[`item.description`]="{ item }">
        <div v-if="item.description.length > 40">    {{ item.description.substring(0,40) }} ... </div>
        <div v-else>{{ item.description }}</div>
      </template>
    <template v-slot:[`item.subjectid`]="{ item }">
        {{ getZml.subjects[ getZml.subjects.findIndex(ele => ele.subjectid == item.subjectid) ].subjectname }}
      </template>
    <template v-slot:[`item.sortorder`]="{ item }">
        {{ item.sortorder}}
       <v-btn icon @click="editCard( item.contentid )"> 
           <v-icon small>mdi-database-edit</v-icon>
        </v-btn>
       <v-btn x-small icon @click="increaseOrder( item.contentid )"> 
           <v-icon x-small>mdi-plus</v-icon>
        </v-btn>        
       <v-btn x-small icon @click="lowerOrder( item.contentid )"> 
           <v-icon x-small>mdi-minus</v-icon>
        </v-btn>                        
       <v-btn icon @click="deleteCard( item.contentid )"> 
           <v-icon x-small>mdi-delete</v-icon>
        </v-btn>
      </template>
  </v-data-table>
 </v-card>


 <!-- DIALOG WINDOWS --------------------->
 <v-dialog v-model="editDialog">
  <v-card>
    <v-card-title>
      <span class="headline">Edit CONTENT</span>
    </v-card-title>
    <v-card-text>
     <v-container grid-list-md>
      <v-layout wrap>
       <v-flex xs12 sm6 md12>
         <v-text-field v-model="edit.name" label="Name"></v-text-field>
       </v-flex>
       <v-flex xs12 sm6 md3>
           <v-select
             v-model="edit.grade"
             :items="['8','9','10','11','12']"
             label="Grade"
             :hint="`Grade ${edit.grade}`"
           />                      
       </v-flex>
       <v-flex xs12 sm6 md4>
          <v-autocomplete
            v-model="edit.subjectid"
            ref="mySelect" 
            :search-input.sync="searchInput"
            :hint="`id=${edit.subjectid}`"
            :items="getZml.subjects"
            item-text="subjectafrname"
            item-value="subjectid"
            label="Subject"
          />
        </v-flex>       <v-flex xs12 sm6 md3>
          <v-select
            v-model="edit.accesstype"
            :items="['student','pers','hidden']"
            item-text="text"
            item-value="id"
            label="Access"
          />
       </v-flex>
       <v-flex xs12 sm6 md3>
          <v-select
            v-model="edit.type"
            :items="['file','text','link','folder']"
            label="Type"
            :disabled="editMode == 'update' && edit.type.length > 0"
          />            
       </v-flex>
       <v-flex xs12 sm6 md3>
          <v-text-field
            v-model="edit.sortorder"
            label="Sortorder"
          />            
       </v-flex>

<!-- SELECT A FOLDER  -->    <!--v-if="!['link','text','folder'].includes(edit.type)"-->
<!-- will only see this if we have a grade and subject -->
       <v-flex xs12 sm6 md4>
        <v-row>
          <v-col cols=10>
           <auto-sel-obj 
             asLabel="Select your Folder" 
            :initialValue="getZml.folders.findIndex(ele => ele.folder == edit.folder)" 
            :itemObj="folderFilter"
             v-model="folderObj" >
           </auto-sel-obj> 
          </v-col>
          <v-col cols=2 class="layout justify-center" v-if="edit.grade && edit.subjectid">
            g={{ edit.grade }} s={{ edit.subjectid}}
           <v-btn @click="showAddFolder = !showAddFolder" 
                   title="Add Folder" 
                   class="mt-0">
                   <!--v-if="folderFilter.length > 0" wil not work when we have no folders yet..-->
             <v-icon>mdi-plus</v-icon> 
           </v-btn>
          </v-col>
         </v-row>
       </v-flex>
       <!-- show indexof/filter/search on array v-if="!['link','text'].includes(edit.type) && showAddFolder -->
<!-- ADD A NEW FOLDER IN DIALOG -->       
       <v-flex xs12 sm6 md4 
               v-if="!['link','text'].includes(edit.type) && showAddFolder" 
               @blur="showAddFolder = false">
         <v-card 
            color="blue darken-1" class="ma-2">
           <v-card-text>
             <v-text-field 
                label="new folder name" 
                v-model="newFolder"/> 
           </v-card-text>
         <v-card-actions>
           <v-btn text small 
                  @click="saveNewFolder" :loading="loadingAddFolder">
              save </v-btn> 
           <v-btn text small 
                  @click="showAddFolder = !showAddFolder" :loading="loadingAddFolder">
              cancel </v-btn> 
         </v-card-actions>
         </v-card>
       </v-flex>

<!-- EDIT DESCRIPTION -->
        <v-flex xs12 sm12 md12 v-if="edit.type != 'file'">
          <v-textarea v-model="edit.description" 
                      label="Description"
                      rows="2"
                      auto-grow
                       />
        </v-flex>

<!-- DRAg AND DROP A FILE -->
        <v-flex xs12 sm12 md12 v-else>
          <div style="width: 450px; height: 100px;border: 2px dotted gray" 
               v-cloak 
               @drop.prevent="addFile" 
               @dragover.prevent
               :title="edit.description">
           drop your file here.
           <li v-for="(file,id) in files" :key="id" class="list-group-item mb-3 border-top">
           {{ file.name }} ({{ file.size }} kb)
           </li>
           <v-btn v-if="files.length>0" :loading="loadStatus" @click="files=[]"> Remove </v-btn>
           <v-btn v-if="files.length>0" :loading="loadStatus" @click="upload(upload1,edit)"> upload </v-btn>
           </div>
        </v-flex>

       </v-layout>
      </v-container>
    </v-card-text>
          <v-card-actions>
      <v-spacer />
      <v-btn @click="editDialog=false" :loading="loadStatus" color="blue darken-1" text>Cancel</v-btn>
      <v-btn @click="saveData()" color="blue darken-1" :disabled="loadStatus" >Save</v-btn>
      </v-card-actions>
  </v-card>
 </v-dialog>
</div>
</template>
<script>
import { zmlConfig } from '@/api/constants.js';
import { zmlFetch } from '@/api/zmlFetch.js';
import { getters } from "@/api/store";
import { errorSnackbar, infoSnackbar } from '@/api/GlobalActions';
import AutoSelObj from '@/components/AutoSelObj.vue'
// eslint-disable-next-line
//import router from '@/router';
//import { zmlLog } from '@/api/zmlLog.js';
  export default {
    name: "viewContent",
    components: {AutoSelObj},
    data: () => ({
        getZml: getters.getState({ object: "gZml" }),
        editDialog:false,
        showAddFolder: false,
        loadingAddFolder: false,
        newFolder:'',
        folderObj:{},
        edit: {},
        editMode: null,
        progress:false,
        loadStatus:false,
        search: '',
        searchInput: '',
        accesstypeitems: [{id:1,text:"student"},{id:2,text:"pers"},{id:3,text:"hidden"}],
        headers: [
          //{ text: 'Id', value: 'contentid' },
          { text: 'Name', value: 'name' },
          { text: 'Type', value: 'type' },
          { text: 'Grade', value: 'grade' },
          { text: 'Subject', value: 'subjectid' },
          { text: 'Folder', value: 'folder' },
          { text: 'Description', value: 'description' },          
          { text: 'Order',  align: 'start',  value: 'sortorder' },          
          // { text: 'AccessType', value: 'accesstype' },
          // { text: 'Icon', value: 'icon' },
          // { text: 'Persid', value: 'persid' },          
        ],
        content: [],
        files: [],
    }),
    computed:{
      //Display a list of folders on dropdown
      folderFilter() {
        let tempT = []
        let ignore = false
        this.getZml.folders.forEach(item => {
          ignore = false;
          if (item.grade != this.edit.grade) ignore = true;
          if (item.subjectid != this.edit.subjectid) ignore = true;
          if (!ignore) tempT.push( { id: item.folderid, name: item.foldername});
        })
        return tempT

           //return this.getZml.folders.filter(obj => {return obj.subjectid == this.edit.subjectid}).map(obj => obj.id);
      }
    },
    methods: {
//adding a new folder
      saveNewFolder() {
        if (this.newFolder == '') return
        if (this.edit.grade == '') { errorSnackbar('We need a grade'); return;}
        if (this.edit.subjectid == '') { errorSnackbar('We need a subject'); return;}
        this.loadingAddFolder = true
        let obj = {foldername: this.newFolder
                  ,realfoldername: this.newFolder
                  ,grade: this.edit.grade
                  ,subjectid: this.edit.subjectid
                  ,sortorder: 1
                  ,icon: 'mdi-folder'
        }
        zmlFetch({task: 'addfolders', data: obj ,api: zmlConfig.apiDKHS}, this.afterAddFolder, this.errorAddFolder);
      },
      afterAddFolder(response){
        infoSnackbar('On Succecssfull Add Folder Info: ' + JSON.stringify(response.name))
        zmlFetch({task: 'getfolders',api: zmlConfig.apiDKHS}, this.updateFoldersAfterAdd);
        this.showAddFolder = false;
        this.loadingAddFolder = false
      },
      updateFoldersAfterAdd(response){
        this.getZml.folders = response
      },
      errorAddFolder(response){
          console.log('AddFolderError:',response);
          errorSnackbar('On Add Folder Error: ' + response)
      },
      

//Upload a file - and then save the data      
      upload(nextProc,curItem) {
         console.log('file0 = ' , this.files[0])
         this.loadStatus = true;
         let fr = new FileReader()
         fr.onload = function(response) {
          nextProc(response,curItem)
         };
         fr.onerror = function(response) {
           console.log('res' ,response);
         };
         fr.readAsDataURL(this.files[0]);
      },
      upload1(fileData,curItem) {
         fileData.task = 'upload'; 
          let GR = this.edit.grade.toString()
          GR = 'GR' + GR.padStart(2, '0')
          const idx = this.getZml.subjects.findIndex(ele => ele.subjectid == this.edit.subjectid)
          const subjectpath = this.getZml.subjects[idx].subjectdesc
         fileData.extrapath =  "/Subjects/" + GR + "/" + subjectpath + "/" + this.edit.folder
         fileData.name = curItem.name
         fileData.realname = this.files[0].name
         fileData.drag = this.files[0]
         fileData.prebase64 = fileData.target.result.split(',')[0];
         fileData.base64 = fileData.target.result.split(',')[1];
         fileData.size = fileData.total
         fileData.api = zmlConfig.apiUpload; 
         console.log('start upload with ', fileData);
         zmlFetch(fileData,this.doneWithUpload, this.errorWithUpload)
      },    
      doneWithUpload(response) {
         infoSnackbar('Done with upload ' + JSON.stringify(response) )
         this.loadStatus = false;
         this.edit.description = 'load:' + response.fileName;
         this.edit.name = response.filename;
         this.saveData();
      },
      errorWithUpload(response) {
         errorSnackbar('Error with upload ' + JSON.stringify(response) )
         this.loadStatus = false;
         this.edit.description = '';
      },
      addFile(e) {
        console.log(e)
        let lfiles = e.dataTransfer.files;
        if (lfiles[0].size > 11100100)  {
          errorSnackbar('this file is too big - put on memory stick and leave at reception for Werner')
          return
        }
        if (this.edit.description.substr(0,4) == 'load'){
           this.$root.$confirm("Delete previous file?", "If you press YES,the old file will be <b>unlinked (gone)</b>", { color: 'red' })
              .then((confirm) => {
                if (confirm) { 
                  console.log('old file will be overwritten')
                } else {
                  this.files = []
                  return
                }
            })
        }
        [...lfiles].forEach(file => {
            this.files.push(file);
            console.log(this.files)
        });
        if (this.files.length > 1) {
          infoSnackbar ('we only want one file! - try again...')
          this.files = []
        }
        //let droppedFiles = e.dataTransfer.files;
        //if(!droppedFiles) return;
        //// this tip, convert FileList to array, credit: https://www.smashingmagazine.com/2018/01/drag-drop-file-uploader-vanilla-js/
        //([...droppedFiles]).forEach(f => { this.files.push(f); });
      
      },

// standard editing of lcontent      
      allocate() { 
            this.edit = {name: ''
                       , description:''
                       , type:''
                       , folder:''
                       , accesstype: 'student'
                       , grade: ''
                       , subjectid:''
                       , persid: ''
                       , icon: 'mdi-text'
                       , sortorder: 1};
            this.editDialog = true;
            this.editMode = 'add';
        },
        editCard(id) {
            let idx = this.content.findIndex(ele => ele.contentid == id);
            if (idx == -1) {
                alert(id + ' not found');
                return;
            }
            //router.push({name:'viewlearn' ,params:{id:id, EditOrInsert:'Edit'}});
            this.edit = this.content[idx];
            zmlConfig.cl('edit',idx, this.edit);
            this.editDialog = true;
            this.folderObj = {name:this.edit.folder}
            this.editMode = 'update';
        },
        deleteCard(id) {
            let idx = this.content.findIndex(ele => ele.contentid == id);
            if (idx == -1) {
                alert(id + ' not found');
                return;
            }
            this.delete = this.content[idx];
            infoSnackbar('to delete change sortorder to 0, and not display it.')
            let ts = {};
            ts.task = 'PlainSql';                  
            ts.sql = 'update dkhs_lcontent set sortorder = 0 where contentid = ' + id;
            ts.api = zmlConfig.apiDKHS
            this.progress = true;
            zmlFetch(ts, this.afterUpdate);   

        },
        lowerOrder(id) {
           if (id < 2) {
               infoSnackbar('Order is low enough');
               return;
           }
           let ts = {};
           ts.task = 'PlainSql';                  
           ts.sql = 'update dkhs_lcontent set sortorder = sortorder-1 where contentid = ' + id;
           ts.api = zmlConfig.apiDKHS
           this.progress = true;
           zmlFetch(ts, this.afterUpdate);   
        },
        increaseOrder(id) {
           let ts = {};
           ts.task = 'PlainSql';                  
           ts.sql = 'update dkhs_lcontent set sortorder = sortorder+1 where contentid = ' + id;
           ts.api = zmlConfig.apiDKHS
           this.progress = true;
           zmlFetch(ts, this.afterUpdate);   
        },
        saveData() {
           switch (this.edit.type) {
           case 'file':   this.edit.icon = 'mdi-file'; break
           case 'folder': this.edit.icon = 'mdi-folder'; break
           case 'text':   this.edit.icon = 'mdi-text'; break
           case 'link':   this.edit.icon = 'mdi-link'; break
           }
           if (!this.edit.accesstype) {
             this.edit.accesstype = 'student'
           }
           if (this.folderObj.name) {
             //we get an object back from our select.....must still fix
             this.edit.folder = this.folderObj.name
           }
           console.log('333333',this.edit.folder,this.folderObj)
           if (this.edit.type == 'file' && !this.edit.folder ) {
               infoSnackbar('Please select a folder')
               return
           }
           if (this.edit.name == '') { this.edit.name = this.edit.file  }
           if (this.edit.name == '') { this.edit.name = this.edit.folder  }
           if (this.edit.name == ''){
               infoSnackbar('Please enter a name!')
               return             
           }
           let ts = {};
           ts.data = this.edit;
           ts.mode = this.editMode;
           ts.api = zmlConfig.apiDKHS
           if (this.editMode == 'add')  {
              ts.task = 'insertLContent';
           } else {
              ts.task = 'updateLContent';
           }
           this.progress = true;
           zmlFetch(ts, this.afterUpdate);   
        },
        afterUpdate(response) {
            zmlConfig.cl('AfterUpdate:',response);
            this.editDialog = false;
            this.loadData();
            //zmlLog({task:"dolog",user:"None", pagename:"EditPackage", logdata: this.edit});
        },


// Here we handle all the loading of lcontent, subjects and folders.
        showData(response) {
            zmlConfig.cl('content=' , response);
            this.progress = false;
            if (response == '') {
              alert('no data received');
            } else {
              this.content = response;
            }
        },
        loadFolders() {
          zmlFetch({task: 'getfolders',api: zmlConfig.apiDKHS}, this.afterFolders);
        },
        loadSubjects(response) {
            this.getZml.subjects = response;
            if (this.getZml.folders.length == 0) {
               this.getZml.folders.push({id:1, name:'default'})
               this.loadFolders()
            } else {
               this.loadData();
            }
        },
        afterFolders(response) {
          this.getZml.folders = response;
          this.loadData();
        },
        loadData() {
           let ts = {};
           ts.sql = 'select * from dkhs_lcontent order by sortorder, name';
           ts.task = 'PlainSql';
           ts.api = zmlConfig.apiDKHS
           zmlConfig.cl(ts);
           zmlFetch(ts, this.showData);
        },

    },
    mounted: function () {
        zmlConfig.cl('Mount:Edit-2-package');
        //If subjects is empty, load them , if folders empty, load them, and then loadData, else loadData
        if (this.getZml.subjects.length == 0) {
           zmlFetch({task: 'getsubjects'}, this.loadSubjects);
        } else if (this.getZml.folders.length == 0) {
           zmlFetch({task: 'getfolders',api:zmlConfig.apiDKHS}, this.afterFolders);
        } else {
          this.loadData();
        }
    },
    watch: {
    }
  }
</script>