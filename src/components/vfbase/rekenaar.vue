<template>
<!-- https://currentschoolnews.com/af/loopbaan/basiese-rekenaarvaardighede/ -->
<v-row>
 <v-col cols="12" col-md="6" >
  <v-card color="white" elevation="6" class="mx-sm-6 pa-sm-4" ref="includeInEmail">
   <v-form xv-if="mySchema &&  Object.keys(mySchema).length > 1"
            ref="form">
    <v-form-base
        autocomplete="off"
        id="myform"
        :model="myModel"
        :schema="mySchema"
        :col=12
        @input="log"
        @click="test"
        @blur="test"
    >
    <template #slot-top-myform>
      <v-col cols="12">
       <v-card class="slot ma-4 pa-4 xs-12" cols="12" color="green accent-4" align-content="left" align-content-lg="center">
         <v-card-title width="100%" class="text-center">
            <v-img src="https://kuiliesonline.co.za/virtual-school/img/logo.png" max-width=120 max-height=120 aspect-ratio="1" class="pa-0 ma-1"> </v-img>
            <p class="wordbreak text-h4 white--text pa-2 ma-0 pulse" style="text-shadow: 1px 1px 2px black; "> DE KUILEN HS </p>
            <v-spacer />
            <v-card class="text-right word-break ma-1 pa-md-3" color="green darken-3 white--text" width="100%">
              <v-card class="text-center" color="green darken-2 white--text" elevation="0"> <small>Survey</small></v-card>
              <p class="wordbreak text-body-2 text-sm-h3 font-weight-light pa-2 ma-0"> Rekenaarvaardigheid / Computer Literacy</p>
              <p class="text-body-2 text-sm-h4 font-weight-light pa-2 ma-0"> 12 Apr 2023 <br> ..</p>
            </v-card>
         </v-card-title>
         <v-card-actions color="red" class="ma-1 pa-0">
             <v-spacer />
             * Required
         </v-card-actions>
        </v-card>
          </v-col>
      </template>
      <template #slot-bottom-myform>
          <v-col cols="12">
          <v-card class="slot">
              <v-card-actions>
          <v-btn
            color="success"
            class="mr-4"
            @click="validate"
            :disabled="noChange"
          >
            Save
          </v-btn>
          <v-spacer />

          <v-btn
            color="success"
            class="mr-4"
            @click="reset"
            tip="This will reset all the form values!"
          >
            Reset
          </v-btn>
          </v-card-actions>
        </v-card>
       </v-col>
      </template>
      </v-form-base>
  </v-form>

 </v-card>
    </v-col>
    <v-col cols="12">
      <v-card  color="green darken-2 white--text">
      <h4 class="text-center ma-sm-4 pa-sm-4">
        <v-icon>mdi-information</v-icon>
        End of Survey - please save
      </h4>
      </v-card>
    </v-col>

</v-row>
</template>

<script>

import VFormBase from "@/components/vfbase/VFormBase"
import { infoSnackbar, errorSnackbar } from '@/api/GlobalActions';
import { zmlMail } from '@/api/zmlMail';
import { survey } from './survey.js'
import { printHeader, printPage } from "@/api/zmlPrint.js"
import { util } from '@/api/util.js'

// Helper & Partial Functions & Rules
const minLen = l => v => (v && v.length >= l) || `min. ${l} Characters`
const maxLen = l => v => (v && v.length <= l) || `max. ${l} Characters`
const required = ( msg ) => v => !!v || msg
const requiredArray = ( msg ) => v => (Array.isArray(v) && v.length>1) || msg
const rules = {
  requiredEmail: required('E-mail is required'),
  requiredSel: required('Selection is required'),
  requiredSelMult: requiredArray('2 Selections are required'),
  max12: maxLen(12),
  min6: minLen(6),
  validEmail: v => /.+@.+\..+/.test(v) || 'E-mail must be valid'
}

export default {
  name: "RekenaarVaardigheid",
  components: { VFormBase},
  props:{
    surveyidPassed:{ type: String, default: '4' }
  },
  data: () => ({
    surveyid: 0,
    loading:false,
    valid: false,
    year: 2023,
    isOpen: true,
    resultStr :'',
    myModel: {
    },
    questions: ['Do you know how to Extend your laptop screen to a projector ?'
               ,'Do you know how to Duplicate your laptop screen to the projector ?'
               ,'Can you setup a powerpoint show with video and sound ?'
               ,'Do you know what a page break is ?'
               ,'Do you know what a section break is ?'
               ,'Can you insert page numbers in any given word document ?'
               ,'Can you align text below each other without using the spacebar ?'
               ,'Can you use tables in Word ?'
               ,'Can you use a formula to work out the sum of columns in Excel ?'
               ,'Do you know what a pivot table is?'
               ,'Do you know how to switch from one sheet to another in Excel ?'
               ,'Do you use right click function on your mouse? ?'
               ,'Do you know how to refresh/reset your computer ?'
               ,'Do you know how to update your computer ?'
               ,'Can you setup OneDrive on you laptop ?'
               ,'Can you setup Outlook ? '
               ,'Can you add a link to a website to your document ?'
               ,'Do you know how to bookmark your favorite website ?'
               ,'Do you know how to save work for learners on kuiliesonline ?'
               ,'Can you change an attendance record on kuiliesonline (ie:If an absent child is late) ?'
               ],
    mySchema: {
       top: { type:'wrap'
            , label:'top'
            , col : { "cols": 12,  "lg":12, "xs": 12 }
            , ripple:false
            , color:"white"
            , class:'title pa-2 rounded elevation-4 col-md-12',
        schema:{
           name: { type: 'text'
              , label: `Your name / Naam *`
              , prependInnerIcon:"mdi-account-question-outline"
              , solo:true
              , rules: [ required('Please enter your name') ]
              , col: { cols : 12, md: 6 }
              , class:'title pa-2 rounded col-md-6'
              , tooltip: 'Your name / U Naam'
              , hint: 'Please enter your first name'
              },
           surname: { type: 'text'
              , label: `Your Surname / Van *`
              , prependInnerIcon:"mdi-account-question"
              , solo:true
              , rules: [ required('Please enter your surname') ]
              , col: { cols: 12, md: 6 }
              , class:'title pa-2 rounded col-md-6'
              , tooltip: "Your Surname / Van"
              , hint: 'Please enter your surname'
              },
           email: { type: 'email'
              , label: 'Your Email *'
              , rules: [rules.requiredEmail, rules.validEmail]
              , prependInnerIcon:"mdi-email"
              , solo:true
              , col: { cols: 12, md: 6 }
              , class:'xtitle pa-2 rounded col-md-6'
              , ripple:{ center:true, class: 'item blue--text' }
              , tooltip: "Please enter a parent or guardian email address."
              , hint:'email of parent/guardian'
              },
             level: { type: 'autocomplete'
                          , label: 'Level'
                          , col:{cols:12, md:6}
                          , class:"pa-1"
                          , outlined:true
                          , items: [ 'beginner', 'intermediate', 'experienced']},
            q1: {type: 'radio', options:['Yes','No'], label:''                , col: { cols: 12 }, row:false, class:'ml-2 pa-2 my-radio', prependIcon:"1"},
            q2: {type: 'radio', options:['Yes','No'], label:''                , col: { cols: 12 }, row:false, class:'ml-2 pa-2', prependIcon:"2"},
            q3: {type: 'radio', options:['Yes','No'], label:''                , col: { cols: 12 }, row:false, class:'ml-2 pa-2', prependIcon:"3"},
            q4: {type: 'radio', options:['Yes','No'], label:''                , col: { cols: 12 }, row:false, class:'ml-2 pa-2', prependIcon:"4"},
            q5: {type: 'radio', options:['Yes','No'], label:''                , col: { cols: 12 }, row:false, class:'ml-2 pa-2', prependIcon:"5"},
            q6: {type: 'radio', options:['Yes','No'], label:''                , col: { cols: 12 }, row:false, class:'ml-2 pa-2', prependIcon:"6"},
            q7: {type: 'radio', options:['Yes','No'], label:''                , col: { cols: 12 }, row:false, class:'ml-2 pa-2', prependIcon:"7"},
            q8: {type: 'radio', options:['Yes','No'], label:''                , col: { cols: 12 }, row:false, class:'ml-2 pa-2', prependIcon:"8"},
            q9: {type: 'radio', options:['Yes','No'], label:''                , col: { cols: 12 }, row:false, class:'ml-2 pa-2', prependIcon:"9"},
            q10: {type: 'radio', options:['Yes','No'], label:''                , col: { cols: 12 }, row:false, class:'ml-2 pa-2', prependIcon:"10"},
            q11: {type: 'radio', options:['Yes','No'], label:''                , col: { cols: 12 }, row:false, class:'ml-2 pa-2', prependIcon:"11"},
            q12: {type: 'radio', options:['Yes','No'], label:''                , col: { cols: 12 }, row:false, class:'ml-2 pa-2', prependIcon:"12"},
            q13: {type: 'radio', options:['Yes','No'], label:''                , col: { cols: 12 }, row:false, class:'ml-2 pa-2', prependIcon:"13"},
            q14: {type: 'radio', options:['Yes','No'], label:''                , col: { cols: 12 }, row:false, class:'ml-2 pa-2', prependIcon:"14"},
            q15: {type: 'radio', options:['Yes','No'], label:''                , col: { cols: 12 }, row:false, class:'ml-2 pa-2', prependIcon:"15"},
            q16: {type: 'radio', options:['Yes','No'], label:''                , col: { cols: 12 }, row:false, class:'ml-2 pa-2', prependIcon:"16"},
            q17: {type: 'radio', options:['Yes','No'], label:''                , col: { cols: 12 }, row:false, class:'ml-2 pa-2', prependIcon:"17"},
            q18: {type: 'radio', options:['Yes','No'], label:''                , col: { cols: 12 }, row:false, class:'ml-2 pa-2', prependIcon:"18"},
            q19: {type: 'radio', options:['Yes','No'], label:''                , col: { cols: 12 }, row:false, class:'ml-2 pa-2', prependIcon:"19"},
            q20: {type: 'radio', options:['Yes','No'], label:''                , col: { cols: 12 }, row:false, class:'ml-2 pa-2', prependIcon:"20"},
        }}
      }
  }),
  computed:{
      noChange() {
        if (JSON.stringify(this.myModel) == JSON.stringify(this.myModelBackup)) {
          //console.log('no changes yet')
          return true
        }
        //console.log('there is a difference', this.myModel, this.myModelBackup)
        return false
      }
  },
  methods:{
      fixSurveyQuestions() {
        let cnt = 0
        this.questions.forEach((e,i) => {
            cnt = cnt + 1
            this.mySchema.top.schema['q' + cnt ].label =  e

        })
      },
      // eslint-disable-next-line
      log(a) {
          //console.info('LOG A = ', a.value)
      },
      test(a) {
        // eslint-disable-next-line
        let { on, id, index, key, value, obj } = a
        if (key == 'email' && value) {
          //Here we ask the database if we have a prev dataset, and we load the latest if it is found
          survey.getQuiz(value,this.loadModel)
        }
      },
      loadModel(response) {
        //console.log('loadmodel:', response)
        if (!response.errorcode && response[0].quizdata) {
           infoSnackbar('We received previously entered data - set:' + response.length)
           this.myModel = JSON.parse( response[0].quizdata )
           this.myModelBackup = JSON.parse( response[0].quizdata )
        } else {
           //alert('we received no data - calling getSurname.....')
           //no message needed - we have not saved data previously
           //Now do a lookup for name, surname and maybe email...
           this.loadSurname()
        }
      },
      check() {
        //this.valid = this.$refs.form.validate()
      },
      validate () {
        this.valid = this.$refs.form.validate()
        if (this.valid) {
          this.payload()
        } else {
          errorSnackbar('Not all the fields are filled in!')
        }
      },
      payload() {
        this.myModel.dateEntered = new Date()
        survey.saveData(this.surveyid ,this.myModel.email, this.myModel, this.doneSave, this.doneSave)
        this.emailresult(this.myModel)
      },
      doneSave(response) {
         if (response.result == 'OK') {
             infoSnackbar('the save is done - now sending email')
         } else {
             errorSnackbar('the save did not happen ' + response.error)
         }
      },
      reset () {
        this.$refs.form.reset()
        window.scrollTo(0,0)
      },
      saveFile() {
       const data = JSON.stringify(this.mySchema)
       const blob = new Blob([data], {type: 'text/plain'})
       const e = document.createEvent('MouseEvents'),
       a = document.createElement('a');
       a.download = "test.json";
       a.href = window.URL.createObjectURL(blob);
       a.dataset.downloadurl = ['text/json', a.download, a.href].join(':');
       e.initEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
       a.dispatchEvent(e);
     },
     emailresult(Answer) {
            let heading = printHeader('Rekenaar Vaardigheid')
            heading += `<h3> Rekenaar vaardigheid vir ${Answer.surname}, ${Answer.name} </h3>`
            heading += '<div> https://kuiliesonline.co.za/virtual-school/rekenaar'
            heading += '<table width=90% style="border: 1px solid green;">'
            heading += "<tr><td>Surname, Name / Van, Voornaam<td>" + Answer.surname + ", " + Answer.name
            heading += "<tr><td><td>"
            heading += "<tr><td>Thank you for filling in the survey!<td>"
            heading += "</table><hr><ul>"
            Object.entries(Answer).forEach( ([key, value]) => {
                const num = key.match(/(\d+)/)
                console.log('num = ' ,num)
                if (num && num[0] > 0 && num[0] < 22) {
                   const an = num[0] - 1
                   const q = this.questions[ an ]
                   console.log(an,q)
                   heading += `<li>  ${q} : ${value} </li>`
                } else {
                  heading += `<li>  ${key} : ${value} </li>`
                }
            })
            heading += "</ul>"

            let ts = {method: "zmlsendmail"
                     ,htmlmessage: heading +  "</div><br><br><hr>" //+ JSON.stringify(Answer)
                     ,email_to: [Answer.email,'wrnrsmit@gmail.com']
                     ,subject:"DKHS : Rekenaarvaardigheid"
                     ,email_from: "info@kuiliesonline.co.za"
                     ,attachments: []
                     ,addsignature:''
                     ,pdffile: "defaultFile"
                    };
            infoSnackbar('Sending email to ' + Answer.email)
            zmlMail(ts,this.emailGood, this.emailBad);
            return
     },
     emailGood(response) {
       //console.log('emailgood:', response)
       if (response.errorcode)  {
         this.resultStr = 'The form was submitted, but email NOT send. ' + response.error
       } else {
         this.resultStr = 'Well done - the email was sent to ' + this.myModel.email
       }
       infoSnackbar(this.resultStr)
       //console.log(this.resultStr)
       this.reset()
     },
     emailBad(response) {
        console.log('emailbad', response)
       this.resultStr = 'The form was submitted, but email NOT send to ' + this.myModel.email
       errorSnackbar(this.resultStr)
     },
  },
  mounted: function() {
    this.fixSurveyQuestions()
    if (this.surveyidPassed) {
      this.surveyid = this.surveyidPassed
    } else {
      this.surveyid = 4
    }
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Lato:wght@300&display=swap');


::v-deep .my-radio .v-label {
 font-size: 15px;
}

.wordbreak {
  overflow-wrap: break-word;
  word-wrap: break-word;
  word-break: break-all;
  word-break: break-word;
  hyphens: auto;
}

.test:hover {
  transform: scaleX(1.5);
}

.pulse {
  animation: pulse-animation 2s infinite;
}

@keyframes pulse-animation {
  0% {
    box-shadow: 0 0 0 0px rgba(0, 0, 0, 0.2);
  }
  100% {
    box-shadow: 0 0 0 20px rgba(0, 0, 0, 0);
  }
}

</style>