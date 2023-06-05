import { zmlConfig } from '@/api/constants.js';

function cl(...args) {
        console.log('uploads.js:' ,...args);
}


export const uploads = {
    huntForFiles(inThisObj, addHere) {
      uploads.fieldnames = []
      for (const [key, value] of Object.entries(inThisObj)) {
        if (key.toUpperCase().indexOf('FILE') > -1) {
            if (typeof(value) == 'object' && Array.isArray(value) == true) {
               cl('aaaaaaaaaaaaaaaaaa?',key, value, Array.isArray(value))
               let x = Array.from(value)
               if (x.length == 0) x.push(value)
               addHere = addHere.concat(x)
               uploads.fieldnames.push(key)
            }
        }
      }
      return addHere
    },
    files:[],
    fieldnames:[],
    async addSingleFile(e) {
        if (!e) return
        let cheatArray = []
        cheatArray.push(e)
        await uploads.makeAWait(700, uploads.addToQueue, cheatArray, uploads.files)
    },
    makeAWait (milisecs,nextProc,parm1, parm2 ,parm3) {
        let openWin = new Promise((resolve) => {
          let wagbietjie = setTimeout(() => {
            cl('makewait timeout',openWin)
            clearTimeout(wagbietjie)
            resolve( nextProc(parm1,parm2, parm3 )) //nextProc is add2Queue
            if (parm3 ) {
               cl('Parm3 after tm',parm3)
               parm3=false
            }
          }, milisecs)
        })
        cl('makewait end',openWin)
    },
    addToQueue (receivedFilesReal,fileList) {
        cl('addToQueue',receivedFilesReal, fileList)
        const receivedFiles = [...receivedFilesReal]
        if (receivedFiles.length == 0) {
          cl('empty - return 100')
          return 100
        }
        let problemFiles = 0
        receivedFiles.forEach(file => {
          cl('forEachFile-checkProblems', file)
          let ignore = false
          if (!file.type && file.size%4096 == 0) {
            // The file is a folder
            cl('file is a folder')
            ignore = true
          }
          if (!ignore && file.name == undefined) {
            ignore = true
            cl('file.name is undef')
            //alert('file.name is undefined ', JSON.stringify(file))
          }
          if (!ignore && file.name.indexOf('.') == -1) {
            cl('file.name has no extension')
            ignore = true
          }
          if (!ignore) {
            file.ext = ''
            file.ext = file.name.split('.').pop().toLowerCase()
            //file.realname = file.name
            fileList.push(file);
            cl('we PUSHED ',file)
          } else {
            cl('we ignored ',file)
            problemFiles += 1
          }
        })
        cl('addToQueue : ProblemFiles : ' , problemFiles, 'in list:', fileList.length)
        return problemFiles
    },
    uploadStart(callbackGood) {
      cl('uploadStart files to upload on start : ', uploads.files)
        uploads.files.forEach(file => {
          cl('uploadStart each file ')
          let fr = new FileReader()
          fr.onload = function(response) {
           uploads.uploadOne(response,file,callbackGood)
          };
          fr.onerror = function(response) {
            cl('res - Some Error!' ,response);
            //alert('file cannot be loaded ' + JSON.stringify(response))
          };
          fr.readAsDataURL(file);
        });
      },
      uploadOne(fileData,fdet,callbackGood) {
        cl('upo fileData, fdet : ', fileData, fdet)
        fileData.task = 'upload';
        if (fdet.extrapath) {
            fileData.extrapath = '/' + fdet.extrapath + '/'
        } else {
            fileData.extrapath = zmlConfig.filesRootFolder + fdet.id || 9999  + '/'
        }
        fileData.fieldname = fdet.fieldname
        fileData.key = ''
        if (fdet.key != 'undefined') fileData.key = fdet.key || ''
        fileData.id = fdet.id || ''
        //We  lost our name along the way...
        fileData.name = fdet.realname
        fileData.realname = fileData.key + fdet.realname

        fileData.user = uploads.user      // You need to populate user from your program

        fileData.prebase64 = fileData.target.result.split(',')[0];
        fileData.base64 = fileData.target.result.split(',')[1];
        fileData.size = fileData.total
        fileData.api = zmlConfig.apiUploadCR;
        //cl('upo -send a file', fileData)
        uploads.ZFile(fileData, callbackGood || uploads.doneWithUpload, uploads.errorWithUpload)
     },
     ZFile(task, pcallback, pErrorcallback) {
        cl('ZFile is doing file, taskSql : ', task)
        const defaultApi = zmlConfig.apiUploadCR
        const apiConfig = {
            method: 'POST',
            headers: {'Accept': 'application/json','Content-Type': 'application/json;charset=UTF-8'},
            body: JSON.stringify(task)
            }
        task.program = 'zmlF'
        task.status = 'trying'
        let p = fetch(task.api ? task.api : defaultApi, apiConfig)

      p.then((resp) => {
       //cl('ZFile RAW FETCH RETURN 1',resp)
       if (resp.status >= 200 && resp.status <= 299) {
         return resp.json();
       } else {
         throw Error(resp.statusText)
       }
      })
      .then(rjson => {
       if (rjson.errorcode != undefined && rjson.errorcode != 0) {
         cl('ZFile  : We have errorcode on ', task.action, rjson.errorcode)
         task.feedback = "Error:" + rjson.errorcode   // rjson
         if (pErrorcallback) pErrorcallback(rjson)
         return
       }
       cl('ZFile: Passing data to Callback if it exist', pcallback)
       if (pcallback) pcallback(rjson)
       return
      })
      .catch(err => {
         //we have a problem, load our error object and report back
         cl('ZFile: We caught an throwed error, see feedback', err)
         task.feedback = {error: 'Failed to Fetch', errorcode: '9999', exception:"caught exception", result:err}
         if (pErrorcallback) pErrorcallback(err)
      })

     },
     doneWithUpload(resp) {
        cl('dwu - done', resp)
        if (resp.result == 'ok') {
           let idx = uploads.files.findIndex(e => e.realname == resp.filename)
           if (idx > -1) uploads.files.splice(idx,1)
           cl('dwu donewithupload, idx after splice', idx, uploads.files.length)
        } else {
          cl('dwu, resp nor ok', resp.result)
        }
     },
     errorWithUpload(err) {
        cl('ewu - error', err)
     }

}