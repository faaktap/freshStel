import { zmlConfig } from '@/api/constants';
import { zmlFetch } from '@/api/zmlFetch';
import { errorSnackbar } from '@/api/GlobalActions';


export const g10 = {
    getAllQuiz: (key, pCallback) => {
        let ts = {}
        ts.task = 'getAllQuiz'
        ts.data = {quizkey : key}
        ts.api = zmlConfig.apiDKHS
        zmlFetch(ts, pCallback, errorFetch)
    },
}

/*
function doneFetch (response) {
    console.log('doneLoading:', response)
    if ( response.error ) {
        errorSnackbar(response.error)
    } else {
        infoSnackbar('We saved your data, will email it as well')
    }
}
*/
function errorFetch (response) {
    console.log('error:', response)
    errorSnackbar('We had an error retrieving your data!' + response)
}