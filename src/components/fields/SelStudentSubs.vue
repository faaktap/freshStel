<template>
   <!--
       import SelStudentSubs from '@/components/AutoSelStudentSubs.vue'
       Use and object with id and name, the select object will be returned to v-model
       multiple list - so new experience
          <auto-sel-student-subs
             asLabel="Select your Student Classes!"
             v-model="selectedStudents" >
         </sel-student-subs>

How does this work?
A. We allow multiple selections, convert that to studentid, and pass the id's back
B. The search function, use the itemdisplay to get data to display in dropdown
C: The show-select prop will render a checkbox in the default header to toggle all rows, and a checkbox for each default row
   -->
<v-card>
  <v-card-title> Select Student by Subject </v-card-title>
  <v-layout row wrap align-content-start justify-space-between class="ma-2 pa-0">

  <v-radio-group v-model="sClass" row label="Grade" class="mt-5 ma-2 pa-2">
    <v-radio label="G10" value="G10" />
    <v-radio label="G11" value="G11" />
    <v-radio label="G12" value="G12" />
  </v-radio-group>

  <v-text-field v-model="search" label="search" outlined class="ma-2 pa-2" />
  <auto-sel-subjects v-model="lSubject" class="ma-2 pa-2" />
  </v-layout>
  Students : {{ selectedCount }}
  <v-data-table
    v-model="selected"
    :headers="headers"
    :items="subListFilter"
    :single-select="false"
    item-key="uuid"
    show-select
    class="elevation-1"
  />
  <v-card-actions>
    <v-btn color="warning"> cancel </v-btn> <v-spacer /> <v-btn color="primary"> select {{ selectedCount }} Students </v-btn>
  </v-card-actions>
</v-card>
</template>


<script>
import { zmlFetch } from '@/api/zmlFetch'
import { util } from '@/api/util.js'
import AutoSelSubjects from '@/components/fields/AutoSelSubjects.vue'
export default {
  name: "SelStudentSubs",
  props: {},
  components: {AutoSelSubjects},
  data: () => ({
    selected:[],
    sClass:'G11',
    search: null,
    lSubject: null,
    subList: [],
    headers: [{text: 'Grade', value: 'grade' },{text: 'Class', value: 'gclass' },
              {text: 'Teacher', value: 'menemonic'},{text: 'Subject', value: 'subjectname'},
              {text: 'learners', value: 'count'} //{text: 'ckey', value: 'ckey'},
             ],
  }),
  computed: {
    selectedCount() {
      return this.selected.reduce( (accum,item) => accum + Number(item.count),0)
    },
    subListFilter() {
      if (this.subList.length == 0) return []
      let g,u,s
      g = this.subList.filter(e => e.grade == this.sClass)

      if (this.lSubject && this.lSubject.beskrywing) {
        u = g.filter(e => e.subjectname.toUpperCase().includes( this.lSubject.beskrywing.toUpperCase() ))
      }

      if (this.search) s = util.findInObject(g || x, this.search)
      return s || u || g
    }
  },
  methods: {
    getData() {
      if (this.subList.length) {
        console.log('already data:')
        return
      }
      let sql = `select (SELECT NEXT VALUE FOR cnt) uuid, s.grade, s.gclass, menemonic, subjectname, ckey, count(*) count \
   from dkhs_studsub ss, dkhs_student s \
  where ss.studentid = s.studentid \
    AND s.grade not in ('G08','G09') \
    AND s.grade not like 'o%' \
  group by s.grade, s.gclass, menemonic, subjectname, ckey  `
     zmlFetch({task:'PlainSql', sql:sql}, this.assignData, this.errorLoading)
    },
    assignData(resp) {
       this.subList = resp
    },
    errorLoading(err) {
      alert(JSON.stringify(err))
    },
    inputDone() {
      this.$emit('input', 'listofstudentids');
    },
    finished() {
       this.what = this.itemObj.find(item => item.name == this.initialValue)
       this.$emit('objInput', this.what)
       this.search = $super.username
    }
  },
  mounted() {
    this.getData()
  },
  watch: {

  }
}
</script>