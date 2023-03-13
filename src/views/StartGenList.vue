<template>
 <div>
  <base-title-expand color="white" heading="General CLASS LIST SELECT">
   <p>
    General lists are beinge read from classlists. So whenever you add  a classlist, that list will be selectable here.
    Once you have selected a day, period, classroom, person and list, you will be taken to the list where you can mark students as absent, etc.
    </p>
  </base-title-expand>

  <base-tool :toolList="[]"
           :toolbarName="`General 4 ${getZml.login.fullname} / ${ getZml.login.username}`"
           :loading="loading"
           :background="false"
           :back="true"
  >
   <v-spacer />
            <v-btn  @click="viewGeneral"
                   title="View previous General Records"
            > <v-icon>mdi-view-agenda-outline</v-icon>
              View Records
            </v-btn>
            <v-btn icon @click="playSound"> <v-icon>mdi-cellphone-sound</v-icon> </v-btn>
</base-tool>
  <v-card v-if="FilledIn" color="gray lighten-3" class="ma-3 px-6 py-2 text-center" >
    You have selected Period
       <strong>{{ p.period }}</strong>
       , on Day <strong>{{ p.day }}</strong>
       for Class: <strong>{{ p.classListObj.listname }} </strong>
       to do <strong> {{ p.questionObj.name}} </strong>
  </v-card>
  <v-row>
   <v-col cols="12" md="12">
    <v-card class="ma-2" elevation="2" loading="!loading">
     <v-card-title> General Information Needed </v-card-title>
     <v-card-text>
        <sel-general-list-items @input="change" :initialValues="p" />
     </v-card-text>
     <v-card-actions>
      <v-spacer />
      <v-btn @click="checkIfAllSelected"
             :disabled="!FilledIn"
             color="primary"
      > Start </v-btn>
     <div class="text-caption mx-2"> ({{ p.persMen}},{{ p.roomName }},{{ p.day }},{{ p.period }},{{ p.classListID }}, {{p.questionID}} )</div>
     </v-card-actions>
   </v-card>
  </v-col>
  </v-row>

 </div>
</template>

<script>
//import { zmlConfig } from '@/api/constants';
import { zmlFetch } from '@/api/zmlFetch.js';
import { getters } from "@/api/store";
import  {zmlLog } from "@/api/zmlLog.js"
import { zData } from "@/api/zGetBackgroundData.js"
import { ls } from "@/api/localStorage.js"
import { infoSnackbar } from '@/api/GlobalActions.js';
import baseTool from '@/components/base/baseTool.vue'
import BaseTitleExpand from '@/components/base/BaseTitleExpand.vue'
import SelGeneralListItems from '@/components/fields/SelGeneralListItems.vue'

export default {
    name:'StartGenList',
    transition: 'page-slide',
    components: {
      baseTool
    , BaseTitleExpand
    , SelGeneralListItems
    },
    data: () => ({
       getZml: getters.getState({ object: "gZml" }),
       loading: false,
       sessionID:0,
       studentData: [],
       confirmSound:new Audio('sounds/Water drip.mp3'),
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
       saveIni:'zmlGenListFill'
    }),
    computed: {
        FilledIn() {
            return this.p.persMen && this.p.roomName && this.p.day && this.p.period && this.p.classListID && this.p.questionID
        }
    },
    methods: {
      initialize() {
        this.loading = false
        zmlLog(null, "GenList4Tanya Started "+ this.getZml.login.username)

      },
      viewGeneral() {
        this.$router.push('/genlistview')
      },
      change(filledInFields) {
        console.log('change for lookup as triggered', filledInFields)
        this.p = filledInFields
      },
      checkIfAllSelected() {
        if (this.FilledIn) {
          this.sessionID = `${this.p.roomName.substring(0, 4)}.${this.p.day}.${this.p.period}.${this.p.questionObj.name}-${Math.floor(Math.random()*1615).toString(5)}`
          console.log('Session = ', this.sessionID)
          // ls.save('attPeriod',this.period)
          // ls.save('attPlaceID',this.placeid)
          // ls.save('attDay',this.day)
          this.areWeReady()
        } else {
          infoSnackbar('All is not select4ed yet')
        }
      },
      areWeReady() {
        console.log('sql for loading students',this.p.classListObj)
        this.loading = true
        let ts = {task: 'PlainSql',
               sql: `SELECT l.studentid, l.surname, l.firstname, l.grade, l.gclass, l.studentid \
                      FROM hw_classliststudent s, dkhs_student l \
                     WHERE s.classlistid = '${this.p.classListObj.id}'\
                       AND s.studentid = l.studentid\
                    order by l.surname, l.firstname`
             }
        zmlFetch(ts, this.loadStudentData, this.errorLoading)
      },
      loadStudentData(response) {
        if ('error' in response && response.error.length > 5) {
          this.studentData = []
        } else {
          this.studentData = response
        }
        this.loading = false
        ls.save(this.saveIni,this.p)
        this.showStudentList = true
        this.$router.push({ name: 'GeneralList'
              , params: {studentList: this.studentData
                       , generalDetail: {sessionID: this.sessionID
                                           ,staffSurname: this.p.persObj.surname || 'poepies'
                                           ,placeid: this.p.roomObj.placeid
                                           ,userid: this.getZml.login.userid
                                           ,location: this.p.roomName
                                           ,day: this.p.day
                                           ,period: this.p.period
                                           ,grade:this.p.classListObj.grade
                                           ,listname:this.p.classListObj.listname + ' + ' + this.p.questionObj.name
                                           ,listid:this.p.classListObj.id
                                           ,other:this.p.classListObj}
                       , checkList: this.p.questionObj.questions
                       }
                      })
      },
      errorLoading(err) {
        this.loading = false
        console.log('Problem:: Loading StudentData for ' + this.$options.name, err)
        alert('Problem:: Loading StudentData for ' + this.$options.name)
      },
      playSound () {
        this.confirmSound.play();
      },
    },
    created() {
        console.log('Created', this.$options.name)
        ls.test(this.saveIni) ?  this.p = ls.load(this.saveIni) : this.p.persMen = this.getZml.login.username
    },
    mounted() {
      console.log('saveini - we loaded a previous backup', this.p)
      console.log('Mount', this.$options.name)
      this.loading = true
      //Load lookups from ini for everyting if not loaded yet....
      zData.quickLoadInitialData('Load Data for incase', this.initialize)
    },
    watch:{    },
    beforeDestroy() {    }
}
</script>