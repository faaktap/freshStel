// eslint-disable-next-line
// https://wotamann.gitbook.io/vuetify-form-base/input-and-controls-1/selection
export const userListModel = {
    ulModel : {
      first:null,
      last:null,
      times:null,
      user_cell:null,
      user_email:null,
      user_fullname:null,
      user_grade:null,
      user_name:null,
      user_type:null,
      userid:null,
      logItems:null
    },
    ulSchema: {
        top: { type:'wrap'
        , label:'top'
        , col : { "cols": 12,  "lg":12, "xs": 12 }
        , ripple:false
        , color:"white"
        , class:'title pa-2 rounded elevation-4 col-md-12'
        , schema:{
          user_name: { type: 'text'
              , label: 'Your UserName'
              , prependInnerIcon:"mdi-login"
              , col: { cols: 12, md: 6 }
              , readonly:true
              , class:'pa-2 rounded'
              , ripple:{ center:true, class: 'item blue--text' }
              , tooltip: "Please enter your email address."
              , hint:'email'
           },
           user_email: { type: 'email'
              , label: 'Your Email'
              , prependInnerIcon:"mdi-email"
              , col: { cols: 12, md: 6 }
              , class:'pa-2 rounded col-md-6'
              , ripple:{ center:true, class: 'item blue--text' }
              , tooltip: "Please enter your email address."
              , hint:'email'
           },
           user_fullname: { type: 'text'
              , label: 'Fullname'
              , prependInnerIcon:"mdi-identifier"
              , col: { cols : 12, md: 6 }
              , class:'title pa-2 rounded'
            },
            user_cell: { type: 'text'
              , label: 'Your Cellphone Number'
              , prependInnerIcon:"mdi-phone"
              , col: { cols: 12, md: 6 }
              , class:'pa-2 rounded'
              , ripple:{ center:true, class: 'item blue--text' }
              , tooltip: "Please enter your email address."
              , hint:'email'
            },
            user_grade: { type: 'text'
              , label: 'Grade'
              , prependInnerIcon:"mdi-decagram"
              , col: { cols: 6, md: 4 }
              , class:'pa-2 rounded'
              , solo:true
              , ripple:{ center:true, class: 'item blue--text' }
              , readonly:true
            },
            user_type: { type: 'text'
              , label: 'Position'
              , prependInnerIcon:"mdi-typewriter"
              , col: { cols: 6, md: 4 }
              , class:'pa-2 rounded'
              , solo:true
              , ripple:{ center:true, class: 'item blue--text' }
              , readonly:true
            },
            times: { type: 'text'
              , label: 'User Type'
              , prependInnerIcon:"mdi-web-clock"
              , col: { cols: 6, md: 4 }
              , class:'pa-2 rounded'
              , solo:true
              , ripple:{ center:true, class: 'item blue--text' }
              , readonly:true
            },
            first: {
               type: 'text'
             , label: 'Start Date'
             , prependInnerIcon:"mdi-calendar-today"
             , readonly:true
             , solo:true
             , col: { cols : 6, md: 6 }
             , class:'title pa-2 rounded col-md-6'
             , tooltip: 'When you used system for the first time'
            },
            last: {
              type: 'text'
            , label: 'Last Date'
            , prependInnerIcon:"mdi-calendar-today"
            , readonly:true
            , solo:true
            , col: { cols : 6, md: 6 }
            , class:'title pa-2 rounded col-md-6'
            , tooltip: 'Last time you used the system'
           },
           logItems: {
               type: "list"
             , label: "Log Items"
             , col: { cols : 12, md: 12 }
             , color: "blue"
             , dense: true
             , readonly:true
             , icon:"mdi-file"
             , item:"logLine"
             , value:"logLine"
             , class: "pa-2 rounded elevation-4"
           },
          //  btnLoadLog: {
          //    type: "btn",
          //    label: "clickme",
          //    iconRight: 'mdi-spider'
          //  }
         }
        },
    }

}

