<template>
<div>
 <v-btn v-for="s in getZml.subjects" :key="s.subjectid" 
              @click="setSubject(s)" 
              :title="s.description + '/' + s.beskrywing"
              :color="subjectColor(s.subjectid)"
              class="ma-2"
              small>
          {{ s.shortname }} 
 </v-btn>
</div>
</template>

<script>
import { getters } from "@/api/store"
export default {
    name: "SubjectDisplayShort",    
    components: {    },
    data: () => ({
        getZml: getters.getState({ object: "gZml" }),
        title:'',
    }),
    computed: { 
    },
    methods:{
      subjectColor(sid){
        const idx = this.getZml.subjects.findIndex(item => item.subjectid == sid)
        if (idx && this.getZml.subjects[idx].color) return this.getZml.subjects[idx].color
        return "light-green"
      },
      setSubject(subject) {
        this.getZml.subjectid = subject.subjectid
        this.getZml.subject = subject.description
        this.$emit('clickedsubject')
      },
    }
}
</script>

<style scoped>
.wordbreak {
  overflow-wrap: break-word;
  word-wrap: break-word;
  word-break: break-all;
  word-break: break-word;
  hyphens: auto;
}
</style>