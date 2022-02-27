const required = ( msg ) => v => !!v || msg
const minLen = l => v => (v && v.length >= l) || `min. ${l} Characters`
const maxLen = l => v => (v && v.length <= l) || `max. ${l} Characters`
const requiredArray = ( msg ) => v => (Array.isArray(v) && v.length>1) || msg
 // eslint-disable-next-line
const rules = {
  requiredEmail: required('E-mail is required'),
  requiredSel: required('Selection is required'),
  requiredSelMult: requiredArray('2 Selections are required'),
  max12: maxLen(12),
  min6: minLen(6),
  validEmail: v => /.+@.+\..+/.test(v) || 'E-mail must be valid'
}

export const emailModel = {
    emlModel : {
      email:null,
      sentdate:null,
      subject:null,
      status:null,
      attachments:{},
    },
    emlSchema: {
        top: { type:'wrap'
        , label:'top'
        , col : { "cols": 12,  "lg":12, "xs": 12 }
        , ripple:false
        , color:"white"
        , class:'title pa-2 rounded elevation-4 col-md-12'
        , schema:{
           email: { type: 'email'
              , label: 'Parent/Guardian Email'
              , prependInnerIcon:"mdi-email"
              , solo:true
              , readonly:true
              , col: { cols: 12, md: 6 }
              , class:'xtitle pa-2 rounded col-md-6'
              , ripple:{ center:true, class: 'item blue--text' }
              , tooltip: "Parent or guardian's email address."
              , hint:'email'
           },
           subject: { type: 'text'
              , label: 'Email Subject'
              , prependInnerIcon:"mdi-text-subject"
              , solo:true
              , readonly:true
              , col: { cols : 12, md: 6 }
              , class:'title pa-2 rounded col-md-6'
              , tooltip: 'Email Subject'
            },
            sentdate: {
               type: 'text'
             , label: 'Sent Date'
             , prependInnerIcon:"mdi-calendar-today"
             , readonly:true
             , col: { cols : 12, md: 6 }
             , class:'title pa-2 rounded col-md-6'
             , tooltip: 'Date email was sent'
             , hint: 'Date email was sent'
            },
            group: {
                type: 'text'
              , label: 'Group Name'
              , prependInnerIcon:"mdi-group"
              , readonly:true
              , col: { cols : 12, md: 6 }
              , class:'title pa-2 rounded col-md-6'
              , tooltip: 'Group the email was sent to'
             },
             attachments: {
                type: "list",
                label: "Attachment List",
                col: { cols : 12, md: 6 },
                color: "blue",
                readonly:true,
                icon:"mdi-file",
                item:"humanfilename",
                value:"htmlfilepath",
                class: "pa-2 rounded elevation-4",
             },
             emailContent:{
              type: 'textarea'
            , label: 'Content'
            , prependInnerIcon:"mdi-text-box"
            , readonly:true
            , col: { cols : 12, md: 6 }
            , class:'title pa-2 rounded col-md-6'
            , tooltip: 'Part of the letter'
           },

         }
        },
    }

}

// xxxattachments: {
//     type: "file",
//     label: "Attachments",
//     showSize: true,
//     counter: true,
//     readonly:true,
//     accept: "image/*",
//     multiple: true
// },
// OptOut: {
//     type: "list",
//     label: "Email Opt Out",
//     icon: "mdi-email-off-outline",
//     item: "name",
//     model: 2,
//     color: "green",
//     backgroundcolor: "yellow",
//     col: 5,
//     activeClass : "red darken-1",
//     tooltip: 'To NOT receive email anymore, click on of these options'
// },