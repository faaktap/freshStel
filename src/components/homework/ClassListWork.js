// import { getters } from "@/api/store";
import { errorSnackbar } from '@/api/GlobalActions';
import { zFetch } from '@/api/zmlFetch';
//import { zmlLog } from '@/api/zmlLog.js';

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
   updateList: (listObj) => {
    let sql = `update hw_classlist \
                 set listname = '${listObj.listname}'\
               , share = '${listObj.share}'\
               , grade = '${listObj.grade}'\
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
