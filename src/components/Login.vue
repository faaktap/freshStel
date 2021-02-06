<template>
 <v-container>
  <v-row class="justify-center"  align="center" justify-center>
   
    <v-col v-if="getZml.login.isAuthenticated" 
           class="mx-auto my-12">
     <v-card max-width="500"
           color=#F5F5F5
           style="overflow: auto;"
          :elevation="hover ? 12 : 2"
          :class="{'on-hover': hover,'overwrite-hover': $vuetify.breakpoint.xsOnly}"
     >
      <v-card-title>
       <h2> Kuilies Logout  </h2>
      </v-card-title>  
      <v-card-text>
       Thanks for using the system {{ getZml.login.name }}!
       <br>You will be logged out once you click the button.
      </v-card-text>
      <v-card-actions>
        <v-spacer />
       <v-btn class="mx-0 mt-3"  @click="logout" color="info">
        Logout
       </v-btn>  
      </v-card-actions>        
     </v-card>
    </v-col>
<!-- ------------------------------------ -->    
     <v-col v-else 
             class="mx-auto my-12 justify-center"> 
     <v-hover v-slot:default="{ hover }">
      <v-card  xmax-width="500"
           color=#F5F5F5
           style="xoverflow: auto;"
          :elevation="hover ? 12 : 2"
          :class="{'on-hover': hover,'overwrite-hover': $vuetify.breakpoint.xsOnly}"
      >
       <v-card-title>
        <h2> Kuilies Login</h2>
       </v-card-title>
       <v-card-text>
        <v-form class="px-3" ref="loginForm" width="400" v-on:submit.prevent="onSubmit">
         <v-text-field  label="User" 
            v-model="loginObj.username" 
            autocomplete="username"
            prepend-icon="mdi-account-circle" 
            :rules="inputRules"
            autofocus 
         />
         <v-text-field 
            label="Password" 
            autocomplete="current-password"
            v-model="loginObj.password" 
            prepend-icon="mdi-lock" 
            :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
            @click:append="showPassword = !showPassword"
            :type="showPassword ? 'text' : 'password'" 
            v-on:keyup.enter="onEnter"
         />
        </v-form>
       </v-card-text>
       <v-card-actions>
        <v-btn @click="registrationMessage()" class="mx-0 mt-3" color="info"> Register </v-btn>
        <v-spacer />
        <v-btn 
            class="mx-0 mt-3"
            :loading="submitting"
            @click.prevent="submit"
            color="info"
            :disabled="submitting"
        >  Login </v-btn>        
       </v-card-actions>   
      </v-card>
  </v-hover>
 </v-col><!-- Else End-->
    </v-row>
    <v-row>
      <v-col> 
        <v-card class="ma-5 pa-4" v-show="getZml.login.isAuthenticated == false"> 
          <v-icon color="purple darken-2"> mdi-help-circle-outline </v-icon> If you are a learner, your login would start with your schoolno, and 
          if you are a teacher it would be your teacher login details. Request them from Werner at  082 563 9790
          if you are unsure.</v-card>  
        <v-card class="ma-5 pa-4" v-show="getZml.login.isAuthenticated == true"> 
          <v-icon color="purple darken-2"> mdi-help-circle-outline </v-icon> 
          If you have any questions or problems on this site, feel free to share any ideas
          with us. Drop an email to werner@zmlrekenaars.co.za. If you have content problems, speak to
          your teacher.</v-card>  

      </v-col>
    </v-row>
    <v-container>
    <v-dialog v-model="showDialog" :scrollable="false" persistent width="50%" dark>
      <v-row>
        <v-col cols="12">
      <v-card>
        <v-card-title> Registration Complete </v-card-title>
        <v-card-subtitle> Please make note of your password, or change it</v-card-subtitle>
        <v-card-text>
          <v-row>
            <v-col cols="6">
         <v-text-field v-model="getZml.login.username" label="Username" required />
            </v-col>
            <v-col cols="6">
         <v-text-field v-model="getZml.login.password" label="Password" required />
            </v-col>
            <v-col cols="6">
         <v-text-field v-model="getZml.login.name" label="Fullname" required />
            </v-col>
            <v-col cols="6">
         <v-text-field v-model="getZml.login.type" label="Type" disabled />
            </v-col>
            <v-col cols="6">
         <v-text-field v-model="getZml.login.grade" label="Grade" disabled />
            </v-col>
            <v-col cols="3">
         <v-text-field v-model="getZml.login.class" label="Class" disabled />
            </v-col>
            <v-col cols="3">
         <v-text-field v-model="getZml.login.studentid" label="StudentID" disabled />
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-btn color="info" @click="startLearning"> Continue </v-btn>
          <v-spacer />
          <v-btn color="primary" @click="saveDetails"> Save </v-btn>
        </v-card-actions>
      </v-card>
        </v-col>
      </v-row>
    </v-dialog>
    </v-container>
  </v-container>
</template>


<script>
// eslint-disable-next-line
import { infoSnackbar,errorSnackbar } from '@/api/GlobalActions';
import { zmlConfig } from '@/api/constants';
import router from '@/router';
import { getters } from "@/api/store";
import { zmlFetch } from '@/api/zmlFetch';
export default {
     name: "login"
    ,props: []
    ,components: {}
    ,computed: {
      testMe() {
        return ('hallo');
      }
    }    
    ,data() {
      return {
        hover: false,
        loginObj: {username:'', password: ''},
        getZml: getters.getState({ object:"gZml" }),
        inputRules: [
           v => v.length >= 4 || 'Minimum lenth is 4 characters'
        ],
        submitting: false,
        loginIcon: 'mdi-human-greeting',
        loading: null,
        showPassword: false,
        showDialog: false,          
      }
  }
  ,methods: {
       onEnter: function() {
          if (this.getZml.login.isAuthenticated) {
            this.logout();
          } else {
            this.submit();
          }
       },
       registrationMessage() {
           infoSnackbar("Sorry! No registration from Login Form. You are already registered.")
       },
       logout() {
          const bye = 'Thanks for using the system ' + this.getZml.login.name + '!'
          infoSnackbar(bye);         
          this.getZml.login.class = ''
          this.getZml.login.grade = ''
          this.getZml.login.name = ''
          this.getZml.login.password = ''
          this.getZml.login.studentid = ''
          this.getZml.login.type = ''
          this.getZml.login.username = ''
          this.getZml.login.isAuthenticated = false;
          router.push({ name: 'Home'}); // ,meta: {layout: "AppLayoutGray" }});
       },
       submit() {
          if (this.$refs.loginForm.validate()) {
              this.getZml.login.isAuthenticated = 0;
              this.submitting = true;
              /* Do so php and mysql here... */
              const login = {
                  task: 'login',
                  api: 'http://localhost:81/api/dkhs/dkhs.php',
                  username: this.loginObj.username,
                  password: this.loginObj.password};
              zmlFetch(login,this.doneWithLogin, this.loginFail);
          } else {
              this.loginIcon = 'mdi-emoticon-wink-outline';
              infoSnackbar("Please enter better values!");
          }
       },
       loginFail(error) {
          this.submitting = false;                 
          infoSnackbar('LoginFailed: We could not make contact with our server. (' + error + ')')
       },
       doneWithLogin(response) {
          this.submitting = false;
          if (!response.error) {
            infoSnackbar('Welcome ' + response.fullname ? response.fullname : response.username)
            this.getZml.login.isAuthenticated = true;
            this.getZml.login.class = response.class;
            this.getZml.login.grade = response.grade;
            this.getZml.login.name = response.name;
            this.getZml.login.password = response.password;
            this.getZml.login.studentid = response.studentid;
            this.getZml.login.type = response.type;
            this.getZml.login.username = response.username;
            zmlFetch({task: 'getsubjects'}, this.loadSubjects, this.loadError);
            if (response.added == 1) {
              infoSnackbar('Welcome ' + this.getZml.login.name + ', please update your details');
              this.showDialog = 1; 
            } else {
              router.push({ name: 'Material' , params:{heading:"Grade"},meta: {layout: "AppLayoutGray" }});
            }
          } else {
            console.log('failed:',response)
            errorSnackbar('Auth Failed:' + response.error)
          }
      },
      loadSubjects(response) {
          console.log('Subjects : ', response);
          this.getZml.subjects = response;
      },
      loadError(error) {
          console.log(error);
          alert('Nothing loaded yet (possibly) - error : ' + error);
      },
      startLearning() {
         router.push({ name: 'Material' , params:{heading:"Grade"},meta: {layout: "AppLayoutGray" }});
      },
      saveDetails() {
         alert('update details')
      },
      dropAnEmail(){
        let email = {method : "advemail" ,subject  : "User has logged on" + this.getZml.login.name
                 ,email_to :"faaktap@gmail.com"
                 ,htmlmessage : this.getZml.companyTitle + ' logged on ' 
                         + this.getZml.login.name + '<br> ' + this.getZml.login.username
                 ,email_cc:"",email_replyto:"",test : "yes"
                 ,email_from : "admin@zmlrekenaars.co.za"
                 ,trusted_user : "werner@zmlrekenaars.co.za" };
        let apiConfig = {method: 'POST', headers: {'Accept': 'application/json'
                         , api: 'http://localhost:81/api/dkhs/dkhs.php'
                         , 'Content-Type': 'application/json;charset=UTF-8'},
              body: JSON.stringify(email)};
        fetch(zmlConfig.emailPath, apiConfig);
      },
  },
  created: function() {  
     //console.log('created - login');
  },
  mounted: function () {
    console.log('mounting :', this.$options.name
                            , 'c=', this.$children.length)
  }
}

</script>