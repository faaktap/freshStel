<template>
<div>
 <v-progress-linear :active="progress" :indeterminate="progress" color="grey lighten-1" />
<!--
  <pre>
    1. getFolder - php - getLContentByFolderNo (benonog 'n folderid)
    2. prevFolder - php getLContentPrevFolder (benodig 'n folderid)

    3.as folderid zero is, gebruik graad en subjectid
    4. onthou "name" is onderwysers sin, en description is program sin.
    5. As jy folder rename - NET name!! (description bly so!)
  </pre>
-->

<v-dialog v-model="showAddFolder" width="auto">
    <edit-item-partitions contentid="0"
                          mode="name"
                          @close="showAddFolder = false"
    />
</v-dialog>    

<!-- SHOW THE GRADE AND SUBJECT SELECTION -->
<v-container fluid>
 <v-row>
  <v-col cols="12" sm="6">
   <grade-display-short v-model="grade" displaySize="medium" /> 
  </v-col>
  <v-col cols="12" sm="6">
   <subject-display-short v-model="subjectID"/> 
  </v-col>
 </v-row>
 <v-card class="mt-2 pa-2" color="blue lighten-2">
 <v-layout row wrap class="pa-3">
   <v-flex>
        <v-btn @click="changeEditMode"
               small
              :title="editMode ? 'Click here to go to VIEW mode' : 'Click here to EDIT or UPLOAD files'"
              class="mx-1"
        > 
          <v-icon v-if="editMode==false"> mdi-glasses </v-icon>
          <v-icon v-if="editMode==true"> mdi-circle-edit-outline </v-icon>
        </v-btn>

        <v-btn @click="showAs='list'" 
               small
               :depressed="showAs=='list'" 
               title="View files as a list"
               class="mx-1"
        > 
          <v-icon> mdi-view-list </v-icon>
        </v-btn>
        <v-btn @click="showAs='card'" 
               small        
              :depressed="showAs=='card'" 
              title="View files as cards"
              class="mx-1"
        > 

          <v-icon> mdi-card </v-icon>
        </v-btn> 
        {{ showAs}}
        <v-btn v-if="editMode" 
               small @click="showAddFolder = true"
               class="mx-1"
        > 
          Add A Root Folder  
        </v-btn>
        <v-btn v-if="editMode" 
               small to="/subjects"
               class="mx-1"
        > 
          Edit Subject Names and Order 
        </v-btn>
        <v-btn v-if="editMode" 
               small to="/studentlist"
               class="mx-1"
        > 
          Student Class List 
        </v-btn>
      
   </v-flex>
 </v-layout>
    </v-card>
</v-container>


<v-btn @click="showDebug = !showDebug" class="pa-5 ma-3" small
        v-if="getZml.login.isAuthenticated && getZml.login.username=='werner'"> 
    show Debug4Werner 
</v-btn>

<v-container fluid v-if="showDebug">  
folderid:{{ folderid }} 
<br> Topfolder : {{ topFolder }} 
<br> displayFolderBack : {{ displayFolderBack }}
<br> displayFolder : {{ displayFolder }}
<br> displayFolderTop : {{ displayFolderTop }}
<br>g={{ grade }}s={{ subjectID }}
<br>The one we are in {{ topFolder.name }}
<br>showAddFolder : {{ showAddFolder }}
<br>{{ getZml.login }}

</v-container>

<!--v-container v-if="(contents && contents.length) || topFolder.displayfolder" -->
   <v-container v-if="(contents && contents.length)"
             fluid class="ma-2 mt-3" >
  <v-card color="blue lighten-2">
    <v-card-title>
      <template v-if="displayFolderBack != 'ROOT'">
        <v-btn @click="prevFolder(topFolder)" :title="topFolder.contentid">
          <v-icon> mdi-arrow-up-bold-outline </v-icon>
           UP TO {{ displayFolderBack }}  
        </v-btn>
      </template>  
      <template v-else>
        <v-btn v-if="folderid != 0" @click="getFolder(0)" :title="0"> 
          <v-icon> mdi-arrow-up-bold-outline </v-icon>
          UP .. {{ displayFolderBack }} 
        </v-btn>
      </template>

<!-- SHOW THE UP BUTTON OR IF Top SHOW SUBJECT/GRADE -->
      <v-row><v-col cols="12">
        <template v-if="displayFolder == 'Top'">
           <v-card class="text-center"
               color="white">
                Subject {{ subjectShortName() }} -  GR{{ topFolder.grade }}
           </v-card>           
        </template>
        <template v-else>
          <v-chip class="ma-2 float-md-right" 
                  title="Current Folder"
                  color="white">
               <v-icon> mdi-folder </v-icon> 
               {{ topFolder.name }} 
          </v-chip>
        </template>

<!-- SHOW THE STUDENT WHAT THE CURRENT FOLDER's GRADE AND SUJECT IS-->
        <v-chip class="ma-2 float-right" 
               :color="subjectColor()">
                Grade {{ topFolder.grade }} Subject {{ subjectShortName() }} 
        </v-chip> 

        </v-col>
      </v-row>
    </v-card-title>
    <v-card-text>           
 
 <!-- ACTUAL FILES AND FOLDERS -->
      <v-layout v-if="showAs == 'card'" row wrap>

        <v-flex v-for="item in contents" :key="item.itemid"
         flex-row
         justify-space-around
         cols="12" 
         >
          <template v-if="item.type=='folder'" >
            <!-- sometime the folder to which the content belong is also in the contents list
                  so we stop them from displaying it as a folder.-->
            <template v-if="displayFolder == 'Top' || item.description != topFolder.description">
              <teacher-folder-display v-if="editMode && (getZml.login.type == 'teacher' || showDebug)"  
                      @btn-click="getFolder(item.contentid)" 
                      :item="item" 
              />
              <student-folder-display v-if="!editMode || (getZml.login.type == 'student' || showDebug)"  
                      @btn-click="getFolder(item.contentid)" 
                      :item="item" 
              /> 
            </template>
          </template>

          <template v-else>
            <teacher-item-display v-if="editMode && (getZml.login.type == 'teacher' || showDebug)" 
                                 :btnFace="item.name" 
                                 :icon="item.icon" 
                                 :item="item" 
            />
            <student-item-display v-if="!editMode || (getZml.login.type != 'teacher' || showDebug)"  
                                 :btnFace="item.name" 
                                 :icon="item.icon" 
                                 :item="item" 
            />
          </template>

           <v-card v-if="showDebug" class="text-left mx-auto text-caption" max-width="600px">
            <v-card-title> 
              Debug: cid {{ item.contentid }} (<b> {{ item.type }}</b>) 
            </v-card-title>
            <v-card-text> pers={{ item.persid}} name={{ item.name }} 
              Folder:<b>{{ item.folder }}</b>, {{ item.days}},
              displayfolder={{ item.displayfolder }},
              Desc={{ item.description }}, tff{{ topFolder.folder }}
            </v-card-text>
           </v-card>

        </v-flex>
      </v-layout>
      <v-layout v-else class="ma-2 pa-2" row>
       <sh-file @btn-click="getFolder" 
                :contents="contents"
                :editMode="editMode"
                :displayFolder="displayFolder"
                :topFolder="topFolder"
                class="justify-space-around"
       />
     </v-layout>
     <div class="ma-2 text-center"> --- end --- </div>
    </v-card-text>
  </v-card>
 </v-container>
 <v-container v-else fluid class="ma-2 mt-3" >
  <v-card color="blue lighten-2">
    <v-card-title>             
      waiting to get your files.....
    </v-card-title>
  </v-card>
 </v-container>

<v-container fluid v-if="showDebug">
  inside {{ contents.length }}
<v-row>
   <v-col cols="12" v-if="contents.length > 0">
     <v-card color="deep-purple lighten-5">
       <zml-data-table
        :dataList="contents"
        userHeader="view files in tabular form"
        @clickOnRow="doEdit"
       />
      </v-card>
    </v-col>
</v-row> 

<v-row><v-col cols="8">
<v-card elevation="4">
<edit-item v-if="contentid" :contentid="contentid" />
</v-card>
</v-col>
</v-row>

</v-container>

</div>
</template>

<script>
import { getters } from "@/api/store"
//import { zmlLog } from '@/api/zmlLog.js';
import { zData } from "@/api/zGetBackgroundData.js"
import { infoSnackbar } from '@/api/GlobalActions';
import { sh } from "@/views/learn/sh.js"
import { subject } from "@/api/subject.js"

import GradeDisplayShort from '@/components/learn/GradeDisplayShort'
import SubjectDisplayShort from '@/components/learn/SubjectDisplayShort'

import TeacherItemDisplay from '@/components/learn/TeacherItemDisplay'
import StudentItemDisplay from '@/components/learn/StudentItemDisplay'

import StudentFolderDisplay from '@/components/learn/StudentFolderDisplay'
import TeacherFolderDisplay from '@/components/learn/TeacherFolderDisplay'
import zmlDataTable from '@/components/zmlDataTable.vue'

import EditItem from '@/views/learn/editItem'
import EditItemPartitions from '@/views/learn/EditItemPartitions'

import ShFile from '@/components/learn/ShFile.vue'
export default {
    name: "SHub",
    components: {
          StudentItemDisplay
        , TeacherItemDisplay          
        , StudentFolderDisplay
        , TeacherFolderDisplay
        , GradeDisplayShort
        , SubjectDisplayShort
        , zmlDataTable
        , EditItem
        , EditItemPartitions
        , ShFile
        },
    props: { propfolder: {default: 0} },  //419, 1415
    data: () => ({
        getZml: getters.getState({ object: "gZml" }),
        selection: [],
        showTextDialog:false,
        theItem:{},
        folderid:null,
        contents: [],
        topFolder: {grade:null, subjectid:null},  //this is the folder we requested, or the above folder if we request a file
        currentImage:'',  
        progress:false,
        subjectID:null,
        grade:null,
        editMode: false,
        showDebug:false,
        contentid:null,
        showAddFolder:false,
        showAs:'card',        
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
        if (this.topFolder && this.topFolder.description != this.topFolder.folder) {
          return [this.topFolder.displayfolder , this.folderid].join()
        }
        return "ROOT"
      },
    },
    methods:{
      changeEditMode() {

        //Check if this person is allowed to change the mode.
        if (this.editMode == false 
         && this.getZml.login.isAuthenticated == false
         && ['teacher','admin'].includes (this.getZml.login.type) == false )
        {
          infoSnackbar('Sorry, You are not allowed to change the data in this area. Try to login as a teacher!')
          return
        } 

        this.editMode = !this.editMode
      },
      testStuff(e) {
        this.getFolder(e)
      },
      doEdit(p1) {
        console.log(this.$options.name, 'got it back', p1.contentid)
        this.contentid = p1.contentid
        alert(this.contentid)
      },
      subjectShortName(sid = this.topFolder.subjectid) {
        return subject.shortName(sid)
      },
      subjectColor(sid = this.topFolder.subjectid) {
        return subject.color(sid)
      },
      getFolder(folderid = this.folderid) {
        console.log('getFolder : Retrieve "folderdata" on ', folderid, ' or ', this.topFolder.grade, this.topFolder.subjectid)
        this.folderid = folderid
        if (folderid < 1) { 
           folderid = 0
         }
        if (folderid == 0 && (!this.topFolder.grade || !this.topFolder.subjectid)) { console.log('ABORT!!! - no good data'); return }
        sh.contentData('folderdata', this.loadData, {folderid: folderid
                                                    ,grade:this.topFolder.grade || 0
                                                    ,subjectid:this.topFolder.subjectid || 0
                                                    })
      },      
      loadData(response) {
        console.log('LoadData', response.length , response)
        this.contents.length = 0
        this.topFolder = {}
        this.progress = false
        let topid = 0
        if (!Array.isArray(response) || (response.errorcode && response.errorcode != 0) ) {
          console.log('aft LL error/empty sub,grade is', this.subjectID, this.grade)
          //We have an error, or no data was returned
          if (this.folderid != 0) {
             infoSnackbar('We have no info in this folder, ' + this.folderid)
          }
          //this.subjectID = null
          //this.getZml.subject = ''
          return
        }
        if (this.folderid) {
          topid = response.findIndex(ele => ele.contentid == this.folderid)
        }
         //if we do not find topid, we are at the top of grade/subject - root folder
         if (topid < 0) { 
           topid = 0
         }
         //Here we can check if we came in with a file rather than a folder, and maybe get the folder
         // like we do at latest.vue
         this.topFolder = { name:response[topid].name
                          , displayfolder:response[topid].displayfolder
                          , contentid:response[topid].contentid
                          , grade:response[topid].grade
                          , subjectid:response[topid].subjectid
                          , folder:response[topid].folder
                          , description:response[topid].description}
         if (this.folderid == 0 ) this.topFolder.displayfolder = 'Top'
         this.contents = response
         this.contents.forEach(item =>{
            item.img = ''
            item.expand = false
            if (item.type == 'file' && item.description.substr(0,4) == 'load') {
                item.img = 'https://www.kuiliesonline.co.za/' + item.description.substr(5)
            }                     
         })
         this.grade = this.contents[0].grade
         this.subjectID = this.contents[0].subjectid
      },
      loadRootData(response) {
        console.log('LoadROOTData', response.length , response)
        this.contents.length = 0
        this.topFolder = {}
        this.progress = false
        if (!Array.isArray(response) || (response.errorcode && response.errorcode != 0) ) {
          //We have an error, or no data was returned
          console.log('aft LLR error/empty sub,grade is', this.subjectID, this.grade)
          infoSnackbar('We have no info in this subject folder, ' + this.getZml.subject)
          //this.subjectID = null
          //this.getZml.subject = ''
          return
        }
        this.topFolder = {grade:response[0].grade, subjectid:response[0].subjectid,displayfolder:'Top'}
        this.contents = response
        this.contents.forEach(item =>{
            item.img = ''
            item.expand = false
            if (item.type == 'file' && item.description.substr(0,4) == 'load') {
                item.img = 'https://www.kuiliesonline.co.za/' + item.description.substr(5)
            }                     
         })
         this.grade = this.contents[0].grade
         this.subjectID = this.contents[0].subjectid
      },
      prevFolder(folderItem) {
        console.log('prevFolder', folderItem)
         //ask for the information about the folder we need to go back to...
         if (folderItem.contentid) {
            sh.prevFolderData('prevFolder', this.prevFolderDataProcess, folderItem)
         } else {
            infoSnackbar('Not enought Folder info...')
         }
      },
      prevFolderDataProcess(response) {
        console.log('prevFolderDataProc')
        this.getFolder(response[0].contentid)
      },
      stillMounting() {
        console.log('stillMounting')
          this.progress = false;
          this.allowEdit = false
          this.getFolder(this.propfolder)
      },
      launchGradeSubjectChange() {
        console.log('launchGradeSubjectChange',this.grade , this.subjectID, this.getZml.grade, this.getZml.subjectid)        
        if (this.progress == true) {
          console.log('We are busy..')
          return
        }
        if (!( this.grade && this.subjectID)) {
          //One of them is filled - fill the other one
          if (this.grade == null) this.grade = this.getZml.grade
          if (this.subjectID == null) this.subjectID = this.getZml.subjectid
        }
        if (this.grade && this.subjectID) {
          this.allowEdit = false
          console.log('launchGradeSubjectChange Deeper = g,s?',this.grade , this.subjectID, this.getZml.grade, this.getZml.subjectid)        
          this.folderid = 0
          this.progress = true                    
          sh.contentData('folderdata', this.loadRootData, {folderid: 0,grade:this.grade ,subjectid:this.subjectID})
        }
      },
      isNumber(n) {
        isFinite(n)   //!isNaN(+n) && 
      }

    },
    filters: {},
    mounted: function () {
      zData.initialData('Load Subject Data')
      if (!this.getZml.login.fullname) infoSnackbar('Welcome Guest!')
      console.log('FINITE?', this.propfolder, isFinite(this.propfolder) )
      if (isFinite(this.propfolder)) {
         console.log('coming in with NO folderID',this.getZml.grade ,this.getZml.subjectid)
         if (this.getZml.grade && this.getZml.subjectid) {
           setTimeout(() => { 
           this.grade = this.getZml.grade
           this.subjectid = this.getZml.subjectid
           }, 1100)
           this.launchGradeSubjectChange()
         } else {
           console.log('we have no subjectid and grade, and propfolder is empty - SILENT!')
           this.grade = null
           this.getZml.grade = null
           this.subjectid = null
           this.getZml.subjectid = null
         }
      } else {
        console.log('coming in with a folder', this.propfolder)
        setTimeout(() => { this.stillMounting() }, 1100)
      }
    },
    watch: {
      grade(o,n) {
        if (o != n) {
          console.log('watch = grade')
          if (this.grade && this.subjectID) this.launchGradeSubjectChange()
        }
      },
      subjectID(o,n) {
        if (o != n) {
          console.log('watch = subject')
          if (this.grade && this.subjectID) this.launchGradeSubjectChange()
        }
      },      
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