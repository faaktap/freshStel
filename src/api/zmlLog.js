import { zmlConfig } from '@/api/constants';
// eslint-disable-next-line
function zmlLog(task,callback,errcallback) {
        task.program = 'zmlWas';
        task.status = 'trying';
        let apiConfig = {method: 'POST',
                  headers: {'Accept': 'application/json'
                         , 'Content-Type': 'application/json;charset=UTF-8'},
                  body: JSON.stringify(task)};
     
        fetch(zmlConfig.apiPath, apiConfig)
        .then(response => response.json())  
        .then(response => { 
           if (callback) callback(response,task);
           zmlConfig.cl('ZF: after log callback for ',task.task);
        })
        .catch((err)=>{
            zmlConfig.cl('ZF: Errorname : ',task.task , 'Error:' , err, task);
            if (errcallback) errcallback(err);
        });
    }
export {zmlLog};    