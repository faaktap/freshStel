import { zmlConfig } from '@/api/constants';
import { zmlFetch } from '@/api/zmlFetch';

export const latest = {
    someGlobals :  'hallo',
    l: (...args) => {   
       console.log(...args);   
    },
    contentData: (someText , pcallback, dataObj = {folderid: 585, grade:null, subjectid:null}) => {  
        let ts = {}
        ts.task = 'getLContentByFolderNo'
        ts.data = dataObj
        ts.api = zmlConfig.apiDKHS
        zmlFetch(ts, pcallback, errorLoading)
        return "done"
    },
    prevFolderData: (someText , pcallback, dataObj = {folderid: 585, grade:null, subjectid:null}) => {  
        let ts = {}
        ts.task = 'getLContentPrevFolder'
        ts.data = dataObj
        ts.api = zmlConfig.apiDKHS
        console.log('is this data good?', dataObj, pcallback)
        zmlFetch(ts, pcallback, errorLoading)
        return "done"
    },
  
}
function errorLoading (response) {
    console.log('We had an SH error loading your data!',response)
}