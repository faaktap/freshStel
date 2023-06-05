//import Vue from 'vue'
import { zmlConfig } from '@/api/constants';
import { mySet,getters } from "@/api/store";
import { zmlFetch } from '@/api/zmlFetch';
import { ls } from "@/api/localStorage.js"
import { zLoadCal } from "@/api/loadCalendar.js"
import { errorSnackbar, infoSnackbar } from "@/api/GlobalActions"

function l(...args) {
    console.log('zGB',...args)
}

export const zData = {
    someGlobals :  'hallo',
    loadingCache : false,
    loadingReal : false,
    closeDate : null,
    snack: (msg) => infoSnackbar(msg),
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
        infoSnackbar('sending email')
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
    wernerTest(r) {l('no func passed',r)},
    checkIfAllLoaded() {
        //infoSnackbar('Check System Properties 1')
        l('checkIfAllLoaded 1 :', getters.getState({ object: "gZml" }).subjects.length)
        l('checkIfAllLoaded 2 :', getters.getState({ object: "gZml" }).persMenemonic.length)
        l('checkIfAllLoaded 3 :', getters.getState({ object: "gZml" }).functions.length, getters.getState({ object: "gZml" }).functions)
        l('checkIfAllLoaded 4 :', getters.getState({ object: "gZml" }).place.length)
        l('checkIfAllLoaded 5 :', getters.getState({ object: "gZml" }).classList.length)
        l('checkIfAllLoaded 6 :', getters.getState({ object: "gZml" }).tickList.length)

        if (getters.getState({ object: "gZml" }).subjects.length
         && getters.getState({ object: "gZml" }).persMenemonic.length
         && getters.getState({ object: "gZml" }).functions.length
         && getters.getState({ object: "gZml" }).place.length
         && getters.getState({ object: "gZml" }).classList.length
         && getters.getState({ object: "gZml" }).students.length
         && getters.getState({ object: "gZml" }).tickList.length) {
            return true
         } else {
            return false
         }
    },
    quickLoadInitialData: (whatever, afterwardsFunction) => {
        //infoSnackbar('Check System Properties 2')
        if (zData.checkIfAllLoaded() == true) {
            l('InitialData-Quickload-------------------------------------------NotNeeded',zData.loadingCache, whatever)
            if (afterwardsFunction) afterwardsFunction()
            return
        }
        if (zData.loadingCache == true) {
            if (afterwardsFunction) afterwardsFunction()
            l('InitialData-Quickload-------------------------------------------Other One Busy')
            return
        }
        zData.loadingCache = true
        console.time('quickload')
        l('InitialData-Quickload----------------------------------------------------Start',zData.loadingCache, whatever)
        // getters.getState({ object: "gZml" }).subjects = ls.load('zmlSubjects')
        // getters.getState({ object: "gZml" }).persMenemonic = ls.load('zmlPersM')
        // getters.getState({ object: "gZml" }).functions = ls.load('zmlFuncs')
        // getters.getState({ object: "gZml" }).place = ls.load('zmlLookupPlace')
        // getters.getState({ object: "gZml" }).meritLevel = ls.load('zmlMeritLevel')
        // getters.getState({ object: "gZml" }).classList = ls.load('zmlClassList')
        // getters.getState({ object: "gZml" }).tickList = ls.load('zmlTickList')
        // getters.getState({ object: "gZml" }).students = ls.load('zmlStudents')

        mySet("gZml", "subjects" , ls.load('zmlSubjects'))
        mySet("gZml", "functions" , ls.load('zmlFuncs'))
        mySet("gZml", "persMenemonic", ls.load('zmlPersM'))
        mySet("gZml", "place" , ls.load('zmlLookupPlace'))
        //mySet("gZml", "meritLevel" , ls.load('zmlMeritLevel'))
        mySet("gZml", "classList" , ls.load('zmlClassList'))
        mySet("gZml", "tickList" , ls.load('zmlTickList'))
        mySet("gZml", "students" , ls.load('zmlStudents'))
        zData.loadingCache = false
        l('InitialData-Quickload------------------------------------------------End',zData.loadingCache, whatever)
        console.timeEnd('quickload')

        if (getters.getState({ object: "gZml" }).functions.length < 2
         || getters.getState({ object: "gZml" }).place < 2
         || getters.getState({ object: "gZml" }).persMenemonic < 2) {
          zData.initialData('cache is empty', afterwardsFunction)
        } else {
          if (afterwardsFunction) afterwardsFunction()
        }
    },
    initialData:  (whatever, afterwardsFunction) => {
        if (zData.loadingReal == true) {
            if (afterwardsFunction) afterwardsFunction()
            return
        }
        infoSnackbar('Refreshing System Properties')
        zData.loadingReal = true
        l('InitialData-------------------------------------------------------------------Start',zData.loadingReal, whatever)
        if (whatever !== undefined) l(whatever)

        if (!getters.getState({ object: "gZml" }).subjects.length) {
            console.time('bigload')
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
        infoSnackbar('Refreshing Calendar 1')
        //zLoadCal.calendarData('Load From zData')
        zLoadCal.calendarData(whatever || 'loading base')
        l('DONE Calling OUR TESTER')
    },
    baseCalendarData: (whatever) => {
        infoSnackbar('Refreshing Calendar 2')
        l('Calling OUR TESTER')
        //zLoadCal.calendarData('Load From zData')
        zLoadCal.getBaseCalendar(whatever || 'loading base')
        l('DONE Calling OUR TESTER')
    },
    randomChuckNorris: async () => {
        let response = await fetch('https://api.chucknorris.io/jokes/random')
        let data = await response.json()
        l('chuck data', data.value)
        return data
    }

}

//----------------------------------------------------------------
function finishedLoadingBasic (response) {
    zData.loadingReal = false
    l('InitialData-------------------------------------------------------------------End',zData.loadingReal)
    console.timeEnd('bigload')
    //getZml = getters.getState({ object: "gZml" })
    l('finishedLoadingBasic', response)
<<<<<<< HEAD:src/api/w/zGetBackgroundData.js
    getters.getState({ object: "gZml" }).subjects = response.subjects;

    getters.getState({ object: "gZml" }).functions = response.functions;
    // add in a proper way - "other at the bottom
    let f1 = getters.getState({ object: "gZml" }).functions.filter(e => e.functionaccess == 'other')
    let f2 = getters.getState({ object: "gZml" }).functions.filter(e => e.functionaccess != 'other')
    getters.getState({ object: "gZml" }).functions.length = 0
    getters.getState({ object: "gZml" }).functions = f2.concat(f1);
    ls.save('zmlFuncs', getters.getState({ object: "gZml" }).functions)
=======
>>>>>>> 121ea14dcce9c3f036da38d4cab97fb8f18a92e8:src/api/zGetBackgroundData.js

    // will be empty when not a student
    if (response.student.length) {
        getters.getState({ object: "gZml" }).login.grade = response.student[0].grade;
        getters.getState({ object: "gZml" }).login.gclass = response.student[0].gclass;
    }


    // add in a proper way - "other at the bottom
    let f1 = response.functions.filter(e => e.functionaccess == 'other')
    let f2 = response.functions.filter(e => e.functionaccess != 'other')
    let togetherFuncs = f2.concat(f1)
    mySet("gZml", "functions", togetherFuncs )
    ls.save('zmlFuncs', getters.getState({ object: "gZml" }).functions)
    l('functions saved on inital load:::', getters.getState({ object: "gZml" }).functions)

    mySet("gZml", "subjects", response.subjects );
    ls.save('zmlSubjects', response.subjects)

    //initSurname was added - to try and link up with CEMIS
    mySet('gZml','persMenemonic', response.pers)
    ls.save('zmlPersM', response.pers)
    //alert(JSON.stringify(response.pers))

    mySet('gZml',"place", response.place )
    ls.save('zmlLookupPlace', response.place)

    mySet('gZml',"students", response.students )
    ls.save('zmlStudents', response.students)

    // mySet('gZml',"meritLevel", meritlevel )
    // ls.save('zmlMeritLevel', response.meritlevel)

    if (response.classlist.length > 1) {
        mySet('gZml',"classList", response.classlist )
        ls.save('zmlClassList', response.classlist)
    }
    if (response.ticklist && response.ticklist.length > 0) {
        let tmpList = []
        response.ticklist.forEach(e => {
            const tickObj = JSON.parse(e.jdocstructure)
            tmpList.push(tickObj)
        });
        mySet('gZml',"tickList", tmpList )
        ls.save('zmlTickList', getters.getState({ object: "gZml" }).tickList)
    } else {
        alert('ticklist is empty!!!')
    }

    zData.wernerTest()
    l('InitialData-----------------------------------------------------------DONE LOADING BACKGROUND DATA')

}


//----------------------------------------------------------------
function errorLoading (response) {
    zData.loadingReal = false
    //alert('We had an error loading your data!')
    errorSnackbar('We had an error loading your data! - Possible Internet Disruption')
    l('We had an ERROR loading your data!',response)
}

//----------------------------------------------------------------
function finishedLoadingQuery (response) {
     zData.loading = false
     zData.closeDate = response[0].zmlvalue
}