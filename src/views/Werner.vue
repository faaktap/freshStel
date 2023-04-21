<template>
<v-container fluid>
<h1> -----------WERNER.VUE-------------- </h1>


icons:
<p-icon name="all" />

{{ wdebug }} {{ typeof(wdebug) }}
<v-card elevation="-4"><v-card-title> v-multi-items component - single value from list</v-card-title>
<v-card-text><v-radio-group v-model="wdebug"><v-radio :value="true" label="ON"/><v-radio :value="false" label="OFF"/></v-radio-group>
 <v-multi-play :items="items"
              v-model="vmpT"
              label="alabel"
              color="red"
              nodata="oeps"
              :entryType="{type:'text', label:'werner'}"
              outlined="true"
              :debug="wdebug"
 />
</v-card-text>
</v-card>



<!-- <quick-calendar-display class="ma-2 pa-2" v-if="attEvt && attEvt.length"
  :passedEvents="attEvt" /> -->
<br>

<!-- <base-title-expand  heading="Call Component from list" color="blue">
<TimeLineComponentPlay />
</base-title-expand> -->

<base-title-expand  heading="Select a subject" color="blue">
possible : {{ getZml.subjects && getZml.subjects.length }}
<auto-sel-subjects v-if="getZml.subjects && getZml.subjects.length"
              asLabel="Subjects"
              v-model="p.subjectID"
              :initialValue="101"
              :itemObj="getZml.subjects"
              @input="change"
              @objInput="p.subjectObj = $event; change($event)"
/>
</base-title-expand>
<v-btn v-for="but in buttons" :key="but.to"
       small :to="but.to"
       class="ma-2 pa-2"
> {{ but.name || but.to  }}
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
    <!-- {{ p.persMen }}{{p.roomName }}{{ p.day }}{{ p.period }}{{ p.classListID }}{{ p.questionID }} -->
    <v-btn @click="activate" > Start </v-btn>
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
import VMultiPlay from '@/components/base/VMultiPlay.vue'
import SelGeneralListItems from '@/components/fields/SelGeneralListItems.vue'
import AutoSelSubjects from '@/components/fields/AutoSelSubjects.vue'
// import TimeLineComponentPlay from '@/test/TimeLineComponentPlay.vue'
// import QuickCalendarDisplay from '@/components/QuickCalendarDisplay.vue'
import PIcon from '@/components/base/PIcon.vue'
export default {
    name:"Werner",
    components: {
                 SelGeneralListItems
               , AutoSelSubjects
               , BaseTitleExpand
               , VMultiPlay
               , PIcon
               //, TimeLineComponentPlay
               //, QuickCalendarDisplay
               },
    data: () => ({
         vmpT:null
         ,vmpM:null
         ,vmpR:null
         ,items: ['item1', 'item2', 'item 3']
         ,wdebug: false

        ,attEvt:[],
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
        ,subjectObj:{}}

        ,tab:{id:0
           , desc: "Attendance Class Lists"
           , workDone: 0
           , response: []
           , processor: (action,element) => {this.doSomething(action,element)}
           , sql:`SELECT * FROM hw_classlist s order by s.grade, teacher`
           , progess:false
        },
        buttons:[
            {to:"/checklog", name:"checklog"},
            {to:"/emailcheck"},
            {to:"/class"},
            {to:"/genlistview"},
            {to:"/tce", name:"Teacher Class Edit (tce)"},
            {to:"/teacherlist", name:""},
            {to:"/testview", name:"Test View"},
            {to:"/vglist", name:"General teacher List (vglist)"},
            {to:"/wernertest"},
            ],

    }),
    computed: {
    },
    methods: {
      change(e) {
        console.log(this.$options.name,'Weerner Change:', e)
      },
      activate() {
        zData.snack('sdf sdf klsdfjml ksdjfl aksdjf lkdsjflkasdfsadf')
        alert('doit')
      },
      afterQuick(r) {
        //We must clean the subject data - so we can really load all.
        this.getZml.subjects.length = 0
        zData.initialData('Really Load Latest Data',this.afterwards)
        console.log(this.$options.name,'after QUick',r)
      },
      attendanceLoadStuff(studentid) { //19014
        let sql =  `SELECT d.day_name, d.fulldate\
     , ifnull(attendancedate,concat(d.fulldate, ' 08:00' )) start
     , ifnull(a.status ,'No Entry') name\
     , ifnull(concat(a.staff,', ', a.location,', ', a.period) ,'No Entry') detail\
   FROM dkhs_date d \
LEFT JOIN v_attendance a ON substr(attendancedate,1,10) = d.fulldate AND a.studentid = ${studentid}\
  WHERE day_name not in ('Sunday','Saturday')\
    AND (substr(fulldate,1,4) = '2023'\
      OR substr(fulldate,1,4) = '2023')\
 ORDER BY fulldate,attendancedate`
      //zmlFetch(ts, afterwards)
      let loading = false
      zData.loadSql(loading, sql, this.afterwards)
      },
      afterwards(response) {
        this.attEvt = response
      },
    },
    created() {
      zData.quickLoadInitialData('get from ini, and then call real load - as a test', this.afterQuick)
    },
    mounted() {
      this.attendanceLoadStuff(19014)
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