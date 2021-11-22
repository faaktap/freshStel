<template>
<v-container>

 <v-data-table
    :headers="emailListHeader"
    :items="emailList"
    :items-per-page="20"
    class="elevation-2"
    :loading="loading"
    @click:row="clickOnRow">
 </v-data-table>


<!-- Show a specific email, and allow to send again. -->
<v-dialog v-model="showEmail">
 <v-card color="blue" v-if="showEmail">
    <!-- <v-form v-if="mySchema &&  Object.keys(mySchema).length > 1" ref="form"> -->
        <v-card-title> 
            {{this.emailListRecord.deliveryid}} - {{this.emailListRecord.subject}}
        </v-card-title>
        <v-card-subtitle> 
             exta data to display
        </v-card-subtitle>
        <v-card-text>
            {{ myModel }}
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
    <v-btn @click="showEmail = false" class="ma-2"> Close </v-btn>
    <div v-for="a in attList" :key="a.attachid">
      <v-btn :href="a.htmlfilepath"  class="ma-2" target="_PDF"> {{ a.humanfilename }} 
      </v-btn>
    </div>
    <v-spacer />
    <v-btn @click="saveAnyChanges" class="ma-2" primary> Save </v-btn>
    </v-card-actions>
 </v-card>
</v-dialog>


 </v-container>
</template>

<script>
import vFormBase from "@/components/vfbase/vFormBase"
import { infoSnackbar } from '@/api/GlobalActions';
import { zData } from "@/api/zGetBackgroundData.js"
import { emailModel } from "./myModels.js"
export default {
    name:'EmailsSent',
    components:{vFormBase},
    props:['subid'],
    data: () => ({
      myModel: {},
      mySchema:{},
      api:'https://kuiliesonline.co.za/api/dkhs/dkhs.php',  
      loading:false,
      zData:zData,
      showResult:false,
      emailList:[],
      emailListRecord:{subject:'',deliveryid:0, status:'', sentdate:'', grpname:'', email:''},
      emailListHeader:[
          {text: 'id',         value: 'deliveryid' },
          {text: 'Subject',    value: 'subject' },
          {text: 'status',     value: 'status' },
          {text: 'sentdate',   value: 'sentdate' },
          {text: 'group',      value: 'grpname' },
          {text: 'email',      value: 'log' },
      ],
      email:null,
      showEmail:false,
      attList:[{attachid:'',humanfilename:'',htmlfilepath:'',status:'',serverfilepath:''}]
    }),
    methods:{
      saveAnyChanges() {
          infoSnackbar('Save any changes!')
      },
      test(e) {
           console.log('test click on form', e)
      },
      clickOnRow(e) {
          console.log('clicked on email', e)
          this.emailListRecord = e
          this.attList.length = 0
          if (this.email == null) {
              infoSnackbar('Email is empty!')
              return
          }
          infoSnackbar('fetch all the attachments for this deliveryid ' + e.deliveryid)
          let sqlStatement = `SELECT * from m_attachment where deliveryid = ${e.deliveryid}` 
          zData.loadSql(this.loading, sqlStatement, this.assignAttachmentData, this.api)
      },
      assignAttachmentData(response) {
          console.log('assig attachement', response)
          if (response.length) {
             this.attList = response
          }
          this.showEmail = true         
      },
      executeSql() {
        let sqlStatement = `SELECT d.subject,e.deliveryid, e.status, e.sentdate,g.grpname, e.log
                             FROM m_emailsent e
                             left join m_delivery d on d.deliveryid = e.deliveryid
                             left join m_grouplink l on l.subid = e.subid
                             left join m_group g on l.grpid = g.grpid
                             WHERE e.subid = ${this.subid}
                             order by e.deliveryid DESC`
        console.log('sql = ', sqlStatement)
          zData.loadSql(this.loading, sqlStatement, this.assignData, this.api)
      },        
      assignData(response) {
         this.emailList = response
      },
       
    },
    mounted() {
        console.log('start : ', this.$options.name)
        this.email = ''
        this.executeSql()
        this.mySchema = emailModel.mySchema
        this.myModel = emailModel.myModel
    },
    watch: {
        subid() {
            this.executeSql()  
        }
    }
}
</script>