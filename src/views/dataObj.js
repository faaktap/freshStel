const listStatus = ['WAIT', 'BUSY', 'DONE', 'READY']
export const dataObj = {
    someGlobals:  'hallo',
    loadingCache: false,
    loadingReal: false,
    closeDate: null,
    tickList: { id:1
         , action:''
         , desc: "Tick List"
         , workDone: 0
         , progress: false
         , search: ''
         , status: (wd) => { return listStatus[wd]}
         , response: []
         , processor: (action,element) => {this.doSomething(action,element)}
         , actions: ['refresh','update','insert','delete']
         , sql:[ {action: 'refresh', sql: `SELECT * from dkhs_tickjdoc`}
               , {action: 'update', sql: `update dkhs_tickjdoc set jdocstructure = :jdocstructure, name = :name where id = :id`}
               , {action: 'insert', sql: `insert into dkhs_tickjdoc values(null, :name, :jdocstructure )`}
               , {action: 'delete', sql: `delete from dkhs_tickjdoc where id = :id`}
               ]
         , keyFields: ["id"]
         , fields: [{ value: "id", text: "id", type: "text", ext: "date", prependInnerIcon:'mdi-card', edit:false}
                   ,{ value: "name", text: "name", type: "text", ext: "", prependInnerIcon: 'mdi-human', edit:true}
                   ,{ value: "jdocstructure", text: "jdoc", type: 'textarea', ext: "", prependInnerIcon: 'mdi-code-json', edit:true}
                    ]
        },
        dayList: { id:2
         , action:''
         , desc: "Day List"
         , workDone: 0
         , progress: false
         , search: ''
         , status: (wd) => { return listStatus[wd]}
         , response: []
         , processor: (action,element) => {this.doSomething(action,element)}
         , actions: ['refresh','update']
         , sql:[ {action: 'refresh', sql: `SELECT * FROM dkhs_date where substr(fulldate,1,4) = year(now())\
            or substr(fulldate,1,4) = year(now() + interval 1 year)  or substr(fulldate,1,4) = year(now() - interval 1 year) ORDER BY idDate  ASC`}
               , {action: 'update', sql: "update dkhs_date set dayno = :dayno where idDate = :idDate"}
               ]
         , keyFields: ["idDate"]
         , fields: [{ value: "idDate", text: "idDate", type: "text", ext: "date", prependInnerIcon:'mdi-card', edit:false}
                   ,{ value: "dayno", text: "dayno", type: "text", ext: "", prependInnerIcon: 'mdi-viewday', edit:true}
                   ,{ value: "day_name", text: "day", type: 'text', ext: "", prependInnerIcon: 'mdi-cards-diamond', edit:false}
                   ,{ value: "month_name", text: "month_name", type: 'text', ext: "", prependInnerIcon: 'mdi-calendar-month-outline', edit:false}
                    ]
        },
        periodList: { id:3
         , action:''
         , desc: "Period List"
         , workDone: 0
         , progress: false
         , search: ''
         , status: (wd) => { return listStatus[wd]}
         , response: []
         , processor: (action,element) => {this.doSomething(action,element)}
         , actions: ['refresh', 'update', 'insert']
         , sql:[ {action: 'refresh', sql: `SELECT * FROM dkhs_dayperiod`}
               , {action: 'update', sql: "update dkhs_dayperiod set description = :description, `dow` = :dow, starttime = :starttime, endtime = :endtime, `length` = :length where id = :id"}
               //Please note - this insert statement does not want to work : get HY093 error - possibly a binding error.
               //Dit lyk asof DOW dow nie deurgetrek word nie...
               //See https://stackoverflow.com/questions/18028706/php-pdoexception-sqlstatehy093-invalid-parameter-number#18028742
               //See https://duckduckgo.com/?q=mysql+HY093+php+bind&atb=v314-1&ia=web&iax=qa
               , {action: 'insert', sql: "insert into dkhs_dayperiod (id, description, `dow`, periodname, `starttime`, `endtime`, `length`) values (null, :description, :dow, :periodname, :starttime, :endtime, :length)"}]
         , data: {test:'test'
                 ,bind:{
                       }
                  }
         , keyFields: ["id"]
         , fields: [{ value: "id", text: "idDate", type: "text", ext: "", prependInnerIcon:'mdi-card', edit:false}
                   ,{ value: "description", text: "desc", type: 'text', ext: "", prependInnerIcon: 'mdi-cards-diamond', edit:true}
                   ,{ value: "dow", text: "dow", type: "text", ext: "", prependInnerIcon: 'mdi-viewday', edit:true}
                   ,{ value: "periodname", text: "pname", type: 'text', ext: "", prependInnerIcon: 'mdi-calendar-month-outline', edit:false}
                   ,{ value: "starttime", text: "starttime", type: 'text', ext: "", prependInnerIcon: 'mdi-calendar-month-outline', edit:true}
                   ,{ value: "endtime", text: "endtime", type: 'text', ext: "", prependInnerIcon: 'mdi-calendar-month-outline', edit:true}
                   ,{ value: "length", text: "mins", type: 'text', ext: "", edit:true}
                    ]
        }
}