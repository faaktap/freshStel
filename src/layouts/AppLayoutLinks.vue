<template>
<nav>

  <template v-if="getZml.login.isAuthenticated == true">
  <v-app-bar app color="#45516b" :title="programname">
    <zml-title :maintitle="programname" />
    <toolbar-buttons menuDisplay="horizontal" :buttonGroup="toolbars" />
    <v-spacer />
    <login-button/>
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
export default {
name: "AppLayoutLinks",
components: {LoginButton
            ,zmlTitle
            ,ToolbarButtons
            //,DkhsLogo
            //,DkhsRegteLogo
            },
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
