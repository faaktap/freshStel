<template>
    <v-card v-if="functionList.length" class="ma-2 pa-2">
      <v-btn icon v-for="l in functionList"
            :key="l.functionid"
            :title="l.functionname"
            @click="click(l)"
            dark >
         <v-icon :color="cardColor(l.functionaccess)" v-text="l.icon"></v-icon>
      </v-btn>
   </v-card>
</template>

<script>
import { getters } from "@/api/store";
import { doStuff } from '@/api/buttons'
export default {
  name: "ListTestButtons",
  data: () => ({
      getZml: getters.getState({ object: "gZml" }),
      showMore:false,
      buttons: false,
  }),
  computed:{
    functionList() {
        if(!this.getZml.functions.length) return []
        return this.getZml.functions
    }
  },
  methods:{
       cardColor(type) {
           switch (type) {
               case 'teacher' : return "purple lighten-2"
               case 'student' : return "blue lighten-1"
               case 'admin' : return "green darken-2"
               default : return "orange darken-2"
           }
       },
       click(what) {
           console.log(what)
            if (doStuff(this.$router,what.payload) == 0) {
                console.log(what)
                if (what.payload.substr(0,4).toLowerCase() == 'http') {
                    window.open(what.payload,'_' + 'ko_external')
                }
            }
        },
   },
   mounted() {
    console.log('M',this.$options.name)
    this.$cs.l('M',this.$options.name)
   },

   created() {
    console.log('C',this.$options.name)
    this.$cs.l('C',this.$options.name)
   }
};
</script>