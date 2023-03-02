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
    ZF: (storage, pcallback, pErrorcallback) => {
       if  (storage.workDone == 'BUSY')  alert('We should wait, since we are busy with a fetch')
       storage.workDone = BUSY
       storage.progress = true
       let taskSql = storage.sql.find(e => e.action == storage.action)
       taskSql.task = 'PlainSql'
       taskSql.action = storage.action

       console.log('ZF is doing ', storage, taskSql)
       if (taskSql.action == 'update' || taskSql.action == 'insert') {
        taskSql.data = storage.data
        taskSql.data.bind = storage.data.bind
       }

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
        if ('errorcode' in rjson && rjson.errorcode != 0) {
          console.log('we have errorcode on action:', storage.action, rjson)
          storage.feedback = rjson
          if (pErrorcallback) pErrorcallback(rjson)
          return
        }
        if (storage.action == 'refresh') {
          storage.response = rjson
        } else {
          storage.feedback = rjson  //save it in feedback, since it was update or insert
        }
        console.log('passing data to storage', rjson)
        if (pcallback) pcallback(rjson)
        return
       })
       .catch(err => {
          //we have a problem, load our error object and report back
          storage.feedback = {error: 'Failed to Fetch', errorcode: '9999', exception:"caught exception", result:err}
          storage.workDone = DONE
          storage.progress = false
          if (pErrorcallback) pErrorcallback(storage.response)
       })
    },
    showDBError : (chk) => {
        if (chk) {
              if ('errorcode' in chk) {
                if (chk.errorcode != '0') {
                  return chk.errorcode +' '+ chk.error
                } else {
                  return 'error is Zero'
                }
              } else if ('length' in chk) {
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
              if ('errorcode' in chk) {
                if (chk.errorcode > 0) {
                  return false //console.log('we have an error property loaded width an error',chk.errorcode)
                } else {
                  return true //console.log('we have an error property loaded - no error',chk)
                }
              } else if ('length' in chk) {
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
        const defaultApi = 'https://kuiliesonline.co.za/api/candid/candidates.php/venue.php'
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