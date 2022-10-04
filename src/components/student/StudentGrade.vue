<template>
<v-row>
 <!--show-col-size /-->
 <v-col cols="2">
    <v-btn @click="showGrades = !showGrades">
      <v-icon small color="green"> mdi-chair-school </v-icon>
        {{ gradeClass.g }} {{ gradeClass.c }}
     </v-btn>
 </v-col>
 <v-col cols="8">
   <list-of-grades
       v-if="showGrades"
       v-model="gradeClass"
       @chosen="sendItBack()"
   />
 </v-col>
</v-row>
</template>

<script>
import ListOfGrades from '@/components/student/ListOfGrades.vue'
import { getters } from "@/api/store";
export default {
    name:"StudentGrade",
    props:['gc'],    //lets add a prop here to see if ity will work
    components: {
         ListOfGrades
        },
    data: () => ({
      getZml: getters.getState({ object: "gZml" }),
      showGrades:true,
      gradeClass:{g:'Choose', c:'Grade'}
    }),
    methods:{
      sendItBack(){
           this.showGrades = false
           this.$emit('input', this.gradeClass)
      }
     },
    mounted() {
      console.log('mountedSG:', this.$options.name, this.gc)
      if (this.gc && this.gc.g && this.gc.c) {
          this.gradeClass = this.gc
      } else {
        if (this.getZml.login.grade && this.getZml.login.grade.length > 2) {
           this.gradeClass.g = this.getZml.login.grade.substr(0,3)
           this.gradeClass.c = this.getZml.login.grade.substr(3,2)
        }
      }
     }

}
</script>