<template>
<div>

  <v-row  v-if="allStories">
        <v-col cols="12" col="4" v-for="s in allStories" :key="s.storyid">
            {{ s.storymainid }} {{ s.storytitle }} {{ s.activedate.substr(0,10) }} 
            <v-btn @click="storyFilter(s.storymainid)"> filter </v-btn>
        </v-col>
  </v-row>

 <v-card>
  <div class="text-center">
   <v-progress-linear stream
                       color="blue-grey"
                      :active="progressShow" 
                      :indeterminate="progressShow" 
                      ></v-progress-linear>
   </div>
     <v-card-title>
      De Kuilen Carousel Story
      <v-spacer></v-spacer>
      <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        label="Search"
        single-line
        hide-details
      ></v-text-field>
    </v-card-title>
  <v-data-table 
    :headers="headers"
    :items="filterChapter"
    :items-per-page="7"
    class="elevation-1"
    single-expand>
    <template v-slot:footer>
      <v-card class="ma-4"> 
          <v-card-text class="green lighten-4">
              Kliek op die klein ronde dingetjie om data te verander, die op en af pyl om te skuif, en die 
              snaakse + teken onder regs om iets by te voeg.
          </v-card-text>
      </v-card>
    </template>
    <template v-slot:[`footer.page-text`]>
       <v-btn icon @click="allocate()"><v-icon >mdi-table-plus</v-icon></v-btn>
    </template>
    <template v-slot:[`item.detail1`]="{ item }">
        <div v-if="Number(item.detail1) == item.detail1"> {{ getSubject(item.detail1) }} ({{ item.detail1 }}) </div>
        <div v-if="item.detail1.length > 40">    {{ item.detail1.substring(0,40) }} ... </div>
        <div v-if="Number(item.detail1) != item.detail1">{{ item.detail1 }}</div>
    </template>
    <template v-slot:[`item.detail2`]="{ item }">
        <div v-if="item.detail2.length > 40">    {{ item.detail2.substring(0,40) }} ... </div>
        <div v-else>{{ item.detail2 }}</div>
    </template>
    <template v-slot:[`item.type`]="{ item }">
    {{ etypes[item.type] }} {{ item.type }}
    </template>
    <template v-slot:[`item.orderid`]="{ item }">
      {{ item.orderid}} 
       <v-btn x-small icon @click="editCard( item.storyid )"> 
           <v-icon x-small>mdi-database-edit</v-icon>
        </v-btn>
       <v-btn x-small icon @click="increaseOrder( item.storyid )"> 
           <v-icon x-small>mdi-plus</v-icon>
        </v-btn>        
       <v-btn x-small icon @click="lowerOrder( item.storyid )"> 
           <v-icon x-small>mdi-minus</v-icon>
        </v-btn>                
      </template>
  </v-data-table>
 </v-card>




 <!-- DIALOG WINDOWS --------------------->
 <v-dialog v-model="editDialog" style="transform: scale(0.875);transform-origin: left;">
  <v-card>
    <v-card-title>
      <span class="headline">Edit User</span>
    </v-card-title>
    <v-card-text>
      <v-container grid-list-md>
        <v-layout wrap>
          <v-flex xs6 sm2 md1>
            <v-text-field v-model="edit.chapterid" label="Chapter"></v-text-field>
          </v-flex>
          <v-flex xs6 sm2 md2>
            <v-text-field v-model="edit.orderid" label="Order"></v-text-field>
          </v-flex>
          <v-flex xs6 sm2 md2>
            <v-radio-group v-model="edit.type">
              <v-radio label="Title(1)" value="1" />
              <v-radio label="Diploma (2)" value="2" />
              <v-radio label="Trophy (4)" value="4" />
              <v-radio label="List Of Students(5)" value="5" />  
              <v-radio label="Something New" value="3" />  
            </v-radio-group>
            <!--v-text-field v-model="edit.type" label="Type"></v-text-field-->
          </v-flex>
          <v-flex xs6 sm2 md2>
            <v-text-field v-model="edit.otherid" label="OtherID"></v-text-field>
          </v-flex>
          <v-flex xs12 sm12 md5>
            <v-textarea v-model="edit.detail1" label="Detail1 - Title"></v-textarea>
          </v-flex>
          <v-flex xs12 sm12 md5>
            <v-textarea v-model="edit.detail2" label="Detail2 - Body"></v-textarea>
          </v-flex>
        </v-layout>
          <student-lookup @dataEntered="test" @idsEntered="test" />
          
          <div v-if="studentFound"> StudentID:{{ studentFound.studentid }} </div>
      </v-container>
      <v-card-actions>
      <v-spacer />
      <v-btn @click="editDialog=false" color="blue darken-1" text>Cancel</v-btn>
      <v-btn @click="saveData()" color="blue darken-1" text>Save</v-btn>
      </v-card-actions>
    </v-card-text>
  </v-card>
 </v-dialog>
</div>
</template>

<script>
import { zmlConfig } from '@/api/constants.js';
import { zmlFetch } from '@/api/zmlFetch.js';
import StudentLookup from '@/components/student/StudentLookup' 
  export default {
    name:"storyEdit",
    components: {StudentLookup},
    data: () => ({
        editDialog:false,
        edit: {title: 'new', description:' longer ', wasorder: 5, type: 2},
        editMode: null,
        progressShow:false,
        search: '',
        etypes: ["nada","title","diploma","nothing","trophy","list"],
        headers: [
          { text: 'ID', value: 'storyid' },
          { text: 'Chapter', value: 'chapterid' },
          { text: 'Type', value: 'type' },
          { text: 'Other', value: 'otherid' },
          { text: 'Detail1', value: 'detail1' },
          { text: 'Detail2', value: 'detail2' },
          { text: 'Order',  align: 'start',  value: 'orderid' },
        ],
        content: [],
        subjects:[],
        allStories:[],
        chapterFilter:null,
        studentFound:null,
    }),
    computed: {
      filterChapter() {
        if (this.chapterFilter) {
          return this.content.filter(c => c.chapterid == this.chapterFilter );
        } else {
          return this.content;
        }
      }
    },
    filters:{
    },
    methods: {
      test(info){
        //this.$cs.l('test', info)
        this.studentFound = info.data
      },
        getSubject(i)  {
          const a = this.subjects.filter(s => s.subjectid == i);
          if (a.length) return "AWARDS -------- " + a[0].subjectname;
          return "AWA - " + i;
        },
        progress(s){
          if (s==true) {
            this.progressShow = true; 
          } else {
            this.progressShow = false;
          }
        },
        allocate() { 
            this.edit = {chapterid:1, type:1,detail1:'stuff', description:' longer ', orderid: 5};
            this.editDialog = true;
            this.editMode = 'add';
        },
        editCard(id) {
            let idx = this.content.findIndex(ele => ele.storyid == id);
            if (idx == -1) {
                alert(id + ' not found');
                return;
            }
            this.edit = this.content[idx];
            zmlConfig.cl(idx, this.edit);
            this.editDialog = true;
            this.editMode = 'update';
        },
        lowerOrder(id) {
           if (id < 2) {
               alert('Order is low enough');
               return;
           }
           let ts = {};
           ts.task = 'PlainSql';                  
           ts.sql = 'update dkhs_story set orderid = orderid-1 where storyid = ' + id;
           this.progress(true);
           zmlFetch(ts, this.afterUpdate);   
        },
        increaseOrder(id) {
           let ts = {};
           ts.task = 'PlainSql';                  
           ts.sql = 'update dkhs_story set orderid = orderid + 1 where storyid = ' + id;
           this.progress(true);
           zmlFetch(ts, this.afterUpdate);   
        },
        saveData() {
           let ts = {};
           ts.data = this.edit;
           ts.mode = this.editMode;
           if (this.editMode == 'add')  {
              ts.task = 'insertStory';
           } else {
              ts.task = 'updateStory';
           }
           this.progress(true);
           zmlFetch(ts, this.afterUpdate);   
        },
        afterUpdate(response) {
            zmlConfig.cl('AfterUpdate:',response);
            this.editDialog = false;
            this.loadData();
        },
        showData(response) {
            zmlConfig.cl('content=' , response);
            this.content = response;
            this.content.sort( (c,d) => c.orderid - d.orderid );
            zmlFetch({task: 'PlainSql', sql: 'select * from dkhs_subject'}, this.saveSubjects);   
        },
        saveSubjects(response) {
          this.subjects = response;
          this.progress(false);
        },        
        loadData() {
           this.progress(true);          
           let ts = {};
           ts.sql = 'select * from dkhs_story';
           ts.task = 'PlainSql';
           zmlConfig.cl(ts);
           zmlFetch(ts, this.showData);

           ts = {};
           ts = {task:'getAllStories'};
           zmlFetch(ts, this.loadAllStories);
        },
        loadAllStories(response) {
          this.allStories = response;
        },
        storyFilter(storymainid){
          //this.$cs.l('set storyFilter to : ', storymainid)
          this.chapterFilter = storymainid
        },

    },
    mounted: function () {
        zmlConfig.cl('Mount:StoryEdit');
        this.loadData();
    }
  }
</script>