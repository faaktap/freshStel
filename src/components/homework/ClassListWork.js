import { mySet, getters } from "@/api/store";

import { infoSnackbar, errorSnackbar } from '@/api/GlobalActions';
import { zFetch, zmlFetch } from '@/api/zmlFetch';
import { zmlLog } from '@/api/zmlLog.js';

export const clWork = {
    hello: (p1) => {console.log('hello from (StudentAttendanceList.JS) ' , p1)}
   ,name: "ClassListWork"
   ,reportError: (response) => {
     if (response !== undefined && response.errorcode && response.errorcode != 0) {
      console.log(clWork.name,'DbErr:',response)
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
    console.log("ERROR : " +  response)
   }
   ,getList: (listID, doneProcedure) => {
    //fetch a list form hw_classlist
      let sn = { task: 'plainSql' , sql:`select * from  hw_classlist where id = ${listID}`}
      zmlFetch(sn, doneProcedure)
   }
   ,getTheTickList( doneProcedure ) {
      let sn = { task: 'plainSql', sql:`SELECT * FROM  dkhs_tickjdoc`}
      zmlFetch(sn, doneProcedure)
   }
   ,getAllGeneralLists( doneProcedure ) {
       let sn = { task: 'PlainSql', sql:`SELECT tgl.genlistid, tgl.classlistid, tgl.userid, tgl.placeid\
         , tgl.listdate, tgl.note, p.name location, l.user_name teacher, cl.listname\
      FROM dkhs_genlist tgl\
      LEFT JOIN hw_classlist cl on cl.id = tgl.classlistid\
      LEFT JOIN dkhs_learner l on l.userid = tgl.userid\
      LEFT JOIN s_place p on p.placeid = tgl.placeid`}
      zmlFetch(sn, doneProcedure)
   }
   ,getGeneralList: (listID, doneProcedure) => {
    //fetch a list form hw_classlist
      let sn = { task: 'plainSql' , sql:`select * from  dkhs_genlist where genlistid = ${listID}`}
      zmlFetch(sn, doneProcedure)
   },
   saveGenList: (studentListReal, studentItem, listDetail) => {
    console.log('SAVEGENLIST')
    console.log('studentListReal:', studentListReal)
    console.log('studentItem:', studentItem)
    console.log('listDetail:', listDetail)

   },
   addGenList: (newList,basicList, afterwardsProcedure) => {
      let listName = newList.description + ' (' + newList.name + ')'
      console.log('addGenList',newList,basicList, afterwardsProcedure, listName)
      let optionsAndMore = JSON.stringify(newList)
      let sql = `insert into dkhs_genlist values(null\
      , ${basicList.id}\
      , '${listName}'\
      , ${basicList.userid}\
      , null\
      , '${basicList.share}'\
      , '${basicList.grade}'\
      , substr(now(),1,10)\
      , '${optionsAndMore}'\
      , ''\
      )`
      clWork.executeSql(sql)
   }
   ,getStudentsInList: (listID, doneProcedure) => {
    //fetch a list of students from hw_classliststudents
      let sl = { task: 'plainSql'
                , sql:`select l.studentid,s.*  from dkhs_student s, hw_classliststudent l \
                        where l.classlistid = ${listID} and l.studentid = s.studentid \
                     order by s.surname, s.firstname, s.studentid`
      }
      zmlFetch(sl, doneProcedure)
   }
   ,descriptionForThisSession: ""
   ,addToList: (listID, studentid) => {
      console.log('start transaction',listID, studentid)
      let sql = `insert into hw_classliststudent values(null, ${listID}, ${studentid}, now())`
      console.log(sql)
      clWork.executeSql(sql)
      return 'DONE'
   },
   addList: (listObj) => {
    let sql = `insert into hw_classlist values (null
               ,'${listObj.teacher}'
               ,'${listObj.listname}'
               ,'${listObj.share}'
               ,null
               ,now()
               ,now()
               ,'${listObj.grade}'
               ,null
               ,null
               )`
    clWork.executeSql(sql)
    return 'DONE'
   },
   deleteList: (listObj) => {
      let sn = { task: 'plainSql' , sql: `delete from hw_classlist where id = ${listObj.id}` }
      zmlFetch(sn, clWork.doneDeleteProcedure, clWork.reportError)
      return 'DONE'
   },
   doneDeleteProcedure(response) {
      if (response && response.errorcode && response.errorcode != 0) {
         errorSnackbar('List was NOT Deleted:' + response.result + ' ' + response.errorcode)
      } else {
         infoSnackbar('List was deleted!')
      }
   },
   updateList: (listObj) => {
    let sql = `update hw_classlist \
                 set listname = '${listObj.listname}'\
               , share = '${listObj.share}'\
               , grade = '${listObj.grade}'\
               , teacher = '${listObj.teacher}'\
               , jdocstructure = '${listObj.jdocstructure}'\
               where id = ${listObj.id}`
    clWork.executeSql(sql)
    return 'DONE'
   },
   addStudentsToList: (curListID, addThisID) => {
    let sql = `INSERT IGNORE INTO hw_classliststudent
        SELECT null, ${curListID}, studentid, now()
          FROM hw_classliststudent where classlistid = ${addThisID}`
    clWork.executeSql(sql)
    return 'DONE'
   },
   deleteStudentFromList: (listID, sid) => {
      let sql = `DELETE FROM hw_classliststudent
                WHERE classlistid = ${listID}
                 AND studentid = ${sid}`
      clWork.executeSql(sql)
      return 'DONE'
   },
   addListAndStudentsInOnShot: (pData) => {
      let p = zFetch({task:'ClassListOneShotAdd', data: pData})
      p.then((r) => {
        if (r.status >= 200 && r.status <= 299) {
          //we do not need the json, we assume the add/insert went fine zmlzmlzml
          pData.continue()
          zmlLog('', clWork.name, `AddOneShotClassLst:${pData.listname},${pData.parms}`)
          clWork.refreshClassLists()

        } else { throw Error(r.statusText) }
      })
      console.log('initiate a fetch/update/insert classlist', pData)
   },
   refreshClassLists: () => {
      let sn = { task: 'plainSql' , sql:`select * from  hw_classlist`}
      zmlFetch(sn, (jdata) => {
         console.log('Update ClassLists after add', jdata, jdata.length)
         if (jdata.length) {
           mySet("gZml","classList", jdata)
           if (getters.getState({ object: "gZml" }).classList.length) {
              ls.save('zmlClassList', jdata)
              console.log('Update ClassList SAVED to LS: ', getters.getState({ object: "gZml" }).classList.length)
           }
         } else {
            console.log('Update ClassLists FAILED')
         }
      })
   },
   executeSql: (sql) => {
     let p = zFetch({task:'PlainSql', sql:sql})
     p.then((r) => {
        console.log('Saving student in list',r)
        if (r.status >= 200 && r.status <= 299) {
           return r.json();
        } else {
           throw Error(r.statusText)
        }
    })
   p.then(data => {
    if ('error' in data) {
      console.log('Error on Saving?', data)
    }
   })
  }
}
