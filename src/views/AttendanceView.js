import { zmlConfig } from '@/api/constants';
import { zmlFetch } from '@/api/zmlFetch';
import { infoSnackbar, errorSnackbar } from '@/api/GlobalActions';

export const tableWork = {
    name:'tableAttendance',
    errorSnackbar: function(txt) {
        //this.$notifier.showMessage({ content: txt, color: 'error' })
        errorSnackbar(txt)
    },
    infoSnackbar: function(txt) {
        //this.$notifier.showMessage({ content: txt, color: 'info' })
        infoSnackbar(txt)
    },
    hello: (p1) => {console.log('hello from (JS) ' , p1)},
    getIndex: (itemID,table) => {
        let index = table.findIndex(ele => ele.attendanceid == itemID)
        if (index == -1) {
          errorSnackbar('item not found for deletion' + index)
        }
        return index
    },
    delete: (itemID,table) => {
        let index = tableWork.getIndex(itemID,table)
        if (index != -1) {
           table.splice(index,1);
        }
    },
    getData: (key, pCallback) => {
        console.log(key)
        let ts = {}
        ts.task = 'PlainSql'
        ts.sql = `select a.attendanceid,\
        a.staff,\
        a.location,\
        a.period,\
        a.capture,\
        date_format(a.attendancedate,'%Y-%m-%d %H:%i') attendancedate,\
        a.sessionid,\
        concat(s.surname,', ', s.firstname) student,\
        concat(s.grade,s.gclass) grade \
 from dkhs_student s\
    , a_attendance a\
 where a.capture = s.studentid and a.attendancedate\
   and attendancedate like concat(substr(now(),1,11),'%')
 order by a.attendancedate desc, a.period ,a.staff, a.location`
        ts.api = zmlConfig.apiPath
        zmlFetch(ts, pCallback, errorFetch)
    },
    getPeriod: (key, pCallback) => {
        console.log(key)
        let ts = {}
        ts.task = 'PlainSql'
        ts.sql = `select a.period, count(*) recs \
  FROM a_attendance a GROUP BY a.period\
  ORDER BY  CAST(a.period as SIGNED INTEGER) DESC`
        ts.api = zmlConfig.apiPath
        zmlFetch(ts, pCallback, errorFetch)
    },
    saveData: (record,pcallback=doneFetch) => {
        let ts = {}
        ts.task = 'PlainSql'
        ts.data = {staff: record.staff
                  ,location : record.location
                  ,period: record.period}
        ts.data.bind = {staff: record.staff
                  ,location : record.location
                  ,period: record.period}
        ts.sql = 'update a_attendance set staff = :staff, location = :location, period = :period where attendanceid = :attendanceid;'
        ts.api = zmlConfig.apiPath
        zmlFetch(ts, pcallback, errorFetch)

    },
    deleteData:(record,pcallback=doneFetch) => {
        let ts = {}
        ts.task = 'PlainSql'
        ts.data = {attendanceid: record.attendanceid}
        ts.data.bind = {attendanceid: record.attendanceid}
        ts.sql = `update a_attendance set active = 'DEL' where attendanceid = ${record.attendanceid}`
        ts.api = zmlConfig.apiPath
        zmlFetch(ts, pcallback, errorFetch)
    },
}

function doneFetch (response) {
    console.log('doneLoading:', response)
    if ( response.error ) {
        //errorSnackbar(response.error)
    } else {
        //infoSnackbar('We saved your data')
    }
}

function errorFetch (response) {
    console.log('error:', response)
    //errorSnackbar('We had an error saving your data!' + response)
}