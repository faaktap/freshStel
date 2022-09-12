// import { getters } from "@/api/store";
import { errorSnackbar } from '@/api/GlobalActions';
import { zFetch } from '@/api/zmlFetch';
import { zmlLog } from '@/api/zmlLog.js';

export const mer = {
    hello: (p1) => {console.log('hello from (merit.JS) ' , p1)}
   ,name: "JSMerit"
   ,reportError: (response) => {
     if (response !== undefined && response.errorcode && response.errorcode != 0) {
      console.log(mer.name,'DbErr:',response)
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
   ,loadAllMerits: (persMenemonic, afterwardsProc) =>  {
    console.log('load all - not  only', persMenemonic)
    let sql = `select s.*, l.point
             , concat(st.surname,',', st.firstname) studentname\
             , concat(st.grade, st.gclass) studentgrade\
               from dkhs_meritstudent s, dkhs_meritlink l, dkhs_student st\
               where l.meritid = s.meritid and s.studentid = st.studentid`
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
   ,check: (pData, addProc = mer.addProc, fineProc = mer.fineProc) => {
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
