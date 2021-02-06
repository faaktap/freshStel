<template>
<div>
    <v-hover v-slot:default="{ hover }" open-delay="200">
    <v-btn :elevation="hover ? 12 : 2"
            :class="{'on-hover': hover,'overwrite-hover': $vuetify.breakpoint.xsOnly}"
            @click="titleDialog = !titleDialog"
            class="ma-2"
    > 
    <v-spacer />
      <v-icon color="blue" class="ma-2"> 
         <template v-if="hover"> HS </template> <!--{{ mainIcon[curIcon + hover] }}-->
         <template v-else> DK </template>
      </v-icon>
      <div v-if="!$vuetify.breakpoint.smAndDown">
        {{ maintitle }} 
      </div>
    </v-btn>
    </v-hover>


<v-dialog v-model="titleDialog" 
         style="transform: scale(0.875);transform-origin: left;"
         overlay-color="red"
         :fullscreen="$vuetify.breakpoint.mobile">
 <v-form v-model="validForm">
  <v-card class="white text--black pa-4"> 
   <v-row>
     <v-col cols="12">
      <legend> {{ZMLContactFormHeading}}</legend>
     </v-col>
     <v-col cols="8" md="4">
     </v-col>
     <v-col cols="8" md="4">
     </v-col>
     <v-col cols="8" md="4">
     </v-col>
     <v-col cols="8" md="4">
     </v-col>
     <v-col cols="8">
        <v-textarea  v-model="message" label="Message" />
     </v-col>
     <v-card-actions>
        <v-btn color=primary @click="sendMail"> {{ SubmityourEmail }} </v-btn>
        <v-btn color=primary @click="titleDialog=!titleDialog"> {{ CanceltheEmail }} </v-btn>
     </v-card-actions>
   </v-row>
  </v-card>
 </v-form>
</v-dialog>

</div>
</template>

<script>
import {zmlMail} from "@/api/zmlMail"
export default {
  name:"zmlTitle",
  props:{maintitle:String},
  data: () => ({
    mainIcon: ["mdi-kettle","mdi-kettle-steam-outline","mdi-kettle-steam","mdi-coffee"],
    curIcon: 1,
    hover: 0,
    message:'',
    titleDialog: 0,
    validForm:false,
  }),
  methods:{
      about() {
        if (this.$router.currentRoute.path !== "/about") {
            this.$router.push('/about') 
        }
      },
      sendMail() {
          if (this.valid == false) {
            alert('Some fields are not filled in properly!');
          } else {
            let heading = "<h2> Email Enquiry from " + this.ZMLContactFormHeading + "</h2>";
            heading += "<div><table><tr><td>Phone:<td>" + this.phone;
            heading += "<tr><td>Name:<td>" + this.name;
            heading += "<tr><td>Email:<td>" + this.email;
            heading += "<tr><td>Enquiry:<td>" + this.radioGroup;
            heading += "<tr><td>Message:<td>";
            let signature = '<table border=0><tr><td style="border-bottom: 1px solid blue;border-top: 1px solid blue;font-weight:bold;text-align:left;font-size:20pt;color:blue">Zi-Mari Smit<p style="font-weight:bold;text-align:left;font-size:10pt;color:blue">072 826 0575<td style="border-bottom: 1px solid blue;border-top: 1px solid blue;"><br><Font STYLE="font-size:26pt; color:red; line-height:1.69cm;font-weight:bold">S</font><FONT STYLE="font-weight:bold;text-align:left;font-size:20pt;color:red">ipress</font><font style="font-family:Arial Black,Sans-Serif;font-size=10pt;color:red"><a href=https://sipress.co.za>Wassery </a></font></td></table>';
            let ts = {method: "zmlsendmail"
                     ,htmlmessage: heading + this.message + "</table></div><br><br>" + signature
                     ,email_to: [this.email,'kovsiewas@sipress.co.za','sipresswas@gmail.com']
                     ,subject:"Navraag aan Sipress wassery website / Enquiry to Sipress.co.za / KovsieWas"
                     ,email_from: "kovsiewas@sipress.co.za"
                     ,attachments: []
                    };
            zmlMail(ts,this.emailSend);
         }
      },
  },
  computed: {
    ZMLContactFormHeading() { return this.$t('message.ZMLContactFormHeading') },
    SubmityourEmail() { return this.$t('message.SubmityourEmail') },
    CanceltheEmail() { return this.$t('message.CanceltheEmail') },
  }
}
</script>