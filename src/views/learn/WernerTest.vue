<template>
<div>
 <v-btn @click="startAgain"> Start Again (getFolders) </v-btn>

<v-expansion-panels>
 <v-expansion-panel>
  <v-expansion-panel-header :loading="loadStatus"> BaseTable (tcontent) </v-expansion-panel-header>
    <v-expansion-panel-content> 
      <v-card color="grey lighten-1" :loading="loadStatus">
       <baseTable :tList="content"
           tHeading="inside of content"
           :bHeading="'Recs = ' + content.length" 
           @bonga="clickReceived"
        />
      </v-card>
  </v-expansion-panel-content> 
</v-expansion-panel>


 <v-expansion-panel>
  <v-expansion-panel-header> Google Drive Items </v-expansion-panel-header>
    <v-expansion-panel-content> 
      <v-card color="grey lighten-2">google drive items
       <google-drive-items :itemList="filterContent" 
                   :folderObj="folderObj" 
                   @iconClick="iconClick"
                   @contentProperties="contentProperties" />
      </v-card>            
  </v-expansion-panel-content>       
 </v-expansion-panel>
  

  <v-expansion-panel>
    <v-expansion-panel-header> ZMLFolders </v-expansion-panel-header>
    <v-expansion-panel-content> 
  <v-card color="blue"> zmlFolders {{  getZml.folders }} </v-card>
  <v-card color="grey lighten-3">
      folderObj= {{ folderObj}}
  </v-card>
  </v-expansion-panel-content> 
  </v-expansion-panel>
  <v-expansion-panel>
    <v-expansion-panel-header> FilterContent </v-expansion-panel-header>
    <v-expansion-panel-content> 
   <v-card color="grey lighten-4"> 
       filtercontent {{ filterContent }} 
   </v-card>
    </v-expansion-panel-content>
  </v-expansion-panel>
</v-expansion-panels>

</div>
</template>

<script>
import { zmlConfig } from '@/api/constants.js';
import { zmlFetch } from '@/api/zmlFetch.js';
import { getters } from "@/api/store";
import { infoSnackbar } from '@/api/GlobalActions';
import GoogleDriveItems from '@/components/learn/GoogleDriveItems.vue'
import baseTable from '@/components/base/baseTable'
  export default {
    name: "viewContentWernerTest",
    components: {GoogleDriveItems, baseTable},
    data: () => ({
        getZml: getters.getState({ object: "gZml" }),
        folderObj:{},
        loadStatus:false,
        content: [],
    }),
    methods: {
        startAgain() {

           zmlFetch({task: 'getfolders',api:zmlConfig.apiDKHS}, this.afterFolders);
           this.loadData();

        },
        clickReceived(value) {
            this.folderObj = value
        },
        iconClick(info) {
            this.$cs.l('iconClick', info)
        },
        contentProperties(info){
            this.$cs.l('contentProperties', info)
        },
        // Here we handle all the loading of lcontent, subjects and folders.
        loadFolders() {
          this.loadStatus = true
          zmlFetch({task: 'getfolders',api: zmlConfig.apiDKHS}, this.afterFolders);
        },
        afterFolders(response) {
          this.getZml.folders = response;
          this.loadData();
          this.loadStatus = false
        },        
        loadSubjects(response) {
            ////this.$cs.l('GD:LOADSUBJECTS')
            this.getZml.subjects = response;
            if (this.getZml.folders.length == 0) {
               this.getZml.folders.push({id:1, name:'default'})
               this.loadFolders()
            } else {
               this.loadData();
            }
        },
        loadData() {
           ////this.$cs.l('GD:LOADDATA')
              this.loadStatus = true
              let ts = {};
              ts.sql = 'select * from dkhs_lcontent '
                     + ' where sortorder != 0 '
                     + ' order by sortorder, name';
              ts.task = 'PlainSql';
              ts.api = zmlConfig.apiDKHS
              zmlConfig.cl(ts);
              zmlFetch(ts, this.showData);
        },
        showData(response) {
            ////this.$cs.l('GD:SHOWDATA')
            zmlConfig.cl('content=' , response);
            this.progress = false;
            if (response == '') {
              alert('no data received');
            } else if (response && response.error) {
              alert('LoadError no data received '+ response.error);
              this.content = []
            } else {
              this.content = response;
            }
            this.loadStatus = false
        },

    },
    computed:{
      //Display a list of folders on dropdown
      folderFilter() {
        let tempT = []
        if (typeof this.getZml.folders === 'undefined' || this.getZml.folders.length == 0) {
          return ['temp']
        }
        this.getZml.folders.filter(ele => ele.grade == this.getZml.grade && ele.subjectid == this.getZml.subjectid).forEach(item => {
          if (this.showRootFolders) {
              if (item.folder == item.description) {
                  const newitem = item
                  tempT.push(  newitem );
              }
          } else {
             const newitem = item
             tempT.push(  newitem );
          }
        })
        return tempT
      },
      filterContent() {
        //this.$cs.l('filtering for', this.folderObj.name)
        let g = this.folderObj.grade
        let s = this.folderObj.subjectid
        let res = []         
         //take out all foldernames
         this.content.forEach(cont => {
             if (cont.folder == this.folderObj.name && g == cont.grade && s == cont.subjectid) {
                if (cont.name != this.folderObj.name) {
                   res.push(cont)
                }
             }
         })
         return res
        //return this.content;
        /*
        //c.folder == folderObj.foldername && c.type!='folder'
        ////this.$cs.l('GD:FILTERCONTENT')
        ////this.$cs.l('GD:FILTERCONTENT',this.folderObj)
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
                 ////this.$cs.l(a.name, b.name)
                 return (a.name.toLowerCase() < b.name.toLowerCase() ? -1 : (a.name.toLowerCase() > b.name.toLowerCase() ? 1 : 0))
               })
            }
            ////this.$cs.l('Length : ', res.length)
            return res
        } else {
           ////this.$cs.l('wys alles Length : ', this.content.length)
           return this.content;
        }
        */
      }
    },  
    filters:{ 
       subjectLookup: function(val) {
         return "s " + val // this.getZml.subjects.find(a => a.subjectid == val).shortname
       }
    },      
    mounted: function () {
        zmlConfig.cl('Werner Test');
        //If subjects is empty, load them , if folders empty, load them, and then loadData, else loadData
        ////this.$cs.l('MOUNT GDRV : ', this.getZml.login)
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
          infoSnackbar('Mount')
    },
    watch: {
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