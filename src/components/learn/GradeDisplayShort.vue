<template>
<div>
 <v-btn v-for="grade in [8,9,10,11,12]" :key="grade" 
              @click="setGrade(grade)" 
              class="ma-2"
              small>
          G {{ grade }} 
 </v-btn>
</div>
</template>

<script>
import { getters } from "@/api/store"
export default {
    name: "GradeDisplayShort",    
    data: () => ({  getZml: getters.getState({ object: "gZml" })    }),
    methods:{
      setGrade(grade) {
        this.getZml.grade = grade
        this.$emit('input', grade)
      },
    }
}
</script>
