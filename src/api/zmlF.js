const DONE = 3
const BUSY = 2
const WAIT = 0
const READY = 1

export const zmlF = {
    Status:WAIT,
    statusText: (status) => {
        switch(status) {
            case WAIT : return "wait";
            case DONE : return "done";
            case BUSY : return "busy";
            case READY : return "ready";
            default: return "unknown status";
        }
    },
    // Not as fancy as the one above - but feedback is nice.
    ZQR: (storage, pcallback, pErrorcallback) => {
      if  ('workDone' in storage && storage.workDone == 'BUSY')  alert('We should wait, since we are busy with a fetch')
      storage.workDone = BUSY
      storage.progress = true
      // let taskSql = {}
      // taskSql.task = storage.task
      // taskSql.action = storage.action
      // if ('data' in storage) taskSql.data = storage.data

      // console.log('ZF is doing ', storage, taskSql)
      let p = zmlF.zFetch(storage)

      p.then((resp) => {
       storage.workDone = DONE
       storage.progress = false
       console.log('RAW FETCH RETURN 1',resp)
       if (resp.status >= 200 && resp.status <= 299) {
         return resp.json();
       } else {
         throw Error(resp.statusText)
       }
      })
      .then(rjson => {
       if (rjson.errorcode != undefined && rjson.errorcode != 0) {
         console.log('ZmlF : We have errorcode on ', storage.action, rjson.errorcode)
         storage.feedback = "Error:" + rjson.errorcode   // rjson
         if (pErrorcallback) pErrorcallback(rjson)
         return
       }
       storage.response = rjson
       storage.feedback = "Done " + storage.action
       console.log('zmlF: Passing data to storage and do Callback if it exist', rjson)
       if (pcallback) pcallback(rjson)
       return
      })
      .catch(err => {
         //we have a problem, load our error object and report back
         console.log('zmlF: We caught an throwed error, see feedback', err)
         storage.feedback = {error: 'Failed to Fetch', errorcode: '9999', exception:"caught exception", result:err}
         storage.workDone = DONE
         storage.progress = false
         if (pErrorcallback) pErrorcallback(storage.response)
      })
    },
    ZF: (storage, pcallback, pErrorcallback) => {
       if  (storage.workDone == 'BUSY')  alert('We should wait, since we are busy with a fetch')
       storage.workDone = BUSY
       storage.progress = true
       let taskSql = storage.sql.find(e => e.action == storage.action)
       taskSql.task = 'PlainSql'
       taskSql.action = storage.action


       // When do we supply .data, and .data.bind info to phpserver?
       // At the moment when we do anything except refresh.
       if (taskSql.action != 'refresh') {
        taskSql.data = storage.data
        taskSql.data.bind = storage.data.bind
       }
       console.log('ZF is doing ', storage, taskSql)

       let p = zmlF.zFetch(taskSql)

       p.then((resp) => {
        storage.workDone = DONE
        storage.progress = false
        console.log('RAW FETCH RETURN 1',resp)
        if (resp.status >= 200 && resp.status <= 299) {
          return resp.json();
        } else {
          throw Error(resp.statusText)
        }
       })
       .then(rjson => {
        storage.progress = false
        if (rjson.errorcode != undefined && rjson.errorcode != 0) {
          console.log('ZmlF : We have errorcode on ', storage.action, rjson.errorcode)
          storage.feedback = "Error:" + rjson.errorcode   // rjson
          if (pErrorcallback) pErrorcallback(rjson)
          return
        }
        if (storage.action == 'refresh') {
          storage.response = rjson
        } else {
          storage.feedback = 'ErrorAgain:' + rjson  //save it in feedback, since it was update or insert
        }
        console.log('zmlF: Passing data to storage and do Callback if it exist', rjson)
        if (pcallback) pcallback(rjson)
        return
       })
       .catch(err => {
          //we have a problem, load our error object and report back
          console.log('zmlF: We caught an throwed error, see feedback', err)
          storage.feedback = {error: 'Failed to Fetch', errorcode: '9999', exception:"caught exception", result:err}
          storage.workDone = DONE
          storage.progress = false
          if (pErrorcallback) pErrorcallback(storage.response)
       })
    },
    showDBError : (chk) => {
        if (chk) {
              if (chk.errorcode != undefined) {
                if (chk.errorcode != '0') {
                  return chk.errorcode +' '+ chk.error
                } else {
                  return 'error is Zero'
                }
              } else if (chk.length != undefined) {
                if (chk.length == 0) {
                  return 'not Started'
                } else {
                  return 'data Loaded : ' + chk.length
                }
              } else {
                return ''
              }
            } else {
              return 'object Empty'
            }
      },
      isGoodData : (chk) => {
        if (chk) {
              if (chk.errorcode != undefined) {
                if (chk.errorcode > 0) {
                  return false //console.log('we have an error property loaded width an error',chk.errorcode)
                } else {
                  return true //console.log('we have an error property loaded - no error',chk)
                }
              } else if (chk.length != undefined) {
                if (chk.length == 0) {
                  return false //console.log('it is an empty array = ' , 'no data loaded yet')
                } else {
                  console.log('Upd From isGoodData : Data is fine!',chk.length)
                  return true //chk.length //console.log('it is a full array','ready for showing!')
                }
              } else {
                return false //console.log('no errorcode prop object in response')
              }
            } else {
              console.log('goodDataChk:nothing in e response')
              return true //console.log('nothing in e response')
            }
      },
      zFetch : (task) => {
        const defaultApi = 'https://kuiliesonline.co.za/api/candid/candidates.php'
        const apiConfig = {method: 'POST',
            headers: {'Accept': 'application/json'
                     ,'Content-Type': 'application/json;charset=UTF-8'},
            body: JSON.stringify(task)
            }
        task.program = 'zmlF'
        task.status = 'trying'
        return fetch(task.api ? task.api : defaultApi, apiConfig)
     }

}