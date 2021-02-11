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
   <v-row>
    <v-col align="right" md="3" cols="3">
      <v-card color="#45516b" class="ml-3 pt-4 mb-4 fill-height text-center white--text font-weight-black">
        <v-btn to="/login" icon align="right" class="white--text font-weight-black"> Login </v-btn>
      </v-card>
    </v-col>
    <v-col md="6" cols="6">
      <v-card color="#45516b" class="ml-3 pt-4 mb-4 fill-height text-center white--text font-weight-black">
        <v-btn to="/login" outlined align="right" class="white--text font-weight-black">
        De Kuilen Online Resources - Hopefully zero rated in 2021
        </v-btn>
      </v-card>
    </v-col>
    <v-col align="right" md="3" cols="3">
      <v-card color="#45516b" class="mr-3 pt-4 mb-4 fill-height text-center white--text font-weight-black">
        <v-btn to="/login" icon align="right" class="white--text font-weight-black"> Login </v-btn>
      </v-card>
    </v-col>
   </v-row>
   </template>

</nav>
</template>

<script>
import { getters } from "@/api/store"
import LoginButton from '@/components/loginButton'
import ToolbarButtons from '@/components/toolbarButtons'
import zmlTitle from '@/components/zmlTitle'
export default {
name: "AppLayoutLinks",
components: {LoginButton, zmlTitle, ToolbarButtons},
data: () => ({
  getZml: getters.getState({ object: "gZml" }),
  mainIcon: ["mdi-kettle","mdi-kettle-steam-outline","mdi-kettle-steam","mdi-coffee"],
  curIcon: 1,
  toolbars:['tool'],
}),
methods: {},
computed: {
  programname() {
    return this.$t('message.programname');
  },
},
mounted: function () {
 
}
}
</script>
