<template>
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
            <v-img src="/img/logo.png" max-width=120 max-height=120 aspect-ratio="1" class="pa-0 ma-1"> </v-img>
            <p class="wordbreak text-h4 white--text pa-2 ma-0 pulse" style="text-shadow: 1px 1px 2px black; "> DE KUILEN HS </p>
            <v-spacer />
            <v-card class="text-right word-break ma-1 pa-md-3" color="green darken-3 white--text" width="100%">
              <v-card class="text-center" color="green darken-2 white--text" elevation="0"> <small>Attendance Record</small></v-card>
              <p class="wordbreak text-body-2 text-sm-h3 font-weight-light pa-2 ma-0"> Gr 8 - Parent Information Meeting / Ouer Inligtingsaand</p>
              <p class="text-body-2 text-sm-h4 font-weight-light pa-2 ma-0"> 19 Jan 2023 <br> 18:00 - 19:00</p>
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
        End of Attendance Record
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
  name: "OuerAttendance",
  components: { VFormBase},
  props:{
    surveyidPassed:{ type: String, default: '3' }
  },
  data: () => ({
    surveyid: 0,
    loading:false,
    valid: false,
    year: 2021,
    isOpen: true,
    resultStr :'',
    tmpSchoolNo: '',
    myModelBackup: {},
    myModel: {
      email:null,
      contactno:null,
      schoolno:null,
      surname:null,
      name:null,
      parentsurname:null,
      parentname:null,
      class:null,
    },
    /*
      schema:{ type:'text', hint:'myHint', prependIcon:'print'... }
      maps to <v-text-fields hint="myHint" prepend-icon="print" >
      -> https://vuetifyjs.com/en/components/text-fields/
    */
   mySchema: {
       top: { type:'wrap'
            , label:'top'
            , col : { "cols": 12,  "lg":12, "xs": 12 }
            , ripple:false
            , color:"white"
            , class:'title pa-2 rounded elevation-4 col-md-12',
        schema:{
           parentname: { type: 'text'
              , label: `Your name / Naam *`
              , prependInnerIcon:"mdi-account-question-outline"
              , solo:true
              , rules: [ required('Please enter your name') ]
              , col: { cols : 12, md: 6 }
              , class:'title pa-2 rounded col-md-6'
              , tooltip: 'Your name / U Naam'
              , hint: 'Please enter your first name'
              },
           parentsurname: { type: 'text'
              , label: `Your Surname / Van *`
              , prependInnerIcon:"mdi-account-question"
              , solo:true
              , rules: [ required('Please enter your surname') ]
              , col: { cols: 12, md: 6 }
              , class:'title pa-2 rounded col-md-6'
              , tooltip: "Your Surname / Van"
              , hint: 'Please enter your surname'
              },
           name: { type: 'text'
              , label: `Learner's name / Leerder se naam *`
              , prependInnerIcon:"mdi-account-question-outline"
              , solo:true
              , rules: [ required('Please enter student name') ]
              , col: { cols : 12, md: 6 }
              , class:'title pa-2 rounded col-md-6'
              , tooltip: 'Name of Learner / Leerder se naam'
              , hint: 'Please enter the name of the learner'
              },
           surname: { type: 'text'
              , label: `Learner's Surname /Leerder se van *`
              , prependInnerIcon:"mdi-account-question"
              , solo:true
              , rules: [ required('Please enter student surname') ]
              , col: { cols: 12, md: 6 }
              , class:'title pa-2 rounded col-md-6'
              , tooltip: "Learner Surname /Leerder se van"
              , hint: 'Please enter the surname of the learner'
              },
           schoolno: { type: 'number'
              , label: 'Admission number / Toelatingsnommer'
              , prependInnerIcon:"mdi-alpha-n-circle"
              , solo:true
              //, rules: [ required('Please enter student admission number') ]
              , col: { cols: 12, md: 6 }
              , class:'title pa-2 rounded col-md-6'
              , tooltip: "Admission number / Toelatingsnommer"
              , hint: "If you do not know the school number, leave it blank please!"
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
           contactno: { type: 'tel'
              , label: 'Contact Number'
              , prependInnerIcon:"mdi-phone"
              , solo:true
              , col: { cols: 12, md: 6 }
              , class:'xtitle pa-2 rounded col-md-6'
              , ripple:{ center:true, class: 'item blue--text' }
              , tooltip: "Please enter your contact number."
              , hint:'Contact number of parent/guardian'
              },
           gclass: { type: 'select'
              , label: 'Class'
              , prependInnerIcon:"mdi-marker-check"
              , solo:true
              , col: { cols: 12, md: 6 }
              , class:'xtitle pa-2 rounded col-md-6'
              , ripple:{ center:true, class: 'item blue--text' }
              , items: ["A1", "A2", "E1", "E2", "E3", "E4", "E5", "E6", "E7","E8"]
              , hint:'Class in Grade 8'
              },
        }}
      }
  }),
  computed:{
      studFullName() {
          return this.myModel.name + ' ' + this.myModel.surname
      },
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


      // eslint-disable-next-line
      log(a) {
          //console.info('LOG A = ', a.value)
      },
      test(a) {
        // eslint-disable-next-line
        let { on, id, index, key, value, obj } = a
        if (key == 'schoolno' && value) {
          //Here we ask the database if we have a prev dataset, and we load the latest if it is found
          this.tmpSchoolNo = value
          survey.getQuiz(this.tmpSchoolNo,this.loadModel)
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
      loadSurname() {
        if (this.tmpSchoolNo) {
            survey.lookupName(this.tmpSchoolNo,this.loadSurnameDone)
        } else {
            errorSnackbar("Invalid admission number")
        }
      },
      loadSurnameDone(response) {
         if (response.error) {
           errorSnackbar(response.error)
         } else {
           let stud = response.filter(a => a.schoolno == this.tmpSchoolNo)
           if (stud.length) {
             console.log('answer = ' , stud[0].schoolno , stud)
             this.myModel.schoolno = stud[0].schoolno
             this.myModel.surname = stud[0].surname
             this.myModel.name = stud[0].firstname
             let grade = util.getNum( stud[0].grade )
             this.myModel.grade = grade + stud[0].gclass
             if (grade != 8) {
               errorSnackbar('Our records show this student is in grade ' + grade + stud[0].gclass + '!')
             } else {
               infoSnackbar('Found ' + this.myModel.schoolno + ', ' + this.myModel.surname + ' ' + grade + stud[0].gclass)
             }
           } else {
             errorSnackbar("Something went wrong")
           }
         }
      },
      /*
      testDeStruct() {
          console.log ('back1 : ', util.zDate() )
          console.log ('back2 : ', util.zDate( [2021, 9, 13] ) )

      },*/
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
        survey.saveData(this.surveyid ,this.myModel.schoolno, this.myModel, this.doneSave, this.doneSave)
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
            let heading = `<h3> Attendance Record for ${Answer.parentsurname}, ${Answer.parentname} </h3>`
            heading += '<div>'
            heading += '<table width=90% style="border: 1px solid green;">'
            heading += "<tr><td>Admission Number / Toelatings Nommer<td>" + Answer.schoolno
            heading += "<tr><td>Surname, Name / Van, Voornaam<td>" + Answer.surname + ", " + Answer.name
            heading += "<tr><td>Current Class / Huidige Klas<td>" + Answer.gclass
            heading += "<tr><td>Parent / Ouer<td>" + Answer.parentsurname + ", " + Answer.parentname
            heading += "<tr><td>Contact Number / Kontaknommer<td>" + Answer.contactno

            let ts = {method: "zmlsendmail"
                     ,htmlmessage: heading +  "</table></div><br><br><hr>" //+ JSON.stringify(Answer)
                     ,email_to: [Answer.email,'wrnrsmit@gmail.com']
                     ,subject:"DKHS : Attendance Record"
                     ,email_from: "info@kuiliesonline.co.za"
                     ,attachments: []
                     ,addsignature:''
                     ,pdffile: "defaultFile"
                    };
            //alert(ts.htmlmessage)
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
    if (this.surveyidPassed) {
      this.surveyid = this.surveyidPassed
    } else {
      this.surveyid = 3
    }
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Lato:wght@300&display=swap');

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