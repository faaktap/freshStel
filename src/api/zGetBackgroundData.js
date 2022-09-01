import Vue from 'vue'
import { zmlConfig } from '@/api/constants';
import { getters } from "@/api/store";
import { zmlFetch } from '@/api/zmlFetch';
import { ls } from "@/api/localStorage.js"
import { zLoadCal } from "@/api/loadCalendar.js"
import { crudTask } from '../components/crud/crudTask';

function l(...args) {
    Vue.prototype.$cs.l(...args)
}

export const zData = {
    someGlobals :  'hallo',
    loading : false,
    closeDate : null,
    loadSql(loading, sqlStatement, assignDataProc, api = zmlConfig.apiDKHS){
        zData.loading = loading
        let ts = {}
        ts.task = 'PlainSql'
        ts.sql = sqlStatement
        ts.api = api || zmlConfig.apiDKHS
        zmlFetch(ts, assignDataProc, errorLoading)
    },
    getSurveyCloseDate(loading) {
        zData.loading = loading
        let ts = {}
        ts.task = 'PlainSql'
        ts.sql = "select * from dkhs_constant where zmltype = 'SURVEY' and zmlname = 'CLOSEDATE'"
        ts.api = zmlConfig.apiDKHS
        zmlFetch(ts, finishedLoadingQuery, errorLoading)
    },
    sendEmail(emailInfo) {
        let email = emailInfo
        email.method = "advemail"
        if (!email.subject) email.subject  = "A Subject"
        if (!email.email_to) email.email_to = "faaktap@gmail.com"
        if (!email.htmlmessage) email.htmlmessage = '<h1> Hallo World </h1>'
        if (!email.email_cc) email.email_cc = ''
        if (!email.email_replyto) email.email_replyto = ''
        if (!email.test) email.test = "no"
        if (!email.email_from) email.email_from = "admin@kuiliesonline.co.za"
        if (!email.trusted_user) email.trusted_user = "info@kuiliesonline.co.za"
        let apiConfig = { method: 'POST'
                        , headers: { 'Accept': 'application/json'
                                   , api: zmlConfig.apiDKHS
                                   , 'Content-Type': 'application/json;charset=UTF-8'}
                        , body: JSON.stringify(email)
                        }
        fetch(zmlConfig.emailPath, apiConfig);
    },
    //wernerTest() {},
    initialData:  (whatever, afterwardsFunction) => {
        if (whatever !== undefined)
            l(whatever)
        if (afterwardsFunction !== undefined) {
           crudTask.wernerTest = afterwardsFunction
        }

        if (!getters.getState({ object: "gZml" }).subjects.length) {
            const ts = {}
            ts.api = zmlConfig.apiDKHS
            ts.task = 'loadlearn'
            ts.data = {}
            ts.data.language = getters.getState({ object: "gZml" }).login.lang
            ts.data.studentid = getters.getState({ object: "gZml" }).login.studentid
            ts.data.logintype = getters.getState({ object: "gZml" }).login.type

            zmlFetch(ts, finishedLoadingBasic, errorLoading)
        }
        return "something";
    },
    calendarData: (whatever) => {
        l('Calling OUR TESTER')
        zLoadCal.calendarData(whatever)
        l('DONE Calling OUR TESTER')
    },
    randomChuckNorris: async () => {
        let response = await fetch('https://api.chucknorris.io/jokes/random')
        let data = await response.json()
        console.log('chuck data', data.value)
        return data
    }

}

//----------------------------------------------------------------
function finishedLoadingBasic (response) {
    //getZml = getters.getState({ object: "gZml" })
    l('finishedLoadingBasic', response)
    getters.getState({ object: "gZml" }).subjects = response.subjects;
    // getters.getState({ object: "gZml" }).folders = response.folders;
    getters.getState({ object: "gZml" }).functions = response.functions;

    getters.getState({ object: "gZml" }).persMenemonic = response.pers;
    ls.save('zmlPersM', response.pers)

    if (response.place.length > 5) {
      getters.getState({ object: "gZml" }).place = response.place;
      ls.save('zmlPlace', response.place)
    }

    // will be empty when not a student
    if (response.student.length) {
      getters.getState({ object: "gZml" }).login.grade = response.student[0].grade;
      getters.getState({ object: "gZml" }).login.gclass = response.student[0].gclass;
    }
    if (response.meritlevel.length > 5) {
        ls.save('zmlMeritLevel', response.meritlevel)
        getters.getState({ object: "gZml" }).meritLevel = response.meritlevel;
    } else {
        l('finishedLoadingBasic:d_MeritLevel is empty!')
    }
    if (crudTask.wernerTest !== undefined) crudTask.wernerTest()
    console.log('....................DONE LOADING BACKGROUND DATA')

}


//----------------------------------------------------------------
function errorLoading (response) {
    zData.loading = false
    //alert('We had an error loading your data!')
    l('We had an ERROR loading your data!',response)
}

//----------------------------------------------------------------
function finishedLoadingQuery (response) {
     zData.loading = false
     zData.closeDate = response[0].zmlvalue
}