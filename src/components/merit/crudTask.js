import { zmlConfig } from '@/api/constants';
import { zmlFetch } from '@/api/zmlFetch';
import { infoSnackbar,errorSnackbar } from '@/api/GlobalActions';
import { getters } from "@/api/store";
import { look } from "@/api/Lookups.js"

export const crudTask = {
    hello: (p1) => {console.log('hello from (JS) ' , crudTask.name,p1)}
   ,name: "JSCrudTasks"
   ,reportError: (response) => {
      if (response !== undefined && response.errorcode && response.errorcode != 0) {
        console.log(crudTask.name,'DbErr:',response)
        if (response.error.indexOf('Duplicate entry') != -1 ) {
          errorSnackbar("ERROR : We use this item in this location - just update it")
        } else if (response.error.indexOf('a foreign key constraint') != -1 ) {
            //ERROR : {"errorInfo":["23000",1451,"Cannot delete or update a parent row: a foreign key constraint fails (`kuilieso_bib`.`s_stock`, CONSTRAINT `stock_type` FOREIGN KEY (`typeid`) REFERENCES `s_itemtype` (`typeid`) ON DELETE NO ACTION ON UPDATE NO ACTION)"]}
            errorSnackbar('Someone is using the information in their inventory, we cannot delete it')
        } else {
          errorSnackbar("ERROR : " +  response.error)
        }
        return true
      }
      return false
    }
    ,reportNoRows: (response) => {
      if ('errorcode' in response && 'error' in response && response.errorcode == 0) {
        if (response.error.indexOf('no rows returned') != -1 ) {
          infoSnackbar("We have no information for this query")
          return true
        }
      }
      return false
    }
   ,showError: (response) => {
      errorSnackbar("ERROR : " +  response)
    }
   ,get(table, id) {
    console.log('get ', table)
    let gzp = getters.getState({ object: "gZml" })
    let currentRecord = gzp.meritLevel.find(e => e.id == id)
    currentRecord.owner = look.persMenemonic(currentRecord.userid)
    console.log('get owner', currentRecord.owner)
    return currentRecord
   }
   ,saveData: (entityTableName, record, pcallback=doneFetch) => {
     console.log('save crudData : ', entityTableName, record.title)
     let ts = {}
     ts.task = 'PlainSql'
     ts.data = {title: record.description
               ,description: record.description
               ,id : record.id
               ,back : record.back
               ,forward : record.forward
               ,points : record.points
               ,userid : record.userid
               }
     ts.data.bind = {
          id: record.id
         ,title: record.title ? record.title.trim() : null
         ,description: record.description ? record.description.trim() : null
         ,points: record.points
         ,userid: record.userid
         }
     ts.sql = `update d_meritlevel set title = :title, description = :description, points = :points \
                                     , userid = :userid where id = :id`
     console.log(ts)
     ts.api = zmlConfig.apiPath
     zmlFetch(ts, pcallback, errorFetch)
     // Update store data
     let gzp = getters.getState({ object: "gZml" })
     let idx = gzp.meritLevel.findIndex(e => e.id == record.id)
     gzp.meritLevel[idx].points = record.points
     gzp.meritLevel[idx].title = record.title
     gzp.meritLevel[idx].description = record.description
     gzp.meritLevel[idx].userid = record.userid


   }
   ,load: (entityTableName) => {
     console.log('load crudData : ', entityTableName)
    let gzp = getters.getState({ object: "gZml" })
    switch (entityTableName) {
     case "merit":
       console.log(gzp.meritLevel.length)
       return gzp.meritLevel
    }
    console.log('something slipped thrui!!!!')
  }

}



function doneFetch (response) {
  console.log('doneFetch:', response)
  if ( response.error ) {
      errorSnackbar(response.error)
  } else {
      infoSnackbar('We saved your data')
  }
}

function errorFetch (response) {
  console.log('xexxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxrror:', response)
  errorSnackbar('We had an error saving your data!' + response.error)
}
// this works ok , but objects live in same place lots of times...
/*
const haveSameData = function (obj1, obj2) {
  const obj1Length = Object.keys(obj1).length;
  const obj2Length = Object.keys(obj2).length;
  console.log('have same data', obj1Length, obj2Length)
  if (obj1Length === obj2Length) {
      console.log(Object.keys(obj1))
      return Object.keys(obj1).every(key => {
        // eslint-disable-next-line
          console.log( obj2.hasOwnProperty(key) , obj2[key] , '=== ',obj1[key])
          // eslint-disable-next-line
          return obj2.hasOwnProperty(key) && obj2[key] === obj1[key]
  });
  }
  return false;
}
*/