<template>
 <div>

<v-container>
  <div v-if="getZml.login.isAuthenticated > 0">
  <p>Current route name: {{ $route.name }} {{$route.params.grade }}
    <br>Autolist {{ currentSubjectID}}, {{currentSubject }}
  </p>
  </div>
  <v-sheet class="pa-4 secondary lighten-2">
      <v-expansion-panels accordion v-model="expOptions">
       <v-expansion-panel>
        <v-expansion-panel-header >Options       </v-expansion-panel-header>
         <v-expansion-panel-content class="pa-4 primary lighten-2">
          <v-row>
           <v-col>
            <v-checkbox
              v-model="caseSensitive"
              hide-details
              label="Case sensitive search"
            ></v-checkbox>     
              
            <v-radio-group  v-model="language">
             <v-radio label="Afrikaans" value="a"></v-radio>
             <v-radio label="English"   value="e"></v-radio>
            </v-radio-group>
           </v-col>
          </v-row>
          <v-row dense class="d-flex flex-wrap">
           <v-col v-for="item in subjects" :key="item.subjectid">
            <v-btn @click="showSubjects(item)">
             <v-icon>  mdi-text-subject  </v-icon>
             <span class="hidden-sm-and-down"> {{ lang(item) }} </span>
            </v-btn>
           </v-col>
          </v-row>
         </v-expansion-panel-content>
       </v-expansion-panel>
      </v-expansion-panels>
    </v-sheet>    

  <v-toolbar short color="accent" dense elevation="-2">
     <v-toolbar-title>
      Resources
     </v-toolbar-title>  

     <v-toolbar-title v-if="nameChanges == 0">  
      <auto-list :subjects="subjects" :language="language" @dataEntered="showSubjects" />
     </v-toolbar-title>

     <v-toolbar-title v-else>  
      <v-btn @click="saveFileChanges"> Save Changes {{ nameChanges }} </v-btn>
     </v-toolbar-title>

     <v-toolbar-title>
      <v-radio-group v-model="language" row rounded class="mt-7 ml-8">
       <v-radio label="Afr" value="a" />
       <v-radio label="Eng" value="e" />
      </v-radio-group>
     </v-toolbar-title>
     <v-toolbar-title  v-if="folderItems.length > 0">  
      <!--v-switch v-model="editEnabled" label="Edit Filenames" class="mt-7 ml-8" /-->      
     </v-toolbar-title>  
     <v-toolbar-title  v-if="folderItems.length > 0">  
      <v-text-field flat
        class="mt-7 ml-8"
        v-model="treesearch"
        label="Search Filenames"
        solo-inverted
        clearable
        rounded
        dense
        prepend-inner-icon="mdi-file-search"
        clear-icon="mdi-close-circle-outline"
      />
     </v-toolbar-title>  
    </v-toolbar>
    <v-row>
     <v-col>
     <div> {{ currentSubject }}</div>
      <v-treeview
        :open-all="openAllLeafs"
        item-key="name"
        selection-type="leaf"
        v-model="tree"
        :search="treesearch"
        :items="folderItems"
        @update:open="onOpen"
        activatable
        open-on-click
        return-object
        hoverable
        shaped
        dense
        independant
        color="warning"
      >
      <template #label="{ item }">
          <v-subheader fluid @click="onItemClick(item)" style="align:left">
            {{langUnderscore(item.name)}} <v-spacer />{{item.time}} 
          </v-subheader>
          <v-container v-if="editEnabled" fluid><v-row><v-col>
            <v-text-field outlined v-model="item.sameName" label="EditFile" append-icon="mdi-tooltip-edit">
            <v-btn x-small><v-icon>mdi-tooltip-edit</v-icon></v-btn>
            </v-text-field>
            Date: {{item.time}} Size: {{ (item.size/1024).toFixed(1) }}Kb
          </v-col></v-row></v-container>
        <!--/template-->
      </template>

      <template v-slot:prepend="{ item, open }">
       <div v-if="!item.file">
        <v-btn icon>
         <v-icon>{{ open ? 'mdi-folder-open' : 'mdi-folder' }}</v-icon>
       </v-btn>
       </div>
       <div v-else>
        <v-btn icon @click="openMe(item)">
         <v-icon :color=extColor(item.file)>  {{ extIcon(item.file) }}</v-icon>
        </v-btn>
       </div>
      </template>


      <template v-if="editEnabled" v-slot:append="{ item }">
        <!--v-btn x-small @click="renameMe(item)">
         <v-icon color=green x-small> mdi-file-edit</v-icon> 
        </v-btn-->
        <!--v-btn v-for="menu in treeEdit" :key="menu.id" link -->
        <div  v-for="menu in treeEdit" :key="menu.id" >
         <v-btn small icon  @click="fileMethod(item,menu.id)"> 
           <v-icon small :color="menu.color" v-text="menu.icon">  </v-icon>
         </v-btn>
        </div>
       <v-menu transition="slide-y-transition">
         <template v-slot:activator="{ on, attrs }">
           <v-btn
             x-small
             class="white--text ma-8"
             v-bind="attrs"
             v-on="on"
           ><v-icon color=green x-small> mdi-file-edit</v-icon> 
           </v-btn>
           <file-uploader />
         </template>
           <v-list>

             <v-list-item v-for="menu in treeEdit" :key="menu.id" link>
             <v-list-item-icon><v-icon :color="menu.color" v-text="menu.icon"></v-icon></v-list-item-icon>
             <v-list-item-title @click="fileMethod(item,menu.id)"> 
               {{ menu.text }} {{ item.filename }}
             </v-list-item-title>
                <!--v-list-item-action @click="test(n)"> </v-list-item-action-->
             </v-list-item>
          </v-list>      
       </v-menu>
      </template>
    </v-treeview>
  </v-col>
  <v-divider vertical></v-divider>
  <v-col cols="10"  md="6">
    <v-card-text>
      <div>
         <h1> File Information</h1>
     </div>
     <v-btn v-if="fileButton" @click="viewCurrent"> {{ fileButton }} </v-btn>
     <!--v-btn v-if="maximizeRoute" @click="viewCurrentMaximize" :href="maximizeRoute" target="_blank"><v-icon>mdi-window-maximize</v-icon></v-btn-->
     <v-btn v-if="maximizeRoute" @click="localShowFile = true" title="Show in bigger window">
       <v-icon>mdi-window-maximize</v-icon>
     </v-btn>     
         <iframe if="someHref" style="width:100%;height=100%" :src="someHref" scroll=true allowfullscreen></iframe>      
    </v-card-text>
  </v-col>  
</v-row>
</v-container>

<v-dialog v-model="localShowFile" v-on:keyup.esc="byebye"
          width="auto" :fullscreen="$vuetify.breakpoint.xsOnly">
  <v-card>
    <v-card-actions>
     <v-btn v-if="fileButton" @click="viewCurrent"> View Local </v-btn>
     <v-btn v-if="maximizeRoute" 
            @click="viewCurrentMaximize"
            :href="maximizeRoute" 
            title="Click to download or open standalone"
            target="_blank">
       <v-icon>mdi-window-maximize</v-icon>
     </v-btn>
     <v-spacer></v-spacer>
     <v-btn icon @click="localShowFile = !localShowFile"> <v-icon> mdi-close</v-icon></v-btn>
    </v-card-actions>
    <v-card-title>
       {{ curItem.name }}
    </v-card-title>     
    <v-card-text>
     <iframe if="someHref" style="width:100%;height:350px" :src="someHref"></iframe>
     </v-card-text>
  </v-card>
</v-dialog>
<v-dialog v-model="localRenameFile" v-on:keyup.esc="byebye">
  <v-container>
  <v-card class="mt-2 pl-8 pr-8">
    <v-card-title>
       {{ curItem.name }}
     <v-spacer></v-spacer>
     <v-btn icon @click="localRenameFile = !localRenameFile"> <v-icon> mdi-close</v-icon></v-btn>

    </v-card-title>     
    <v-text-field solo  v-model="curItem.name" label="Name" autofocus required></v-text-field>
    <v-card-actions>
    </v-card-actions>
  </v-card>
  </v-container>
</v-dialog>


</div>
</template>

<script>
import { zmlFetch } from '@/api/zmlFetch';
import AutoList from '@/components/learn/AutoList';
import FileUploader from '@/components/learn/FileUploader';
import { getters } from "@/api/store";
  export default {
    name: "dkhstree",
    components: {AutoList, FileUploader},
    data: () => ({
      getZml: getters.getState({ object: "gZml" }),
      whatisinside: null,
      openAllLeafs: false,
      editEnabled: false,
      expOptions:'',
      treesearch:'',
      caseSensitive: false,
      currentSubject: 'Click on Options for a Subject List',
      currentSubjectID: null,
      treeEdit: [
        {id:1,icon: 'mdi-update'    , color:'green', text:'Update filename'},
        {id:2,icon: 'mdi-delete'    , color:'red'  , text:'Delete filename'},
        {id:3,icon: 'mdi-image-move', color:'blue' , text:'Move filename'},
      ],
      iconExt: [
               {ext:'html' ,icon: 'mdi-language-html5',    color:'blue'},
               {ext:'htm'  ,icon: 'mdi-language-html5',    color:'blue'},
               {ext:'js:'   ,icon: 'mdi-nodejs',           color:'blue'},
               {ext:'json' ,icon: 'mdi-code-json',         color:'blue'},
               {ext:'md'   ,icon: 'mdi-language-markdown', color:'blue'},
               {ext:'pdf'  ,icon: 'mdi-file-pdf',          color:'red'},
               {ext:'txt'  ,icon: 'mdi-file-document',     color:'blue'},
               {ext:'xls'  ,icon: 'mdi-file-excel',        color:'green'},
               {ext:'xlsx' ,icon: 'mdi-file-excel',        color:'green'},
               {ext:'doc'  ,icon: 'mdi-file-document',     color:'blue'},
               {ext:'docx' ,icon: 'mdi-file-document',     color:'blue'},
               {ext:'mp4'  ,icon: 'mdi-movie',             color:'yellow'},
               {ext:'mpeg' ,icon: 'mdi-movie',             color:'yellow'},
               {ext:'mpg'  ,icon: 'mdi-movie',             color:'yellow'},
               {ext:'jpg'  ,icon: 'mdi-image',             color:'purple'},
               {ext:'jpeg' ,icon: 'mdi-file-image',        color:'green'},
               {ext:'png'  ,icon: 'mdi-file-image',        color:'purple'},
               {ext:'ppt'  ,icon: 'mdi-file-powerpoint',   color:'black'},
               {ext:'pptx' ,icon: 'mdi-file-powerpoint',   color:'black'},
               {ext:'zip'  ,icon: 'mdi-folder-zip',        color:'brown'},
               {ext:'mp3'  ,icon: 'mdi-music-note',        color:'orange'},
               {ext:'m4a'  ,icon: 'mdi-file-music',        color:'yellow darken-5'},
               ],
      tree: [],
      folderItems: [],
      openIds: [],
      fileButton: 'View',
      someHref: '',
      curItem: [],
      icon: 'justify',
      subjects: [],
      language: 'a',  
      maximizeRoute: '',
      localShowFile: false,
      localRenameFile: false,
      nameChanges: 0,
      currentGrade: '', 
    }),
    methods:{
        fileMethod(fileItem,operation) {
           if (operation == 1) {
             //Update filename on server...
             console.log(fileItem);
             if (fileItem.name != fileItem.sameName) {
               //There was a change
               //alert('changeing filename to ' + fileItem.sameName);
               fileItem.renameFileTo = fileItem.sameName;
               zmlFetch({task: 'renamefile', file: fileItem}, this.operationDone, this.operationError);
               fileItem.name = fileItem.sameName;
             }
           }
           if (operation == 2) {
             //not don yet
           }
           if (operation == 3) {
             //not don yet
           }

        },
        operationDone(response) {
          console.log('operationDone:' , response);
          alert('operationDone:' + response);
        },
        operationError(response) {
          console.log('operationError:' , response);
          alert('operationError:' + response);
        },        
        showSubjects(item) {
          console.log('showSubjects : ' , item.subjectdesc);
          if (item.subjectdesc == 'Imported') { 
            alert('Nothing loaded here yet');
            return;
          }
          this.currentSubjectID = item.subjectid;
          this.currentSubject = item.subjectdesc;
          this.loadOurTree(item.subjectdesc);
          this.expOptions = null;
          
        },
        onItemClick(item) {
          this.fileButton = 'View ' + item.name;
          this.curItem = item;
          this.maximizeRoute = this.curItem.href;
          //clean the previous display from iframe
          this.someHref = null;
        },
        viewCurrent() {
          this.someHref = this.curItem.href;
          console.log('viewCurrent : ' ,this.curItem.name, this.someHref);
        },
        viewCurrentMaximize() {
          this.maximizeRoute = this.curItem.href;  
        },
        openMe(p) {
            //alert('poem ' + p.name);
            console.log('OpenMe : ', p.name, p.file, p.iets);
            this.localShowFile = true;
        },/*
        renameMe(p) {
            //Popup a dialog box, with current name (without path) and if changed tell server.
            //Then rename it here as well if successfull
            alert(p.name);
            console.log(p);
            this.localRenameFile = true;
            //this.edit = true;
        },*/
        loadOurTree(passedfolder) {
          let passedFolder = passedfolder;
          this.currentGrade = this.$route.params.grade;
          this.currentGrade = 'GR12'; //zml - we only have data for GR12!!!!!
          if (passedfolder.indexOf('Subject') > -1) {
            //leave the passedfolder  as is.
            
          } else {
            passedFolder = 'Subjects/' + this.currentGrade + '/' + passedfolder;
          }
          //alert(passedFolder);
         zmlFetch({task: 'readfolder', folder: passedFolder}, this.loadFolderItems, this.loadError);
        },
        loadFolderItems(response) {
          this.folderItems = [];
          //Add a new property, so we can see when a name changed.
          /*
          response.forEach(item => {
             let newItem = item;
             newItem.sameName = item.name;
             this.folderItems.push(newItem);
          });
          */
         this.folderItems = response;
          this.folderItems.sort((a,b) => a.name.localeCompare(b.name));
          console.log(this.folderItems);
        },
        loadSubjects(response) {
          console.log('Subjects : ', response);
          this.subjects = response;
        },
        loadError(error) {
          console.log(error);
          alert('Nothing loaded yet (possibly) - error : ' + error);
        },
        onOpen(items) {
          this.openIds = items;
        },
        lang(item) {
          if (this.language=='e') {
             return(item.subjectengname);
          } else {
             return(item.subjectafrname);
          }
        },
        langUnderscore(item) {
          if (this.editEnabled == true) return(item);

          if (this.language=='e') {
             let strPos = item.indexOf("_");
             if (strPos > -1) return( item.slice(0,strPos ));
             return(item);
          } else {
            let strPos = item.indexOf("_");
            if (strPos > -1) return( item.slice(strPos+1 ));
            return(item);
          }
        },
        extColor(extension){
           let index = this.iconExt.findIndex(p => p.ext == extension);
           if (index == -1) return 'DeepSkyBlue';
           return this.iconExt[index].color;
        },
        extIcon(extension){
           let index = this.iconExt.findIndex(p => p.ext == extension);
           if (index == -1) return 'mdi-information-variant"';
           return this.iconExt[index].icon;
        },
        saveFileChanges() {
          alert('here we will save any changes made, before new subject can be selected');
          this.nameChanges = 0;
        },

    },
    computed: {
      filter () { 
        return this.caseSensitive
          ? (item, treesearch, textKey) => item[textKey].indexOf(treesearch) > -1  : undefined
      },      
    },
    mounted: function () {
      console.log('TR:mounted - zml:');
      zmlFetch({task: 'getsubjects'}, this.loadSubjects, this.loadError);
    },    
 watch: {
    /*folderItems: {
      handler: function (n,o) {
        if (n.length == o.length) {
          console.log('folderItems Changed : ', n.length, o.length);
          this.nameChanges += 1;
          }
      },
      deep: true
    }*/
  }    
}
</script>


<style scoped>
</style>