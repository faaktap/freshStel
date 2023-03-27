<template>
<div>
  <hero-section name="forDB"
              bgpicture="https://www.zmlrekenaars.co.za/test/img/wall041.jpg"
              :title="`Calendar :  ${weekOrDay}`"
              text=""
              breakup1="100"
              breakup2="20"
              color="green darken-1"
               />

  <v-row>
    <v-col>
    <v-sheet
      tile
      height="54"
      class="d-flex"
    >
    <v-toolbar
       flat
       dense
       :loading="loading"
    >
        <v-btn
        icon
        class="ma-2"
        @click="$refs.calendar.prev()"
        >
        <v-icon>mdi-chevron-left</v-icon>
        </v-btn>

        <v-btn v-if="!$vuetify.breakpoint.mobile"
               :x-small="!$vuetify.breakpoint.mdAndUp"
               class="ma-sm-0 ma-2" color="primary" @click="setToday">
          <span v-if="$vuetify.breakpoint.mdAndUp"> Today</span>
          <v-icon v-else small> mdi-calendar-today</v-icon>
        </v-btn>
        <v-spacer />
          <v-toolbar-title v-if="$refs.calendar"> {{ $refs.calendar.title }} </v-toolbar-title>
          <v-spacer />

         <v-btn-toggle small v-model="toggleView" >
         <v-btn class="ma-0" :x-small="!$vuetify.breakpoint.mdAndUp" color="primary" @click="weekOrDay = 'day'">
          <span v-if="$vuetify.breakpoint.mdAndUp"> day</span>
          <span v-else>d</span>
         </v-btn>
         <v-btn class="ma-0" :x-small="!$vuetify.breakpoint.mdAndUp" color="primary" @click="weekOrDay = 'week'">
          <span v-if="$vuetify.breakpoint.mdAndUp"> week</span>
          <span v-else>w</span>
         </v-btn>
         <v-btn class="ma-0" :x-small="!$vuetify.breakpoint.mdAndUp" color="primary" @click="weekOrDay = 'month'">
          <span v-if="$vuetify.breakpoint.mdAndUp"> month</span>
          <span v-else>m</span>
         </v-btn>
         </v-btn-toggle>


          <!-- <v-btn color="primary" class="ma-2" @click="weekOrDay == 'day' ? weekOrDay = 'week' : weekOrDay = 'day'" small title="Click to Swop">
             {{ weekOrDay }}
          </v-btn> -->
        <v-btn icon class="ma-2"  @click="$refs.calendar.next()" >
          <v-icon>mdi-chevron-right</v-icon>
        </v-btn>
    </v-toolbar>
    </v-sheet>
      <v-sheet height="400">
        <v-calendar
          v-if="events.length>0"
          ref="calendar"
          v-model="calValue"
          :now="calToday"
          :value="calToday"
          :events="events"
          event-color="secondary"
          color="primary"
          :type="weekOrDay"
          intervalMinutes="60"
          first-time="07:30"
          interval-count="8"
          interval-height="35"
          short-intervals
          @change="updateRange"
          @click:event="showEvent"
        > <!-- weekdays=[1,2,3,4,5,6,0] -->
         <!-- <template v-slot:day-body="{ date, week }">
            <div
               class="v-current-time"
              :class="{ first: date === week[0].date }"
              :style="{ top: nowY }"
            ></div>
         </template> -->

        </v-calendar>


<!---  SELECTED EVENT --->
        <v-menu
          v-model="selectedOpen"
          :close-on-content-click="false"
          :activator="selectedElement"
          offset-x
        >
          <v-card
            color="blue-grey lighten-4"
            min-width="350px"
            flat
          >
            <v-toolbar
              color="cyan"
              dark
            >
              <v-toolbar-title v-if="selectedEvent"> {{ selectedEvent.name }} </v-toolbar-title>
            </v-toolbar>
            <v-card-text>
              <span v-if="selectedEvent"> {{ selectedEvent.details }} </span>
            </v-card-text>
          </v-card>
        </v-menu>
      </v-sheet>
    </v-col>
  </v-row>

  <!-- <v-container fluid v-if="getZml.login.superUser">
    <v-row dense class="ma-0 pa-0">
        <v-col  class="ma-0 pa-0" cols="6" lg="3" v-for="(f,i) in getZml.calendar" :key="i">
        <v-card color="blue" class="ma-2 pa-1" >
        {{ i }} {{ f.name }} - {{ f.start }} {{ f.end }} {{ f.type }}
        <hr>
        {{ f }}
         </v-card>
        </v-col>
   </v-row>
  </v-container> -->
</div>
</template>

<script>
//import { format         ,lastDayOfMonth        , addYears } from 'date-fns'
import { getters } from "@/api/store"
import { zDate } from '@/api/zDate.js'
import { zData } from '@/api/zGetBackgroundData.js'
import { zmlConfig } from '@/api/constants.js';
import { zmlFetch } from '@/api/zmlFetch.js';
import HeroSection from "@/views/sections/HeroSection"
export default {
  name: 'Calendar',
  props: ['studentid'],
  components:{HeroSection},
  data: () => ({
      getZml: getters.getState({ object: "gZml" }),
      studentidToView:'',
      loading:false,
      today: null,
      calToday: null,
      calValue: '',
      calReady: false,
      events:[{ start: "1900-01-01", name: "" }],
      selectedEvent: null,
      selectedElement: null,
      selectedOpen: null,
      weekOrDay: "week",
      toggleView:0,
  }),
  methods:{
      updateRange(whatweget) {
         console.info('Range Check', whatweget)

      },
      loadCalendar() {
        this.getZml.calendar.forEach(ele => {
          if (ele.start) {
             const evt= {name: ele.name
                  , start: ele.start
                  , end: ele.start
                  , color: ele.color
                  , type: ele.type
                  , timed: ele.timed
                  , details: `${ele.subject}, ${ele.user_name}, ${ele.dayno}, ${ele.periodno}, ${ele.length}`
                    }
             this.events.push(evt)
          } else {
            console.error('One of our event does not have a startdate!',ele);
          }
        })
        return "done"
      },
      loadRooster(){
        this.selectedOpen = false
        console.log('getting calendar data (rooster) for ',this.getZml.login.username)

        let ts = {}
        ts.task = 'PlainSql'
        ts.sql = `select  dt.fulldate startdate\
     , dt.dayno, per.description\
     , concat(dt.fulldate, ' ', per.starttime) startEvt\
     , concat(dt.fulldate, ' ', per.endtime) endEvt\
     , per.length, substr(per.periodname,4,1) periodno\
     , if (periodname = 'Break', 'green lighten-1', 'green darken-2') color\
     , l.shortname subject, l.description subjectname, r.menemonic user_name\
     , per.id , per.dow\
 FROM dkhs_date dt , dkhs_dayperiod per, dkhs_rooster r, dkhs_student s, dkhs_lsubject l, dkhs_studsub ss\
 WHERE s.studentid = '${this.studentidToView}'\
  AND r.gradeclass = concat(s.grade, s.gclass)\
  AND s.studentid = ss.studentid\
  AND per.dow = dt.dayOfWeek\
  AND dt.iddate <  DATE(now() + INTERVAL 30 DAY)\
  AND dt.iddate >  DATE(now() - INTERVAL 30 DAY)\
  AND r.periodno = substr(per.periodname,4,1)\
  AND r.dayno = dt.dayno\
  and s.studentid = ss.studentid\
  and l.beskrywing = ss.subjectname\
  and r.subjectshortname = l.shortname\
  and r.menemonic = ss.menemonic\
  and l.linksubjectid = ss.subjectid\
 order by startdate,dt.dayno,  per.periodname, l.shortname`

        ts.api = zmlConfig.apiDKHS
        this.loading = true;
        zmlFetch(ts, this.afterRoosterSelect);
      },
      subjectColor(subjectShortName) {
        let colorObj = this.getZml.subjects.find(dt =>  dt.shortname == subjectShortName.substr(0,dt.shortname.length) )
        if (colorObj && colorObj.color) {
           return colorObj.color
        } else {
          return "amber"
        }
      },
      afterRoosterSelect(response) {
        //We could use this.calValue as current selected day - but not needed if we show one week of periods.
        //Get this week's first "day", monday is 1.
        if (this.getZml.calendar.length==0) {
          alert('our calendar seem to be empty?')
        }
        response.forEach(ele => {
          const evt = {
                  name: ele.periodno + ' ' + ele.subjectname
                , start: ele.startEvt
                , end:   ele.endEvt
                , color: this.subjectColor( ele.subject )
                , timed: true
                , details: `${ele.subject}, ${ele.user_name}, ${ele.dayno}, ${ele.periodno}, ${ele.length}`
            }
          this.events.push( evt )
        })
        //Brilliant funcking timeout stukkie!!
        setTimeout(() => {
           this.loading = false;
           if (this.$refs.calendar)  this.$refs.calendar.checkChange()
        }, 200)

      },
      showEvent ({ nativeEvent, event }) {
        const open = () => {
          this.selectedEvent = event
          this.selectedElement = nativeEvent.target
          setTimeout(() => {
            this.selectedOpen = true
          }, 10)
        }
        if (this.selectedOpen) {
          this.selectedOpen = false
          setTimeout(open, 10)
        } else {
          open()
        }
        nativeEvent.stopPropagation()
      },
      setToday () {
        this.calValue = ''
      },
      getCurrentTime () {
        return this.cal ? this.cal.times.now.hour * 60 + this.cal.times.now.minute : 0
      },
      scrollToTime () {
        const time = this.getCurrentTime()
        const first = Math.max(0, time - (time % 30) - 30)

        this.cal.scrollToTime(first)
      },
      updateTime () {
        setInterval(() => this.cal.updateTimes(), 60 * 1000)
      },
      activateCalendar() {
          //if (this.$refs.calendar !== undefined) {
          if (this.calReady == false) {
            console.info('Calendar is Ready?: ' , this.$refs.calendar)
            if (this.$refs.calendar)  this.$refs.calendar.checkChange()
            this.calReady = true
            if (this.$refs.calendar) this.scrollToTime()
            if (this.$refs.calendar) this.updateTime()
          } else {
           console.error('Calendar still not Ready!!: ' , this.calReady, this.$refs.calendar)
         }

       },
       rinseRepeat() {
         this.activateCalendar()
         if (!this.calReady) {
          setTimeout(() => { this.rinseRepeat() }, 4000)
         }
      }
    },
  computed: {
      cal () {
        return this.calReady ? this.$refs.calendar : null
      },
      nowY () {
        return this.cal ? this.cal.timeToY(this.cal.times.now) + 'px' : '-10px'
      },
    },
  created () {
      zData.calendarData('Load Calendar Data')
  },
  mounted () {

      //this.events = [] //let's keep old events for now...
      this.studentidToView = this.studentid
      if (this.studentidToView == undefined) this.studentidToView = this.getZml.login.username
      this.today = new Date()
      this.today.setHours(0,0,0,0)
      this.calToday = zDate.format(this.today,'yyyy-MM-dd')
      this.loadCalendar()
      this.loadRooster()

      this.activateCalendar()
      this.rinseRepeat()
  },
  watch: {
  },
}
</script>

<style lang="scss">
.v-current-time {
  height: 2px;
  background-color: #ea4335;
  position: absolute;
  left: -1px;
  right: 0;
  pointer-events: none;

  &.first::before {
    content: '';
    position: absolute;
    background-color: #ea4335;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    margin-top: -5px;
    margin-left: -6.5px;
  }
}
</style>