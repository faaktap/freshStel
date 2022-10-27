<template>
<v-container>
  <base-tool toolbarName="Email Delivery"
            :background="false"
            :back="true"
  >
      <!-- <v-btn icon @click="doPrint"><v-icon> mdi-printer</v-icon>  </v-btn> -->
      <!-- <v-btn class="ma-2" @click="showPrint = true"> Export </v-btn> -->
  </base-tool>

 <v-data-table
    :headers="emailListHeader"
    :items="emailList"
    :items-per-page="20"
    class="elevation-2"
    :loading="loading"
    mobile-breakpoint="0"
    @click:row="clickOnRow">
 </v-data-table>


<v-card v-if="getZml.login.username=='WER'">
    WERNER
 <v-tabs v-model="tab" background-color="deep-purple accent-4" centered dark icons-and-text>
  <v-tabs-slider></v-tabs-slider>
  <v-tab href="#tab-1">Recents<v-icon>mdi-phone</v-icon></v-tab>
  <v-tab href="#tab-2">Favorites<v-icon>mdi-heart</v-icon></v-tab>
  <v-tab href="#tab-3">Nearby<v-icon>mdi-account-box</v-icon></v-tab>
 </v-tabs>
 <v-tabs-items v-model="tab">
  <v-tab-item v-for="i in 3" :key="i" :value="'tab-' + i">
   <v-card flat>
    <v-card-text>{{ i }} {{ 'tab-' + i }} {{ i }} {{ 'asdasdtab-' + i }} {{ i }} {{ 'tab-' + i }}
    </v-card-text>
   </v-card>
  </v-tab-item>
 </v-tabs-items>
</v-card>

<v-card v-if="getZml.login.username=='WER'">
    SLIDES
 <v-tabs v-model="tab" background-color="primary accent-4" centered icons-and-text>
  <v-tabs-slider></v-tabs-slider>
  <v-tab href="#tab-1">Recents<v-icon>mdi-chart-timeline</v-icon></v-tab>
  <v-tab href="#tab-2">Favorites<v-icon>mdi-hard-hat</v-icon></v-tab>
  <v-tab href="#tab-3">Nearby<v-icon large>mdi-share-variant</v-icon></v-tab>
 </v-tabs>
 <v-tabs-items v-model="tab">
  <v-tab-item v-for="i in 3" :key="i" :value="'tab-' + i">
   <v-card flat>
    <v-card-text>{{ i }} {{ 'tab-' + i }} {{ i }} {{ 'asdasdtab-' + i }} {{ i }} {{ 'tab-' + i }}
    </v-card-text>
    <v-card-actions> {{ tab }} </v-card-actions>
   </v-card>
  </v-tab-item>
 </v-tabs-items>
</v-card>

 <!-- Show a specific email, and allow to send again. -->
 <v-dialog v-model="showEmail">
   <v-card color="blue">
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
    <v-text-field v-model="emailListRecord.email"
                  title="You can alter the email address here"
                  solo dense label="TO:"
                  class="mt-6" color="red" />

    <v-spacer />
    <v-btn @click="showEmail = false" class="ma-2"> Close </v-btn>
    </v-card-actions>
   </v-card>
   <v-card color="blue">
       <v-textarea v-html="emailListRecord.emailcontent" readonly outlined />
   </v-card>
 </v-dialog>


 </v-container>
</template>

<script>
import VFormBase from "@/components/vfbase/VFormBase.vue"
import baseTool from '@/components/base/baseTool.vue'
import { infoSnackbar } from '@/api/GlobalActions';
import { zData } from "@/api/zGetBackgroundData.js"
import { emailModel } from "./emlModel.js"
import { getters } from "@/api/store";
export default {
    name:'EmailsSent',
    components:{VFormBase, baseTool},
    props:['subid'],
    data: () => ({
      getZml : getters.getState({ object: "gZml" }),
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
          {text: 'email',      value: 'email' },
      ],
      email:null,
      showEmail:false,
      attList:[{attachid:'',humanfilename:'',htmlfilepath:'',status:'',serverfilepath:''}],
      emailTab:null,
      tab:null,
    }),
    methods:{
      test(e) {
        this.$cs.l('test click on form', e)
        if (e.key == 'attachments') {
           infoSnackbar('he clicked on ' +  e.params.text)
           this.$cs.l('e.params.text', e.params.text)
           let href= this.attList.find(el => el.humanfilename = e.params.text).htmlfilepath
           if (href)  window.open(href, "_pdfs");
        }


      },
      mailIt() {
        infoSnackbar('Starting your email program...')
        let attListHref = '<ul>Attachments'
        this.attList.forEach(ele => {
              attListHref += `<li><a href="${ele.htmlfilepath}"> ${ele.humanfilename} </a> </li>`
        });
        attListHref += `</ul>`
        let email =
              { subject  : `${this.emailListRecord.subject}`
               ,email_to : [this.emailListRecord.email,'wrnrsmit@gmail.com']
               ,htmlmessage : `RESEND: ${this.emailListRecord.emailcontent}
               attachments: ${attListHref}
               `};
        this.$cs.l(email)
        zData.sendEmail(email, this.emailDone)
      },
      emailDone(response) {
         this.$cs.l('emaildddddddddddddddoooone',response)

      },
      clickOnRow(e) {
          this.$cs.l('clicked on email', e)
          this.emailListRecord = e
          this.attList.length = 0
          if (this.email == null) {
              infoSnackbar('Email is empty!')
              return
          }
          infoSnackbar('fetch all the attachments for this deliveryid ' + e.deliveryid)
          let sqlStatement = `SELECT l.html, a.* from m_attachment a , m_partlink l where l.deliveryid =  ${e.deliveryid} and l.deliveryid = a.deliveryid  and partid = 3`
          //let sqlStatement = `SELECT * from m_attachment where deliveryid = ${e.deliveryid}`
          zData.loadSql(this.loading, sqlStatement, this.assignAttachmentData, this.api)
      },
      assignAttachmentData(response) {
          this.$cs.l('assig attachement', response)
          if (response.length) {
             this.attList = response
          }
          emailModel.emlModel = {
              email:this.emailListRecord.email,
              sentdate:this.emailListRecord.sentdate,
              subject:this.emailListRecord.subject,
              status:this.emailListRecord.status,
              group:this.emailListRecord.grpname,
              attachments:this.attList,
              emailContent:this.emailListRecord.emailcontent   ///this.attList[0].html
          }
          this.myModel = emailModel.emlModel
          this.mySchema = emailModel.emlSchema

          this.showEmail = true
      },
      executeSql() {
        this.emailList = []
        let sqlStatement = `SELECT d.subject,e.deliveryid, e.status, e.sentdate,g.grpname, e.log email, group_concat(p.html) emailcontent
                             FROM m_emailsent e
                             left join m_delivery d on d.deliveryid = e.deliveryid
                             left join m_grouplink l on l.subid = e.subid
                             left join m_group g on l.grpid = g.grpid
                             left join m_partlink p on p.deliveryid = e.deliveryid and p.name = 'Default Content'
                             WHERE e.subid = ${this.subid}
                             group by d.subject,e.deliveryid, e.status, e.sentdate,g.grpname, e.log
                             order by e.deliveryid DESC`
        //this.$cs.l('sql = ', sqlStatement)
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
        this.$cs.l('start : ', this.$options.name)
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