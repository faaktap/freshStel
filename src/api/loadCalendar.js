import Vue from 'vue'
import { zmlConfig } from '@/api/constants';
import { getters } from "@/api/store";
import { zFetch } from '@/api/zmlFetch';
import { zDate } from '@/api/zDate.js'

function l(...args) {
    Vue.prototype.$cs.l(...args)
}

export const zLoadCal = {
    someGlobals :  'loadCal',
    loading : false,
    dayNum: null,
    startDate: null,
    calendarData: (whatever) => {
        l('inside LoadCal.js',getters.getState({ object: "gZml" }).calendar.length , zLoadCal.startDate)
        if (whatever !== undefined) l(whatever)
        if (getters.getState({ object: "gZml" }).calendar.length || zLoadCal.startDate !== null) return "klaar gedoen"
        l('loading cal: (will cleanout)')

        zLoadCal.startDate = zDate.getMondayPast()
        zLoadCal.getDayNum(zLoadCal.startDate)
        getters.getState({ object: "gZml" }).calendar = []

        // ------- laai die dae nommers (dayNum)
        zLoadCal.doStuff()

        // ---- kry die personeel verjaardae vanaf ID
        zLoadCal.getPersonelBirthdays()

        // ------- kry die public holidays
        zLoadCal.getHolidays()

        return "something"
    },
    doStuff() {
        l('check if daynum is cool')
        if( zLoadCal.dayNum === null) {
            setTimeout(zLoadCal.doStuff, 50) //wait 50 millisecnds then recheck
            l('check AGAIN if daynum is cool')
            return
        }
        l('daynum is now cool!!!!!', zLoadCal.dayNum)
        setTimeout(zLoadCal.loadSchoolsDays(), 10) //wait 50 millisecnds then do schooldays

    },
    getDayNum(forDate) {
        let year = forDate.getFullYear();
        let month = forDate.getMonth() + 1; //JS month start at 0
        let day = forDate.getDate();
        l('getDayNum-------------', year, month, day,forDate)
        zFetch({task: 'Plainsql',
          sql: `SELECT dayno, fulldate FROM dkhs_date WHERE fulldate = '${year}-${month}-${day}'`,
          api:zmlConfig.apiDKHS}
        ).then((r) => {
                      l('getDayNum-------------',r)
                      if (r.status >= 200 && r.status <= 299) {
                        return r.json();
                      } else {
                        throw Error(r.statusText);
                      }
        })
        .then(data => {
          console.log('getDayNum-------------Assign to daynum', data)
          zLoadCal.dayNum = data[0].dayno
        })

      },
      getPersonelBirthdays() {
        let year = new Date().getFullYear();
        zFetch({task: 'PlainSql',
                  sql: `select  menemonic, persid,public_preferredname\
                      , concat('${year}-', substr(IDNumber,3,2), '-', substr(IDNumber,5,2)) StartDate\
                        from dkhs_personel where IDNumber > 0 and public_preferredname is not null  and room != 'WEG'\
                        order by StartDate asc`,
                  api: zmlConfig.apiDKHS
        })
        .then((r) => {
            if (r.status >= 200 && r.status <= 299) {return r.json() } else {throw Error(r.statusText)}
        })
        .then((response) => {
            if (!response) { throw Error('no birthdays!') }
            response.forEach(ele => {
              const evt= {name: ele.public_preferredname
               , start: ele.StartDate
               , end: ele.StartDate
               , color: 'indigo'
               , type: 'Birthday'
               , timed: false
               , detail: ele.menemonic
              }
              getters.getState({ object: "gZml" }).calendar.push(evt)
            })
            l('Birthdays are in', getters.getState({ object: "gZml" }).calendar.length)
        })
        .catch((error) => {
            alert('err!');
            l('Z:FETCH-5-----ERROR------',error)
            errorLoading(error)
        })
    },
    getBaseCalendar(whatever) {
      l('Start',whatever || 'getBaseCalendar')
      zFetch({task: 'PlainSql',
               sql: `SELECT * FROM dkhs_date \
                 where substr(fulldate,1,4) = year(now())\
                   or substr(fulldate,1,4) = year(now() + interval 1 year)  \
                   or substr(fulldate,1,4) = year(now() - interval 1 year)  \
                 ORDER BY idDate  ASC`,
                 api: zmlConfig.apiDKHS
      })
        .then((r) => {
          if (r.status >= 200 && r.status <= 299) {return r.json() } else {throw Error(r.statusText)}
      })
      .then((response) => {
          if (!response) { throw Error('No Base Loaded') }
          getters.getState({ object: "gZml" }).baseCalendar = response
      })
      l('End',whatever || 'getBaseCalendar', getters.getState({ object: "gZml" }).baseCalendar.length)

    },
    getHolidays() {
        zFetch({task: 'PlainSql',
                 sql: `select * from dkhs_holiday`,
                 api: zmlConfig.apiDKHS
        })
        .then((r) => {
            if (r.status >= 200 && r.status <= 299) {return r.json() } else {throw Error(r.statusText)}
        })
        .then((response) => {
            if (!response) { throw Error('no holidays!') }
            response.forEach(element => {
                const evt= {name: element.holidayname
                    , start: element.fulldate  //klaar in yyy-mm-dd formaat
                    , type: 'Holiday'
                    , color: 'green'
                }
                getters.getState({ object: "gZml" }).calendar.push(evt)
            })
            l('Holidays are in', getters.getState({ object: "gZml" }).calendar.length)
        })
    },
    loadSchoolsDays() {
        // We always start calendar on a monday, and monday is always schoolDayNum = 1
        l('Loading Schooldays events Cal:' +  zLoadCal.dayNum)

        let dayCnt = zLoadCal.dayNum
        l('Startinbg SchoolsDays:',dayCnt, zLoadCal.startDate)

        for (let i=0; i< 353; i++) {
           const dayX = zDate.add( zLoadCal.startDate, {days:i} )
           if (zDate.isWeekend(dayX))       {       continue   }
           // We loose a daynum if we have a holiday on a school day
           if (!zDate.isPublicHoliday(dayX)) {
             const evt= {name: 'day' + dayCnt
                    , start: zDate.format(dayX,'yyyy-MM-dd') //dayX
                    , end: zDate.format(dayX,'yyyy-MM-dd')
                    , color: 'light-blue'
                    , type: 'School'
                    , timed: false
                    , xxx: dayX.getDay()
                      }
             getters.getState({ object: "gZml" }).calendar.push(evt)
           }
           if (dayCnt == 10) {
             dayCnt = 1
           } else {
             dayCnt = parseInt(dayCnt) + 1
           }
        }
        l('Schooldays are in', getters.getState({ object: "gZml" }).calendar.length)
        l('--------------------------------------------------------------------------')
        l('after schooldays EVENTS::', getters.getState({ object: "gZml" }).calendar)
        l('--------------------------------------------------------------------------')
     }
}


//----------------------------------------------------------------
function errorLoading (response) {
    alert('We had an error loading your data!')
    l('We had an ERROR loading your data!',response)
}

