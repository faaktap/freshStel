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

  <v-row>
   <v-col cols="12" md="12">
    <v-card class="ma-2" elevation="2" loading="!loading">
     <v-card-title> General Information Needed </v-card-title>
     <v-card-text>
        <sel-general-list-items @input="change" />
     </v-card-text>
     <v-card-actions>
      <v-spacer />
      <v-btn @click="areWeReady"
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
//import { ls } from "@/api/localStorage.js"
import { infoSnackbar } from '@/api/GlobalActions.js';
import baseTool from '@/components/base/baseTool.vue'
import BaseTitleExpand from '@/components/base/BaseTitleExpand.vue'
import SelGeneralListItems from '@/components/fields/SelGeneralListItems.vue'

export default {
    name:'GenCLassList',
    transition: 'page-slide',
    components: {
      baseTool
    , BaseTitleExpand
    , SelGeneralListItems
    },
    data: () => ({
       getZml: getters.getState({ object: "gZml" }),
       loading: false,
       counter:0,
       sessionID:0,
       studentData: [],
       lastScan:'',
       scannedRow:'',
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
      change(p) {
        this.p = p
        //this.checkIfAllSelected()
      },
      checkIfAllSelected() {
        if (this.FilledIn) {
          this.sessionID = `${this.p.roomName}.${this.p.day}.${this.p.period}.${this.p.questionObj.name}-${Math.floor(Math.random()*1615).toString(5)}`
          console.log('Session = ', this.sessionID)
          // ls.save('attPeriod',this.period)
          // ls.save('attPlaceID',this.placeid)
          // ls.save('attDay',this.day)
        } else {
          infoSnackbar('All is not select4ed yet')
        }
      },
      areWeReady() {
        console.log('sql for',this.tListObj.ckey, this.tListObj.grade, this.tListObj.subjectname)
        this.loading = true
        let ts = {task: 'PlainSql',
               sql: `SELECT l.studentid, l.surname, l.firstname, l.grade, l.gclass, l.studentid \
                      FROM hw_classliststudent s, dkhs_student l \
                     WHERE s.classlistid = '${this.tListObj.id}'\
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
        this.showStudentList = true
        this.$router.push({ name: 'GeneralList'
              , params: {studentList: this.studentData
                       , GeneralDetail: {sessionID: this.sessionID
                                           ,staffSurname: this.surname
                                           ,placeid: this.placeid
                                           ,userid: this.login.userid
                                           ,location: this.location
                                           ,day: this.day
                                           ,period: this.period
                                           ,grade:this.tListObj.grade
                                           ,listname:this.tListObj.listname
                                           ,listid:this.tListObj.id
                                           ,other:this.tListObj}
                       , checkList: ["Present","Absent", "Late","AWR", "Ignore"]
                       }
                      })
      },
      errorLoading(err) {
        this.loading = false
        alert('something went wrong:'+ err.error)
        console.log(err)
      },
      playSound () {
        this.confirmSound.play();
      },
    },
    mounted() {
      this.loading = true
      //Load lookups from ini for everyting if not loaded yet....
      zData.quickLoadInitialData('Load Data for incase', this.initialize)
    },
    watch:{    },
    beforeDestroy() {    }
}
</script>