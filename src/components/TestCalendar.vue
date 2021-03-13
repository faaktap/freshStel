<template>
  <v-row>
    <v-col>
    <v-sheet
      tile
      height="54"
      class="d-flex"
    >      
    <v-toolbar
       flat
       :loading="loading"
    >
        <v-btn
        icon
        class="ma-2"
        @click="addEvent"
        >
        add
        </v-btn>

        <v-btn
        icon
        class="ma-2"
        @click="$refs.calendar.prev()"
        >
        <v-icon>mdi-chevron-left</v-icon>
        </v-btn>

        <v-btn
            outlined
            class="mr-4"
            color="grey darken-2"
            @click="setToday"
          >
            Today
          </v-btn>

          <v-toolbar-title v-if="$refs.calendar">
            {{ $refs.calendar.title }}
          </v-toolbar-title>

        <v-spacer />
        <v-btn icon
               class="ma-2"
              @click="$refs.calendar.next()"
        >
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
          type="week"
          intervalMinutes="60"
          first-interval="7" 
          interval-height="35"
          
          @change="updateRange"
          @click:event="showEvent"
        > <!-- :interval-format="intervalFormat"  interval-count="10" first-interval="7"-->
         <template v-slot:day-body="{ date, week }">
            <div
               class="v-current-time"
              :class="{ first: date === week[0].date }"
              :style="{ top: nowY }"
            ></div>
         </template>

        </v-calendar>


<!---  SELECTED EVENT --->
<v-menu
          v-model="selectedOpen"
          :close-on-content-click="false"
          :activator="selectedElement"
          offset-x
        >
          <v-card
            color="grey lighten-4"
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
              <v-spacer></v-spacer>
              <v-btn icon>
                <v-icon>mdi-heart</v-icon>
              </v-btn>
              <v-btn icon>
                <v-icon>mdi-dots-vertical</v-icon>
              </v-btn>
            </v-toolbar>
            <v-card-text>
              <span v-if="selectedEvent" v-html="selectedEvent.details"></span>
              <v-text-field v-model="personeelMenemonic" label="Educator Menemonic" />
            </v-card-text>
            <v-card-actions>
              <v-btn
                text
                color="secondary"
                @click="loadData"
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
      <!--v-model(calValue) = {{ calValue }} <br>
      calToday = {{ calToday }} <br>{{ events }}

      -->
      
    </v-col>
    
  </v-row>
</template>

<script>
//import { format         ,lastDayOfMonth        , addYears } from 'date-fns'
import { zDate } from '@/api/zDate.js'
import { zmlConfig } from '@/api/constants.js';
import { zmlFetch } from '@/api/zmlFetch.js';
export default {
    data: () => ({
      loading:false,
      today: null,
      calToday: null,
      calValue: '',
      calReady: false,
      events:[{ start: "1900-01-01", name: "" }],
      selectedEvent: null,
      selectedElement: null,
      selectedOpen: null,
      personeelMenemonic: ''
    }),
    methods:{
      updateRange(whatweget) {
         console.log('WHAT WE GET ?????', whatweget)
         
      },
      addEvent() {
        let s = new Date();
        let e = new Date();
        s.setHours(s.getHours() - 1);
        this.events.push({
            name: "quickOne",
            end: e,            
            start: s,
            color: 'green',
            timed: true,
          })
      },
      loadData(){


        console.log('ShowLoadData:',this.selectedEvent.name, this.selectedElement, this.selectedOpen, this.personeelMenemonic)
        this.selectedOpen = false
        alert('fetch for:' +  this.selectedEvent.name + ' ' + this.personeelMenemonic 
        + ' for date:' + this.selectedEvent.start)
        let ts = {}
        ts.task = 'PlainSql'
        ts.sql = 'select * from rooster where user_name = "' + this.personeelMenemonic + '"';
        ts.api = zmlConfig.apiDKHS
        this.loading = true;
        zmlFetch(ts, this.afterUpdate);   
      },
      afterUpdate(response) {
        console.log(response)
        let template = this.selectedEvent.start //new Date();
        template.setHours(0,0,0,0)
        response.forEach(ele => {
          let n = ''
          switch (this.selectedEvent.name.substr(0,4)) {
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
          //console.log(this.selectedEvent.name ,parseInt(ele.periodno) +  7, n,s ,e )
          if (n) {
            this.events.push(
              {name: n.substr(0,3) + ' ' + ele.periodno + ' ' + n.substr(4,4)
                  , start: template.setHours(parseInt(ele.periodno) +  7,0,0,0)
                  , end: template.setHours(parseInt(ele.periodno) +  8,0,0,0)
                  , color: 'brown'
                  , timed: true
                  , details: n
              })
          }

        })
        //Brilliant funcking timeout stukkie!!
        setTimeout(() => {
           this.loading = false;
           this.$refs.calendar.checkChange()
        }, 100)

      },
      showEvent ({ nativeEvent, event }) {
        console.log('start show event')
        const open = () => {
          this.selectedEvent = event
          this.selectedElement = nativeEvent.target
          console.log('ShowEventbef:',this.selectedEvent, this.selectedElement, this.selectedOpen)
          setTimeout(() => {
            this.selectedOpen = true
          }, 10)
        }
        console.log('ShowEvent:',this.selectedEvent, this.selectedElement, this.selectedOpen)
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
      intervalFormat(i) {
            return 'PER ' + (i.hour - 7)  //{ timeZone: 'UTC', hour12: true, hour: 'numeric' }
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
    },
    computed: {
      cal () {
        return this.calReady ? this.$refs.calendar : null
      },
      nowY () {
        return this.cal ? this.cal.timeToY(this.cal.times.now) + 'px' : '-10px'
      },
    },    
    mounted () {
      console.log('MOUNTMOUNTMOUNTMOUNTMOUNTMOUNTMOUNT')
      this.events = []
      this.today = new Date()
      console.log('This.today',this.today)
      this.today.setHours(0,0,0,0)
      console.log('This.today',this.today)

      zDate.publicHolidays.forEach(xx => {
         const evt= {name: xx.title
                  , start: zDate.format(xx.date,'yyyy-MM-dd')
                    }
         this.events.push(evt)
      })


      this.calToday = zDate.format(this.today,'yyyy-MM-dd') 
      console.log('This.Caltoday',this.calToday)

      let startOfMonth = zDate.startOfMonth(this.today)
      console.log('startOfMonth',startOfMonth)

      let dayCnt = zDate.curDay(startOfMonth)
      let Group = 'A'
      console.log('dayCnt',dayCnt)
      //Kan jy my sê watter skooldag is vandag? (11/03/2021) - Dag 10 sir.      
      for (let i=0; i< 32; i++) {
         const dayX = zDate.add( startOfMonth, {days:i} )
         console.log('dayX',dayX)
         if (zDate.isWeekend(dayX)) {
             continue
         } 
         if (zDate.isPublicHoliday(dayX)) {
             continue
         } 
         const evt= {name: 'day' + dayCnt + ' ' + Group
                  , start: dayX //zDate.format(dayX,'yyyy-MM-dd')
                  , end: dayX //zDate.format(dayX,'yyyy-MM-dd')
                  , color: 'light-blue'
                  , timed: false
                    }
         this.events.push(evt)
         console.log(evt)
         if (dayCnt == 10 && Group == 'B')  {Group = 'A'; dayCnt = 1; continue;}
         if (Group == 'A') { Group = 'B'; continue;}
         if (Group == 'B') { Group = 'A'; dayCnt += 1; continue;}
      }


       let s = new Date()
       let e = new Date()
       e.setHours(e.getHours() ) + 2
       let evt= {name: "hallo"
                  , start: s
                  , end: e
                  , color: 'green'
                    }
         this.events.push(evt)        

       
         
      console.log('events was loaded')
      if (this.$refs.calendar !== undefined) {
         console.log('Defined: ' , this.$refs.calendar)
         this.$refs.calendar.checkChange()
         this.calReady = true
         this.scrollToTime()
         this.updateTime()
      } else {
        console.log('UN UNUNDefined: ' , this.$refs.calendar)
      }

    },
  }
</script>