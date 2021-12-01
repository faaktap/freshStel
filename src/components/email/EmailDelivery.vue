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
    <v-card-title class="justify-center"> 
        <v-card class="ma-2 pa-2">
        {{this.emailListRecord.deliveryid}} - {{this.emailListRecord.subject}}
        </v-card>
    </v-card-title>
        <v-card-text>
    <v-form-base 
        autocomplete="off"
        id="deliveryForm"
        :model="myModel"
        :schema="mySchema"
        :col=12
        @click="test"
        @blur="test"
    >
    </v-form-base>
    </v-card-text>
    <v-card-actions>
    
    <v-btn @click="mailIt" class="ma-2" primary> Mail </v-btn>
    <v-spacer />
    <v-btn @click="showEmail = false" class="ma-2"> Close </v-btn>
    </v-card-actions>
 </v-card>
</v-dialog>


 </v-container>
</template>

<script>
import vFormBase from "@/components/vfbase/vFormBase"
import { infoSnackbar } from '@/api/GlobalActions';
import { zData } from "@/api/zGetBackgroundData.js"
import { emailModel } from "./emlModel.js"
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
      test(e) {
        console.log('test click on form', e)
        if (e.key == 'attachments') {
           infoSnackbar('he clicked on ' +  e.params.text)
           console.log('e.params.text', e.params.text)
           let href= this.attList.find(el => el.humanfilename = e.params.text).htmlfilepath
           if (href)  window.open(href, "_pdfs");
        }


      },
      mailIt() {
          infoSnackbar('Starting your email program...')
          let attListHref = ''
          this.attList.forEach(ele => {
              attListHref += `<a href=${ele.htmlfilepath}> ${ele.humanfilename} </a> <br>`
          });
          let href= `mailto:${this.email}?subject=Re:${this.emailListRecord.subject}&body=Message from kuilies\n : ${attListHref}`
          if (href)  window.open(href, "_email");
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
          emailModel.emlModel = {
              email:this.emailListRecord.log,
              sentdate:this.emailListRecord.sentdate,
              subject:this.emailListRecord.subject,
              status:this.emailListRecord.status,
              group:this.emailListRecord.grpname,
              attachments:this.attList,
          }
          this.myModel = emailModel.emlModel
          this.mySchema = emailModel.emlSchema
          this.showEmail = true         
      },
      executeSql() {
        this.emailList = []
        let sqlStatement = `SELECT d.subject,e.deliveryid, e.status, e.sentdate,g.grpname, e.log
                             FROM m_emailsent e
                             left join m_delivery d on d.deliveryid = e.deliveryid
                             left join m_grouplink l on l.subid = e.subid
                             left join m_group g on l.grpid = g.grpid
                             WHERE e.subid = ${this.subid}
                             order by e.deliveryid DESC`
        //console.log('sql = ', sqlStatement)
        zData.loadSql(this.loading, sqlStatement, this.assignData, this.api)
      },        
      assignData(response) {
         if (response.error) {
             infoSnackbar('No emails returned for ' + this.subid)
             return
         }
         this.emailList = response
      },
       
    },
    mounted() {
        console.log('start : ', this.$options.name)
        this.email = ''
        this.executeSql()
        this.mySchema = emailModel.emlSchema
        this.myModel = emailModel.emlModel
    },
    watch: {
        subid() {
            this.executeSql()  
        }
    }
}
</script>