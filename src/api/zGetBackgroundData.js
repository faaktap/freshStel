import Vue from 'vue'
import { zmlConfig } from '@/api/constants';
import { getters } from "@/api/store";
import { zmlFetch } from '@/api/zmlFetch';
import { ls } from "@/api/localStorage.js"
import { zLoadCal } from "@/api/loadCalendar.js"

function l(...args) {
    Vue.prototype.$cs.l(...args)
}

export const zData = {
    someGlobals :  'hallo',
    loading : true,
    closeDate : null,
    loadSql(loading, sqlStatement, assignDataProc, api = zmlConfig.apiDKHS){
        loading = true
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
    wernerTest(r) {console.log('no func passed',r)},
    quickLoadInitialData: (whatever, afterwardsFunction) => {
        console.log('InitialData-Quickload----------------------------------------------------Start', whatever)
        getters.getState({ object: "gZml" }).subjects = ls.load('zmlSubjects')
        getters.getState({ object: "gZml" }).persMenemonic = ls.load('zmlPersM')
        getters.getState({ object: "gZml" }).functions = ls.load('zmlFuncs')
        getters.getState({ object: "gZml" }).place = ls.load('zmlLookupPlace')
        getters.getState({ object: "gZml" }).meritLevel = ls.load('zmlMeritLevel')
        getters.getState({ object: "gZml" }).classList = ls.load('zmlClassList')
        if (afterwardsFunction) afterwardsFunction()
    },
    initialData:  (whatever, afterwardsFunction) => {
        console.log('InitialData-------------------------------------------------------------------Start', whatever)
        if (whatever !== undefined) l(whatever)

        if (!getters.getState({ object: "gZml" }).subjects.length) {
            const ts = {}
            ts.api = zmlConfig.apiDKHS
            ts.task = 'loadlearn'
            ts.data = {}
            ts.data.language = getters.getState({ object: "gZml" }).login.lang
            ts.data.studentid = getters.getState({ object: "gZml" }).login.studentid
            ts.data.logintype = getters.getState({ object: "gZml" }).login.type

            zmlFetch(ts, finishedLoadingBasic, errorLoading)
        } else {
            if (afterwardsFunction) afterwardsFunction()
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

    // will be empty when not a student
    if (response.student.length) {
        getters.getState({ object: "gZml" }).login.grade = response.student[0].grade;
        getters.getState({ object: "gZml" }).login.gclass = response.student[0].gclass;
    }

    getters.getState({ object: "gZml" }).functions = response.functions;
    // add in a proper way - "other at the bottom
    let f1 = getters.getState({ object: "gZml" }).functions.filter(e => e.functionaccess == 'other')
    let f2 = getters.getState({ object: "gZml" }).functions.filter(e => e.functionaccess != 'other')
    getters.getState({ object: "gZml" }).functions.length = 0
    getters.getState({ object: "gZml" }).functions = f2.concat(f1);
    ls.save('zmlFuncs', getters.getState({ object: "gZml" }).functions)

    getters.getState({ object: "gZml" }).subjects = response.subjects;
    ls.save('zmlSubjects', response.subjects)

    getters.getState({ object: "gZml" }).persMenemonic = response.pers;
    ls.save('zmlPersM', response.pers)

    getters.getState({ object: "gZml" }).place = response.place;
    ls.save('zmlLookupPlace', response.place)

    ls.save('zmlMeritLevel', response.meritlevel)
    getters.getState({ object: "gZml" }).meritLevel = response.meritlevel;

    if (response.classlist.length > 1) {
        ls.save('zmlClassList', response.classlist)
        getters.getState({ object: "gZml" }).classList = response.classlist;
    }
    zData.wernerTest()
    console.log('InitialData-----------------------------------------------------------DONE LOADING BACKGROUND DATA')

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