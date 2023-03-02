const listStatus = ['WAIT', 'BUSY', 'DONE', 'READY']
export const dataObj = {
    someGlobals:  'hallo',
    loadingCache: false,
    loadingReal: false,
    closeDate: null,
    list:
        { id:0
         , action:''
         , desc: "Tick List"
         , workDone: 0
         , status: () => { return listStatus[dataObj.list.workDone]  }
         , response: []
         , processor: (action,element) => {this.doSomething(action,element)}
         , sql:[ {action: 'refresh', sql: `SELECT * from dkhs_tickjdoc`}
               , {action: 'update', sql: `update dkhs_tickjdoc set jdocstructure = :jdocstructure, name = :name where id = :id`}
               , {action: 'insert', sql: `insert into dkhs_tickjdoc values(null, :name, :jdocstructure )`}
               ]

         , fields: [{ value: "id", text: "id", type: "text", ext: "date", prependInnerIcon:'mdi-card'}
                   ,{ value: "name", text: "name", type: "text", ext: "", prependInnerIcon: 'mdi-human'}
                   ,{ value: "jdocstructure", text: "jdoc", type: 'textarea', ext: "", prependInnerIcon: 'mdi-code-json'}
                    ]
        }
}