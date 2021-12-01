<template>
<nav>
  <template v-if="getZml.login.isAuthenticated == true">
  <v-app-bar app color="#45516b" :title="programname">
      
    <zml-title :maintitle="programname" />
    
    <toolbar-buttons menuDisplay="horizontal" :buttonGroup="toolbars"/>
    <v-spacer />
    <login-button/>
    
  </v-app-bar>
  </template>  
  <template v-else>
    <v-card color="#45516b">
      <!-- <v-layout align-center justify-center>
        <v-flex fill-height><v-card class="text-center">xxxxxxxxxxxxxxx</v-card></v-flex>
        <v-flex fill-height>yyyyyyyyyyyyyyyy</v-flex>
        <v-flex fill-height><v-card>zzzzzzzzzzzzzzzzz</v-card></v-flex>
      </v-layout> -->
      <!-- <v-row align-center justify-center>
        <v-col fill-height><v-card class="text-center">xxxxxxxxxxxxxxx</v-card></v-col>
        <v-col fill-height><v-card class="text-center">yyyyyyyyyyyyyyyy</v-card></v-col>
        <v-col fill-height><v-card>zzzzzzzzzzzzzzzzz</v-card></v-col>
      </v-row> -->

      <v-layout row align-center >
      <v-flex fill-height> 
         <v-card class="text-center" color="#45516b">
           
        <v-btn color="#45516b" 
               to="/login" 
               elevation="1"
               class="ml-3 white--text font-weight-black text-center"
        > 
         Student Login 
        </v-btn>
        <dkhs-logo />
         </v-card>
       </v-flex>

      <v-flex v-if="!$vuetify.breakpoint.smAndDown" fill-height> 
      <v-card color="#45516b" class="ml-3 pt-4 mb-4 fill-height text-center white--text font-weight-black">
        
        <h2> {{ herotitle }} </h2> 
      </v-card>
      </v-flex>

      <v-flex fill-height> 
        <v-card class="text-center" color="#45516b">
          <dkhs-regte-logo />
        <v-btn to="/login"  
               color="#45516b" 
               xalign="right"
               class="ml-3 white--text font-weight-black text-center"
               elevation="1">
           Educator Login </v-btn>
                   
        </v-card>
      </v-flex>
      </v-layout>
    </v-card>
   </template>

</nav>
</template>

<script>
import { getters } from "@/api/store"
import LoginButton from '@/components/loginButton'
import ToolbarButtons from '@/components/toolbarButtons'
import DkhsLogo from '@/components/image/DkhsLogo'
import DkhsRegteLogo from '@/components/image/DkhsRegteLogo.vue'
import zmlTitle from '@/components/zmlTitle'
export default {
name: "AppLayoutLinks",
components: {LoginButton, zmlTitle, ToolbarButtons,DkhsLogo,DkhsRegteLogo},
data: () => ({
  getZml: getters.getState({ object: "gZml" }),
  toolbars:['tool'],
}),
methods: {},
computed: {
  programname() {    return this.$t('message.programname');  },
  herotitle() {    return this.$t('message.herotitle');  },
},
mounted: function () {
 
}
}
</script>
