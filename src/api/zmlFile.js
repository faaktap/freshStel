
/*-----------------------------
zmlFile - to get a file from server
-----------------------------*/

export function zmlFile(task,callback,errcallback, extraParameter) {
        task.program = 'zmlShop'
        task.status = 'trying'
        let apiConfig = {method: 'POST',
                  headers: {'Accept': 'application/json'
                         , 'Content-Type': 'application/json;charset=UTF-8'},
                  body: JSON.stringify(task)}
        fetch(task.api ? task.api : 'https://kuiliesonline.co.za/api/file/getFile.php', apiConfig)
        .then(response => {
            if (!response.ok) {
                console.log('FILE--------------: thow response not ok error ',task.task,response.statusText)
                throw Error(response.statusText)
            }
            return response.json()
        })
        .then(responseAsJson => {
           console.log('FILE--------------: after fetch callback for ',task.task)
           if (callback) callback(responseAsJson,task,extraParameter ?? 'none')
        })
        .catch(err => {
            if ( typeof errcallback === 'undefined') {
                //('we have no error callback on this call', err, task.task)
                console.log('FILE--------------catch with no callback',task.task,err)
            } else {
                console.log('FILEH--------------catch with errcallback',task.task,err)
                errcallback(err)
            }
        });
    }


//export {zmlFile};