<template>
 <!-- <v-row>
  <v-col cols="12" lg="6"> -->
   <transition name="fade" mode="out-in" duration="1500">
   <v-card class="ma-2">
    <v-list subheader class="transition-fast-in-fast-out v-card--reveal ">
      <v-subheader :class="cardColor(functiongroup)">  Access: {{ functiongroup }}
        <v-spacer />
        <v-btn text x-small title="Show more or less" @click="showMore = !showMore"> .. </v-btn>
      </v-subheader>
      <v-list-item-group >
       <v-list-item v-for="l in functionList"
                   :key="l.functionid" v-ripple  @click="click(l)">
         <v-list-item-content>
            <v-list-item-title>
              <v-icon :color="cardColor(l.functionaccess)" v-text="l.icon"></v-icon>
              {{ l.functionname }}
            </v-list-item-title>
            <v-list-item-subtitle
                 v-if="showMore"
                 v-text="l.tip"
            />
         </v-list-item-content>
       </v-list-item>
      </v-list-item-group>
    </v-list>
    <v-divider></v-divider>

   </v-card>
   </transition>
   <!-- </v-col>
  </v-row> -->
</template>

<script>
import { getters } from "@/api/store";
import { doStuff } from '@/api/buttons'
import { infoSnackbar } from '@/api/GlobalActions';
export default {
  name: "ListTest",
  props: ["functiongroup"],
  data: () => ({
      getZml: getters.getState({ object: "gZml" }),
      showMore:false
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
               default : return "orange lighten-4"
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
