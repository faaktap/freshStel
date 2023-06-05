import { zmlConfig } from '@/api/constants';
import { getters } from "@/api/store";
import { zFetch } from '@/api/zmlFetch';
// eslint-disable-next-line
function zmlLog(user, pagename,logobj, callback,errcallback) {
    zmlConfig.cl('incoming task for LOG = ' , pagename)
        let task = {}
        task.data =  {}
        task.data.logdata = logobj || 'nodata'
        task.data.pagename = pagename || 'nopage'
        task.data.user = user || getters.getState({ object: "gZml" }).login.username
        task.task = 'dolog'
        task.status = 'trying'
        task.api =  zmlConfig. apiDKHS
        zFetch(task)
        .then((r) => {
            if (r.status >= 200 && r.status <= 299) {return r.json() } else {throw Error(r.statusText)}
        })
        .then(response => {
           if (callback) callback(response,task);
           zmlConfig.cl('ZF: after log callback for ',task.task);
        })
        .catch((err)=>{
            zmlConfig.cl('ZF: Errorname : ',task.task , 'Error:' , err, task);
            if (errcallback) errcallback(err);
            alert('We have lost our way....Data or Connection problem.')
        });
    }
export {zmlLog};