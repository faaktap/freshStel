<!--
 LoginButton is usally in the right hand side top of the menubar.
 It creates a complete menu, where all login stuff happens, and also stuff we do not want on main toolbar.
-->
<template>
 <div class="text-center ma-4">
  <transition name="slide-fade">
    <v-menu xxopen-on-hover  top  xoffset-y  max-height="400"  close-on-content-click xdark>

     <v-toolbar color="white">
      <!-- When Dropped down -->
      <v-layout justify-space-between>
        <span><v-icon class="mr-2"> mdi-human</v-icon>{{ currentUser }} </span>
        <v-spacer />
        <v-icon>mdi-close</v-icon>
      </v-layout>
      </v-toolbar>
      <!-- On the menu when not dropped -->
      <template v-slot:activator="{ on, attrs }">
       <v-btn v-bind="attrs" v-on="on">
        <v-icon>mdi-navigation</v-icon>
        <div v-if="!$vuetify.breakpoint.smAndDown">
         {{ getZml.login.isAuthenticated ? getZml.login.username : loginHeading }}
        </div>
        </v-btn>
      </template>

      <v-card v-if="getZml.login.isAuthenticated" elevation="3" color="white" >
        <v-card-title>
           <avatar class="mt-1 mb-0 mr-4 pa-0" :username="getZml.login.fullname"   @clickAvatar="showProfile" />
           {{ getZml.login.fullname}}
        </v-card-title>
        <v-card-subtitle class="ma-1 pa-1"> Information/Stats </v-card-subtitle>
        <v-card-text>
          <ul>
          <li>Logins : {{ getZml.login.logins }} </li>
          <li>Last Login : {{ getZml.login.lastdate }}</li>
          <li>Language - {{getZml.login.lang }}</li>
          <li>Type - {{getZml.login.type }}</li>
          <li>Email - <span v-if="getZml.login.email"> {{getZml.login.email }}</span>
                      <span v-else color="red"> Please supply an email address! </span>

          </li>
          </ul>
        </v-card-text>
        <v-card-actions class="ma-0 pa-0">
           <v-btn v-show="getZml.login.type != 'student'"
                  to="/userlist" small rounded
                  class="blue--text font-weight-black">
             Reset Passwords
           </v-btn>
           <v-btn small rounded
                 @click="switchLocale"
                  title="Click here to change locale. (Language)"
                  class="blue--text font-weight-black">
             {{ displayLocale }}
           </v-btn>

           <v-btn small rounded @click="showProfile = true" class="blue--text font-weight-black"
                  title="Change password, email, etc...">
              Profile
           </v-btn>
           <v-spacer />
           <v-btn to="/login"
                 small rounded
                 class="blue--text font-weight-black"> Logout </v-btn>

        </v-card-actions>
        <div class="ma-2 caption"> <v-icon small>mdi-brain</v-icon>{{programname}} version {{ version }}</div>
        <v-card-text>
          <ul v-if="showWerner" class="text-caption">
            <li><v-btn x-small light @click="showWerner = false"> hide </v-btn></li>
            <li><v-btn x-small light to="/viewfunctions"> funcs </v-btn></li>
            <li><v-btn x-small light to="/wernertest"> wt </v-btn></li>
            <li v-if="getZml.login.superUser" class="text-caption"> DEBUG: {{ getZml.login }}</li>
            <li>username - {{getZml.login.username }}</li>

            <li>error - {{getZml.login.error }}</li>
            <li>phone - {{getZml.login.phone }}</li>
            <li>grade - {{getZml.login.grade }}</li>
            <li>fullname - {{getZml.login.fullname }}</li>

            <li>studentid- {{getZml.login.studentid }}</li>
            <li>userid - {{getZml.login.userid }}</li>
            <li>logins - {{getZml.login.logins }}</li>
            <li>added - {{getZml.login.added }}</li>
            <li>isAuthenticated - {{getZml.login.isAuthenticated }}</li>

          </ul>
        </v-card-text>
        <!-- <toolbar-buttons menuDisplay="vertical" :buttonGroup="toolbars" /> -->
      </v-card>
      <v-card v-else elevation="3" color="white">
        <v-card-title> Kuilies Online </v-card-title>
        <v-card-text>
          Please login to use KuiliesOnline
          <br>
          If you forgot your password, and provided an email when you registered, type your schoolnumber or menemonic, and press the reset button.
        </v-card-text>
        <v-card-actions>
        <v-btn to="/login" color="primary" small> {{ loginHeading }} </v-btn>
        </v-card-actions>
      </v-card>
    </v-menu>
     </transition>
  <v-dialog v-model="showProfile" scrollable
           :fullscreen="$vuetify.breakpoint.mobile" height="auto" max-width="600" width="auto">
  <Profile class="pa-2" v-show="showProfile" @close="showProfile=false" />
  </v-dialog>
</div>
</template>

<script>
//import ToolbarButtons from '@/components/toolbarButtons'
import { zmlConfig } from '@/api/constants.js'
import { getters } from "@/api/store";
import Avatar from '@/components/base/Avatar'
import Profile from "@/components/Profile.vue"
  export default {
    name: "loginButton",
    components: {Avatar, Profile},
    data: () => ({
      getZml: getters.getState({ object: "gZml" }),
      toolbars:['tool','test','login'],
      showWerner:false,
      showProfile: false
    }),
    methods:{
       test(item) {
           alert("you clicked on " + item.title)
       },
       switchLocale () {
         if (this.$i18n.locale === 'af') {
             this.$i18n.locale = 'en'
         } else {
             this.$i18n.locale = 'af'
         }
         localStorage.setItem('currentLocale',this.$i18n.locale)
       }
    },
    computed: {
        currentUser() { return this.getZml.login.isAuthenticated ? this.getZml.login.username : 'Guest' },
        loginHeading()    { return this.$t('message.LoginHeading') },
        rightMenuButton() { return this.$t('btn.rightmenubutton') },
        programname()     { return this.$t('message.programname') },
        version()         { return zmlConfig.projectID },
        displayLocale() {
         let other = 'af'
         if (this.$i18n.locale === 'af') {
           other = 'en'
         }
         return other
        }
    },
    mounted:function() {
        this.showWerner = this.getZml.login.superUser
        if (this.getZml.login.isAuthenticated == true) {
          //Login - Auth True',this.version)
        } else {
          //Login - Auth False',this.version)
        }
    }
  }
</script>

<style scoped>

.slide-fade-enter-active {
  transition: all 1.2s ease;
}
.slide-fade-leave-active {
  transition: all 1.8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active below version 2.1.8 */ {
  transform: translateY(30px);
  opacity: 0.8;
}

</style>