<template>
<div>
  <v-card>
    <v-card-title>
      <span v-if="editMode == 'add'" class="headline"> Insert a Folder </span>
      <span v-else class="headline"> Edit Item {{ edit.name }} </span>
    </v-card-title>
    <v-card-text>
    {{ contentid }} {{ editing }} {{ editMode }}
           <!--v-btn-toggle  tile
                          color="deep-purple accent-3"
                          group 
                          v-model="editing" 
                          row
                          class="ma-0 pa-0 text-caption text-sm-body-2 text-md-body-1 text-lg-h6 text-xl-h4">
               <v-btn class="ma-1" label="name" value="name" title="Edit the Name">
                Name
               </v-btn>
               <v-btn class="ma-1" label="access" value="access" title="Edit Access">
                Access
               </v-btn>
               <v-btn class="ma-1" label="folder" value="folder" title="change folder">
                Else
               </v-btn>

           </v-btn-toggle-->    

      <v-container grid-list-md>
        <v-layout wrap>
          <v-flex xs12 sm6 md12 v-if="editing == 'name'">
            <v-text-field v-model="edit.name" label="Name"></v-text-field>
          </v-flex>
          <v-flex xs12 sm6 md3 v-if="editing == 'access'">
           <v-select
             v-model="edit.accesstype"
             :items="['student','pers','hidden']"
             label="Access"
           /> a={{ edit.accesstype }}=a {{ accesstypeitems }}
          </v-flex>
          <v-flex xs12 sm6 md4 v-if="editMode == 'notused'">
           <v-select
             v-model="edit.type"
             :items="['text','link']"
             label="Type"
           />            
          </v-flex>
          <v-flex xs12 sm6 md4  v-if="editing == 'move'">
            <v-text-field v-model="edit.folder" label="Folder"></v-text-field>
          </v-flex>
        </v-layout>
      </v-container>
    </v-card-text>
    <v-card-actions>
      <v-spacer />
      <v-btn @click="$emit('close')" color="blue darken-1" text>Cancel</v-btn>
      <v-btn @click="saveData" color="blue darken-1" text>Save</v-btn>
    </v-card-actions>
  </v-card>
 
</div>
</template>
<script>
import { zmlConfig } from '@/api/constants.js';
import { zmlFetch } from '@/api/zmlFetch.js';
import { getters } from "@/api/store";
import { infoSnackbar,errorSnackbar } from '@/api/GlobalActions';
  export default {
    name: "EditItemPartitions",
    props: { contentid:{default:0}
           , mode:{default:'name'}
           },
    components: {},
    data: () => ({
        getZml: getters.getState({ object: "gZml" }),
        edit: {name: '', description:''
              ,type:'', folder:''
              ,accesstype: ''
              ,grade: ''
              ,subjectid:''
              ,persid: ''
              ,icon: '', sortorder: 1
               },
        editMode:null,
        editing:'name',
        progress:false,
        search: '',
        accesstypeitems: ['all','grade','pers','hidden']
    }),
    methods: {
        allocate() { 
            this.edit = {name: ''
                       , description:''
                       , type:''
                       , folder:''
                       , accesstype: 'student'
                       , grade: this.getZml.login.grade
                       , subjectid:this.getZml.login.subjectid
                       , persid: this.getZml.login.userid
                       , icon: ''
                       , sortorder: 1};
        },
        saveData() {
           let errorMessage = ""
           this.edit.grade = this.getZml.login.grade
           this.edit.subjecid = this.getZml.login.subjectid
           this.edit.persid =  this.getZml.login.userid
           if (!this.edit.grade) errorMessage = 'We have no grade selected!'
           if (!this.edit.subjectid) errorMessage = 'We have no subject selected!'
           if (errorMessage) {
               infoSnackbar('Oeps')
               errorSnackbar(errorMessage)
               return
           }
           let ts = {};
           ts.data = this.edit;
           ts.mode = this.editMode;
           ts.api = zmlConfig.apiDKHS
           alert('wait!!!') 
           /*
           if (this.editMode == 'add')  {
              ts.task = 'insertLContent';
           } else {
              ts.task = 'updateLContent';
           }
           this.progress = true;
           zmlFetch(ts, this.afterUpdate);   
           */
        },
        afterUpdate(response) {
            zmlConfig.cl('AfterUpdate:',response);
            this.loadData();
            //zmlLog({task:"dolog",user:"None", pagename:"EditPackage", logdata: this.edit});
        },
        showData(response) {
            zmlConfig.cl('content=' , response);
            this.edit = response[0];            
            this.progress = false;
            if (response == '') {
              alert('no data received');
              this.allocate()
            } else {
              this.edit = response[0];
            }
        },
        loadData() {
           if (!isFinite(this.contentid) || this.contentid == 0) {
              return;
           }
           let ts = {};
           ts.sql = 'select * from dkhs_lcontent where contentid = ' + this.contentid;
           console.log('fetching...', ts.sql)
           ts.task = 'PlainSql';
           ts.api = zmlConfig.apiDKHS
           this.progress = true;
           zmlFetch(ts, this.showData);
        },
    },
    mounted: function () {
        zmlConfig.cl(this.$options.name, 'Mount:Edit-3-package');
        this.editing = this.mode
        if (this.contentid > 0) {
            this.editMode = 'update' 
        } else {
            this.editMode = 'add' 
            this.allocate()
        }
        this.loadData();
    },
    watch:{
      contentid: function() {
        console.log(this.$options.name, 'wathc contentid', this.contentid)
        this.loadData()
      }
    }
  }
</script>