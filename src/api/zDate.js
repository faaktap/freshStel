/* Quick date functions - no need to include this.
    let d = new Date();
    let year = d.getFullYear() + 1;
    let month = d.getMonth();
    let day = d.getDate();
    let c = new Date(year + 1, month, day);
    console.log(c);
*/

import Vue from 'vue'
function l(...args) { Vue.prototype.$cs.l(...args) }


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
        ,isFuture
        } from 'date-fns'
 import { maxTime } from 'date-fns/constants'
 import { minTime } from 'date-fns'

const adminPeriodDuration = 22
const adminStartTime = '07:45'
const period1Duration = 52


export const zDate = {
    publicHolidays : [
      //Should use start and end dates for holidays...
    { title : "New Year's Day", date:new Date(2022,0,1)} ,
    { title : "Human Rights Day", date:new Date(2022,2,21)} ,
    { title : "Good Friday", date:new Date(2022,3,15)} ,
    { title : "Family Day", date:new Date(2022,3,18)} ,
    { title : "Freedom Day", date:new Date(2022,3,27)} ,
    { title : "Worker's Day", date:new Date(2022,4,1)} ,
    { title : "Day Off Workers", date:new Date(2022,4,2)} ,
    { title : "Youth Day", date:new Date(2022,4,16)} ,
    { title : "Women's Day", date:new Date(2022,7,9)} ,
    { title : "Heritage Day",    date: new Date(2022,8,24)} ,
    { title : "Christmas",       date: new Date(2022,11,25) } ,
    { title : "Day of Goodwill", date: new Date(2022,11,26) } ,
    { title : "School Holiday", date:new Date(2022,5,17)} ,
    { title : "School Holiday", date:new Date(2022,7,8)} ,
    { title : "School Holiday", date:new Date(2022,9,28)} ,
    { title : "School Holiday", date:new Date(2022,9,29)} ,
  ],
  dayType: [
   {id:10, dayNo:'1', type:'Admin'   , start: adminStartTime, duration:adminPeriodDuration}
  ,{id:11 ,dayNo:'1', type:'Per1'    , start:'08:07', duration:period1Duration}
  ,{id:12 ,dayNo:'1', type:'Per2'    , start:'08:55', duration:0}
  ,{id:13 ,dayNo:'1', type:'Per3'    , start:'09:43', duration:0}
  ,{id:14 ,dayNo:'1', type:'Pouse 1' , start:'10:31', duration:0}
  ,{id:15 ,dayNo:'1', type:'Per4'    , start:'10:56', duration:0}
  ,{id:16 ,dayNo:'1', type:'Per5'    , start:'11:45', duration:0}
  ,{id:17 ,dayNo:'1', type:'Pouse 2' , start:'12:33', duration:0}
  ,{id:18 ,dayNo:'1', type:'Per6'    , start:'12:53', duration:0}
  ,{id:19 ,dayNo:'1', type:'Per7'    , start:'13:42', duration:0}
  ,{id:20, dayNo:'2', type:'Admin'   , start: adminStartTime, duration: adminPeriodDuration}
  ,{id:21 ,dayNo:'2', type:'Per1'    , start:'08:07', duration: period1Duration}
  ,{id:22 ,dayNo:'2', type:'Per2'    , start:'08:55', duration:0}
  ,{id:23 ,dayNo:'2', type:'Per3'    , start:'09:43', duration:0}
  ,{id:24 ,dayNo:'2', type:'Pouse 1' , start:'10:31', duration:0}
  ,{id:25 ,dayNo:'2', type:'Per4'    , start:'10:56', duration:0}
  ,{id:26 ,dayNo:'2', type:'Per5'    , start:'11:45', duration:0}
  ,{id:27 ,dayNo:'2', type:'Pouse 2' , start:'12:33', duration:0}
  ,{id:28 ,dayNo:'2', type:'Per6'    , start:'12:53', duration:0}
  ,{id:29 ,dayNo:'2', type:'Per7'    , start:'13:42', duration:0}
  ,{id:30, dayNo:'3', type:'Admin'   , start: adminStartTime, duration: adminPeriodDuration}
  ,{id:31 ,dayNo:'3', type:'Per1'    , start:'08:00', duration: period1Duration}
  ,{id:32 ,dayNo:'3', type:'Per2'    , start:'08:45', duration:0}
  ,{id:33 ,dayNo:'3', type:'Per3'    , start:'09:30', duration:0}
  ,{id:34 ,dayNo:'3', type:'Pouse 1' , start:'10:15', duration:0}
  ,{id:35 ,dayNo:'3', type:'Per4'    , start:'10:40', duration:0}
  ,{id:36 ,dayNo:'3', type:'Per5'    , start:'11:25', duration:0}
  ,{id:37 ,dayNo:'3', type:'Pouse 2' , start:'12:10', duration:0}
  ,{id:38 ,dayNo:'3', type:'Per6'    , start:'12:30', duration:0}
  ,{id:39 ,dayNo:'3', type:'Per7'    , start:'13:15', duration:0}
  ,{id:40, dayNo:'4', type:'Admin'   , start: adminStartTime, duration: adminPeriodDuration}
  ,{id:41 ,dayNo:'4', type:'Per1'    , start:'08:07', duration: period1Duration}
  ,{id:42 ,dayNo:'4', type:'Per2'    , start:'08:55', duration:0}
  ,{id:43 ,dayNo:'4', type:'Per3'    , start:'09:43', duration:0}
  ,{id:44 ,dayNo:'4', type:'Pouse 1' , start:'10:31', duration:0}
  ,{id:45 ,dayNo:'4', type:'Per4'    , start:'10:56', duration:0}
  ,{id:46 ,dayNo:'4', type:'Per5'    , start:'11:45', duration:0}
  ,{id:47 ,dayNo:'4', type:'Pouse 2' , start:'12:33', duration:0}
  ,{id:48 ,dayNo:'4', type:'Per6'    , start:'12:53', duration:0}
  ,{id:49 ,dayNo:'4', type:'Per7'    , start:'13:42', duration:0}
  ,{id:50, dayNo:'5', type:'Admin'   , start: adminStartTime, duration: adminPeriodDuration}
  ,{id:51 ,dayNo:'5', type:'Per1'    , start:'08:30', duration: period1Duration}
  ,{id:52 ,dayNo:'5', type:'Per2'    , start:'09:11', duration:0}
  ,{id:53 ,dayNo:'5', type:'Per3'    , start:'09:52', duration:0}
  ,{id:54 ,dayNo:'5', type:'Pouse 1' , start:'10:33', duration:0}
  ,{id:55 ,dayNo:'5', type:'Per4'    , start:'10:58', duration:0}
  ,{id:56 ,dayNo:'5', type:'Per5'    , start:'11:39', duration:0}
  ,{id:57 ,dayNo:'5', type:'Pouse 2' , start:'12:20', duration:0}
  ,{id:58 ,dayNo:'5', type:'Per6'    , start:'12:38', duration:0}
  ,{id:59 ,dayNo:'5', type:'Per7'    , start:'13:19', duration:0}
  ,{id:60, dayNo:'6', type:'Admin'   , start: adminStartTime, duration: adminPeriodDuration}
  ,{id:61 ,dayNo:'6', type:'Per1'    , start:'08:30', duration: period1Duration}
  ,{id:62 ,dayNo:'6', type:'Per2'    , start:'09:11', duration:0}
  ,{id:63 ,dayNo:'6', type:'Per3'    , start:'09:52', duration:0}
  ,{id:64 ,dayNo:'6', type:'Pouse 1' , start:'10:33', duration:0}
  ,{id:65 ,dayNo:'6', type:'Per4'    , start:'10:58', duration:0}
  ,{id:66 ,dayNo:'6', type:'Per5'    , start:'11:39', duration:0}
  ,{id:67 ,dayNo:'6', type:'Pouse 2' , start:'12:20', duration:0}
  ,{id:68 ,dayNo:'6', type:'Per6'    , start:'12:38', duration:0}
  ,{id:69 ,dayNo:'6', type:'Per7'    , start:'13:19', duration:0}
  ,{id:70, dayNo:'7', type:'Admin'   , start: adminStartTime, duration: adminPeriodDuration}
  ,{id:71 ,dayNo:'7', type:'Per1'    , start:'08:30', duration: period1Duration}
  ,{id:72 ,dayNo:'7', type:'Per2'    , start:'09:11', duration:0}
  ,{id:73 ,dayNo:'7', type:'Per3'    , start:'09:52', duration:0}
  ,{id:74 ,dayNo:'7', type:'Pouse 1' , start:'10:33', duration:0}
  ,{id:75 ,dayNo:'7', type:'Per4'    , start:'10:58', duration:0}
  ,{id:76 ,dayNo:'7', type:'Per5'    , start:'11:39', duration:0}
  ,{id:77 ,dayNo:'7', type:'Pouse 2' , start:'12:20', duration:0}
  ,{id:78 ,dayNo:'7', type:'Per6'    , start:'12:38', duration:0}
  ,{id:79 ,dayNo:'7', type:'Per7'    , start:'13:19', duration:0}
  ,{id:80, dayNo:'8', type:'Admin'   , start: adminStartTime, duration: adminPeriodDuration}
  ,{id:81 ,dayNo:'8', type:'Per1'    , start:'08:30', duration: period1Duration}
  ,{id:82 ,dayNo:'8', type:'Per2'    , start:'09:11', duration:0}
  ,{id:83 ,dayNo:'8', type:'Per3'    , start:'09:52', duration:0}
  ,{id:84 ,dayNo:'8', type:'Pouse 1' , start:'10:33', duration:0}
  ,{id:85 ,dayNo:'8', type:'Per4'    , start:'10:58', duration:0}
  ,{id:86 ,dayNo:'8', type:'Per5'    , start:'11:39', duration:0}
  ,{id:87 ,dayNo:'8', type:'Pouse 2' , start:'12:20', duration:0}
  ,{id:88 ,dayNo:'8', type:'Per6'    , start:'12:38', duration:0}
  ,{id:89 ,dayNo:'8', type:'Per7'    , start:'13:19', duration:0}
  ,{id:80, dayNo:'8', type:'Admin'   , start: adminStartTime, duration: adminPeriodDuration}
  ,{id:91 ,dayNo:'9', type:'Per1'    , start:'08:30', duration: period1Duration}
  ,{id:92 ,dayNo:'9', type:'Per2'    , start:'09:11', duration:0}
  ,{id:93 ,dayNo:'9', type:'Per3'    , start:'09:52', duration:0}
  ,{id:94 ,dayNo:'9', type:'Pouse 1' , start:'10:33', duration:0}
  ,{id:95 ,dayNo:'9', type:'Per4'    , start:'10:58', duration:0}
  ,{id:96 ,dayNo:'9', type:'Per5'    , start:'11:39', duration:0}
  ,{id:97 ,dayNo:'9', type:'Pouse 2' , start:'12:20', duration:0}
  ,{id:98 ,dayNo:'9', type:'Per6'    , start:'12:38', duration:0}
  ,{id:99 ,dayNo:'9', type:'Per7'    , start:'13:19', duration:0}
  ,{id:100, dayNo:'10', type:'Admin'   , start: adminStartTime, duration: adminPeriodDuration}
  ,{id:101 ,dayNo:'10', type:'Per1'    , start:'08:07', duration: period1Duration}
  ,{id:102 ,dayNo:'10', type:'Per2'    , start:'08:55', duration:0}
  ,{id:103 ,dayNo:'10', type:'Per3'    , start:'09:43', duration:0}
  ,{id:104 ,dayNo:'10', type:'Pouse 1' , start:'10:31', duration:0}
  ,{id:105 ,dayNo:'10', type:'Per4'    , start:'10:56', duration:0}
  ,{id:106 ,dayNo:'10', type:'Per5'    , start:'11:45', duration:0}
  ,{id:107 ,dayNo:'10', type:'Pouse 2' , start:'12:33', duration:0}
  ,{id:108 ,dayNo:'10', type:'Per6'    , start:'12:53', duration:0}
  ,{id:109 ,dayNo:'10', type:'Per7'    , start:'13:42', duration:0}
  ],

  setDateMDY: function(dteSTR) {
    let [m,d,y] = dteSTR.split('-')
    return new Date(`${m} ${d}, ${y} 00:00:00`)
    // usage : let  date1 = setDateMDY('Jul-30-2021')
    // console.log( date1.toLocaleString() )
  },
  setDateYMD: function(dteSTR) {
    console.log('setDataFunction',dteSTR)
    console.log(dteSTR.substr(0,10))
    let [y,m,d] = dteSTR.substr(0,10).split('-')
    return new Date(`${y}-${m}-${d} 00:00:00`)
    // usage : let  date1 = setDateYMD('Jul-30-2021')
  },
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
    console.log('startOfMonth',date)
    return startOfMonth(date)
  },
  isSameDay: function(...args) {
    return isSameDay(...args)
  },
  isFuture: function(...args) {
    //console.log(...args)
    return isFuture(...args)
  },
  gotoMonday: function(date){
    //Monday is 1, Sunday is 7
    //If we are on 6 or 7, we want to advance to next week.
    //Else we want to go back to this week Monday
    // ('gtm:current day is a' ,date.getDay())
    let addOrSubtract = 0
    if (date.getDay() > 5) {
      addOrSubtract = 1
    } else {
      addOrSubtract = -1
    }
    while (date.getDay() > 1) {
      date.setDate(date.getDate() + addOrSubtract);
    }
    return date
  },
  addOneDay: function(date) {
    date.setDate(date.getDate() + 1);
    return date
  },
  todayNoHours: function() {
    let d = new Date()
    d.setHours(0,0,0,0)
    return d
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
  getMondayPast() {
    let today = new Date()
    today.setDate(today.getDate() - 10)
    this.gotoMonday(today)
    l('this is monday past:', today, today.setHours(0,0,0,0))
    return today
  },
  curDay: function(date) {
    //11 Maart 2021 was Dag 10
    //1 maart was dag 2
    if (compareAsc(date.setHours(0,0,0,0), new Date(2022,4,3).setHours(0,0,0,0) )  == 0 ) {
       return 1
    } else {
      alert('We could not detect the correct DAY Number')
      return 1
    }
  }
};


//Kan jy my sê watter skooldag is vandag? (11/03/2021) - Dag 10 sir.

