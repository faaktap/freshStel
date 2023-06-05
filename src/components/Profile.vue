<template>
      <v-card xwidth="600px">
        <v-card-title  class="mx-2 pa-0">Profile : {{ login.fullname }} </v-card-title>
        <span class="text-caption green float-right ma-2">
            Please make note of your password, or change it.<br> Click on the eye to view your password
        </span>
        <v-card-text class="ma-0 pa-0">
        <v-form class="ma-0 pa-0">
           <v-text-field
               v-model="login.username"
               prepend-icon="mdi-account"
               class="ma-2 pa-2"
               :disabled="login.userid > 0"
               label="Username" />
           <v-text-field
            v-model="login.password"
            label="Password"
            class="ma-2 pa-2"
            prepend-icon="mdi-lock"
            :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
            @click:append="showPassword = !showPassword"
            :type="showPassword ? 'text' : 'password'"
            name="password"
            autocomplete="current-password"
            required />
           <v-text-field prepend-icon="mdi-human" v-model="login.fullname" label="Fullname" required class="ma-2 pa-2" />
           <v-text-field prepend-icon="mdi-phone" v-model="login.phone" label="Phone"  class="ma-2 pa-2"  />
           <v-text-field prepend-icon="mdi-email" v-model="login.email" label="Email"  class="ma-2 pa-2" required />
          <p v-if="login.email == ''" class="text-caption red text-center"> You need an email if you forget your password </p>
        </v-form>
        </v-card-text>
        <v-card-actions class="ma-1 pa-1">
          <v-btn color="info" @click="$emit('close')" class="ma-2 pa-2"> Close </v-btn>
          <v-spacer />
          <v-btn color="primary" @click="saveDetails" class="ma-2 pa-2"> Save </v-btn>
        </v-card-actions>
      </v-card>
</template>

<script>
import { infoSnackbar,errorSnackbar } from '@/api/GlobalActions';
import { zmlConfig } from '@/api/constants';
import { zmlFetch } from '@/api/zmlFetch';
import { getters } from "@/api/store";
export default {
    name: "Profile",
    props: [],
    data: () => ({
      login: getters.getState({ object:"gZml" }).login,
      showPassword: false,
      getZml: getters.getState({ object:"gZml" }),
    }),
    methods: {
       saveDetails() {
         // this.$cs.l(this.$options.name,'p-saveDet')
         //we need to send the stuff for an update
         //alert("TEST")
         //alert(this.login.password.toUpperCase() )
         //console.log('[pppppppppppppppppppppppppp',this.login.password.toUpperCase() )
         if (!this.login.password || this.login.password.toUpperCase() == 'PASSWORD') {
             errorSnackbar('Try to think of better password than password please.')
             return
         }
         if (!this.login.email || !this.login.phone) {
             errorSnackbar('You need to supply an email address and a phone number please.')
             return
         }
         const login = {
               task: 'loginupdate',
               api: zmlConfig.apiDKHS,
               data: this.login}
         zmlFetch(login,this.doneWithUpdate, this.failUpdate)
       },
       doneWithUpdate(response) {
         if (response.errorcode == 0 ) {
           infoSnackbar('Your details has been updated ' + this.login.fullname)
           this.$emit('close')
         } else {
           errorSnackbar('We have a problem to update your details ' + response.error)
         }
       },
       failUpdate(response) {
         errorSnackbar('We have a problem to update your details ' + response.errorcode)
       },
    },
    mounted() {
      //console.log(this.getZml, this.login)
    }
}
</script>