import { rules } from '@/api/rules.js'
const icons = ['mdi-microsoft-word','mdi-microsoft-excel',
              ,'mdi-microsoft-powerpoint','mdi-microsoft-teams','mdi-microsoft-office','mdi-microsoft-internet-explorer',
              ,'mdi-google-chrome','mdi-rugby', 'mdi-vector-difference'
              ,'mdi-microsoft-outlook','mdi-microsoft-windows','mdi-account-school'
              ,'mdi-school','mdi-kettle','mdi-brain',"mdi-email","mdi-palette","mdi-phone","mdi-timer","mdi-adjust",'mdi-wiper',"mdi-calendar"
              ,'mdi-alien','mdi-emoticon-cool-outline','mdi-emoticon-angry','mdi-emoticon-confused','mdi-emoticon-devil','mdi-emoticon-happy']

export const faqSchema = {
      faqGroup:
      {  type: "wrap"
       , col: { cols : 12}
       , ripple:false
       , class: "ma-1 pa-2",
       schema:
        { dummy1:  { type: 'head', title:'FAQ Information', col:12}
        , name:    { type: 'text'
                   , label: 'Question'
                   , rules: [rules.required('Please enter a frequently asked question')]
                   , outlined: true
                   , ripple:true
                   , col:{cols:12, md:6}
                   , class:"ma-2 pa-2"
                   }
        , faqOriginator:
                   { type: 'text'
                   , label: 'Questioner (You)', hint: ''
                   , col: {cols:12, md:6}
                   , class: "ma-2 pa-2"
                   , outlined:true
                   }
        , faqIcon: { type: 'autocomplete'
                   , label: 'Icon', hint: ''
                   , items: icons
                   , col: {cols:12, md:3}
                   , class: "ma-2 pa-2"
                   , outlined:true
                   }
        , faqAnswer: { type: 'textarea'
                     , label: 'Notes', hint: ''
                     , col: {cols:12, md:9}
                     , class:"ma-2 pa-2"
                     , outlined:true
                    }
       }
     }
}

export default { faqSchema }
