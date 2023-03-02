<template>
<v-card class="ma-0 pa-0" color="white">
  <v-row v-if="incomingMenemonic">
    <v-col>
    <v-sheet
      tile
      height="44"
    >
    <v-toolbar
       flat
       dense
       :loading="loading"
    >

    <v-row>
      <v-col cols=1>
        <v-btn
        icon
        class="ma-2"
        @click="$refs.calendar.prev()"
        >
          <v-icon>mdi-chevron-left</v-icon>
        </v-btn>
      </v-col>
      <v-col cols=4>
        <v-btn small class="ma-2" color="primary" @click="setToday">
            Today
        </v-btn>
      </v-col>
      <v-col cols=3>
        <v-toolbar-title v-if="$refs.calendar">
            {{ $refs.calendar.title }}
        </v-toolbar-title>
      </v-col>
      <v-col cols=3>
        <v-card xcolor="primary" class="ma-2 pt-0 pb-0 pr-2 pl-2" elevation="1" >
          {{ incomingMenemonic }} <small>Display:</small>
         <v-btn x-small @click="weekOrDayChange">  {{ weekOrDay }} </v-btn>

        </v-card>
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
          dense
          v-if="events.length > 0"
          ref="calendar"
          v-model="calValue"
          :now="calToday"
          :value="calToday"
          :events="events"
          :weekdays="weekday"
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
         <template v-slot:day-body="{ date, week }">
            <div
               class="v-current-time"
              :class="{ first: date === week[0].date }"
              :style="{ top: nowY }"
            >
            <!-- <v-card color="red">..</v-card> -->
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
              color="selectedEvent.color"
              dark
            >
              <v-btn icon>
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
              <v-toolbar-title v-if="selectedEvent" v-html="selectedEvent.name"></v-toolbar-title>
            </v-toolbar>
            <v-card-text>
              <span v-if="selectedEvent" v-html="selectedEvent.details"></span>
              <v-text-field v-model="personeelMenemonic" label="Educator Menemonic" />
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
  <v-container v-else>
     srfwerwerewrwerewrwerew
  </v-container>
        <v-btn  @click="checkChange"> R(CC) </v-btn>
</v-card>
</template>

<script>
//import { format         ,lastDayOfMonth        , addYears } from 'date-fns'
import { getters } from "@/api/store"
import { zDate } from '@/api/zDate.js'
import { zData } from '@/api/zGetBackgroundData.js'
import { zmlConfig } from '@/api/constants.js';
import { zmlFetch } from '@/api/zmlFetch.js';
export default {
  name: 'Calendar',
  props: ['menemonic'],
  data: () => ({
      getZml: getters.getState({ object: "gZml" }),
      loading:false,
      today: null,
      calToday: null,
      calValue: '',
      calReady: false,
      events:[{ start: "1900-01-01", name: "" }],
      selectedEvent: null,
      selectedElement: null,
      selectedOpen: null,
      incomingMenemonic: null,
      personeelMenemonic: '',
      weekOrDay:'week',
      weekday:[1, 2, 3, 4, 5, 6, 0],
      weekdays: [
        { text: 'Sun - Sat', value: [0, 1, 2, 3, 4, 5, 6] },
        { text: 'Mon - Sun', value: [1, 2, 3, 4, 5, 6, 0] },
        { text: 'Mon - Fri', value: [1, 2, 3, 4, 5] },
        { text: 'Mon, Wed, Fri', value: [1, 3, 5] }]
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
        this.getZml.calendar.forEach(ele => {
          if (ele.start) {
             const evt= {name: ele.name
                  , start: ele.start
                  , end: ele.start
                  , color: ele.color
                  , type: ele.type
                  , timed: ele.timed
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
        this.personeelMenemonic = this.incomingMenemonic
        if (!this.personeelMenemonic) this.personeelMenemonic = 'TVRB'

/*      we have GROEN as a menemonic - so cannot do this test
        if (this.personeelMenemonic.substr(0,2) == 'GR') {
          //This is not a personeel mnemonic, it's a grade,
          //so our select statement need to change
          alert('we need a personel menemonic, not a grade')
          return
        }
*/
        let ts = {}
        ts.task = 'PlainSql'
        ts.sql = "select * from rooster where user_name = '" + this.personeelMenemonic + "'";
        ts.api = zmlConfig.apiDKHS
        this.loading = true;
        zmlFetch(ts, this.afterRoosterSelect);
      },
      getPeriodStartTime(hm,element, dateLooking) {
         let perStart = zDate.dayType.find(dt =>  dt.type == 'Per'+element.periodno && dt.dayNo == dateLooking.getDay() )
         hm.h = parseInt(perStart.start.substr(0,2))
         hm.m = parseInt(perStart.start.substr(3,2))
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
          alert(`Oops! - Our calendar seem to be empty for ${this.personeelMenemonic}?`)
        }
        if (response.error) {
          return
        }
        let template = zDate.todayNoHours()
        this.$cs.l('zDate.todayNoHours()', template)

        template = zDate.gotoMonday(template)
        this.$cs.l('zDate.gotoMonday', template)

        //Go back one week
        template.setDate(template.getDate() - 7);
        this.$cs.l('go one back - to sunday', template)
        // Show the next 57 days...
        for (let t=0; t < 57; t++) {
          //this.$cs.l('loading : ', t, zDate)
           template = zDate.addOneDay(template)
           //Look for template's date and link to a dayno.
           const sday = this.getZml.calendar.find(cal =>
              cal.start == zDate.format(template,'yyyy-MM-dd') && cal.name.substr(0,3) == 'day'
           )
           if (!sday) {
             // Usually when it's a weekend?
             // console.log('Skipping:', zDate.format(template,'yyyy-MM-dd'), template.getDay())
             continue
           }
           response.forEach(ele => {
             let n = ''
             switch (sday.name.substr(0,4)) {
               case 'day1': n = ele.day1; break
               case 'day2': n = ele.day2; break
               case 'day3': n = ele.day3; break
               case 'day4': n = ele.day4; break
               case 'day5': n = ele.day5; break
               case 'day6': n = ele.day6; break
               case 'day7': n = ele.day7; break
               case 'day8': n = ele.day8; break
               case 'day9': n = ele.day9; break
               case 'day10':n = ele.day10; break
             }
             if (n) {
               let hm = {}
               this.getPeriodStartTime(hm,ele,template)
               let lines = n.split(/\n/);
               const per = lines[0]
               const grade = lines[1]
               const evt = {
                       name: per + ' ' + ele.periodno + ' ' + grade.substr(0,4) + ' ' + ele.user_name
                     , start: template.setHours(hm.h, hm.m, 0, 0)
                     , end:   template.setHours(hm.h, hm.m + 45, 0, 0)
                     , color: this.subjectColor( n.substr(0,3) )
                     , timed: true
                     , details: n
                 }
               this.events.push( evt )
             }
           })
        }
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
        if( this.getZml.calendar.length < 300) {
            setTimeout(this.startTheLoad, 50) //wait 50 millisecnds then recheck
            this.$cs.l('check AGAIN if events was loaded')
            return
        }
        console.log('calendar events is now cool!!!!!', this.getZml.calendar.length)
        this.today = new Date()
        this.today.setHours(0,0,0,0)
        this.calToday = zDate.format(this.today,'yyyy-MM-dd')
        this.loadCalendar()
        this.loadRooster()

      }
    },
  computed: {
      sortIt() {
        let cal = this.getZml.calendar.filter(item => item.type == 'School')
        // console.log(this.getZml.calendar,cal)
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
    this.$cs.l('MOUNTING CALENDAR-----------------')
    if (!this.menemonic) {
      if (this.$route.params.menemonic) {
          this.incomingMenemonic = this.$route.params.menemonic.toUpperCase()
      }
    } else {
      this.incomingMenemonic = this.menemonic
    }

      zData.initialData('Load Subject Data')
      zData.calendarData('Load Calendar Data')
      this.startTheLoad()
      //this.rinseRepeat()
  },
  watch: {
    menemonic() {
      this.incomingMenemonic = this.menemonic
      zData.calendarData('Load Calendar Data')
      this.loadRooster()
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