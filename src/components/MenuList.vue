<template>
<div>

    <v-row v-if="list.length > 0">
      <v-col
        v-for="item in list"
       :key="item.functionid"
        cols="4"
      >
      <template v-if="!$vuetify.breakpoint.smAndDown">
        <v-card height="200" :color="item.functionaccess | cc" >
            <v-card-title>
                {{ item.functionname }}
            </v-card-title>
            <v-card-text v-if="!$vuetify.breakpoint.smAndDown">
               {{ item.tip }}
            </v-card-text>
         <v-card-actions>
          <zml-button-tool 
             bottom 
            :btnFace="item.shortname" 
            color="primary" 
            :toolTip="item.tip"
            :icon="item.icon"
          @clicked="click(item)" /> 
         </v-card-actions>
        </v-card>
      </template>
      <template v-else>      
          <zml-button-tool 
             bottom 
            :btnFace="item.shortname" 
            color="primary" 
            :toolTip="item.tip"
            :icon="item.icon"
          @clicked="click(item)" /> 
      </template>
      </v-col>
    </v-row>
    
</div>

</template>

<script>
import { infoSnackbar } from '@/api/GlobalActions';
import zmlButtonTool from '@/components/zmlButtonTool'
import { doStuff } from '@/api/buttons'
import { getters } from "@/api/store";
export default {
    name:"MenuList",
    components:{zmlButtonTool},
    props:['list'],
    data: () => ({
        getZml: getters.getState({ object: "gZml" }),
    }),
    filters:{
        cc: function (value) {
           switch (value) {
               case 'teacher' : return "light-blue lighten-3"
               case 'student' : return "green lighten-2"
               case 'admin' : return "red lighten-3"
               default : return "orange lighten-4"
           }
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
            if (doStuff(this.$router,what.payload) == 0) {
                if (what.payload.substr(0,4).toLowerCase() == 'http') {
                    window.open(what.payload,'_' + 'ko_external')
                } else {
                    infoSnackbar('Sorry, we do not handle ' + what.payload + ' yet!' )
                }
            }
        },

    },   
}
</script>