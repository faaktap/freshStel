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
    assignModel: function(data)  {
      console.log('hasss', data) 
      this.myModel.email = 'woeps'
      this.myModel.name = 'waps'
    },
    myModel : {
        email:null,
        name:null,
        optout:null
  
    },
    mySchema: {
        top: { type:'wrap'
        , label:'top'
        , col : { "cols": 12,  "lg":12, "xs": 12 }
        , ripple:false
        , color:"white"
        , class:'title pa-2 rounded elevation-4 col-md-12'
        , schema:{
           email: { type: 'email'
              , label: 'Parent/Guardian Email'
              , rules: [rules.requiredEmail, rules.validEmail]
              , prependInnerIcon:"mdi-email"
              , solo:true
              , col: { cols: 12, md: 6 } 
              , class:'xtitle pa-2 rounded col-md-6'
              , ripple:{ center:true, class: 'item blue--text' }
              , tooltip: "Please enter a parent or guardian email address."
              , hint:'email'
           },
           name: { type: 'text'
              , label: 'Name / Naam *'
              , prependInnerIcon:"mdi-account-question-outline"
              , solo:true
              , rules: [ required('Please enter name linked to email') ]
              , col: { cols : 12, md: 6 } 
              , class:'title pa-2 rounded col-md-6'
              , tooltip: 'Parent or Guardian Name / Ouer of Voog se Naam' 
              , hint: 'name linked to this Email'
            },      
            optout: { 
                type:'radio',
                col: { cols : 12, md: 6 },
                solo:true,
                options:[
                  { value: 1, label: 'Removed by Phoning - via helpdesk at School' },
                  { value: 2, label: 'Removed by User - via unsubscribe function' },
                  { value: 3, label: 'Removed by Sender - problem sending email' },
                  { value: 'Active', label: 'Active' },
                ]
            },            
    
            // changedate: {
            //    type: 'text'
            //  , label: 'Changed Date'
            //  , prependInnerIcon:"mdi-calendar-today"
            //  , readonly:true
            //  , col: { cols : 12, md: 6 } 
            //  , class:'title pa-2 rounded col-md-6'
            //  , tooltip: 'Date user opted out.' 
            //  , hint: 'Date status was changed'
            // },      
                      

         }
        }        
    }
}


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