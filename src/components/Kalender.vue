<template>
<v-card class="ma-0 pa-0" color="white">
 <!-- EVENTEEES {{ events }} -->
<base-tool :toolList="[]"
            toolbarName="DEKHS CALENDAR"
           :loading="loading"
            >
            <v-btn icon title="Possible printing?" @click="() => {alert('ddd')}">
            E
           </v-btn>
</base-tool>

  <v-row>
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
        <v-btn small class="ma-2" color="primary" @click="setToday">
            Today
        </v-btn>
      </v-col>
      <v-col cols=3>
        <v-toolbar-title v-if="$refs.calendar">
            {{ $refs.calendar.title }}
        </v-toolbar-title>
      </v-col>
      <v-col cols=3 class="text-right">
         <v-btn align="right" class="ma-2" small color="primary" @click="weekOrDayChange">  {{ weekOrDay }} </v-btn>
      </v-col>
      <v-col cols=1>
        <v-btn icon class="ma-2" @click="$refs.calendar.next()">
          <v-icon>mdi-chevron-right</v-icon>
        </v-btn>
       </v-col>
     </v-row>
    </v-toolbar>
    </v-sheet>
    <v-sheet height="800">
        <!-- overlap is stack or column -->
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
          event-overlap-mode="stack"
          color="primary"
          :type="weekOrDay"
          intervalMinutes="60"
           :interval-format="intervalFormat"
          first-time="07"
          interval-count="10"
          interval-height="45"
          short-intervals
          @change="updateRange"
          @click:event="showEvent"
          @click:more="viewDayMore"
          @click:date="viewDayDate"
          @click:day="viewDay"

        > <!-- weekdays=[1,2,3,4,5,6,0] -->
         <!-- <template v-slot:day-body="{ date, week }">
            <div
               class="v-current-time"
              :class="{ first: date === week[0].date }"
              :style="{ top: nowY }"
            >
            </div>
         </template> -->


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
              xdark
            >
              <v-btn icon>
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
              <v-toolbar-title v-if="selectedEvent" v-html="showEvtNameAndTime"> </v-toolbar-title>
            </v-toolbar>
            <v-card-text>
              <span v-if="selectedEvent" v-html="selectedEvent"></span>
            </v-card-text>
            <v-card-actions>
              <v-btn
                text
                color="secondary"
                @click="clickLoad"
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
  <v-container fluid v-if="getZml.login.superUser">

<base-title-expand  heading="Periods">
  <period-table />
</base-title-expand>


<base-title-expand  heading="All Events">
    <v-card>
      <v-card-title><h4> Only Werner - this is all the events (Periods, Days, Holidays and Birthdays)</h4> </v-card-title>
      <v-card-text>
         <v-data-table
           :headers="eventHeaders"
           :items="events"
           class="elevation-1"
           multi-sort
         />
      </v-card-text>
   </v-card>
</base-title-expand>

  </v-container>
        <!-- <v-btn  @click="checkChange"> R(CC) </v-btn> -->
</v-card>
</template>

<script>
//import { format         ,lastDayOfMonth        , addYears } from 'date-fns'
import { getters } from "@/api/store"
import { zDate } from '@/api/zDate.js'
//import { zData } from '@/api/zGetBackgroundData.js'
import { zmlConfig } from '@/api/constants.js';
import { zmlFetch } from '@/api/zmlFetch.js';
import baseTool from '@/components/base/baseTool.vue'
import BaseTitleExpand from '@/components/base/BaseTitleExpand.vue'
import PeriodTable from '@/components/cal/PeriodTable.vue'
export default {
  name: 'Kalendar',
  components: {baseTool
             , BaseTitleExpand
             , PeriodTable
  },
  data: () => ({
      getZml: getters.getState({ object: "gZml" }),
      loading:false,
      today: null,
      calToday: null,
      calValue: '',
      calReady: false,
      events:[{ start: "1900-01-01", name: "" }],
      eventHeaders: [{value: 'name', text: 'desc'}
                  ,  {value: 'detail', text:'det'}
                  ,  {value: 'length', text:'len'}
                  ,  {value: 'start', text:'startdate'}
                  ,  {value: 'end', text:'endtime'}
                  ,  {value: 'color'}
                  ,  {value: 'type', text:'pname'}
                  ,  {value: 'timed'}, {value: 'id'}],
      selectedEvent: null,
      selectedElement: null,
      selectedOpen: null,
      personeelMenemonic: '',
      weekOrDay:'week',
      weekday:[1, 2, 3, 4, 5, 6, 0],
      weekdays: [
        { text: 'Sun - Sat', value: [0, 1, 2, 3, 4, 5, 6] },
        { text: 'Mon - Sun', value: [1, 2, 3, 4, 5, 6, 0] },
        { text: 'Mon - Fri', value: [1, 2, 3, 4, 5] },
        { text: 'Mon, Wed, Fri', value: [1, 3, 5] }]
  }),
  computed: {
      intervalFormat(e1,e2) {
        console.log('interval format',e1,e2)
        return e1.time
      },
      showEvtNameAndTime(e) {
        console.log('showEvtNameAndTime::e::',e)
        console.log('showEvtNameAndTime::E::',this.selectedEvent)
        console.log('showEvtNameAndTime::El::',this.selectedElement)
        console.log('showEvtNameAndTime::El-Span::',JSON.stringify(this.selectedElement))
        console.log('showEvtNameAndTime::Op::',this.selectedOpen)
        console.log(  `<div color="${this.selectedEvent.color}"> ${this.selectedEvent.name}  <small> ${this.selectedEvent.start} </small></div>`)
        return `${this.selectedEvent.detail}`
      },
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

  methods:{
      viewDayMore ({ date }) {
        console.log('click on a MORE')
        this.viewDay(date)
      },
      viewDayDate ({ date }) {
        console.log('click on a DATE')
        this.viewDay(date)
      },

      viewDay ({ date }) {
        console.log('You clicked on Day:', date, this.weekOrDay)
        this.calValue = date
        this.weekOrDay = 'day'
      },
      clickLoad(e) {
        console.log(e,'clickLoad')
      },
      weekOrDayChange() {
          switch (this.weekOrDay) {
          case 'day': this.weekOrDay = 'week';break
          case 'week': this.weekOrDay = 'month';break
          case 'month': this.weekOrDay = 'day';break
          }
      },
      checkChange() {
        if (this.$refs.calendar)  this.$refs.calendar.checkChange()
      },
      updateRange(whatweget) {
         console.info('Range Check', whatweget)

      },
      async loadPeriods() {
        let ts = {}
        ts.task = 'PlainSql'
        ts.api = zmlConfig.apiDKHS
        ts.sql = `select  dt.fulldate startdate
     , dt.dayno
     , per.description
     , per.starttime
     , per.endtime
     , per.length
     , per.periodname type
     , per.id
     , per.dow
     , if (periodname = 'Break', 'green lighten-1', 'green darken-2') color
FROM dkhs_date dt , dkhs_dayperiod per
WHERE per.dow = dt.dayOfWeek
  AND dt.iddate <  DATE(now() + INTERVAL 30 DAY)
  AND dt.iddate >  DATE(now() - INTERVAL 30 DAY)`
  await zmlFetch(ts, this.assignPerData,  () => {alert('dsome PER err') } )
      },
      assignPerData(response) {
        console.log('Assign Period Data')
        response.forEach(ele => {
          if (ele.startdate) {
             //Check if we have a valid endtime...
             if (!ele.endtime || ele.endtime == ele.starttime) {
               //console.log(`TRY endtime:${ele.startdate} ${ele.starttime}`)
               let d2 = new Date ( `${ele.startdate} ${ele.starttime}` )
               //console.log('endtime: (d2=)', d2, ele.type.indexOf('Per'))
               if (ele.type.indexOf('Per') > -1) {
                  d2.setMinutes(d2.getMinutes() + 40)
               } else {
                  d2.setMinutes(d2.getMinutes() + 15)
               }
               //console.log('endtime after:',ele.endtime, d2)
               ele.endtime = d2.getHours() + ':' + d2.getMinutes()
             }

             const evt= {name: ele.type
                  , detail: `Day:${ele.dayno} ${ele.description} - ${ele.type} - ${ele.length}M`
                  , start: `${ele.startdate} ${ele.starttime}`
                  , end: `${ele.startdate} ${ele.endtime}`
                  , color: ele.color
                  , type: ele.type
                  , timed: true
                    }
             this.events.push(evt)
            //  const tevt= {name: 'SOME TEST'
            //       , detail: `sometest`
            //       , start: `${ele.startdate} ${ele.starttime}`
            //       , end: `${ele.startdate} ${ele.endtime}`
            //       , color: 'orange'
            //       , type: 'School'
            //       , timed: true
            //         }
            //  this.events.push(tevt)
          } else {
            console.error(ele.startdate, 'One of our periods does not have a startdate!',ele);
          }
        })
      },
      async loadCalendar() {
        console.log('LoadCalendar:')
        let ts = {}
        ts.task = 'PlainSql'
        ts.api = zmlConfig.apiDKHS
        ts.sql = `select * from (
 select dt.idDate startdate, dt.fulldate enddate, dt.week, dt.dayno dayNo
     ,  concat('day',dayno) event
     , if(dayNo != '0',"School",null) type
     , 'light-blue' color
 FROM dkhs_date dt
 union all
 select dt.idDate,dt.fulldate, dt.week, dt.dayno dayNo
     , hol.holidayname event
     , if(length(hol.holidayname) > 1,"Holiday",null) type
     , 'green'
 FROM dkhs_date dt
 LEFT JOIN dkhs_holiday hol on dt.iddate = hol.iddate
 WHERE dt.idDate <  DATE(now() + INTERVAL 30 DAY)
  AND dt.idDate >  DATE(now() - INTERVAL 30 DAY)
 union all
 select dt.idDate,dt.fulldate, dt.week, dt.dayno dayNo
     , pers.public_preferredname evt
     , if( length(pers.surname) > 4,'Birthday','whatever') type
     , 'indigo'
 FROM dkhs_date dt
 LEFT JOIN dkhs_personel pers on concat(substr(dt.fulldate,9,2), '-', substr(dt.fulldate,6,2)) = concat(substr(pers.IDNumber,3,2), '-', substr(pers.IDNumber,5,2))
where length(pers.IDNumber) > 4
) ev
WHERE ev.startdate <  DATE(now() + INTERVAL 60 DAY)
  AND ev.startdate >  DATE(now() - INTERVAL 60 DAY)
  AND ev.type is not null
ORDER BY ev.startdate
`
        await zmlFetch(ts, this.assignCalData,  () => {alert('dfsdfsdfsdf') } )
      },
      assignCalData(response) {
        this.getZml.calendar = response
        console.log(response)
        this.getZml.calendar.forEach(ele => {
          if (ele.startdate) {
             const evt= {name: ele.event
                  , start: ele.enddate
                  , end: ele.enddate
                  , color: ele.color
                  , type: ele.type
                  , timed: false //ele.timed
                    }
             this.events.push(evt)
          } else {
            console.error(ele.startdate, 'One of our event does not have a startdate!',ele);
          }
        })
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
         }

       },
       rinseRepeat() {
         this.activateCalendar()
         if (!this.calReady) {
          setTimeout(() => { this.rinseRepeat() }, 2000)
         }
      },
    },
  created () {
    if (!this.menemonic) {
      if (this.$route.params.menemonic) {
          this.incomingMenemonic = this.$route.params.menemonic.toUpperCase()
      }
    } else {
      this.incomingMenemonic = this.menemonic
    }
    this.today = new Date()
    this.today.setHours(0,0,0,0)
    this.calToday = zDate.format(this.today,'yyyy-MM-dd')
    this.loadCalendar();
    this.loadPeriods();
  },
  mounted () {
    this.$cs.l('MOUNTING KKKKKALENDER-----------------')
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