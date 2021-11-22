<template>
    <v-container>
     <base-title-expand :heading="subHeading" openOrClose="open">
       <subscriber-edit :subid="localSubID" @subscriberChange="subscriberChange" />
     </base-title-expand>

     <base-title-expand heading="Email Sent">
      <email-delivery :subid="localSubID" />

     </base-title-expand>
    </v-container>
</template>

<script>
//import FrontJsonToCsv from '@/api/csv/FrontJsonToCsv.vue'
import BaseTitleExpand from '@/components/base/BaseTitleExpand.vue'
//import vFormBase from "@/components/vfbase/vFormBase"
//import { infoSnackbar } from '@/api/GlobalActions';
import { zData } from "@/api/zGetBackgroundData.js"
//import { emailModel } from "@/components/email/myModels.js"
import SubscriberEdit from "@/components/email/SubscriberEdit"
import EmailDelivery from "@/components/email/EmailDelivery"
export default {
    name:'EmailsSent',
    components:{BaseTitleExpand, SubscriberEdit,EmailDelivery},
    props:['subid'],
    data: () => ({
      myModel: {},
      mySchema:{},
      api:'https://kuiliesonline.co.za/api/dkhs/dkhs.php',  
      loading:false,
      zData:zData,
      csvArray:[],     
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
      subHeading:'Subscribers',
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
      ],
      attList:[{attachid:'',humanfilename:'',htmlfilepath:'',status:'',serverfilepath:''}],
      localSubID:null,
    }),
    methods:{
       subscriberChange(e) {
           console.log('new subid received', e)
           this.localSubID = e
       }
    },
    mounted() {
        console.log('start : ', this.$options.name)
        this.localSubID = this.subid
    }
}
</script>