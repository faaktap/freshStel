<template>
 <v-container>
  <v-row class="justify-center"  align="center" justify-center>
    <v-col v-if="getZml.login.isAuthenticated"
           class="mx-auto my-12">
     <v-card max-width="500"
           color=#F5F5F5>
      <v-card-title>
       <h2> Kuilies Session Status  </h2>
      </v-card-title>

      <v-card-text class="ma-2">
        <v-card color="gray" class="ma-2 pa-4">
       You are logged in as {{ getZml.login.username }} since {{ getZml.login.lastdate }}.
        </v-card>
       <br>
       Thanks for using the system {{ getZml.login.fullname }}!
       <br>You will be logged out once you click the button below.
       <br>
       <br>To continue your session, press the back button.
       <br>To go to your default place of business, press the continue button.
       <br>To make changes to your profile, click the appropiate button.
      </v-card-text>
      <v-card-actions>
       <v-btn  @click="showProfile = !showProfile" color="info">
        Profile
       </v-btn>
       <v-btn @click="doBack" color="primary">
         Back
       </v-btn>
       <v-btn color="info" @click="startLearning">
         Continue
       </v-btn>
        <v-spacer />
       <v-btn  @click="logout" color="info">
        Logout
       </v-btn>
      </v-card-actions>
     </v-card>
    </v-col>
<!-- ------------------------------------ -->
     <v-col v-else
        class="mx-auto my-12 justify-center">
     <v-hover v-slot:default="{ hover }">
      <v-card
           color=#F5F5F5
           style="xoverflow: auto;"
          :elevation="hover ? 12 : 2"
          :class="{'on-hover': hover,'overwrite-hover': $vuetify.breakpoint.xsOnly}"
      >
       <v-card-title>
        <h2> Kuilies Login</h2>
       </v-card-title>
       <v-card-text>
        <v-form>
        <!-- <v-form class="px-3" ref="loginForm" width="400" v-on:submit.prevent="onSubmit"> -->
         <v-text-field  label="User"
            v-model="loginObj.username"
            autocomplete="username"
            prepend-icon="mdi-account-circle"
            :rules="inputRules"
            autofocus
         />
         <v-text-field
            label="Password"
            v-model="loginObj.password"
            prepend-icon="mdi-lock"
            :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
            @click:append="showPassword = !showPassword"
            :type="showPassword ? 'text' : 'password'"
            v-on:keyup.enter="onEnter"
            name="password"
            autocomplete="current-password"
         />
        </v-form>
       </v-card-text>
       <v-card-actions>
        <v-btn @click="registrationMessage()" class="mx-0 mt-3" color="info">
          Register
        </v-btn>
        <v-spacer />
        <v-btn
          v-if="!hideForgotButton"
          class="mx-5 mt-3" color="info"
          title="Click here if you have forgotten your password"
          @click="forgotPassword" >
          Reset
        </v-btn>

        <v-btn
            @click.prevent="submit"
            class="mx-0 mt-3"
            :loading="submitting"
            color="info"
            :disabled="submitting"
        >  Login </v-btn>
       </v-card-actions>
      </v-card>
  </v-hover>
 </v-col><!-- Else End-->
     </v-row>
    <v-overlay
      :opacity="1"
      :value="overlay"
    >
      <v-progress-circular indeterminate size="64">
        Loading...
      </v-progress-circular>
    </v-overlay>

    <v-row>
     <v-col>
      <v-card class="ma-5 pa-4" v-show="getZml.login.isAuthenticated == false">
        <v-icon color="purple darken-2"> mdi-help-circle-outline </v-icon>If you are a learner, your login would start with your schoolno, and
         if you are a teacher it would be your teacher login details.
         A learner's first login his admin no will be his username and password.
         Request them from Werner at  082 563 9790
         if you are unsure.
      </v-card>
      <v-card class="ma-5 pa-4" v-show="getZml.login.isAuthenticated == true">
          <v-icon color="purple darken-2"> mdi-help-circle-outline </v-icon>
          If you have any questions or problems on this site, feel free to share any ideas
          with us. Drop an email to werner@zmlrekenaars.co.za. If you have content problems, speak to
          your teacher.
      </v-card>
     <v-card  class="ma-5 pa-4">
       <v-icon color="green darken-2"> mdi-information </v-icon>
       If you end up here after selecting a specific function, it usually means you do not have rights
       to access that function.
     </v-card>

      </v-col>
    </v-row>
    <v-container>


<!-- PROFILE --------------------->
    <v-dialog v-model="showProfile" :scrollable="true"
              persistent xwidth="70%"
              :fullscreen="$vuetify.breakpoint.mobile" max-width="600" width="auto">
   <Profile v-show="showProfile" @close="showProfile=false" />
    </v-dialog>
    </v-container>
  </v-container>
</template>


<script>
// eslint-disable-next-line
import { infoSnackbar,errorSnackbar } from '@/api/GlobalActions';
import { zmlConfig } from '@/api/constants';
import { zmlFetch } from '@/api/zmlFetch';
import { zmlLog } from '@/api/zmlLog.js';
//import router from '@/router';
import { getters } from "@/api/store";
import { zData } from "@/api/zGetBackgroundData.js"
import { ls } from "@/api/localStorage.js"
import Profile from "@/components/Profile.vue"

export default {
    name: "login",
    props: ['errorMessage'],
    components: {Profile},
    computed: {
    },
    data: () => ({
      hover: false,
      loginObj: {username:'', password: '', etc:''},
      getZml: getters.getState({ object:"gZml" }),
      inputRules: [
         v => v.length >= 3 || 'Minimum lenth is 3 characters'
      ],
      submitting: false,
      loginIcon: 'mdi-human-greeting',
      loading: null,
      showPassword: false,
      showProfile: false,
      hideForgotButton: false,
      overlay: true
  }),
  methods: {
    getData() {
      // this.$cs.l(this.$options.name,'p-getData')
      zData.initialData('Load Important Data')
      zData.calendarData('Load Holiday and Birthday Data')
      //zData.functionData('Load functions')
    },
    doBack() {
      // this.$cs.l(this.$options.name,'p-doBack')
      if (!this.goodPassword()) {
        return
      }
      this.getData();
      zmlLog(this.getZml.login.username , "Login", this.getZml.login.userid + ',' + this.getZml.login.lastdate)
      this.$router.go(-1)
    },
    goodPassword() {
      let chgPass = false
      let fixEmail = false
      if (this.getZml.login.password.toLowerCase() == 'password' || this.getZml.login.password.length < 5) {
        chgPass = true
      }
      if (!('email' in this.getZml.login) || this.getZml.login.email == '' ) {
        fixEmail = true
      }
      if (this.getZml.login.password == 'secret' || this.getZml.login.password == 'undefined') {
        chgPass = false
      }
      if (fixEmail && chgPass) {
        errorSnackbar("Please change your password and add an email address.")
        this.showProfile = true
        return false
      } else if (fixEmail) {
        errorSnackbar("Please supply an email address.")
        this.showProfile = true
        return false
      } else if (chgPass) {
        errorSnackbar("Please change your password.")
        this.showProfile = true
        return false
      }
      return true
    },
    startLearning() {
      // this.$cs.l(this.$options.name,'p-startLearning')
      if (!this.goodPassword()) return
      this.getData();
      this.loadLearn()
    },
    loadLearn() {
      // this.$cs.l(this.$options.name,'p-loadLearn')
      switch (this.getZml.login.type) {
        case 'student' :
        {
           //we have a grade value of 09E2 in login.grade, and we want to split it.
           //slice(startIndex[, endIndex])
           // this.$cs.l(this.$options.name,'p-push student')
           this.getZml.gradeLastChosen = 'G' + this.getZml.login.grade
           this.getZml.login.class  = this.getZml.login.grade.slice(3,4)
           this.getZml.login.gclass = this.getZml.login.grade.slice(2,4)
           //alert(this.getZml.login.grade)
           this.getZml.login.grade  = this.getZml.login.grade.slice(0,2).padStart(2,'0')
           //alert(this.getZml.login.grade)
           this.$router.push({ name: 'HomeStart' , meta: {layout: "AppLayoutDefault" }})
           break;
        }
        case 'teacher':
        {
          // this.$cs.l(this.$options.name,'p-push teacher')
          this.$router.push({ name: 'HomeStart' , meta: {layout: "AppLayoutDefault" }});
          break;
        }
        case 'admin' :
        {
          // this.$cs.l(this.$options.name,'p-push admin')
          this.$router.push({ name: 'HomeStart' , meta: {layout: "AppLayoutDefault" }});
          break;
        }
        default:
        {
          this.$router.push({ name: 'ViewCampaigns' ,meta: {layout: "AppLayoutGray" }});
          break;
        }
      }
      // this.$cs.l(this.$options.name,'p-after route change')
    },

    onEnter() {
      // this.$cs.l(this.$options.name,'p-onENter')
       if (this.getZml.login.isAuthenticated) {
         this.logout();
       } else {
         this.submit();
       }
       // this.$cs.l('after onEnter')
    },
    registrationMessage() {
        infoSnackbar("Sorry! No registration from Login Form. You are already registered.")
    },
    logout() {
      // this.$cs.l(this.$options.name,'p-logOut')
      const bye = 'Thanks for using the system ' + this.getZml.login.fullname + '!'
      infoSnackbar(bye);

      // Object.entries(this.getZml.login).forEach(([key, value]) => {
      //    key = ''
      //    this.$cs.l(`${key}: ${value}`)
      // });
      // Set default values
      this.getZml.login.lang = 'E'
      this.getZml.login.username = 'guest'
      this.getZml.login.isAuthenticated = false;
      ls.remove('login')
      ls.remove('zmllogin')
      // this.$router.push({ name: 'Home'}); // ,meta: {layout: "AppLayoutGray" }});
    },
    submit() {
      // this.$cs.l(this.$options.name,'p-subMit')
      if (this.submitting == false) {
          this.getZml.login.isAuthenticated = 0;
          this.submitting = true;
          /* Do so php and mysql here... */
          const login = {
              task: 'login',
              api: zmlConfig.apiDKHS,
              username: this.loginObj.username,
              password: this.loginObj.password
          }
          zmlFetch(login, this.doneWithLogin, this.loginFail);
      } else {
          this.loginIcon = 'mdi-emoticon-wink-outline';
          infoSnackbar("Please enter better values!");
      }
      // this.$cs.l('after submitting')
    },
    loginFail(error) {
      this.$cs.l(this.$options.name,'p-loginFail', error)
      this.submitting = false;
      infoSnackbar('LoginFailed: We could not make contact with our server. (' + error + ')')
    },
    doneWithLogin(response) {
      // this.$cs.l(this.$options.name,'p-doneLogin')
      this.submitting = false;
      if ('fullname' in response && response.error == '') {
          this.getZml.login = response;
          this.getZml.login.isAuthenticated = true;
          this.getZml.login.grade = response.grade;
          this.getZml.login.fullname = response.fullname;
          this.getZml.login.email = response.email;
          this.getZml.login.phone = response.phone;
          this.getZml.login.password = response.password;
          this.getZml.login.studentid = response.studentid;
          this.getZml.login.type = response.type;
          this.getZml.login.username = response.username;
          this.getZml.login.userid = response.userid ? response.userid : 0;
          this.getZml.login.logins = response.logins;
          this.getZml.login.lastdate = response.lastdate;
          if ('grade' in this.getZml.login && this.getZml.login.grade.includes('A')) {
            this.getZml.login.lang = 'A'
            this.$i18n.locale = 'af'
          } else {
            this.getZml.login.lang = 'E'
            this.$i18n.locale = 'en'
          }
          //Check if the guy is a superuser, and mark this.$superUser as true
          if (['JHMEL', 'WER', 'WERNER','TVRB'].includes(this.getZml.login.username.toUpperCase() )) {
            infoSnackbar('You are a SUPERUSER!')
            this.getZml.login.superUser = true
          }

          if (!this.goodPassword()) {
            zmlLog(this.loginObj.username, "LoginFail3", 'To easy password')

            this.showProfile = true
          } else {
            // this.$cs.l('welcome',response.username, this.getZml.login.lang, this.getZml.login.grade,'idx=',this.getZml.login.grade.indexOf('A'))

            // new user if added = 1
          if (response.added == 1  || response.password == 'password') {
            infoSnackbar('Welcome ' + this.getZml.login.fullname + ', please update your details');
            this.showProfile = 1;
            this.dropAnEmail()
          } else {
             infoSnackbar('Welcome ' + response.fullname  + '(' + response.username + ')' )
             this.saveLocalStorage()
              // if you open this, guy goes to home page after usual login
              // this.startLearning()
            }
          }
      } else {
        if ('error' in response) {
           errorSnackbar('Auth Failed:' + response.error)
           zmlLog(this.loginObj.username, "LoginFail1", response.error)
        } else {
           errorSnackbar('Auth Failed:' + 'Unknown User ')
           zmlLog(this.loginObj.username, "LoginFail2", this.loginObj.password)
        }


      }
    },
    dropAnEmail() {
      // this.$cs.l(this.$options.name,'p-dropEMail')
      // this.getZml.login.password = 'secret'
      let email =
              { subject  : "Learn1 : User has logged on " + this.getZml.login.fullname
               ,email_to :"faaktap@gmail.com"
               ,htmlmessage : '<h2> LEARN1 - logged on ' + zmlConfig.projectID + '</h2>'
                       + '<br>Username : '  + this.getZml.login.username
                       + '<br>Fullname : '  + this.getZml.login.fullname
                       + '<br>Language : '  + this.getZml.login.lang
                       + '<br>Logins : '    + this.getZml.login.logins
                       + '<br>Phone : '     + this.getZml.login.phone
                       + '<br>Studentid : ' + this.getZml.login.studentid
                       + '<br>Type : '      + this.getZml.login.type
                       + '<br>Username : '  + this.getZml.login.username
                       + '<br>Grade : '     + this.getZml.login.grade
                       + '<br>GClass : '    + this.getZml.login.gclass
                       + '<br>JSON'         + JSON.stringify( this.getZml.login )
               ,email_from : "admin@kuiliesonline.co.za"};
      zData.sendEmail(email)
    },
    loadFromLocalStorage() {
      //Check localstorage...
      if (ls.test('login')) {
         this.getZml.login = ls.load('login')
         this.loginObj.username = this.getZml.login.username
      } else if (ls.test('zmllogin')) {
         this.getZml.login = ls.load('zmllogin')
         this.loginObj.username = this.getZml.login.username
      }
      if (this.getZml.login.lang == 'A') {
            this.$i18n.locale = 'af'
      }
      /*
      if (localStorage.getItem('login')) {
        try {
          this.getZml.login = JSON.parse(localStorage.getItem('login'));
          this.loginObj.username = this.getZml.login.username
        } catch(e) {
          localStorage.removeItem('login')
        }
        if (this.getZml.login.lang == 'A') {
            this.$i18n.locale = 'af'
        }
        // this.$cs.l('ld frm lS',this.getZml.login.username)
      }
      */
    },
    saveLocalStorage() {
      if (this.getZml.login.username) {
        ls.save('zmllogin', this.getZml.login)
        /*
        let loginDetails = JSON.stringify(this.getZml.login)
        localStorage.setItem('login', loginDetails)
        */
      }
    },
    sendForgottenPasswordEmail(forgotPasswordLink) {
      if (!this.loginObj.email) {
        errorSnackbar('We cannot send an email if you do not have an email address!')
        return
      }
      let email =
        { subject  : "KuiliesOnline : Reset your password for user : " + this.loginObj.username
         ,email_to : this.loginObj.email
         ,htmlmessage : `<h2> Learn1 : Reset your password for user : ${this.loginObj.username}</h2> \
                 <p>
                 You seem to have forgotten your password on kuiliesonline?</p>
                 <p>
                 Please click on the link below to reset your password.<br>
                 <center> <a href="${forgotPasswordLink}"> Click Here </a> </center>
                 <br>
                 </p><p>
                 <br>
                 Alternatively, you can also click here - same thing.
                 <a href="${forgotPasswordLink}"> ${forgotPasswordLink} </a><br>
                 </p>
                 <br>
                 <p>Your password will be reset to the word : password , and you can change it
                 once you have logged in. (go to your Profile)
                 <br>
                 </p>
                 <br>
                 From : Kuilie Admin`
         ,email_from : "admin@kuiliesonline.co.za"};
      zData.sendEmail(email)
      infoSnackbar('Mail was sent to ' + this.loginObj.email)
    },
    forgotPassword() {
      if (!this.loginObj.username) {
        errorSnackbar("Please supply an username - we need your username to find your email.")
        return
      }
      let ts = {}
      ts.task = 'plainSql'
      ts.sql = `select user_email email from dkhs_learner where user_name = '${this.loginObj.username}'`
      zmlFetch(ts, this.finishedLoadingForgottenPasswordEmail, this.errorLoadingEmail)
      },
      errorLoadingEmail(error) {
        errorSnackbar('Sorry, We have a problem retrieving your email address')
        this.$cs.l('Email Retrieve Prob:',error)
      },
      finishedLoadingForgottenPasswordEmail(response) {
        // this.$cs.l(response)
        if (!('email' in response[0])) {
          errorSnackbar('Sorry, We have a problem retrieving your email address')
          return
        }
        this.loginObj.email = response[0].email
        let obj = this.loginObj
        obj.date = new Date()
        obj.version = zmlConfig.projectID
        let str = JSON.stringify(obj)
        let encodedString = btoa(str)
        // this.$cs.l('https://kuiliesonline.co.za/virtual-school/login/' + encodedString )
        this.sendForgottenPasswordEmail('https://kuiliesonline.co.za/virtual-school/login/' + encodedString)
    },
    testResp () {
      this.$cs.l('update good or bad')
    },


  },
  created: function() {
  },
  mounted: function () {
    this.loadFromLocalStorage()
    this.overlay=false
    if ('forgot' in this.$route.params && this.$route.params.forgot) {
      this.hideForgotButton = true
      // this.$cs.l('forgot = ', this.$route.params.forgot)
      let reverse = atob(this.$route.params.forgot)
      //alert(reverse)
      let obj = JSON.parse(reverse)
      // this.$cs.l('new update for forgotten password', obj)
      // We will reset the password to "password", allow him to login, and then force him to change
      this.loginObj = obj
      this.loginObj.password = 'password'
      let ts = {}
      ts.task = 'plainSql'
      ts.sql = `UPDATE dkhs_learner SET user_password = 'passWord' where user_name = '${this.loginObj.username}'`
      zmlFetch(ts, this.testResp, this.testResp)
    }
    if (this.errorMessage) {
      infoSnackbar(this.errorMessage)
    }
  }
}
</script>