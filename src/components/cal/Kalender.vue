<template>
<v-container fluid class="ma-0 pa-0">
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
    <v-toolbar flat dense :loading="loading" class="ma-2 pa-2">
     <v-row>
      <v-col cols=1>
        <v-btn icon class="ma-2" @click="$refs.calendar.prev()">
          <v-icon>mdi-chevron-left</v-icon>
        </v-btn>
      </v-col>
      <v-col cols=4>
        <v-btn x-small class="ma-2" color="primary" @click="setToday">
          <span v-if="$vuetify.breakpoint.mdAndUp"> Today</span>
          <v-icon v-else small> mdi-calendar-today</v-icon>
        </v-btn>
        <v-btn x-small color="primary" title="Edit this Day"
               @click="showDay = true"
        >
          <span v-if="$vuetify.breakpoint.mdAndUp">  {{ calValue }}  </span>
          <span v-else> E </span>
        </v-btn>
      </v-col>
      <v-col cols=3>
        <v-toolbar-title v-if="$refs.calendar">
            {{ $refs.calendar.title }}
        </v-toolbar-title>
      </v-col>
      <v-col cols=3 class="text-right">
         <v-btn-toggle small v-model="toggleView" >
         <v-btn class="ma-0" x-small xicon color="primary" @click="weekOrDay = 'day'">
          <span v-if="$vuetify.breakpoint.mdAndUp"> day</span>
          <span v-else>d</span>
         </v-btn>
         <v-btn class="ma-0" x-small xicon color="primary" @click="weekOrDay = 'week'">
          <span v-if="$vuetify.breakpoint.mdAndUp"> week</span>
          <span v-else>w</span>
         </v-btn>
         <v-btn class="ma-0" x-small xicon color="primary" @click="weekOrDay = 'month'">
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
    <v-sheet height="800">
        <!-- overlap is stack or column -->
        <v-calendar
          dense="!$vuetify.breakpoint.mdAndUp"
          v-if="events.length > 0"
          ref="calendar"
          v-model="calValue"
          :now="calToday"
          :value="calToday"
          :events="events"
          :weekdays="$vuetify.breakpoint.mdAndUp ? weekday : weekdayShort"
          event-color="secondary"
          event-overlap-mode="stack"
          color="primary"
          :type="weekOrDay"
          first-time="06:30"
          :interval-format="intervalFormat"
          intervalMinutes="60"
          interval-count="20"
          interval-height="55"
          interval-minutes="30"
          short-intervals
          :short-weekdays="!$vuetify.breakpoint.mdAndUp"
          :show-month-on-first="$vuetify.breakpoint.mdAndUp"
          @change="updateRange"
          @click:event="clickEvent"
          @click:more="clickMore"
          @click:date="clickDate"
          @click:day="clickDay"
          @click:day-category="clickDayCategory"
          @click:interval="clickInterval"
          @click:time="clickTime"

        >
        <template v-slot:event="{event}">
          <!-- <div :style="{'background-color':event.color,color:'white'}" class="fill-height pl-2"> -->
          <div :style="{ 'background-color':event.color,color: gfc(event.color) }"
               class="fill-height pl-2"
               :class="sideColor(event.name)"
          >
            {{ event.name }} {{ event.start.substr(11,5) }}
            <!-- {{ event.detail }} -->
          </div>
        </template>
        <!-- weekdays=[1,2,3,4,5,6,0] -->
         <!-- <template v-slot:day-body="{ date, week }">
            <div
               class="v-current-time"
              :class="{ first: date === week[0].date }"
              :style="{ top: nowY }"
            >
            </div>
         </template> -->

        </v-calendar>
     </v-sheet>
    </v-col>
  </v-row>

<v-dialog v-model="showEvent" width="455px" height="100%" scrollable color="red">
  <event-form @save="saveEvent" @close="showEvent = false" :eventDetails="selectedEvent"/>
</v-dialog>

<v-dialog v-model="showDay" width="455px" height="100%" scrollable color="red">
  <day-form @xsave="saveEvent" @close="showDay = false" :dayDetails="this.calValue"/>
</v-dialog>


 <base-title-expand  heading="Periods">
  <period-list-view />
 </base-title-expand>

<base-title-expand  heading="Events">
  <event-list-view />
 </base-title-expand>

<v-container fluid v-if="getZml.login.superUser">
 <base-title-expand  heading="All Events">
    <v-card>
      <v-card-title><h4> (Periods, Days, Holidays and Birthdays)</h4> </v-card-title>
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
  <!-- <base-title-expand  heading="TestCal1">  <test-cal-1 /> </base-title-expand>
 <base-title-expand  heading="TestCal2">  <test-cal-2 /> </base-title-expand>
 <base-title-expand  heading="TestCal3">  <test-cal-3 /> </base-title-expand> -->

  </v-container>
        <!-- <v-btn  @click="checkChange"> R(CC) </v-btn> -->
</v-container>
</template>

<script>
import { calEvents } from '@/components/cal/CalEvents.js'
import { getters } from "@/api/store"
import { zDate } from '@/api/zDate.js'
import { vuetifyColor } from '@/api/vuetifyColor.js'
import baseTool from '@/components/base/baseTool.vue'
import BaseTitleExpand from '@/components/base/BaseTitleExpand.vue'
import PeriodListView from '@/components/cal/PeriodListView.vue'
import EventListView from '@/components/cal/EventListView.vue'
import EventForm from '@/components/cal/EventForm.vue'
import DayForm from '@/components/cal/DayForm.vue'


// import TestCal1 from '@/components/cal/TestCal1.vue'
// import TestCal2 from '@/components/cal/TestCal2.vue'
// import TestCal3 from '@/components/cal/TestCal3.vue'

export default {
  name: 'Kalendar',
  components: {baseTool
             , BaseTitleExpand
             , PeriodListView
             , EventListView
             , EventForm
             , DayForm
  },
  data: () => ({
      getZml: getters.getState({ object: "gZml" }),
      loading:false,
      today: null,
      calToday: null,
      calValue: '',
      calReady: false,
      events:[],
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
      weekOrDay:'week',
      weekday:[1, 2, 3, 4, 5, 6, 0],
      weekdayShort:[1,2,3,4,5],
      weekdays: [
        { text: 'Sun - Sat', value: [0, 1, 2, 3, 4, 5, 6] },
        { text: 'Mon - Sun', value: [1, 2, 3, 4, 5, 6, 0] },
        { text: 'Mon - Fri', value: [1, 2, 3, 4, 5] },
        { text: 'Mon, Wed, Fri', value: [1, 3, 5] }],
      showEvent: false,
      showDay: false,
      toggleView: 1,
  }),
  computed: {
      intervalFormat(locale, getOptions) {
        console.log('----------------------------------',locale, getOptions)
        return locale.time
      },
      showEvtNameAndTime() {
        //Show vue component...console.log('showEvtNameAndTime::e::',e)
        //Show the actual event date,name,color etc..: console.log('showEvtNameAndTime::E::',this.selectedEvent)
        //<span event-summry... etc.. console.log('showEvtNameAndTime::El::',this.selectedElement)
        //stuff..console.log('showEvtNameAndTime::El-Span::',JSON.stringify(this.selectedElement))
        //null - console.log('showEvtNameAndTime::Op::',this.selectedOpen)
        console.log(  `<div color="${this.selectedEvent.color}"> ${this.selectedEvent.name}  <small> ${this.selectedEvent.start} </small></div>`)
        //can return stuff based on this.selectedEvent.name
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
  //click:date The click event on the day of the month link. The event passed is the day & time object. Native mouse event is passed as a second argument.
  //click:day	 The click event on a day. The event passed is the day object. Native mouse event is passed as a second argument.
  //click:day-category	The click event on a day in the category view. The event passed is the day object. Native mouse event is passed a 2nd
  //click:event	The click event on a specific event. The event passed is the day & time object. see https://v2.vuetifyjs.com/en/api/v-calendar/#events
  //click:interval The click event at a specific interval label in the day view. The event passed is the day & time object. Native mou
  //click:more	The click event on the X more button on views with too many events in a day. Native mouse event is passed as
  //click:time	The click event at a specific time in the day view. The event passed is the day & time object. Native mouse event is
      clickTime ({ date,past,future, hasTime, hour, minute }) {
        //-------------------------------------------------------------------------
        // Here we are clicking on an empty part of the calendar, but underneath a day
        // So we can assume they want to add an event : we have a day and a time
        // We should ALWAYS have a time in here!
        //-------------------------------------------------------------------------
        console.log('-----------clicked on aTIME in Day View, week view, mo', date, 'past=',past,'fut=',future, 'hasT',hasTime)
        if (this.showEvent == true) return //we handled it already
        if (past == true) {
          console.log('you want to add an event in the past?')
        }
        this.createBlankEvent(date, hasTime, hour, minute,past,future)
      },
      clickInterval ({ date,past,future, hasTime, hour, minute }) {
        console.log('------------clicked on a DAyINTERVAL', date,'past=',past,'fut-',future, 'hastime=',hasTime, 'timetoY', hour,minute )
        if (this.showEvent == true) return //we handled it already
        //-------------------------------------------------------------------------
        // Here we are clicking on the intervals on the side. So we have a time
        // And the date closest to the side. usually a Monday
        // We should ALWAYS have a time in here!
        //-------------------------------------------------------------------------
        //create blank event
        this.createBlankEvent(date, hasTime, hour, minute,past,future)
      },
      clickMore ({ date, week }) {
        //-------------------------------------------------------------------------
        // He clicked on that little more button if there are too many events.
        // Take hom to a day
        //-------------------------------------------------------------------------
        console.log('-------------clicked on a MORE',date)
        this.clickDay({date, week})
      },
      clickDate ({ date,past,future, hasTime },e) {
        console.log('do we have an event here?????',e)
        //-------------------------------------------------------------------------
        //We can use this one (big dayofmonth round button click) to switch to dayview
        //Or we can do nothing, except make the currentSelectedDate = date
         //-------------------------------------------------------------------------
        console.log('--------------clicked on a DATE', date,past,future, hasTime )
        this.calValue = date
      },
      clickDay ({ date,week }) {
        //-------------------------------------------------------------------------
        //We can use this to show period times for the day, based on date and weekno
        //If he click on the top white area, or anywhere on a date in monthview we get here.
        //-------------------------------------------------------------------------
        console.log('-----------------clicked on Day:', date, week, this.weekOrDay)
        if (this.weekOrDay == 'month') {
          this.weekOrDay = 'week'
          this.calValue = date
          return
        }
        let clickedDayOfWeek = week.find(e => e.date == date)
        console.log('Day (WeekNO) - we found weekno:',clickedDayOfWeek.weekday)
        this.calValue = date
        this.weekOrDay = 'day'
      },
      clickEvent ({ nativeEvent, event }) {
        console.log('----------------clicked on Event:',event.name, event.name.indexOf('day'), event, nativeEvent)
        if (this.showEvent == true) return
        this.selectedEvent = event
        this.selectedElement = nativeEvent.target
        //See if the event is one of our DayNo's like 'day1'
        if (event.name.indexOf('day') == 0) {
          this.calValue = event.start
          this.showDay = true
        } else {
          this.showEvent = true
        }
        nativeEvent.stopPropagation()
      },
      clickDayCategory ({ date,past,future, hasTime }) {
        //-------------------------------------------------------------------------
        //We do not have any day categories - so should never get this one
        //-------------------------------------------------------------------------
        console.log('-------------click on a DAyCATegory', date,past,future, hasTime )
        alert('You clicked on a day category!')
      },
      clickLoad(e) {
        console.log(e,'clickLoad')
      },
      createBlankEvent(date, hasTime, hour, minute) {
        let gooddate = date
        if (hasTime) gooddate = date + ` ${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`
        this.selectedEvent = {id:0,start: gooddate, end: gooddate, timeStart:'', timeEnd:'', name:'', type:'', timed:'', color:''}
        this.showEvent = true
      },
      checkChange() {
        if (this.$refs.calendar)  this.$refs.calendar.checkChange()
      },
      updateRange(whatweget) {
         console.info('Range Check', whatweget)
      },
      async saveEvent(e) {
        console.log('Saving Event', e ,'to', this.selectedEvent)
        if (e.id == undefined || e.id == 0 || e.id == '' || !e.id) {
          //This is an insert, and not an update
          this.events.push(e)
          calEvents.insertCalEvent(e, () => { this.showEvent = false})
          return
        }
        let updateEvt = this.events.find(ele => ele.id == e.id)
        //console.log('After find :' , updateEvt)
        if (updateEvt != undefined) {
           //let's play
           updateEvt = e
          //  updateEvt.name = e.name
          //  updateEvt.detail = "we made a change"
          //  updateEvt.color = "black"
          //  updateEvt.start = e.start
          //  updateEvt.end = e.end
        }
        calEvents.saveCalEvent(e, () => { this.showEvent = false})
      },
      // ---------------------------SHORT FUNCTIONS--------------------------
      setToday () {  this.calValue = '' },
      getCurrentTime () { return this.cal ? this.cal.times.now.hour * 60 + this.cal.times.now.minute : 0},
      scrollToTime () {
        const time = this.getCurrentTime()
        const first = Math.max(0, time - (time % 30) - 30)

        this.cal.scrollToTime(first)
      },
      updateTime () { setInterval(() => this.cal.updateTimes(), 60 * 1000) },
      // ---------------------------END OF SHORT FUNCTIONS --------------------------
      activateCalendar() {
          //if (this.$refs.calendar !== undefined) {
          if (this.calReady == false) {
            console.error('Calendar is Ready?: ' , this.$refs.calendar)
            if (this.$refs.calendar)  this.$refs.calendar.checkChange()
            this.calReady = true
            if (this.$refs.calendar) this.scrollToTime()
            if (this.$refs.calendar) this.updateTime()
          } else {
           console.error('Calendar is Ready: ' , this.calReady)
         }
      },
      rinseRepeat() {
         this.activateCalendar()
         if (!this.calReady) {
          setTimeout(() => { this.rinseRepeat() }, 2000)
         }
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
  created () {
    this.today = new Date()
    this.today.setHours(0,0,0,0)
    this.calToday = zDate.format(this.today,'yyyy-MM-dd')
    this.calValue = this.calToday

    let evt= {
                id:99999,
                name: 'My Googl Event it'
              , detail: `Some detaiil to display when we are clicked`
              , start: '2023-03-14 14:00'
              , end: '2023-03-16 08:00'
              , color: 'cyan'
              , type: 'Werner'
              , timed: true
              , eventid: 3
                }
    this.events.push(evt)
    evt= {
                id:99999,
                name: 'My Google Event no time'
              , detail: `Some detaiil to display when we are clicked`
              , start: '2023-03-14'
              , end: '2023-03-16'
              , color: 'cyan'
              , type: 'Werner'
              , timed: false
              , eventid: 3
                }
    this.events.push(evt)
    calEvents.LoadCalendarData(this.events, 'PeriodsAsEvents', ()=>{
      console.log('done with two' + this.events.length)
      this.rinseRepeat()
    })
    calEvents.LoadCalendarData(this.events,'DaysHolidaysBirthdays', ()=>{
      console.log('done with one' + this.events.length)
    })
    calEvents.LoadCalendarData(this.events, 'LocalEvents', ()=>{
      console.log('done with two' + this.events.length);
    })

  },
  mounted () {
    this.$cs.l('MOUNTING KKKKKALENDER-----------------')
    this.$cs.l('hex',vuetifyColor.hexColor('red ligten-2'))
    this.$cs.l('hex',vuetifyColor.hexColor('primary'))
    this.$cs.l('text?', vuetifyColor.textColor( vuetifyColor.hexColor('red darken-2')))
    this.$cs.l('best?', vuetifyColor.getBestColor('red darken-2'))
    this.$cs.l('best?', vuetifyColor.getBestColor('blue lighten-2'))
    this.$cs.l('best?', vuetifyColor.getBestColor('blue accent-4'))

  },
  watch: {
  },
}
/*
To check if the period times is correct, run this sql
SELECT periodname, length(starttime), length(endtime), count(*)
  FROM `dkhs_dayperiod`
group by periodname, length(starttime), length(endtime)
*/
</script>

<style scoped>
.break {
  border-left: 5px solid rgb(243, 247, 38);
}
.admin {
  border-left: 5px solid rgb(192, 214, 235);
}

</style>

<style lang="scss">
.v-current-time {
  height: 2px;
  background-color: #9ff514;
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