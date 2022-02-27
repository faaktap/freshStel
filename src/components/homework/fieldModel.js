// const required = ( msg ) => v => !!v || msg
// const minLen = l => v => (v && v.length >= l) || `min. ${l} Characters`
// const maxLen = l => v => (v && v.length <= l) || `max. ${l} Characters`
const requiredArray = ( msg ) => v => (Array.isArray(v) && v.length>1) || msg
 // eslint-disable-next-line
const rules = {
  requiredSelMult: requiredArray('2 Selections are required'),
}

export const fieldModel = {
    assignModel: function(data)  {
      this.model.listString = data
    },
    model : {
        listString: ["txtField","numberField"]
    },
    modelInsert : {

   },
    schema:{
        top: { type:'wrap'
        , label:'top'
        , col : { "cols": 12,  "lg":12, "xs": 12 }
        , ripple:false
        , color:"white"
        , class:'title pa-2 rounded elevation-4 col-md-12'
        , schema:{
            "listString": {
                "type": "list",
                "label": "Field List",
                "prependInnerIcon": "mdi-label",
                "multiple": true,
                "model": [],
                "color": "green",
                "offset": 1,
                "col": 5,
                "dense": true,
                 class:'title pa-2 rounded col-md-6',
                 hint:'Field Group'
             },
             Add: {
                "type": "btn",
                "label": "Add",
                "dark": false,
                "color": "blue",
                "class": "mb-1",
                "col": 2
             },
         }
        },
      },
      subSchemaInsert:{
        top: { type:'wrap'
        , label:'top'
        , col : { "cols": 12,  "lg":12, "xs": 12 }
        , ripple:false
        , color:"white"
        , class:'title pa-2 rounded elevation-4 col-md-12'
        , schema:{
           groups: {
            type: "list",
            label: "Fields associated with this list",
            prependicon: "mdi-group",
            multiple: true,
            item:"grpname",
            value:"grpid",
            model: [],
            color: "blue lighten-1",
            offset: 1,
            col: { cols : 10 },
            tooltip: 'Select the field for this list' ,
            hint: 'You can select more than one'
           },

         }
        },
      },
      nextProperty:{

      }
}