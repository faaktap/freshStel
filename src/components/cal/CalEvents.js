// import { getters } from "@/api/store";
import { errorSnackbar } from '@/api/GlobalActions';
import { zmlFetch } from '@/api/zmlFetch';
import { zmlLog } from '@/api/zmlLog.js';
import { getters } from "@/api/store";

const holdidaySql = `select * from (\
  select 9999 id, dt.fulldate startdate, dt.fulldate enddate, dt.week, dt.dayno dayNo\
  ,  concat('day',dayno) event\
  , if(dayNo != '0',"School","NotSchool") type, 'light-blue' color\
  FROM dkhs_date dt\
  union all\
  select 8888 id, dt.fulldate,dt.fulldate, dt.week, dt.dayno dayNo\
  , hol.holidayname event\
  , if(length(hol.holidayname) > 1,"Holiday",null) type, 'orange'\
  FROM dkhs_date dt\
  LEFT JOIN dkhs_holiday hol on dt.iddate = hol.iddate\
  WHERE dt.idDate <  DATE(now() + INTERVAL 30 DAY)\
  AND dt.idDate >  DATE(now() - INTERVAL 30 DAY)\
  union all\
  select 7777 id, dt.fulldate,dt.fulldate, dt.week, dt.dayno dayNo\
  , pers.public_preferredname evt\
  , 'Birthday' type, 'indigo'\
  FROM dkhs_date dt\
  LEFT JOIN dkhs_personel pers on concat(substr(dt.fulldate,9,2), '-', substr(dt.fulldate,6,2)) = concat(substr(pers.IDNumber,3,2), '-', substr(pers.IDNumber,5,2))\
  where length(pers.IDNumber) > 4\
  ) ev\
  WHERE ev.startdate <  DATE(now() + INTERVAL 60 DAY)\
  AND ev.startdate >  DATE(now() - INTERVAL 60 DAY)\
  AND ev.type is not null\
  ORDER BY ev.startdate`
const localEventsSql = `SELECT e.id, e.eventtypeid, e.eventname event, t.eventtype type, concat(startdate,' ',starttime) startdate\
  , concat(enddate,' ',endtime) enddate, color, length, audience, e.userid, l.user_name\
  FROM dkhs_eventdate e, dkhs_eventtype t , dkhs_learner l WHERE e.eventtypeid = t.id AND l.userid = e.userid`

const loadPeriodsSql = `select per.id,  dt.fulldate notneeded3, dt.dayno\
  , per.description type \
  , concat(dt.fulldate, ' ', per.starttime) startdate\
  , concat(dt.fulldate, ' ', per.endtime) enddate\
  , per.length, per.periodname event\
  , per.dow\
  , if (periodname = 'Break', 'green lighten-1', 'green darken-2') color\
  FROM dkhs_date dt , dkhs_dayperiod per\
 WHERE per.dow = dt.dayOfWeek\
   AND dt.dayno > 0
   AND dt.iddate <  DATE(now() + INTERVAL 30 DAY) \
   AND dt.iddate >  DATE(now() - INTERVAL 30 DAY)`


export const calEvents = {
    hello: (p1) => {console.log('hello from (CalEvents.JS) ' , p1)}
   ,name: "CalendarEvents"
   ,reportError: (response) => {
     if (response !== undefined && response.errorcode && response.errorcode != 0) {
      console.log(calEvents.name,'DbErr:',response)
      if (response.error.indexOf('Duplicate entry') != -1 ) {
        errorSnackbar("ERROR : We use this item in this location - just update it")
      } else if (response.error.indexOf('a foreign key constraint') != -1 ) {
          errorSnackbar('Someone is using this information, we cannot delete it')
      } else {
        errorSnackbar("ERROR : " +  response.error)
      }
      return true
      }
      return false
   }
   ,showError: (response) => {
    console.log("ERROR : " ,  response)
   }
   ,events:[]
   ,descriptionForThisSession: ""
   ,LoadCalendarData: (storage,action,pcallback) => {
      calEvents.events = storage
      switch (action) {
      case 'LocalEvents': {
        calEvents.calFetch(action, localEventsSql, pcallback)
        break
      }
      case 'DaysHolidaysBirthdays': {
        calEvents.calFetch(action, holdidaySql, pcallback)
        break
      }
      case 'PeriodsAsEvents': {
        calEvents.calFetch(action, loadPeriodsSql, pcallback)
        break
      }
      default: {
        alert('we do not understand : '+ action)
      }
    }
   },
  saveCalEvent: (e, pcallback) => {
    let ts = {}
    ts.task = 'PlainSql'
    ts.sql = `update dkhs_eventdate set eventname = :eventname where id = :id`
    ts.data = {}
    ts.data.bind = {}
    //ts.data.id = e.id
    //ts.data.eventname = e.name
    ts.data.bind.id = e.id
    ts.data.bind.eventname = e.name
    zmlFetch(ts, pcallback)
  },
  insertCalEvent: (e, pcallback) => {
    console.log('insertCalEvent:', e)
    let typeid = 12
    let userid = getters.getState({ object: "gZml" }).login.userid
    if (typeof e.type === 'object') typeid = e.type.id
    let ts = {task: 'PlainSql'}
    // ts.data = {}
    // ts.data.bind = {eventname: e.name
    //                ,startdate: e.start.substr(0,10)
    //                ,starttime: e.startTime
    //                ,enddate: e.end.substr(0,10)
    //                ,endtime: e.endTime
    //                ,audience: 'ALL'
    //                ,userid: getters.getState({ object: "gZml" }).login.userid
    //                ,typeid: typeid
    //            }
    ts.sql = `insert into dkhs_eventdate \
             (eventname ,eventtypeid, startdate, starttime, enddate, endtime,audience, userid) values \
             ('${e.name}','${typeid}','${e.start.substr(0,10)}', '${e.startTime}', '${e.end.substr(0,10)}', '${e.endTime}', 'ALL', ${userid} )`
    zmlFetch(ts, pcallback)
  },
  finishedLoadingEvents: (response, task, pcallback) => {
    console.log('processing', task)
    response.forEach(ele => {
      if (ele.startdate) {
         const evt= {
                id: ele.id ? ele.id : 666666
              , name: ele.event
              , start: ele.startdate
              , end: ele.enddate
              , color: ele.color
              , type: ele.type
              , timed: ele.startdate.length > 10 ? true : false
                }
         calEvents.events.push(evt)
      }
    })
    pcallback(response)
  },
  calFetch: (action, sql, pcallback) => {
    console.log('fetch will start for ', action)
      let ts = {}
      ts.task = 'PlainSql'
      ts.action = action
      ts.sql = sql
      zmlFetch(ts, calEvents.finishedLoadingEvents, calEvents.reportError,pcallback)
   }


















   ,updateEvent: (slRec) => {
       if (slRec.id == parseInt(slRec.id) ) {
         let sql = `update dkhs_attendance set status = '${slRec.status}'\
         , attendancedate = '${slRec.attendancedate}'
         where attendanceid = ${slRec.attendanceid}`
         calEvents.executeSql(sql)
         zmlLog('', 'calEvents:Status', `${slRec.studentid},${slRec.attendanceid},${slRec.status}`)
         return "DONE"
       } else {
         return "ID NOT NUMBER"
       }
   }
   ,saveAttendance: (studentList, presentList, attDet) => {
      console.log('start transaction',attDet.userid, attDet.placeid, attDet.sessionID)
      let sql = ''
      let cnt = 0
      studentList.forEach(e => {
        if (presentList[cnt] != 'Ignore') {
         const line = `insert into dkhs_attendance values(\
             null,${attDet.userid},\
             ${attDet.placeid},'${attDet.period}',\
             ${e.studentid},'${presentList[cnt]}',\
             now(),'${attDet.sessionID}',\
             null);`
          sql += line
        }
        cnt ++  //important - to match up
      })
      if (sql) {
         calEvents.executeSql(sql)
         return "DONE"
      }
      return 'NOROWS'
   },
   executeSql: (sql) => {
    alert('We Must do this?' + sql)
  }
  ,updateGenList(rec) {
    let sql = `update dkhs_genlistdata set status = "${rec.status}" where listdataid = ${rec.listdataid}`
    return calEvents.executeSql(sql)
  }
  ,saveGenList: (studentList, presentList, genDet) => {
    console.log('start transaction',genDet.userid, genDet.placeid, genDet.sessionID)
    let sql = ''
    let cnt = 0
    studentList.forEach(e => {
      if (presentList[cnt] != 'Ignore') {
       const line = `insert into dkhs_genlistdata values(\
           null,${genDet.userid},\
           ${genDet.placeid},'${genDet.period}','${genDet.day}',\
           ${e.studentid},'${genDet.sessionID}',now(),'${presentList[cnt]}');`
        sql += line
      }
      cnt ++  //important - to match up
    })
    if (sql) {
       calEvents.executeSql(sql)
       return "DONE"
    }
    return 'NOROWS'
 },
}




/*
   ,getStudent: (studentid, afterwardsProc) =>  {
    if (!studentid) {
      console.log('we are asked to GET a student, but th adminno is !!!!!!', studentid)
      console.log(studentid == undefined)
      console.log(studentid == null)
      console.log(!studentid)
      return
    }
    let sql = `select * from dkhs_student\
               where studentid = ${studentid}`
    let p = zFetch({task:'PlainSql', sql:sql})
    p.then((r) => {
      console.log('RAW FETCH RETURN 1',r)
      if (r.status >= 200 && r.status <= 299) {
        return r.json();
      } else { throw Error(r.statusText) }
    })
    .then(data => {
     if ('error' in data && data.error.indexOf('no rows') > -1) {
       console.log('we have error on retrieve', data)
     } else {
      console.log('passing data to Afterwards:loadStudent?', data)
      afterwardsProc(data[0])
     }
    })
   }
   ,confirm: (record) =>  {
    let sql = `update dkhs_meritstudent\
               set persmenemonic = '${record.persmenemonic}', confirmdte = '${record.confirmdte}'\
               where meritstudentid = ${record.meritstudentid}`
    let p = zFetch({task:'PlainSql', sql:sql})
    p.then((r) => {
      console.log('CONFIRM RETURN 1',r)
      if (r.status >= 200 && r.status <= 299) {
        zmlLog('', satt.name, `ConfirmMS:${record.meritstudentid},${record.meritid},${record.confirmdte},${record.persmenemonic}`)
        return r.json();
      } else { throw Error(r.statusText) }
    })
  }
   ,delete: (record) =>  {
     let sql = `delete from dkhs_meritstudent where meritstudentid = ${record.meritstudentid}`
     let p = zFetch({task:'PlainSql', sql:sql})
     p.then((r) => {
       console.log('DELETE RETURN 1',r)
       if (r.status >= 200 && r.status <= 299) {
         zmlLog('', satt.name, `DeleteMS:${record.studentid},${record.meritid},${record.meritdte},${record.persmenemonic}`)
         return r.json();
       } else { throw Error(r.statusText) }
     })
   }
   ,loadAllMerits: (persMenemonic, afterwardsProc) =>  {
    console.log('load all - not  only', persMenemonic)
    let sql = `select s.*, l.point
             , concat(st.surname,',', st.firstname) studentname\
             , concat(st.grade, st.gclass) studentgrade\
               from dkhs_meritstudent s, dkhs_meritlink l, dkhs_student st\
               where l.meritid = s.meritid and s.studentid = st.studentid\
               order by studentname ASC, confirmdte DESC`
                 //and persmenemonic = ${persMenemonic}`
    let p = zFetch({task:'PlainSql', sql:sql})
    p.then((r) => {
      //console.log('RAW FETCH RETURN 1',r)
      if (r.status >= 200 && r.status <= 299) {
        return r.json();
      } else { throw Error(r.statusText) }
    })
    .then(data => {
     if ('error' in data && data.error.indexOf('no rows') > -1) {
       console.log('we have error on retrieve', data)
     } else {
      afterwardsProc(data)
     }
    })
   }
   ,loadStudentMerits: (studentid, afterwardsProc) =>  {
    let sql = `select s.*, l.point \
               from dkhs_meritstudent s, dkhs_meritlink l\
               where studentid = ${studentid}\
                 and l.meritid = s.meritid`
    let p = zFetch({task:'PlainSql', sql:sql})
    p.then((r) => {
      //console.log('RAW FETCH RETURN 1',r)
      if (r.status >= 200 && r.status <= 299) {
        return r.json();
      } else { throw Error(r.statusText) }
    })
    .then(data => {
     if ('error' in data && data.error.indexOf('no rows') > -1) {
       console.log('we have error on retrieve', data)
     } else {
      afterwardsProc(data)
     }
    })
   }

// Check - will add a merit into merit_link, if it does not exist, as long as we have a description
// It will call addProc, if we want to add a merit, and fineProc is merit already added in meritlink.
   ,check: (pData, addProc = satt.addProc, fineProc = satt.fineProc) => {
      console.log(mer.name,'check', pData)
      mer.descriptionForThisSession = pData.desc
      console.log('WE SAVED THE DESCRIPTION, IS it CORRECT', pData.desc)
      let sql = `select * from dkhs_meritlink where meritid = ${pData.meritid}`
      let p = zFetch({task:'PlainSql', sql:sql})
      p.then((r) => {
        console.log('RAW FETCH RETURN 1',r)
        if (r.status >= 200 && r.status <= 299) {
          return r.json();
        } else { throw Error(r.statusText) }
      })
      .then(data => {
       if ('error' in data && data.error.indexOf('no rows') > -1) {
         addProc(pData)
       } else {
        fineProc(data, pData)
       }
      })
    }
   ,addProc: (pData) => {
      console.log('addProc', pData)
      if (!mer.descriptionForThisSession) {
        //If we have no description, we will not continue to add
        console.log('WE HAVE NO DESCRIPTION - CANNOT ADD', pData)
        pData.continue()
      }
      let firstComma = mer.descriptionForThisSession.indexOf(',')
      let lastComma = mer.descriptionForThisSession.lastIndexOf(',')
      let partDesc = mer.descriptionForThisSession.substring(0, firstComma).trim() +  ' .. ' +
                     mer.descriptionForThisSession.substring(lastComma+1).trim()
      console.log(partDesc)
      let sql = `insert into dkhs_meritlink values (${pData.meritid}, "MOS",1, "${partDesc}")`
      console.log(mer.name,'checkAdd', sql)
      let p = zFetch({task:'PlainSql', sql:sql})
      p.then((r) => {
        console.log('RAW FETCH RETURN 2',r)
        if (r.status >= 200 && r.status <= 299) {
          //we do not need the json, we assume the add/insert went fine zmlzmlzml
          pData.continue(pData, mer.descriptionForThisSession, 'MOS')
        } else { throw Error(r.statusText) }
      })
    }
   ,fineProc: (response, pData) => {
      console.log('fineProc', response)
      pData.continue(pData, mer.descriptionForThisSession)
    }
   ,add: (pData) => {
      //meritid, desc, pers, student, date, continue:this.goBack
      console.log(mer.name,'ADD', pData, 'GOOD DESC:',mer.descriptionForThisSession)
      let sql = `insert into dkhs_meritstudent\
                values (null,${pData.studentid},${pData.meritid}\
                       ,"${pData.date}","${pData.pers}"\
                       , ${pData.confirm ? 'now()' : 'null' }\
                       ,"${mer.descriptionForThisSession}")`
                       //,"${pData.desc}")`
      let p = zFetch({task:'PlainSql', sql:sql})
      p.then((r) => {
        if (r.status >= 200 && r.status <= 299) {
          //we do not need the json, we assume the add/insert went fine zmlzmlzml
          pData.continue()
          zmlLog('', mer.name, `AddMS:${pData.studentid},${pData.meritid},${pData.date},${pData.pers}`)
        } else { throw Error(r.statusText) }
      })
    }
   ,load: (data) => {
      console.log(mer.name,'load', data)
    }
}
*/