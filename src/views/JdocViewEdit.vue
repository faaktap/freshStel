<template>
  <v-container fluid>
    <base-tool toolbarName="General List Questions Template"
            :background="false"
            :back="true"
  >
      <!-- <v-btn icon @click="doPrint"><v-icon> mdi-printer</v-icon>  </v-btn> -->
      <!-- <v-btn class="ma-2" @click="showPrint = true"> Export </v-btn> -->
      <v-btn icon class="ma-2" @click="refresh(0)"> <v-icon> mdi-refresh </v-icon> </v-btn>
  </base-tool>

      <v-progress-linear :active="list.progress" :indeterminate="list.progress" color="grey lighten-1" />
      <base-button-dialog class="ma-2"
                       iconName="mdi-information"
                       buttonText=""
                       color="info"
                       infoTitle="DB STatus"
      >
          <ul>
          <li>DB: {{ zmlF.showDBError (list.response) }}</li>
          <li>FeedB: {{ zmlF.showDBError (list.feedback) }}</li>
          <li>good?: {{ zmlF.isGoodData(list.response) }}</li>
          <li>wd  : {{ list.workDone }}</li>
          <li>wds  : {{ list.status() }}</li>
          <li>act : {{ list.action }}</li>
          </ul>
          <!-- {{ getData.response }} -->

      </base-button-dialog>
         <base-table-edit
            :tList="list.response"
            :tHeading="'General List Questions  ( Records : ' + list.response.length + ')'"
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
        <v-card>
            <v-card-text>
                <v-text-field v-model="rec.id" label="id" :readonly="list.action == 'update'" />
                <v-text-field v-model="rec.name" label="name"  />
                <v-textarea v-model="rec.jdocstructure" label="struct" />
            </v-card-text>
            <v-card-actions>
                <v-btn @click="saveRec(0)"> Save </v-btn>
            </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- {{ list }} -->
  </v-container>
</template>

<script>
import { getters } from  "@/api/store"
import { zmlF } from '@/api/zmlF.js'
import { dataObj } from '@/views/dataObj.js'
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
        zmlF:zmlF,
        list:dataObj.list,
        getZml: getters.getState({ object:"gZml" }),
        uniqid:0,
        timerHandle:null,
        dataSequence:false,
        showEdit:false,
        rec:{},
        test:false
    }},
   computed: {
    listFilter() {
        if (zmlF.isGoodData(this.list.response)) {
            return this.list.response
        } else {
            return []
        }
    }
   },
   created() {

   },
   mounted() {
    console.log('Mounted', this.$options.name)
   },
   methods: {
    refresh() {
       let ele = this.list
       ele.action = 'refresh'
       this.doSomething(ele.action,ele)
    },
     saveRec() {
        let ele = this.list
        ele.data = {id: this.rec.id, jdocstructure: this.rec.jdocstructure, name: this.rec.name}
        if (ele.action == 'insert') {
          //Important! Only bind variables that will be used: Otherwise Errorcode 91 : HY093
          ele.data.bind = {jdocstructure: this.rec.jdocstructure, name: this.rec.name}
        } else {
          //It is an update - should we check action?
          //Important! Only bind variables that will be used: Otherwise Errorcode 91 : HY093
          ele.data.bind = {id: this.rec.id, jdocstructure: this.rec.jdocstructure, name: this.rec.name}
        }
        this.doSomething(ele.action,ele)
        this.showEdit = false
    },
     processAllData(response) {
       console.warn('processAllData = Data was loaded in storage, and passed to me as well.',response.length||999)
     },
     loadError(error) {
        console.log('errir:', error)
     },
     doSomething(action,dataObject) {
        console.warn('Here we can Do Something with object',action,dataObject)
        dataObject.action = action
        zmlF.ZF(dataObject, this.processAllData, this.loadError);

     },
     tableAction(action,item) {
        if (this.test) {
            alert('do someting else...Checking if JDOC Struc is valid..')
            let x = JSON.parse(item.jdocstructure)
            console.log('is this valid?', x)
            return
        }
        this.$cs.l('back at base - Action:item:',action, item )
        switch (action) {
        case 'insert':
            this.list.action = 'insert'
            this.rec = {}
            this.showEdit = true
            break
        case 'update':
        {
            this.rec  = this.list.response.find(e => e.id == item.id)
            this.list.action = 'update'
            this.showEdit = true
            break
        }
        case 'delete':            alert('you wanna delete?'); break
        default: alert('we do not know what to do?')
        }
        // this.$router.push({ name: 'EmailDeliveryReport', params: {deliverid: item.item.deliveryid} })
     },
   }
}
</script>
