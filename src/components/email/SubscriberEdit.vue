<template>
 <v-container>
           <v-text-field
             v-model="search"
             label="Search for any email address"
             single-line
             xxxhide-details
             solo
             append-icon="mdi-magnify"
             title="Search for another email"
           /> 
        <p>If the same email appear multiple times, it is usually linked to more than one group.
            This will be fixed later - since we want to link emails to different groups rather than have double subscribers.</p>
            
        <v-data-table
          :headers="subListHeader"
          :items="subList"
          :items-per-page="15"
          class="elevation-2"
          :loading="loading"
          @click:row="clickOnSubRow">
          <template v-slot:[`item.actions`]="{ item }">
            <v-icon small class="mr-2" @click="edit(item)">mdi-pencil</v-icon>
          </template>          
            <template v-slot:[`footer.page-text`]>
              <v-btn icon @click="allocate()"><v-icon >mdi-table-plus</v-icon></v-btn>
            </template>

       </v-data-table>

<!-- Edit Subscriber -->
 <v-dialog v-model="showEmail">
  <v-card color="blue" v-if="showEmail">
    <!-- <v-form v-if="mySchema &&  Object.keys(mySchema).length > 1" ref="form"> -->
        <v-card-title class="ma-2 justify-center text-center" > 
            <v-card class="mx-auto">
           Admission Number : {{this.subList[0].impnumber }}, grade : {{this.subList[0].extra }} 
            </v-card>
        </v-card-title>
        <v-card-text>
    <v-form-base 
        autocomplete="off"
        id="myform"
        :model="myModel"
        :schema="mySchema"
        :col=12
        @click="test"
        @blur="test"
    >
    </v-form-base>
    </v-card-text>
    <v-card-actions>
      <v-spacer />
      <v-btn @click="showEmail = false" class="ma-2"> Close </v-btn>
      <v-btn @click="saveAnyChanges" class="ma-2" primary> Save </v-btn>
    </v-card-actions>
  </v-card>
 </v-dialog>
</v-container>
</template>

<script>
//import FrontJsonToCsv from '@/api/csv/FrontJsonToCsv.vue'  -- maybe later for export
import vFormBase from "@/components/vfbase/vFormBase"
import { infoSnackbar } from '@/api/GlobalActions';
import { zData } from "@/api/zGetBackgroundData.js"
import { emailModel } from "./myModels.js"
import { debounce } from '@/api/timer';
export default {
    name:'SubscriberEdit',
    components:{vFormBase},
    props:['subid'],
    data: () => ({
      debounce:debounce,
      search:null,
      myModel: {},
      myModelBefore: {},
      mySchema:{},
      api:'https://kuiliesonline.co.za/api/dkhs/dkhs.php',  
      loading:false,
      zData:zData,
      showEmail:false,
      subListRecord:{impnumber:'', extra:'', email:'', inserted:'',name:'', description:'', subid:''},
      subList:[{impnumber:'', extra:'', email:'', inserted:'',name:'', description:'', subid:''}],
      subListHeader:[
          {text: 'email',    align: 'start',  value: 'email' },
          {text: 'Inserted', align: 'start',  value: 'insertdate' },
          {text: 'impNumber',align: 'start',  value: 'impnumber' },
          {text: 'name'    , align: 'start',  value: 'name' },
          {text: 'OptOut',                    value: 'description' },
          {text: 'Changed',  align: 'start',  value: 'changedate' },
          {text: 'Note',     align: 'start',  value: 'extra' },
          {text: 'Group',    align: 'start',  value: 'grpname' },
          {text: 'SubID',    align: 'start',  value: 'subid' },
          {text: 'Actions',  sortable:false,  value: "actions" },
      ],
    }),
    methods:{
      //Also see https://forum.vuejs.org/t/how-to-delay-watcher-method-call-on-an-input-field/34321/2  
      saveAnyChanges: debounce(function() 
      {
            infoSnackbar('Looking for ' + this.search)
            console.log(this.search)
            this.loadSubEmail()
      }, 600),
      allocate(e) {
           console.log('test allocate click on form', e)
      },
      loadSubEmail() {
          if (this.search == '') {
              this.loadSub()
              return
          }
          let sqlStatement = `SELECT s.email, s.name, s.extra ,ifnull(m.description,'Active') description, impnumber, insertdate 
                                   , changedate, extra, s.subid, grpname
                              FROM m_subscriber s 
                              left join m_out m on s.outid = m.outid 
                              left join m_grouplink g on s.subid = g.subid 
                              left join m_group a on a.grpid = g.grpid 
                              WHERE email like '%${this.search}%'`
          zData.loadSql(this.loading, sqlStatement, this.assignSubData, this.api)        
      },

      loadSub() {
          let sqlStatement = `SELECT s.email, s.name, s.extra ,ifnull(m.description,'Active') description, impnumber, insertdate 
                                   , changedate, extra, s.subid, grpname
                              FROM m_subscriber s 
                              left join m_out m on s.outid = m.outid 
                              left join m_grouplink g on s.subid = g.subid 
                              left join m_group a on a.grpid = g.grpid 
                              WHERE email in 
                              (select email from m_subscriber where subid = ${this.subid})`
          zData.loadSql(this.loading, sqlStatement, this.assignSubData, this.api)        
      },
      assignSubData(response) {
        if (response.length == 0 || response.error) {
          infoSnackbar('Some error occured fetching subscriber!','red')
          return
        }
          console.log('assign subdata', response)
          if (response.length > 0) {
            this.subList = response
            this.mySchema = emailModel.mySchema
            this.myModel = emailModel.myModel
            console.log(emailModel.myModel)
          }
      },
      edit(currentRowRecord) {
          this.subListRecord = currentRowRecord
          console.log('what info do we get here?',currentRowRecord)
          this.myModel.schoolno = this.subListRecord.impnumber
          this.myModel.name = this.subListRecord.name
          this.myModel.email = this.subListRecord.email
          this.myModel.grade = this.subListRecord.extra
          this.myModel.optout = this.subListRecord.description
          this.myModelBefore = JSON.stringify(this.myModel)
          //emailModel.assignModel(t)
          this.showEmail = true
      },
      clickOnSubRow(currentRowRecord) {
          this.$emit('subscriberChange',currentRowRecord.subid)
      },      
       
    },
    mounted() {
        console.log('start : ', this.$options.name)
        this.subList.length = 0
        this.loadSub()
    },
    watch:{
        search() { 
            //debounce(this.saveAnyChanges(), 9100)
            this.saveAnyChanges()
        },
        
        showEmail() {
           if (this.showEmail == false)  {
             infoSnackbar('check for changes...')
            //    if (this.myModelBefore != JSON.stringify(this.myModel)) {
            //       infoSnackbar('something changed')
            //       console.log('what changed?...', this.myModel)
            //    } else {
            //       infoSnackbar('no changes...')
            //       console.log('no changes...', this.myModel)
            //    }
           }
        }
    }
}
</script>