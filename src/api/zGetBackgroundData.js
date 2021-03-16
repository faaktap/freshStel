import { zmlConfig } from '@/api/constants';
import { getters } from "@/api/store";
import { zmlFetch } from '@/api/zmlFetch';
import { zDate } from '@/api/zDate.js'

//import { zData } from "@/api/zGetBackgroundData.js"

export const zData = {
    someGlobals :  'hallo',
    initialData: function (whatever) {  
      if (whatever !== undefined) console.log(whatever)

      if (!getters.getState({ object: "gZml" }).subjects.length 
          || !getters.getState({ object: "gZml" }).folders.length
          || !getters.getState({ object: "gZml" }).functions.length) {
          let ts = {api: zmlConfig.apiDKHS ,task: 'loadlearn'}
          zmlFetch(ts, finishedLoadingBasic, errorLoading);
      }
      return "something"
    },
    calendarData: function (whatever) {  
        if (whatever !== undefined) console.log(whatever)
        if (!getters.getState({ object: "gZml" }).calendar.length) {
            let ts = {}
            ts.task = 'PlainSql'
            ts.sql = "select  menemonic, persid,public_preferredname "
                   + ", concat('2021-', substr(IDNumber,3,2), '-', substr(IDNumber,5,2)) StartDate "
                   + " from dkhs_personel where IDNumber > 0 and public_preferredname is not null"
            ts.api = zmlConfig.apiDKHS
            zmlFetch(ts, finishedLoadingCalendar, errorLoading);
        }
        return "something"
      },
  
}
function finishedLoadingCalendar(response) {
    console.log('Start Load Calendar Birthdays')
    response.forEach(ele => {
        const evt= {name: ele.public_preferredname
                 , start: ele.StartDate
                 , end: ele.StartDate
                 , color: 'indigo'
                 , type: 'Birthday'
                 , timed: false
                   }
        getters.getState({ object: "gZml" }).calendar.push(evt)
       })    
    console.log('Loaded Birthdays:', getters.getState({ object: "gZml" }).calendar.length)
    loadSchoolsDays()
}

//----------------------------------------------------------------
function finishedLoadingBasic (response) {
    //getZml = getters.getState({ object: "gZml" })
    console.log(getters.getState({ object: "gZml" }).subjects.length 
               ,getters.getState({ object: "gZml" }).folders.length
               ,getters.getState({ object: "gZml" }).functions.length)
    getters.getState({ object: "gZml" }).subjects = response.subjects;
    getters.getState({ object: "gZml" }).folders = response.folders;
    getters.getState({ object: "gZml" }).functions = response.functions;    
}

//----------------------------------------------------------------
function loadSchoolsDays() {
   console.log('Start Load Calendar')
   zDate.publicHolidays.forEach(xx => {
        const evt= {name: xx.title
                 , start: zDate.format(xx.date,'yyyy-MM-dd')
                 , type: 'Holiday'
                 , color: 'green'
                   }
        getters.getState({ object: "gZml" }).calendar.push(evt)
   })
   console.log('Loaded Holidays:', getters.getState({ object: "gZml" }).calendar.length)
   let startDate = new Date(2021,2,1)
   console.log('Create Start Date:',startDate)
   startDate.setHours(0,0,0,0)
   const startOfMonth = zDate.startOfMonth(startDate)
   let dayCnt = zDate.curDay(startOfMonth)
   let Group = 'A'
   //Kan jy my sê watter skooldag is vandag? (11/03/2021) - Dag 10 sir.      
   
   for (let i=0; i< 232; i++) {
      const dayX = zDate.add( startOfMonth, {days:i} )
      if (zDate.isWeekend(dayX))       {       continue   } 
      if (zDate.isPublicHoliday(dayX)) {       continue   } 
      const evt= {name: 'day' + dayCnt + ' ' + Group
               , start: dayX  
               , end: dayX   
               , color: 'light-blue'
               , type: 'School'
               , timed: false
                 }
      getters.getState({ object: "gZml" }).calendar.push(evt)
      if (dayCnt == 10 && Group == 'B')  {Group = 'A'; dayCnt = 1; continue;}
      if (Group == 'A') { Group = 'B'; continue;}
      if (Group == 'B') { Group = 'A'; dayCnt += 1; continue;}
   }
   console.log('Loaded SchoolDays:', getters.getState({ object: "gZml" }).calendar.length)
}


function errorLoading (response) {
    alert('We had an error loading your data!' + response)
    console.log('We had an error loading your data!',response)
}