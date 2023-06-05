<template>
<div>
<v-container fluid v-if="['admin','teacher'].includes(getZml.login.type) == false">
    You are not logged in, or you are not a teacher!
</v-container>


<v-container fluid id="printMe">
  <v-toolbar   row  wrap color="primary">
      Merit System Edit Text
      <v-spacer />
      <v-btn icon @click="printMerit"> <v-icon> mdi-printer </v-icon></v-btn>
      <v-back />
  </v-toolbar>

<p class="ma-3"> Double click to go deeper, or press Edit button to change title, info or points.  </p>
  <merit-form  v-if="id && id > 0"
              :id="id"
              @done="doneEditing" />
  <v-divider />

  <v-card class="noprint">{{ treeString }}</v-card>
  <v-card v-html="printHeader('Merit Table')" class="hide"></v-card>
   <v-data-table  v-if="aTable.length"
     :headers="headers"
     :items="tableItemFilter"
     @dblclick:row.prevent="meritDblClick"
     mobile-breakpoint="0"
   >
      <template v-slot:[`footer.page-text`]>
       <v-btn v-if="index != 0"
             @click="backClick()"
             align="center" class="ma-2 pa-2" >
          back
      </v-btn>
      </template>
      <template v-slot:[`item.points`]="{ item }">
        <div v-if="item.forward == 0"> {{ item.points}} </div>
      </template>
      <template v-slot:[`item.description`]="{ item }"  >
       <template v-if="!$vuetify.breakpoint.mobile">
         {{ item.description }}
        </template>
      </template>
      <template v-slot:[`item.actions`]="{ item }">
        <v-btn-toggle v-model="toggle">
         <v-btn icon x-small
                @click="meritDblClick($event,item)"
                title="Delve">
             <v-icon small color="red" class="my-1">mdi-arrow-right-circle-outline</v-icon>
         </v-btn>
         <!-- <v-btn  icon x-small
                @click="retrieveForDelete(item)"
                title="Delete">
             <v-icon small color="red" class="my-1">mdi-delete</v-icon>
         </v-btn> -->
         <v-btn  x-small icon
                @click="retrieveForEdit(item)"
                title="Edit">
             <v-icon small color="green" class="my-1">mdi-circle-edit-outline</v-icon>
         </v-btn>

        </v-btn-toggle>
      </template>
   </v-data-table>
   <!-- <v-data-table  v-if="aTable.length"
     :headers="aTableHeaderForPrint"
     :items="aTable"
     mobile-breakpoint="0"
   /> -->


</v-container>
</div>
</template>

<docs>
Here is some documentation
</docs>
<script>
import { getters } from "@/api/store"
import { zData } from "@/api/zGetBackgroundData.js"
import { infoSnackbar } from "@/api/GlobalActions"
import MeritForm from '@/components/merit/MeritForm.vue'
import { printHeader, printPage, printJSON } from "@/api/zmlPrint.js"
import VBack from '@/components/base/VBack.vue'
export default {
    name: 'MeritTable',
    components:{
      MeritForm
     ,VBack
    },
    data () {
      return {
        getZml: getters.getState({ object: "gZml" }),
        printHeader: printHeader,
        drawer: false,
        showMeritPoint: false,
        docs:  this.__docs,
        id:0,
        action:'',
        toggle:'',
        index: 0,  //start with first menu, on v-datatable
        aTable: [], // we keep all data from sql here
        treeString: '', //display our selection
        headers: [{ text:"the name", value: "title", align: "left"},
                 //{ text:"back", value: "back", align: "left"},
                 //{ text:"forward", value: "forward", align: "left"},
                 { text:"", value: "points", align: "center"},
                 { text:"", value: "description", align: "left"},
                 { text:"", value: "actions", align: "right"}],
        aTableHeaderForPrint: [{ text:"id", value: "id", align: "left"}
                              ,{ text:"the name", value: "title", align: "left"}
                              ,{ text:"", value: "description", align: "left"}
                              ,{ text:"f", value: "forward", align: "left"}
                              ,{ text:"b", value: "back", align: "left"}

                              ]
    }},
    computed: {
       tableItemFilter() {
        // console.log('iFilt=', this.index)
        if (!this.aTable.length) return []
          return this.aTable.filter(e => {
                    if (e.back == this.index) { return true } else { return false }
                 })
       },
    },
    methods: {
      printMerit() {
        printJSON(this.aTable, this.aTableHeaderForPrint, 'Merit List')
        if (this.index==110)  printPage('printMe', false)
      },
      doneEditing(e) {
        console.log('afterEdit:', e)
        this.id = 0
        this.initialize()
      },
      retrieveForDelete(i) {
        this.action = 'Delete'
        console.log('retrieveForDelete:',i)
        },
      retrieveForEdit(i) {
        this.action = 'Edit'
        console.log('retrieveForEdit',i)
        this.id = i.id
        console.log('CurrentRec was loaded',this.id)
        },
      chgSubMenu(i,tag) {
        if (tag.forward == 0) {
          //we reach a workable tag
          infoSnackbar('we reached the end - ask for student, and do assignment here - can enter many students at a time, or import?')
        }
        //Get the record, where our id is in back list
        let id = this.aTable [this.aTable.findIndex(e => e.id == tag.forward)]
        console.log(id)

      },
       backClick() {
         this.treeString = ''
         this.index = 0
      },
      meritDblClick(e,i) {
        //going forward
        // When we click on the icon, and not use dblclick, we need to define i.item as i
        // (Diffenent info is passed down)
        console.log(e,i)
        if (!i.item) i.item = i

        this.treeString += i.item.title + (i.item.forward == 0 ? '.' : ', ')
        if (i.item.forward == 0) {
          infoSnackbar('we reached the end - ask for student, and do assignment here - can enter many students at a time, or import?')
          return
        }
        let id = this.aTable [this.aTable.findIndex(e => e.id == i.item.forward)]
        if (id == -1) alert('we have a problem with out indexes')
        this.index = id.back
      },
      initialize(data) {
        //Although we have the data, we rather read from store
        console.log('INITIALIZE START')
        if (this.getZml.meritLevel.length < 10) {
           this.aTable = data
           console.log('still too small',this.getZml.meritLevel)
        } else {
           this.aTable = this.getZml.meritLevel
           console.log('BIG ENOUGH',this.getZml.meritLevel)
        }
      },
    },
    mounted() {
      if (this.getZml.meritLevel.length < 10) {
            console.timeLog('we need to load it...')
            let sqlStatement = `SELECT * from dkhs_meritlevel`
            zData.loadSql(this.loading, sqlStatement,this.initialize)
            console.timeLog('timer','mm')
      } else {
           console.timeLog('already there....')
           this.aTable = this.getZml.meritLevel
      }
    },
  }
</script>
