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

export const subscriberModel = {
    assignSubModel: function(data)  {
      console.log('hasss', data) 
      this.subModel.email = 'woeps'
      this.subModel.name = 'waps'
    },
    createASqlSetStatement(before,after) {
      //This can be used to build a string for update, but we had some problems..
       let updateString = ''
       for (let i = 0, keys = Object.keys(before); i < keys.length; i++) {
         const property = keys[i]
         if (before[property] != after[property]) {
           if (property == 'optout') {  //another edge case - if we use correct propertnames, this not needed
             updateString += updateString ? ` and outid = "${after[property]}"`:` outid = "${after[property]}"` 
           } else {
            updateString += updateString ? ` and ${property} = "${after[property]}"`:`${property} = "${after[property]}"`
          }
         }
       }
       return updateString
    },
    subModel : {
        email:null,
        name:null,
        optout:null
    },
    subModelInsert : {
      email:null,
      name:null,
      impnumber:null,
      extra:null,
      groups:[]
  },
    subSchema:{ 
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
/*            subid: { type: 'text'
            , label: 'Subscriber ID'
            , prependInnerIcon:"mdi-id-card"
            , solo:true
            , readonly:true
            , col: { cols : 12, md: 6 } 
            , class:'title pa-2 rounded col-md-6'
            },
            grade: { type: 'text'
            , label: 'Grade'
            , prependInnerIcon:"mdi-google-classroom"
            , solo:true
            , readonly:true
            , col: { cols : 12, md: 6 } 
            , class:'title pa-2 rounded col-md-6'
            },            */
            grpname: { type: 'text'
            , label: 'Group Name'
            , prependInnerIcon:"mdi-label"
            , readonly:true
            , filled:true
            , col: { cols : 12, md: 6 } 
            , class:'title pa-2 rounded col-md-6'
            , hint:'Email Group'
            },            
            optout: { 
                type:'radio',
                col: { cols : 12, md: 6 },
                solo:true,
                options:[
                  { value: "1", label: 'Removed by Phoning - via helpdesk at School' },
                  { value: "2", label: 'Removed by User - via unsubscribe function' , disabled:true},
                  { value: "3", label: 'Removed by Sender - problem sending email' },
                  { value: "0" , label: 'Active' },
                  //values is finicky about being strings or number "0" not same as 0
                ]
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
           groups: {
            type: "list",
            label: "Email Groups - please select only one",
            icon: "mdi-group",
            multiple: true,
            item:"grpname",
            value:"grpid",
            model: [],
            color: "blue lighten-1",
            offset: 1,
            col: { cols : 10 }, 
            tooltip: 'Select the groups our subscriber belongs to' ,
            hint: 'You can select more than one'
           }, 

         }
        },
      },
      nextProperty:{

      }
}