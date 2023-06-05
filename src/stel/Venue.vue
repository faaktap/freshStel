<template>
<v-container fluid>
   <v-form xv-if="mySchema &&  Object.keys(mySchema).length > 1"
           class="ma-sm-0 pa-sm-0 ma-lg-4 pa-lg-4"
           ref="venueform">
    <v-form-base
        autocomplete="on"
        id="myform"
        :model="myModel"
        :schema="mySchema"
        :col=12
        @notneededinput="log"
        @click="test"
        @blur="test"
    >
    <template #slot-top-myform>
       <v-card class="slot ma-4 pa-4 xs-12 ma-sm-0 pa-sm-0" color="white" align-content="left" align-content-lg="center">
         <v-card-title width="100%" class="text-center wordbreak">
            <stel-logo   class="ma-2 pa-2" :width="140" :height="120"  />
            <p class="wordbreak text-h4 white--text pa-2 ma-0 pulse" style="text-shadow: 1px 1px 2px black; ">STELLENBERG HS </p>
            <v-spacer />
            <v-card class="text-right word-break ma-1 pa-md-3" color="stelgray white--text" width="100%">
              <v-card class="text-center" color="stellenbergblou white--text" elevation="4"> <small>
                Preliminary Information to kickoff Venue booking</small>
              </v-card>
              <p class="wordbreak text-body-2 text-sm-h3 font-weight pa-2 ma-0 stelred--text"> Venue Booking</p>
              <p class="hidden-sm-and-down text-left text-body font-weight-light pa-1 ma-0 wordbreak" color="stelgray">
                Use the icon on the righthand side for assistance in making a selection. Try to fill in all elements. An email will be send to the coordinator's email
                when you save.
                <br>You will be allowed to make changes at a later stage.
                <br>To edit a previous entry, you will need to fill in the same date and the same coordinator's email address.
              </p>
            </v-card>
         </v-card-title>
         <v-card-actions color="red" class="ma-1 pa-0">
             <v-spacer />
             * Required
         </v-card-actions>
        </v-card>
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


      <p class="text-center text-caption">Press the Save button to finish the process</p>
      <v-card  color="stellenbergblou white--text">
      <h4 class="text-center ma-sm-4 pa-sm-4">
        <v-icon>mdi-information</v-icon>
        End of Venue Enquiry Form
      </h4>
      </v-card>
</v-container>
</template>

<script>
import StelLogo from "@/stel/StelLogo"
import VFormBase from "@/stel/vfbase/VFormBase"
import { infoSnackbar, errorSnackbar } from '@/stel/GlobalActions';
import { zmlMail } from '@/stel/zmlMail';
import { survey } from '@/stel/survey.js'
import { zmlF } from '@/stel/zmlF.js'

// Helper & Partial Functions & Rules

export default {
  name: "VenueBooking",
  components: { VFormBase, StelLogo},
  props:{
    surveyidPassed:{ type: String, default: '3' }
  },
  data: () => ({
    allEmails:[ "faaktap@gmail.com"
              ],
    getEmail:{id:0
          , desc: "ZML Constants"
          , workDone: 0
          , response: []
          , sql:`SELECT zmlvalue FROM zml_constant WHERE zmltype = 'SURVEY' and zmlname = 'ALLEMAIL'`},
    surveyid: 0,
    loading:false,
    valid: false,
    year: 2021,
    isOpen: true,
    resultStr :'',
    tmpSchoolNo: '',
    myModelBackup: {},
    /*
      schema:{ type:'text', hint:'myHint', prependIcon:'print'... }
      maps to <v-text-fields hint="myHint" prepend-icon="print" >
      -> https://vuetifyjs.com/en/components/text-fields/
    */
      mySchema: {},
      myModel: {
        functiondate: '',
        functiontime: '12:00',
        coordinatorname: '',
        coordinatoremail: '',
        coordinatorno: 0,
        contactname: '',
        contactemail: '',
        contactno: 0,
        setupdate: '',
        setupstarttime: '',
        setupendtime: '',
        guestarrivaltime: '',
        functionstarttime: '',
        functionendtime: '',
        functiondeparturetime: '',
        cleanupdate: '',
        cleanupstarttime: '',
        cleaunupendtime: '',
        eventtype: '',
        chairs: 0,
        tablerect: 0,
        tableround: 0,
        tablelinenroundblack: 0,
        tablelinenroundwhite: 0,
        tablelinenrectangularblack: 0,
        tablelinenrectangularwhite: 0,
        podium: false,
        registrationtable: '',
        registrationtables: 0,
        chairsperregistrationtable: 0,
        glasseschampagne: 0,
        glasseswine: 0,
        glassescooldrinktall: 0,
        glassescooldrinktumble: 0,
        crockcup: 0,
        crocksources: 0,
        crockteapot: 0,
        crockcoffeepot: 0,
        crocksugarbowl: 0,
        crockmilkjug: 0,
        crockwaterjug: 0,
        crockicebucket: 0,
        crocksmallplate: 0,
        crocklargeplate: 0,
        crockservingplate: 0,
        cutleryknives: 0,
        cutleryforks: 0,
        cutleryspoons: 0,
        cutleryteaspoons: 0,
        cutleryservingspoons: 0,
        cutleryicetongs: 0,
        oitemsurn: 0,
        oitemshottray: 0,
        oitemsmplugs: 0,
        oitemsextlead: 0,
        layouttype: '',
        lightreq: '',
        audioreq: '',
        whitescreen: '',
        parkingreq: '',
        parking1: false,
        parking2: false,
        parking3: false,
        parking4: false,
        securitystarttime: '',
        securityendtime: '',
        alarmname: '',
        alarmemail: '',
        alarmno: '',
        unlockvenuename: '',
        unlockvenueemail: '',
        unlockvenueno: '',
        lockvenuename: '',
        lockvenueemail: '',
        lockvenueno: '',
        othervendorname1: '',
        othervendoremail1: '',
        othervendorno1: '',
        othervendorname2: '',
        othervendoremail2: '',
        othervendorno2: '',
        othervendorname3: '',
        othervendoremail3: '',
        othervendorno3: '',

    },
    counter:0,


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
          // console.info('LOG A = ', a.value)
      },
      test(a) {
        if (this.counter > 1) return; //We only need this function once for retrieval
        // eslint-disable-next-line
        let { on, id, index, key, value, obj } = a

        if (key == 'coordinatoremail' && value)  this.myModel.coordinatoremail = value
        if (key == 'functiondate' && value)  this.myModel.functiondate = value
        if (this.myModel.functiondate && this.myModel.coordinatoremail) this.counter += 1; //We only load backup data once in each session
        if (this.counter == 1 && this.myModel.functiondate && this.myModel.coordinatoremail) {
           infoSnackbar('retrieving data for ' +  this.myModel.coordinatoremail.toLowerCase() + ' ' + this.myModel.functiondate)
           survey.getQuiz(this.myModel.coordinatoremail.toLowerCase() + this.myModel.functiondate,this.loadModel)
        }
      },
      loadModel(response) {
        if (!response.errorcode && response[0].quizdata) {
           infoSnackbar('We received previously entered data - set:' + response.length)
           this.myModel = JSON.parse( response[0].quizdata )
           this.myModelBackup = JSON.parse( response[0].quizdata )
        }
      },
      validate() {
        this.valid = this.$refs.venueform.validate()
        if (this.valid) {
          this.payload()
        } else {
          errorSnackbar('Not all the fields are filled in!')
        }
      },
      payload() {
        this.myModel.dateEntered = new Date()
        if (!this.myModel.coordinatoremail || !this.myModel.functiondate) {
            infoSnackbar('some data not yet filled in!')
            return
        }
        survey.saveData(this.surveyid ,this.myModel.coordinatoremail.toLowerCase()+this.myModel.functiondate, this.myModel, this.doneSave, this.doneSave)

      },
      doneSave(response) {
         if (response.result == 'OK') {
             infoSnackbar('the save is done - now sending email')
             this.emailresult(this.myModel)
         } else {
             errorSnackbar('the save did not happen ' + response.error)
         }
      },
      reset () {
        this.$refs.form.reset()
        this.counter = 0
        //we could set some default values here..
        this.myModel.coordinatorno = ''
        this.myModel.contactno = ''
        window.scrollTo(0,0)
      },
      saveFile() {
       const data = JSON.stringify(this.mySchema)
       const blob = new Blob([data], {type: 'text/plain'})
       const e = document.createEvent('MouseEvents'),
       a = document.createElement('a');
       a.download = "atest.json";
       a.href = window.URL.createObjectURL(blob);
       a.dataset.downloadurl = ['text/json', a.download, a.href].join(':');
       e.initEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
       a.dispatchEvent(e);
     },
     testForEach() {

        const flatten = (ob) => {
            let result = {};
            let arr = [];
            for (const i in ob) {
                if ((typeof ob[i]) === 'object' && !Array.isArray(ob[i])) {
                    const temp = flatten(ob[i]);
                    for (const j in temp) {
                        console.log(i,j)
                        if (j=='label') {
                            arr.push(i)
                        }
                        result[j] = temp[j];
                    }
                }
                else {
                    result[i] = ob[i];
                }
            }
            console.log(arr)
            return result;
        };
        console.log(flatten(this.mySchema))

        Object.entries(this.mySchema).map(entry => {
          let key = entry[0];
          let value = entry[1];
          console.log(key, value);
        });
        // eslint-disable-next-line
        const findkey = (o,v) => Object.keys(o).find(key => o[key] == v);
        console.log(findkey(this.mySchema,'functiondate'))
        console.log(findkey(this.mySchema,'functiondate.label'))
        // eslint-disable-next-line
        let result = Object.keys(this.mySchema).reduce(function (value, key) {
                      return value.concat(key, this.mySchema[key]);
                     }, []);
        console.log(result)
        Object.keys(this.mySchema).forEach(e => {
            console.log(e)
            console.log(e.top)
        });
     },
     emailresult(Answer) {
        console.warn('before sedning email:',this.allEmails, Answer)
            let heading = survey.getHeader(Answer)
            let ts = {method: "zmlsendmail"
                     ,htmlmessage: heading +  "</table></div><br><br><hr>" //+ JSON.stringify(Answer)
                     //,email_to: [Answer.coordinatoremail, 'wrnrsmit@gmail.com']
                     ,email_to: this.allEmails
                     ,subject:"Stellenberg : Venue Enquiry"
                     ,email_from: "noreply@actlocal.co.za"
                     ,attachments: []
                     ,addsignature:''
                     ,pdffile: "defaultFile"
                    };
            //alert(ts.htmlmessage)
            infoSnackbar(`Sending email to ${Answer.coordinatorname}, (${Answer.coordinatoremail})`)
            zmlMail(ts,this.emailGood, this.emailBad);
            return
     },
     emailGood(response) {
       //console.log('emailgood:', response)
       if (response.errorcode)  {
         this.resultStr = 'The form was submitted, but email NOT send. ' + response.error
       } else {
         this.resultStr = 'Well done - the email was sent to ' + this.myModel.coordinatoremail
       }
       infoSnackbar(this.resultStr)
       //console.log(this.resultStr)
       //this.reset()
     },
     emailBad(response) {
        console.log('emailbad', response)
       this.resultStr = 'The form was submitted, but email NOT send to ' + this.myModel.coordinatoremail
       errorSnackbar(this.resultStr)
     },
     emailLoad() {
      console.log('before email was loaded  : ', this.allEmails)
      this.getEmail.response.forEach(e => this.allEmails.push(e.zmlvalue))
      console.log('the emails are loaded as : ', this.allEmails)
     },
     loadError(err) {
      console.log('tell them:',err)
      alert('tell them ?' + zmlF.showDBError(err))
     },
  },
  mounted: function() {
    if (this.surveyidPassed) {
      this.surveyid = this.surveyidPassed
    } else {
      this.surveyid = 3
    }
    this.mySchema = survey.venueSchema
    zmlF.ZF({task:'PlainSQl',sql:this.getEmail.sql}, this.emailLoad, this.loadErr,  this.getEmail);
    // alert('test')
    // let upd = `update dkhs_survey set data = '${JSON.stringify(this.mySchema)}' where surveyid = 4`
    // let ts = {task:'plainSql',
    //    method: "plainSql",
    //    sql:upd
    // }
    // survey.quickUpdate(ts)
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
    box-shadow: 0 0 0 0px rgba(0, 141, 131, 0.2);
  }
  100% {
    box-shadow: 0 0 0 20px rgba(0, 0, 0, 0);
  }
}

</style>