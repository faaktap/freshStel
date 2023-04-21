<template>
<v-card class="ma-0 pa-0">
  <hero-section name="forDB"
              bgpicture="https://www.zmlrekenaars.co.za/test/img/wall041.jpg"
              :title="`Calendar :  ${weekOrDay} : ${incomingMenemonic || getZml.login.username}`"
              text=""
              breakup1="100"
              breakup2="20"
              color="green darken-1"
               />

  <v-row class="mt-2 pt-2">
    <v-col>
    <v-sheet tile height="44">
    <v-toolbar flat dense :loading="loading">
    <v-row>
      <v-col cols=1>
        <v-btn icon class="ma-2" @click="$refs.calendar.prev()">
          <v-icon>mdi-chevron-left</v-icon>
        </v-btn>
      </v-col>
      <v-col cols=4>
        <v-btn v-if="!$vuetify.breakpoint.mobile"
               :x-small="!$vuetify.breakpoint.mdAndUp"
               small
               class="ma-sm-0 mr-1 ma-2" color="primary" @click="setToday">
          <span v-if="$vuetify.breakpoint.mdAndUp"> Today</span>
          <v-icon v-else small> mdi-calendar-today</v-icon>
        </v-btn>
         <personel-menemonic :x-small="!$vuetify.breakpoint.mdAndUp" small="true" v-model="incomingMenemonic" >
          <span v-if="$vuetify.breakpoint.mdAndUp"> {{ incomingMenemonic }}</span>
         </personel-menemonic>

      </v-col>
      <v-col cols=3>
        <v-toolbar-title v-if="$refs.calendar">
            {{ $refs.calendar.title }}
        </v-toolbar-title>
      </v-col>
      <v-col cols=3>
         <v-btn-toggle small v-model="toggleView" >
         <v-btn  small :x-small="!$vuetify.breakpoint.mdAndUp" color="primary" @click="weekOrDay = 'day'">
          <span v-if="$vuetify.breakpoint.mdAndUp"> day</span>
          <span v-else>d</span>
         </v-btn>
         <v-btn  :x-small="!$vuetify.breakpoint.mdAndUp" small color="primary" @click="weekOrDay = 'week'">
          <span v-if="$vuetify.breakpoint.mdAndUp"> week</span>
          <span v-else>w</span>
         </v-btn>
         <v-btn class="ma-0" :x-small="!$vuetify.breakpoint.mdAndUp" small color="primary" @click="weekOrDay = 'month'">
          <span v-if="$vuetify.breakpoint.mdAndUp"> month</span>
          <span v-else>m</span>
         </v-btn>
         </v-btn-toggle>
       </v-col>
      <v-col cols=1>
        <v-btn icon class="ma-2" @click="$refs.calendar.next()">
          <v-icon>mdi-chevron-right</v-icon>
        </v-btn>
       </v-col>
    </v-row>
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
        >
        <template v-slot:event="{event}">
          <div :style="{ 'background-color':event.color,color: gfc(event.color) }"
               class="fill-height pl-2"
               :class="sideColor(event.name)"
          >
            <span v-if="$vuetify.breakpoint.mdAndUp">
              {{ event.name.substr(0,21) }}
              {{ event.start.substr(11,5) }}
            </span>
            <span v-else>
              {{ event.name.substr(0,7) }}
            </span>
          </div>
        </template>


        </v-calendar>


<!---  SELECTED EVENT --->
        <v-menu
          v-model="selectedOpen"
          :close-on-content-click="false"
          :activator="selectedElement"
          offset-x
        >
        {{ selectedOpen}}
          <v-card
            color="blue-grey lighten-4"
            min-width="350px"
            flat
          >
            <v-toolbar
              color="cyan"
              dark
            >
              <v-btn icon>
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
              <v-toolbar-title v-if="selectedEvent" >{{selectedEvent.name}}</v-toolbar-title>
            </v-toolbar>
            <v-card-text>
              <span v-if="selectedEvent" >{{ selectedEvent.details }}</span><br>
              <!-- <span class="float-right">{{ selectedEvent.color }} </span> -->
            </v-card-text>
            <v-card-actions>
              <v-btn
                text
                color="secondary"
                @click="loadRooster"
              > load </v-btn>

              <v-btn
                text
                color="secondary"
                @click="selectedOpen = false"
              >
                Cancel
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-menu>



      </v-sheet>
    </v-col>
  </v-row>
  <!-- <v-container v-else>
    <v-btn  @click="checkChange" title="Check for Changes"> R(CC) </v-btn>
  </v-container> -->


</v-card>
</template>

<script>
import { vuetifyColor } from '@/api/vuetifyColor.js'
import { getters } from "@/api/store"
import { zDate } from '@/api/zDate.js'
import { zData } from '@/api/zGetBackgroundData.js'
import { zmlConfig } from '@/api/constants.js';
import { zmlFetch } from '@/api/zmlFetch.js';
import HeroSection from "@/views/sections/HeroSection"
import { infoSnackbar,errorSnackbar } from '@/api/GlobalActions';
import PersonelMenemonic from '@/components/staff/PersonelMenemonic.vue'
export default {
  name: 'Calendar',
  props: ['menemonic'],
  components: {HeroSection, PersonelMenemonic},
  data: () => ({
      getZml: getters.getState({ object: "gZml" }),
      loading:false,
      today: null,
      calToday: null,
      calValue: '',
      calReady: false,
      events:[],
      selectedEvent: null,
      selectedElement: null,
      selectedOpen: null,
      incomingMenemonic: null,
      weekOrDay:'week',
      weekday:[1, 2, 3, 4, 5, 6, 0],
      weekdays: [
        { text: 'Sun - Sat', value: [0, 1, 2, 3, 4, 5, 6] },
        { text: 'Mon - Sun', value: [1, 2, 3, 4, 5, 6, 0] },
        { text: 'Mon - Fri', value: [1, 2, 3, 4, 5] },
        { text: 'Mon, Wed, Fri', value: [1, 3, 5] }],
     toggleView: 1,
  }),
  methods:{
      weekOrDayChange() {
          if (this.weekOrDay == 'day') {
              this.weekOrDay = 'week'
          } else {
              this.weekOrDay = 'day'
          }
      },
      checkChange() {
        if (this.$refs.calendar)  this.$refs.calendar.checkChange()
      },
      updateRange(whatweget) {
         console.info('Range Check', whatweget)

      },
      loadCalendar() {
        this.$cs.l('cl','load default event - check colors?:', this.getZml.calendar, this.getZml.calendar.length)
        this.events = []
        this.getZml.calendar.forEach(ele => {
          if (ele.start) {
             const evt= {
                  name: ele.name
                , start: ele.start  , end: ele.start      , color: ele.color
                , type: ele.type    , timed: ele.timed    , details: `${ele}`
                    }
             this.events.push(evt)
          } else {
            console.error('cl','One of our event does not have a startdate!',ele);
          }
        })
        return "done"
      },
      loadRooster(){
        //clean out the previous teacher's load
        this.$cs.l('cl','start LOADROOSTER.....................')
        let cleaned = this.events.filter(e => e.temp != true)
        if (cleaned.length != this.events.length) this.events = cleaned
        this.selectedOpen = false
        this.$cs.l('cl','start REALLY LOADROOSTER -------------')

        let ts = {}
        ts.task = 'PlainSql'
        ts.sql = `select  dt.fulldate startdate\
     , dt.dayno\
     , per.description\
     , concat(dt.fulldate, ' ', per.starttime) startEvt\
     , concat(dt.fulldate, ' ', per.endtime) endEvt\
     , per.length\
     , substr(per.periodname,4,1) periodno\
     , l.shortname subject\
     , l.description subjectname\
     , r.menemonic user_name\
     , 'white' color
     , per.id\
     , per.dow\
     , group_concat(r.gradeclass) gradeclass \
FROM dkhs_date dt , dkhs_dayperiod per, dkhs_rooster r, dkhs_lsubject l \
WHERE r.menemonic = '${this.incomingMenemonic || this.getZml.login.username}'
  AND per.dow = dt.dayOfWeek\
  AND dt.iddate <  DATE(now() + INTERVAL 30 DAY)\
  AND dt.iddate >  DATE(now() - INTERVAL 30 DAY)\
  AND r.periodno = substr(per.periodname,4,1)\
  AND r.dayno = dt.dayno\
  and r.subjectshortname = l.shortname \
group by dt.fulldate\
     , dt.dayno, per.description, concat(dt.fulldate, ' ', per.starttime), concat(dt.fulldate, ' ', per.endtime)\
     , per.length, substr(per.periodname,4,1), l.shortname, l.description, r.menemonic, per.id, per.dow \
order by startdate,dt.dayno,  per.periodname, l.shortname`
        ts.api = zmlConfig.apiDKHS
        this.loading = true;
        zmlFetch(ts, this.afterRoosterSelect, this.someError);
      },
      someError(err) {
        errorSnackbar(`Problem fetching calendar events for ${this.incomingMenemonic || this.getZml.login.username}`)
        this.$cs.l('cl','Problem fetching calendar events fo',err)
      },
      subjectColor(subjectShortName) {
        let colorObj = this.getZml.subjects.find(dt =>  dt.shortname == subjectShortName )
        if (colorObj && colorObj.color) {
           return colorObj.color
        } else {
          return "amber darken-2"
        }
      },
      afterRoosterSelect(response) {
        if (this.getZml.calendar.length==0) {
          errorSnackbar(`Oops! - Our calendar events have not been loaded yet, please logout and login again.`)
        }
        if (response.errorcode != undefined) {
          infoSnackbar(`We have no class entries for ${this.incomingMenemonic || this.getZml.login.username}`)
          this.calReady = true
          return
        }
        if (!response.length) {
          infoSnackbar(`We have no Rooster entries for ${this.incomingMenemonic || this.getZml.login.username}`)
          this.calReady = true
          return
        }

        this.$cs.l('cl',`Loading Persevents for ${this.incomingMenemonic || this.getZml.login.username}`)
        this.calReady = true
        response.forEach(ele => {
          //this.$cs.l('cl',ele)
          const evt = {
                  name: ele.subject + ' ' + ele.gradeclass
                , start: ele.startEvt
                , end:   ele.endEvt
                , color: this.subjectColor( ele.subject )
                , timed: true
                , details: `${ele.subjectname}, ${ele.user_name}, ${ele.gradeclass}, ${ele.dayno}, ${ele.periodno}, ${ele.length}`
                , temp: true
            }
          this.events.push( evt )
        })

        //Brilliant funcking timeout stukkie!!
        this.$cs.l('cl','DONE LOADINGF ROOSTER', this.events)
        this.calReady = true
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
           console.error('Calendar Ready: ' , this.calReady)
           this.getZml.events = this.events
         }

       },
       rinseRepeat() {
         this.activateCalendar()
         if (!this.calReady) {
          setTimeout(() => { this.rinseRepeat() }, 2000)
         }
      },
      startTheLoad() {
        this.$cs.l('check if events was loaded..')
        if( this.getZml.calendar.length < 20) {
            setTimeout(this.startTheLoad, 50) //wait 50 millisecnds then recheck
            this.$cs.l('check AGAIN if events was loaded')
            return
        }
        this.$cs.l('cl','calendar events is now cool!!!!!', this.getZml.calendar.length)
        this.today = new Date()
        this.today.setHours(0,0,0,0)
        this.calToday = zDate.format(this.today,'yyyy-MM-dd')
        this.loadCalendar()
        this.loadRooster()

      },
      sideColor(eventname) {
        switch (eventname) {
          case 'Break': return "break"
          case 'Admin': return "admin"
        }
        return ''
      },
      gfc(color) {
        if (!color) return ''
        return vuetifyColor.getBestColor(color)
      }
    },
  computed: {
      sortIt() {
        let cal = this.getZml.calendar.filter(item => item.type == 'School')
        // this.$cs.l('cl',this.getZml.calendar,cal)
        return cal.sort((a,b) => a.startdate - b.startdate)
      },

      cal () {
        return this.calReady ? this.$refs.calendar : null
      },
      nowY () {
        return this.cal ? this.cal.timeToY(this.cal.times.now) + 'px' : '-10px'
      },
    },
  mounted () {
    if (!this.menemonic) {
      if (this.$route.params.menemonic) {
          this.incomingMenemonic = this.$route.params.menemonic.toUpperCase()
      }
    } else {
      this.incomingMenemonic = this.menemonic
    }
    this.$cs.l('MOUNTING CALENDAR-----------------for', this.incomingMenemonic)

      zData.initialData('Load Subject Data')
      zData.calendarData('Load Calendar Data')
      this.startTheLoad()
  },
  watch: {
    menemonic(x) {
      this.$cs.l('cl','watch triggered', x)
      this.incomingMenemonic = this.menemonic
    },
    incomingMenemonic() {
      if (this.incomingMenemonic) this.loadRooster()
    }
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