import { zmlConfig } from '@/api/constants';

/*-----------------------------
zmlFetch - to make my code more readable.
You can pass only first param if there are no callback
self can be used with let self=this, and then you pass all you data here.
will make this function a bit bloated.
See https://developers.google.com/web/ilt/pwa/working-with-the-fetch-api if you lose track.
-----------------------------*/

// eslint-disable-next-line
function zmlFetch(task,callback,errcallback) {
        task.program = 'zmlShop'
        task.status = 'trying'
        let apiConfig = {method: 'POST',
                  headers: {'Accept': 'application/json'
                         , 'Content-Type': 'application/json;charset=UTF-8'},
                  body: JSON.stringify(task)}
        zmlConfig.cl('FETCH-------------- : ', task.task)
        fetch(task.api ? task.api : zmlConfig.apiPath, apiConfig)
        .then(response => {
            if (!response.ok) {
                throw Error(response.statusText)
            }
            return response.json()
        })  
        .then(responseAsJson => { 
           if (callback) callback(responseAsJson,task)
           console.log('ZF: after fetch callback for ',task.task)
        })
        .catch(err => {
            if ( typeof errcallback === 'undefined') {
                console.log('we have no error callback on this call', err)
            } else {
                errcallback(err)                
            }
            console.log('ZF: Errorname : ',task.task , 'Error:' , err);
        });
    }

export {zmlFetch};    