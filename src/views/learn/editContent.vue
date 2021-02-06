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
     <v-card-title>
      DKHS CONTENT EDITIING
      <v-spacer></v-spacer>
    </v-card-title>
  <v-data-table 
    :headers="headers"
    :items="content"
    :items-per-page="7"
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
             item-text="text"
             item-value="id"
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
             :hint="`id=${edit.subjectid}`"
             :items="getZml.subjects"
             item-text="subjectafrname"
             item-value="subjectid"
             label="Subject"
           />
          </v-flex>
          <!--v-flex xs12 sm6 md4>
            <v-text-field v-model="edit.persid" label="Persid"></v-text-field>
          </v-flex>
          <v-flex xs12 sm6 md4>
            <v-text-field v-model="edit.sortorder" label="SortOrder"></v-text-field>
          </v-flex-->
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
 </v-dialog>
</div>
</template>
<script>
import { zmlConfig } from '@/api/constants.js';
import { zmlFetch } from '@/api/zmlFetch.js';
import { getters } from "@/api/store";
import { infoSnackbar } from '@/api/GlobalActions';
//import { zmlLog } from '@/api/zmlLog.js';
  export default {
    name: "editContent",
    components: {},
    data: () => ({
        getZml: getters.getState({ object: "gZml" }),
        editDialog:false,
        edit: {},
        editMode: null,
        progress:false,
        search: '',
        accesstypeitems: [{id:1,text:"student"},{id:2,text:"pers"},{id:3,text:"hidden"}],
        headers: [
          { text: 'Id', value: 'contentid' },
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
        editCard(id) {
            let idx = this.content.findIndex(ele => ele.contentid == id);
            if (idx == -1) {
                alert(id + ' not found');
                return;
            }
            this.edit = this.content[idx];
            zmlConfig.cl('edit',idx, this.edit);
            this.editDialog = true;
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
            ts.api = 'http://localhost:81/api/dkhs/dkhs.php'
            this.progress = true;
            zmlFetch(ts, this.afterUpdate);   

        },
        lowerOrder(id) {
           if (id < 2) {
               alert('Order is low enough');
               return;
           }
           let ts = {};
           ts.task = 'PlainSql';                  
           ts.sql = 'update dkhs_lcontent set sortorder = sortorder-1 where contentid = ' + id;
           ts.api = 'http://localhost:81/api/dkhs/dkhs.php'
           this.progress = true;
           zmlFetch(ts, this.afterUpdate);   
        },
        increaseOrder(id) {
           let ts = {};
           ts.task = 'PlainSql';                  
           ts.sql = 'update dkhs_lcontent set sortorder = sortorder+1 where contentid = ' + id;
           ts.api = 'http://localhost:81/api/dkhs/dkhs.php'
           this.progress = true;
           zmlFetch(ts, this.afterUpdate);   
        },
        saveData() {
           let ts = {};
           ts.data = this.edit;
           ts.mode = this.editMode;
           ts.api = 'http://localhost:81/api/dkhs/dkhs.php'
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
        showData(response) {
            zmlConfig.cl('content=' , response);
            this.progress = false;
            if (response == '') {
              alert('no data received');
            } else {
              this.content = response;
            }
        },
        loadSubjects(response) {
            console.log(response);
            this.getZml.subjects = response;
        },
        loadData() {
           let ts = {};
           ts.sql = 'select * from dkhs_lcontent order by sortorder, name';
           ts.task = 'PlainSql';
           ts.api = 'http://localhost:81/api/dkhs/dkhs.php'
           zmlConfig.cl(ts);
           zmlFetch(ts, this.showData);
        },
        showSubjects(item) {
          console.log('showSubjects : ' , item);
        }

    },
    mounted: function () {
        zmlConfig.cl('Mount:Edit-2-package');
        zmlFetch({task: 'getsubjects'}, this.loadSubjects);
        this.loadData();
    }
  }
</script>