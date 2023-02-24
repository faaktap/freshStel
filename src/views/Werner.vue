<template>
<v-container fluid>
<h1> Hallo World </h1>


<auto-sel-subjects
v-if="getZml.subjects && getZml.subjects.length"
              asLabel="Subjects"
              v-model="p.subjectID"
              :initialValue="101"
              :itemObj="getZml.subjects"
              @input="change"
              @objInput="p.subjectObj = $event; change($event)"
/>

<v-btn v-for="but in buttons" :key="but.to"
       small :to="but.to"
       class="ma-2 pa-2"
> {{ but.name || but.to}}
 </v-btn>
<v-btn small @click="afterQuick"> Load Initial Data </v-btn>

<base-title-expand  heading="Show Vars" color="blue">
<v-card class="caption-text">LOGIN"
  {{ getZml.login }}
</v-card>

<v-card class="caption-text">PLACE:
  {{ getZml.place }}
</v-card>
<v-card class="caption-text">
  {{ getZml.persMenemonic }}
</v-card>
<v-card class="caption-text">
  {{ getZml.classList }}
</v-card>
</base-title-expand>

<!-- :initialPlaceID="testroomstart" -->
<v-card>
  <v-card-title> Choose some auto fields </v-card-title>
  <v-card-text>
   <sel-general-list-items @input="change" />
 </v-card-text>
  <v-card-actions>
    <v-btn @click="activate" :disabled="!(p.persMen && p.roomName && p.day && p.period && p.classListID && p.questionID)"> Start </v-btn>
     <div class="text-caption mx-2"> ({{ p.persMen}},{{ p.roomName }},{{ p.day }},{{ p.period }},{{ p.classListID }}, {{p.questionID}} )</div>
    </v-card-actions>
    roomObj: {{ p.roomObj }}<br>
    persObj: {{ p.persObj }}<br>
    classListObj:{{ p.classListObj }}<br>
    questionObj: {{ p.questionObj }}<br>
</v-card>
</v-container>
</template>


<script>
import { zData } from "@/api/zGetBackgroundData.js"
import { getters } from "@/api/store";
import BaseTitleExpand from '@/components/base/BaseTitleExpand.vue'
import SelGeneralListItems from '@/components/fields/SelGeneralListItems.vue'
import AutoSelSubjects from '@/components/fields/AutoSelSubjects.vue'
export default {
    name:"Werner",
    components: {
                 SelGeneralListItems
               , AutoSelSubjects
               , BaseTitleExpand
               },
    data: () => ({
        getZml: getters.getState({ object: "gZml" }),
        p: {roomName: '0'
         ,roomObj: {}
         ,persMen: ''
         ,persObj: {}
         ,classListID: ''
         ,classListObj:{}
         ,questionID: ''
         ,questionObj: {}
         ,period: ''
         ,day: ''
         ,subjectID: ''
         ,subjectObj:{}
        },
        tab:{id:0
           , desc: "Attendance Class Lists"
           , workDone: 0
           , response: []
           , processor: (action,element) => {this.doSomething(action,element)}
           , sql:`SELECT * FROM hw_classlist s order by s.grade, teacher`
           , progess:false
        },
        buttons:[
            {to:"/checklog", name:"checklog"},
            {to:"/emailcheck", name:""},
            {to:"/teacherlist", name:""},
            {to:"/class", name:""},
            {to:"/tce", name:"Teacher Class Edit"},
            {to:"/testview", name:"Test View"},
            {to:"/gtlist", name:"General teacher List"},
            ],

    }),
    methods: {
      change(e) {
        console.log('Weerner Change:', e)
      },
      activate() {alert('doit')},
      afterQuick(r) {
        zData.initialData('Really Load Latest Data',this.afterwards)
        console.log('after QUick',r)
      },
      afterwards(r) {
        console.log('afterward',r)
      },
    },
    created() {
    },
    mounted() {
      if (this.getZml.place.length == 0) {
         zData.quickLoadInitialData('get from ini', this.afterQuick)
      } else {
        this.afterwards()
      }
    },
    watch: {
      persMen() {
        if (!this.testroom && this.persMen) {
          //lookup the teachers room
          this.testroom = this.persObj.room
        }
      }
    }
}
</script>