<template>
<v-card height="100%" class="ma-0 pa-0" color="white" >
   <v-toolbar dense class="mb-2">
   <v-row>
      <v-col cols=1>
        <v-btn icon class="ma-2" @click="$refs.calendar.prev()" > <v-icon>mdi-chevron-left</v-icon> </v-btn>
      </v-col>
      <v-col cols=4>
        <v-btn small class="ma-2" color="primary" @click="setToday" icon >
           <v-icon> mdi-calendar-today</v-icon></v-btn> <span class="light-blue lighten-5"> {{ calValue }} </span>
      </v-col>
      <v-col cols=3>
        <v-toolbar-title class="text-caption ma-2">  {{ heading || $refs.calendar.title }} </v-toolbar-title>
      </v-col>
      <v-col cols=3>
        <v-card class="ma-2 pt- pb-0 pr-2 pl-2 float-right" elevation="0" >
         <v-btn x-small @click="weekOrDay='day'" title="Day"> D </v-btn>
         <v-btn x-small @click="weekOrDay='week'" title="Week"> W </v-btn>
         <v-btn x-small @click="weekOrDay='month'" title="Month" > M </v-btn>
         <!-- <v-btn x-small @click="printIt"> p </v-btn> -->
        </v-card>
      </v-col>
      <v-col cols=1>
        <v-btn icon class="ma-2" @click="$refs.calendar.next()"> <v-icon>mdi-chevron-right</v-icon> </v-btn>
       </v-col>
    </v-row>
    </v-toolbar>
    <v-sheet height="100%" ref="printCal">
        <v-calendar
          dense
          color="primary" event-color="secondary"
          v-if="events.length > 0"
          ref="calendar"
          v-model="calValue"
          :now="calToday"          :value="calToday"
          :events="filterEvents"
          :weekdays="weekday"      :type="weekOrDay"
          :title="calValue"
          intervalMinutes="60"
          first-time="07:30"
          interval-count="8"       interval-height="55"          short-intervals
          @click:event="showEvent"
          @click:day="viewDay"
        >
        <!-- <template v-if="weekday == 'day'" v-slot:day="{ date }"> -->
        <template v-slot:day="{ date }">
          <template v-if="tracked[date]">
            <v-layout row wrap align-content-start justify-space-around class="ma-0 pa-0">
              <v-card v-for="(val,i) in tracked[date]"  :key="i"
                :title="category[i]"
                :color="color[i]"
                :width="val ? '44px' : '0'"
                :height="val ? '20%' : '0'"
                class="ma-1 text-center text-caption">
                {{ val ? category[i].substr(0,4) : '' }}
              </v-card>
            </v-layout>
          </template>
          <template v-else>
            <v-layout row wrap align-content-start justify-space-around class="ma-0 pa-0">
              <v-card  width="65px" height="25px" color="gray lighten-2" class="pa-1 text-center text-caption"> No Entry </v-card>
            </v-layout>
          </template>
        </template>
        </v-calendar>
<!-- <zml-data-table v-if="events" :dataList="events" userHeader="Events for..." /> -->

 <!---  SELECTED EVENT --->
       <template v-if="selectedElement">
        <v-menu v-model="selectedOpen" :close-on-content-click="false" :activator="selectedElement" offset-x max-width="350px" min-width="350px">
          <v-card color="blue-grey lighten-4"  flat >
            <v-toolbar color="selectedEvent.color" dark >
              <v-btn small icon> <v-icon>mdi-view-day</v-icon> </v-btn>
              <v-toolbar-title  v-if="selectedEvent" class="text-center">{{ selectedEvent.name }}</v-toolbar-title>
            </v-toolbar>
            <v-card-text>
              <span v-if="selectedEvent" > {{ selectedEvent.detail}}</span>
              <br><span> Time: {{ selectedEvent.start}}</span>
            </v-card-text>
            <v-card-actions>
              <!-- <v-btn text color="secondary" @click="selectedOpen = false" > Cancel </v-btn> -->
            </v-card-actions>
          </v-card>
        </v-menu>
       </template>
      </v-sheet>

</v-card>
</template>

<script>
import { zDate } from '@/api/zDate.js'
export default {
  name: 'quickCalendarDisplay',
  //components: {zmlDataTable},
  props: {
    passedEvents:{ default: []},
    heading:{default: ''}
    },
  data: () => ({
      loading:false,
      today: null,
      calToday: null,
      calValue: '',
      calReady: false,
      events:[],
      selectedEvent: null,
      selectedElement: null,
      selectedOpen: null,
      weekOrDay:'month',
      weekday:[1, 2, 3, 4, 5],
      weekdays: [
        { text: 'Sun - Sat', value: [0, 1, 2, 3, 4, 5, 6] },
        { text: 'Mon - Sun', value: [1, 2, 3, 4, 5, 6, 0] },
        { text: 'Mon - Fri', value: [1, 2, 3, 4, 5] },
        { text: 'Mon, Wed, Fri', value: [1, 3, 5] }],
      tracked: { "2023-02-21" : [],
                 "2023-02-22" : [],
                 "2023-02-14" : []
      } ,
      // color: ['green', 'orange', 'red accent-2','lightgray', 'green'],
      // category: ['Present', 'Late', 'Absent','No Entry', 'unKnown', 'unKnown'],
      color: ['orange', 'green', 'red accent-2','lightgray', 'green'],
      category: ['Late', 'Present', 'Absent','No Entry', 'unKnown', 'unKnown'],
      canvasOutput:{}

  }),
  methods:{
      viewDay({ date }) {
        this.focus = date
        this.weekOrDay = 'day'
      },
      weekOrDayChange() {
        switch (this.weekOrDay)  {
         case 'day': this.weekOrDay = 'week'; return
         case 'week': this.weekOrDay = 'month'; return
         case 'month': this.weekOrDay = 'day'; return
        }
      },
      checkChange() {
        if (this.$refs.calendar)  this.$refs.calendar.checkChange()
      },
      loadCalendar() {
        if (this.passedEvents.length == 0) {
          alert('no events found! ')
        }
        this.events.length = 0
        this.passedEvents.forEach(ele => {
          if (ele.start) {
             let elNo = this.category.findIndex(e => e == ele.name)
             if (elNo == -1) { console.log('we did not find the category ' + ele.name + ' in category', this.category); return;}
             let color = this.color[elNo]
             let d = ele.start.substring(0,10)
             if (! (d in this.tracked))  this.tracked[d] = []
             if (ele.name in this.tracked[d]) {
                this.tracked[d][elNo] += 1
             } else {
              this.tracked[d][elNo] = 1
             }

             const evt= {name: ele.name
                  , start: ele.start
                  , end: ele.start
                  , detail: ele.detail
                  , color: color
                  , type: 'attendance'
                  , timed: false
                    }
             this.events.push(evt)

          } else {
            console.error('One of our event does not have a startdate!',ele);
          }
        })
        //console.log('final value:', this.tracked)
        return "done"
      },
      showEvent ({ nativeEvent, event }) {
        const open = () => {
          this.selectedEvent = event
          this.selectedElement = nativeEvent.target
          setTimeout(() => {this.selectedOpen = true}, 10)
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
        this.calReady = true
        this.today = new Date()
        this.today.setHours(0,0,0,0)
        this.calToday = zDate.format(this.today,'yyyy-MM-dd')
      },


      async printIt() {
        console.log('printit')
      },




    },
  computed: {
    filterEvents() {
      switch (this.weekOrDay)  {
         case 'day': return this.events
         case 'week': return this.events
         case 'month': return [{name:'No Entry', start: '2023-01-01', end:'2023-01-01', color:'magenta', timed:false, type:'att'}]
      }
      //return [{name:'No Entry', start: '2023-01-01', end:'2023-01-01', color:'magenta', timed:false, type:'att'}]
      return []

    },
    cal () {
        return this.calReady ? this.$refs.calendar : null
    },
    nowY () {
        return this.cal ? this.cal.timeToY(this.cal.times.now) + 'px' : '-10px'
    },
  },
  mounted () {
    this.$cs.l('Mounting QuickCalendar')
    this.loadCalendar()
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
.test {
  background: #fd9c42;
  height: 100%;
  min-width: 12px;
  padding: 0 3px;
  border-radius: 12px;
  display: block;
}
</style>