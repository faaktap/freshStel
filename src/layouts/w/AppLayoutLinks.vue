<template>
<nav>
  <template v-if="getZml.login.isAuthenticated == true">
  <v-app-bar app color="#45516b" :title="programname">
    <v-app-bar-nav-icon @click="menu = true" dark></v-app-bar-nav-icon>
    <zml-title :maintitle="programname" />
    <toolbar-buttons menuDisplay="horizontal" :buttonGroup="toolbars"/>
    <v-spacer />
    <login-button/>
    <v-dialog v-model="menu"  :fullscreen="$vuetify.breakpoint.mobile" max-width="600" width="auto" height="400">
      <v-card>
       <v-card-title>
        <base-tool :toolList="[]" toolbarName="DKMenu" :loading="menuLoading" :background="false" :back="false">


        <v-btn-toggle group shaped rounded dense v-model="menuType" color="green" class="ma-1" >
        <v-btn small value="all" v-if="getZml.login.type!='student'">all</v-btn>
        <v-btn small value="admin" v-if="getZml.login.type!='student'">admin</v-btn>
        <v-btn small value="teacher" v-if="getZml.login.type!='student'">teacher</v-btn>
        <v-btn small value="student">student</v-btn>
        <v-btn small value="other">other</v-btn>
        </v-btn-toggle>

        <v-btn icon class="ma-1"
         title="Allow search in menu"
         @click="menuSearch = !menuSearch; if (menuSearch) document.getElementById('theSearch').focus();"
        ><v-icon> mdi-card-search </v-icon>
        </v-btn>

        <v-btn icon class="ma-1"
         title="Make the menu listing appear smaller or larger"
         @click="menuSmall =! menuSmall"
        > <v-icon v-show="menuSmall"> S </v-icon>
          <v-icon v-show="!menuSmall"> L </v-icon>
        </v-btn>

        <v-btn icon class="ma-1"
         title="Show more information about menu items"
         @click="menuInfo = !menuInfo">
          <v-icon> mdi-information </v-icon>
        </v-btn>
        <v-btn icon @click="menu = !menu" title="Go Back">
          <v-icon>mdi-close</v-icon>
        </v-btn>
        </base-tool>
       </v-card-title>
       <v-card-text>
          <list-test-buttons :info="menuInfo" :small="menuSmall" :type="menuType" :functionSearch="menuSearch" />
       </v-card-text>
      </v-card>
    </v-dialog>
  </v-app-bar>
  </template>

  <template v-else>
    <v-app-bar app color="#45516b" :title="programname">
      <zml-title :maintitle="programname" />
    <v-spacer />
    <login-button/>
  </v-app-bar>
   </template>
</nav>
</template>

<script>
import { getters } from "@/api/store"
import LoginButton from '@/components/loginButton'
import ToolbarButtons from '@/components/toolbarButtons'
//import DkhsLogo from '@/components/image/DkhsLogo'
//import DkhsRegteLogo from '@/components/image/DkhsRegteLogo.vue'
import zmlTitle from '@/components/zmlTitle'
import ListTestButtons from '@/components/ListTestButtons.vue';
import baseTool from '@/components/base/baseTool.vue'
export default {
name: "AppLayoutLinks",
components: {LoginButton
            ,zmlTitle
            ,ToolbarButtons
            //,DkhsLogo
            //,DkhsRegteLogo
            , ListTestButtons
            , baseTool
            },
data: () => ({
  getZml: getters.getState({ object: "gZml" }),
  toolbars:['tool'],
  menu:false,
        menuInfo: false,
        menuSmall: false,
        menuType: 'all',
        menuSearch:false,
        menuLoading:false,
        menuTypes:['all','admin','teacher','student','other']
}),
methods: {
      menuChangeType() {
        if (this.getZml.login.type == '' || this.getZml.login.type == 'student') {
          if (this.menuType == 'student') { this.menuType = 'other'; return}
          if (this.menuType == 'other') { this.menuType = 'student'; return}
        } else {
          if (this.menuType == 'all') { this.menuType = 'admin'; return}
          if (this.menuType == 'admin') { this.menuType = 'teacher'; return}
          if (this.menuType == 'teacher') { this.menuType = 'student'; return}
          if (this.menuType == 'student') { this.menuType = 'other'; return}
          if (this.menuType == 'other') { this.menuType = 'all'; return}
        }
      },
},
computed: {
  programname() {    return this.$t('message.programname');  },
  herotitle() {    return this.$t('message.herotitle');  },
},
mounted: function () {
  if (this.getZml.login.type == '' || this.getZml.login.type == 'student') this.menuType = 'student'

}
}
</script>
