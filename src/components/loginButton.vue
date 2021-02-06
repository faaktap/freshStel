<!--
 LoginButton is usally in the right hand side top of the menubar.
 It creates a complete menu, where alll login stuff happens, and also stuff we do not want on main toolbar.
-->
<template>
 <div class="text-center">
    <v-menu open-on-hover  top  xoffset-y  max-height="400"  close-on-content-click dark>
     <v-toolbar color="teal" dark>
      <v-app-bar-nav-icon></v-app-bar-nav-icon>
      <v-toolbar-title>{{ rightMenuButton }}</v-toolbar-title>
      <v-spacer></v-spacer>
      </v-toolbar>    
      <template v-slot:activator="{ on, attrs }">
       <v-btn v-bind="attrs" v-on="on">
        <v-icon>mdi-navigation</v-icon>
        <div v-if="!$vuetify.breakpoint.smAndDown">
          {{ rightMenuButton }}
        </div>
        </v-btn>
      </template>
      
      <!--show the toobar buttons not at the top-->
      <toolbar-buttons :vertical="false" buttonType="tool" />

      <!--show the toobar buttons not at the top-->
      <toolbar-buttons :vertical="false" buttonType="test" />

      <!--show the login buttons-->
      <toolbar-buttons :vertical="false" buttonType="login" />
      
      <v-card elevation="3"> 
        <v-card-title> Name Surnam </v-card-title>
        <v-card-subtitle> Name Surnam </v-card-subtitle>
        <v-card-text> Something smallerm that he can read if he wants to</v-card-text>
        <div class="ma-2 caption"> <v-icon small>mdi-brain</v-icon>{{programname}} vers:0.112</div>
      </v-card>
    </v-menu>
</div>
</template>

<script>
import ToolbarButtons from '@/components/toolbarButtons'
import { getters } from "@/api/store";
  export default {
    components: {ToolbarButtons},
    data: () => ({
      getZml: getters.getState({ object: "gZml" }),
    }),
    methods:{
       test(item) {
           alert("you clicked on " + item.title)
       } 
    },
    computed: {
        LoginHeading()    { return this.$t('message.LoginHeading') },
        rightMenuButton() { return this.$t('btn.rightmenubutton') },
        programname()     { return this.$t('message.programname') },
    },
    mounted:function() {
        if (this.getZml.login.isAuthenticated == true) {
          console.log('auth')
        } else {
          console.log('no auth')  
        }
    }
  }
</script>