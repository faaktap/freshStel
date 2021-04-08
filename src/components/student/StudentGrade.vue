<template>
<v-row>
 <!--show-col-size /-->
 <v-col cols="2">
    <v-btn @click="showGrades = !showGrades"> 
        {{ gradeClass.g }} {{ gradeClass.c }} 
    </v-btn>
 </v-col>
 <v-col cols="8">    
    <div v-if="showGrades">
       <list-of-grades v-model="gradeClass" 
                      @chosen="sendItBack()" />
    </div>
 </v-col>
</v-row>
</template>

<script>
import ListOfGrades from '@/components/student/ListOfGrades.vue'
import { getters } from "@/api/store";
//import ShowColSize from '@/components/base/ShowColSize';
export default {
    name:"StudentGrade",
    components: { 
         ListOfGrades
        //,ShowColSize 
        },
    data: () => ({
      getZml: getters.getState({ object: "gZml" }),
      showGrades:false,
      gradeClass:{g:'Choose', c:'Grade'}
    }),
    methods:{
      sendItBack(){
           this.showGrades = false
           this.$emit('input', this.gradeClass)
      }
     },
    mounted() {
      console.log('MNT StGr', this.getZml.grade)
      if (this.getZml.login.grade && this.getZml.login.grade.length > 2) {
         console.log('grade=',this.getZml.login.grade)
         this.gradeClass.g = this.getZml.login.grade.substr(0,3)
         this.gradeClass.c = this.getZml.login.grade.substr(3,2)        
      }
     }

}
</script>