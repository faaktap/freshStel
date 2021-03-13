import { format 
        ,lastDayOfMonth
        ,addYears 
        ,add
        ,formatDuration
        ,isWeekend
        ,isSameDay
        ,startOfMonth
        ,startOfYear
        ,compareAsc
        } from 'date-fns'
 import { maxTime } from 'date-fns/constants'
 import { minTime } from 'date-fns'


//11 Maart 2021 was Dag 10
export const zDate = {
    publicHolidays : [
      //Should use start and end dates for holidays...
    { title : "New Year's Day", date:new Date(2021,0,1)} ,
    { title : "Human Rights Day", date:new Date(2021,2,21)} ,
    { title : "Public Holiday", date:new Date(2021,2,22)} ,
    { title : "Good Friday", date:new Date(2021,3,2)} ,
    { title : "Family Day", date:new Date(2021,3,5)} ,
    { title : "Special School Holiday", date:new Date(2021,3,26)} ,
    { title : "Freedom Day", date:new Date(2021,3,27)} ,
    { title : "Worker's Day", date:new Date(2021,4,1)} ,
    { title : "Youth Day", date:new Date(2021,5,16)} ,
    { title : "Women's Day", date:new Date(2021,7,9)} ,
    { title : "Heritage Day",    date: new Date(2021,8,25)} ,
    { title : "Christmas",       date: new Date(2021,11,25) } ,
    { title : "Day of Goodwill", date: new Date(2021,11,26) } , 
    { title : "School Holiday", date:new Date(2021,3,24)} ,
    { title : "School Holiday", date:new Date(2021,3,25)} ,
    { title : "School Holiday", date:new Date(2021,3,26)} ,
    { title : "School Holiday", date:new Date(2021,3,27)} ,
    { title : "School Holiday", date:new Date(2021,3,28)} ,
    { title : "School Holiday", date:new Date(2021,3,29)} ,
    { title : "School Holiday", date:new Date(2021,3,30)} ,
    { title : "School Holiday", date:new Date(2021,4,1)} ,
    { title : "School Holiday", date:new Date(2021,4,2)} ,
    { title : "School Holiday", date:new Date(2021,6,10)} ,
    { title : "School Holiday", date:new Date(2021,6,11)} ,
    { title : "School Holiday", date:new Date(2021,6,12)} ,
    { title : "School Holiday", date:new Date(2021,6,13)} ,
    { title : "School Holiday", date:new Date(2021,6,14)} ,
    { title : "School Holiday", date:new Date(2021,6,15)} ,
    { title : "School Holiday", date:new Date(2021,6,16)} ,
    { title : "School Holiday", date:new Date(2021,6,17)} ,
    { title : "School Holiday", date:new Date(2021,6,18)} ,
    { title : "School Holiday", date:new Date(2021,6,19)} ,
    { title : "School Holiday", date:new Date(2021,6,20)} ,
    { title : "School Holiday", date:new Date(2021,6,21)} ,
    { title : "School Holiday", date:new Date(2021,6,22)} ,
    { title : "School Holiday", date:new Date(2021,6,23)} ,
    { title : "School Holiday", date:new Date(2021,6,24)} ,
    { title : "School Holiday", date:new Date(2021,6,25)} ,
    { title : "School Holiday", date:new Date(2021,9,2)} ,
    { title : "School Holiday", date:new Date(2021,9,3)} ,
    { title : "School Holiday", date:new Date(2021,9,4)} ,
    { title : "School Holiday", date:new Date(2021,9,5)} ,
    { title : "School Holiday", date:new Date(2021,9,6)} ,
    { title : "School Holiday", date:new Date(2021,9,7)} ,
    { title : "School Holiday", date:new Date(2021,9,8)} ,
    { title : "School Holiday", date:new Date(2021,9,9)} ,
    { title : "School Holiday", date:new Date(2021,9,10)} ,    
  ],     
  format: function (...args) {  
    return format(...args)
  },
  lastDayOfMonth: function (...args) {  
    return lastDayOfMonth(...args)
  },
  addYears: function (...args) {  
    return addYears(...args)
  },
  add: function (date, duration) {  
    return add(date, duration)
  },  
  isAllowedTime: function (time) {
    return time <= maxTime && time >= minTime
  },
  formatDuration: function(obj) {
    return formatDuration(obj)
  },
  isWeekend: function(obj) {
    return isWeekend(obj)
  },
  startOfYear: function(obj) {
    return startOfYear(obj)
  },
  startOfMonth: function(date) {
    console.log('zDate : start of month = ', date,startOfMonth(date))
    return startOfMonth(date)
  },
  isSameDay: function(...args) {
    return isSameDay(...args)
  },
  isPublicHoliday: function(chkdate) {
    let isSame = false
    zDate.publicHolidays.findIndex(p => {
      if (chkdate.getTime() == p.date.getTime()) {
        isSame = true
      }
    })
    return isSame
  },  
  curDay: function(date) {
    //11 Maart 2021 was Dag 10
    //1 maart was dag 2
    console.log('compareAsc(; ', date.setHours(0,0,0,0), new Date(2021,2,1).setHours(0,0,0,0) )
    if (compareAsc(date.setHours(0,0,0,0), new Date(2021,2,1).setHours(0,0,0,0) )  == 0 ) {
       return 6
    } else {
      alert('we only work in march')
      return 1
    }


  }
};