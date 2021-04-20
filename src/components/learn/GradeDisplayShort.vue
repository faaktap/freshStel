<template>
<div>
 <v-btn v-for="grade in displayGroup" :key="grade.id" 
              @click="setGrade(grade.id)" 
              class="ma-2"
              :color="gradeColor(grade.id)" 
              :small="localDisplaySize == 'small'">
          {{ grade.text }} 
 </v-btn>
 </div>
</template>

<script>
import { getters } from "@/api/store"
export default {
    name: "GradeDisplayShort",    
    props: {
        displaySize: {type: String,required:true}
           },
    data: () => ({
        getZml: getters.getState({ object: "gZml" }),
        localDisplaySize:"",
        //group:['8','9','10','11','12','INFO'],
        displayGroup:[],
        }),
    methods:{
      gradeColor(gid){
        if (gid == this.getZml.grade) return "red"
        return ""
      },      
      setGrade(gradeid) {
        this.getZml.grade = gradeid
        this.$emit('input', gradeid)
      },
      buildList() {
        let gDisplay = ''
        switch (this.localDisplaySize) {
           case 'small': gDisplay = 'G'; break
           case 'medium': gDisplay = 'Grade'; break
           default: gDisplay = 'Grade'; break
        }
        this.displayGroup = []
        this.getZml.grades.forEach(ele => {
          if (ele.id > 7 && ele.id < 13) {
            this.displayGroup.push({id:ele.id, text: gDisplay + ' ' + ele.id})
          } else {
            this.displayGroup.push( {id:ele.id , text:ele.id} )
          }
        })
      }
    },
    mounted: function() {
       this.localDisplaySize = this.displaySize
       this.buildList()
    },
    watch:{
        displaySize() {
          this.localDisplaySize = this.displaySize
          this.buildList()
        }
    }
}
</script>
