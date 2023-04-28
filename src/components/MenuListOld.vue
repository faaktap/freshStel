<template>
 <!-- v-if="getZml.login.isAuthenticated && ['admin','teacher'].includes(getZml.login.type)"  -->
 <v-container fluid class="ma-0 pa-0">

 <v-template v-if="buttonDisplay==0" row wrap align-content-center justify-space-between max-width="350">
  <h3 title="Show different View" @click="buttonDisplay = 1">{{ functiongroup.toUpperCase() }}</h3>
  <v-template :xclass="cardColor(functiongroup)"  class="ma-2 pa-2"  v-for="l in functionList" :key="l.functionid" v-ripple  @click="click(l)">
    <v-btn small :color="cardColor(l.functionaccess)" :title="l.tip" class="ma-2 pa-2">
    <v-icon small>{{ l.icon }}</v-icon>{{ l.functionname }}
    </v-btn>
  </v-template>
 </v-template>

   <v-card class="ma-0 pa-0"  max-width="350" v-if="buttonDisplay==1">
    <v-list subheader class="transition-fast-in-fast-out v-card--reveal ">
      <v-subheader :class="cardColor(functiongroup)">
          Access: {{ functiongroup }}
        <v-spacer />
        <v-btn text x-small title="Show different View" @click="buttonDisplay = 0"> v </v-btn>
        <v-btn text x-small title="Show more or less" @click="showMore = !showMore"> m </v-btn>
      </v-subheader>

      <v-list-item-group >
       <v-list-item v-for="l in functionList"
                   :key="l.functionid" v-ripple  @click="click(l)">
         <v-list-item-content>
            <v-list-item-title>
              <v-icon :color="cardColor(l.functionaccess)">{{ l.icon }}</v-icon>
              {{ l.functionname }}
            </v-list-item-title>
            <v-list-item-subtitle v-if="showMore" >
              {{ l.tip }}
            </v-list-item-subtitle>
         </v-list-item-content>
       </v-list-item>
      </v-list-item-group>
    </v-list>
    <v-divider></v-divider>
    <v-btn text x-small title="Buttons" @click="buttons = !buttons"> .. </v-btn>
    <v-card v-if="buttons">
      <v-btn icon v-for="l in functionList"
            :key="l.functionid"
            :title="l.functionname"
            @click="click(l)">
         <v-icon :color="cardColor(l.functionaccess)" > {{ l.icon }}</v-icon>
      </v-btn>
    </v-card>
   </v-card>

  </v-container>
</template>

<script>
import { getters } from "@/api/store";
import { doStuff } from '@/api/buttons'
import { infoSnackbar } from '@/api/GlobalActions';
export default {
  name: "MenuList",
  props: ["functiongroup"],
  data: () => ({
      getZml: getters.getState({ object: "gZml" }),
      showMore:false,
      buttons: false,
      buttonDisplay: 1,
  }),
  computed:{
    functionList() {
      let functionName = this.functiongroup
      if (functionName && (functionName == '' || functionName == 'all')) {
        return this.getZml.functions
      }
      return this.getZml.functions.filter(element => element.functionaccess === functionName)

    }
  },
  methods:{
       cardColor(type) {
           switch (type) {
               case 'teacher' : return "light-green lighten-3"
               case 'student' : return "green lighten-2"
               case 'admin' : return "green accent-3"
               default : return "indigo lighten-4"
           }
       },
       click(what) {
           console.log(what)
            if (doStuff(this.$router,what.payload) == 0) {
                console.log(what)
                if (what.payload.substr(0,4).toLowerCase() == 'http') {
                    window.open(what.payload,'_' + 'ko_external')
                } else {
                    infoSnackbar('Sorry, we do not handle ' + what.payload + ' yet!' )
                }
            }
        },
   },
   mounted() {
    this.$cs.l('M',this.$options.name)
   }
};
</script>

<style lang="scss">
.box {
  width: 200px;
  height: 200px;
  margin-top: 20px;
  background-color: rgb(108, 141, 213);
  box-shadow: rgba(108, 141, 213, 0.5) 0px 6px 20px;
  border-radius: 10px;
}
.red-box {
  @extend .box;
  background-color: rgb(251, 17, 116);
  box-shadow: rgba(251, 17, 116, 0.5) 0px 6px 20px;
}
</style>
