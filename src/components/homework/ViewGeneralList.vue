This was an aborted attempt to direct edit json data stored in varchar on server.
But we will try again.

<template>
  <div>
    <base-tool :toolbarName="toolbarName"
            :background="false"
            :back="true"
  >
      <!-- <v-btn icon @click="doPrint"><v-icon> mdi-printer</v-icon>  </v-btn> -->
      <!-- <v-btn class="ma-2" @click="showPrint = true"> Export </v-btn> -->
      <v-btn class="ma-2" @click="loadAllData"> Refresh </v-btn>
      <v-btn class="ma-2" @click="showUseForm = true"> New List </v-btn>
  </base-tool>

      <v-progress-linear :active="progress" :indeterminate="progress" color="grey lighten-1" />
         <base-table-edit
                     :tList="tableEntries"
                     :tHeading="tHeading"
                     bHeading="Double click an item to delve deeper."
                     @edit="tableSelect"
                     @select="tableOneClick"
         />

       <!-- <v-btn x-small v-if="t.jdocstructure" @click="useList(t.id)" title="Edit Listname or Shared" color="primary" class="ma-2 pa-2"> Use </v-btn> -->

      <!-- <v-btn @click="loadAllData"
             title="Click here to load delivery summary."
      > Refresh Email List </v-btn> -->

    <v-dialog v-model="showUseForm"  :fullscreen="$vuetify.breakpoint.mobile" width="80%">
      <v-card  class="ma-2 pa-2">
        <v-card-title> {{ curRec.listname }}</v-card-title>
        <v-card-text wrap column align-content-start justify-space-around>
         <v-select
            sm5
            v-model="jdocMaybeRec"
            :items="tickList"
            attach
            chips
            small-chips
            outlined
            :label="jdocMaybeRec.description || 'Select a List'"
         >
          <template v-slot:item="{ item }">
             <span> {{ item.name }} - <small>{{ item.description }}</small> </span>
          </template>
          <template v-slot:selection="{ item }">
           <v-chip>
            <span>{{ item.name }} </span>
           </v-chip>
          </template>
         </v-select>
       <v-flex sm5>
       <v-autocomplete
        v-model="location"
        :items="locationList"
        label="Location"
        prepend-inner-icon="mdi-office-building"
        outlined
        clearable
        dense
       >
        <template slot="selection" slot-scope="{item}">  <!-- DISPLAY , item-text -->
         {{ item }}
       </template>
       </v-autocomplete>
       </v-flex>
       <v-flex sm5>
         <v-combobox
           sm4
           class="ma-1"
           v-model="responsiblePerson"
           :items="staffList"
           item-value="persid"
           item-text="name"
           label="Responsible Person"
           prepend-inner-icon="mdi-human"
           outlined
           clearable
           dense
         />

       </v-flex>
         <v-flex sm12>
         <v-text-field v-model="curRec.listname" outlined label="List Name" title="You're welcome to change it" /> {{ jdocMaybeRec.description }}
         </v-flex>
         <v-flex sm4>
         <v-text-field v-model="curRec.listdate" outlined label="List Date" title="You're welcome to change it" />
         </v-flex>

         <v-flex sm4>
         <v-text-field v-model="curRec.note" outlined label="Note" title="You're welcome to change it" />
         </v-flex>
         <v-flex sm4>
         <v-text-field readonly v-model="curRec.options" label="Options" dense title="These are the default options"/>
         </v-flex>
         <v-flex sm4>
          <v-text-field xs6 readonly v-model="curRec.userid" label="userid"  dense />
         </v-flex>
         <v-flex sm4>
         <v-text-field xs6 readonly v-model="curRec.classlistid" label="classlistid"  dense />
         </v-flex>
        </v-card-text>
        <v-card-actions>
          <v-btn class="ma-2" small @click="doUseTask(curRec)"> Save and Show Students</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>


  </div>
</template>

<script>
/*
import { getters } from  "@/api/store"
import BaseTableEdit from    '@/components/base/baseTableEdit'
import baseTool from '@/components/base/baseTool.vue'
import { clWork } from "@/components/homework/ClassListWork.js"
export default {
    name: 'GTLIST',
    components: {
        BaseTableEdit
      , baseTool
    },
    props: [],
    data () {
      return {
        getZml: getters.getState({ object:"gZml" }),
        persMenemonic: getters.getState({ object: "gZml" }).persMenemonic,
        login: getters.getState({ object: "gZml" }).login,
        toolbarName:"General Teacher Lists",
        tableName:"GT List",
        uniqid:0,
        progress:false,
        timerHandle:null,
        dataSequence:false,
        tableEntries:[],
        classList:{},
        genList:{},
        tickList:[],

        defaultListname:'Please type your listname here',
        useParms:[],
        jdocMaybeRec:{},
        showUseForm: false,
        curRec:{listname:'sdfsdfsdfsdfsdfsdf'},
        staffList:[],
        responsiblePerson:'',
        locationList:[],
        location:'',
       }

   },
   computed: {
    tHeading() {
        return `${this.tableName} Summary  ( Records :  ${this.tableEntries.length} )`
    },
   },
   mounted() {
    this.loadAllData()
   },

   methods: {
     tableOneClick(item) {
         console.log('single click,' , item)
         this.curRec = item
         this.showUseForm = true
     },
     tableSelect(evt) {
       if ( !('classlistid' in evt)) alert('we have NO classlist')
       this.genList = evt
       this.progress = true;
       //alert('here we open the filled in list - see StudentGeneralList')
       clWork.geGentList(evt.classlistid,this.listLoaded)
       clWork.getGetStudentsInList(evt.classlistid,this.studentsLoaded)
       return
     },
     listLoaded(response) {
       this.classList =  response[0]
       let objArr = JSON.parse(this.classList.jdocstructure)
       this.checkList = objArr[0].options
       this.progress = false;
     },
     studentsLoaded(response) {
      this.progress = false
      let studentList = response
      console.log(studentList)
      this.$router.push({ name: 'GeneralList'
                      , params: {studentList:studentList, listDetail: this.genList, checkList: this.checkList} })
     },
     loadAllData() {
       console.log('loadAllData')
       this.progress = true;
       this.persMenemonic.forEach(e => {
          this.staffList.push({name:e.user_name + ' ' + e.surname + ' ' + e.name.substr(0,1), persid: e.persid})
          if (e.user_name == this.login.username) {
             this.responsiblePerson = {name:e.user_name + ' ' + e.surname + ' ' + e.name.substr(0,1), persid: e.persid}
          }
          if (e.room && e.room != 'WEG') {
            this.locationList.push(e.room)
          }
       });

       clWork.getTheTickList(this.processJDoc)
       clWork.getAllGeneralLists(this.processAllData)
     },
     processJDoc(response) {
       this.tickList = response
       this.tickList.forEach(e => {
          const objArr = JSON.parse(e.jdocstructure)
          e.checkList = objArr[0].options
          e.description = objArr[0].description
       });
     },
     processAllData(response) {
       this.$cs.l('processAllData')
       this.tableEntries = response
       this.progress = false;
     },


//----------------------------------------------------------------------------------
    useList(listID) {
      this.rec = this.tList.find(e => e.id == listID)
      if (this.rec.id == listID) {
        //We got the list, now we process the jdocstruct to see what we can do with it...
        const obj = JSON.parse(this.rec.jdocstructure)
      //   /* Also see : reviver
      //   const obj = JSON.parse(text, function (key, value) {
      //   if (key == "birth") {   you can do something with each field as jou parse it...
      //     return new Date(value);
      //   } else {
      //     return value;
      //   }
      //   });
      //   console.log(typeof obj, obj)
      //   this.useParms = JSON.parse(this.rec.jdocstructure)
      //   console.log(typeof this.useParms, this.useParms)
      //   this.showUseForm = true
      // }
    },
    doUseTask(r) {
      console.log('use task::', r, this.rec,'callsomefunction')
      this.rec.userid = this.getZml.login.userid
      clWork.addGenList(r, this.rec,this.generalListCreated)
     // fetch all the students, fill in
    },
    generalListCreated(response) {
      console.log('generalListCreated',response)
      alert('general list created - now we need to load students')
    },

   }
}
*/
</script>
