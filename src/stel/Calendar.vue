<template>
<v-card height="100%" width="100%">
    <v-card-title> Title  {{ ['a','b','x'][2] }}<v-btn @click="scrollToCurrentTime"> stoct </v-btn> </v-card-title>
    <v-card-text>
   <vue-cal heigth="100%"
      ref="vuecal"
      v-model="cal.selectedDate"
      class="vuecal--full-height-delete vuecal--blue-theme"
      :hide-weekends="cal.hideWeekend"
      :xx-disable-views="['years']"
      :time="cal.showTime"
      :today-v-btn="cal.todayBtn"
      :active-view="cal.activeView"
      :selected-date="cal.selectedDate"
      :time-from="6 * 60"
      :time-to="21.5 * 60"
      :special-hours="specialHours"
      :editable-events="{ title: true, drag: true, resize: true, delete: true, create: true }"
      :events="events"
      :drag-to-create-threshold="15"
      :on-event-create="onEventCreate"
      :show-all-day-events="['short', true, false][cal.showAllDayEvents]"
      :events-on-month-view="[false, 'short'][cal.shortEventsOnMonthView * 1]"
      :time-cell-height="cal.timeCellHeight"
      @ready="t($event,'ready')"
      @view-change="t($event,'viewchange')"
      @cell-click="t($event,'cell-click - returns a JS native Date object')"
      @cell-contextmenu="t($event,'cell-contextmenu - returns a JS native Date object and x, y: the cursor coordinates.')"
      @cell-keypress-enter="t($event,'cell-keypress-enter - returns a JS native Date object')"
      @cell-focus="cal.selectedDate = $event"
      @event-focus="t($event,'event-focus - returns the associated calendar event object.')"
      @event-mouse-enter="t($event,'@event-mouse-enter - returns the associated calendar event object.')"
      @event-mouse-leave="t($event,'@event-mouse-leave')"
      >
      <!-- @cell-dblclick="$refs.vuecal.createEvent( $event,  120, { title: 'New Event', class: 'blue-event' })"
           :on-event-click="onEventClick"  -->

      <!-- <template #weekday-heading="{ items }">
         {{ items }}
      </template> -->
      <!-- <template #time-cell="{ hours, minutes }">
        <div :class="{ 'vuecal__time-cell-line': true, hours: !minutes }">
          <strong v-if="!minutes" style="font-size: 15px">{{ hours }}</strong>
          <span v-else style="font-size: 11px">{{ minutes }}</span>
        </div>
      </template> -->


      <!-- <template #event="{ event, view }">
        <v-icon>{{ event.icon }}</v-icon>
        <div class="vuecal__event-title" v-html="event.title" />
        <div class="vuecal__event-title vuecal__event-title--edit"
             contenteditable
             @blur="event.title = $event.target.innerHTML"
             v-html="event.title" />

        <small class="vuecal__event-time">
          <strong>Event begin hierso:</strong> <span>{{ event.start.formatTime("h O'clock") }}</span><br/>
          <strong>Event eindig hier!!:</strong> <span>{{ event.end.formatTime("h O'clock") }}</span>
        </small>  v:{{ view }} {{ event }}
      </template> -->

      <!-- <template #cell-content="{ cell, view, events }">
        <span class="vuecal__cell-date">
          {{ cell.content }}
        </span>
        <span
          class="vuecal__cell-events-count"
          v-if="['years', 'year', 'month'].includes(view.id) && customEventsCount(events)">
          cc={{ customEventsCount(events) }}
        </span>
      </template> -->


      <!-- <template #events-count="{ events, view }">
       <span v-if="customEventsCount(events)">
         {{ customEventsCount(events) }} {{ view.id }}
       </span>
      </template> -->

      <!-- Optional slot for the custom v-btn. -->
      <!-- <template #today-v-btn>
        <v-tooltip>
         <template #activator="{ on }">
          <v-btn v-on="on">
           <v-icon>mdi-source-commit-local</v-icon>
          </v-btn>
          <span>Go to Today's date</span>
         </template>
        </v-tooltip>
      </template> -->
     </vue-cal>
     </v-card-text>
<v-card-actions>
    <v-text-field v-model="cal.selectedDate" label="SelDate" small  dense /> {{ cal.selectedDate }}
    <v-text-field v-model="cal.activeView" label="ActiveView" small  dense />
    <v-btn @click="cal.showTime = !cal.showTime"> time {{ cal.showTime }} </v-btn>
    <v-btn @click="cal.todayBtn = !cal.todayBtn"> today {{ cal.todayBtn }} </v-btn>
    <v-btn @click="cal.hideWeekend = !cal.hideWeekend"> weekends {{ cal.hideWeekend }} </v-btn>
    <v-btn @click="customEventCreation"> Create </v-btn>
<v-btn @click="cal.showAllDayEvents = (cal.showAllDayEvents + 1) % 3">
    all-day-events {{ ["'short'", 'true', 'false'][cal.showAllDayEvents] }}
</v-btn>
<v-btn @click="cal.shortEventsOnMonthView = !cal.shortEventsOnMonthView">
  events-on-month {{ ['true', "'short'"][cal.shortEventsOnMonthView * 1] }}
</v-btn>
</v-card-actions>
{{ events }}


<v-dialog v-model="showDialog">
  <v-card>
    <v-card-title>
      <v-icon>{{ selectedEvent.icon }}</v-icon>
      <v-text-field v-model="selectedEvent.title" label="title" />
      <v-spacer/>
      <strong>{{ selectedEvent.start && selectedEvent.start.format('DD/MM/YYYY') }}</strong>
    </v-card-title>
    <v-card-text>
      <p v-html="selectedEvent.contentFull"/>
      <strong>Event details:</strong>
      <ul>
        <li>Event starts at: {{ selectedEvent.start && selectedEvent.start.formatTime() }}</li>
        <li>Event ends at: {{ selectedEvent.end && selectedEvent.end.formatTime() }}</li>
      </ul>
    </v-card-text>
  </v-card>
</v-dialog>

<v-dialog v-model="showEventCreationDialog" :persistent="true" max-width="420">
  <v-card>
    <v-card-title>
      <v-input v-model="selectedEvent.title" placeholder="Event Title" />
    </v-card-title>
    <v-card-text>
      <v-textarea v-model="selectedEvent.content" placeholder="Event Content" />
      <v-flex>
        <v-select
          :items="eventsCssClasses"
          placeholder="Event CSS Class"
          @change="selectedEvent.class = $event"
          :value="selectedEvent.class" />
        <v-switch v-model="selectedEvent.background" label="background Event" />
      </v-flex>
      <v-flex>
        <v-btn @click="cancelEventCreation()">Cancel</v-btn>
        <v-btn @click="closeCreationDialog()">Save</v-btn>
      </v-flex>
    </v-card-text>
  </v-card>
</v-dialog>
<v-btn to="currenttime"> currenttime a line </v-btn>
</v-card>
</template>


<script>
import VueCal from 'vue-cal'
import 'vue-cal/dist/vuecal.css'
// const dailyHours = { from: 7 * 60, to: 14 * 60, class: 'school-hours' }
import { zmlF } from '@/stel/zmlF.js'
export default {
    name:"Calendar",
    components: {
        VueCal
    },
    props: [],
    data () {
      return {
        zmlF:zmlF,
        selectedEvent: {},
        showDialog: false,
        cal:{
            showTime:true
          , activeView: "week"
          , todayBtn : false
          , hideWeekend: false
          , timeCellHeight: 29
          , selectedDate:null
          , showAllDayEvents: 0
          , shortEventsOnMonthView: false
        },
        showEventCreationDialog: false,
        eventsCssClasses: ['leisure', 'sport', 'health'],
        events: [
             {
              start: '2023-02-20 12:00',              end: '2023-02-20 14:00',
              title: 'LUNCH',              class: 'lunch',              background: true,
              id:1
             },
            {
              start: '2023-02-21',              end: '2023-02-21',
              title: 'Need to go shopping',              content: '<v-icon>mdi-shopping</v-icon>',              class: 'leisure',
              id:2
            },
            {
              start: '2023-02-21',              end: '2023-02-21',              title: 'Golf with John',
              content: '<i class="icon material-icons">golf-tee</i>',              class: 'sport',
              id:3
            },
            {
              start: '2023-02-22',              end: '2023-02-22',              title: 'Dad\'s birthday!',
              content: '<i class="icon material-icons">mdi-cake</i>',              class: 'sport',
              editableEvents:{ title: true, drag: true, resize: true, delete: true, create: false },
              id:4, somethingElse:"sdfsdfsdfsdfsdfsdfsdfsdfsdf"
            },
            {
              start: '2023-02-22 10:30',              end: '2023-02-22 11:30',
              // You can also define event dates with Javascript Date objects:
              // start: new Date(2018, 11 - 1, 16, 10, 30),
              // end: new Date(2018, 11 - 1, 16, 11, 30),
              title: 'Doctor appointment',              content: '<i class="icon material-icons">local_hospital</i>',              class: 'health'
           },
           {
              start: '2023-02-24',              end: '2023-02-24',
              title: 'Valentine\'s day',              content: 'mdi-favorite_outline',              class: 'pink-event',
              allDay: true
           }
        ],
        specialHours: {
         1: {    from: 8 * 60,                 to: 17 * 60,                 class: 'doctor-1',                 label: 'Doctor 1111111<br>Full day shift'        },
         2: {    from: 9 * 60,    to: 18 * 60,    class: 'doctor-2',    label: 'Doctor 2Full day shift'  },
         3: [    {      from: 8 * 60,      to: 12 * 60,      class: 'doctor-1',      label: 'Doctor 1Morning shift'    },
                 {    from: 14 * 60,      to: 19 * 60,      class: 'doctor-3',      label: 'Doctor 3Afternoon shift'    }
            ],
         4: {    from: 8 * 60,    to: 17 * 60,    class: 'doctor-1',    label: 'Doctor 1Full day shift'  },
         5: {    from: 7.45 * 60,    to: 14 * 60,    class: 'schooltime',    label: 'SCHOOL TIME'  },
         6: {    from: 9 * 60,    to: 18 * 60,    class: 'doctor-2',    label: 'Doctor 2Full day shift'  },
         7: {    from: 7 * 60,    to: 20 * 60,    class: 'closed',    label: 'Closed'  }
        },
        a:{ id:0
          , desc: "ZML Constants"
          , workDone: 0
          , response: []
          , processor: (action,element) => {this.doSomething(action,element)}
          , sql:`SELECT * from zml_constant`
          , progess:false
        }
       }
   },
   created() {
     zmlF.ZF(this.a)
   },
   mounted() {
   },
   computed: {

   },
   methods: {
    customEventsCount: events => { return events ? events.filter(e => e.class === 'leisure').length : 0  },
    scrollToCurrentTime () {
      const calendar = document.querySelector('#vuecal .vuecal__bg')
      const hours = this.now.getHours() + this.now.getMinutes() / 60
      calendar.scrollTo({ top: hours * this.timeCellHeight, behavior: 'smooth' })
    },
    scrollToTop () {
      const calendar = document.querySelector('#vuecal .vuecal__bg')
      calendar.scrollTo({ top: 0, behavior: 'smooth' })
    },
    t(e1,e2) {
        console.log('evt:',e1,e2)
    },
    onEventCreate (event, deleteEventFunction) {
       this.selectedEvent = event
       this.showEventCreationDialog = true
       this.deleteEventFunction = deleteEventFunction
       return event
     },
     cancelEventCreation () {
       this.closeCreationDialog()
       this.deleteEventFunction()
     },
     closeCreationDialog () {
       this.showEventCreationDialog = false
       this.selectedEvent = {}
     },
     onEventClick (event, e) {
      this.selectedEvent = event
      this.showDialog = true
      e.stopPropagation()
     },

     customEventCreation () {
         const dateTime = prompt('Create event on (YYYY-MM-DD HH:mm)', '2023-02-24 13:15')

         // Check if date format is correct before creating event.
         if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/.test(dateTime)) {
           this.$refs.vuecal.createEvent(
             // Formatted start date and time or JavaScript Date object.
             dateTime,
             // Event duration in minutes (Integer).
             120,
             // Custom event props (optional).
             { title: 'New Event', content: 'yay! 🎉', class: 'blue-event' }
           )
         } else if (dateTime) alert('Wrong date format.')
     },
     bonga(e1,e2) {
        console.log('he Clicked:',e1,e2)
     },
     doSomething(action,dataObject) {
        if (action=='refresh') {
          dataObject.response = ''
          zmlF.ZF(dataObject)
        }
     },
   }
}
</script>

<style lang="scss">
.vuecal__special-hours {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 4px;
  em {font-size: 0.9em;
      color: #999;
     }
}

.doctor-1 {background-color: #f0fff1;color: #81d58b;}
.doctor-2 {background-color: #f0f6ff;color: #689bee;}
.doctor-3 {background-color: #fcf0ff;color: #d168ee;}
.schooltime {background-color: #fcf0ff;color: #d1a8bc;}
.closed {
  background:
    #fff7f0
    repeating-linear-gradient(
      -45deg,
      rgba(255, 162, 87, 0.25),
      rgba(255, 162, 87, 0.25) 5px,
      rgba(255, 255, 255, 0) 5px,
      rgba(255, 255, 255, 0) 15px
    );
  color: #f6984c;
}
.vuecal__event.leisure {background-color: rgba(253, 156, 66, 0.9);border: 1px solid rgb(233, 136, 46);color: #fff;}
.vuecal__event.sport {background-color: rgba(255, 102, 102, 0.9);border: 1px solid rgb(235, 82, 82);color: #fff;}
.vuecal__event.health {background-color: rgba(81, 199, 111, 0.9);border: 1px solid rgb(180, 189, 131);color: #fff;}



.vuecal__event {cursor: pointer;}

.vuecal__event-title {
  font-size: 1.2em;
  font-weight: bold;
  margin: 4px 0 8px;
}

.vuecal__event-time {
  display: inline-block;
  margin-bottom: 12px;
  padding-bottom: 12px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.2);
}

.vuecal__event-content {
  font-style: italic;
}

.vuecal--month-view .vuecal__cell {height: 80px;}

.vuecal--month-view .vuecal__cell-content {
  justify-content: flex-start;
  height: 100%;
  align-items: flex-end;
}

.vuecal--month-view .vuecal__cell-date {padding: 4px;}
.vuecal--month-view .vuecal__no-event {display: none;}

.vuecal__event {background-color: rgba(76, 172, 175, 0.35);}
.vuecal__event--dragging {background-color: rgba(60, 60, 60, 0.3);}


.vuecal__event.lunch {
  background: repeating-linear-gradient(45deg, transparent, transparent 10px, #f2f2f2 10px, #f2f2f2 20px);
  background-color: #ebd6eb;color: #735d96;
  color: #999;
  display: flex;
  justify-content: center;
  align-items: center;
}
.vuecal__event.lunch .vuecal__event-time {display: none;align-items: center;}

.vuecal--week-view .vuecal__bg .vuecal__event--all-day.pink-event,
.vuecal--day-view .vuecal__bg .vuecal__event--all-day.pink-event {right: 50%;}
.vuecal--week-view .vuecal__bg .vuecal__event--all-day.leisure,
.vuecal--day-view .vuecal__bg .vuecal__event--all-day.leisure {left: 50%;}

.vuecal__time-cell-line.hours:before {border-color: #42b983;}


.vuecal__cell-events-count {background: rgb(71, 85, 71);}
.vuecal__cell-events-count span {
  background: #fd9c42;
  height: 100%;
  min-width: 12px;
  padding: 0 3px;
  border-radius: 12px;
  display: block;
}

</style>