import { zmlConfig } from '@/stel/constants';
import { zmlFetch } from '@/stel/zmlFetch';
import { infoSnackbar, errorSnackbar } from '@/stel/GlobalActions';
import { getters } from "@/stel/store";

const minLen = l => v => (v && v.length >= l) || `min. ${l} Characters`
const maxLen = l => v => (v && v.length <= l) || `max. ${l} Characters`
const required = ( msg ) => v => !!v || msg
const requiredArray = ( msg ) => v => (Array.isArray(v) && v.length>1) || msg
const rules = {
  requiredEmail: required('E-mail is required'),
  requiredSel: required('Selection is required'),
  requiredSelMult: requiredArray('2 Selections are required'),
  max12: maxLen(12),
  min6: minLen(6),
  validEmail: v => /.+@.+\..+/.test(v) || 'E-mail must be valid'
}


export const survey = {
    quickUpdate: (ts, pcallback, pErrorcallback)=>  {
        ts.api = zmlConfig.apiDKHS
        zmlFetch(ts, pcallback, pErrorcallback)
        return "done"
    },
    saveData: (id,key,modeldata,pcallback=doneFetch,pErrorcallback=errorFetch) => {
        let ts = {}
        ts.task = 'saveQuiz'
        ts.data = {
            surveyid : id
           ,ownerid : getters.getState({ object: "gZml" }).login.ownerid
           ,quizkey : key
           ,quizdata : modeldata
        }
        ts.api = zmlConfig.apiDKHS
        zmlFetch(ts, pcallback, pErrorcallback)
        zmlFetch(ts, pcallback, pErrorcallback)
        return "done"
    },
    getQuiz: (key, pCallback) => {
        let ts = {}
        ts.task = 'getQuiz'
        ts.data = {quizkey : key}
        ts.api = zmlConfig.apiDKHS
        zmlFetch(ts, pCallback)
    },
    lookupName: (key, pCallback) => {
        let ts = {}
        ts.task = 'getStudents'
        ts.data = key
        ts.api = zmlConfig.apiDKHS
        zmlFetch(ts, pCallback)
    },
    getHeader(Answer) {
      return `<h3> Venue Accomodation ${Answer.coordinatorname}, ${Answer.coordinatorno} </h3>
        <div>
        <table width=90% style="border: 1px solid green;">\
        <tr><td>function date</td><td>${Answer.functiondate}</td></tr>\
<tr><td>function time</td><td>${Answer.functiontime}</td></tr>\
<tr><td>coordinator name</td><td>${Answer.coordinatorname}</td></tr>
<tr><td>coordinator email</td><td>${Answer.coordinatoremail}</td></tr>
<tr><td>coordinator no</td><td>${Answer.coordinatorno}</td></tr>
<tr><td><colspan=2> <hr>Contact </td></tr>
<tr><td>contact name</td><td>${Answer.contactname}</td></tr>
<tr><td>contact emali</td><td>${Answer.contactemail}</td></tr>
<tr><td>contact no</td><td>${Answer.contactno}</td></tr>
<tr><td><colspan=2> <hr>Setup </td></tr>
<tr><td>setup date </td><td>${Answer.setupdate }</td></tr>
<tr><td>setup start time</td><td>${Answer.setupstarttime}</td></tr>
<tr><td>setup end time</td><td>${Answer.setupendtime}</td></tr>
<tr><td><colspan=2> <hr> </td></tr>
<tr><td>guest arrival time</td><td>${Answer.guestarrivaltime}</td></tr>
<tr><td>function start time</td><td>${Answer.functionstarttime}</td></tr>
<tr><td>function end time</td><td>${Answer.functionendtime}</td></tr>
<tr><td>function departure time</td><td>${Answer.functiondeparturetime}</td></tr>
<tr><td><colspan=2> <hr> </td></tr>
<tr><td>cleanup date</td><td>${Answer.cleanupdate}</td></tr>
<tr><td>cleanup start time</td><td>${Answer.cleanupstarttime}</td></tr>
<tr><td>cleaunup end time</td><td>${Answer.cleaunupendtime}</td></tr>
<tr><td><colspan=2> <hr> </td></tr>
<tr><td>event type</td><td>${Answer.eventtype}</td></tr>
<tr><td>chairs needed</td><td>${Answer.chairs}</td></tr>
<tr><td>tables rectangular</td><td>${Answer.tablerect}</td></tr>
<tr><td>tables round</td><td>${Answer.tableround}</td></tr>
<tr><td>table linen round black</td><td>${Answer.tablelinenroundblack}</td></tr>
<tr><td>table linen round white</td><td>${Answer.tablelinenroundwhite}</td></tr>
<tr><td>table linen rectangular black</td><td>${Answer.tablelinenrectangularblack}</td></tr>
<tr><td>table linen rectangular white</td><td>${Answer.tablelinenrectangularwhite}</td></tr>
<tr><td><colspan=2> <hr> </td></tr>
<tr><td>podium needed</td><td>${Answer.podium}</td></tr>
<tr><td>registration table</td><td>${Answer.registrationtable}</td></tr>
<tr><td>registration tables</td><td>${Answer.registrationtables}</td></tr>
<tr><td>chairs per registration table</td><td>${Answer.chairsperregistrationtable}</td></tr>
<tr><td><colspan=2> <hr> </td></tr>
<tr><td>glasses champagne</td><td>${Answer.glasseschampagne}</td></tr>
<tr><td>glasses wine</td><td>${Answer.glasseswine}</td></tr>
<tr><td>glasses cooldrinktall</td><td>${Answer.glassescooldrinktall}</td></tr>
<tr><td>glasses cooldrinktumble</td><td>${Answer.glassescooldrinktumble}</td></tr>
<tr><td><colspan=2> <hr> </td></tr>
<tr><td>crock cup</td><td>${Answer.crockcup}</td></tr>
<tr><td>crock sources</td><td>${Answer.crocksources}</td></tr>
<tr><td>crock tea pot</td><td>${Answer.crockteapot}</td></tr>
<tr><td>crock coffee pot</td><td>${Answer.crockcoffeepot}</td></tr>
<tr><td>crock sugar bowl</td><td>${Answer.crocksugarbowl}</td></tr>
<tr><td>crock milk jug</td><td>${Answer.crockmilkjug}</td></tr>
<tr><td>crock water jug</td><td>${Answer.crockwaterjug}</td></tr>
<tr><td>crock ice bucket</td><td>${Answer.crockicebucket}</td></tr>
<tr><td>crock small plate</td><td>${Answer.crocksmallplate}</td></tr>
<tr><td>crock large plate</td><td>${Answer.crocklargeplate}</td></tr>
<tr><td>crock serving plate</td><td>${Answer.crockservingplate}</td></tr>
<tr><td><colspan=2> <hr>Cutlery </td></tr>
<tr><td>cutlery knives</td><td>${Answer.cutleryknives}</td></tr>
<tr><td>cutlery forks</td><td>${Answer.cutleryforks}</td></tr>
<tr><td>cutlery spoons</td><td>${Answer.cutleryspoons}</td></tr>
<tr><td>cutlery teaspoons</td><td>${Answer.cutleryteaspoons}</td></tr>
<tr><td>cutlery servingspoons</td><td>${Answer.cutleryservingspoons}</td></tr>
<tr><td>cutlery icetongs</td><td>${Answer.cutleryicetongs}</td></tr>
<tr><td><colspan=2> <hr>Other Items </td></tr>
<tr><td>items urn</td><td>${Answer.oitemsurn}</td></tr>
<tr><td>items hot tray</td><td>${Answer.oitemshottray}</td></tr>
<tr><td>items multiplugs</td><td>${Answer.oitemsmplugs}</td></tr>
<tr><td>items extension lead</td><td>${Answer.oitemsextlead}</td></tr>
<tr><td>layout type</td><td>${Answer.layouttype}</td></tr>
<tr><td><colspan=2> <hr>Audio, light, White Screen </td></tr>
<tr><td>light requirements</td><td>${Answer.lightreq}</td></tr>
<tr><td>audio requirements</td><td>${Answer.audioreq}</td></tr>
<tr><td>white screen</td><td>${Answer.whitescreen}</td></tr>
<tr><td><colspan=2> <hr>Parking </td></tr>
<tr><td>parking requests</td><td>${Answer.parkingreq}</td></tr>
<tr><td>parking1</td><td>${Answer.parking1}</td></tr>
<tr><td>parking2</td><td>${Answer.parking2}</td></tr>
<tr><td>parking3 </td><td>${Answer.parking3 }</td></tr>
<tr><td>parking4</td><td>${Answer.parking4}</td></tr>
<tr><td><colspan=2> <hr>Security </td></tr>
<tr><td>security start time</td><td>${Answer.securitystarttime}</td></tr>
<tr><td>security end time</td><td>${Answer.securityendtime}</td></tr>
<tr><td><colspan=2> <hr>PERSON RESPONSIBLE FOR SETTING OF ALARM </td></tr>
<tr><td>alarmname</td><td>${Answer.alarmname}</td></tr>
<tr><td>alarmemail</td><td>${Answer.alarmemail}</td></tr>
<tr><td>alarmno</td><td>${Answer.alarmno}</td></tr>
<tr><td><colspan=2> <hr>PERSON RESPONSIBLE FOR UNLOCKING VENUE </td></tr>
<tr><td>unlockvenuename</td><td>${Answer.unlockvenuename}</td></tr>
<tr><td>unlockvenueemail</td><td>${Answer.unlockvenueemail}</td></tr>
<tr><td>unlockvenueno</td><td>${Answer.unlockvenueno}</td></tr>
<tr><td><colspan=2> <hr>PERSON RESPONSIBLE FOR LOCKING OF VENUE </td></tr>
<tr><td>lockvenuename</td><td>${Answer.lockvenuename}</td></tr>
<tr><td>lockvenueemail</td><td>${Answer.lockvenueemail}</td></tr>
<tr><td>lockvenueno</td><td>${Answer.lockvenueno}</td></tr>
<tr><td>othervendorname 1</td><td>${Answer.othervendorname1}</td></tr>
<tr><td>othervendoremail 1</td><td>${Answer.othervendoremail1}</td></tr>
<tr><td>othervendorno 1</td><td>${Answer.othervendorno1}</td></tr>
<tr><td>othervendorname 2</td><td>${Answer.othervendorname2}</td></tr>
<tr><td>othervendoremail 2</td><td>${Answer.othervendoremail2}</td></tr>
<tr><td>othervendorno 2</td><td>${Answer.othervendorno2}</td></tr>
<tr><td>othervendorname 3</td><td>${Answer.othervendorname3}</td></tr>
<tr><td>othervendoremail 3</td><td>${Answer.othervendoremail3}</td></tr>
<tr><td>othervendorno 3</td><td>${Answer.othervendorno3}</td></tr>
`
   },
   venueSchema: {
    top: { type:'wrap'
         , label:'top'
         , col : { cols: 12}
         , ripple:false
         , color:"white darken-1"
         , class:'title pa-2 rounded elevation-1 col-12',
     schema:{
         group1:{
             type: "wrap", label: "Group 1", color:"white darken-1",
             title: "Date & Time of Event", col: { cols : 12},
             class: "title pa-2 rounded elevation-4",
             schema:{
         functiondate: {  "type": "text"
           , "ext": "date"
           , label: `Function Date *`
           , prependInnerIcon:"mdi-calendar-today"
           , solo:true
           , rules: [ required('Please enter a date') ]
           , xcol: { cols : 12, md: 6 }
           , class:'title pa-2 rounded col-md-6'
           , tooltip: 'The date when the function will happen'
           , hint: 'Please enter a date!'},
         functiontime: {  "type": "text"
           , "ext": "time"
           , label: `Function Time`
           , prependInnerIcon:"mdi-timeline-clock"
           , solo:true
           , rules: [ required('Please enter estimate time') ]
           , xcol: { cols : 12, md: 6 }
           , class:'title pa-2 rounded col-md-6'
           , tooltip: 'The time when the function will happen'
           , hint: 'Please enter a time!'},
         }},
         group2:{
             label: "Group 2",
             type: "wrap",
             title:"Coordinator Detail",
             col: { cols : 12},
             class: "title pa-2 rounded elevation-4",
             ripple:false,
             schema:{
        coordinatorname: { type: 'text'
           , label: `Coordinator name *`
           , prependInnerIcon:"mdi-account-question-outline"
           , solo:true
           , rules: [ required('Please enter your name and surname') ]
           , col: { cols : 12, md: 4 }
           , class:'title pa-2 rounded col-md-4'
           , tooltip: 'Your name'
           , hint: 'Please enter your first name and surname'},
        coordinatoremail: { type: 'email'
           , label: 'Your Email *'
           , rules: [rules.requiredEmail, rules.validEmail]
           , prependInnerIcon:"mdi-email"
           , solo:true
           , col: { cols: 12, md: 4 }
           , class:'pa-2 rounded col-md-4'
           , tooltip: "Please enter a valid email address."
           , hint:'email needed here'},
        coordinatorno: { type: 'tel'
           , label: 'Coordinator Number'
           , prependInnerIcon:"mdi-phone"
           , solo:true
           , col: { cols: 12, md: 4 }
           , class:'xtitle pa-2 rounded col-md-4'
           , ripple:{ center:true, class: 'item blue--text' }
           , tooltip: "Please enter your contact number."
           , hint:'Coordinator number'},
         }},
         group3:{
             type: "wrap",
             title:"Contact Detail",
             label: "Group 3",
             ripple:false,
             col: { cols : 12},
             class: "title pa-2 rounded elevation-4",
             schema:{
        contactname: { type: 'text'
           , label: `Kontaknaam / Contactname`
           , prependInnerIcon:"mdi-account-question-outline"
           , solo:true
           , rules: [ required(`Please enter preferred contact's name`) ]
           , col: { cols : 12, md: 4 }
           , class:'title pa-2 rounded col-md-4'
           , hint: 'Contact Name'
           , tooltip: 'Name of contact'},
        contactemail: { type: 'email'
           , label: 'Contact Email *'
           , rules: [rules.requiredEmail, rules.validEmail]
           , prependInnerIcon:"mdi-email"
           , solo:true
           , col: { cols: 12, md: 4 }
           , class:'xtitle pa-2 rounded col-md-4'
           , ripple:{ center:true, class: 'item blue--text' }
           , tooltip: "Please enter a valid email address."
           , hint:'contact email'},
        contactno: { type: 'tel'
           , label: 'Contact Number'
           , prependInnerIcon:"mdi-phone"
           , solo:true
           , col: { cols: 12, md: 4 }
           , class:'xtitle pa-2 rounded col-md-4'
           , ripple:{ center:true, class: 'item blue--text' }
           , tooltip: "Please enter your contact number."
           , hint:'Contact number'},
         }},
         group4:{
             type: "wrap",
             title:"SETUP",
             label: "Group 4",
             ripple:false,
             col: { cols : 12},
             class: "title pa-2 rounded elevation-4",
             schema:{
           setupdate: {  "type": "text"
           , "ext": "date"
           , label: 'Setup Date *'
           , prependInnerIcon:"mdi-calendar-today"
           , xsolo:true
           , rules: [ required('Please enter a date') ]
           , col: { cols : 12, md: 4 }
           , class:'title pa-2 rounded'
           , hint: 'Please enter a setup date!'},
            setupstarttime: {  "type": "text"
           , "ext": "time"
           , label: `Setup Start Time`
           , prependInnerIcon:"mdi-timeline-clock"
           , xsolo:true
           , rules: [ required('Please enter estimate time') ]
           , col: { cols : 12, md: 4 }
           , class:'title pa-2 rounded'
           , hint: 'Please enter a setup start time!'},
            setupendtime: {  "type": "text"
           , "ext": "time"
           , label: `Setup End Time`
           , prependInnerIcon:"mdi-timeline-clock"
           , xsolo:true
           , rules: [ required('Please enter estimate time') ]
           , col: { cols : 12, md: 4 }
           , class:'title pa-2 rounded'
           , hint: 'Please enter a setup END time!'},
         }},
         group5:{ type: "wrap",      title:"FUNCTION",               label: "Group 5",
             col: { cols : 12},      class: "title pa-2 rounded elevation-4",
             subtitle:"Arrival, Start, End, Guest Leave Times",
             ripple:false,
             schema:{
           guestarrivaltime: {  "type": "text"
           , "ext": "time"
           , label: `Guest Arrival Time`
           , prependInnerIcon:"mdi-timeline-clock"
           , xsolo:true
           , rules: [ required('Please enter estimate time of guest arrival') ]
           , col: { cols : 12, md: 4 }
           , class:'title pa-2 rounded'
           , hint: 'Please enter a time!'},
           functionstarttime: {  "type": "text"
           , "ext": "time"
           , label: `Function Start Time`
           , prependInnerIcon:"mdi-timeline-clock"
           , xsolo:true
           , rules: [ required('Please enter estimate') ]
           , col: { cols : 12, md: 4 }
           , class:'title pa-2 rounded'
           , hint: 'Please enter a time when function will start!'},
           functionendtime: {  "type": "text"
           , "ext": "time"
           , label: `Function Finish Time`
           , prependInnerIcon:"mdi-timeline-clock"
           , xsolo:true
           , rules: [ required('Please enter estimate') ]
           , col: { cols : 12, md: 4 }
           , class:'title pa-2 rounded'
           , hint: 'Please enter a time when function will end!'
           },
           functiondeparturetime: {  "type": "text"
           , "ext": "time"
           , label: `Departure Time`
           , prependInnerIcon:"mdi-timeline-clock"
           , xsolo:true
           , rules: [ required('Please enter estimate') ]
           , col: { cols : 12, md: 4 }
           , class:'title pa-2 rounded'
           , hint: 'Please enter time when guests all went away!'},
         }},
         group6:{ type: "wrap",      title:"CLEAN-UP",               label: "Group 6",
             col: { cols : 12},      class: "title pa-2 rounded elevation-4",
             ripple:false,
             schema:{
           cleanupdate: {  "type": "text"
           , "ext": "date"
           , label: `Cleanup Date`
           , xprependInnerIcon:"mdi-timeline-clock"
           , xsolo:true
           , rules: [ required('Please enter date of cleanup') ]
           , col: { cols : 12, md: 4 }
           , class:'title pa-2 rounded'},
           cleanupstarttime: {  "type": "text"
           , "ext": "time"
           , label: `Cleanup Start Time`
           , xprependInnerIcon:"mdi-timeline-clock"
           , rules: [ required('Please enter estimate start time') ]
           , col: { cols : 12, md: 4 }
           , class:'title pa-2 rounded'},
           cleaunupendtime: {  "type": "text"
           , "ext": "time"
           , label: `Cleaunup Finish Time`
           , xprependInnerIcon:"mdi-timeline-clock"
           , rules: [ required('Please enter estimate') ]
           , col: { cols : 12, md: 4 }
           , class:'title pa-2 rounded'
           , hint: 'Please enter a time to end cleanup!'},
         }},
         group7:{ type: "wrap",      title:"EVENT TYPE",               label: "Group 7",
             col: { cols : 12},      class: "title pa-2 rounded elevation-4",ripple:false,
             schema:{
           eventtype: { type: 'radio'
           , label: ''
           , prependInnerIcon:"mdi-marker-check"
           , xsolo:true
           , col: { cols: 12, md: 12 }
           , row: true
           , class:'caption d-flex pa-4 ma-4'
           , xripple:{ center:true, class: 'item blue--text' }
           , options: ["BREAKFAST","LUNCH","DINNER","COCKTAIL","REFRESHMENTS ONLY","BARBEQUE","PRESENTATION","MEETING","CONFERENCE"]
           , hint:'Is it a Braai or a Breakfast?'},
         }},
         group8:{ type: "wrap",      title:"ITEMS REQUIRED",               label: "Group 8",
             col: { cols : 12},      class: "title pa-2 rounded elevation-4",
             ripple:false,
             schema:{
                 group8a:{ type: "wrap",      subtitle:"FURNITURE",               label: "Group 8a",
                 col: { cols : 12},      class: "title pa-2 rounded elevation-4",
                 ripple:false,
                 schema:{
                     chairs: { type: 'text', ext: 'number',
                               label: `Chairs Needed`
                              , prependInnerIcon:"mdi-table-chair"
                              , col: { cols : 12, md: 4 } , class:'title pa-2 rounded'
                             , tooltip: 'How many chairs do you need?'
                             , hint: 'Chairs Needed'},
                     tablerect: { type: 'text', ext: 'number',
                               label: `Rectangular Tables`
                              , prependInnerIcon:"mdi-rectangle-outline"
                              , col: { cols : 12, md: 4 } , class:'title pa-2 rounded'
                             , tooltip: 'How many rectangular tables?'},
                     tableround: { type: 'text', ext: 'number',
                               label: `Round Tables`
                              , prependInnerIcon:"mdi-circle-outline"
                              , col: { cols : 12, md: 4 } , class:'title pa-2 rounded'
                             , tooltip: 'How many round tables?'},
                     tablelinenroundblack: { type: 'text', ext: 'number',
                               label: `Black Round Tablecloths`
                             , prependInnerIcon:"mdi-circle"
                              , col: { cols : 12, md: 4 } , class:'title pa-2 rounded'
                              , hint: 'How many round black table cloths?'},
                     tablelinenroundwhite: { type: 'text', ext: 'number',
                               label: `White Round Tablecloths`
                              , prependInnerIcon:"mdi-circle"
                              , col: { cols : 12, md: 4 } , class:'title pa-2 rounded'
                              , hint: 'How many white round table cloths?'},
                     tablelinenrectangularblack: { type: 'text', ext: 'number',
                               label: `Black Rectangular Tablecloths`
                              , prependInnerIcon:"mdi-rectangle"
                              , col: { cols : 12, md: 4 } , class:'title pa-2 rounded'
                              , hint: 'How many rectangular black table cloths'
                            },
                     tablelinenrectangularwhite: { type: 'text', ext: 'number',
                               label: `White Rectangular Tablecloths`
                              , prependInnerIcon:"mdi-rectangle"
                              , col: { cols : 12, md: 4 } , class:'title pa-2 rounded'
                              , hint: 'How many rectangular WHITE table cloths'},
                     podium: { type: 'select'
                     , label: 'Podium'
                     , prependInnerIcon:"mdi-podium-gold" //lectern
                     , col: { cols: 12, md: 4 }
                     , row: true
                     , class:'caption d-flex py-3 ma-4'
                     , items: ["YES","NO"]
                     , hint:'Is it a Podium type event?'},
                     registrationtable: { type: 'select'
                     , label: 'Registration Table'
                     , prependInnerIcon:"mdi-ticket-outline"
                     , col: { cols: 12, md: 4 }
                     , row: true
                     , class:'caption d-flex py-3 ma-4'
                     , items: ["YES","NO"]
                     , hint:'Will you need a registration table?'},
                     registrationtables: { type: 'text', ext: 'number',
                               label: `Amount of Registration Tables`
                             , col: { cols : 12, md: 4 } , class:'title pa-2 rounded'
                             , hint: 'How many registration tables?'},
                     chairsperregistrationtable: { type: 'text', ext: 'number',
                               label: `Amount of Chairs at each table`
                              , col: { cols : 12, md: 4 } , class:'title pa-2 rounded'
                             , hint: 'How many people at a registration tables will need to sit?'},

                 }},
                 group8c:{ type: "wrap",      subtitle:"GLASSWARE",               label: "Group 8c",
                 col: { cols : 12},      class: "title pa-2 rounded elevation-4",
                 ripple:false,
                 schema:{
                     glasseschampagne: { type: 'text', ext: 'number',
                               label: `Champagne Glasses`
                             , prependInnerIcon: "mdi-glass-flute"
                             , col: { cols : 12, md: 4 } , class:'title pa-2 rounded'
                             , hint: 'How many champagne glasses?'},
                     glasseswine: { type: 'text', ext: 'number',
                               label: `Wine Glasses`
                             , prependInnerIcon: "mdi-glass-wine"
                             , col: { cols : 12, md: 4 } , class:'title pa-2 rounded'
                             , hint: 'How many wine glasses?'},
                     glassescooldrinktall: { type: 'text', ext: 'number',
                               label: `Tall Cooldrink Glasses`
                             , prependInnerIcon: "mdi-glass-pint-outline"
                             , col: { cols : 12, md: 4 } , class:'title pa-2 rounded'
                             , hint: 'How many tall glasses?'},
                     glassescooldrinktumble: { type: 'text', ext: 'number',
                               label: `Tumbler Cooldrink Glasses`
                               , prependInnerIcon: "mdi-cup"
                             , col: { cols : 12, md: 4 } , class:'title pa-2 rounded'
                             , hint: 'How many short glasses?'},

                 }},
                 group8d:{ type: "wrap",      title:"CROCKERY",               label: "Group 8d",
                 col: { cols : 12},      class: "title pa-2 rounded elevation-4",ripple:false,
                 schema:{
                     crockcup: { type: 'text', ext: 'number',
                               label: `Cups`, prependInnerIcon: "mdi-glass-mug"
                             , col: { cols : 12, md: 4 } , class:'title pa-2 rounded'
                             , hint: 'How many  cups?'                        },
                     crocksources: { type: 'text', ext: 'number',
                               label: `How many sources`, prependInnerIcon: "mdi-soy-sauce"
                             , col: { cols : 12, md: 4 } , class:'title pa-2 rounded'
                             , hint: ''                        },
                     crockteapot: { type: 'text', ext: 'number',
                               label: `Teapots`, prependInnerIcon: "mdi-kettle-steam"
                             , col: { cols : 12, md: 4 } , class:'title pa-2 rounded'
                             , hint: ''                        },
                     crockcoffeepot: { type: 'text', ext: 'number',
                               label: `Coffe Pots` , prependInnerIcon: "mdi-kettle-steam-outline"
                             , col: { cols : 12, md: 4 } , class:'title pa-2 rounded'
                             , hint: ''                        },
                     crocksugarbowl: { type: 'text', ext: 'number',
                               label: `Sugar Bowls` , prependInnerIcon: "mdi-bowl-mix"
                             , col: { cols : 12, md: 4 } , class:'title pa-2 rounded'
                             , hint: ''                       },
                     crockmilkjug: { type: 'text', ext: 'number',
                               label: `Milk Jugs`, prependInnerIcon: "mdi-cup-water"
                             , col: { cols : 12, md: 4 } , class:'title pa-2 rounded'
                             , hint: ''                        },
                     crockwaterjug: { type: 'text', ext: 'number',
                               label: `Water Jugs` , prependInnerIcon: "mdi-cup-water"
                             , col: { cols : 12, md: 4 } , class:'title pa-2 rounded'
                             , hint: ''                        },
                     crockicebucket: { type: 'text', ext: 'number',
                               label: `Ice Bucket` , prependInnerIcon: "mdi-delete-variant"
                             , col: { cols : 12, md: 4 } , class:'title pa-2 rounded'
                             , hint: ''                        },
                     crocksmallplate: { type: 'text', ext: 'number',
                               label: `Plates (Small)` , prependInnerIcon: "mdi-circle-medium"
                             , col: { cols : 12, md: 4 } , class:'title pa-2 rounded'
                             , hint: ''                        },
                     crocklargeplate: { type: 'text', ext: 'number',
                               label: `Plates (Large)` , prependInnerIcon: "mdi-circle-outline"
                             , col: { cols : 12, md: 4 } , class:'title pa-2 rounded'
                             , hint: ''                        },
                     crockservingplate: { type: 'text', ext: 'number',
                               label: `Plates (Serving)` , prependInnerIcon: "mdi-circle"
                             , col: { cols : 12, md: 4 } , class:'title pa-2 rounded'
                             , hint: ''                        },
                 }},
                 group8e:{ type: "wrap",      title:"CUTLERY",               label: "Group 8e",
                 col: { cols : 12},      class: "title pa-2 rounded elevation-4",
                 ripple:false,
                 schema:{
                     cutleryknives: { type: 'text', ext: 'number',
                               label: `Knives`, prependInnerIcon: "mdi-knife"
                             , col: { cols : 12, md: 4 } , class:'title pa-2 rounded'
                             , hint: ''                        },
                     cutleryforks: { type: 'text', ext: 'number',
                               label: `Forks`, prependInnerIcon: "mdi-silverware-fork"
                             , col: { cols : 12, md: 4 } , class:'title pa-2 rounded'
                             , hint: ''                        },
                     cutleryspoons: { type: 'text', ext: 'number',
                               label: `Spoons`, prependInnerIcon: "mdi-silverware-spoon"
                             , col: { cols : 12, md: 4 } , class:'title pa-2 rounded'
                             , hint: ''                        },
                     cutleryteaspoons: { type: 'text', ext: 'number',
                               label: `Tea Spoons`, prependInnerIcon: "mdi-silverware-spoon"
                             , col: { cols : 12, md: 4 } , class:'title pa-2 rounded'
                             , hint: ''                        },
                     cutleryservingspoons: { type: 'text', ext: 'number',
                               label: `Serving Spoons`, prependInnerIcon: "mdi-silverware-spoon"
                             , col: { cols : 12, md: 4 } , class:'title pa-2 rounded'
                             , hint: ''                        },
                     cutleryicetongs: { type: 'text', ext: 'number',
                               label: `Ice Tongs`, prependInnerIcon: "mdi-ice-pop"
                             , col: { cols : 12, md: 4 } , class:'title pa-2 rounded'
                             , hint: ''                        },
                 }},
                 group8f:{ type: "wrap",      title:"OTHER",               label: "Group 8f",
                 col: { cols : 12},      class: "title pa-2 rounded elevation-4",ripple:false,
                 schema:{
                     oitemsurn: { type: 'text', ext: 'number',
                               label: `Urn(s)`, prependInnerIcon: "mdi-kettle-outline"
                             , col: { cols : 12, md: 4 } , class:'title pa-2 rounded'
                             , hint: ''                        },
                     oitemshottray: { type: 'text', ext: 'number',
                               label: `Hot Trays`, prependInnerIcon: "mdi-chili-hot"
                             , col: { cols : 12, md: 4 } , class:'title pa-2 rounded'
                             , hint: ''                        },
                     oitemsmplugs: { type: 'text', ext: 'number',
                               label: `Multi Plugs`, prependInnerIcon: "mdi-electric-switch-closed"
                             , col: { cols : 12, md: 4 } , class:'title pa-2 rounded'
                             , hint: 'How many multiplugs do you need?'                        },
                     oitemsextlead: { type: 'text', ext: 'number',
                               label: `Extension Leads`, prependInnerIcon: "mdi-electric-switch"
                             , col: { cols : 12, md: 4 } , class:'title pa-2 rounded'
                             , hint: 'Inquire about length - should work'                        }
                 }},
           }  },
group9a:{ type: "wrap",      title:"LAYOUT",               label: "Group 9a",
             col: { cols : 12},      class: "title pa-2 rounded elevation-2",ripple:false,
         schema: {
          layouttype: { type: 'select'
                     , label: 'Event Layout'
                     , prependInnerIcon: "mdi-select-group"
                     , col: { cols: 12, md: 6 }
                     , row: true
                     , required: true
                     , class: "title pa-2 rounded elevation-4"
                     , items: ["BOARDROOM STYLE (LONG TABLE)","COCKTAIL","CONFERENCE","REGTANGULAR","ROUND TABLES","SCHOOLROOM","U-SHAPE", "OTHER"]
                     , hint:'Select the type of arrangement you will need.'},
          whitescreen: { type: 'select'
                     , label: 'Whitescreen needed?'
                     , prependInnerIcon: "mdi-projector-screen-outline"
                     , col: { cols: 12, md: 6 }
                     , row: true
                     , class:'caption d-flex py-3 ma-4'
                     , items: ["YES","NO"]
                     , hint:'Do you need a white screen?'},
}},
         group10:{ type: "wrap",      title:"SOUND",               label: "Group 10",
             col: { cols : 12},      class: "title pa-2 rounded elevation-3",ripple:false,
             schema:{
          audioreq: { type: 'textarea'
                     , xxext: 'textarea'
                     , label: 'SOUND: Audio Requirements'
                     , prependInnerIcon: "mdi-speaker-bluetooth"
                     , col: { cols: 12, md: 12 }
                     , xclass:'caption d-flex py-6 ma-8'
                     , hint:'Select the type of arrangement you will need?'
                     , tooltip:'Select the type of arrangement you will need?'},

         }},
         group12:{ type: "wrap",      title:"LIGHTS",               label: "Group 12",
             col: { cols : 12},      class: "title pa-2 rounded elevation-4",
             schema:{
                     lightreq: { type: 'textarea'
                     , label: 'Light Requirements'
                     , prependInnerIcon: 'mdi-lightbulb-multiple'
                     , col: { cols: 12, md: 12 }
                     , class:'caption'
                     , hint:'Select the type of arrangement you will need?'
                     , tooltip:'Select the type of arrangement you will need?'},
         }},
         group13:{ type: "wrap",      title:"PARKING",               label: "Group 13",
             col: { cols : 12},      class: "title pa-2 rounded elevation-4",ripple:false,
             schema:{
          parkingreq: { type: 'textarea'
                     , label: 'Parking Requirements?'
                     , prependInnerIcon: 'mdi-car'
                     , col: { cols: 12, md: 12 }
                     , xclass:'caption d-flex py-6 ma-8'
                     , hint:'How many cars, where, gate access, etc..'},

         }},
         group14:{ type: "wrap",      title:"SECURITY NEEDED AT:",               label: "Group 14",
             col: { cols : 12},      class: "title pa-2 rounded elevation-4",ripple:false,
             schema:{
                  parking1: { type: 'checkbox', icon:'1',label: 'Entrance:  Main gate', col: { cols: 12, md: 3 }, hint:''},
                  parking2: { type: 'checkbox', label: 'Entrance:  Activity centre', col: { cols: 12, md: 3 }, hint:''},
                  parking3: { type: 'checkbox', label: 'Entrance:  Panorama Avenue', col: { cols: 12, md: 3 }, hint:''},
                  parking4: { type: 'text' , label: 'Other', col: { cols: 12, md: 3 }, hint:''},
                  securitystarttime: {  "type": "text" , "ext": "time"
                     , label: `Time From`, prependInnerIcon:"mdi-timeline-clock"
                     , col: { cols : 12, md: 4 }
                     , class:'title pa-2 rounded'},
                  securityendtime: {  "type": "text" , "ext": "time"
                     , label: `Time To`, prependInnerIcon:"mdi-timeline-clock"
                     , col: { cols : 12, md: 4 }
                     , class:'title pa-2 rounded'},
         }},
         group15:{
             label: "Group 15",
             type: "wrap",
             title:"PERSON RESPONSIBLE FOR SETTING OF ALARM	",
             col: { cols : 12},
             class: "title pa-2 rounded elevation-4",
             ripple:false,
             schema:{
        alarmname: { type: 'text'
           , label: `Alarm Contact Name *`
           , prependInnerIcon:"mdi-account-question"
           , rules: [ required('Please enter the name of the person who will set the alarm') ]
           , col: { cols : 12, md: 4 }
           , class:'title pa-2 rounded col-md-4'
           , hint: 'Please enter person responsible for the Alarm'
           },
        alarmemail: { type: 'email'
           , label: 'Alarm Email *'
           , rules: [rules.requiredEmail, rules.validEmail]
           , prependInnerIcon:"mdi-email"
           , col: { cols: 12, md: 4 }
           , class:'pa-2 rounded col-md-4'
           , tooltip: "Please enter a valid email address."
           , hint:'email needed here'
           },
        alarmno: { type: 'tel'
           , label: 'Alarm Cellphone'
           , rules: [ required('Please enter the contact number of the person who will set the alarm') ]
           , prependInnerIcon:"mdi-phone"
           , col: { cols: 12, md: 4 }
           , class:'pa-2 rounded col-md-4'
           , tooltip: "Please enter contact number."
           , hint:'Please enter cellphone number for person responsible for the Alarm'
           },
         }},
         group16:{
             label: "Group 16",
             type: "wrap",
             title:"PERSON RESPONSIBLE FOR UNLOCKING VENUE",
             col: { cols : 12},
             class: "title pa-2 rounded elevation-4",
             ripple:false,
             schema:{
        unlockvenuename: { type: 'text'
           , label: `Unlocker Contact Name *`
           , prependInnerIcon:"mdi-account"
           , rules: [ required('Please enter the name of the person who will set the alarm') ]
           , col: { cols : 12, md: 4 }
           , class:'title pa-2 rounded col-md-4'
           , hint: 'Please enter person responsible for unlocking the venue'
           },
        unlockvenueemail: { type: 'email'
           , label: 'Unlocker Email *'
           , rules: [rules.requiredEmail, rules.validEmail]
           , prependInnerIcon:"mdi-email"
           , col: { cols: 12, md: 4 }
           , class:'pa-2 rounded col-md-4'
           , tooltip: "Please enter a valid email address."
           , hint:'email needed here'
           },
        unlockvenueno: { type: 'tel'
           , label: 'Unlocker Cellphone'
           , rules: [ required('Please enter the contact number of the person who will unlock the venue') ]
           , prependInnerIcon:"mdi-phone"
           , col: { cols: 12, md: 4 }
           , class:'pa-2 rounded col-md-4'
           , tooltip: "Please enter contact number."
           , hint:'Please enter cellphone number for person responsible for unlocking of the venue'
           },
         }},
         group17:{
             label: "Group 17",
             type: "wrap",
             title:"PERSON RESPONSIBLE FOR LOCKING OF VENUE",
             col: { cols : 12},
             class: "title pa-2 rounded elevation-4",
             ripple:false,
             schema:{
        lockvenuename: { type: 'text'
           , label: `Lockup Contact Name *`
           , prependInnerIcon:"mdi-account-question-outline"
           , rules: [ required('Please enter the name of the person who will set the alarm') ]
           , col: { cols : 12, md: 4 }
           , class:'title pa-2 rounded col-md-4'
           , hint: 'Please enter person responsible for locking the venue'
           },
        lockvenueemail: { type: 'email'
           , label: 'Lockup Email *'
           , rules: [rules.requiredEmail, rules.validEmail]
           , prependInnerIcon:"mdi-email"
           , col: { cols: 12, md: 4 }
           , class:'pa-2 rounded col-md-4'
           , tooltip: "Please enter a valid email address."
           , hint:'email needed here'
           },
        lockvenueno: { type: 'tel'
           , label: 'Lockup Cellphone'
           , rules: [ required('Please enter the contact number of the person who will unlock the venue') ]
           , prependInnerIcon:"mdi-phone"
           , col: { cols: 12, md: 4 }
           , class:'pa-2 rounded col-md-4'
           , tooltip: "Please enter contact number."
           , hint:'Please enter cellphone number for person responsible for locking of the venue'
           },
         }},
         group18:{
             label: "Group 18", type: "wrap", title:"OTHER VENDORS",
             col: { cols : 12},class: "title pa-2 rounded elevation-2",ripple:false,
             schema:{
        othervendorname1: { type: 'text'
           , label: `Other Vendor 1 Contact Name`
           , prependInnerIcon:"mdi-hand-extended-outline", col: { cols : 12, md: 4 }, class:'title pa-2 rounded'
           , hint: 'Other vendor on site contact name'},
        othervendoremail1: { type: 'email'
           , label: `Vendor 1 Email`
           , prependInnerIcon:"mdi-email", col: { cols: 12, md: 4 }, class:'pa-2 rounded'},
        othervendorno1: { type: 'tel'
           , label: 'Vendor 1 Phone'
           , prependInnerIcon:"mdi-phone", col: { cols: 12, md: 4 }, class:'pa-2 rounded'},
        othervendorname2: { type: 'text'
           , label: `Vendor 2 Contact Name`
           , prependInnerIcon:"mdi-hand-extended-outline", col: { cols : 12, md: 4 }, class:'title pa-2 rounded'
           , hint: 'Other vendor on site contact name'},
        othervendoremail2: { type: 'email'
           , label: `Vendor 2 Email`
           , prependInnerIcon:"mdi-email", col: { cols: 12, md: 4 }, class:'pa-2 rounded'},
        othervendorno2: { type: 'tel'
           , label: 'Vendor 2 Phone'
           , prependInnerIcon:"mdi-phone", col: { cols: 12, md: 4 }, class:'pa-2 rounded'},
        othervendorname3: { type: 'text'
           , label: `Vendor 3 Contact Name`
           , prependInnerIcon:"mdi-hand-extended-outline", col: { cols : 12, md: 4 }, class:'title pa-2 rounded'
           , hint: 'Other vendor on site contact name'},
        othervendoremail3: { type: 'email'
           , label: `Vendor 3 Email`
           , prependInnerIcon:"mdi-email", col: { cols: 12, md: 4 }, class:'pa-2 rounded'},
        othervendorno3: { type: 'tel'
           , label: 'Vendor 3 Phone'
           , prependInnerIcon:"mdi-phone", col: { cols: 12, md: 4 }, class:'pa-2 rounded'},

         }},

     }}
    },
    last:'last',

}

function doneFetch (response) {
    //console.log('doneLoading:', response)
    if ( response.error ) {
        errorSnackbar(response.error)
    } else {
        infoSnackbar('We saved your data, will email it as well')
    }
}

function errorFetch (response) {
    console.log('error:', response)
    errorSnackbar('We had an error saving your data!' + response)
}