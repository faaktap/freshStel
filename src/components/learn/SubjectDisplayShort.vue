<template>
<div class="xxxtext-right">
 <v-btn v-for="s in subjectFilterContent" :key="s.subjectid" 
              @click="setSubject(s)" 
              :title="s.description + '/' + s.beskrywing"
              :color="subjectColor(s.subjectid)"
              class="ma-2"
              small>
          {{ s.shortname }} 
 </v-btn>
 <div v-if="!getZml.subjects.length"> There are no subjects to display - Login! </div>
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
      subjectFilterContent() {
        if (this.getZml.grade > 7 && this.getZml.grade < 13) {
           return this.getZml.subjects.filter(element => element.id < 200)
           //return this.getZml.subjects
        } else {
          return [ { "id": "201"
                   , "name": "TERS"
                   , "subjectid": "201"
                   , "sortorder": "1"
                   , "shortname": "TERS"
                   , "path": "TERS"
                   , "description": "Tertiary Information"
                   , "beskrywing": "Tersiêre Inligting"
                   , "linksubjectid": "201"
                   , "picture": null
                   , "color": "yellow darken-4" },
                   { "id": "200"
                   , "name": "FAQ"
                   , "subjectid": "200"
                   , "sortorder": "11"
                   , "shortname": "FAQ"
                   , "path": "FAQ"
                   , "description": "Frequently Asked Questions"
                   , "beskrywing": "Tersiêre Inligting"
                   , "linksubjectid": "200"
                   , "picture": null
                   , "color": "yellow darken-2" }] 
        }
      }
    },
    methods:{
      subjectColor(sid){
        const idx = this.getZml.subjects.findIndex(item => item.subjectid == sid)
        if (idx > -1 && this.getZml.subjects[idx].color) return this.getZml.subjects[idx].color
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