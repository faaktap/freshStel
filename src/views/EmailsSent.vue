<template>
  <v-container fluid>
  <base-tool toolbarName="Email Lookup"
            :background="false"
            :back="true"
  >
      <!-- <v-btn icon @click="doPrint"><v-icon> mdi-printer</v-icon>  </v-btn> -->
      <!-- <v-btn class="ma-2" @click="showPrint = true"> Export </v-btn> -->
  </base-tool>

     <base-title-expand :heading="subHeading" openOrClose="open" color="gray lighten-2">
       <subscriber-edit :subid="localSubID" @subscriberChange="subscriberChange" />
     </base-title-expand>

     <base-title-expand
        v-if="localSubID"
        :heading="'Email sent to ' + this.currentSubscriber.email"
        color="gray lighten-3">
      <email-delivery :subid="localSubID" />
     </base-title-expand>
    </v-container>
</template>

<script>
import baseTool from '@/components/base/baseTool.vue'
import BaseTitleExpand from '@/components/base/BaseTitleExpand.vue'
import SubscriberEdit from "@/components/email/SubscriberEdit"
import EmailDelivery from "@/components/email/EmailDelivery"

export default {
    name:'EmailsSent',
    components:{baseTool, BaseTitleExpand, SubscriberEdit,EmailDelivery},
    props:['subid'],
    data: () => ({
      subHeading:'Email Subscribers',
      currentSubscriber:{subject:'',deliveryid:0, status:'', sentdate:'', grpname:'', email:''},
      localSubID:null
    }),
    methods:{
        subscriberChange(e,currentRowRecord) {
           this.$cs.l('new subid received', e)
           this.localSubID = e
           this.currentSubscriber = currentRowRecord
           this.$cs.l('new guy ', this.currentSubscriber)
        },

    },
    mounted() {
        this.$cs.l('start : ', this.$options.name)
        this.localSubID = this.subid
    }
}
</script>