<template>
 <v-row>
    <v-col cols="12">
        <!-- <h1>This is ListOfGrades.vue Start</h1> -->
    </v-col>
  <template v-if="$vuetify.breakpoint.mobile">
  <v-col cols="12">
      <v-select
          label="Grade List"
          :items="gradeList"
          :item-text="item =>`${item.grade} - ${item.gclass}`"
          return-object
          @input="doit"
        ></v-select>
  </v-col>

  </template>
  <template v-else>
  <v-col cols="12" xs="2" sm="2" md="1" lg="1" xl="1"
         v-for="(g,index) in gradeList"
        :key="index"
        class="mb-0 mt-1 ml-1 pa-2"
        >
     <v-btn small
           @click="doit(g)"
           :title="g.studentcount"
           :loading="loading"
           :color="classColor(g.gclass)"
     >
     {{ g.grade }} {{ g.gclass }}
     </v-btn>
  </v-col>
  </template>
    <v-col cols="12">
        <!-- <h1>This is ListOfGrades.vue END</h1> -->
    </v-col>
 </v-row>
</template>

<script>
import { zmlFetch } from '@/api/zmlFetch';
import { zmlConfig } from '@/api/constants';
export default {
    name:"ListOfGrades",
    components:{},
    data: () => ({
        gradeList:[],
        loading:false,
        obj:{},
    }),
    computed:{
      itemDisplay () {
         return item => item.grade + ' . ' + item.gclass
      }
    },
    methods:{
      classColor (gc) {
         switch (gc){
          case 'A1':  return "green darken-2"
          case 'A2':  return "green darken-1"
          case 'A3':  return "green"
          case 'E1':  return "lightblue darken-1"
          case 'E2':  return "lightblue"
          case 'E3':  return "lightblue lighten-1"
          case 'E4':  return "lightblue lighten-2"
          case 'E5':  return "lightblue lighten-3"
          case 'E6':  return "lightblue lighten-4"
          case 'E7':  return "lightblue lighten-5"
         }
         return "light-blue darken-2"
      },
      doit (e) {
         this.$emit('input', {g: e.grade,c: e.gclass} )  //send it into v-model on parent...
         this.$emit('chosen') //tell parent something was selected
      },
      loadData (response) {
         this.gradeList = response
         this.loading=false
      },
      loadError (response) {
         alert('L.O.G.' + response)
         this.loading=false
      },
      initiateLoad (){
         let ts = {}
         this.loading=true
         ts.task = 'PlainSql'
         ts.sql = "SELECT grade, gclass, count(*) studentcount FROM dkhs_student "
                   + " WHERE grade like 'G%'"
                   + " GROUP BY grade,gclass"
         ts.api = zmlConfig.apiDKHS
         zmlFetch(ts, this.loadData, this.loadError);
      },
    },
    mounted () {
        console.log('LF(mounted) :', this.$options.name)
        if (this.gradeList.length == 0) {
          this.initiateLoad()
        }
    },
    watch: {
    }
}
</script>