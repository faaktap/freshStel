// import { getters } from "@/api/store";
import { errorSnackbar } from '@/api/GlobalActions';
import { zFetch } from '@/api/zmlFetch';
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
   ,check: (pData, addProc = mer.addProc, fineProc = mer.fineProc) => {
      console.log(mer.name,'check', pData)
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
      if (!pData.desc) {
        //If we have no description, we will not continue to add
        pData.continue()
      }
      let sql = `insert into dkhs_meritlink values (${pData.meritid}, "MOS", "${pData.desc}")`
      console.log(mer.name,'checkAdd', sql)
      let p = zFetch({task:'PlainSql', sql:sql})
      p.then((r) => {
        console.log('RAW FETCH RETURN 2',r)
        if (r.status >= 200 && r.status <= 299) {
          //we do not need the json, we assume the add/insert went fine zmlzmlzml
          pData.continue(pData, pData.desc, 'MOS')
        } else { throw Error(r.statusText) }
      })
    }
   ,fineProc: (response, pData) => {
      console.log('fineProc', response)
      pData.continue(pData, response[0].defaultdescription)
    }
   ,add: (pData) => {
      //meritid, desc, pers, student, date, continue:this.goBack
      console.log(mer.name,'ADD', pData)
      let sql = `insert into dkhs_meritstudent\
                values (null,${pData.studentid},${pData.meritid}\
                       ,"${pData.date}","${pData.pers}", null, "${pData.desc}")`
      let p = zFetch({task:'PlainSql', sql:sql})
      p.then((r) => {
        if (r.status >= 200 && r.status <= 299) {
          //we do not need the json, we assume the add/insert went fine zmlzmlzml
          pData.continue()
        } else { throw Error(r.statusText) }
      })
    }
   ,load: (data) => {
      console.log(mer.name,'load', data)
    }
}
