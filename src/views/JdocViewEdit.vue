<template>
<!-- This is a data processor - as little code as possible to do as much as possible.
     We need a "dataObj" object, with all insert, update, etc code, and we need to define the fieldnames that we will use.
     We can theoretically get away without fields, but then we can only view - and we will have to create headers like in util.js
     1. we assign one of the dataObjects to "list", this.list
     2. we assign an js function "doSomething" to execute commands via ZmlF package
     3. all the stuff happening, happens in this.list.
     4. we can get progress, errorcodes, actions, responses, fields, keyfields, status and a description from there.
     5. all of the above can also be stored in the database, will do that later.
     6. each list has a array of actions that can happen on it. Some has refresh, other delete, insert update, refresh
     7.
  -->
  <v-container fluid>
    <base-tool toolbarName="List Template"
            :background="true"
            :back="true"
  >
      <!-- <v-btn icon @click="doPrint"><v-icon> mdi-printer</v-icon>  </v-btn> -->
      <!-- <v-btn class="ma-2" @click="showPrint = true"> Export </v-btn> -->
      <v-btn icon class="ma-2" @click="refresh()"> <v-icon> mdi-refresh </v-icon> </v-btn>
  </base-tool>

  <v-btn v-for="l in lists" :key="l.id" @click="swopList(l.id)">
    {{ l.id }} {{ l.desc}}
  </v-btn>
  <v-sheet v-if="list.desc">
  <!-- We hide everything in the sheet, until we linked our list to an object - otherwise lots of errors -->
      <v-progress-linear :active="list.progress" :indeterminate="list.progress" color="grey lighten-1" />
      <base-button-dialog class="ma-2" iconName="mdi-information"
                       buttonText="" color="info" infoTitle="DB STatus"
      >
          <ul>
          <li>DB: {{ zmlF.showDBError (list.response) }}</li>
          <li>FeedB: {{ zmlF.showDBError (list.feedback) }}</li>
          <li>good?: {{ zmlF.isGoodData(list.response) }}</li>
          <li>wd  : {{ list.workDone }}</li>
          <li>wds  : {{ list.status(list.workDone) }}</li>
          <li>act : {{ list.action }}</li>
          <li>options : {{ list.actions }}</li>
          <li>keys : {{ list.keyFields }}</li>
          </ul>

      </base-button-dialog>
         <v-text-field v-model="list.search" label="Search" clearable />
         <base-table-edit
            :tList="list.response"
            :tHeading="`${list.desc}  ( Records : ${list.response.length}  )`"
            bHeading="homework, mondeling, etc..."
            @update="tableAction('update',$event)"
            @delete="tableAction('delete',$event)"
            @insert="tableAction('insert')"
         >
         <template v-slot:action>
          <v-checkbox v-model="test" label="A Test to see if JSON Struct is fine" />
         </template>
         </base-table-edit>
      <v-dialog v-model="showEdit" scrollable max-width="400">
        <v-card v-if="list.id == 1">
            <v-card-text>
                <v-text-field v-model="rec.id" label="id" :disabled="list.action == 'update'" />
                <v-text-field v-model="rec.name" label="name"  />
                <v-textarea v-model="rec.jdocstructure" label="struct" />
            </v-card-text>
            <v-card-actions>
                <v-btn @click="saveRec(0)"> Save </v-btn>
            </v-card-actions>
        </v-card>
        <v-card v-if="list.id == 2">
            <v-card-text>
                <v-text-field v-model="rec.idDate" label="id" :disabled="list.action == 'update'" />
                <v-text-field v-model="rec.dayno" label="DayNo"  />
                <v-text-field v-model="rec.day_name" label="dayName" :disabled="list.action == 'update'" />
                <v-text-field v-model="rec.month_name" label="month" :disabled="list.action == 'update'" />
            </v-card-text>
            <v-card-actions>
                <v-btn @click="saveRec(0)"> {{ this.list.action }}</v-btn>
            </v-card-actions>
        </v-card>
        <v-card v-if="list.id == 3">
            <v-card-text>
                <v-text-field v-model="rec.id" label="id" :disabled="list.action == 'update'" />
                <v-text-field v-model="rec.description" label="Description" :disabled="list.action == 'update'" />
                <v-text-field v-model="rec.periodname" label="Period" :disabled="list.action == 'update'" />
                <v-text-field v-model="rec.starttime" label="start Time" />
                <v-text-field v-model="rec.endtime" label="end Time" />
                <v-text-field v-model="rec.length" label="length"  />
            </v-card-text>
            <v-card-actions>
                <v-btn @click="saveRec(0)"> {{ this.list.action }}</v-btn>
            </v-card-actions>
        </v-card>

      </v-dialog>
  </v-sheet>
  <v-card v-else>
    <v-btn @click="tryInitialize"> init </v-btn>
  </v-card>

      <!-- {{ list }} -->
  </v-container>
</template>

<script>
import { dataObj } from '@/views/dataObj.js'
import { getters } from  "@/api/store"
import { zmlF } from '@/api/zmlF.js'
import BaseTableEdit from    '@/components/base/baseTableEdit'
import baseTool from '@/components/base/baseTool.vue'
import baseButtonDialog from "@/components/base/baseButtonDialog.vue"
export default {
    name:"JDocViewEdit",
    components: {
        BaseTableEdit
      , baseTool
      , baseButtonDialog
    },
    props: [],
    data () {
      return {
        getZml: getters.getState({ object:"gZml" }),
        zmlF: zmlF,
        lists:[dataObj.tickList, dataObj.dayList, dataObj.periodList],
        list: {desc:''},
        showEdit: false,
        rec:{},
        test: false
    }},
   computed: {
    listFilter() {
        if (this.list && zmlF.isGoodData(this.list.response)) {
            return this.list.response
        } else {
            return []
        }
    },
    srchFilter() {
        return this.listFilter.filter(e => Object.values(e).join().toLowerCase().includes(this.list.search.toLowerCase()) )
    }
   },
   created() {
    this.tryInitialize()
   },
   mounted() {
    //this.list = dataObj.ticklist
    //console.log('is thislist acrtually here??', this.list)
    //console.log('Mounted', this.$options.name, dataObj.ticklist)
    //console.log('MountedAA', this.$options.name, this.list)
    //console.log('MountedBB', this.$options.name, dataObj)
    console.log('MountedBB', this.$options.name, zmlF)

   },
   methods: {
    swopList(id) {
      console.log('we should be swopping from ', this.list.id, ' to ', id)
      if (this.list.id == id) return
      this.list = this.lists[id-1]
      // the list processor is a local procedure, and need to be initialized in this "this" environment.
      this.list.processor = (action,element) => {this.doSomething(action,element)}
      // vue is smart enough to keep the data if we used this list before, if empty we do auto refresh here.
      if (!this.list.response.length) this.list.processor('refresh', this.list)
    },
    tryInitialize() {
      //We start with the first list automatically
      this.swopList(1)
    },
    refresh(id) {
      console.log('refresh:', id)
       let ele = this.list
       ele.action = 'refresh'
       //this.doSomething(ele.action,ele)
       this.list.processor(ele.action,this.list)
    },
     saveRec() {
        let ele = this.list
        ele.data = {}
        ele.data.bind = {}
        Object.entries(this.rec).forEach( ([key, value]) => {
          ele.data[key] = value
        })
        console.log('does ele.data contain everythin in this.rec? ', ele.data, this.rec)
        //ele.data = {id: this.rec.id, jdocstructure: this.rec.jdocstructure, name: this.rec.name}
        if (ele.action == 'insert') {
          let sqlElement = ele.sql.find(e => e.action == ele.action)
          if (sqlElement == undefined) {
            alert('We do not have an ' + ele.action + ' mechanism for ' + ele.desc)
            console.log('We do not have an', ele.action,'mechanism for ' + ele.desc)
            return
          }
          //Important! Only bind variables that will be used: Otherwise Errorcode 91 : HY093 on insert we bind all values, and we make key's null
          Object.entries(this.rec).forEach( ([key, value]) => {
            // We bind all the values, except keys, they become null
            const isKey = ele.keyFields.find(e => e == key)
            //Do not bind any keyvalues - they will be inserted as null
            console.log('iskey? ')
            if (!isKey) ele.data.bind[key] = value
            console.log('done? ')
          })
          console.log('out? ')
        }



        if (ele.action == 'update') {
          console.log('fields',ele.fields)
          let sqlElement = ele.sql.find(e => e.action == ele.action)
          console.log('actionSqlEle',sqlElement)
          if (sqlElement == undefined) {
            alert('We do not have an ' + ele.action + ' mechanism for ' + ele.desc)
            console.log('Update:We do not have an', ele.action,'mechanism for ' + ele.desc)
            return
          }
          //Important! Only bind variables that will be used: Otherwise Errorcode 91 : HY093
          Object.entries(this.rec).forEach( ([key, value]) => {
            console.log('Update:step thru', key, value, ele.fields)
            const fieldElement = ele.fields.find(e => e.value == key)
            console.log('Update:step thruassssssssss', fieldElement)
            if (fieldElement != undefined) {
              console.log('Update:check for edit = true in ', fieldElement.edit, fieldElement['edit'])
               if ( fieldElement['edit'] != undefined && fieldElement['edit'] == true ) {
                ele.data.bind[key] = value
                console.log('Update:success')
               }
               console.log('Update:still in')
            }
            const isKey = ele.keyFields.find(e => e == key)
            console.log('Update:step keyssssss', isKey)
            if (isKey) ele.data.bind[key] = value
            console.log('Update:our binds before next one == ', ele.data.bind)
          })
        }
        if (ele.action == 'delete') {
          alert('this is a delete!!! - not happening')
          return
          //It is a delete, so we just need keyfield data
          // Object.entries(this.rec).forEach( ([key, value]) => {
          //   if (ele.keyFields.includes(key))  ele.data[key] = value
          // })
          // //We will only bind keyvalues
          // ele.data.bind = {}
          // ele.keyFields.forEach(key => ele.data.bind[key] = this.rec[key])
          // console.log('We will delete - here are bindd fields = see if it works ', ele.data.bind , 'and data', ele.data)
        }
        console.log('start listproc')
        this.list.processor(ele.action,ele)
        this.showEdit = false
    },
     processAllData(response) {
       console.warn('processAllData = Data was loaded in storage, and passed to me as well.',response.length||0)
     },
     loadError(error) {
        console.log('error reported in loadError :', error)
     },
     doSomething(action,dataO) {
        console.warn('Here we can Do Something with object',action,this.list.actions.indexOf(action), dataO)
        if (this.list.actions.indexOf(action) != -1) {
           dataO.action = action
           zmlF.ZF(dataO, this.processAllData, this.loadError);
        } else {
          alert ('this ' + action + ' is not in our list of actions for ' + this.list.desc)
        }

     },
     tableAction(action,item) {
        if (this.test) {
            alert('do someting else...Checking if JDOC Struc is valid..')
            let x = JSON.parse(item.jdocstructure)
            console.log('is this valid?', x)
            return
        }
        this.$cs.l('back at base - Action:item:',action, item )
        if (this.list.actions.indexOf(action) == -1) {
           alert (action + ' is not yet supported for ' + this.list.desc)
           return
        }
        switch (action) {
        case 'insert':
            this.list.action = 'insert'
            this.rec = {}
            this.showEdit = true
            break
        case 'update':
        {
            this.rec  = this.list.response.find(e => {
              let found = []
              this.list.keyFields.forEach((kname,i) => {
                  if ( e[kname] == item[kname] ) { found[i] = true } else  { found[i] = false }
              })
              let sumTF = found.reduce((t, f) => t + f, 0)
              return sumTF
            })
           // this.rec  = this.list.response.find(e => this.list.keyFields.forEach(keyname => e[keyname] == item[keyname]))

            if (this.rec == undefined) {
                alert (this.list.desc + ': We could not find the correct record.')
            }
            this.list.action = action
            this.showEdit = true
            break
        }
        case 'delete':
            //zml:good:tricky way to step thru and compare all keyfields
            this.rec  = this.list.response.find(e => {
              let found = []
              this.list.keyFields.forEach((kname,i) => {
                  if ( e[kname] == item[kname] ) { found[i] = true } else  { found[i] = false }
              })
              let sumTF = found.reduce((t, f) => t + f, 0)
              return sumTF
            })

            this.list.action = action
            this.showEdit = true
            break

        default: alert('we do not know what to do?')
        }
        // this.$router.push({ name: 'EmailDeliveryReport', params: {deliverid: item.item.deliveryid} })
     },
   }
}
</script>
