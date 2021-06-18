import { zmlConfig } from '@/api/constants';
import { zmlFetch } from '@/api/zmlFetch';

//import { sh } from "@/views/sh.js"

export const sh = {
    someGlobals :  'hallo',
    l: (...args) => {   
       zmlConfig.l(...args);   
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
        zmlFetch(ts, pcallback, errorLoading)
        return "done"
    },
    findFolder: (someText , pcallback, dataObj) => {  
        let ts = {}
        ts.task = 'getLContentCurrentFolder' //same as in latest (finf folder closest to contentid)
        ts.data = dataObj
        ts.api = zmlConfig.apiDKHS
        zmlFetch(ts, pcallback, errorLoading)
        return "done"
    },
  
}
function errorLoading (response) {
    zmlConfig.l('We had an SH error loading your data!',response)
}