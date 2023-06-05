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
       storage.workDone = BUSY
       storage.progress = true
       let p = zmlF.zFetch({task:'PlainSql', sql:storage.sql})
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
        storage.response = rjson
        if ('errorcode' in rjson && rjson.errorcode != 0) {
           console.log('we have errorcode on retrieve', rjson)
           if (pErrorcallback) pErrorcallback(rjson)
           return
        } else {
          console.log('passing data to storage', rjson)
          if (pcallback) pcallback(rjson)
          return
        }
       })
       .catch(err => {
          //we have a problem, load our error object and report back
          storage.response = {error: 'Failed to Fetch', errorcode: '9999', exception:"caught exception", result:err}
          storage.workDone = DONE
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
                  return chk.length //console.log('it is a full array','ready for showing!')
                }
              } else {
                return false //console.log('no errorcode prop object in response')
              }
            } else {
              return false //console.log('nothing in e response')
            }
      },
      zFetch : (task) => {
        const defaultApi = 'https://actlocal.co.za/api/venue/venue.php'
        const apiConfig = {method: 'POST',
            headers: {'Accept': 'application/json'
                     ,'Content-Type': 'application/json;charset=UTF-8'},
            body: JSON.stringify(task)
            }
        task.program = 'zmlVenue'
        task.status = 'trying'
        return fetch(task.api ? task.api : defaultApi, apiConfig)
     }
}


/*
ts.fields = [{dataname: 'title',desc:'', length: 100,align: 'center', hide: false, data: record.title}
            ,{dataname: 'description', desc:'', length: 65, align: 'center', hide: false, data: record.description}
            ,{dataname: 'id', desc:'', length: 0,align: 'center', hide: true, data: record.id}
            ,{dataname: 'back', desc:'', length: 0,align: 'center', hide: true, data: record.back}
            ,{dataname: 'forward', desc:'', length: 0,align: 'center', hide: true, data: record.forward}
            ,{dataname: 'meritid', desc:'', length: 0,align: 'center', hide: true, data: record.meritid}
            ]
ts.sql = [{update: `update dkhs_meritlevel set title = :title, description = :description, meritid = :meritid, userid = :userid where id = :id`}
         ,{select: `select * from dkhs_meritlevel`}
         ,{insert: `insert into dkhs_meritlevel values(null, :title, :description, :meritid, :userid)`}
         ]

ts.data = {title: record.description
          ,description: record.description
          ,id : record.id
          ,back : record.back
          ,forward : record.forward
          ,meritid : record.meritid
               }
ts.data.bind = {
          id: record.id ? record.id : null
         ,title: record.title ? record.title.trim() : null
         ,description: record.description ? record.description.trim() : null
         ,meritid: record.meritid
         ,userid: 1
         }
ts.sql = `update dkhs_meritlevel\
             set title = :title\
               , description = :description
               , meritid = :meritid\
               , userid = :userid where id = :id`         
*/         