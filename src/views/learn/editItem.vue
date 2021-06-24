<template>
<div>
<!-- {{this.$route.params.EditOrInsert}} -->
  <v-card>
    <v-card-title>
      <span class="headline">Edit CONTENT {{ contentid }} </span>
    </v-card-title>
    <v-card-text>
      <v-container grid-list-md>
        <v-layout wrap v-model="edit.name">
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
            <!--v-radio-group v-model="edit.grade">
              <v-radio
                v-for="n in [8,9,10,11,12]"
                :key="n"
                :label="`Grade ${n}`"
                :value="n"
              ></v-radio>
            </v-radio-group-->
          </v-flex>
          <v-flex xs12 sm6 md3>
            <!--v-text-field v-model="edit.accesstype" label="AccessType"></v-text-field-->              
           <v-select
             v-model="edit.accesstype"
             :items="['student','pers','hidden']"
             label="Access"
           /> a={{ edit.accesstype }}=a {{ accesstypeitems }}
          </v-flex>
          <v-flex xs12 sm6 md4>
           <v-select
             v-model="edit.type"
             :items="['file','folder','text','link']"
             label="Type"
           />            
          </v-flex>
          <v-flex xs12 sm6 md4>
            <v-text-field v-model="edit.folder" label="Folder"></v-text-field>
          </v-flex>
          <v-flex xs12 sm6 md4>
           <v-select
             v-model="edit.subjectid"
             :hint="`subjectid=${edit.subjectid}`"
             :items="getZml.subjects"
             item-text="description"
             item-value="subjectid"
             label="Subject"
           />
           
          </v-flex>
          <v-flex xs12 sm6 md4>
            <v-text-field v-model="edit.sortorder" label="SortOrder"></v-text-field>
          </v-flex>
          <v-flex xs12 sm12 md12>
            <v-textarea v-model="edit.description" label="Description"></v-textarea>
          </v-flex>
        </v-layout>
      </v-container>
    </v-card-text>
    <v-card-actions>
      <v-spacer />
      <v-btn @click="editDialog=false" color="blue darken-1" text>Cancel</v-btn>
      <v-btn @click="saveData()" color="blue darken-1" text>Save</v-btn>
    </v-card-actions>
  </v-card>
 
</div>
</template>
<script>
import { zmlConfig } from '@/api/constants.js';
import { zmlFetch } from '@/api/zmlFetch.js';
import { getters } from "@/api/store";
  export default {
    name: "EditItem",
    props: { contentid:{default:283} },
    components: {},
    data: () => ({
        getZml: getters.getState({ object: "gZml" }),
        edit: {},
        editMode: null,
        editDialog: true,
        progress:false,
        search: '',
        accesstypeitems: ['all','grade','pers','hidden']
    }),
    methods: {
        allocate() { 
            this.edit = {name: 'enter a name'
                       , description:'Enter more information of needed, or your text'
                       , type:'file/folder/text/link'
                       , folder:'foldername/linkname/textid/filename'
                       , accesstype: 'all/grade/pers/hidden'
                       , grade: 8
                       , subjectid:5
                       , persid: 12
                       , icon: 'mdi-text-subject'
                       , sortorder: 1};
            this.editDialog = true;
            this.editMode = 'add';
        },
        saveData() {
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
            this.editDialog = false;
            this.loadData();
            //zmlLog({task:"dolog",user:"None", pagename:"EditPackage", logdata: this.edit});
        },
        showData(response) {
            zmlConfig.cl(this.$options.name , 'showData : content = ' , response);
            this.edit = response[0];            
            this.progress = false;
            if (response == '') {
              alert('no data received');
            } else {
              this.edit = response[0];
            }
        },
        loadData() {
          if (!this.contentid) return;
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
        zmlConfig.cl(this.$options.name, 'Mount:Edit-2-package');
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