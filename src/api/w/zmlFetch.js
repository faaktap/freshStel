import { zmlConfig } from '@/api/constants';

/*-----------------------------
zmlFetch - to make my code more readable.
You can pass only first param if there are no callback
self can be used with let self=this, and then you pass all you data here.
will make this function a bit bloated.
See https://developers.google.com/web/ilt/pwa/working-with-the-fetch-api if you lose track.
-----------------------------*/

// eslint-disable-next-line
function zmlFetch(task,callback,errcallback, extraParameter) {
        task.program = 'zmlShop'
        task.status = 'trying'
        let apiConfig = {method: 'POST',
                  headers: {'Accept': 'application/json'
                         , 'Content-Type': 'application/json;charset=UTF-8'},
                  body: JSON.stringify(task)}
        //zmlConfig.cl('FETCH-------------- : ', task.task, task)
        //console.log('FETCH-------------- : ', task.task, task)

        fetch(task.api ? task.api : zmlConfig.apiPath, apiConfig)
        .then(response => {
            if (response.ok && (response.status >= 200 && response.status <= 299)) {
              return response.json();
            } else {
                zmlConfig.cl('FETCH--------------: throw response not ok error ',task.task,response.statusText)
                throw Error(response.statusText)
            }
        })
        .then(responseAsJson => {
           //here we can decompress if return is gzipped, or we can do local callback to save globals?
           zmlConfig.cl('FETCH--------------: after fetch callback for ',task.task)
           if (callback) callback(responseAsJson,task,extraParameter ?? 'none')
        })
        .catch(err => {
            if ( typeof errcallback === 'undefined') {
                //('we have no error callback on this call', err, task.task)
                zmlConfig.cl('FETCH--------------catch with no callback',task.task,err)
            } else {
                zmlConfig.cl('FETCH--------------catch with errcallback',task.task,err)
                errcallback(err)
            }
            //('ZF: Errorname : ',task.task , 'Error:' , err);
        });
    }

//https://www.codepanion.com/posts/2020-02-02-how-to-use-async-await-promises-with-fetch-in-vue-js-vuex/
// eslint-disable-next-line
/*
async function http(url,
    method = 'GET',
    data,
) {
    try {
      const response = await fetch(url, {
        method,
        data
      });

      return await response.json();
    } catch (error) {
      throw error;
    }
}
*/

//Return a promise - zFetch
function zFetch(task) {
    zmlConfig.cl('Z:FETCH-1--------------',task.task)
    task.program = 'zmlShop'
    task.status = 'trying'
    const apiConfig = {method: 'POST',
        headers: {'Accept': 'application/json'
                 ,'Content-Type': 'application/json;charset=UTF-8'},
        body: JSON.stringify(task)
        }
    return fetch(task.api ? task.api : zmlConfig.apiDKHS, apiConfig)
 }


//Return data - still have trouble with this
//https://kentcdodds.com/blog/replace-axios-with-a-simple-custom-fetch-wrapper
function pFetch(task) {
    task.program = 'zmlShop'
    task.status = 'trying'

    // if we are calling with empty task, presume we are testing online..
    if (!task.api) task.api = 'https://kuiliesonline.co.za/api/online.php'
    if (!task.task) task.task = 'online'

    const apiConfig = {method: 'POST',
        headers: {'Accept': 'application/json'
                 ,'Content-Type': 'application/json;charset=UTF-8'},
        body: JSON.stringify(task)
        }
        fetch(task.api ? task.api : zmlConfig.apiPath, apiConfig)
        .then(async response => {
            if (response.ok) {
              return await response.json()
            } else {
              const errorMessage = await response.text()
              return Promise.reject(new Error(errorMessage))
            }
          })
}






export {pFetch, zFetch, zmlFetch};
